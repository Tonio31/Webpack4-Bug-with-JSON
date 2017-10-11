let unsafeFilter = function($sce) {
  'ngInject';
  return (inputHTML) => {
    return $sce.trustAsHtml(inputHTML);
  };
};

let secondsToTimeFilter = () => {
  'ngInject';
  let padTime = (t) => {
    return t < 10 ? `0${t}` : `${t}`;
  };

  return (inputSeconds) => {

    if ( !angular.isNumber(inputSeconds) || inputSeconds < 0 ) {
      return '00:00';
    }

    let hours = Math.floor( inputSeconds / 3600 );
    let minutes = Math.floor( ( inputSeconds % 3600 ) / 60 );
    let seconds = Math.floor( inputSeconds % 60 );

    let output = '';
    if ( hours > 0 ) {
      output += `${ padTime(hours) }:`;
    }

    output += `${padTime(minutes)}:${padTime(seconds)}`;

    return output;
  };
};

export { unsafeFilter, secondsToTimeFilter };
