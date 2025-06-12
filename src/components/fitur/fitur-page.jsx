import React from 'react';
import { useFiturPresenter } from './fitur-presenter';
import './fitur.css';

const FiturPage = () => {
  const { features, loading, error } = useFiturPresenter();

  if (loading) {
    return <div className="text-center py-10 text-gray-700">Memuat fitur...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <main className="px-4 py-12 max-w-full">
      <h2 className="text-2xl font-semibold text-center mb-10 text-gray-900">Fitur Narastock</h2>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 max-w-[1200px] mx-auto">
        {features.map((feature) => (
          <article
            key={feature.id}
            className="bg-white rounded-xl p-5 flex flex-col items-center text-center card-animate border border-transparent"
          >
            {feature.id === 2 ? ( 
              <div className="relative mb-3 icon-animate w-12 h-12">
                <img
                  alt={feature.iconAlt}
                  className="absolute top-0 left-0 w-12 h-12"
                  src={feature.iconSrc}
                />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white"></span>
              </div>
            ) : (
              <img
                alt={feature.iconAlt}
                className="mb-3 icon-animate h-12 w-12"
                src={feature.iconSrc}
              />
            )}
            <h3 className="font-semibold text-base mb-2">
              {' '}
              {feature.title}
            </h3>
            <p className="leading-relaxed text-sm">
              {' '}
              {feature.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default FiturPage;
