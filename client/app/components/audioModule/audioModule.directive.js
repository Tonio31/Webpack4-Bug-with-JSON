let plProgressTranformer = function() {
  'ngInject';
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {

      // We need to round up this value to a precision of 0.01
      // This is because the input type range that works with a precision of 0.01
      // So if the input is 0.0000123, the HTML input will round this up to 0 AND update the model with this new value
      // So the audio file will never get read
      ngModel.$formatters.push( (inputValue) => {
        return Math.round(inputValue * 100) / 100;
      });
    }
  };
};



export {
  plProgressTranformer
};
