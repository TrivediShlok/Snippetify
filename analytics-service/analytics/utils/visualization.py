import matplotlib.pyplot as plt
import base64
from io import BytesIO
from typing import List, Dict

# Configure matplotlib for web use
plt.switch_backend('Agg')

class SimpleVisualizationGenerator:
    """Generate basic charts"""
    
    def create_language_pie_chart(self, language_data: List[Dict]) -> str:
        """Create a simple language distribution pie chart"""
        
        if not language_data:
            return self._create_empty_chart("No data available")
        
        # Prepare data
        languages = [item['_id'] for item in language_data]
        counts = [item['count'] for item in language_data]
        
        # Create pie chart
        fig, ax = plt.subplots(figsize=(10, 8))
        
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF']
        
        wedges, texts, autotexts = ax.pie(
            counts, 
            labels=languages,
            autopct='%1.1f%%',
            startangle=90,
            colors=colors[:len(languages)]
        )
        
        ax.set_title('Programming Language Distribution', fontsize=16, fontweight='bold')
        
        plt.tight_layout()
        return self._fig_to_base64(fig)
    
    def _fig_to_base64(self, fig) -> str:
        """Convert matplotlib figure to base64 string"""
        buffer = BytesIO()
        fig.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close(fig)  # Close figure to free memory
        return image_base64
    
    def _create_empty_chart(self, message: str) -> str:
        """Create an empty chart with a message"""
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.text(0.5, 0.5, message, ha='center', va='center', fontsize=14, transform=ax.transAxes)
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis('off')
        return self._fig_to_base64(fig)
