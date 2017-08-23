import pdfMakeConfig from './pdfMakeConfig.json';

let PdfGenerator = function($log, $q, Data, pdfMake) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('PdfGenerator');

  pdfMake.fonts = {
    Rubik: {
      normal: 'Rubik-Regular.ttf',
      bold: 'Rubik-Bold.ttf',
      italics: 'Rubik-Regular.ttf',
      bolditalics: 'Rubik-Bold.ttf'
    }
  };

  // Regular expression to match shortcodes in PDF Template
  const reShortcode = /\{\!\!\s?([a-zA-Z0-9\.\-\_]+)\s?\!\!\}/g;

  // margin/border: [ left, top, right, bottom ]
  let config = angular.fromJson(pdfMakeConfig);

  let extractShortCodeFromTemplate = ( iTemplatePDFString ) => {
    let shortCodeList = [];

    let match = reShortcode.exec(iTemplatePDFString);
    while ( match !== null ) {
      shortCodeList.push(match[1]);
      match = reShortcode.exec(iTemplatePDFString);
    }

    return shortCodeList;
  };

  // Parse the template and get the list of shortcode used in this template to be able to replace them
  let getShortCodeList = ( iTemplatePDFString ) => {

    let shortCodeList = extractShortCodeFromTemplate(iTemplatePDFString);

    let deferred = $q.defer();
    Data.getShortCodeListForPDF().find( { shortcodes: angular.toJson(shortCodeList) },
      (shortCodeData) => {

        try {
          $log.log('shortCodeData=', shortCodeData);
          for ( let shortCodeId of Object.keys(shortCodeData) ) {
            if ( angular.isString(shortCodeData[shortCodeId]) ) {
              // As we will later on convert the whole pdfTemplate string back to a javascript object,
              // the " will terminate JSON String too early and screw up the formatting, no it is necessary
              // to escape them.
              shortCodeData[shortCodeId] = shortCodeData[shortCodeId].replace(/((\\)*("|'))|([\n\r])/g, (match) => {
                let replaceString = '';
                if ( match.includes('\'') ) {
                  replaceString = '\'';
                }
                else if ( match.includes('\"') ) {
                  replaceString = '\\"';
                }
                else if ( match.includes('\n') || match.includes('\r') ) {
                  replaceString = '. ';
                }

                return replaceString;
              });
            }
            else if ( angular.isUndefined(shortCodeData[shortCodeId]) || shortCodeData[shortCodeId] === null ) {
              shortCodeData[shortCodeId] = '';
            }
          }

          deferred.resolve(shortCodeData);
        }
        catch (error) {
          $log.error('error replacing shortcodes');
          deferred.reject(error);
        }

      },
      (error) => {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  let replaceShortCodeValue = ( iTemplatePDFString, iShortCodeList ) => {
    $log.log('replaceShortCodeValue()  iShortCodeList=', iShortCodeList);

    let templacePdfWithData = iTemplatePDFString.replace(reShortcode, (match, shortcode) => {
      return iShortCodeList[shortcode];
    });

    return templacePdfWithData;
  };

  let replaceConfigValue = ( iTemplatePDFString, iGlobalConfig ) => {
    $log.log('replaceConfigValue()  iGlobalConfig=', iGlobalConfig);

    const reConfig = /"\{\!\!config\s?([a-zA-Z0-9\.\-\_]+)\s?\!\!\}"/g;
    let templacePdfWithConfig = iTemplatePDFString.replace(reConfig, (match, configStr) => {
      return iGlobalConfig[configStr];
    });

    return templacePdfWithConfig;
  };

  // ***************************************************************************************************** //
  //                                      PUBLIC INTERFACE
  let generatePDF = ( iDocURL ) => {
    $log.log(`generatePDF for iDocID = ${iDocURL}`);

    Data.getLifeActPDF(iDocURL).get( {},
      (pdfTemplate) => {
        let pdfTemplateAsString = angular.toJson(pdfTemplate.data);

        getShortCodeList(pdfTemplateAsString).then(
          (shortCodeList) => {

            let pdfTemplateWithDataAndConfig = '';

            try {
              let pdfTemplateWithData = replaceShortCodeValue(pdfTemplateAsString, shortCodeList);
              pdfTemplateWithDataAndConfig = replaceConfigValue(pdfTemplateWithData, config.global);

              let finalPdfTemplate = angular.fromJson(pdfTemplateWithDataAndConfig);

              finalPdfTemplate.footer = config.footer;
              finalPdfTemplate.styles = config.styles;
              finalPdfTemplate.defaultStyle = config.defaultStyle;
              finalPdfTemplate.images = config.images;
              finalPdfTemplate.pageMargins = config.pageMargins;

              let title = (finalPdfTemplate.info && finalPdfTemplate.info.title) ? finalPdfTemplate.info.title : 'Potentialife';
              pdfMake.createPdf(finalPdfTemplate).download(title);
              pdfMake.createPdf(finalPdfTemplate).open();
            }
            catch (e) {
              $log.log('pdfTemplateWithDataAndConfig=', pdfTemplateWithDataAndConfig);
              $log.error(e);
            }

          },
          (error) => {
            $log.error('Error while retrieving shortcode data error=', error);
          }
        );
      },
      (error) => {
        $log.error('Error retrieving iDocURL=', iDocURL, '    error=', error);
      });
  };


  return {
    // Public Interface
    generatePDF,

    // Private, added here to facilitate unit test
    extractShortCodeFromTemplate,
    getShortCodeList,
    replaceShortCodeValue,
    replaceConfigValue
  };

};

export default PdfGenerator;
