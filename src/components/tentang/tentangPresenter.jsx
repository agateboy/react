// TentangPresenter.jsx
import { useEffect, useState } from 'react';
import priscilia from '../../assets/priscilia.jpg';
import rofky from '../../assets/rofky.jpg';
import reyhan from '../../assets/reyhan.png';
import adrian from '../../assets/adrian.jpg';
import irfan from '../../assets/irfan.jpg';

export const useTentangPresenter = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [tentangKamiText, setTentangKamiText] = useState([]);

  useEffect(() => {
    const text = [
      `NaraStock adalah platform analisis saham berbasis AI yang dirancang khusus untuk membantu investor pemula mengambil keputusan investasi lebih percaya diri. Kami mengubah data pasar yang kompleks menjadi prediksi mingguan sederhana menggunakan algoritma canggih dan data historis terpercaya. Dikembangkan oleh tim profesional muda dari universitas terkemuka Yogyakarta, platform kami menawarkan kemudahan memahami trend pasar tanpa perlu latar belakang finansial yang mendalam. Dengan antarmuka yang intuitif dan penjelasan yang jelas, NaraStock menjadi teman ideal bagi siapa saja yang ingin memulai perjalanan investasi mereka. Setiap prediksi kami dirancang untuk memberikan insight berharga sekaligus mendidik pengguna tentang dasar-dasar analisis pasar.`,
    ];

    const data = [
      {
        name: 'Adrian Ramdhany',
        role: 'Machine Learning',
        university: 'Universitas Negeri Yogyakarta',
        image: adrian,
        github: '',
        linkedin: '#',
      },
      {
        name: 'Irfan Nur Fahrudin',
        role: 'Machine Learning',
        university: 'Universitas Mercu Buana Yogyakarta',
        image: irfan,
        github: '#',
        linkedin: '#',
      },
      {
        name: 'Priscilia Amanda Regina',
        role: 'Front End Back End',
        university: 'Universitas Mercu Buana Yogyakarta',
        image: priscilia,
        github: '#',
        linkedin: '#',
      },
      {
        name: 'Muchammad Rofky Hazawwaru',
        role: 'Front End Back End',
        university: 'Universitas Mercu Buana Yogyakarta',
        image: rofky,
        github: '#',
        linkedin: '#',
      },
      {
        name: 'Reyhan Dwi Wira Allofadieka',
        role: 'Front End Back End',
        university: 'Universitas Amikom Yogyakarta',
        image: reyhan,
        github: '#',
        linkedin: '#',
      },
    ];
    setTentangKamiText(text);
    setTeamMembers(data);
  }, []);

  return {
    teamMembers,
    tentangKamiText,
  };
};
