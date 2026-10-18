class ErrorPage {
  get page() {
    return $('sc-page-error');
  }

  async waitForPage() {
    await this.page.waitForExist({ timeout: 15000 });
  }

  async hasNoInternetIcon(): Promise<boolean> {
    return this.page.shadow$('ion-icon[name="radio-outline"]').isExisting();
  }

  async clickTryAgain() {
    const button = await this.page.shadow$('ion-button');
    await button.click();
  }
}

export default new ErrorPage();
