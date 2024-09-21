module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        darkGray: '#3B3A3D',   // Custom dark gray
        lightGray: '#E5E5E5',  // Custom light gray
        teal: '#319795',       // Teal color for hover state

        // Adding new custom colors
        darkBlue: '#443c5b',   // Dark Blue
        pink: '#f8cacd',       // Pink
        tealLight: '#7fbaa8',  // Light Teal
        green: '#7ec682',      // Green
        blue: '#0097b2',       // Blue
      },
    },
  },
  plugins: [],
};
