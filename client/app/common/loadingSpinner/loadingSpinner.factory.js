let SpinnerFactory = function($log) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance( 'SpinnerFactory' );

  // This will be the container for the spinners object, a ref to this object is used in other module,
  // so it's important to never re-assign the top level object (to don't loose the reference to it)
  let spinners = {};


  let createNewSpinner = (iSpinnerName) => {
    $log.debug('createNewSpinner() - name=', iSpinnerName);

    spinners[iSpinnerName] = {
      name: iSpinnerName,
      show: false
    };

    return spinners[iSpinnerName];
  };


  let getSpinner = (name) => {
    $log.debug('getSpinner() - name=', name);
    let spinner = spinners[name];
    if (!spinner) {
      spinner = createNewSpinner(name);
    }

    return spinner;
  };


  let show = (name) => {
    $log.debug('show() - name=', name);
    let spinner = spinners[name];

    if (!spinner) {
      spinner = createNewSpinner(name);
    }

    spinner.show = true;
  };

  let hide = (name) => {
    $log.debug('hide() - name=', name);
    let spinner = spinners[name];

    if (!spinner) {
      spinner = createNewSpinner(name);
    }

    spinner.show = false;
  };

  return {
    createNewSpinner,
    show,
    hide,
    getSpinner
  };
};

export default SpinnerFactory;
