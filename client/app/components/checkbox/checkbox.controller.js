class CheckboxController {
  constructor($log, FORM_NAME_PREFIX, MODEL_OPTIONS, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CheckboxController' );

    let checkboxes = null;

    this.icons = ICON_FONTELLO;
    this.modelOptions = MODEL_OPTIONS;
    this.selection = {};
    this.limit = 5;
    this.showingMore = false;
    this.checkboxIsChecked = false; // assume checkboxes havent been checked

    this.toggleMore = () => {
      this.showingMore = !this.showingMore;
      if (this.showingMore) {
        this.limitStart = 0;
        this.limit = 100;
      }
      else {
        this.limit = 5;
      }
    };

    let isChecked = () => {
      angular.forEach(checkboxes, (value) => {
        if (value.checked === true) {
          this.checkboxIsChecked = true; // hide show more/less
          this.limitStart = 0;
          this.limit = 100;
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
      this.checkboxIsChecked = true;
      this.limit = 100;
      for ( let [ key, value ] of Object.entries(this.selection) ) {
        if ( value === true ) {
          checkedInput.push(key);
        }
      }
      this.onUpdate({ value: checkedInput, checked: true });
    };



  }
}

export default CheckboxController;
