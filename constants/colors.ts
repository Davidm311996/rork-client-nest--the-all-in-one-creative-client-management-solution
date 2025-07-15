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
  primary: '#C6BFF3', // Soft Lilac (buttons, main accents on dark)
  secondary: '#045c91', // Blue
  accent: '#4B3E8E', // Deep Indigo
  background: '#1B1B1F', // Deep Charcoal
  surface: '#2A2A33', // Slate Grey
  card: '#2A2A33', // Slate Grey card background
  text: {
    primary: '#F8F8FB', // Off White
    secondary: '#F8F8FB',
    tertiary: '#DADCE5', // Light Grey
    inverse: '#1B1B1F',
  },
  border: '#DADCE5', // Light Grey
  success: '#059669',
  warning: '#D97706',
  error: '#FF6B6B', // Coral Red
  inactive: '#DADCE5',
  highlight: '#C6BFF3',
  
  // Action button colors - muted versions
  invite: '#C6BFF3',
  clients: '#6B5BA0',
  contracts: '#3A8DFF',
  notes: '#D0D0D8',
};

export { lightTheme, darkTheme };
export default lightTheme; // Default to light theme