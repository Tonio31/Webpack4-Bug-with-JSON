module.exports = (iBaseUrl) => {
  let allFunctions = {

    DATA: {
      C1_M1_S5: {
        textArea0: 'C1 M1 S5 Influences'
      },
      C1_M1_S7: {
        textArea0: 'C1 M1 S7 Thoughts'
      },
      C1_M1_S8: {
        textBox0: 'C1 M1 S8 Strength0',
        textBox1: 'C1 M1 S8 Strength1',
        textBox2: 'C1 M1 S8 Strength2'
      },
      C1_M1_S9: {
        textArea0: 'C1 M1 S9 Thoughts',
        textArea1: 'C1 M1 S9 Increase Strength'
      },
      C1_M2_S2: {
        textArea0: 'C1 M2 S2 Reflect lifeacts',
      },
      C1_M2_S4: {
        textArea0: 'C1 M2 S4 Thoughts'
      },
      C1_M2_S7: {
        textArea0: 'C1 M2 S7 Thoughts',
        textArea1: 'C1 M2 S7 Change'
      }
    },

    checkCurrentUrl: (iExpectedPath) => {
      let fullUrlExpected = `${iBaseUrl}${iExpectedPath}`;
      expect(browser.getCurrentUrl()).toEqual(fullUrlExpected);
    },

    login: () => {


      browser.get("/");

      browser.getCurrentUrl().then( (url) => {
        if ( url.includes('login') ) {
          // User is not logged in yet
          element(by.model('$ctrl.username')).clear().sendKeys('tonio1@gmail.com');
          element(by.model('$ctrl.password')).clear().sendKeys('whatever');
          element(by.buttonText('Log In')).click();
        }
        expect(browser.getTitle()).toEqual('Potentialife');
        expect(browser.getCurrentUrl()).toEqual(iBaseUrl);
      });
    },

    checkCongratsBannerDisplayed: () => {
      // Check if the save was successful
      let congratsBanner = element(by.binding('$ctrl.banner.text'));
      expect(congratsBanner.isDisplayed()).toBeTruthy();
    },

    checkVideoIsPlaying: () => {
      let showMoreButton = element(by.css('button.vjs-big-play-button'));
      showMoreButton.click();

      let videoDiv = element(by.id('myVideo'));
      expect(videoDiv.getAttribute('class')).toContain('vjs-playing vjs-has-started');
    },

    clickNextStepButton: () => {
      let buttonNextStep = element(by.id('nextStepButton'));
      buttonNextStep.click();
    },

    enterDataInTextBox: (iTextBoxIndex, iTextToEnter) => {
      let textBox = element.all(by.tagName('text-box')).get(iTextBoxIndex).element(by.tagName('input'));
      textBox.clear().sendKeys(iTextToEnter);
    },

    enterDataInTextArea: (iTextAreaIndex, iTextToEnter) => {
      let textArea = element.all(by.tagName('pl-text-area')).get(iTextAreaIndex).element(by.tagName('textarea'));
      textArea.clear().sendKeys(iTextToEnter);
    }
  };

  return allFunctions;
};
