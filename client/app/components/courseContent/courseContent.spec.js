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
    let bindings = {
      content: {
        data:'test'
      }
    };

    beforeEach(() => {
      controller = $componentController('courseContent', {
        $scope: $rootScope.$new(),
      }, bindings);
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
      scope.content = require('app/mockBackEndResponse/courseContent_step1.json');
      scope.data = {
        name: '/potentialife-course/cycle-1/module-1/step-7',
        title: 'Step 7'
      };
      template = $compile('<course-content content="content" data="data"></course-content>')(scope);
      scope.$apply();
    });

    it('has h3 title in page', () => {
      expect(template.find('h3').html()).to.eq('this is our first content page');
    });

  });

});
