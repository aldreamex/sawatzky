from django.contrib import admin
from .models import (
    User,
    Application,
    Employee,
    Employee,
    LegalEntity,
    WorkTaskGroup,
    ApplicationWorkTask,
    SawatzkyEmployee,
    ApplicationPerformer,
    Report,
    WorkObject,
    Log,
    Comments,
    WorkObjectsGroup,
    WorkTask,
    WorkMaterialGroup,
    WorkMaterial,
    Document, GeneralJournal
) 
# Register your models here.

admin.site.register(User)
admin.site.register(ApplicationWorkTask)
admin.site.register(ApplicationPerformer)
admin.site.register(Application)
admin.site.register(Employee)
admin.site.register(SawatzkyEmployee)
admin.site.register(LegalEntity)
admin.site.register(WorkTask)
admin.site.register(WorkTaskGroup)
admin.site.register(Report)
admin.site.register(WorkObject)
admin.site.register(Log)
admin.site.register(Comments)
admin.site.register(WorkObjectsGroup)
admin.site.register(WorkMaterialGroup)
admin.site.register(WorkMaterial)
admin.site.register(Document)
admin.site.register(GeneralJournal)
