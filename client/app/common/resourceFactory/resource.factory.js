let ResourceFactory = function( $log,
                                $q,
                                $resource,
                                $stateParams,
                                $state,
                                $localStorage,
                                $location,
                                $httpParamSerializer,
                                $window,
                                User,
                                STATES,
                                WEBSITE_CONFIG,
                                SURVEY_360 ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('ResourceFactory');

  let buildApiUrl = (iTypeOfApi) => {
    return `${WEBSITE_CONFIG.apiUrl}/${iTypeOfApi}`;
  };

  let saveUserData = (iUserDataFromServer) => {
    let userToSave = {
      id: iUserDataFromServer.id,
      firstName: iUserDataFromServer.first_name,
      lastName: iUserDataFromServer.last_name,
      email: iUserDataFromServer.email,
      gender: iUserDataFromServer.gender,
      company: iUserDataFromServer.company,
      division: iUserDataFromServer.division,
      cohort: iUserDataFromServer.cohort,
      companyBanner: iUserDataFromServer.companyBanner
    };

    User.setUser(userToSave);

    // Set up google analytics to link the data to a specific userId
    $window.ga('set', 'userId', userToSave.id);
    $window.ga('set', WEBSITE_CONFIG.GA_DIMENSIONS.COMPANY, userToSave.company);
    $window.ga('set', WEBSITE_CONFIG.GA_DIMENSIONS.DIVISION, userToSave.division);
    $window.ga('set', WEBSITE_CONFIG.GA_DIMENSIONS.COHORT, userToSave.cohort);
  };

  // **********************************  GET  *************************************** //
  let getDynamicContentPromise = ( iEndPointUrl, iIsArray, iOptionalParameters = {} ) => {
    $log.log('getDynamicContentPromise iEndPointUrl=', iEndPointUrl, '  iIsArray=', iIsArray, '  iOptionalParameters=', iOptionalParameters);

    let deferred = $q.defer();

    if ( iIsArray ) {
      $resource(buildApiUrl(iEndPointUrl), iOptionalParameters).query().$promise.then( (data) => {
        deferred.resolve(data);
      },
      (error) => {
        $log.error(`getDynamicContentPromise() error:[${error.status},${error.statusText}]`);

        deferred.reject(error);
      });
    }
    else {
      $resource(buildApiUrl(iEndPointUrl), iOptionalParameters).get().$promise.then( (data) => {
        deferred.resolve(data);
      },
      (error) => {
        $log.error(`getDynamicContentPromise() error:[${error.status},${error.statusText}]`);

        deferred.reject(error);
      });
    }

    return deferred.promise;
  };

  let getFriendSurveyContent = ( ioGetParameters ) => {
    // Get Token from URL or local storage
    let urlParameters = $location.search();
    let tokenSurvey = '';

    if ( urlParameters.hasOwnProperty(SURVEY_360.TOKEN) ) {
      tokenSurvey = urlParameters[SURVEY_360.TOKEN];
      $localStorage[SURVEY_360.TOKEN] = tokenSurvey;
    }
    else if ( angular.isDefined($localStorage[SURVEY_360.TOKEN]) ) {
      tokenSurvey = $localStorage[SURVEY_360.TOKEN];
    }

    $log.log('getFriendSurveyContent() - tokenSurvey=', tokenSurvey);

    if ( tokenSurvey ) {
      ioGetParameters[SURVEY_360.TOKEN] = tokenSurvey;
      return getDynamicContentPromise( 'survey', false, ioGetParameters );
    }

    return $q.reject({
      status: 401,
      statusText: SURVEY_360.ERROR_NO_TOKEN_IN_URL
    });
  };

  let getLifeActPDF = (iUrl) => {
    return $resource(iUrl);
  };

  let getMenu = () => {
    $log.log('getMenu()');
    return $resource(buildApiUrl('menu'));
  };

  let getParticipantDetails = () => {

    let deferred = $q.defer();
    $log.log('getParticipantDetails()');
    $resource(buildApiUrl('participants')).get( (userData) => {
      try {
        $log.log('getParticipantDetails() retrieved successfully userData=', userData);
        saveUserData(userData.data);
        deferred.resolve();
      }
      catch (error) {
        $log.error(`getParticipantDetails() error:[${error.status},${error.statusText}]`);
        deferred.reject(error);
      }
    },
    (error) => {
      $log.error(`getParticipantDetails() error:[${error.status},${error.statusText}]`);
      deferred.reject(error);
    });

    return deferred.promise;
  };

  let getShortCodeListForPDF = () => {
    return $resource(buildApiUrl('program_data'), {}, {
      find: {
        method: 'GET',
        isArray: false,
        interceptor: {
          response: (response) => {
            $log.warn('response=', response);
            return response.data;
          }
        }
      }
    });
  };

  let isMaintenanceDisabled = () => {
    $log.log('isMaintenanceDisabled()');

    let deferred = $q.defer();

    if ( $location.search().overwriteMaintenanceMode ) {
      $log.warn('Overwrite MaintenanceMode, attempt to load the login page or home page');
      deferred.resolve();
    }
    else {
      $resource(buildApiUrl('isMaintenanceDisabled')).get( () => {
        deferred.resolve();
      },
      (error) => {
        // http Interceptor will redirect to error page if this endpoint returns 503
        $log.error('Website is in Maintenance Mode error=', error);
      });
    }

    return deferred.promise;
  };

  // **********************************  POST  *************************************** //
  // Theses resource are to be used with $save method only, because we return an instance
  // of the function, we can't use it to do get method

  // Will query http://change.potentialife.com/api/index_v2.php to get auth information
  // @params: iWebsite - String (change | my)
  // @params: iTypeOfCheck - String (local.check_username_email | local.check_credentials | reset_pass_curl)
  let checkAuthOnOtherPlWebsite = (iWebsite, iTypeOfCheck) => {
    $log.log('checkAuthOnOtherPlWebsite() iWebsite=', iWebsite, '   iTypeOfCheck=', iTypeOfCheck);
    return new ($resource('', {}, {
      check: {
        method: 'POST',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: WEBSITE_CONFIG.OTHER_PL_SITES_API[iWebsite].apiUrl,
        params: {
          section: iTypeOfCheck
        },
        transformRequest: function(data) {
          return $httpParamSerializer(data);
        }
      }
    }))();
  };

  let getUserAuthData = () => {
    $log.log('getUserAuthData()');
    return new ($resource(buildApiUrl('authenticate')))();
  };

  let sendRecoverPasswordEmail = () => {
    $log.log('sendRecoverPasswordEmail()');
    return new ($resource(buildApiUrl('password/email')))();
  };

  let changePassword = (iAction) => {
    let action = 'reset';

    $log.log(`changePassword() iAction=${iAction}`);

    if (iAction === 'creation') {
      action = 'creation';
    }

    return new ($resource(buildApiUrl(`password/${action}`)))();
  };

  let logout = () => {
    $log.log('logout()');
    return new ($resource(buildApiUrl('logout')))();
  };

  // Used to save data for a step and mark the step as completed for the current user.
  let updateStep = ( iMarkStepAsCompleted ) => {
    $log.log('updateStep() iMarkStepAsCompleted=', iMarkStepAsCompleted);
    let postRequest = new ($resource(buildApiUrl('program_data')))();
    postRequest.markStepAsCompleted = iMarkStepAsCompleted ? iMarkStepAsCompleted : false;
    postRequest.fullUrl = $location.path();

    return postRequest;
  };

  // The following is used by ViaSurvey module
  let viaSurvey = ( iApi ) => {
    return new ($resource('', {}, {
      register: {
        method: 'POST',
        url: `${WEBSITE_CONFIG.viaSurvey.api}RegisterUser`,
        transformResponse: (userId) => {
          return {
            userId: userId
          };
        }
      },
      call: {
        method: 'POST',
        url: `${WEBSITE_CONFIG.viaSurvey.api}${iApi}`,
        transformResponse: (response) => {
          return {
            data: angular.fromJson(response)
          };
        }
      },
    }))();
  };

  return {
    buildApiUrl,
    changePassword,
    checkAuthOnOtherPlWebsite,
    getDynamicContentPromise,
    getFriendSurveyContent,
    getLifeActPDF,
    getMenu,
    getParticipantDetails,
    getShortCodeListForPDF,
    getUserAuthData,
    isMaintenanceDisabled,
    logout,
    saveUserData,
    sendRecoverPasswordEmail,
    updateStep,
    viaSurvey,
  };
};

export default ResourceFactory;
