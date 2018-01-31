import WordCloudModule from './wordCloud';
import WordCloudController from './wordCloud.controller';
import WordCloudComponent from './wordCloud.component';
import WordCloudTemplate from './wordCloud.html';

// needs to load d3, but doesnt execute it - easier to import this rather than mock it
/* eslint-disable */
import d3 from 'd3';
/* eslint-enable */

describe('WordCloud', () => {
  let $rootScope, $componentController, $compile;

  let dataBindings = {
    id: 64,
    type: 'static',
    element: 'word_cloud',
    data: {
      title: 'Word Cloud',
      wordData: [
        {
          text: 'hello',
          power: 12
        },
        {
          text: 'world',
          power: 1
        },
        {
          text: 'normally',
          power: 2
        },
        {
          text: 'you',
          power: 3
        },
        {
          text: 'want',
          power: 4
        },
        {
          text: 'more',
          power: 5
        },
        {
          text: 'words',
          power: 6
        },
        {
          text: 'than',
          power: 7
        },
        {
          text: 'this',
          power: 8
        },
        {
          text: 'hi',
          power: 9
        },
        {
          text: 'something',
          power: 10
        },
        {
          text: 'sunny',
          power: 1
        },
        {
          text: 'chicken',
          power: 2
        },
        {
          text: 'hungry',
          power: 3
        },
        {
          text: 'tummy',
          power: 4
        },
        {
          text: 'dancing',
          power: 5
        },
        {
          text: 'beachball',
          power: 6
        },
        {
          text: 'towel',
          power: 7
        },
        {
          text: 'seagull',
          power: 8
        },
        {
          text: 'icecream',
          power: 9
        }
      ]
    }
  };

  beforeEach(window.module(WordCloudModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller when wordCloud IS empty', () => {
    // controller specs
    let controller;
    let bindings = {
      block: {
        id: 64,
        type: 'static',
        element: 'word_cloud',
        data: {
          title: 'Empty Word Cloud',
          wordData: []
        }
    };

    beforeEach(() => {
      controller = $componentController('wordCloud', {
        $scope: $rootScope.$new()
      }, bindings);
    });


    it(`$onInit display an error message if the wordCloud data is empty` , () => {
      controller.$onInit();
      expect(controller.wordData).to.deep.eq([]);
      expect(controller.isWordCloudEmpty).to.eq(true);
    });
  });

  describe('Controller when wordCloud IS NOT empty', () => {
    // controller specs
    let controller;
    let bindings = {
      block: dataBindings
    };

    beforeEach(() => {
      controller = $componentController('wordCloud', {
        $scope: $rootScope.$new()
      }, bindings);
    });


    it('$onInit creates the data needed for displaying the bar chart', () => {
      controller.$onInit();
      expect(controller.isWordCloudEmpty).to.eq(false);
      expect(controller.wordData).to.deep.eq([
        {
          text: 'hello',
          power: 12
        },
        {
          text: 'world',
          power: 1
        },
        {
          text: 'normally',
          power: 2
        },
        {
          text: 'you',
          power: 3
        },
        {
          text: 'want',
          power: 4
        },
        {
          text: 'more',
          power: 5
        },
        {
          text: 'words',
          power: 6
        },
        {
          text: 'than',
          power: 7
        },
        {
          text: 'this',
          power: 8
        },
        {
          text: 'hi',
          power: 9
        },
        {
          text: 'something',
          power: 10
        },
        {
          text: 'sunny',
          power: 1
        },
        {
          text: 'chicken',
          power: 2
        },
        {
          text: 'hungry',
          power: 3
        },
        {
          text: 'tummy',
          power: 4
        },
        {
          text: 'dancing',
          power: 5
        },
        {
          text: 'beachball',
          power: 6
        },
        {
          text: 'towel',
          power: 7
        },
        {
          text: 'seagull',
          power: 8
        },
        {
          text: 'icecream',
          power: 9
        }
      ]);
    });
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = dataBindings;
      template = $compile('<word-cloud block="block"></word-cloud>')(scope);
      scope.$apply();
    });


    it('There is a word cloud on the page', () => {
      let cloud = angular.element(template[0].querySelector('.word-cloud'));
      expect(cloud.length).to.eq(1); // Element exist on DOM
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = WordCloudComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(WordCloudTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(WordCloudController);
    });
  });
});
