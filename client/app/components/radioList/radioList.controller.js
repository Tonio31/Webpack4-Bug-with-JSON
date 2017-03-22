class RadioListController {
  constructor($log, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'RadioListController' );

    let listIndex = 0;

    this.name = 'radioList';
    this.icons = ICON_FONTELLO;
    this.modelOptions = MODEL_OPTIONS;
    this.selected = '';
    this.limit = 5;
    this.showingMore = false;


    this.toggleMore = () => {
      $log.info('index', listIndex);
      this.showingMore = !this.showingMore;
      if (this.showingMore) {
        this.limitStart = 0;
        this.limit = 100;
      }
      else {
        if (listIndex >= 2) {
          this.limitStart = listIndex - 2;
        }
        else {
          this.limitStart = 0;
        }
        this.limit = 5;
      }
    };

    this.$onInit = () => {
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;

      this.text = this.block.data.value;
    };

    this.actionOnUserInput = (iIsFormValid, index) => {
      listIndex = index;
      this.onUpdate({ value: this.selected, checked: true });
      $log.log('actionOnUserInput() - iIsFormValid=', iIsFormValid);
    };

  }
}

export default RadioListController;
