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

  async getMenuItemLabel(index: number): Promise<string> {
    await this.open();
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
}

export default new MenuComponent();
