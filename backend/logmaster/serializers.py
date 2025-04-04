from rest_framework import serializers
from .models import *
import requests
import os
import urllib.parse
from datetime import datetime, timedelta


MAPBOX_ACCESS_TOKEN = os.getenv("MAPBOX_ACCESS_TOKEN")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'password', 'role']
        # Role defaults to "driver"
        extra_kwargs = {'role': {'read_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.HyperlinkedModelSerializer):
    cycle = serializers.HyperlinkedRelatedField(
        view_name='cycle-detail', read_only=True)
    vehicles = serializers.HyperlinkedRelatedField(
        view_name='vehicle-detail', many=True, read_only=True)
    trips = serializers.HyperlinkedRelatedField(
        view_name='trip-detail', many=True, read_only=True)

    class Meta:
        model = User
        fields = ['url', 'id', 'full_name', 'email',
                  'role', 'cycle', 'vehicles', 'trips']


class CycleSerializer(serializers.HyperlinkedModelSerializer):
    driver = serializers.HyperlinkedRelatedField(
        view_name='user-detail', queryset=User.objects.all())

    class Meta:
        model = Cycle
        fields = ['url', 'id', 'driver', 'cycle_type',
                  'total_hours_used', 'last_reset']


class LocationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Location
        fields = ['url', 'id', 'name', 'latitude', 'longitude']


class VehicleSerializer(serializers.HyperlinkedModelSerializer):
    driver = serializers.HyperlinkedRelatedField(
        view_name='user-detail', queryset=User.objects.all())

    class Meta:
        model = Vehicle
        fields = ['url', 'id', 'driver', 'truck_number',
                  'trailer_number']

    def validate_truck_number(self, value):
        """Ensure truck number is unique and formatted correctly."""
        if Vehicle.objects.filter(truck_number=value).exists():
            raise serializers.ValidationError("Truck with that number exists.")
        if not value.isalnum():  # Example check: only letters/numbers
            raise serializers.ValidationError(
                "Truck number must be alphanumeric.")
        return value

    def validate_trailer_number(self, value):
        """Ensure trailer number follows expected rules."""
        if value and not value.isalnum():  # Only check if it's provided
            raise serializers.ValidationError(
                "Trailer number must be alphanumeric.")
        return value

    def validate(self, data):
        """Cross-field validation: Ensure truck and trailer numbers are not identical."""
        if data.get("truck_number") == data.get("trailer_number"):
            raise serializers.ValidationError(
                "Truck number and trailer number cannot be the same."
            )
        return data


class TripSerializer(serializers.HyperlinkedModelSerializer):
    driver = serializers.HyperlinkedRelatedField(
        view_name='user-detail', queryset=User.objects.all())
    vehicle = serializers.HyperlinkedRelatedField(
        view_name='vehicle-detail', queryset=Vehicle.objects.all(), allow_null=True)
    logs = serializers.HyperlinkedRelatedField(
        view_name='logsheet-detail', many=True, read_only=True)

    waypoints = serializers.HyperlinkedRelatedField(
        view_name='waypoint-detail', many=True, read_only=True)

   # Allow both selecting existing locations and creating new ones
    pickup_location = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), required=False, allow_null=True)
    dropoff_location = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), required=False, allow_null=True)

    # Allow users to enter new locations by name
    pickup_address = serializers.CharField(
        write_only=True, required=False, allow_blank=True)
    dropoff_address = serializers.CharField(
        write_only=True, required=False, allow_blank=True)
    
    # Make these fields read-only
    estimated_end_time = serializers.DateTimeField(read_only=True)
    cycle_hours_used = serializers.FloatField(read_only=True)
    distance = serializers.FloatField(read_only=True)
    start_time = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Trip
        fields = ['url', 'id', 'driver', 'vehicle', 'pickup_location', 'dropoff_location', 'pickup_address', 'dropoff_address', 'start_time',
                  'estimated_end_time', 'cycle_hours_used', 'distance', 'status', 'logs', 'waypoints']

    def create(self, validated_data):

        # process locations entered by user
        pickup_address = validated_data.pop("pickup_address", None)
        dropoff_address = validated_data.pop("dropoff_address", None)

        # Process Pickup Location from existing data
        pickup = validated_data.pop("pickup_location", None)
        dropoff = validated_data.pop("dropoff_location", None)

        if not pickup_address and not pickup:
            raise serializers.ValidationError(
                {"pickup_address": "Either select an existing pickup location or enter a new one."})
        if not dropoff and not dropoff_address:
            raise serializers.ValidationError(
                {"dropoff_address": "Either select an existing dropoff location or enter a new one."})

        # Handle picku location
        if pickup_address:
            pickup = self.get_or_create_location(pickup_address)
        # Handle Dropoff Location
        if dropoff_address:
            dropoff = self.get_or_create_location(dropoff_address)

        validated_data["pickup_location"] = pickup
        validated_data["dropoff_location"] = dropoff

        # Fetch trip details from Mapbox API
        trip_details = self.get_trip_details(pickup, dropoff)
        validated_data.update(trip_details)  # Automatically update fields
        print(f'this is trip deatils:{trip_details}')

        return super().create(validated_data)

    def get_or_create_location(self, address):
        """Fetch latitude & longitude from Mapbox API and store the location if it doesn't exist"""
        coordinates = self.get_coordinates(address)
        if not coordinates:
            raise serializers.ValidationError(
                {"address": f"Invalid address: {address}"})

        location, created = Location.objects.get_or_create(
            name=address,
            defaults={"latitude": coordinates[1], "longitude": coordinates[0]}
        )
        return location

    def get_coordinates(self, address):
        """Fetch latitude & longitude from Mapbox API"""
        encoded_address = urllib.parse.quote(address)
        url = f"https://api.mapbox.com/search/geocode/v6/forward?q={encoded_address}&access_token={MAPBOX_ACCESS_TOKEN}"

        response = requests.get(url)
        if response.status_code != 200:
            raise serializers.ValidationError(
                f"Error fetching address from Mapbox: {response.status_code}")

        data = response.json()
        print("Data from Mapbox API:", data)

        if "features" in data and data["features"]:
            # [longitude, latitude]
            return data["features"][0]["geometry"]["coordinates"]
        raise serializers.ValidationError(
            f"Address not found: {address}. Please check the spelling or enter a valid address.")

    def get_trip_details(self, pickup, dropoff):
        """Fetch trip duration, distance, and calculate estimated arrival time"""
        try:
            url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{pickup.longitude},{pickup.latitude};{dropoff.longitude},{dropoff.latitude}?geometries=geojson&access_token={MAPBOX_ACCESS_TOKEN}"

            response = requests.get(url)
            if response.status_code != 200:
                raise serializers.ValidationError(
                    "Error fetching route details from Mapbox.")

            data = response.json()
            print("Data from Mapbox Directions API:", data)
            if "routes" in data and data["routes"]:
                route = data["routes"][0]
                # Trip duration in seconds
                duration_seconds = route["duration"]
                distance_meters = route["distance"]  # Distance in meters

                # Convert seconds to hours
                cycle_hours = round(duration_seconds / 3600, 2)
                # Convert meters to kilometers
                distance_km = round(distance_meters / 1000, 2)

                waypoints = []
                for waypoint in data['waypoints']:
                    waypoints.append({
                        'name': waypoint['name'],
                        'location': waypoint['location'],
                        'distance': waypoint['distance']
                    })

                print(f"Waypoints: {waypoints}")
                # Save waypoints to the database
                # for waypoint in waypoints:
                #     Waypoint.objects.create(
                #         trip=self.instance,
                #         latitude=waypoint['location'][1],
                #         longitude=waypoint['location'][0],
                #         stop_type=waypoint['name'],
                #         timestamp=datetime.now()
                #     )

                
                # Calculate the estimated end time based on the start time and duration
                estimated_end_time = None  # Default to None
                if "start_time" in self.initial_data:
                    try:
                        start_time = datetime.fromisoformat(
                            self.initial_data["start_time"])
                        estimated_end_time = start_time + \
                            timedelta(seconds=duration_seconds)
                    except ValueError:
                        raise serializers.ValidationError(
                            {"start_time": "Invalid start_time format. Use ISO format (YYYY-MM-DDTHH:MM:SS)."}
                        )

                return {
                    "cycle_hours_used": cycle_hours,
                    "distance": distance_km,
                    "estimated_end_time": estimated_end_time.isoformat() if estimated_end_time else None,
                }

            raise serializers.ValidationError(
                "Could not retrieve route information. Please check the addresses.")

        except Exception as e:
            raise serializers.ValidationError(
                {"route_error": f"Failed to get trip details: {str(e)}"})


