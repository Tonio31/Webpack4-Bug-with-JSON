import angular from 'angular';

let resourceServiceModule = angular.module('logDecorator', [
])
  .config( function($provide){
    "ngInject";
    $provide.decorator("$log", function( $filter, $delegate) {
      "ngInject";


      var enchanceLoggerFn = function( $log ) {


        var _$log = (function( $log )
        {
          return {
            log   : $log.log,
            info  : $log.info,
            warn  : $log.warn,
            debug : $log.debug,
            error : $log.error
          };
        })( $log );


        var concatenateArgs = function(args) {
          let output = '';
          for (let arg of args) {

            if ( angular.isString(arg) ) {
              output += `${arg}`;
            }
            else if ( angular.isDate(arg) ) {
              output += $filter('date')(arg, "yyyy/MM/dd HH:mm:ss.sss").toString();
            }
            else if ( angular.isObject(arg) ) {
              output += angular.toJson(arg);
            }
            else {
              //Numbers, boolean, null, undefined
              output += `${arg}`;
            }


          }

          return output;
        }


        /**
         * Partial application to pre-capture a logger function
         */
        var prepareLogFn = function( logFn, className  ) {

          className = angular.isDefined(className) ? className : "";

          /**
           * Invoke the specified `logFn<` with the supplant functionality...
           */
          var enhancedLogFn = function () {
            var args = Array.prototype.slice.call(arguments);
            let now  = $filter('date')(new Date(), "yyyy/MM/dd HH:mm:ss.sss", "UTC/GMT").toString();

              // prepend a timestamp to the original output message
            //args[0] = supplant("{0} - {1}{2}", [ now, className, args[0] ]);
            args[0] = `${now} - ${className}${args[0]}`;


            let test2 = concatenateArgs(args);

            logFn.call( null,  test2 );
          };

          // Special... only needed to support angular-mocks expectations
          enhancedLogFn.logs = [ ];

          return enhancedLogFn;
        };

        /**
         * Support to generate class-specific logger instance with classname only
         *
         * @param name
         * @returns Object wrapper facade to $log
         */
        let getInstance = function( className ) {
          className = angular.isDefined(className) ? className + "::" : "";

          return {
            log   : prepareLogFn( _$log.log,    className ),
            info  : prepareLogFn( _$log.info,   className ),
            warn  : prepareLogFn( _$log.warn,   className ),
            debug : prepareLogFn( _$log.debug,  className ),
            error : prepareLogFn( _$log.error,  className )
          };
        };

        $log.log   = prepareLogFn( $log.log );
        $log.info  = prepareLogFn( $log.info );
        $log.warn  = prepareLogFn( $log.warn );
        $log.debug = prepareLogFn( $log.debug );
        $log.error = prepareLogFn( $log.error );

        $log.getInstance = getInstance;

        return $log;
      };




      enchanceLoggerFn( $delegate );

      return $delegate;


    });
  })
.name;

export default resourceServiceModule;
