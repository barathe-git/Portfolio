import React, { useEffect } from 'react';
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import AOS from 'aos';

/**
 * Education Component - Academic background with modern card design
 */
const Education = ({ education }) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="section-container bg-white dark:bg-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div data-aos="fade-up">
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle">
            My academic background and qualifications
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {education.map((edu, index) => (
            <div
              key={edu.id}
              className="glass-card p-6 group hover:shadow-2xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="text-white" size={32} />
              </div>

              {/* Institution */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                {edu.institute}
              </h3>

              {/* Degree */}
              {edu.degree && (
                <div className="flex items-start gap-2 mb-2">
                  <BookOpen className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-2">
                    {edu.degree}
                  </p>
                </div>
              )}

              {/* Board/University */}
              {edu.board && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                  {edu.board}
                </p>
              )}

              {/* Duration */}
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                <Calendar size={14} />
                <span>{edu.duration}</span>
              </div>

              {/* Grade */}
              {(edu.cgpa || edu.percentage) && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Award className="text-yellow-500" size={16} />
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {edu.cgpa ? `CGPA: ${edu.cgpa}` : edu.percentage}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Certifications Section */}
        <div className="mt-12 text-center" data-aos="fade-up">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold gradient-text mb-4">Continuous Learning</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Always staying updated with the latest technologies and industry best practices through courses and certifications.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['AWS Certified', 'Spring Professional', 'React Advanced'].map((cert, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium shadow-lg"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
