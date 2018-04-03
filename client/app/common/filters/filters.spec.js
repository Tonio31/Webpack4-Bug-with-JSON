import FiltersModule from './filters';

describe('Filters', () => {
  let $sce;
  let unsafe, secondsToTime;
  let trustAsHtmlSpy;


  beforeEach(window.module(FiltersModule));

  beforeEach(inject(($injector) => {
    $sce = $injector.get('$sce');
    unsafe = $injector.get('unsafeFilter');
    secondsToTime = $injector.get('secondsToTimeFilter');

    trustAsHtmlSpy = sinon.spy($sce, 'trustAsHtml');
  }));

  describe('Unsafe', () => {


    it('Unsafe filter is defined', () => {
      expect(unsafe).not.to.be.a('null');
    });

    it('Unsafe filter strips the HTML tags', () => {
      let textToTest = '<p>Testing</p>';
      unsafe(textToTest);
      sinon.assert.calledWith(trustAsHtmlSpy, textToTest);
    });
  });

  describe('secondsToTime', () => {


    it('secondsToTime filter is defined', () => {
      expect(secondsToTime).not.to.be.a('null');
    });

    it('returns 00:00 if the input is not a number or negative number', () => {
      let input = 'This is a string';
      expect(secondsToTime(input)).to.equal('00:00');

      input = -2;
      expect(secondsToTime(input)).to.equal('00:00');
    });

    it('returns time in (HH:)mm:ss format from a number of seconds', () => {
      let input = 61;
      expect(secondsToTime(input)).to.equal('01:01');

      input = 3661;
      expect(secondsToTime(input)).to.equal('01:01:01');
    });
  });
});
