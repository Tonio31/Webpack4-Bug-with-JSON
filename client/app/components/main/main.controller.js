class MainController {
  constructor($log, ZendeskWidget) {
    'ngInject';

    $log.info('main controller');

    ZendeskWidget.show();

    // this.doCustomWidgetStuff = function() {
    //   ZendeskWidget.identify({
    //     name: 'Steve',
    //     email: 'steve@steve.com',
    //     externalId: '1234',
    //   });
    //   ZendeskWidget.activate({ hideOnClose:true });
    // };


  }
}

export default MainController;
