import React, { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';

const currencyPairs = {
  'EUR/USD': 'EURUSD=X',
  'USD/JPY': 'USDJPY=X',
  'AUD/USD': 'AUDUSD=X',
  'GBP/USD': 'GBPUSD=X',
  'NZD/USD': 'NZDUSD=X',
};

const indicators = ['SMA', 'EMA'];

const timeframes = [
  { label: '4 Hari', value: 4 },
  { label: '7 Hari', value: 7 },
  { label: '14 Hari', value: 14 },
  { label: '30 Hari', value: 30 },
];

export default function Prediksi({ onBack }) {
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [selectedIndicator, setSelectedIndicator] = useState('SMA');
  const [selectedTimeframe, setSelectedTimeframe] = useState(4);
  const [chartData, setChartData] = useState([]);
  const [indicatorData, setIndicatorData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
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

  const [prediction, setPrediction] = useState(null);
  const [probabilityUp, setProbabilityUp] = useState(null);

  const url = 'https://flasknarastock.onrender.com';
  const symbol = currencyPairs[selectedPair];

  useEffect(() => {
    const period = `${selectedTimeframe}d`;

    // Fetch candlestick
    fetch(`${url}/api/forex?symbol=${symbol}&period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) return;
        const formatted = data.map((d) => ({
          x: new Date(d.Datetime),
          y: [d.Open, d.High, d.Low, d.Close],
        }));
        setChartData(formatted);
      });

    // Fetch indicator
    if (selectedIndicator !== 'None') {
      fetch(`${url}/api/indicator?symbol=${symbol}&type=${selectedIndicator}&period=${period}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) return;
          const formatted = data.map((d) => ({
            x: new Date(d.Datetime),
            y: d.Value,
          }));
          setIndicatorData(formatted);
        });
    } else {
      setIndicatorData([]);
    }

    // Fetch zones
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

    // Fetch zone counts
    fetch(`${url}/api/zones/counts?symbol=${symbol}&period=${period}`)
      .then((res) => res.json())
      .then((data) => setZoneCounts(data));

    // Fetch prediction dari backend Flask dengan model = symbol
    fetch(`${url}/predict?model=${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setPrediction(data.prediction);
          setProbabilityUp(data.probability_up);
        } else {
          setPrediction(null);
          setProbabilityUp(null);
          console.error('Error dari API prediksi:', data.error);
        }
      })
      .catch((err) => {
        setPrediction(null);
        setProbabilityUp(null);
        console.error('Gagal fetch API prediksi:', err);
      });
  }, [selectedPair, selectedIndicator, selectedTimeframe]);

  const series = [
    { name: 'Candlestick', type: 'candlestick', data: chartData },
    ...(indicatorData.length > 0
      ? [{ name: selectedIndicator, type: 'line', data: indicatorData }]
      : []),
  ];

  const categoryToKey = {
    FastBuy: 'FBuy',
    FastSell: 'FSell',
    DelayedBuy: 'DBuy',
    DelayedSell: 'DSell',
  };

  const options = {
    chart: { height: 350, type: 'candlestick' },
    title: {
      text: `${selectedPair} Candlestick Chart with ${selectedIndicator}`,
      align: 'left',
      style: { fontSize: '16px', fontWeight: 'bold', color: 'white' },
    },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#ffffff' } },
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: { style: { colors: '#ffffff' } },
    },
    legend: { labels: { colors: '#ffffff' } },
    annotations: { points: zoneData },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {' '}
      {/* Changed from .prediksi-container */}
      <header className="flex items-center justify-between mb-8">
        {' '}
        {/* Changed from .prediksi-header */}
        <button
          className="px-4 py-2 border border-gray-600 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          onClick={onBack}
        >
          Kembali
        </button>
        <h1 className="text-2xl font-bold">Halaman Prediksi</h1>
      </header>
      <main className="container mx-auto">
        {' '}
        {/* Changed from .prediksi-main */}
        <div className="flex flex-wrap gap-2 mb-4">
          {' '}
          {/* Changed from .pair-toggle */}
          {Object.keys(currencyPairs).map((pair) => (
            <button
              key={pair}
              className={`px-3 py-2 border border-gray-400 bg-gray-200 text-gray-800 cursor-pointer rounded-md transition-colors ${
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
        <div className="mb-4">
          {' '}
          {/* Changed from .indicator-select */}
          <label className="mr-2">Pilih Indikator: </label>
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="p-2 border border-gray-600 bg-gray-700 rounded-md text-white"
          >
            {indicators.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          {' '}
          {/* Changed from .timeframe-select */}
          <label className="mr-2">Pilih Timeframe: </label>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(parseInt(e.target.value))}
            className="p-2 border border-gray-600 bg-gray-700 rounded-md text-white"
          >
            {timeframes.map((tf) => (
              <option key={tf.value} value={tf.value}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>
        {chartData.length > 0 ? (
          <ApexChart options={options} series={series} type="candlestick" height={350} />
        ) : (
          <p className="text-white">No data available for the chart.</p>
        )}
        <div className="mt-6 text-xl">
          {prediction !== null && probabilityUp !== null ? (
            <>
              <p>
                <strong className="font-semibold">Prediksi:</strong> {prediction}
              </p>
              <p>
                <strong className="font-semibold">Probabilitas harga naik:</strong>{' '}
                {(probabilityUp * 100).toFixed(2)}%
              </p>
            </>
          ) : (
            <p>Memuat prediksi...</p>
          )}
        </div>
        <div className="mt-8">
          {' '}
          {/* Changed from .zone-bar-chart */}
          <ApexChart
            options={{
              chart: { type: 'bar' },
              plotOptions: { bar: { distributed: true } },
              xaxis: {
                categories: ['FastBuy', 'FastSell', 'DelayedBuy', 'DelayedSell'],
                labels: { style: { colors: '#ffffff' } },
              },
              yaxis: { labels: { style: { colors: '#ffffff' } } },
              title: {
                text: 'Jumlah Zona & Insight (%)',
                align: 'center',
                style: { color: '#ffffff' },
              },
              dataLabels: {
                enabled: true,
                formatter: (val, opts) => {
                  const category = opts.w.globals.labels[opts.dataPointIndex];
                  const key = categoryToKey[category];
                  const pct = zoneCounts[`${key}_pct`] || 0;
                  return `${val} (${pct}%)`;
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
              },
              colors: ['#008FFB', '#FF4560', '#008FFB', '#FF4560'],
            }}
            series={[
              {
                name: 'Jumlah',
                data: [zoneCounts.FBuy, zoneCounts.FSell, zoneCounts.DBuy, zoneCounts.DSell],
              },
            ]}
            type="bar"
            height={300}
          />
        </div>
      </main>
    </div>
  );
}
