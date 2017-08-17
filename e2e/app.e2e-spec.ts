import { GoogleLanguageApiPage } from './app.po';

describe('google-language-api App', () => {
  let page: GoogleLanguageApiPage;

  beforeEach(() => {
    page = new GoogleLanguageApiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
