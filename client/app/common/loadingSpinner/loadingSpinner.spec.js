import LoadingSpinnnerModule from './loadingSpinner';

describe('Loading Spinner', () => {
  let SpinnerFactory;
  let $rootScope, $componentController;

  const SPINNER_NAME = 'My beloved spinner';

  beforeEach(window.module(LoadingSpinnnerModule));
  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    SpinnerFactory = $injector.get('SpinnerFactory');

  }));

  describe('Controller', () => {
    // controller specs
    let controller;

    let bindings = {
      name: SPINNER_NAME,
      show: false
    };

    beforeEach(() => {
      controller = $componentController('spinner', {
        $scope: $rootScope.$new()
      }, bindings);
    });

    it('$onInit  initialise the good variables', () => {
      controller.$onInit();
      expect(controller.spinner).to.deep.eq({
        name: SPINNER_NAME,
        show: false
      });
    });
  });

  describe('Factory', () => {

    it('getSpinner create and returns the spinner', () => {
      let mySpinner = SpinnerFactory.getSpinner(SPINNER_NAME);

      expect(mySpinner).to.deep.eq({
        name: SPINNER_NAME,
        show: false
      });
    });

    it('show change the property show of the spinner to true', () => {
      SpinnerFactory.show(SPINNER_NAME);

      expect(SpinnerFactory.getSpinner(SPINNER_NAME).show).to.eq( true );
    });

    it('show change the property show of the spinner to true', () => {
      SpinnerFactory.hide(SPINNER_NAME);

      expect(SpinnerFactory.getSpinner(SPINNER_NAME).show).to.eq( false );
    });

  });

});
