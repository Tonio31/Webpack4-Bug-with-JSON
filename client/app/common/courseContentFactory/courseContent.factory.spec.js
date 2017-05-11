import CourseContentFactory from './courseContentFactory';

describe('CourseContentFactory', () => {
  let ContentFactory;

  beforeEach(window.module(CourseContentFactory));
  beforeEach(inject(($injector) => {
    ContentFactory = $injector.get('ContentFactory');
  }));

  it('updateInputFields() - Stores data correctly in inputs', () => {
    ContentFactory.updateInputFields( 'c1.m1.s1.story_2', 'This is a text' );
    expect(ContentFactory.getInputFields()).to.deep.equal({ 'c1.m1.s1.story_2': 'This is a text' });
  });

  it('clearInputFields() - delete data inside inputs', () => {
    ContentFactory.updateInputFields( 'c1.m1.s1.story_2', 'This is a text' );
    ContentFactory.clearInputFields();
    expect(ContentFactory.getInputFields()).to.deep.equal({});
  });

  it('saveDataToSendLater() - Stores data correctly in additionalDataToSave', () => {
    ContentFactory.saveDataToSendLater( 'c1.m1.s1.story_2', 'This is a text' );
    expect(ContentFactory.getAdditionalData()).to.deep.equal({ 'c1.m1.s1.story_2': 'This is a text' });
  });

  it('clearAdditionalData() - delete data inside additionalDataToSave', () => {
    ContentFactory.saveDataToSendLater( 'c1.m1.s1.story_2', 'This is a text' );
    ContentFactory.clearAdditionalData();
    expect(ContentFactory.getAdditionalData()).to.deep.equal({});
  });

  it('setNextStepButtonPreSaveAction() - register a function and execute it', () => {
    let dataTobeModified = '';
    let testFunction = () => {
      dataTobeModified = 'Something';
    };

    ContentFactory.setNextStepButtonPreSaveAction(testFunction);

    expect(ContentFactory.isNextButtonPreSaveAction()).to.equal(true);


    ContentFactory.nextStepButtonPreSaveAction();

    expect(dataTobeModified).to.equal('Something');
  });

  it('setPreviousStepButtonPreAction() - register a function and execute it', () => {
    let dataTobeModified = '';
    let testFunction = () => {
      dataTobeModified = 'Something';
    };

    ContentFactory.setPreviousStepButtonPreAction(testFunction);

    expect(ContentFactory.isPreviousButtonPreAction()).to.equal(true);

    ContentFactory.previousStepButtonPreSaveAction();

    expect(dataTobeModified).to.equal('Something');
  });

});
