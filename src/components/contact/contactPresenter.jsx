import { useState } from 'react';
import { sendContactMessage } from '../../services/Model.js';
const useContactPresenter = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\+62\d{8,15}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('62')) {
      value = '+' + value;
    } else if (value.startsWith('0')) {
      value = '+62' + value.substring(1);
    } else if (value && !value.startsWith('+62') && value.length > 0) {
      value = '+62' + value;
    }
    setFormData((prevData) => ({
      ...prevData,
      phone: value,
    }));
    if (errors.phone) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: '',
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Nama Lengkap wajib diisi.';
    }
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Email tidak valid.';
    }
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Nomor WhatsApp harus diawali +62 dan formatnya valid.';
    }
    if (!formData.subject) {
      newErrors.subject = 'Pilih kategori pertanyaan.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Detail pertanyaan atau kebutuhan wajib diisi.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await sendContactMessage(formData); // Kirim ke backend

      setSuccessMessage('Pesan berhasil dikirim! Terima kasih telah menghubungi kami.');

      setFormData({
        fullname: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        form: error.message || 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return {
    formData,
    isLoading,
    successMessage,
    errors,
    handleChange,
    handlePhoneChange,
    handleSubmit,
  };
};

export default useContactPresenter;
