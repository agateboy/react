import { loginUser } from '../../../../services/Model.js'; 

class UserLoginPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async handleLoginAttempt(email, password) {
    this.view.showLoading(true);
    this.view.clearErrorMessage();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  
    if (!email || !password) {
      this.view.showErrorMessage('Email dan password harus diisi.');
      this.view.showLoading(false);
      return;
    }

    if (!this.isValidEmail(email)) {
      this.view.showErrorMessage('Format email tidak valid.');
      this.view.showLoading(false);
      return;
    }

    try {
      const data = await loginUser({ email, password });

   
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        email: data.email,
        role: data.role,
        username: data.username,
      }));
      localStorage.setItem('justLoggedIn', 'true');
     
      this.view.onLoginSuccess(); 
    } catch (error) {
      this.view.showErrorMessage(error.message || 'Login gagal. Coba lagi.');
    } finally {
      this.view.showLoading(false);
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default UserLoginPresenter;
