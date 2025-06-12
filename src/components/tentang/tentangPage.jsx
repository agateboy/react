import React from 'react';
import { useTentangPresenter } from './tentangPresenter';
import './tentang.css';
import AboutUsImage from '../../assets/logo.png';

export default function TentangPage() {
  const { teamMembers, tentangKamiText } = useTentangPresenter();

  return (
    <main className="text-black font-[Montserrat] px-6 py-12 max-w-[1120px] mx-auto">
      <section className="flex flex-col md:flex-row md:items-start md:space-x-20 about-us max-w-[800px] mx-auto">
        <img
          src={AboutUsImage}
          alt="Tentang Kami"
          className="w-full md:w-[400px] rounded-md object-cover mb-8 md:mb-0"
        />
        <div className="max-w-[400px]">
          <h2 className="text-[#7cff36] text-xl font-extrabold mb-6 about-us-h2 text-center md:text-left">
            {' '}
            Tentang Kami
          </h2>
          {tentangKamiText.map((text, index) => (
            <p key={index} className="about-us-p text-center md:text-left">
              {' '}
              {text}
            </p>
          ))}
        </div>
      </section>

      <h3 className="team-title text-[#7cff36] font-extrabold text-center text-3xl md:text-4xl">
        Our Team
      </h3>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {teamMembers.map((member, index) => (
          <article
            className="team-card max-w-[320px] border-2 border-[#7cff36] bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-[rgba(124,255,54,0.5)] hover:-translate-y-2 mx-auto"
            key={index}
          >
            <div className="w-full aspect-square relative">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="name font-bold text-sm mb-1 text-gray-700">{member.name}</p>
              <p className="role font-semibold text-xs mb-2 text-[#7cff36]">{member.role}</p>
              <p className="university text-xs mb-4 text-gray-600">{member.university}</p>
              <div className="icons flex">
                <a
                  href={member.github}
                  aria-label={`GitHub profile of ${member.name}`}
                  className="text-gray-600 mr-4 text-base transition-colors duration-300 ease-in-out hover:text-[#7cff36]"
                >
                  <i className="fab fa-github"></i>
                </a>
                <a
                  href={member.linkedin}
                  aria-label={`LinkedIn profile of ${member.name}`}
                  className="text-gray-600 text-base transition-colors duration-300 ease-in-out hover:text-[#7cff36]"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
