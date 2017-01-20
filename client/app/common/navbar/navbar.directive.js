//HACK
//There is a bug in the offCanvas with Angular, the submenu are not working properly
//as described here: https://github.com/pineconellc/angular-foundation/pull/137
//The workaround to fix this is to redefine the directive and the css associated

let offCanvasListBugfixDef = function () {
  "ngInject";
  return {
    require: '^offCanvasWrap',
    restrict: 'C',
    link: function ($scope, element, attrs, offCanvasWrap) {
      element.find('li').on('click', function (e) {
        e.stopPropagation();
        if (angular.element(this).hasClass('has-submenu')) {
          angular.element(this.getElementsByClassName('left-submenu')[0]).addClass('move-right');
          angular.element(this.getElementsByClassName('right-submenu')[0]).addClass('move-left');
        } else if (angular.element(this).hasClass('back')) {
          angular.element(this.parentElement).removeClass('move-right');
          angular.element(this.parentElement).removeClass('move-left');
        } else {
          offCanvasWrap.hide();
        }
      });
    }
  };
};

export { offCanvasListBugfixDef };
