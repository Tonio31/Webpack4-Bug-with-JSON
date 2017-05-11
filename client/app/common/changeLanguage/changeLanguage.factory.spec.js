import ChangeLanguageModule from './changeLanguage';

describe('LanguageFactory', () => {
  let LanguageFactory;

  let mockTranslate = {
    use: () => { return 'fr'; },
    proposedLanguage: () => { return 'es'; },
    storageKey: () => { return false; },
    storage: () => { return false; },
    preferredLanguage: () => { return false; }
  };

  beforeEach(window.module(ChangeLanguageModule, ($provide) => {
    $provide.value('$translate', mockTranslate );
  }));

  beforeEach(window.module(ChangeLanguageModule));

  beforeEach(inject(($injector) => {
    LanguageFactory = $injector.get('LanguageFactory');
  }));

  it('getCurrentLanguage() - return current language via translate.use() ', () => {
    expect(LanguageFactory.getCurrentLanguage()).to.equal('fr');
  });

  it('getCurrentLanguage() - return current language via translate.proposedLanguage() ', () => {
    mockTranslate.use = () => { return; };
    expect(LanguageFactory.getCurrentLanguage()).to.equal('es');
  });

  it('getCurrentLanguageForViaSurvey() - return en-us by default as the current language is fr and fr is not defined for viaSurvey', () => {
    expect(LanguageFactory.getCurrentLanguageForViaSurvey()).to.equal('en-us');
  });

  it('getCurrentLanguageForViaSurvey() - return en-us as the current language is en', () => {
    LanguageFactory.getCurrentLanguage = () => { return 'en'; };
    expect(LanguageFactory.getCurrentLanguageForViaSurvey()).to.equal('en-us');
  });
});
