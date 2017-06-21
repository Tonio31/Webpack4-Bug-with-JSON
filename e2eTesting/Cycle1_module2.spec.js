let common = require('./common.js')(browser.baseUrl);

describe('Testing Module 2  |||  ', () => {

  describe('Login', () => {
    it('Home - Clicking on Resume Progress Button brings us to the current step', () => {
      // common.login();

      let buttonRemuse = element(by.css('.button.radius.success'));
      buttonRemuse.click();
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-1');
    });
  });


  describe('Module 2 ||| ', () => {
    it('Step 1 - Module Overview', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-1');
      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });


    it('Step 2 - Take 5', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-2');

      // Check that notes from lifeMap are reflected correctly
      let unorderedList = element(by.tagName('unordered-list'));
      expect(unorderedList.all(by.binding('item.takeaways')).get(0).getText()).toEqual('l1.m1.lifeact_notes_1 - these are my notes, I\'m so strong');

      common.enterDataInTextArea(0, common.DATA.C1_M2_S2.textArea0);

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });


    it('Step 3 - Video Passion and performance strengths', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-3');

      common.checkVideoIsPlaying();

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });


    it('Step 4 - Your Passion Strengths', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-4');

      // Select the bar charts and check that the label have the good value coming back from lifeMap
      expect(element.all(by.css('bar-chart .c3-texts-Work text')).get(0).getText()).toEqual('62%');
      expect(element.all(by.css('bar-chart .c3-texts-Non-Work text')).get(1).getText()).toEqual('63%');

      // Check that notes from lifeMap are reflected correctly
      let unorderedList = element(by.tagName('unordered-list'));
      expect(unorderedList.all(by.binding('item.label')).get(0).getText()).toEqual('Work positive 4 large 28logs');

      common.enterDataInTextArea(0, common.DATA.C1_M2_S4.textArea0);

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });


    it('Step 5 - Your Peak Potential Zone', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-5');

      // Select the bar charts and check that the label have the good value coming back from lifeMap
      expect(element.all(by.css('bar-chart .c3-texts-Work text')).get(0).getText()).toEqual('59%');
      expect(element.all(by.css('bar-chart .c3-texts-Non-Work text')).get(1).getText()).toEqual('55%');

      // Click on show More - the button should disappear
      let showMoreButton = element(by.css('.radio-checkbox.checkbox.unordered-list button'));
      showMoreButton.click();

      expect(showMoreButton.isDisplayed()).toBeFalsy();

      // Select the first three strength
      let checkbox = element(by.tagName('checkbox'));
      let inputsCheckbox = checkbox.all(by.tagName('input'));
      inputsCheckbox.get(2).click();
      expect(inputsCheckbox.get(0).getAttribute('value')).toEqual('Work positive 4 large 28logs');
      inputsCheckbox.get(0).click();
      expect(inputsCheckbox.get(1).getAttribute('value')).toEqual('Non-work - 5 - 25logs');
      inputsCheckbox.get(1).click();
      expect(inputsCheckbox.get(2).getAttribute('value')).toEqual('Work Positive 5 Large 24slots');


      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });


    it('Step 6 - Video PLaying the video', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-6');

      // Check that the video is playing when you click on play
      common.checkVideoIsPlaying();

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });



    it('Step 7 - Increasing Time in Your Peak Potential Zone', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-7');

      let unorderedLists = element.all(by.tagName('unordered-list'));

      let reflectionList = unorderedLists.get(0);
      expect(reflectionList.all(by.binding('item.label')).get(0).getText()).toEqual(common.DATA.C1_M2_S2.textArea0);

      let viaCharacterList = unorderedLists.get(1);
      expect(viaCharacterList.all(by.binding('item.label')).get(0).getText()).toEqual(common.DATA.C1_M1_S8.textBox0);
      expect(viaCharacterList.all(by.binding('item.label')).get(1).getText()).toEqual(common.DATA.C1_M1_S8.textBox1);
      expect(viaCharacterList.all(by.binding('item.label')).get(2).getText()).toEqual(common.DATA.C1_M1_S8.textBox2);

      let activitiesList = unorderedLists.get(2);
      expect(activitiesList.all(by.binding('item.label')).get(0).getText()).toEqual('Work positive 4 large 28logs');
      expect(activitiesList.all(by.binding('item.label')).get(1).getText()).toEqual('Non-work - 5 - 25logs');
      expect(activitiesList.all(by.binding('item.label')).get(2).getText()).toEqual('Work Positive 5 Large 24slots');

      common.enterDataInTextArea(0, common.DATA.C1_M2_S7.textArea0);

      let checkOutThoughtList = unorderedLists.get(3);
      expect(checkOutThoughtList.all(by.binding('item.label')).count()).toEqual(5);

      common.enterDataInTextArea(1, common.DATA.C1_M2_S7.textArea1);

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 8 - Send OUt Strength', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-8');

      for ( let i = 0; i < 5; i++ ) {
        common.enterDataInTextBox( i * 3, `First Name ${i}` );
        common.enterDataInTextBox( i * 3 + 1, `Last Name ${i}` );
        common.enterDataInTextBox( i * 3 + 2, `email${i}@gmail.com` );
      }

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 9 - Video', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-9');

      // Check that the video is playing when you click on play
      common.checkVideoIsPlaying();

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
    });

    it('Step 10 - Lifeacts', () => {
      common.checkCurrentUrl('potentialife-course/cycle-1/module-2/step-10');

      common.clickNextStepButton();
      common.checkCongratsBannerDisplayed();
      common.clickNextStepButton();
      common.checkCurrentUrl('');
    });



  });
});
