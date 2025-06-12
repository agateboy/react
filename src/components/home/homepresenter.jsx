import { useNavigate } from 'react-router-dom';

function useHomePresenter() {
  const navigate = useNavigate();

  const handleMulaiPrediksiClick = () => {
    navigate('/prediksi');
  };

  const handlePelajariFiturClick = () => {
    navigate('/fitur');
  };

  return {
    handleMulaiPrediksiClick,
    handlePelajariFiturClick, 
  };
}

export default useHomePresenter;
