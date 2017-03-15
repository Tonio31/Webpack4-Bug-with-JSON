class CheckboxController {
  constructor($log, $scope, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CheckboxController' );

    this.name = 'checkbox';
    this.icons = ICON_FONTELLO;
    this.modelOptions = MODEL_OPTIONS;
    $scope.selection = [];

    $log.log('AFTER this.selection', this.selection);

    this.$onInit = () => {
      $log.info('checkbox ', this);
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;
    };

    this.actionOnUserInput = (item) => {
      let idx = $scope.selection.indexOf(item);
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }
      else {
        $scope.selection.push(item);
      }

      this.onUpdate({ value: $scope.selection });

    };

  }
}

export default CheckboxController;
