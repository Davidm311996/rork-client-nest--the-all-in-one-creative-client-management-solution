// Color palette for Client Nest - Beautiful & Professional
const lightTheme = {
  primary: '#045c91', // Blue
  secondary: '#C6BFF3', // Soft Lilac
  accent: '#4B3E8E', // Deep Indigo (moved from primary)
  background: '#F8F8FB', // Off White
  surface: '#FFFFFF', // Pure White
  card: '#FFFFFF', // White card background
  text: {
    primary: '#1F2937', // Dark grey for better contrast
    secondary: '#4B5563', // Medium grey for better contrast
    tertiary: '#9CA3AF', // Light grey for better contrast
    inverse: '#FFFFFF', // White text for dark backgrounds
  },
  border: '#E5E7EB', // Light Grey with better contrast
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626', // Darker red for better contrast
  inactive: '#9CA3AF',
  highlight: '#045c91',
  
  // Action button colors - muted versions
  invite: '#8B7BC7',
  clients: '#A8A0E8',
  contracts: '#6BA3FF',
  notes: '#7A7A8A',
};

const darkTheme = {
  primary: '#4A90E2', // Blue accent
  secondary: '#045c91', // Blue
  accent: '#4B3E8E', // Deep Indigo
  background: '#1A1A1A', // True dark background
  surface: '#2D2D2D', // Dark grey for cards
  card: '#2D2D2D', // Card background
  text: {
    primary: '#FFFFFF', // Pure white text for maximum contrast
    secondary: '#E0E0E0', // Light grey text with better contrast
    tertiary: '#A0A0A0', // Muted grey text with better contrast
    inverse: '#1A1A1A', // Dark text for light backgrounds
  },
  border: '#404040', // More visible border
  success: '#4ADE80', // Brighter green for better visibility
  warning: '#FBBF24', // Brighter yellow for better visibility
  error: '#F87171', // Brighter red for better visibility
  inactive: '#6B7280',
  highlight: '#60A5FA', // Brighter blue for better visibility
  
  // Action button colors - vibrant colors for dark mode with better contrast
  invite: '#10B981', // Emerald green
  clients: '#3B82F6', // Blue
  contracts: '#F59E0B', // Amber
  notes: '#8B5CF6', // Purple
};

export { lightTheme, darkTheme };
export default lightTheme; // Default to light theme