import FiltersModule from './filters';

describe('Filters', () => {
  let $sce;
  let unsafe;
  let trustAsHtmlSpy;


  beforeEach(window.module(FiltersModule));

  beforeEach(inject(($injector) => {
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
