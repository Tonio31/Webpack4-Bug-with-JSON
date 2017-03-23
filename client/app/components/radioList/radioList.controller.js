class RadioListController {
  constructor($log, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'RadioListController' );

    let radio = null;

    this.listIndex = 0;
    this.name = 'radioList';
    this.icons = ICON_FONTELLO;
    this.modelOptions = MODEL_OPTIONS;
    this.selected = '';
    this.limit = 5;
    this.showingMore = false;
    this.checkboxIsChecked = false; // assume checkboxes havent been checked

    // if greater than 5 then show all items, and hide hide less button


    this.toggleMore = () => {
      $log.info('index', this.listIndex);
      this.showingMore = !this.showingMore;
      if (this.showingMore) {
        this.limitStart = 0;
        this.limit = 100;
      }
      else {
        if (this.listIndex >= 2) {
          this.limitStart = this.listIndex - 2;
        }
        else {
          this.limitStart = 0;
        }
        this.limit = 5;
      }
    };

    let isChecked = () => {
      angular.forEach(radio, (value) => {
        if (value.checked === true) {
          this.checkboxIsChecked = true; // hide show more/less
          this.limitStart = 0;
          this.limit = 100;
        }
      });
    };

    this.$onInit = () => {
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;
      this.text = this.block.data.value;
      radio = this.block.data.items;
      isChecked(radio);
    };

    this.actionOnUserInput = (iIsFormValid, index) => {
      this.listIndex = index;
      this.onUpdate({ value: this.selected, checked: true });
      $log.log('actionOnUserInput() - iIsFormValid=', iIsFormValid);
    };

  }
}

export default RadioListController;
