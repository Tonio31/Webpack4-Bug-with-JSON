class RadioListController {
  constructor($log, Utility, FORM_NAME_PREFIX) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'RadioListController' );

    this.MIN_NB_RADIO_BUTTON_DISPLAYED = 5;

    this.selected = '';

    this.limitStart = 0;
    this.limit = this.MIN_NB_RADIO_BUTTON_DISPLAYED;

    this.showMoreButtonDisplayed = true;

    this.updateLimit = (iIndexSelected) => {
      $log.log('updateLimit() - iIndexSelected=', iIndexSelected);
      if (iIndexSelected >= ( this.block.data.items.length - 2 ) ) {
        this.limitStart = -this.MIN_NB_RADIO_BUTTON_DISPLAYED;
      }
      else if (iIndexSelected >= 2) {
        this.limitStart = iIndexSelected - 2;
      }
      else {
        this.limitStart = 0;
      }
      this.limit = this.MIN_NB_RADIO_BUTTON_DISPLAYED;
    };

    this.toggleMore = () => {
      this.showMoreButtonDisplayed = !this.showMoreButtonDisplayed;

      if ( this.showMoreButtonDisplayed ) {
        this.updateLimit(this.findSelectedIndex());
      }
      else {
        this.limitStart = 0;
        this.limit = undefined; // see limitTo docs: "If limit is undefined, the input will be returned unchanged."
      }
    };

    let setSelectedRadio = (iRadioItems) => {
      for (let i = 0; i < iRadioItems.length; i++) {
        let item = iRadioItems[i];
        if (item.selected === true) {
          this.selected = item.value.toString();
          this.updateLimit(i);
          return;
        }
      }

      // Nothing is selected from the back End response, check if we have some data in local Storage
      let selectedFromLocalStorage = Utility.getUserInputFromLocalStorage(this.block.program_data_code);
      if ( selectedFromLocalStorage ) {
        $log.log('Reloading data from local storage. selectedFromLocalStorage=', selectedFromLocalStorage);
        this.selected = selectedFromLocalStorage;
        this.updateLimit(this.findSelectedIndex());
        this.updateBlockManager({ blockManagerValue: this.selected });
        return;
      }

    };

    this.$onInit = () => {
      this.FORM_NAME = `${FORM_NAME_PREFIX}${this.block.id}`;
      setSelectedRadio(this.block.data.items);
    };

    this.findSelectedIndex = () => {
      for (let i = 0; i < this.block.data.items.length; i++) {
        let item = this.block.data.items[i];
        if ( item.value.toString() === this.selected.toString() ) {
          return i;
        }
      }

      // Default, nothing is selected
      return 0;
    };


    this.actionOnUserInput = (iIsFormValid) => {
      this.updateBlockManager({ blockManagerValue: this.selected });
      $log.log('actionOnUserInput() - iIsFormValid=', iIsFormValid, '  this.selected=', this.selected);
    };

  }
}

export default RadioListController;
