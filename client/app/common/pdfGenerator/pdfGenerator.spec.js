import pdfGeneratorModule from './pdfGenerator';

describe('pdfGenerator', () => {
  let $rootScope, $scope;
  let pdfMake, PdfGenerator, Data;

  let shortCodeListFromServer = {
    'l1.m1.s8.textbox.chosen_strength_1': 'Curiosity',
    'l1.m1.s8.textbox.chosen_strength_2': 'Honesty',
    'l1.m1.s8.textbox.chosen_strength_3': 'Love'
  };

  let templatePDFString = `{
    "data": {
      "content": [
        {
          "style": "tableNote",
          "table": {
            "widths": "{!!config tableNoteWidth !!}",
            "body": [
              [
                {
                  "text": "Observe",
                  "border": "{!!config cellHeaderBorder !!}"
                },
                {
                  "text": "Make a note",
                  "border": "{!!config cellHeaderBorder !!}"
                },
                {
                  "image": "tick",
                  "border": "{!!config cellHeaderBorder !!}"
                }
              ],
              [
                {
                  "stack": [
                    {
                      "text": [
                        {
                          "text": "{!! l1.m1.s8.textbox.chosen_strength_1 !!}, {!! l1.m1.s8.textbox.chosen_strength_2 !!}, {!! l1.m1.s8.textbox.chosen_strength_3 !!}",
                          "style": "shortCode"
                        }
                      ],
                      "style": "textTableNote"
                    }
                  ],
                  "style": "tableNote",
                  "border": "{!!config cellContentTopBorder !!}"
                },
                {
                  "text": "",
                  "border": "{!!config cellContentTopBorder !!}"
                },
                {
                  "image": "circleWithSpaceTopBottom",
                  "border": "{!!config cellContentTopBorder !!}"
                }
              ]
            ]
          }
        }
      ]
    }
  }`;

  let spies = {
    PdfGenerator: {},
    pdfMake: {}
  };

  beforeEach(window.module(pdfGeneratorModule));
  beforeEach(inject(($injector) => {
    PdfGenerator = $injector.get('PdfGenerator');
    Data = $injector.get('Data');
    pdfMake = $injector.get('pdfMake');

    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();

    let getShortCodeListForPDFGETRequest = {
      find: (input, callback) => {
        expect(input).to.deep.equal({
          shortcodes: angular.toJson([ 'l1.m1.s8.textbox.chosen_strength_1',
            'l1.m1.s8.textbox.chosen_strength_2',
            'l1.m1.s8.textbox.chosen_strength_3' ])
        });
        return callback(shortCodeListFromServer);
      }
    };

    sinon.stub(Data, 'getShortCodeListForPDF', () => {
      return getShortCodeListForPDFGETRequest;
    });

  }));

  describe('pdfGenerator Factory', () => {

    it('getShortCodeList() calls the server and returns a promise with the list of shortcodes', sinon.test( (done) => {

      PdfGenerator.getShortCodeList(templatePDFString).then( (shortcodeList) => {
        expect(shortcodeList).to.equal(shortCodeListFromServer);
        done();
      },
      () => {
        assert.fail(0, 1, 'We should not return an error if the server status:ok');
        done();
      });

      $scope.$digest();
    }));

    it('extractShortCodeFromTemplate() extract a list of shortcode from a string', ( () => {
      let shortCodeList = PdfGenerator.extractShortCodeFromTemplate( templatePDFString );
      expect(shortCodeList).to.deep.equal([
        'l1.m1.s8.textbox.chosen_strength_1',
        'l1.m1.s8.textbox.chosen_strength_2',
        'l1.m1.s8.textbox.chosen_strength_3'
      ]);
    }));

    it('replaceShortCodeValue() replace the shortcodes from a string', ( () => {

      let templatePDF = '"text": "{!! l1.m1.s8.textbox.chosen_strength_1 !!}, {!! l1.m1.s8.textbox.chosen_strength_2 !!}, {!!config cellContentTopBorder !!}",';

      let templateWithData = PdfGenerator.replaceShortCodeValue( templatePDF, shortCodeListFromServer );
      expect(templateWithData).to.equal('"text": "Curiosity, Honesty, {!!config cellContentTopBorder !!}",');
    }));

    it('replaceConfigValue() replace the config from a string', ( () => {

      let config = {
        cellContentTopBorder: '[ 30, 10, 25 ]'
      };
      let templatePDF = '"text": "{!! l1.m1.s8.textbox.chosen_strength_1 !!}, {!! l1.m1.s8.textbox.chosen_strength_2 !!}, "{!!config cellContentTopBorder !!}",';

      let templateWithConfig = PdfGenerator.replaceConfigValue( templatePDF, config );
      expect(templateWithConfig).to.equal('"text": "{!! l1.m1.s8.textbox.chosen_strength_1 !!}, {!! l1.m1.s8.textbox.chosen_strength_2 !!}, [ 30, 10, 25 ],');
    }));

    it('generatePDF() calls all the functions to generate a PDF', ( sinon.test(() => {
      let templateFromServer = angular.fromJson(templatePDFString);

      let getLifeActPDFGETRequest = {
        get: (input, callback) => {
          expect(input).to.deep.equal({});
          return callback(templateFromServer);
        }
      };

      sinon.stub(Data, 'getLifeActPDF', () => {
        return getLifeActPDFGETRequest;
      });

      spies.pdfMake.createPdf = sinon.stub(pdfMake, 'createPdf', () => {
        return {
          open: () => {},
          download: () => {}
        };
      });

      PdfGenerator.generatePDF( 'urlOfTemplatehgfd' );

      $scope.$digest();

      sinon.assert.calledWith(spies.pdfMake.createPdf);
    })));

  });


});
