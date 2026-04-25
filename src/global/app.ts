export default async () => {  
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const apply = (prefersDarkMode: boolean) => {
    if (prefersDarkMode) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
    }
  };

  apply(darkModeMediaQuery.matches);
  darkModeMediaQuery.addEventListener('change', (event) => apply(event.matches));
};
