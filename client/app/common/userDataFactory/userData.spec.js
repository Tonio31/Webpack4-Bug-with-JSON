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
      expect(User.getEmail()).to.equal(userToStore.username);
    });

  });


});
