from django_filters import rest_framework as filters
from django.db.models import Q

from .models import (
    Application,
    WorkTask,
    WorkMaterial,
    LegalEntity,
    SawatzkyEmployee,
    Report,
    GeneralJournal,
)


'''Фильтр для Application'''
class ApplicationFilter(filters.FilterSet):
    legalEntity = filters.CharFilter(field_name="creator__legalEntity", lookup_expr="exact")
    ordering = filters.OrderingFilter(fields=("createdAt", 'id'), field_labels={"createdAt": "Дата создания"})
    periodStart = filters.DateFilter(field_name="createdAt", lookup_expr="gte")
    periodEnd = filters.DateFilter(field_name="createdAt", lookup_expr="lte")
    creator = filters.CharFilter(field_name="creator__user__username", lookup_expr="exact")
    workObject = filters.CharFilter(method='filter_by_work_object')
    performer = filters.CharFilter(method='filter_by_performer')
    status = filters.ChoiceFilter(
        field_name='status',
        choices=Application.STATUSES,
        method='filter_by_status'
    )

    class Meta:
        model = Application
        fields = ['legalEntity', 'ordering', 'periodStart', 'periodEnd', 'creator', 'workObject', 'performer']

    def filter_by_work_object(self, queryset, name, value):
        workingObjects = value.split(',')
        return queryset.filter(creator__legalEntity__workObject__id__in=workingObjects)

    def filter_by_performer(self, queryset, name, value):
        performers_ids = value.split(',')
        return queryset.filter(performers__id__in=performers_ids)

    def filter_by_status(self, queryset, name, value):
        return queryset.filter(status=value)

'''Фильтр для WorkTask'''
class WorkTaskFilter(filters.FilterSet):
    status = filters.BooleanFilter(field_name="status", lookup_expr="exact")

    class Meta:
        model = WorkTask
        fields = ['status']


'''Фильтр для WorkMaterial'''
class WorkMaterialFilter(filters.FilterSet):
    status = filters.BooleanFilter(field_name="status", lookup_expr="exact")

    class Meta:
        model = WorkMaterial
        fields = ['status']


'''Фильтр для LegalEntity'''
class LegalEntityFilter(filters.FilterSet):
    status = filters.BooleanFilter(field_name="status", lookup_expr="exact")
    sawatzky = filters.BooleanFilter(field_name="sawatzky", lookup_expr="exact")
    workObject = filters.CharFilter(method='filter_by_work_object')

    class Meta:
        model = LegalEntity
        fields = ['sawatzky']

    def filter_by_work_object(self, queryset, name, value):
        workingObjects = value.split(',')
        return queryset.filter(workObject__id__in=workingObjects)


'''Фильтр для SawatzkyEmployee'''
class SawatzkyEmployeeFilter(filters.FilterSet):
    role = filters.CharFilter(method='filter_by_role')
    workingObjects = filters.CharFilter(method='filter_by_working_objects')

    class Meta:
        model = SawatzkyEmployee
        fields = ['role', 'workingObjects']

    def filter_by_role(self, queryset, name, value):
        roles = value.split(',')
        q_objects = Q()
        for role in roles:
            q_objects |= Q(role=role)
        return queryset.filter(q_objects)

    def filter_by_working_objects(self, queryset, name, value):
        working_objects = value.split(',')
        return queryset.filter(workingObjects__id__in=working_objects)


'''Фильтр для Report'''
class ReportFilter(filters.FilterSet):
    periodStart = filters.DateFilter(field_name="periodStart", lookup_expr="gte")
    periodEnd = filters.DateFilter(field_name="periodEnd", lookup_expr="lte")

    class Meta:
        model = Report
        fields = ['periodStart', 'periodEnd']

def filter_founded_applications(report_instance):
    if report_instance:
        founded_applications = report_instance.foundedApllications.filter(
            Q(createdAt__gte=report_instance.periodStart) &
            Q(createdAt__lte=report_instance.periodEnd)
        )
        report_instance.foundedApllications.set(founded_applications)


'''Фильтр для GeneralJournal'''
class GeneralJournalFilter(filters.FilterSet):
    periodStart = filters.DateFilter(field_name="receiptDate", lookup_expr="gte")
    periodEnd = filters.DateFilter(field_name="receiptDate", lookup_expr="lte")
    legalEntity = filters.CharFilter(field_name='legalEntity__name', lookup_expr='icontains')
    workObject = filters.CharFilter(method='filter_by_work_object')

    class Meta:
        model = GeneralJournal
        fields = ['periodStart', 'periodEnd', 'legalEntity']

    def filter_by_work_object(self, queryset, name, value):
        workingObjects = value.split(',')
        return queryset.filter(legalEntity__workObject__id__in=workingObjects)