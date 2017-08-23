import pdfMakeConfig from './pdfMakeConfig.json';

let PdfGenerator = function($log, $q, Data, pdfMake) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('PdfGenerator');

  // pdfMake.fonts = {
  //   Montserrat: {
  //     normal: 'Montserrat-Regular.ttf',
  //     bold: 'Montserrat-Bold.ttf'
  //   },
  // };

  pdfMake.fonts = {
    Montserrat: {
      normal: 'Montserrat-Regular.ttf',
      bold: 'Montserrat-Bold.ttf'
    },
    Nehama: {
      normal: 'Nehama.ttf',
      bold: 'Nehama.ttf'
    },
  };

  // Regular expression to match shortcodes in PDF Template
  const reShortcode = /\{\!\!\s?([a-zA-Z0-9\.\-\_]+)\s?\!\!\}/g;

  // margin/border: [ left, top, right, bottom ]
  let config = angular.fromJson(pdfMakeConfig);

  let extractShortCodeFromTemplate = ( iTemplatePDFString ) => {
    let shortCodeList = [];

    let match = reShortcode.exec(iTemplatePDFString);
    while ( match !== null ) {
      $log.log(match);
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

        $log.warn('shortCodeData=', shortCodeData);

        for (let shortCodeId of Object.keys(shortCodeData)) {

          $log.warn('TONIO 0 shortCode=', shortCodeData[shortCodeId]);
          $log.warn('TONIO 01 shortCode=', encodeURIComponent(shortCodeData[shortCodeId]));
          // shortCodeData[shortCodeId] = encodeURIComponent(shortCodeData[shortCodeId]);

          shortCodeData[shortCodeId] = shortCodeData[shortCodeId].replace(/\\"/g, (match, shortcode) => {
            return '\\\\"';
          });

          $log.warn('TONIO 1 shortCode=', shortCodeData[shortCodeId]);
          // shortCodeData[shortCodeId] = encodeURIComponent(shortCodeData[shortCodeId]);

        }


        $log.warn('BEFORE  deferred.resolve(shortCodeData)');
        deferred.resolve(shortCodeData);
      },
      (error) => {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  let replaceShortCodeValue = ( iTemplatePDFString, iShortCodeList ) => {
    $log.log('replaceShortCodeValue()  iShortCodeList=', iShortCodeList);

    let templacePdfWithData = iTemplatePDFString.replace(reShortcode, (match, shortcode, test, test2) => {
      // $log.warn('test=', test, 'test2=', test2 , '    match=', match, '    shortcode=', shortcode, '   iShortCodeList[shortcode]=',iShortCodeList[shortcode]);
      // return decodeURIComponent(iShortCodeList[shortcode]);
      return iShortCodeList[shortcode];
    });

    $log.log('replaceShortCodeValue()  templacePdfWithData=', templacePdfWithData);
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

              let finalPdfTemplate = {};
                finalPdfTemplate = angular.fromJson(pdfTemplateWithDataAndConfig);
                //finalPdfTemplate = decodeURIComponent(finalPdfTemplate);



              $log.log('generatePDF 0');
              finalPdfTemplate.footer = config.footer;
              finalPdfTemplate.styles = config.styles;
              finalPdfTemplate.defaultStyle = config.defaultStyle;
              finalPdfTemplate.images = config.images;
              finalPdfTemplate.pageMargins = config.pageMargins;

              $log.log('generatePDF 1');
              let title = (finalPdfTemplate.info && finalPdfTemplate.info.title) ? finalPdfTemplate.info.title : 'Potentialife';
              pdfMake.createPdf(finalPdfTemplate).download(title);
              $log.log('generatePDF 2');
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
