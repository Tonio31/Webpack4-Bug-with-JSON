//
// let menuButton = function($log) {
//   'ngInject';
//   return {
//     restrict: 'E',
//     replace: true,
//     scope: {
//       data: '='
//     },
//     template: require('./navbar.menuButton.template.html'),
//     link: function($scope, element) {
//
//       angular.element(element).addClass($scope.data.status);
//       // This will be used to change the icon on the left side of the menu, this way we just need to
//       // update our menu inside menuFactory and the changes are propagated automatically
//       $scope.$watch('data.status', (newStatus, oldStatus) => {
//         if ( newStatus !== oldStatus ) {
//
//           angular.element(element).removeClass(oldStatus);
//           angular.element(element).addClass(newStatus);
//
//           $log.log('The value has changed, oldStatus=', oldStatus, '   newStatus=', newStatus);
//         }
//       }, false);
//     }
//   };
// };
//
// export default menuButton;
