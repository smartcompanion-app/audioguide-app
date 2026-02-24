class LanguagePage {
  get page() {
    return $('sc-page-language');
  }

  async waitForPage() {
    await this.page.waitForExist({ timeout: 15000 });
  }

  async getLanguageButtons() {
    const page = await this.page;
    return page.shadow$$('ion-button');
  }

  async getLanguageCount(): Promise<number> {
    const buttons = await this.getLanguageButtons();
    return buttons.length;
  }

  async selectLanguageByIndex(index: number) {
    const buttons = await this.getLanguageButtons();
    await buttons[index].click();
  }

  async selectLanguageByText(text: string) {
    const buttons = await this.getLanguageButtons();
    for (const button of buttons) {
      const buttonText = await button.getText();
      if (buttonText.trim() === text) {
        await button.click();
        return;
      }
    }
    throw new Error(`Language button with text "${text}" not found`);
  }
}

export default new LanguagePage();
