export const configureTailwind = () => {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          main: "var(--main-color)",
          secondary: "var(--secondary-color)",
          bgCustom: "var(--bg-color)",
        },
      },
    },
  };
};
