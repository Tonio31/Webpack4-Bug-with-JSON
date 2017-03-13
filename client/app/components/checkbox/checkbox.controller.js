class CheckboxController {
  constructor($log, $scope) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CheckboxController' );

    this.name = 'checkbox';

    this.$onInit = () => {
      $scope.checkboxData = angular.fromJson(this.data);
      // $log.log('this checkbox', $scope.checkboxData);
    };

  }
}

export default CheckboxController;
