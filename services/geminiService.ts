
export const generateLogisticsInsights = async (): Promise<string> => {
  try {
    const response = await fetch('/api/generate-insights');
    
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to generate insights. Status: ${response.status}`;
        try {
            // Try to parse as JSON for more detailed error
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            // Fallback to text if not JSON
            errorMessage = errorText || errorMessage;
        }
        console.error("Error from insights API:", errorMessage);
        return errorMessage;
    }
    
    const insights = await response.text();
    return insights;
  } catch (error) {
    console.error("Network error fetching logistics insights:", error);
    return "Failed to connect to the AI service. Please check your network connection.";
  }
};