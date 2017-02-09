import CourseContentModule from './courseContent'
import CourseContentController from './courseContent.controller';
import CourseContentComponent from './courseContent.component';
import CourseContentTemplate from './courseContent.html';

describe('CourseContent', () => {
  let $rootScope, makeController;

  beforeEach(window.module(CourseContentModule));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new CourseContentController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property('name');
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(CourseContentTemplate).to.contain('this is our first content page');
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = CourseContentComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(CourseContentTemplate);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(CourseContentController);
      });
  });
});
