class CheckboxController {
  constructor($log, $scope) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CheckboxController' );

    this.name = 'checkbox';

    $scope.selection = [];

    this.toggleSelection = (item) => {
      let idx = $scope.selection.indexOf(item);
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }
      else {
        $scope.selection.push(item);
      }
      this.onUpdate({ value: $scope.selection });
    };

    $log.log('AFTER this.selection', this.selection);


    this.$onInit = () => {
      $scope.checkboxData = angular.fromJson(this.data);
    };

  }
}

export default CheckboxController;
