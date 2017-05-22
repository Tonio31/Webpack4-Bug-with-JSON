import MenuModule from './menu';

describe('Menu', () => {
  let Menu, Data, User;
  let $rootScope;
  let scope;

  let menuData = require('app/mockBackEndResponse/4/menu.json');

  beforeEach(window.module(MenuModule));
  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    Menu = $injector.get('Menu');
    Data = $injector.get('Data');
    User = $injector.get('User');

    sinon.stub(User, 'getUserId', () => { return 12; } );

    sinon.stub(Data, 'getMenu', () => {

      let myObj = {
        get: function(input, callback) {
          return callback(this.data);
        },
        data: menuData
      };

      return myObj;
    });
  }));

  describe('Menu Factory', () => {
      // Factory specs

    it('getMenu returns an empty object', () => {
      expect(Menu.getMenu()).to.deep.equal({ data: {} });
    });

    it('isMenuRetrieved returns false if the menu hasnt been retrieved', () => {
      expect(Menu.isMenuRetrieved()).to.equal(false);
    });

    // This will test the retrieval of the menuData and the convertMenuData function
    it('retrieveMenuAndReturnStates returns a promise on the menu', (done) => {

      Menu.retrieveMenuAndReturnStates().then( (states) => {
        expect(Menu.isMenuRetrieved()).to.equal(true);
        expect(states.length).to.eq(51);
        expect(states[0].name).to.eq('/potentialife-course/cycle-1/lifemap');

        // The menu object has been instantiated if the promise from retrieveMenuAndReturnStates has been resolved
        let menu = Menu.getMenu();
        expect(menu.data.children[0].children[0].fullUrl).to.equal('/potentialife-course/cycle-1/lifemap');

        expect(menu.data.children.length).to.equal(3);

        done();
      },
        (error) => {
          assert.fail( 0, 1, 'The promise from getMenuPromise() should not fail' );
          expect(error).te.be(true);
          done();
        }
      );

      scope.$digest();
    });



    it('getMenuPromise returns a reject promise if the menu is not returned correctly by resource service', (done) => { // erase if removing this.name from the controller

      let errorMessage = 'There was an error retrieving the menu';

      Data.getMenu.restore();
      sinon.stub(Data, 'getMenu', () => {
        return {
          get: function(input, callback, errorCallBack) {
            return errorCallBack(errorMessage);
          }
        };
      });


      Menu.retrieveMenuAndReturnStates().then( () => {
        assert.fail( 0, 1, 'The promise from getMenuPromise() should fail' );
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
