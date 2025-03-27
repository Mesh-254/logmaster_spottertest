import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# ---------------------- User Model ---------------------- #


class CustomUserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("role", "driver")
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")
        return self.create_user(email, full_name, password, **extra_fields)


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(
        max_length=10,
        choices=[("driver", "Driver"), ("admin", "Admin")],
        default="driver"
    )
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    objects = CustomUserManager()

    def __str__(self):
        return self.full_name

# ---------------------- Cycle Model ---------------------- #


class Cycle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    driver = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="cycle")
    cycle_type = models.CharField(max_length=5, choices=[(
        "70-8", "70hrs/8days"), ("60-7", "60hrs/7days")], default="70-8")
    total_hours_used = models.FloatField(default=0, db_index=True)
    last_reset = models.DateTimeField(db_index=True)

    def __str__(self):
        return f"{self.driver.full_name} - {self.cycle_type}"

# ---------------------- Location Model ---------------------- #


class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True, db_index=True)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

# ---------------------- Vehicle Model ---------------------- #


class Vehicle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    driver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="vehicles")
    truck_number = models.CharField(max_length=50, unique=True, db_index=True)
    trailer_number = models.CharField(max_length=50, null=True, blank=True)
    fuel_efficiency = models.FloatField()

    def __str__(self):
        return f"{self.truck_number} - {self.driver.full_name}"

# ---------------------- Trip Model ---------------------- #


class Trip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    driver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="trips")
    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    pickup_location = models.ForeignKey(
        Location, on_delete=models.CASCADE, related_name="pickups")
    dropoff_location = models.ForeignKey(
        Location, on_delete=models.CASCADE, related_name="dropoffs")
    start_time = models.DateTimeField(db_index=True)
    estimated_end_time = models.DateTimeField()
    cycle_hours_used = models.FloatField()
    distance = models.FloatField()
    status = models.CharField(max_length=10, choices=[(
        "ongoing", "Ongoing"), ("completed", "Completed")], default="ongoing", db_index=True)

    class Meta:
        indexes = [models.Index(fields=["driver", "start_time"])]

    def __str__(self):
        return f"Trip {self.id} - {self.driver.full_name}"

# ---------------------- ELD Log Entry Model ---------------------- #


class ELDEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    log_sheet = models.ForeignKey(
        'LogSheet', on_delete=models.CASCADE, related_name="entries")
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    status = models.CharField(max_length=15, choices=[("off_duty", "Off Duty"), (
        "sleeper", "Sleeper Berth"), ("driving", "Driving"), ("on_duty", "On Duty")])
    duration = models.FloatField()

    def __str__(self):
        return f"{self.log_sheet.trip.driver.full_name} - {self.status} at {self.timestamp}"

# ---------------------- Location History Model ---------------------- #


class LocationHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    driver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="location_history")
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [models.Index(fields=["driver", "timestamp"])]

    def __str__(self):
        return f"{self.driver.full_name} - ({self.latitude}, {self.longitude})"

# ---------------------- Log Sheet Model ---------------------- #


class LogSheet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(
        Trip, on_delete=models.CASCADE, related_name="logs")
    date = models.DateField()
    total_off_duty = models.FloatField()
    total_sleeper_berth = models.FloatField()
    total_driving = models.FloatField()
    total_on_duty = models.FloatField()
    remarks = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ("trip", "date")

    def __str__(self):
        return f"Log Sheet for Trip {self.trip.id} - {self.date}"

# ---------------------- Waypoint Model ---------------------- #


class Waypoint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(
        Trip, on_delete=models.CASCADE, related_name="waypoints")
    latitude = models.FloatField()
    longitude = models.FloatField()
    stop_type = models.CharField(max_length=10, choices=[(
        "break", "Break"), ("fuel", "Fuel"), ("rest", "Rest")])
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"Waypoint - {self.trip.driver.full_name} ({self.stop_type})"
