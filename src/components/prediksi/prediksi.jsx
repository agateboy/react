import React, { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import { useLocation } from 'react-router-dom';
import './prediksi.css';

const currencyPairs = {
  'EUR/USD': 'EURUSD=X',
  'USD/JPY': 'USDJPY=X',
  'AUD/USD': 'AUDUSD=X',
  'GBP/USD': 'GBPUSD=X',
  'NZD/USD': 'NZDUSD=X',
};

const indicators = ['SMA', 'EMA'];

const timeframes = [
  { label: '1 Hari', value: 1 },
  { label: '2 Hari', value: 2 },
  { label: '3 Hari', value: 3 },
  { label: '4 Hari', value: 4 },
  { label: '7 Hari', value: 7 },
  { label: '14 Hari', value: 14 },
  { label: '30 Hari', value: 30 },
];

export default function Prediksi() {
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [selectedIndicator, setSelectedIndicator] = useState('SMA');
  const [selectedTimeframe, setSelectedTimeframe] = useState(4);
  const [chartData, setChartData] = useState([]);
  const [indicatorData, setIndicatorData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [futureHigh, setFutureHigh] = useState(null);
  const [dailyPrediction, setDailyPrediction] = useState(null);
  const [zoneCounts, setZoneCounts] = useState({
    FBuy: 0,
    FSell: 0,
    DBuy: 0,
    DSell: 0,
    FBuy_pct: 0,
    FSell_pct: 0,
    DBuy_pct: 0,
    DSell_pct: 0,
    FBuy_strength: 0,
    FSell_strength: 0,
    DBuy_strength: 0,
    DSell_strength: 0,
  });
  const [weeklyPredictions, setWeeklyPredictions] = useState([]);
  const [yesterdayClose, setYesterdayClose] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const url = 'http://70.153.80.133:8000/';
  const symbol = currencyPairs[selectedPair];

  useEffect(() => {
    if (localStorage.getItem('justLoggedIn') === 'true') {
      setShowPopup(true);
      localStorage.removeItem('justLoggedIn');
    }

    const userStr = localStorage.getItem('user');
    setUser(userStr ? JSON.parse(userStr) : null);
  }, [location]);

  useEffect(() => {
    const period = `${selectedTimeframe}d`;

    fetch(`${url}/api/forex?symbol=${symbol}&period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) return;
        const formatted = data
          .filter((d) => d.Open != null && d.High != null && d.Low != null && d.Close != null)
          .map((d) => ({
            x: new Date(d.Datetime),
            y: [d.Open.toFixed(4), d.High.toFixed(4), d.Low.toFixed(4), d.Close.toFixed(4)],
          }));
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        formatted.push({
          x: tomorrow,
          y: [null, null, null, null],
        });
        setChartData(formatted);
        if (data.length > 1) {
          const closePrice = data[data.length - 2]?.Close;
          setYesterdayClose(closePrice);
        }
      });

    if (selectedIndicator !== 'None') {
      fetch(`${url}/api/indicator?symbol=${symbol}&type=${selectedIndicator}&period=${period}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) return;
          const formatted = data.map((d) => ({
            x: new Date(d.Datetime),
            y: d.Value.toFixed(4),
          }));
          setIndicatorData(formatted);
        });
    } else {
      setIndicatorData([]);
    }

    fetch(`${url}/predict?symbol=${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.predicted_close && data.predicted_high && data.predicted_low) {
          setDailyPrediction(data);
        } else {
          setDailyPrediction(null);
        }
      })
      .catch((err) => {
        console.error('Gagal fetch prediksi harian:', err);
        setDailyPrediction(null);
      });

    fetch(`${url}/api/zones?symbol=${symbol}&period=${period}`)
      .then((res) => res.json())
      .then((zones) => {
        if (zones.length === 0) return;
        const formattedZones = zones.map((z) => ({
          x: new Date(z.Datetime),
          y: z.Price,
          label: {
            borderColor: z.type.includes('Buy') ? '#00E396' : '#FF4560',
            style: {
              color: '#fff',
              background: z.type.includes('Buy') ? '#00E396' : '#FF4560',
            },
            text: z.type,
          },
        }));
        setZoneData(formattedZones);
      });

    fetch(`${url}/api/zones/counts?symbol=${symbol}&period=${period}`)
      .then((res) => res.json())
      .then((data) => setZoneCounts(data));
  }, [selectedPair, selectedTimeframe, selectedIndicator, symbol, url]);

  useEffect(() => {
    setWeeklyPredictions([]);
    setFutureHigh(null);

    fetch(`${url}/weekly?symbol=${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const result = data.map((item) => {
            const [key, value] = Object.entries(item)[0];
            return {
              timeframe: key,
              classification: value.classification,
              probability: value.classification_probability,
              predictedClose: value.predicted_close_price,
            };
          });

          setWeeklyPredictions(result);

          const validPrices = result
            .map((item) => item.predictedClose)
            .filter((price) => price != null && !isNaN(price) && isFinite(price));

          if (validPrices.length > 0) {
            const maxpriceweek = Math.max(...validPrices);
            setFutureHigh(maxpriceweek);
          } else {
            setFutureHigh(null);
          }
        } else {
          setWeeklyPredictions([]);
          setFutureHigh(null);
        }
      })
      .catch((err) => {
        console.error('Gagal fetch prediksi mingguan:', err);
        setWeeklyPredictions([]);
        setFutureHigh(null);
      });
  }, [selectedPair, symbol, url]);

  const series = [
    { name: 'Candlestick', type: 'candlestick', data: chartData },
    { name: 'Indicator', type: 'line', data: indicatorData },
  ];

  const categoryToKey = {
    FastBuy: 'FBuy',
    FastSell: 'FSell',
    DelayedBuy: 'DBuy',
    DelayedSell: 'DSell',
  };

  const chartOptions = {
    chart: {
      type: 'candlestick',
      background: 'transparent',
      foreColor: '#ffffff',
      animations: { enabled: true },
      toolbar: {
        show: true, // Pastikan toolbar selalu terlihat
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
          customIcons: [],
        },
        autoSelected: 'zoom',
        offsetY: 0, // Sesuaikan posisi toolbar jika diperlukan
        offsetX: 0,
      },
      zoom: { enabled: true },
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
    },
    title: {
      text: `${selectedPair} Candlestick Chart with ${selectedIndicator}`,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#ffffff' },
        datetimeUTC: false,
        formatter: function (val, timestamp) {
          // Format lebih singkat untuk mobile
          return new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        },
      },
      tickAmount: 6, // Batasi jumlah tick untuk kejelasan di mobile
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: {
        style: { colors: '#ffffff' },
        formatter: (val) => val.toFixed(4),
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#00E396',
          downward: '#FF4560',
        },
      },
    },
    legend: { labels: { colors: '#ffffff' } },
    annotations: {
      points: zoneData,
      yaxis: [
        ...(futureHigh && !isNaN(futureHigh)
          ? [
              {
                y: futureHigh,
                borderColor: '#FEB019',
                borderWidth: 2,
                strokeDashArray: 5,
                label: {
                  borderColor: '#FEB019',
                  style: {
                    color: '#000',
                    background: '#FEB019',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  },
                  text: `High Mingguan: ${futureHigh.toFixed(4)}`,
                  position: 'right', // Posisi label
                  offsetX: 0,
                  offsetY: 0,
                },
              },
            ]
          : []),
        ...(dailyPrediction
          ? [
              {
                y: dailyPrediction.predicted_high,
                borderColor: '#FF4560',
                label: {
                  borderColor: '#FF4560',
                  style: { color: '#000', background: '#FF4560' },
                  text: `Pred High: ${dailyPrediction.predicted_high.toFixed(4)}`,
                  position: 'right',
                  offsetX: -10,
                  offsetY: -5,
                },
              },
              {
                y: dailyPrediction.predicted_close,
                borderColor: '#00E396',
                label: {
                  borderColor: '#00E396',
                  style: { color: '#000', background: '#00E396' },
                  text: `Pred Close: ${dailyPrediction.predicted_close.toFixed(4)}`,
                  position: 'right',
                  offsetX: -10,
                  offsetY: -5,
                },
              },
              {
                y: dailyPrediction.predicted_low,
                borderColor: '#775DD0',
                label: {
                  borderColor: '#775DD0',
                  style: { color: '#000', background: '#775DD0' },
                  text: `Pred Low: ${dailyPrediction.predicted_low.toFixed(4)}`,
                  position: 'right',
                  offsetX: -10,
                  offsetY: -5,
                },
              },
            ]
          : []),
      ],
    },
    theme: {
      mode: 'dark',
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            toolbar: {
              show: true, 
              offsetX: 0, 
              offsetY: 0,
              tools: {
                download: false, 
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
            },
            width: '100%',
            height: 350, // Tinggi tetap di mobile
          },
          title: {
            align: 'left',
            style: {
              fontSize: '14px',
              fontWeight: 'bold', 
            },
          },
          xaxis: {
            labels: {
              rotate: -45,
              offsetY: 0,
              style: {
                fontSize: '9px', 
              },
              formatter: function (val, timestamp) {
                return new Date(val).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                });
              },
            },
            tickAmount: 4, // Kurangi jumlah tick
          },
          yaxis: {
            labels: {
              offsetX: 0,
              style: {
                fontSize: '9px', // Font label Y-axis lebih kecil
              },
              formatter: (val) => val.toFixed(3), // Kurangi presisi
            },
          },
          legend: {
            fontSize: '10px',
            offsetX: 0,
            offsetY: 0,
          },
          annotations: {
            yaxis: dailyPrediction
              ? [
                  {
                    y: dailyPrediction.predicted_high,
                    label: {
                      offsetX: 5,
                      offsetY: -5,
                      textAnchor: 'start',
                      style: {
                        fontSize: '10px',
                        fontWeight: 'normal',
                      },
                    },
                  },
                  {
                    y: dailyPrediction.predicted_close,
                    label: {
                      offsetX: 5,
                      offsetY: -5,
                      textAnchor: 'start',
                      style: {
                        fontSize: '10px',
                        fontWeight: 'normal',
                      },
                    },
                  },
                  {
                    y: dailyPrediction.predicted_low,
                    label: {
                      offsetX: 5,
                      offsetY: -5,
                      textAnchor: 'start',
                      style: {
                        fontSize: '10px',
                        fontWeight: 'normal',
                      },
                    },
                  },
                ]
              : [],
          },
        },
      },
      {
        breakpoint: 480, // Untuk layar di bawah 480px (mobile sangat kecil)
        options: {
          chart: {
            height: 280, // Atur tinggi chart lebih kecil untuk mobile kecil
            toolbar: {
              show: true, // Pastikan toolbar tetap terlihat
              tools: {
                download: false, // Mungkin sembunyikan lebih banyak tool
                selection: false,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: false,
                reset: true,
              },
            },
          },
          title: {
            style: {
              fontSize: '12px', // Font judul lebih kecil lagi
            },
          },
          xaxis: {
            labels: {
              rotate: -90, // Rotasi lebih ekstrem jika perlu
              formatter: function (val, timestamp) {
                return new Date(val).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                }); // Format bulan/hari
              },
              style: {
                fontSize: '8px',
              },
            },
            tickAmount: 3, // Kurangi jumlah tick lebih lanjut
          },
          yaxis: {
            labels: {
              formatter: (val) => val.toFixed(2), // Presisi lebih rendah
              style: {
                fontSize: '8px',
              },
            },
          },
          annotations: {
            yaxis: dailyPrediction
              ? [
                  {
                    y: dailyPrediction.predicted_high,
                    label: {
                      offsetX: 2,
                      offsetY: -3,
                      style: {
                        fontSize: '9px',
                      },
                    },
                  },
                  {
                    y: dailyPrediction.predicted_close,
                    label: {
                      offsetX: 2,
                      offsetY: -3,
                      style: {
                        fontSize: '9px',
                      },
                    },
                  },
                  {
                    y: dailyPrediction.predicted_low,
                    label: {
                      offsetX: 2,
                      offsetY: -3,
                      style: {
                        fontSize: '9px',
                      },
                    },
                  },
                ]
              : [],
          },
        },
      },
    ],
  };

  const barChartOptions = {
    chart: { type: 'bar', background: 'transparent', foreColor: '#ffffff' },
    plotOptions: { bar: { distributed: true } },
    xaxis: {
      categories: ['FastBuy', 'FastSell', 'DelayedBuy', 'DelayedSell'],
      labels: { style: { colors: '#ffffff' } },
    },
    yaxis: { labels: { style: { colors: '#ffffff' } } },
    title: {
      text: 'Jumlah Zona & Insight (%)',
      align: 'center',
      style: { color: '#ffffff', fontSize: '16px', fontWeight: 'bold' },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        const category = opts.w.globals.labels[opts.dataPointIndex];
        const key = categoryToKey[category];
        const pct = zoneCounts[`${key}_pct`] || 0;
        return `${val} (${pct}%)`;
      },
      style: {
        colors: ['#000'],
      },
    },
    legend: { labels: { colors: '#ffffff' } },
    tooltip: {
      y: {
        formatter: (val, { dataPointIndex }) => {
          const labels = ['FBuy', 'FSell', 'DBuy', 'DSell'];
          const label = labels[dataPointIndex];
          const pct = zoneCounts[`${label}_pct`] || 0;
          const strength = zoneCounts[`${label}_strength`] || 0;
          return `Jumlah: ${val}\nPersen: ${pct}%\nKekuatan: ${strength}%`;
        },
      },
      theme: 'dark',
    },
    colors: ['#008FFB', '#FF4560', '#008FFB', '#FF4560'],
    responsive: [
      {
        breakpoint: 768,
        options: {
          title: {
            style: {
              fontSize: '14px',
            },
          },
          dataLabels: {
            offsetY: -5,
            formatter: (val, opts) => {
              const category = opts.w.globals.labels[opts.dataPointIndex];
              const key = categoryToKey[category];
              const pct = zoneCounts[`${key}_pct`] || 0;
              return `${val}\n(${pct}%)`;
            },
            style: {
              fontSize: '10px',
            },
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px',
              },
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          title: {
            style: {
              fontSize: '12px',
            },
          },
          dataLabels: {
            offsetY: -3,
            style: {
              fontSize: '8px',
            },
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '8px',
              },
            },
          },
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2 text-black">Prediksi harga hari ini</h2>
            <h1 className="text-lg font-normal mb-2 text-black">
              Hai, {user?.username} semoga harimu menyenangkan. Kami memberikan insight untuk harga
              market minggu ini. Jangan lupa cek Notifikasi ya.
            </h1>
          </div>
        </div>
      )}

      <header className="flex flex-col items-center justify-center mb-8 px-4 py-2 relative">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Halaman Prediksi</h1>
        {user && (
          <div className="text-white text-xs sm:text-sm text-center sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2">
            Welcome, <span className="font-semibold">{user.username}</span>
          </div>
        )}
      </header>

      <main className="container mx-auto px-0 sm:px-4">
        <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
          {Object.keys(currencyPairs).map((pair) => (
            <button
              key={pair}
              className={`px-3 py-2 border border-gray-400 bg-gray-200 text-gray-800 cursor-pointer rounded-md transition-colors text-sm sm:text-base ${
                selectedPair === pair
                  ? 'bg-blue-600 text-white border-blue-800'
                  : 'hover:bg-gray-300'
              }`}
              onClick={() => setSelectedPair(pair)}
            >
              {pair}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6 items-center sm:items-start">
          <div className="mb-4 sm:mb-0">
            <label htmlFor="indicator-select" className="mr-2 text-white">
              Pilih Indikator:{' '}
            </label>
            <select
              id="indicator-select"
              value={selectedIndicator}
              onChange={(e) => setSelectedIndicator(e.target.value)}
              className="p-2 border border-gray-600 bg-gray-700 rounded-md text-white w-full sm:w-auto"
            >
              {indicators.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="timeframe-select" className="mr-2 text-white">
              Pilih Timeframe:{' '}
            </label>
            <select
              id="timeframe-select"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(parseInt(e.target.value))}
              className="p-2 border border-gray-600 bg-gray-700 rounded-md text-white w-full sm:w-auto"
            >
              {timeframes.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {futureHigh && (
          <div className="mb-4 p-2 bg-gray-800 rounded text-center sm:text-left">
            <p className="text-sm text-yellow-400">
              Prediksi harga tertinggi minggu ini = {futureHigh.toFixed(4)}
            </p>
          </div>
        )}

        {chartData.length > 0 ? (
          <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg mb-8">
            <div className="w-full">
              <ApexChart
                options={chartOptions}
                series={series}
                type="candlestick"
                height="auto"
                width="100%"
              />
            </div>
          </div>
        ) : (
          <p className="text-white text-center">No data available for the chart.</p>
        )}

        {dailyPrediction && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg text-center sm:text-left">
            <p className="text-sm sm:text-base text-blue-400">
              <strong>Prediksi Harian</strong>
              <br />
              High: <strong>{dailyPrediction.predicted_high.toFixed(4)}</strong>
              <br />
              Close: <strong>{dailyPrediction.predicted_close.toFixed(4)}</strong>
              <br />
              Low: <strong>{dailyPrediction.predicted_low.toFixed(4)}</strong>
            </p>
          </div>
        )}

        <div className="mt-8 overflow-x-auto">
          <h2 className="text-xl font-bold mb-2 text-center sm:text-left">Prediksi Mingguan</h2>
          {weeklyPredictions.length > 0 ? (
            <table className="w-full min-w-[600px] text-sm bg-gray-800 border border-gray-600 rounded-md">
              <thead>
                <tr className="bg-gray-700 text-left">
                  <th className="p-2">Hari</th>
                  <th className="p-2">Prediksi</th>
                  <th className="p-2">Probabilitas Naik (%)</th>
                  <th className="p-2">Prediksi Close</th>
                  <th className="p-2">Prediksi P&L</th>
                </tr>
              </thead>
              <tbody>
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((hari, i) => {
                  const prediction = weeklyPredictions[i] || {
                    classification: 'N/A',
                    predictedClose: null,
                  };
                  const isUp = prediction.classification.toLowerCase() === 'naik';
                  const rowBg = isUp ? 'bg-green-700/30' : 'bg-red-700/30';
                  const textColor = isUp ? 'text-green-400' : 'text-red-400';

                  const today = new Date().getDay();
                  let predictionDayIndex;
                  if (today === 0)
                    predictionDayIndex = -1; // Sunday
                  else if (today === 6)
                    predictionDayIndex = -1; // Saturday
                  else predictionDayIndex = today - 1; // Monday=0, Tuesday=1, etc.

                  const isToday = i === predictionDayIndex;

                  const difference =
                    isToday && yesterdayClose != null && prediction.predictedClose != null
                      ? prediction.predictedClose - yesterdayClose
                      : null;

                  return (
                    <tr
                      key={hari}
                      className={`${rowBg} border-t border-gray-600 ${
                        isToday ? 'bg-yellow-800/50' : ''
                      }`}
                    >
                      <td className={`p-2 font-semibold ${isToday ? 'text-yellow-300' : ''}`}>
                        {hari}
                      </td>
                      <td className={`p-2 ${textColor}`}>{prediction.classification ?? '-'}</td>
                      <td className="p-2">
                        {prediction.probability != null
                          ? (prediction.probability * 100).toFixed(2)
                          : '-'}
                      </td>
                      <td className="p-2">
                        {prediction.predictedClose != null
                          ? prediction.predictedClose.toFixed(4)
                          : '-'}
                      </td>
                      <td
                        className={`p-2 ${
                          difference > 0
                            ? 'text-green-400'
                            : difference < 0
                              ? 'text-red-400'
                              : 'text-gray-400'
                        }`}
                      >
                        {difference != null
                          ? `${difference > 0 ? '+' : ''}${difference.toFixed(4)}`
                          : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-white text-center">Memuat prediksi mingguan...</p>
          )}
        </div>

        <div className="mt-8 bg-gray-800 p-4 rounded-lg shadow-lg">
          <ApexChart
            options={barChartOptions}
            series={[
              {
                name: 'Jumlah',
                data: [zoneCounts.FBuy, zoneCounts.FSell, zoneCounts.DBuy, zoneCounts.DSell],
              },
            ]}
            type="bar"
            height={500}
          />
        </div>
      </main>
    </div>
  );
}
