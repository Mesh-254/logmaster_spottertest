from django.contrib import admin
from .models import *


# Register your models here.
admin.site.register(User)
admin.site.register(Cycle)
admin.site.register(Location)
admin.site.register(Vehicle)
admin.site.register(Trip)
admin.site.register(ELDEntry)
admin.site.register(LocationHistory)
admin.site.register(LogSheet)
admin.site.register(Waypoint)
