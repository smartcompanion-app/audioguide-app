class FontsComponent {
  async getDocumentFontFamily(): Promise<string> {
    return browser.execute(() => getComputedStyle(document.documentElement).fontFamily);
  }

  async getLanguageButtonFontFamily(): Promise<string> {
    return browser.execute(() => {
      const button = document.querySelector('sc-page-language')!.shadowRoot!.querySelector('ion-button')!;
      return getComputedStyle(button).fontFamily;
    });
  }

  async loadFont(family: string): Promise<boolean> {
    return browser.execute(async (family: string) => {
      await document.fonts.load(`16px "${family}"`);
      return [...document.fonts].some(face => face.family.replace(/["']/g, '') === family && face.status === 'loaded');
    }, family);
  }

  async isServed(url: string): Promise<boolean> {
    return browser.execute(async (url: string) => (await fetch(url)).ok, url);
  }
}

export default new FontsComponent();
