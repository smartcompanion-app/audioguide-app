class SelectionPage {
  get page() {
    return $('sc-page-selection');
  }

  async waitForPage() {
    await this.page.waitForExist({ timeout: 15000 });
  }

  async getInputValue(): Promise<string> {
    const input = await $('[data-testid="numpad-input"]');
    return input.getText();
  }

  async pressNumber(n: number) {
    const numpad = await $('sc-numpad');
    const btn = await numpad.shadow$(`[data-testid="numpad-button-${n}"]`);
    await btn.click();
  }

  async pressConfirm() {
    const numpad = await $('sc-numpad');
    const btn = await numpad.shadow$('[data-testid="numpad-button-confirm"]');
    await btn.click();
  }
}

export default new SelectionPage();
