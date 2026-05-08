class MenuComponent {
  get menu() {
    return $('ion-menu');
  }

  get menuLabels() {
    return $$('ion-menu ion-label');
  }

  get menuItems() {
    return $$('ion-menu ion-item');
  }

  async waitForMenuVisible() {
    await this.menu.waitForExist({ timeout: 15000 });
  }

  async open() {
    await browser.execute(() => (document.querySelector('ion-menu') as any).open());
    await this.menu.waitForDisplayed({ timeout: 5000 });
  }

  async getMenuItemLabel(index: number, notExpected?: string): Promise<string> {
    await this.open();
    await browser.waitUntil(
      async () => {
        const labels = await this.menuLabels;
        if (!labels[index]) return false;
        const text = await browser.execute((el: Element) => el.textContent || '', labels[index] as any);
        const trimmed = text.trim();
        if (trimmed.startsWith('menu-')) return false;
        if (notExpected && trimmed === notExpected) return false;
        return true;
      },
      { timeout: 15000, timeoutMsg: 'Menu label translation not loaded' },
    );
    const labels = await this.menuLabels;
    const text = await browser.execute((el: Element) => el.textContent || '', labels[index] as any);
    return text.trim();
  }

  async clickMenuItem(index: number) {
    await this.open();
    const items = await this.menuItems;
    await items[index].click();
    await browser.pause(500);
  }

  async clickOverview() {
    await this.clickMenuItem(0);
  }

  async clickSelection() {
    await this.clickMenuItem(1);
  }

  async clickLanguage() {
    await this.clickMenuItem(2);
  }

  async clickShare() {
    await this.open();
    await browser.waitUntil(
      async () => (await this.menuItems).length >= 4,
      { timeout: 15000, timeoutMsg: 'Share menu item did not appear' },
    );
    const items = await this.menuItems;
    await browser.waitUntil(
      async () => {
        const text = await browser.execute((el: Element) => el.textContent || '', items[3] as any);
        return !text.trim().startsWith('menu-');
      },
      { timeout: 10000, timeoutMsg: 'Share label translation not loaded' },
    );
    await items[3].click();
    await browser.pause(300);
  }
}

export default new MenuComponent();
