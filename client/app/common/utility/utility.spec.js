import UtilityModule from './utility';

describe('Utility', () => {
  let $state;
  let Utility;
  let goSpy;


  let mockWindow = {
    location: {
      href: 'http://this-should-change.com'
    }
  };

  beforeEach(window.module(UtilityModule, ($provide) => {
    $provide.value('$window', mockWindow );
  }));

  beforeEach(inject(($injector) => {
    $state = $injector.get('$state');
    Utility = $injector.get('Utility');

    goSpy = sinon.spy($state, 'go');

  }));


  describe('Utility Factory', () => {


    it('Redirect to external URL if url is of type http:// or https://', () => {

      let url = 'http://iamtestingifthisworks.com';
      Utility.goToLink(url);

      expect(mockWindow.location.href).to.eq(url);
    });


    it('Change State if the url is not an external URL', () => {

      let url = '/potentialife-course/cycle-1/module-1/step-9';
      Utility.goToLink(url);

      sinon.assert.calledWith(goSpy, url);
    });

  });

});
