import FiltersModule from './filters';

describe('Filters', () => {
  let $rootScope, $sce, $componentController, $compile;
  let unsafe;
  let trustAsHtmlSpy;


  beforeEach(window.module(FiltersModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    $sce = $injector.get('$sce');
    unsafe = $injector.get('unsafeFilter');

    trustAsHtmlSpy = sinon.spy($sce, 'trustAsHtml');
  }));

  describe('Unsafe', () => {


    it('Unsafe filter is defined', () => {
      expect(unsafe).not.to.be.a('null');
    });

    it('Unsafe filter strips the HTML tags', sinon.test( () => {
      let textToTest = '<p>Testing<\/p>';
      unsafe(textToTest);
      sinon.assert.calledWith(trustAsHtmlSpy, textToTest);
    }));
  });

});
