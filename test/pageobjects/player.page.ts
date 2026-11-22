class PlayerPage {
  get page() {
    return $('sc-page-stations');
  }

  async waitForPage() {
    await this.page.waitForExist({ timeout: 15000 });
  }

  async getItemTitles(): Promise<string[]> {
    return browser.execute(() => Array.from(document.querySelectorAll('[data-testid^="player-list-item-"] .title')).map(el => (el.textContent || '').trim()));
  }

  async isItemActive(index: number): Promise<boolean> {
    const item = await $(`[data-testid="player-list-item-${index}"]`);
    const className = await item.getAttribute('class');
    return className?.includes('active') ?? false;
  }

  async clickNext() {
    const controls = await $('sc-player-controls');
    const btn = await controls.shadow$('[data-testid="player-next-button"]');
    await btn.click();
  }

  async clickPrev() {
    const controls = await $('sc-player-controls');
    const btn = await controls.shadow$('[data-testid="player-prev-button"]');
    await btn.click();
  }
}

export default new PlayerPage();
