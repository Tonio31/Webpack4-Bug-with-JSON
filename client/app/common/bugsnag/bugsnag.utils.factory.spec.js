import BugsnagModule from './bugsnag';

describe('Bugsnag', () => {
  let BugsnagUtils;
  let mockLocalStorage;
  let mockDateFilter = () => {
    return '2017/07/24 13:32:40';
  };

  beforeEach(window.module(BugsnagModule, ($provide) => {
    mockLocalStorage = {};
    $provide.value('$localStorage', mockLocalStorage );
    $provide.value('dateFilter', mockDateFilter );
  }));

  beforeEach(inject(($injector) => {
    BugsnagUtils = $injector.get('BugsnagUtils');
  }));



  it('addStateForHistory() - item is stored when addded', () => {
    BugsnagUtils.addStateForHistory('/home');
    expect(BugsnagUtils.getStatesHistoryAsString()).to.deep.equal('2017/07/24 13:32:40:/home | 2017/07/24 13:32:40:Full Page Refresh or Initial Load');
  });


  it('addStateForHistory() - we should have maximum 15 items', () => {
    for ( let i = 0; i < 15; i++) {
      BugsnagUtils.addStateForHistory(`/home${i}`);
    }

    expect(BugsnagUtils.getStatesHistoryAsString()).to.deep.equal('2017/07/24 13:32:40:/home14 | 2017/07/24 13:32:40:/home13 | 2017/07/24 13:32:40:/home12 | 2017/07/24 13:32:40:/home11 | 2017/07/24 13:32:40:/home10 | 2017/07/24 13:32:40:/home9 | 2017/07/24 13:32:40:/home8 | 2017/07/24 13:32:40:/home7 | 2017/07/24 13:32:40:/home6 | 2017/07/24 13:32:40:/home5 | 2017/07/24 13:32:40:/home4 | 2017/07/24 13:32:40:/home3 | 2017/07/24 13:32:40:/home2 | 2017/07/24 13:32:40:/home1 | 2017/07/24 13:32:40:/home0');

    // home0 should disapear from the list as it is the first element inserted
    BugsnagUtils.addStateForHistory(`/home15`);

    expect(BugsnagUtils.getStatesHistoryAsString()).to.deep.equal('2017/07/24 13:32:40:/home15 | 2017/07/24 13:32:40:/home14 | 2017/07/24 13:32:40:/home13 | 2017/07/24 13:32:40:/home12 | 2017/07/24 13:32:40:/home11 | 2017/07/24 13:32:40:/home10 | 2017/07/24 13:32:40:/home9 | 2017/07/24 13:32:40:/home8 | 2017/07/24 13:32:40:/home7 | 2017/07/24 13:32:40:/home6 | 2017/07/24 13:32:40:/home5 | 2017/07/24 13:32:40:/home4 | 2017/07/24 13:32:40:/home3 | 2017/07/24 13:32:40:/home2 | 2017/07/24 13:32:40:/home1');
  });


});
