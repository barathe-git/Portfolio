import React, { useEffect } from 'react';
import { User, Award, Coffee, Code, Zap } from 'lucide-react';
import AOS from 'aos';

/**
 * About Component - Professional introduction with stats
 */
const About = ({ profile }) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  if (!profile) return null;

  const stats = [
    { icon: Code, label: 'Years Experience', value: '4+', color: 'from-blue-500 to-cyan-500' },
    { icon: Award, label: 'Projects Completed', value: '20+', color: 'from-purple-500 to-pink-500' },
    { icon: Coffee, label: 'Technologies', value: '15+', color: 'from-orange-500 to-red-500' },
    { icon: Zap, label: 'Happy Clients', value: '10+', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <section id="about" className="section-container bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div data-aos="fade-up">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            Get to know more about my background and expertise
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mt-12">
          {/* Left - Profile Card */}
          <div data-aos="fade-right">
            <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <User className="text-white" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{profile.title}</p>
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {profile.summary}
              </p>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-3 text-sm">
                  {profile.email && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">Email:</span>
                      <a href={`mailto:${profile.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="font-semibold">Location:</span>
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Stats Grid */}
          <div data-aos="fade-left" className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center group"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-white" size={32} />
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
