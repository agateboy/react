import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const symbols = [
  { name: 'EUR/USD', symbol: 'EURUSD=X' },
  { name: 'USD/JPY', symbol: 'USDJPY=X' },
  { name: 'AUD/USD', symbol: 'AUDUSD=X' },
  { name: 'GBP/USD', symbol: 'GBPUSD=X' },
  { name: 'NZD/USD', symbol: 'NZDUSD=X' },
];

function Header({ menuOpen, toggleMenu, setMenuOpen, menuItems }) {
  const [user, setUser] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [notifAll, setNotifAll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifCache, setNotifCache] = useState({ date: null, data: [] }); 
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    setUser(userStr ? JSON.parse(userStr) : null);
    console.log('Loaded user:', userStr);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogoutPopup(true);
    setTimeout(() => {
      setShowLogoutPopup(false);
      navigate('/login');
    }, 1500);
  };
  useEffect(() => {
    const fetchPrediksi = async () => {
      const today = new Date().toLocaleDateString('id-ID');
      if (notifCache.date === today && notifCache.data.length > 0) return; 

      try {
        const results = await Promise.all(
          symbols.map(async (item) => {
            const res = await fetch(`https://9r1lxdd5-5001.asse.devtunnels.ms/predict?symbol=${item.symbol}`);
            const data = await res.json();
            return { ...data, pair: item.name };
          }),
        );
        setNotifCache({ date: today, data: results });
        setShowNotifPopup(true); 
      } catch {
        setNotifCache({ date: today, data: [{ error: 'Gagal mengambil notifikasi.' }] });
      }
    };

    fetchPrediksi();
  
  }, []);
  const handleSubscribe = () => {
    setShowOverlay(true);
    const today = new Date().toLocaleDateString('id-ID');
    setLoading(false);
    if (notifCache.date === today && notifCache.data.length > 0) {
      setNotifAll(notifCache.data);
    } else {
      setNotifAll([{ error: 'Data belum tersedia. Silakan coba beberapa saat lagi.' }]);
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setNotifAll([]);
  };

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black w-full sticky top-0 z-50 shadow-lg">
      {showNotifPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg px-8 py-6 text-center">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">Notifikasi Prediksi Hari Ini</h3>
            <p className="text-gray-700 mb-4">Prediksi market hari ini sudah tersedia. Klik ikon notifikasi untuk melihat detail.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setShowNotifPopup(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg px-8 py-6 text-center">
            <h3 className="text-xl font-semibold mb-2 text-green-600">Logout Berhasil!</h3>
            <p className="text-gray-700">Anda sudah berhasil logout.</p>
          </div>
        </div>
      )}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={handleCloseOverlay}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Notification</h2>
            {loading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : user ? (
              notifAll.length > 0 ? (
                notifAll.some((n) => n.error) ? (
                  <div className="text-red-600">{notifAll[0].error}</div>
                ) : (
                  <div>
                    {notifAll.map((n) => (
                      <div key={n.pair} className="mb-3 border-b pb-2">
                        <div className="font-semibold">
                          Prediksi {n.pair} tanggal {new Date().toLocaleDateString('id-ID')}
                        </div>
                        <div>
                          Predicted Close: <b className="text-yellow-500">{n.predicted_close}</b>
                        </div>
                        <div>
                          Predicted High: <b className="text-green-500">{n.predicted_high}</b>
                        </div>
                        <div>
                          Predicted Low: <b className="text-red-500">{n.predicted_low}</b>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-gray-600">Tidak ada data prediksi.</div>
              )
            ) : (
              <div className="flex flex-col items-center text-yellow-600">
                <div className="mb-3">
                  Login untuk mendapatkan notifikasi update terbaru tentang market.
                </div>
            
                <Link to="/login" onClick={() => setShowOverlay(false)}>
                  <button className="bg-gradient-to-b from-gray-700 to-black text-white text-sm rounded-md px-4 py-2 shadow-md hover:from-gray-600 hover:to-gray-900 transition-all duration-300 flex items-center justify-center">
                    <i className="fas fa-sign-in-alt mr-2"></i> Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <nav className="relative py-3 md:py-4 flex items-center justify-between md:grid md:grid-cols-3 md:gap-4">
        
          <div className="flex items-center md:justify-start md:col-span-1">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center group"
              aria-label="Narastock Home"
            >
              <div className="relative">
                <img
                  alt="Narastock - Prediksi Saham Akurat"
                  className="h-10 w-auto rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
                  src={logo}
                  draggable={false}
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-[#7CFF36] to-[#3AAE5F] bg-clip-text text-transparent"></span>
            </Link>
          </div>

    
          <div className="hidden md:flex items-center md:justify-center md:col-span-1">
            <ul className="flex space-x-4 lg:space-x-8 text-white text-sm select-none">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-[#9fff4a] transition-colors duration-300 relative group"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9fff4a] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

   
          <div className="flex items-center space-x-4 md:justify-end md:col-span-1">
          
            <button
              className="hidden md:flex items-center bg-gradient-to-b from-gray-700 to-black text-white text-xs sm:text-sm rounded-md px-3 sm:px-4 py-2 shadow-md hover:from-gray-600 hover:to-gray-900 transition-all duration-300 transform hover:scale-105"
              onClick={handleSubscribe}
            >
              <i className="fas fa-bell mr-2 text-yellow-400"></i>
            </button>

            <div className="hidden md:block">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1 rounded ml-2 text-sm md:text-base"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login">
                  <button className="bg-gradient-to-b from-gray-700 to-black text-white text-sm rounded-md px-4 py-2 shadow-md hover:from-gray-600 hover:to-gray-900 transition-all duration-300 flex items-center justify-center">
                    <i className="fas fa-sign-in-alt mr-2"></i> Login
                  </button>
                </Link>
              )}
            </div>

       
            <button className="md:hidden text-white p-2" onClick={toggleMenu}>
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </nav>
      </div>

     
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 mt-16 bg-gray-900 bg-opacity-90">
          <div className="bg-gray-900 px-4 py-6">
            <ul className="space-y-4 text-white text-sm">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="block hover:text-[#9fff4a] transition-colors py-2 px-4 rounded hover:bg-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-4 px-4 flex flex-col space-y-4">
                {user ? (
                  <>
                    <div className="text-center">
                      Welcome, <b>{user.username}</b> {user.email && <span>({user.email})</span>}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 text-white text-sm rounded-md px-4 py-2 shadow-md hover:bg-red-700 transition-all duration-300 flex items-center justify-center"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                  </>
                ) : (
                
                  <Link to="/login" className="w-full" onClick={() => setMenuOpen(false)}>
                    <button className="w-full bg-gradient-to-b from-gray-700 to-black text-white text-sm rounded-md px-4 py-2 shadow-md hover:from-gray-600 hover:to-gray-900 transition-all duration-300 flex items-center justify-center">
                      <i className="fas fa-sign-in-alt mr-2"></i> Login
                    </button>
                  </Link>
                )}
                <button
                  className="w-full bg-gradient-to-b from-gray-700 to-black text-white text-sm rounded-md px-4 py-2 shadow-md hover:from-gray-600 hover:to-gray-900 transition-all duration-300 flex items-center justify-center"
                  onClick={handleSubscribe}
                >
                  <i className="fas fa-bell mr-2 text-yellow-400"></i> Notification
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
