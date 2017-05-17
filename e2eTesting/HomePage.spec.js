describe('Testing Module 1  |||  ', () => {

  const baseUrl = browser.baseUrl;

  let checkCurrentUrl = (iExpectedPath) => {
    let fullUrlExpected = `${baseUrl}${iExpectedPath}`;
    expect(browser.getCurrentUrl()).toEqual(fullUrlExpected);
  };

  describe('Login', () => {
    it('Go to Home page just after Login and see current Progression', () => {

      browser.get("/");
      expect(browser.getTitle()).toEqual('Potentialife');

      //expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/login');
      checkCurrentUrl('login');
      element(by.model('$ctrl.username')).clear().sendKeys('tonio1@gmail.com');
      element(by.model('$ctrl.password')).clear().sendKeys('whatever');
      element(by.buttonText('Log In')).click();

      checkCurrentUrl('');

      let buttonRemuse = element(by.css('.button.radius.success'));
      expect(buttonRemuse.getText()).toEqual('STEP 2 • INTRODUCTION');
    });

    it('Home - Clicking on Resume Progress Button brings us to the current step', () => {
      let buttonRemuse = element(by.css('.button.radius.success'));
      buttonRemuse.click();
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-2');
    });
  });

  describe('Module 1 ||| ', () => {

    let DATA = {
      C1_M1_S8: {
        textBox0: 'C1 M1 S8 Strength0',
        textBox1: 'C1 M1 S8 Strength1',
        textBox2: 'C1 M1 S8 Strength2'
      }
    };


    let checkCongratsBannerDisplayed = () => {
      // Check if the save was successful
      let congratsBanner = element(by.binding('$ctrl.banner.text'));
      expect(congratsBanner.isDisplayed()).toBeTruthy();
    };

    let clickNextStepButton = () => {
      let buttonNextStep = element(by.id('nextStepButton'));
      buttonNextStep.click();
    };

    let enterDataInTextBox = (iTextBoxIndex, iTextToEnter) => {
      let textBox = element.all(by.tagName('text-box')).get(iTextBoxIndex).element(by.tagName('input'));
      textBox.sendKeys(iTextToEnter);
    };

    let enterDataInTextArea = (iTextAreaIndex, iTextToEnter) => {
      let textArea = element.all(by.tagName('pl-text-area')).get(iTextAreaIndex).element(by.tagName('textarea'));
      textArea.sendKeys(iTextToEnter);
    };

    beforeEach( () => {
      let breadcrumbs = element(by.binding('$ctrl.content.breadcrumbs'));
      expect(breadcrumbs.isDisplayed()).toBeTruthy();
      var until = protractor.ExpectedConditions;
      browser.wait(until.presenceOf(breadcrumbs), 5000, 'Element taking too long to appear in the DOM');
    });

    it('Step 2 - click on Complete and then Save', () => {
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-2');
      clickNextStepButton();

      checkCongratsBannerDisplayed();

      clickNextStepButton();
    });


    it('Step 3 - Complete the step', () => {
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-3');
      clickNextStepButton();
      checkCongratsBannerDisplayed();
      clickNextStepButton();
    });

    it('Step 4 - Complete the step', () => {
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-4');

      // Select one of the radio Button
      let firstRadioBox = element(by.tagName('radio-list')).all(by.tagName('input')).get(0);
      firstRadioBox.click();

      // Check if the feedback is displayed
      let firstRadioBoxFeedback = element(by.tagName('radio-list')).all(by.tagName('blockquote')).get(0);
      expect(firstRadioBoxFeedback.isDisplayed()).toBeTruthy();

      clickNextStepButton();
      checkCongratsBannerDisplayed();
      clickNextStepButton();
    });

    it('Step 5 - Complete the step', () => {
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-5');

      // Add something Empty to Synchronise into the textArea
      element(by.tagName('textarea')).clear().sendKeys('');

      // Click on next, it should display a warning that the textarea is mandatory
      clickNextStepButton();
      let iconValidation = element(by.css('.validation-icon-right')).element(by.tagName('span'));
      console.log('TONIO 0');
      expect(iconValidation.getAttribute('class')).toContain('icon-pl-exclamation invalid');

      console.log('TONIO 1');
      // Add something in the textArea
      element(by.tagName('textarea')).clear().sendKeys('C1 M1 S5 Influences');

      console.log('TONIO 2');
      clickNextStepButton();
      checkCongratsBannerDisplayed();
      clickNextStepButton();
    });

    it('Step 6 - Complete the step', () => {
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-6');
      clickNextStepButton();
      checkCongratsBannerDisplayed();
      clickNextStepButton();
    });

    it('Step 7 - Complete the step', () => {
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-7');

      // TODO Check that we have data in the barchart (I need data from lifeMap first)

      element(by.tagName('textarea')).clear().sendKeys('C1 M1 S7 Thoughts');
      clickNextStepButton();
      checkCongratsBannerDisplayed();
      clickNextStepButton();
    });

    it('Step 8 - Complete the step', () => {
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-8');

      // Enter something in the textbox
      enterDataInTextBox(0, DATA.C1_M1_S8.textBox0);
      enterDataInTextBox(1, DATA.C1_M1_S8.textBox1);
      enterDataInTextBox(2, DATA.C1_M1_S8.textBox2);

      clickNextStepButton();
      checkCongratsBannerDisplayed();
      clickNextStepButton();
    });

    it('Step 9 - Complete the step', () => {
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-9');

      // TODO RadioBox not being displayed with my user because no data in LifeMap
      // We need to enter data here

      enterDataInTextArea(0, 'C1 M1 S9 Thought');
      enterDataInTextArea(1, 'C1 M1 S9 Increase Strength');

      expect(element.all(by.binding('item.label')).get(0).getText()).toEqual(DATA.C1_M1_S8.textBox0);
      expect(element.all(by.binding('item.label')).get(1).getText()).toEqual(DATA.C1_M1_S8.textBox1);
      expect(element.all(by.binding('item.label')).get(2).getText()).toEqual(DATA.C1_M1_S8.textBox2);

      clickNextStepButton();
      checkCongratsBannerDisplayed();
      clickNextStepButton();
    });

    it('Step 10 - Complete the step', () => {
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-10');

      clickNextStepButton();
      checkCongratsBannerDisplayed();
      clickNextStepButton();
    });

    it('Step 11 - Complete the step', () => {
      checkCurrentUrl('potentialife-course/cycle-1/module-1/step-11');

      clickNextStepButton();
      checkCongratsBannerDisplayed();
      clickNextStepButton();
      checkCurrentUrl('');
    });

  });


});
