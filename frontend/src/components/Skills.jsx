import React, { useEffect } from 'react';
import { Code2, Database, Cloud, Cpu } from 'lucide-react';
import AOS from 'aos';

/**
 * Skills Component - Modern skill showcase with categories
 */
const Skills = ({ skills }) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  if (!skills || skills.length === 0) return null;

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  // Icon mapping for categories
  const categoryIcons = {
    'Languages': Code2,
    'Frameworks': Cpu,
    'Databases': Database,
    'Cloud & Services': Cloud,
    'Architecture': Cpu,
    'Tools': Code2,
  };

  const categoryColors = {
    'Languages': 'from-blue-500 to-cyan-500',
    'Frameworks': 'from-purple-500 to-pink-500',
    'Databases': 'from-green-500 to-emerald-500',
    'Cloud & Services': 'from-orange-500 to-red-500',
    'Architecture': 'from-indigo-500 to-purple-500',
    'Tools': 'from-yellow-500 to-orange-500',
  };

  return (
    <section id="skills" className="section-container bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div data-aos="fade-up">
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">
            Technologies and tools I work with to build amazing products
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {Object.entries(groupedSkills).map(([category, categorySkills], index) => {
            const Icon = categoryIcons[category] || Code2;
            const colorClass = categoryColors[category] || 'from-gray-500 to-gray-600';
            
            return (
              <div
                key={category}
                className="glass-card p-6 card-hover-effect"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {category}
                  </h3>
                </div>

                {/* Skills List */}
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="skill-badge-modern"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tech Stack Highlight
        <div className="mt-12 text-center" data-aos="fade-up">
          <div className="glass-card p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold gradient-text mb-4">Core Technologies</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Java', 'Spring Boot', 'NodeJS', 'PostgreSQL', 'MongoDB', 'AWS'].map((tech, index) => (
                <div
                  key={tech}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:scale-110 transition-transform duration-300"
                  data-aos="zoom-in"
                  data-aos-delay={index * 50}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Skills;
