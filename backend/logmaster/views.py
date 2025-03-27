from django.shortcuts import render
from rest_framework import generics
from .serializers import *
from rest_framework import viewsets
from .models import *


# ================= REGISTER VIEW ===================


class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
