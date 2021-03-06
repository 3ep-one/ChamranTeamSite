from django.contrib import admin

from . import models


@admin.register(models.Comment)
@admin.register(models.ProjectForm)
@admin.register(models.Project)
@admin.register(models.Keyword)
@admin.register(models.IndustryForm)
@admin.register(models.IndustryUser)
class IndustryAdmin(admin.ModelAdmin):
    pass
