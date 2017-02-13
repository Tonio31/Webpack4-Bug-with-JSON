import MenuModule from './menu'

describe('Menu', () => {
    let Menu, Data, UserInfo;
    let $rootScope, $location, $componentController, $compile, $q;
    let scope;

    var menuData = require('app/mockBackEndResponse/menu-1.json');


    beforeEach(window.module(MenuModule));
    beforeEach(inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();
        $componentController = $injector.get('$componentController');
        $location = $injector.get('$location');
        $compile = $injector.get('$compile');
        Menu = $injector.get('Menu');
        Data = $injector.get('Data');
        UserInfo = $injector.get('UserInfo');
        $q = $injector.get('$q');


        sinon.stub(UserInfo, 'getUserid', () => 12 );

        sinon.stub(Data, 'getMenu', () => {

          var myObj = {
            get: function(input, callback){
              return callback(this.data);
            },
            data: menuData
          }

          return myObj;
        });


    }));

    describe('Factory', () => {
        // Factory specs

      it('getMenu returns an empty object', () => {
          expect(Menu.getMenu()).to.deep.equal({ data: {} });
      });


      //This will test the retrieval of the menuData and the convertMenuData function
      it('getMenuPromise returns a promise on the menu', (done) => {

        Menu.getMenuPromise().then( (menuData) => {
            expect(menuData.children[0].children[0].fullUrl).to.equal('/potentialife-course/cycle-1/lifemap');
            expect(menuData.fullUrl).to.eq('/potentialife-course');

            //Check that getMenu() returns data
            var myMenu = Menu.getMenu();
            expect(myMenu.data.children.length).to.equal(3);

            //Test that we assign the menu to the good variable
            expect(menuData).to.deep.equal(myMenu.data);

            done();
          },
          (error) => {
            assert.fail( 0, 1, "The promise from getMenuPromise() should not fail" );
            expect(error).te.be(true);
            done();
          }
        );

        scope.$digest();
      });



      it('getMenuPromise returns a reject promise if the menu is not returned correctly by resource service', (done) => { // erase if removing this.name from the controller

        var errorMessage = "There was an error retrieving the menu";

        Data.getMenu.restore();
        sinon.stub(Data, 'getMenu', () => {
          return {
            get: function(input, callback, errorCallBack){
              return errorCallBack(errorMessage);
            }
          };
        });


        Menu.getMenuPromise().then( (menuData) => {
            assert.fail( 0, 1, "The promise from getMenuPromise() should fail" );
            done();
          },
          (error) => {
            expect(error).to.equal(errorMessage);
            done();
          }
        );

        scope.$digest();
      });


    });


});
