from django.urls import path
from . import views

urlpatterns = [
    path('users/me/', views.AuthUserView.as_view()),
    path('users/change_password/', views.UserChangePasswordView.as_view()),
    path('users/<int:user_id>/', views.UserDetailView.as_view()),

    path('applications/', views.ApplicationListView.as_view()),
    path('applications/create/', views.ApplicationCreateView.as_view()),
    path('applications_dispatcher/create/', views.ApplicationDispatcherCreateView.as_view()),
    path('applications/update/<int:pk>/', views.ApplicationUpdateView.as_view()),
    path('applications/<int:pk>/', views.ApplicationDetailView.as_view()),
    path('applications/<int:pk>/documents/', views.DocumentToApplicationCreateView.as_view()),
    path('applications/<int:pk>/comments/', views.CommentsToApplicationCreateView.as_view()),
    path('applications/<int:pk>/rejected/', views.UpdateApplicationStatusAPIView.as_view()),
    path('applications/legal_entity/<int:pk>/', views.ApplicationListByLegalEntityView.as_view()),



    path('entities/', views.LegalEntityListView.as_view()),
    path('entities/create/', views.LegalEntityCreateView.as_view()),
    path('entities/<int:pk>/', views.LegalEntityDetailView.as_view()),
    path('entities/update/<int:pk>/', views.LegalEntityUpdateView.as_view()),


    path('work_objects_groups/', views.WorkObjectsGroupListView.as_view()),
    path('work_objects_groups/create/', views.WorkObjectsGroupCreateView.as_view()),
    path('work_objects_groups/<int:pk>/', views.WorkObjectsGroupDetailView.as_view()),
    path('work_objects_groups/update/<int:pk>/', views.WorkObjectsGroupUpdateView.as_view()),

    path('work_materials/', views.WorkMaterialListView.as_view()),
    path('work_materials/create/', views.WorkMaterialCreateView.as_view()),
    path('work_materials/<int:pk>/', views.WorkMaterialDetailView.as_view()),
    path('work_materials/update/<int:pk>/', views.WorkMaterialUpdateView.as_view()),

    path('work_tasks/', views.WorkTaskListView.as_view()),
    path('work_tasks/create/', views.WorkTaskCreateView.as_view()),
    path('work_tasks/<int:pk>/', views.WorkTaskDetailView.as_view()),
    path('work_tasks/update/<int:pk>/', views.WorkTaskUpdateView.as_view()),


    path('work_task_groups/', views.WorkTaskGroupListView.as_view()),
    path('work_task_groups/create/', views.WorkTaskGroupCreateView.as_view()),
    path('work_task_groups/<int:pk>/', views.WorkTaskGroupDetailView.as_view()),
    path('work_task_groups/update/<int:pk>/', views.WorkTaskGroupUpdateView.as_view()),

    path('work_material_groups/', views.WorkMaterialGroupListView.as_view()),
    path('work_material_groups/create/', views.WorkMaterialGroupCreateView.as_view()),
    path('work_material_groups/<int:pk>/', views.WorkMaterialGroupDetailView.as_view()),
    path('work_material_groups/update/<int:pk>/', views.WorkMaterialGroupUpdateView.as_view()),


    path('work_objects/', views.WorkObjectListView.as_view()),
    path('work_objects/create/', views.WorkObjectCreateView.as_view()),
    path('work_objects/<int:pk>/', views.WorkObjectDetailView.as_view()),
    path('work_objects/update/<int:pk>/', views.WorkObjectUpdateView.as_view()),

    path('employee/create/', views.EmployeeCreateView.as_view()),
    path('employee/', views.EmployeeListView.as_view()),
    path('employee/update/<int:pk>/', views.EmployeeUpdateView.as_view()),
    path('employee/<int:pk>/', views.EmployeeDetailView.as_view()),

    path('documents/create/', views.DocumentsCreateView.as_view()),
    path('documents/<int:pk>/', views.DocumentsDetailView.as_view()),

    path('sawatzky_employee/', views.SawatzkyEmployeeListView.as_view()),
    path('sawatzky_employee/create/', views.SawatzkyEmployeeCreateView.as_view()),
    path('sawatzky_employee/<int:pk>/', views.SawatzkyEmployeeDetailView.as_view()),
    path('sawatzky_employee/update/<int:pk>/', views.SawatzkyEmployeeUpdateView.as_view()),

    path('reports/', views.ReportListView.as_view()),
    path('reports/create/', views.ReportCreateView.as_view()),
    path('reports/<int:pk>/', views.ReportDetailView.as_view()),
    path('reports_download/<int:pk>/', views.report_download),

    path('comments/', views.CommentsListView.as_view()),

    path('general_journal/', views.GeneralJournalListView.as_view()),
    path('general_journal/create/', views.GeneralJournalCreateView.as_view()),
    path('general_journal/<int:pk>/', views.GeneralJournalDetailView.as_view()),
    path('general_journal/update/<int:pk>/', views.GeneralJournalUpdateView.as_view()),
    path('general_journal/update_applications/<int:pk>/', views.GeneralJournalUpdateAPLView.as_view()),
    path('general_journal/applications_by_legal_entity/<int:legal_entity_id>/', views.GeneralJournalApplicationsByLegalEntityView.as_view()),

]
