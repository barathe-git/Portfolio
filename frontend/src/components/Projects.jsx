import React, { useEffect } from 'react';
import { Folder, Github, ExternalLink, Star, TrendingUp } from 'lucide-react';
import AOS from 'aos';

/**
 * Projects Component - Showcase work with modern card design
 */
const Projects = ({ projects }) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="section-container bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div data-aos="fade-up">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            A showcase of my best work and contributions
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Folder className="text-white" size={28} />
                  </div>
                  
                  <div className="flex gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Title & Description */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Highlights */}
                {project.highlight && project.highlight.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="text-yellow-500" size={16} />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Key Achievements:
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {project.highlight.slice(0, 2).map((highlight, idx) => (
                        <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <TrendingUp className="text-green-500 flex-shrink-0 mt-0.5" size={14} />
                          <span className="line-clamp-2">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                {project.techStack && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.split(',').slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer - Optional Action */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2 group">
                  View Details
                  <ExternalLink className="group-hover:translate-x-1 transition-transform" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA
        <div className="text-center mt-12" data-aos="fade-up">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-modern">
            View All Projects on GitHub
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default Projects;
