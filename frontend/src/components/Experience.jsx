import React, { useEffect } from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import AOS from 'aos';

/**
 * Experience Component - Professional timeline with modern design
 */
const Experience = React.memo(({ experiences }) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="experience" className="section-container bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div data-aos="fade-up">
          <h2 className="section-title">Work Experience</h2>
          <p className="section-subtitle">
            My professional journey and contributions
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-12 relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 hidden md:block"></div>

          {/* Experience Items */}
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className="relative"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 transform -translate-x-1/2 hidden md:block">
                  <div className="timeline-dot"></div>
                </div>

                {/* Content Card */}
                <div className="md:ml-20 glass-card p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3">
                          {exp.role} <span className="text-slate-400 dark:text-slate-500">|</span> <span className="text-blue-600 dark:text-blue-400">{exp.company}</span>
                        </h3>
                        {exp.location && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin size={14} />
                            {exp.location}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mt-2">
                      <Calendar size={16} />
                      {exp.duration}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {exp.description}
                    </p>
                  )}

                  {/* Associated Projects */}
                  {exp.projects && exp.projects.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Key Projects:
                      </h4>
                      <div className="space-y-2">
                        {exp.projects.map((project) => (
                          <div
                            key={project.id}
                            className="pl-4 border-l-2 border-blue-600/30 hover:border-blue-600 transition-colors"
                          >
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                              {project.name}
                            </p>
                            {project.description && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {project.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

Experience.displayName = 'Experience';

export default Experience;
