class CheckboxController {
  constructor($log, $filter, Utility, FORM_NAME_PREFIX) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'CheckboxController' );

    this.NB_MIN_CHECKBOX_DISPLAYED = 5;

    this.selection = {};
    this.limit = this.NB_MIN_CHECKBOX_DISPLAYED;

    this.areAllCheckBoxDisplayed = false;

    this.displayAllCheckBox = () => {
      this.areAllCheckBoxDisplayed = true; // hide show more/less
      this.limit = undefined; // see limitTo docs: "If limit is undefined, the input will be returned unchanged."
    };

    this.getPleaseSelectMessage = (iMinChecked, iMaxChecked) => {
      let message = '';

      if ( iMinChecked === iMaxChecked ) {
        if ( iMinChecked === 1 ) {
          message = $filter('translate')('PLEASE_SELECT_1_OPTION').toString();
        }
        else {
          message = $filter('translate')('PLEASE_SELECT_X_OPTIONS', { nbOptions: iMinChecked }).toString();
        }
      }
      else {

        let params = {
          nbMinOptions: iMinChecked,
          nbMaxOptions: iMaxChecked
        };
        message = $filter('translate')('PLEASE_SELECT_RANGE_OPTIONS', params).toString();
      }

      return message;
    };

    this.$onInit = () => {
      this.FORM_NAME = `${FORM_NAME_PREFIX}${this.block.id}`;
      this.CHECKBOX_GROUP_NAME = `checkbox_group-${this.FORM_NAME}`;

      this.NB_MIN_CHECKBOX_SELECTED = this.block.data.config.min_selected;
      this.NB_MAX_CHECKBOX_SELECTED = this.block.data.config.max_selected;

      this.PLEASE_SELECT_MSG = this.getPleaseSelectMessage(this.NB_MIN_CHECKBOX_SELECTED, this.NB_MAX_CHECKBOX_SELECTED);

      angular.forEach(this.block.data.items, (checkbox, index) => {
        if (checkbox.checked === true) {

          // display all checkbox (hide the Show More button) only if selected checkbox are not the first 5
          if ( index >= this.NB_MIN_CHECKBOX_DISPLAYED ) {
            this.displayAllCheckBox();
          }

          this.selection[checkbox.value] = checkbox.checked;
        }
      });

      // if nothing is selected, check if we have some data previously saved in local storage
      if ( Object.keys(this.selection).length === 0 ) {
        let checkedFromLocalStorage = Utility.getUserInputFromLocalStorage(this.block.program_data_code);
        if ( checkedFromLocalStorage ) {
          for ( let checked of checkedFromLocalStorage ) {
            this.selection[checked] = true;
            this.displayAllCheckBox(); // Shortcut, we don't know (we could but it's extra computation) if the box checked is hidden or not, so we display everything
          }

          // Update block manager directly in order to save these inputs at courseContent level
          this.updateBlockManager({ blockManagerValue: checkedFromLocalStorage });
          $log.log('Reloading data from local storage. checkedFromLocalStorage=', checkedFromLocalStorage, '   this.selection=', this.selection);
        }
      }
    };

    this.checkIfValid = ( oListChecked ) => {
      let nbCheckboxSelected = 0;

      for ( let [ key, value ] of Object.entries(this.selection) ) {
        if ( value === true ) {
          nbCheckboxSelected += 1;

          // oListChecked is undefined when it is called directly from the template as we use it to set "required" on the checkbox
          if ( angular.isDefined(oListChecked) ) {
            oListChecked.push(key);
          }
        }
      }

      if ( nbCheckboxSelected < this.NB_MIN_CHECKBOX_SELECTED || nbCheckboxSelected > this.NB_MAX_CHECKBOX_SELECTED ) {
        return false;
      }

      return true;
    };

    this.actionOnUserInput = (iFormElement) => {

      $log.log('iFormElement=', iFormElement, '  this.selection=', this.selection);

      let checkedInput = [];
      let isSelectionValid = this.checkIfValid(checkedInput);
      if ( isSelectionValid ) {
        iFormElement.$setValidity('nbOptionSelected', true);
      }
      else {
        iFormElement.$setValidity('nbOptionSelected', false);
      }

      // Update parent with the change
      this.updateBlockManager({ blockManagerValue: checkedInput });
    };

  }
}

export default CheckboxController;
