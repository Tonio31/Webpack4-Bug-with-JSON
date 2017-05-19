let common = require('./common.js')(browser.baseUrl);


describe('Testing Module 1  |||  ', () => {

  describe('Login', () => {
    it('Go to Home page just after Login and see current Progression', () => {

      common.login();

      let buttonRemuse = element(by.css('.button.radius.success'));
      expect(buttonRemuse.getText()).toEqual('STEP 2 • INTRODUCTION');
    });

    it('Home - Clicking on Resume Progress Button brings us to the current step', () => {
      let buttonRemuse = element(by.css('.button.radius.success'));
      buttonRemuse.click();
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-2');
    });
  });

  describe('Module 1 ||| ', () => {

    beforeEach( () => {
      let breadcrumbs = element(by.binding('$ctrl.content.breadcrumbs'));
      expect(breadcrumbs.isDisplayed()).toBeTruthy();
      var until = protractor.ExpectedConditions;
      browser.wait(until.presenceOf(breadcrumbs), 5000, 'Element taking too long to appear in the DOM');
    });

    it('Step 2 - Module Overview - click on Complete and then Save', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-2');
      common.clickNextStepButton();

      common.checkCongratsBannerDisplayed();

      common.clickNextStepButton();
    });


    it('Step 3 - Video - its the abilities - Complete the step', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-3');

      // Check that the video is playing when you click on play
      common.checkVideoIsPlaying();

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 4 - Your Strating point - Complete the step', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-4');

      // Select one of the radio Button
      let firstRadioBox = element(by.tagName('radio-list')).all(by.tagName('input')).get(0);
      firstRadioBox.click();

      // Check if the feedback is displayed
      let firstRadioBoxFeedback = element(by.tagName('radio-list')).all(by.tagName('blockquote')).get(0);
      expect(firstRadioBoxFeedback.isDisplayed()).toBeTruthy();

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 5 - Your Influences - Complete the step', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-5');

      // Add something Empty to Synchronise into the textArea
      element(by.tagName('textarea')).clear().sendKeys('');

      // Click on next, it should display a warning that the textarea is mandatory
      common.clickNextStepButton();
      let iconValidation = element(by.css('.validation-icon-right')).element(by.tagName('span'));
      expect(iconValidation.getAttribute('class')).toContain('icon-pl-exclamation invalid');

      // Add something in the textArea
      element(by.tagName('textarea')).clear().sendKeys(common.DATA.C1_M1_S5.textArea0);

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 6 - Video - Weakness fixing - Complete the step', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-6');

      // Check that the video is playing when you click on play
      common.checkVideoIsPlaying();

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 7 - How often are you using - Complete the step', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-7');

      // Select the bar charts and check that the label have the good value coming back from lifeMap
      expect(element.all(by.css('bar-chart .c3-texts-Work text')).get(0).getText()).toEqual('60%');
      expect(element.all(by.css('bar-chart .c3-texts-Non-Work text')).get(1).getText()).toEqual('56%');

      element(by.tagName('textarea')).clear().sendKeys(common.DATA.C1_M1_S7.textArea0);
      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 8 - Identifying your strength - Complete the step', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-8');

      // Enter something in the textbox
      common.enterDataInTextBox(0, common.DATA.C1_M1_S8.textBox0);
      common.enterDataInTextBox(1, common.DATA.C1_M1_S8.textBox1);
      common.enterDataInTextBox(2, common.DATA.C1_M1_S8.textBox2);

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 9 - When are you playing to your strength - Complete the step', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-9');

      // Select the first three strength
      let checkbox = element(by.tagName('checkbox'));
      let inputsCheckbox = checkbox.all(by.tagName('input'));
      inputsCheckbox.get(2).click();
      expect(inputsCheckbox.get(0).getAttribute('value')).toEqual('Work positive 4 large 28logs');
      inputsCheckbox.get(0).click();
      expect(inputsCheckbox.get(1).getAttribute('value')).toEqual('Non-work - 5 - 25logs');
      inputsCheckbox.get(1).click();
      expect(inputsCheckbox.get(2).getAttribute('value')).toEqual('Work Positive 5 Large 24slots');

      common.enterDataInTextArea(0, common.DATA.C1_M1_S9.textArea0);
      common.enterDataInTextArea(1, common.DATA.C1_M1_S9.textArea1);

      let unorderedList = element(by.tagName('unordered-list'));
      expect(unorderedList.all(by.binding('item.label')).get(0).getText()).toEqual(common.DATA.C1_M1_S8.textBox0);
      expect(unorderedList.all(by.binding('item.label')).get(1).getText()).toEqual(common.DATA.C1_M1_S8.textBox1);
      expect(unorderedList.all(by.binding('item.label')).get(2).getText()).toEqual(common.DATA.C1_M1_S8.textBox2);

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 10 - Video - Complete the step', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-10');

      // Check that the video is playing when you click on play
      common.checkVideoIsPlaying();

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 11 - Lifeacts - Complete the step', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-1/step-11');

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
      common.checkCurrentUrl('');
    });

  });


});
