import { useState, useEffect } from 'react';

export const useFiturPresenter = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const rawFeaturesData = [
    {
      id: 1,
      iconSrc: 'https://storage.googleapis.com/a1aa/image/27c36cbc-30a8-4abf-ad2a-08f486a6d74b.jpg',
      iconAlt: 'Icon of a stock chart with an upward green arrow and bar graph',
      title: 'Prediksi Saham Mingguan',
      description:
        "Aplikasi Akan Memberi Tahu Apakah Harga Saham Kemungkinan Naik Atau Turun Dalam 1 Minggu Ke Depan, Menggunakan Metode Analisis Data Yang Sederhana. Hasil Prediksi Juga Dilengkapi Dengan Tingkat Keyakinan (Misalnya: 'Peluang Naik 70%'), Sehingga Anda Bisa Menilai Seberapa Kuat Sinyalnya.",
    },
    {
      id: 2,
      iconSrc: 'https://storage.googleapis.com/a1aa/image/3a67c17d-3e22-4859-95c3-5e2e7e17113e.jpg',
      iconAlt: 'Icon of a yellow notification bell with a red alert dot on top right',
      title: 'Notifikasi Rutin Di Akhir Pekan',
      description:
        "Setiap Jumat Malam, Anda Akan Dapat Notifikasi (Melalui Browser Atau Email) Yang Mengingatkan Untuk Melihat Prediksi Terbaru. Pesannya Akan Seperti Ini: 'Prediksi Saham Pekan Depan Sudah Keluar! Yuk Cek Sekarang.' Dengan Begitu, Anda Tidak Ketinggalan Info Dan Bisa Bersiap Sebelum Pasar Dibuka.",
    },
    {
      id: 3,
      iconSrc: 'https://storage.googleapis.com/a1aa/image/95b0ab99-b805-43e9-4fe0-1351b1e1888f.jpg',
      iconAlt:
        'Icon representing an article with stock education, showing a chart with candlesticks and line graph',
      title: 'Article Edukasi',
      description:
        'Tersedia Fitur Edukasi Singkat Dalam Bentuk Artikel Seputar Dunia Saham. Fitur Ini Membantu Kamu Memahami Pola Pergerakan Harga Saham, Bahkan Jika Kamu Baru Mulai Belajar.',
    },
    {
      id: 4,
      iconSrc: 'https://storage.googleapis.com/a1aa/image/4f6577cd-a338-40e5-20cf-8b910618c731.jpg',
      iconAlt: 'Icon of a simple bar chart with orange bars and black axes',
      title: 'Tampilan Grafik Yang Mudah Dibaca',
      description:
        'Tersedia Grafik Interaktif Yang Menunjukkan Pergerakan Harga Saham, Lengkap Dengan Tanda-Tanda Tren Naik Atau Turun, Supaya Kamu Bisa Melihat Gambaran Pasar Dengan Jelas.',
    },
    {
      id: 5,
      iconSrc: 'https://storage.googleapis.com/a1aa/image/553c2ca9-fabe-4433-76a3-c9c4af207ebb.jpg',
      iconAlt: 'Icon of a blue circular data sync arrows symbol',
      title: 'Data Selalu Terupdate',
      description:
        'Aplikasi Terhubung Ke Sumber Data Saham Terpercaya Dan Secara Otomatis Memperbarui Prediksi Setiap Jumat. Anda Juga Bisa Melihat Kapan Terakhir Kali Data Di-Update, Sehingga Tidak Perlu Khawatir Menggunakan Info Yang Sudah Kedaluwarsa.',
    },
    {
      id: 6,
      iconSrc: 'https://storage.googleapis.com/a1aa/image/82285227-a6ef-40a6-f912-50d85070b3cc.jpg',
      iconAlt: 'Icon of a computer monitor with code brackets on screen',
      title: 'Bisa Diakses Dari HP Atau Laptop',
      description:
        'Aplikasi Ini Dapat Diakses Melalui Smartphone, Tablet, Maupun Komputer, Memudahkan Anda Untuk Mengecek Prediksi Dan Data Saham Kapan Saja Dan Di Mana Saja. Antarmukanya Dirancang Sederhana Dan Intuitif, Sehingga Nyaman Digunakan Oleh Siapa Pun.',
    },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      setFeatures(rawFeaturesData);
    } catch (err) {
      setError('Gagal mengambil data fitur.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    features,
    loading,
    error,
  };
};
