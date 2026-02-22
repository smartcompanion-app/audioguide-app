describe('Language selection', () => {

  before(async () => {
    await browser.url('/');
  });

  it('renders <sc-page-language> as first page', async () => {
    await $('sc-page-language').waitForExist({ timeout: 15000 });
    expect(await $('sc-page-language').isExisting()).toBe(true);
  });

});
