let plSubmit = function($log, $timeout) {
  'ngInject';
  return {
    restrict: 'A',
    scope: {
      click: '=plSubmit'
    },
    link: function( $scope, element ) {
      $scope.$watch('click', (newStatus, oldStatus) => {
        if ( newStatus ) {
          $timeout( () => {
            $log.warn('About to change website because the value of loginController.triggerSubmit has changed');
            element[0].submit();
          }, 0);
          $log.log('The value of plSubmit has changed, oldStatus=', oldStatus, '   newStatus=', newStatus);
        }
      }, false);
    }
  };
};

export {
  plSubmit
};
