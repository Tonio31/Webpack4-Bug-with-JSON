import ChangeLanguageModule from './changeLanguage'

describe('ChangeLanguage', () => {
  let $rootScope, $state, $location, $componentController, $compile, $translate;

  beforeEach(window.module(ChangeLanguageModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $location = $injector.get('$location');
    $translate = $injector.get('$translate');
    $compile = $injector.get('$compile');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    let spyTranslate;

    beforeEach(() => {
      controller = $componentController('changeLanguage', {
        $scope: $rootScope.$new()
      });

      spyTranslate = sinon.spy($translate, 'use');
    });

    it('has a name property', () => {
      expect(controller).to.have.property('name');
    });


    it('Calls $translate.use() when invoking changeLang function', () => {
      var lang = 'en';
      controller.changeLang('en');

      assert(spyTranslate.calledWith(lang), "translate service should have been called with 'en' argument");
    });

  });

  describe('View', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<change-language></change-language>')(scope);
      scope.$apply();
    });

    it('has flag-icon in template', () => {
      expect(template.find('span').attr('class').split(" ")).to.deep.equal(["flag-icon", "flag-icon-fr"]);
    });

  });
});
