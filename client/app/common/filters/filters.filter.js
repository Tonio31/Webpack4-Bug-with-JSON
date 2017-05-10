let unsafeFilter = function($sce) {
  'ngInject';
  return (inputHTML) => {
    return $sce.trustAsHtml(inputHTML);
  };
};

export { unsafeFilter };