class ELDEntrySerializer(serializers.HyperlinkedModelSerializer):
    log_sheet = serializers.HyperlinkedRelatedField(
        view_name='logsheet-detail', queryset=LogSheet.objects.all())

    class Meta:
        model = ELDEntry
        fields = ['url', 'id', 'log_sheet', 'timestamp', 'status', 'duration']


class LocationHistorySerializer(serializers.HyperlinkedModelSerializer):
    driver = serializers.HyperlinkedRelatedField(
        view_name='user-detail', queryset=User.objects.all())

    class Meta:
        model = LocationHistory
        fields = ['url', 'id', 'driver', 'latitude', 'longitude', 'timestamp']


class LogSheetSerializer(serializers.HyperlinkedModelSerializer):
    trip = serializers.HyperlinkedRelatedField(
        view_name='trip-detail', queryset=Trip.objects.all())
    entries = serializers.HyperlinkedRelatedField(
        view_name='eldentry-detail', many=True, read_only=True)

    class Meta:
        model = LogSheet
        fields = ['url', 'id', 'trip', 'date', 'total_off_duty', 'total_sleeper_berth',
                  'total_driving', 'total_on_duty', 'remarks', 'entries']


class WaypointSerializer(serializers.HyperlinkedModelSerializer):
    trip = serializers.HyperlinkedRelatedField(
        view_name='trip-detail', queryset=Trip.objects.all())

    class Meta:
        model = Waypoint
        fields = ['url', 'id', 'trip', 'latitude',
                  'longitude', 'stop_type', 'timestamp']
