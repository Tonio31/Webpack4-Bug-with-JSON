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
        email: 'tonio.mandela@gmail.com'
      };

      User.setUser(userToStore);

      expect(User.getFirstName()).to.equal(userToStore.firstName);
      expect(User.getLastName()).to.equal(userToStore.lastName);
      expect(User.getSecurityToken()).to.equal(userToStore.token);
      expect(User.getUserId()).to.equal(userToStore.id);
      expect(User.getEmail()).to.equal(userToStore.email);
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
