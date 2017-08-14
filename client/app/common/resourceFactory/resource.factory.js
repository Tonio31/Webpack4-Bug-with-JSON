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
                                TOKEN_SURVEY ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('ResourceFactory');

  let buildApiUrl = (iTypeOfApi, iUserId = false) => {
    let apiUrl = `${WEBSITE_CONFIG.apiUrl}/${iTypeOfApi}`;

    if ( iUserId ) {
      apiUrl += `/${User.getUserId()}`;
    }

    return apiUrl;
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
  let getMenu = () => {
    $log.log('getMenu()');
    return $resource(buildApiUrl('menu', true));
  };

  let getParticipantDetails = () => {

    let deferred = $q.defer();
    $log.log('getParticipantDetails()');
    $resource(buildApiUrl('participants', true)).get( (userData) => {
      $log.log('getParticipantDetails() retrieved successfully');

      saveUserData(userData.data);

      deferred.resolve();
    },
    (error) => {
      $log.error('getParticipantDetails() error=', error);
      deferred.reject(error);
    });

    return deferred.promise;
  };


  let getDynamicContentPromise = ( iEndPointUrl, iIsArray, iOptionalParameters = {} ) => {
    $log.log('getDynamicContentPromise iEndPointUrl=', iEndPointUrl, '  iIsArray=', iIsArray, '  iOptionalParameters=', iOptionalParameters);

    let deferred = $q.defer();

    if ( iIsArray ) {
      $resource(buildApiUrl(iEndPointUrl), iOptionalParameters).query().$promise.then( (data) => {
        deferred.resolve(data);
      },
      (error) => {
        $log.error('getDynamicContentPromise error=', error);

        deferred.reject(error);
      });
    }
    else {
      $resource(buildApiUrl(iEndPointUrl), iOptionalParameters).get().$promise.then( (data) => {
        deferred.resolve(data);
      },
      (error) => {
        $log.error('getDynamicContentPromise error=', error);

        deferred.reject(error);
      });
    }

    return deferred.promise;
  };

  let getFriendSurveyContent = ( ioGetParameters ) => {
    // Get Token from URL or local storage
    let urlParameters = $location.search();
    let tokenSurvey = '';

    if ( urlParameters.hasOwnProperty(TOKEN_SURVEY) ) {
      tokenSurvey = urlParameters[TOKEN_SURVEY];
      $localStorage[TOKEN_SURVEY] = tokenSurvey;
    }
    else if ( angular.isDefined($localStorage[TOKEN_SURVEY]) ) {
      tokenSurvey = $localStorage[TOKEN_SURVEY];
    }

    $log.warn('getFriendSurveyContent() - tokenSurvey=', tokenSurvey);

    if ( tokenSurvey ) {
      ioGetParameters[TOKEN_SURVEY] = tokenSurvey;
    }

    return getDynamicContentPromise( 'survey', false, ioGetParameters );
  };

  let getLifeActPDF = (iUrl) => {
    return $resource(iUrl);
  };

  let getShortCodeListForPDF = () => {
    return $resource(buildApiUrl('program_data'));
  };

  // **********************************  POST  *************************************** //
  // Theses resource are to be used with $save method only, because we return an instance
  // of the function, we can't use it to do get method

  let getUserAuthData = () => {
    $log.log('getUserAuthData()');
    return new ($resource(buildApiUrl('authenticate')))();
  };

  let sendRecoverPasswordEmail = () => {
    $log.log('sendRecoverPasswordEmail()');
    return new ($resource(buildApiUrl('password/email')))();
  };

  let resetPassword = () => {
    $log.log('resetPassword()');
    return new ($resource(buildApiUrl('password/reset')))();
  };

  let logout = () => {
    $log.log('logout()');
    return new ($resource(buildApiUrl('logout')))();
  };

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

  // Used to save data for a step and mark the step as completed for the current user.
  let updateStep = () => {
    $log.log('updateStep()');
    return new ($resource(buildApiUrl('program_data')))();
  };

  // Used to save data for a step without setting the step as completed
  let partialUpdateStep = () => {
    $log.log('partialUpdateStep()');
    return new ($resource(buildApiUrl('partial_save')))();
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
    getMenu,
    getUserAuthData,
    sendRecoverPasswordEmail,
    resetPassword,
    logout,
    getDynamicContentPromise,
    getFriendSurveyContent,
    saveUserData,
    getParticipantDetails,
    updateStep,
    partialUpdateStep,
    buildApiUrl,
    viaSurvey,
    checkAuthOnOtherPlWebsite,
    getLifeActPDF,
    getShortCodeListForPDF
  };
};

export default ResourceFactory;
