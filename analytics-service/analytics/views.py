from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
import logging
from .utils.visualization import SimpleVisualizationGenerator


from .models import AnalyticsRepository

logger = logging.getLogger(__name__)

class AnalyticsDashboardView(APIView):
    """Main analytics dashboard API"""
    
    def __init__(self):
        super().__init__()
        self.repository = AnalyticsRepository()
    
    def get(self, request):
        """Get basic analytics dashboard data"""
        
        try:
            # Get snippets
            snippets = self.repository.get_all_snippets()
            
            if not snippets:
                return Response({
                    'success': True,
                    'message': 'No snippets found. Make sure your MongoDB is running and has data.',
                    'data': {
                        'total_snippets': 0,
                        'language_distribution': [],
                        'sample_snippet_titles': []
                    }
                }, status=status.HTTP_200_OK)
            
            # Get language distribution
            language_dist = self.repository.get_language_distribution()
            
            # Get sample snippet titles
            sample_titles = [snippet.get('title', 'Untitled')[:50] for snippet in snippets[:5]]
            
            dashboard_data = {
                'total_snippets': len(snippets),
                'language_distribution': language_dist,
                'sample_snippet_titles': sample_titles,
                'message': f'Successfully loaded {len(snippets)} snippets!'
            }
            
            return Response({
                'success': True,
                'data': dashboard_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in analytics dashboard: {str(e)}")
            return Response({
                'success': False,
                'error': f'Failed to generate analytics dashboard: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HealthCheckView(APIView):
    """Health check for the analytics service"""
    
    def get(self, request):
        try:
            # Test MongoDB connection
            repository = AnalyticsRepository()
            
            if repository.mongo.db is None:
                return Response({
                    'status': 'unhealthy',
                    'service': 'analytics-service',
                    'database': 'disconnected',
                    'message': 'Cannot connect to MongoDB. Make sure MongoDB is running.'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
            # Try to ping database
            repository.mongo.db.command('ping')
            
            return Response({
                'status': 'healthy',
                'service': 'analytics-service',
                'database': 'connected',
                'message': 'Analytics service is running properly!'
            })
        except Exception as e:
            return Response({
                'status': 'unhealthy',
                'service': 'analytics-service',
                'error': str(e),
                'message': 'Health check failed'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
class SimpleChartView(APIView):
    """Generate simple charts"""
    
    def __init__(self):
        super().__init__()
        self.repository = AnalyticsRepository()
        self.viz_generator = SimpleVisualizationGenerator()
    
    def get(self, request, chart_type):
        """Generate specific chart type"""
        
        try:
            if chart_type == 'language-pie':
                language_data = self.repository.get_language_distribution()
                chart_base64 = self.viz_generator.create_language_pie_chart(language_data)
                
                return Response({
                    'success': True,
                    'chart_data': chart_base64,
                    'chart_type': 'language-pie',
                    'message': 'Chart generated successfully!'
                })
            else:
                return Response({
                    'success': False,
                    'error': 'Invalid chart type. Use: language-pie'
                }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error generating chart: {str(e)}")
            return Response({
                'success': False,
                'error': f'Failed to generate chart: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
