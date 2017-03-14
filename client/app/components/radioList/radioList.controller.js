class RadioListController {
  constructor($log, $scope) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'RadioListController' );

    this.name = 'radioList';

    this.selected = '';

    this.$onInit = () => {
      $scope.radioData = angular.fromJson(this.data);
    };

    this.actionOnUserInput = () => {
      this.onUpdate({ value: this.selected });
    };

  }
}

export default RadioListController;
