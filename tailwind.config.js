/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      safelist: ["bg-dark-gray", "text-gray-400", "bg-blue-400"],
      colors: {
        "dark-gray": "#15202B", // Fondo general oscuro, similar al modo oscuro de Twitter
        "dark-slight": "#192734", // Fondo para las tarjetas o secciones individuales
        "blue-400": "#1DA1F2", // Azul característico de Twitter
        "gray-400": "#8899A6", // Texto gris claro
        "gray-500": "#657786", // Texto gris para detalles o fechas
        "red-400": "#E0245E", // Rojo para el botón de "Dislike"
        "green-500": "#17BF63", // Verde para el botón de "Like"
      },
      borderWidth: {
        1: "1px", // Bordes más finos para una apariencia ligera
      },
      transitionProperty: {
        colors: "background-color, border-color, color", // Para transiciones de color en los botones
      },
    },
    container: {
      center: true,
      padding: "1rem",
    },
  },
  plugins: [],
};
