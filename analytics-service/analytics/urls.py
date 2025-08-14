from django.urls import path
from .views import HealthCheckView, AnalyticsDashboardView, SimpleChartView

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('dashboard/', AnalyticsDashboardView.as_view(), name='analytics-dashboard'),
    path('charts/<str:chart_type>/', SimpleChartView.as_view(), name='simple-chart'),
]
