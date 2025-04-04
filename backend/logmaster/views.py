from django.shortcuts import get_object_or_404
from .serializers import *
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import *
import requests  # type: ignore
import os

MAPBOX_ACCESS_TOKEN = os.getenv("MAPBOX_ACCESS_TOKEN")


# ================= USER VIEW ===================
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# ================= REGISTER VIEW ===================


class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# ================= CYCLE VIEW ===================
class CycleViewSet(viewsets.ModelViewSet):
    """cycle view set"""
    queryset = Cycle.objects.all()
    serializer_class = CycleSerializer


# ================= TRIP VIEW ===================
class CreateTripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer


# ================= LOCATION VIEW ===================
class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

# ================= VEHICLE VIEW ===================
class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

# ================= VEHICLE VIEW ===================
class CycleViewSet(viewsets.ModelViewSet):
    queryset = Cycle.objects.all()
    serializer_class = CycleSerializer


