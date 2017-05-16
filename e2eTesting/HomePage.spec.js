describe('Protractor Demo App', () => {

  beforeEach( function(){
    browser.get("/");
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/login');
    element(by.model('$ctrl.username')).clear().sendKeys('tonio@gmail.com');
    element(by.model('$ctrl.password')).clear().sendKeys('someting');
    element(by.buttonText('Log In')).click();
  });


  it('should have a title', () => {

    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/');

    let test = element(by.id('faq'));
    let text = test.getText().then( (myText) => {
      console.log(myText);
    },
      (error) => {
      console.log('there was an error=', error);
      });


    expect(browser.getTitle()).toEqual('Potentialife');
    expect(test.getText()).toEqual('something');
  });
});
