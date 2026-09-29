import React from 'react';
import { Braces, CloudCog, CodeXml, Database, GitBranch, Waypoints } from 'lucide-react';

const iconMap = {
  Languages: CodeXml,
  Frameworks: Braces,
  Databases: Database,
  'Cloud & Services': CloudCog,
  Architecture: Waypoints,
  Tools: GitBranch,
};

const Skills = React.memo(({ skills }) => {
  if (!skills?.length) return null;
  const groups = skills.reduce((result, skill) => {
    const category = skill.category || 'Other';
    result[category] = [...(result[category] || []), skill];
    return result;
  }, {});

  return (
    <section id="skills" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,0.28),transparent_36%),radial-gradient(circle_at_15%_80%,rgba(234,88,12,0.13),transparent_30%)]" aria-hidden="true" />
      <div className="section-shell relative">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div data-aos="fade-up"><p className="section-kicker !text-blue-300">Technical toolkit</p><h2 className="section-heading !text-white">A versatile stack for modern product engineering.</h2></div>
          <p className="max-w-xl text-base leading-8 text-slate-300" data-aos="fade-up">From typed backend services to cloud-native infrastructure, I choose tools that make systems easier to evolve and operate.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groups).map(([category, categorySkills], index) => {
            const Icon = iconMap[category] || CodeXml;
            return (
              <article key={category} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition duration-300 hover:border-blue-400/40 hover:bg-white/[0.09]" data-aos="fade-up" data-aos-delay={index * 60}>
                <div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/15 text-blue-300"><Icon size={23} aria-hidden="true" /></span><h3 className="text-lg font-semibold text-white">{category}</h3></div>
                <div className="mt-6 flex flex-wrap gap-2">{categorySkills.map((skill) => <span key={skill.id || skill.name} className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-sm text-slate-200">{skill.name}</span>)}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
});

Skills.displayName = 'Skills';
export default Skills;
