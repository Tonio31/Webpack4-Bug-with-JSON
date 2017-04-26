import CourseContentFactory from './courseContent';

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


});
