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
  primary: '#60A5FA', // Brighter blue for better visibility
  secondary: '#3B82F6', // Blue
  accent: '#8B5CF6', // Purple
  background: '#0F0F0F', // Deeper dark background
  surface: '#1F1F1F', // Dark grey for cards with better contrast
  card: '#1F1F1F', // Card background with better contrast
  text: {
    primary: '#FFFFFF', // Pure white text for maximum contrast
    secondary: '#E5E5E5', // Very light grey text with excellent contrast
    tertiary: '#B0B0B0', // Muted grey text with good contrast
    inverse: '#0F0F0F', // Dark text for light backgrounds
  },
  border: '#333333', // More visible border with better contrast
  success: '#22C55E', // Brighter green for better visibility
  warning: '#F59E0B', // Brighter yellow for better visibility
  error: '#EF4444', // Brighter red for better visibility
  inactive: '#6B7280',
  highlight: '#60A5FA', // Brighter blue for better visibility
  
  // Action button colors - vibrant colors for dark mode with excellent contrast
  invite: '#22C55E', // Emerald green
  clients: '#60A5FA', // Bright blue
  contracts: '#F59E0B', // Amber
  notes: '#A855F7', // Purple
};

export { lightTheme, darkTheme };
export default lightTheme; // Default to light theme