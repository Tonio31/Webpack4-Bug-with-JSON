class RadioListController {
  constructor($log, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'RadioListController' );

    let radio = null;
    let limitAmount = 5; // list limit
    let limitMax = 100; // list max limit (when showing more)

    this.listIndex = 0; // select item
    this.icons = ICON_FONTELLO;
    this.modelOptions = MODEL_OPTIONS;
    this.selected = ''; // current selected item
    this.limit = limitAmount; // limit the amount shown in the list
    this.showingMore = false; // is the list showing all items?
    this.checkboxIsChecked = false; // assume radios havent been checked

    // if greater than 5 then show all items, and hide hide less button
    this.toggleMore = () => {
      this.showingMore = !this.showingMore; // switch the state
      if (this.showingMore) { // if user clicks 'show more'
        this.limitStart = 0; // set the limitStart to beginning
        this.limit = limitMax; // set the limit to 100
      }
      else { // if user clicks 'show less'
        if (this.listIndex >= 2) { // if selected item is greater than/ equal to 2
          this.limitStart = this.listIndex - 2; // reduce the limitStart by 2 (show it shows items before and after the current selected item)
        }
        else {
          this.limitStart = 0; // otherwise reset the limitStart
        }
        this.limit = limitAmount; // limit the amount back to 5;
      }
    };

    // goes through the radios to see if checked, if it item is checked show all
    let isChecked = () => {
      angular.forEach(radio, (value) => {
        if (value.checked === true) {
          this.checkboxIsChecked = true; // hide show more/less
          this.limitStart = 0;
          this.limit = limitMax;
        }
      });
    };

    this.$onInit = () => {
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;
      this.name = this.block.data.label;
      this.text = this.block.data.value;
      radio = this.block.data.items;
      isChecked(radio);
    };

    this.actionOnUserInput = (iIsFormValid, index) => {
      this.listIndex = index;
      // Update parent with the change
      this.updateBlockManager({ blockManagerValue: this.selected, checked: true });
      $log.log('actionOnUserInput() - iIsFormValid=', iIsFormValid);
    };

  }
}

export default RadioListController;
