// Color palette for Client Nest - Beautiful & Professional
const lightTheme = {
  primary: '#045c91', // Blue
  secondary: '#C6BFF3', // Soft Lilac
  accent: '#4B3E8E', // Deep Indigo (moved from primary)
  background: '#F8F8FB', // Off White
  surface: '#FFFFFF', // Pure White
  card: '#FFFFFF', // White card background
  text: {
    primary: '#4A4A68', // Slate Grey
    secondary: '#4A4A68',
    tertiary: '#DADCE5', // Light Grey
    inverse: '#FFFFFF',
  },
  border: '#DADCE5', // Light Grey
  success: '#059669',
  warning: '#D97706',
  error: '#FF6B6B', // Coral Red
  inactive: '#DADCE5',
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
  background: '#2C3E50', // Dark blue-grey background
  surface: '#34495E', // Lighter blue-grey for cards
  card: '#34495E', // Card background
  text: {
    primary: '#FFFFFF', // Pure white text
    secondary: '#BDC3C7', // Light grey text
    tertiary: '#7F8C8D', // Muted grey text
    inverse: '#2C3E50',
  },
  border: '#4A5568', // Subtle border
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  inactive: '#7F8C8D',
  highlight: '#4A90E2',
  
  // Action button colors - vibrant colors for dark mode
  invite: '#27AE60', // Green
  clients: '#4A90E2', // Blue
  contracts: '#8B7355', // Brown/Gold
  notes: '#9B59B6', // Purple
};

export { lightTheme, darkTheme };
export default lightTheme; // Default to light theme