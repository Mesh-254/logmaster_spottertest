from rest_framework import serializers
from .models import *


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
                  'trailer_number', 'fuel_efficiency']


class TripSerializer(serializers.HyperlinkedModelSerializer):
    driver = serializers.HyperlinkedRelatedField(
        view_name='user-detail', queryset=User.objects.all())
    vehicle = serializers.HyperlinkedRelatedField(
        view_name='vehicle-detail', queryset=Vehicle.objects.all(), allow_null=True)
    pickup_location = serializers.HyperlinkedRelatedField(
        view_name='location-detail', queryset=Location.objects.all())
    dropoff_location = serializers.HyperlinkedRelatedField(
        view_name='location-detail', queryset=Location.objects.all())
    logs = serializers.HyperlinkedRelatedField(
        view_name='logsheet-detail', many=True, read_only=True)
    waypoints = serializers.HyperlinkedRelatedField(
        view_name='waypoint-detail', many=True, read_only=True)

    class Meta:
        model = Trip
        fields = ['url', 'id', 'driver', 'vehicle', 'pickup_location', 'dropoff_location', 'start_time',
                  'estimated_end_time', 'cycle_hours_used', 'distance', 'status', 'logs', 'waypoints']


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
