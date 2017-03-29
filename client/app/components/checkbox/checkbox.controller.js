class CheckboxController {
  constructor($log, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CheckboxController' );

    let checkboxes = null;
    let limitAmount = 5; // list limit
    let limitMax = 100; // list max limit (when showing more)

    this.icons = ICON_FONTELLO;
    this.modelOptions = MODEL_OPTIONS;
    this.selection = {}; // current selected items
    this.limit = limitAmount; // limit the amount shown in the list
    this.showingMore = false; // is the list showing all items?
    this.checkboxIsChecked = false; // assume checkboxes havent been checked

    // if greater than 5 then show all items, and hide hide less button
    this.toggleMore = () => {
      this.showingMore = !this.showingMore; // switch the state
      if (this.showingMore) { // if user clicks 'show more'
        this.checkboxIsChecked = true; // hide show more/less
        this.limitStart = 0; // set the limitStart to beginning
        this.limit = limitMax; // set the limit to 100
      }
      else { // if user clicks 'show less'
        this.limit = limitAmount; // limit the amount back to 5;
      }
    };

    // goes through the checkboxes to see if checked, if it item is checked show all
    let isChecked = () => {
      angular.forEach(checkboxes, (checkbox) => {
        if (checkbox.checked === true) {
          this.checkboxIsChecked = true; // hide show more/less
          this.limitStart = 0;
          this.limit = limitMax;
          this.selection[checkbox.value] = checkbox.checked;
        }
      });
    };

    this.$onInit = () => {
      this.formName = `${FORM_NAME_PREFIX}${this.block.id}`;
      this.name = this.block.data.label;
      checkboxes = this.block.data.items;
      isChecked(checkboxes);
    };

    this.checkIfRequired = () => {
      // eslint-disable-next-line no-unused-vars
      for ( let [ key, value ] of Object.entries(this.selection) ) {
        if ( value === true ) {
          return false;
        }
      }
      return true;
    };


    this.actionOnUserInput = () => {
      let checkedInput = [];
      for ( let [ key, value ] of Object.entries(this.selection) ) {
        if ( value === true ) {
          checkedInput.push(key);
        }
      }

      // Update parent with the change
      this.updateBlockManager({ blockManagerValue: checkedInput, checked: true });
    };



  }
}

export default CheckboxController;
