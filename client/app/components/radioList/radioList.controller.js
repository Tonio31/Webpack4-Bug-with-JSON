class RadioListController {
  constructor($log, $scope) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'RadioListController' );

    $log.log('radio list');
    $log.log(this.data);

    this.name = 'radioList';

    this.$onInit = () => {
      $scope.radioData = angular.fromJson(this.data);
      $log.log('this radio', $scope.radioData);
    };
  }
}

export default RadioListController;
