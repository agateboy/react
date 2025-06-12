import { loginAdmin } from '../../../../services/Model.js';

class AdminLoginPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async handleLoginAttempt(email, password) {
    if (!this.view) {
      console.error('View not set for AdminLoginPresenter.');
      return;
    }

    this.view.clearMessages();
    this.view.showLoading(true);

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
    
      const data = await loginAdmin({ email, password });
      console.log('Admin logged in successfully:', data);


      localStorage.setItem('adminToken', data.token);
      localStorage.setItem(
        'adminInfo',
        JSON.stringify({
          id: data.id,
          email: data.email,
          role: data.role,
          username: data.username,
        }),
      );

    
      this.view.onLoginSuccess();
    } catch (err) {
      
      this.view.showErrorMessage(err.message || 'Login gagal. Email atau password salah.');
    } finally {
    
      this.view.showLoading(false);
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default AdminLoginPresenter;
