let ResourceFactory = function($log, $q, $resource, User, WEBSITE_CONFIG) {
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

  // **********************************  GET  *************************************** //
  let getMenu = () => {
    $log.log('getMenu()');
    return $resource(buildApiUrl('menu', true));
  };

  let getParticipantDetails = () => {
    $log.log('getParticipantDetails()');
    return $resource(buildApiUrl('participants', true)).get( (userData) => {
      $log.log('getParticipantDetails() retrieved successfully');

      let userToSave = {
        id: userData.data.id,
        firstName: userData.data['first_name'], // eslint-disable-line dot-notation
        lastName: userData.data['last_name'], // eslint-disable-line dot-notation
        email: userData.data.email,
        gender: userData.data.gender,
        companyBanner: userData.data.companyBanner
      };

      User.setUser(userToSave);
    },
      (error) => {
        $log.error('getParticipantDetails() error=', error);
      });
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

  let updateStep = () => {
    $log.log('updateStep()');
    return new ($resource(buildApiUrl('program_data')))();
  };

  // The following is used by ViaSurvey module
  let viaSurvey = () => {
    return new ($resource('', {}, {
      register: {
        method: 'POST',
        url: `${WEBSITE_CONFIG.apiViaSurvey}RegisterUser`,
        transformResponse: (userId) => {
          return {
            userId: userId
          };
        }
      },
      login: {
        method: 'POST',
        url: `${WEBSITE_CONFIG.apiViaSurvey}LoginUser`,
        transformResponse: (loginKeyRawString) => {
          return {
            loginKey: angular.fromJson(loginKeyRawString)
          };
        }
      },
      startSurvey: {
        method: 'POST',
        url: `${WEBSITE_CONFIG.apiViaSurvey}StartSurvey`,
        transformResponse: (sessionKeyRawString) => {
          return {
            sessionKey: angular.fromJson(sessionKeyRawString)
          };
        }
      },
      getQuestions: {
        method: 'POST',
        url: `${WEBSITE_CONFIG.apiViaSurvey}GetQuestions`,
        transformResponse: (questions) => {
          return {
            questionsList: angular.fromJson(questions)
          };
        }
      },
      submitAnswers: {
        method: 'POST',
        url: `${WEBSITE_CONFIG.apiViaSurvey}SubmitAnswers`,
        transformResponse: (response) => {
          $log.log('SubmitAnswers response=', response);
          return {
            response: angular.fromJson(response)
          };
        }
      }
    }))();
  };

  return {
    getMenu,
    getUserAuthData,
    sendRecoverPasswordEmail,
    resetPassword,
    getDynamicContentPromise,
    getParticipantDetails,
    updateStep,
    buildApiUrl,
    viaSurvey
  };
};

export default ResourceFactory;
