import UserModule from './userData';

describe('User', () => {
  let User;

  beforeEach(window.module(UserModule));
  beforeEach(inject(($injector) => {
    User = $injector.get('User');
  }));

  describe('User Factory', () => {

    it('checks that we can set and get the user data', () => {

      let userToStore = {
        id: '12',
        token: '#@&*#&^$*$&#)*%',
        firstName: 'Tonio',
        lastName: 'Mandela',
        email: 'tonio.mandela@gmail.com',
        gender: 'M',
        company: 'Barclays',
        division: 'Sales',
        cohort: 'BAC001',
        companyBanner: {
          logo: 'https://logos.keycdn.com/keycdn-logo.png',
          header: 'Inspiring Leadership',
          subHeader: 'BE YOUR BEST, BE THE DIFFERENCE',
          bgColor: 'orange',
          textColor: 'white'
        }
      };

      User.setUser(userToStore);

      expect(User.getFirstName()).to.equal(userToStore.firstName);
      expect(User.getLastName()).to.equal(userToStore.lastName);
      expect(User.getSecurityToken()).to.equal(userToStore.token);
      expect(User.getUserId()).to.equal(userToStore.id);
      expect(User.getEmail()).to.equal(userToStore.email);
      expect(User.getGender()).to.equal(userToStore.gender);
      expect(User.getCompanyBanner()).to.deep.equal(userToStore.companyBanner);
      expect(User.getCompany()).to.equal(userToStore.company);
      expect(User.getDivision()).to.equal(userToStore.division);
      expect(User.getCohort()).to.equal(userToStore.cohort);
    });

    it('isUserDefined() returns true if any of the fields are defined', () => {

      let userToStore = {
        id: '12',
        token: '#@&*#&^$*$&#)*%',
        firstName: 'Tonio',
        lastName: 'Mandela',
        email: 'tonio.mandela@gmail.com'
      };

      User.setUser(userToStore);

      expect(User.isUserDefined()).to.equal(true);
    });

    it('isUserDefined() returns false if the user is not initialised', () => {
      expect(User.isUserDefined()).to.equal(false);
    });
  });


});
