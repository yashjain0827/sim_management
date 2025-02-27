class Auth {
  constructor() {
    this.authenticated = false;
    if (sessionStorage.getItem("auth")) {
      this.authenticated = true;
    }
  }
  login(cb) {
    this.authenticated = true;
    cb();
  }
  logout(cb) {
    this.authenticated = false;
    cb();
  }
  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
