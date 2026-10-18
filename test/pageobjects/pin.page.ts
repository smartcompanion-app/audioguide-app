class PinPage {
  get page() {
    return $('sc-page-pin');
  }

  async waitForPage() {
    await this.page.waitForExist({ timeout: 15000 });
  }

  async enterPin(pin: string) {
    const numpad = await this.page.$('sc-numpad');
    for (const digit of pin) {
      const btn = await numpad.shadow$(`[data-testid="numpad-button-${digit}"]`);
      await btn.click();
    }
  }

  async getError(): Promise<string> {
    const error = await this.page.$('#pin-help .error');
    return (await error.getText()).trim();
  }
}

export default new PinPage();
