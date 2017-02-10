import CourseContentModule from './courseContent'

describe('CourseContent', () => {
  let $rootScope, $state, $location, $componentController, $compile;

  beforeEach(window.module(CourseContentModule));
  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $location = $injector.get('$location');
    $compile = $injector.get('$compile');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
/*    it('courseContent component should be visible when navigates to /courseContent', () => {
      $location.url('/');
      $rootScope.$digest();
      expect($state.current.component).to.eq('courseContent');
    });*/
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      controller = $componentController('courseContent', {
        $scope: $rootScope.$new()
      });
    });

    it('has a name property', () => { // erase if removing this.name from the controller
      expect(controller).to.have.property('name');
    });
  });

  describe('View', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<course-content></course-content>')(scope);
      scope.$apply();
    });

    it('has name in template', () => {
      expect(template.find('h3').html()).to.eq('this is our first content page');
    });

  });

});
