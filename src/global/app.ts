export default async () => {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // The theme-color metas can no longer be filled in at build time: the dark
  // background is derived from the light one in app.scss, so only the compiled
  // stylesheet knows it. Read it back from the active palette instead.
  //
  // Both metas get the same value. index.html splits them by
  // prefers-color-scheme so the browser has a sensible colour before this script
  // runs, but the palette can also be forced (UPDATE_DARK_MODE), and then the
  // media query no longer says which one applies.
  const syncThemeColor = () => {
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--sc-background-color').trim();
    if (!backgroundColor) {
      return;
    }

    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach(meta => (meta.content = backgroundColor));
  };

  const apply = (prefersDarkMode: boolean) => {
    if (prefersDarkMode) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
    }
  };

  // The palette class is toggled from the UPDATE_DARK_MODE handler in
  // src/services/index.ts as well, so watch the class rather than hooking apply().
  new MutationObserver(syncThemeColor).observe(document.documentElement, { attributeFilter: ['class'] });

  apply(darkModeMediaQuery.matches);
  darkModeMediaQuery.addEventListener('change', event => apply(event.matches));

  syncThemeColor();
};
