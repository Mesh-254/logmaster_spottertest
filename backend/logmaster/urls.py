from django.urls import path, include
from rest_framework.routers import DefaultRouter
from logmaster import views


router = DefaultRouter()

router.register(r'users', views.UserViewSet, basename='user') 
router.register(r'register', views.RegisterViewSet, basename='register')
router.register(r'locations', views.LocationViewSet, basename='location')
router.register(r'cycles', views.CycleViewSet, basename='cycle')
router.register(r'trips', views.CreateTripViewSet, basename='trip')
router.register(r'vehicles', views.VehicleViewSet, basename='vehicle')

urlpatterns = [
    path('', include(router.urls)),
]
