from django.urls import path, include
from rest_framework.routers import DefaultRouter
from logmaster import views


router = DefaultRouter()

router.register(r'register', views.RegisterViewSet, basename='register')

urlpatterns = [
    path('', include(router.urls)),
]
