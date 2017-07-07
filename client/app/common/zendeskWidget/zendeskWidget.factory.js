let ZendeskWidgetFactory = function( $log,
                                     $window ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('ZendeskWidgetFactory');

  const POTENTIALIFE_ACCOUNT_URL = 'potentialifehelp.zendesk.com';

  let init = () => {
    $log.log('init()');

    /*eslint-disable */
    $window.zEmbed || function(e, t) {
      var n, o, d, i, s, a = [], r = document.createElement("iframe");
      $window.zEmbed = function() {
        a.push(arguments)
      }, $window.zE = $window.zE || $window.zEmbed, r.src = "javascript:false", r.title = "", r.role = "presentation", (r.frameElement || r).style.cssText = "display: none", d = document.getElementsByTagName("script"), d = d[d.length - 1], d.parentNode.insertBefore(r, d), i = r.contentWindow, s = i.document;
      try {
        o = s
      } catch (e) {
        n = document.domain, r.src = 'javascript:var d=document.open();d.domain="' + n + '";void(0);', o = s
      }
      o.open()._l = function() {
        var o = this.createElement("script");
        n && (this.domain = n), o.id = "js-iframe-async", o.src = e, this.t = +new Date, this.zendeskHost = t, this.zEQueue = a, this.body.appendChild(o)
      }, o.write('<' + 'body onload="document._l();">'), o.close();
    }("https://assets.zendesk.com/embeddable_framework/main.js", POTENTIALIFE_ACCOUNT_URL);
    /*eslint-enable */
  };

  /**
   * hide: hide the widget from the user
   * https://developer.zendesk.com/embeddables/docs/widget/api#ze.hide
   */
  let hide = () => {
    $window.zE( () => {
      $log.log('hide()');
      $window.zE.hide();
    });
  };

  /**
   * show: show the widget to the user
   * https://developer.zendesk.com/embeddables/docs/widget/api#ze.show
   */
  let show = () => {
    $window.zE(() => {
      $log.log('show()');
      $window.zE.show();
    });
  };

  let setLocale = (iLang) => {
    $window.zE(() => {
      $log.log('setLocale()  iLang=', iLang);
      $window.zE.setLocale(iLang);
    });
  };

  /**
   * identify: will pre-populate Zendesk Chat with User name and email
   * @param iName: User Name (string)
   *   iEmail: User Email (string)
   *   [iOrganization: User Organization (string)] - Optional
   *
   * https://developer.zendesk.com/embeddables/docs/widget/api#ze.identify
   */
  let identify = (iName, iEmail, iOrganization) => {
    $window.zE(() => {
      $log.log(`identify()  iName=${iName}, iEmail=${iEmail}, iOrganization=${iOrganization}`);
      $window.zE.identify({
        name: iName,
        email: iEmail,
        organization: iOrganization
      });
    });
  };

  /**
   * activate: open the widget
   * @param iHideOnClose: hide the widjet after user close it (bool)
   *
   * https://developer.zendesk.com/embeddables/docs/widget/api#ze.activate
   */
  let activate = (iHideOnClose) => {
    $window.zE(() => {
      $log.log(`activate()  iHideOnClose=${iHideOnClose}`);
      $window.zE.activate({
        hideOnClose: iHideOnClose
      });
    });
  };

  return {
    init,
    hide,
    show,
    setLocale,
    activate,
    identify
  };
};

export default ZendeskWidgetFactory;
