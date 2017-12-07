let BugsnagUtilsFactory = function( $log,
                                    $filter,
                                    bugsnag,
                                    $localStorage,
                                    USER_ID ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance( 'BugsnagUtilsFactory' );

  const userID = $localStorage[USER_ID] || 'XX';
  const STATE_HISTORY = `${userID}-stateHistory`;
  const MAX_HISTORY_LOCAL_STORAGE = 15;
  let stateList = $localStorage[STATE_HISTORY] || [];

  let addStateForHistory = (iToStateName) => {

    let now = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss', 'UTC/GMT').toString();

    if ( stateList.length >= MAX_HISTORY_LOCAL_STORAGE ) {
      // Remove last element to keep maximum 15
      stateList.splice(-1, 1);
    }

    stateList.unshift(`${now}:${iToStateName}`);
    $localStorage[STATE_HISTORY] = stateList;
  };

  addStateForHistory('Full Page Refresh or Initial Load');

  let getStatesHistoryAsString = () => {
    return stateList.join(' | ');
  };

  let notify = (iName, iMessage, iMetaData, iSeverity) => {
    $log.log('notify - iName=', iName, '   iMessage=', iMessage, '   iMetaData=', iMetaData, '   iSeverity=', iSeverity);
    bugsnag.notify(iName, iMessage, iMetaData, iSeverity);
  };


  return {
    addStateForHistory,
    getStatesHistoryAsString,
    notify
  };

};

export default BugsnagUtilsFactory;
