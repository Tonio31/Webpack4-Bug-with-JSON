import MenuModule from './menu';

describe( 'Menu', () => {
  let Menu, Data, User;
  let $rootScope;
  let scope;

  let menuData = require( 'app/mockBackEndResponse/51/menu.json' );

  beforeEach( window.module( MenuModule ) );
  beforeEach( inject( ( $injector ) => {
    $rootScope = $injector.get( '$rootScope' );
    scope = $rootScope.$new();
    Menu = $injector.get( 'Menu' );
    Data = $injector.get( 'Data' );
    User = $injector.get( 'User' );

    sinon.stub( User, 'getUserId').callsFake( () => {
      return 12;
    } );

    sinon.stub( Data, 'getMenu').callsFake( () => {

      let myObj = {
        get: function( input, callback ) {
          return callback( this.data );
        },
        data: menuData
      };

      return myObj;
    } );
  } ) );

  describe( 'Menu Factory', () => {
    // Factory specs

    it( 'getMenu returns an empty object', () => {
      expect( Menu.getMenu() ).to.deep.equal( { data: {} } );
    } );

    it( 'isMenuRetrieved returns false if the menu hasnt been retrieved', () => {
      expect( Menu.isMenuRetrieved() ).to.equal( false );
    } );

    // This will test the retrieval of the menuData and the convertMenuData function
    it( 'retrieveMenuAndReturnStates returns a promise on the menu', ( done ) => {

      Menu.retrieveMenuAndReturnStates().then( ( states ) => {
        expect( Menu.isMenuRetrieved() ).to.equal( true );
        expect( states.length ).to.eq( 54 );
        expect( states[ 0 ].name ).to.eq( '/potentialife-course/cycle-1/lifemap' );

        // The menu object has been instantiated if the promise from retrieveMenuAndReturnStates has been resolved
        let menu = Menu.getMenu();
        expect( menu.data.children[ 0 ].children[ 0 ].fullUrl ).to.equal( '/potentialife-course/cycle-1/lifemap' );

        expect( menu.data.children.length ).to.equal( 3 );

        done();
      },
        ( error ) => {
          assert.fail( 0, 1, 'The promise from getMenuPromise() should not fail' );
          expect( error ).te.be( true );
          done();
        }
      );

      scope.$digest();
    } );


    it( 'getMenuPromise returns a reject promise if the menu is not returned correctly by resource service', ( done ) => {

      let errorMessage = 'There was an error retrieving the menu';

      Data.getMenu.restore();
      sinon.stub( Data, 'getMenu').callsFake( () => {
        return {
          get: function( input, callback, errorCallBack ) {
            return errorCallBack( errorMessage );
          }
        };
      } );


      Menu.retrieveMenuAndReturnStates().then( () => {
        assert.fail( 0, 1, 'The promise from getMenuPromise() should fail' );
        done();
      },
        ( error ) => {
          expect( error ).to.equal( errorMessage );
          done();
        }
      );

      scope.$digest();
    } );

    it( 'findFinalState returns a list of states object and modify hidden steps', () => {

      let menuDataReference = {
        id: 25,
        title: 'Module 31',
        name: 'Module 31',
        description: null,
        slug: 'module-21',
        order: 0,
        status: 'locked',
        fullUrl: '/potentialife-course/cycle-3/module-31',
        children: [
          {
            id: 33181,
            title: 'Step 8',
            name: '360 Feedback',
            description: 'Approx. 9999 mins',
            slug: 'step-8',
            order: 0,
            status: 'completed',
            fullUrl: '/potentialife-course/cycle-3/module-31/step-8'
          },
          {
            id: 33182,
            title: 'Step 8 - 2',
            name: 'Enter emails',
            description: 'Approx. 9999 mins',
            slug: 'step-8/2',
            order: 0,
            status: 'current',
            fullUrl: '/potentialife-course/cycle-3/module-31/step-8/2',
            hideStepInMenu: true
          },
          {
            id: 33183,
            title: 'Step 8 - 3',
            name: 'Your emails are sent',
            description: 'Approx. 9999 mins',
            slug: 'step-8/3',
            order: 0,
            status: 'locked',
            fullUrl: '/potentialife-course/cycle-3/module-31/step-8/3',
            hideStepInMenu: true
          }
        ]
      };

      let menuDataForTest = angular.copy( menuDataReference );
      let states = [];
      Menu.findFinalState( menuDataForTest, states );

      expect( states.length ).to.equal( 3 );
    } );


    it( 'computeMenuForDisplay() add level title at module level', () => {

      let menuDataForTest = {
        id: 1,
        title: '',
        name: 'Potentialife Course',
        description: 'the main potentialife COurse',
        slug: 'potentialife-course',
        order: 0,
        children: [
          {
            id: 2,
            title: 'Level 1',
            name: 'Unfreze',
            description: '10 / 10 Modules',
            slug: 'level-1',
            order: 1,
            status: 'current',
            progress: {
              completed: 9,
              remaining: 13,
              percent: 40
            },
            children: [
              {
                id: 5,
                title: 'Module 1',
                name: 'Encounter Strengths',
                description: 'Approx. 30 mins',
                slug: 'module-1',
                order: 1,
                status: 'current',
                children: [
                  {
                    id: 1,
                    title: 'Step 1',
                    name: 'Module introduction',
                    description: 'Approx. 5 mins',
                    slug: 'step-1',
                    order: 0,
                    status: 'completed',
                    fullUrl: '/potentialife-course/level-1/module-1/step-1',
                    type: 'STEP'
                  },
                  {
                    id: 3,
                    title: 'Step 2',
                    name: 'Exercise: Your strengths and weaknesses - part 1',
                    description: 'Approx. 2 mins',
                    slug: 'step-2',
                    order: 2,
                    status: 'completed',
                    fullUrl: '/potentialife-course/level-1/module-1/step-32',
                    type: 'STEP'
                  },
                  {
                    id: 33181,
                    title: 'Step 3',
                    name: '360 Feedback',
                    description: 'Approx. 9999 mins',
                    slug: 'step-3',
                    order: 0,
                    status: 'completed',
                    fullUrl: '/potentialife-course/level-1/module-1/step-3',
                    type: 'STEP',
                    category: 'video'
                  },
                  {
                    id: 33182,
                    title: 'Step 3 - 2',
                    name: 'Enter emails',
                    description: 'Approx. 9999 mins',
                    slug: 'step-3/2',
                    order: 0,
                    status: 'current',
                    fullUrl: '/potentialife-course/level-1/module-1/step-3/2',
                    hideStepInMenu: true,
                    type: 'STEP'
                  },
                  {
                    id: 33183,
                    title: 'Step 3 - 3',
                    name: 'Your emails are sent',
                    description: 'Approx. 9999 mins',
                    slug: 'step-3/3',
                    order: 0,
                    status: 'locked',
                    fullUrl: '/potentialife-course/level-1/module-1/step-3/3',
                    hideStepInMenu: true,
                    type: 'STEP'
                  },
                  {
                    id: 2,
                    title: 'Step 4',
                    name: 'Reflect on times you were at your best',
                    description: 'Approx. 2 mins',
                    slug: 'step-4',
                    order: 1,
                    status: 'completed',
                    fullUrl: '/potentialife-course/level-1/module-1/step-4',
                    type: 'STEP'
                  }
                ],
                fullUrl: '/potentialife-course/level-1/module-1',
                type: 'MODULE'
              }
            ],
            fullUrl: '/potentialife-course/level-1',
            type: 'LEVEL'
          }
        ]
      };
      Menu.computeMenuForDisplay( menuDataForTest );

      let level1 = menuDataForTest.children[0];
      let module1 = level1.children[0];
      expect( module1.levelTitle ).to.equal( level1.title );
      expect( module1.children[0].stepNumber ).to.equal( 1 );
      expect( module1.children[1].stepNumber ).to.equal( 2 );
      expect( module1.children[2].stepNumber ).to.equal( 3 );
      expect( module1.children[3].stepNumber ).to.equal( 3 );
      expect( module1.children[4].stepNumber ).to.equal( 3 );
      expect( module1.children[5].stepNumber ).to.equal( 4 );

      // First non-hidden step has to take the status of the latest 'current or completed' hidden steps
      expect( module1.children[2].status ).to.equal( 'current' );
    } );


  } );


} );
