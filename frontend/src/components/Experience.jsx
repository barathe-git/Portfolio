import React from 'react';
import { BriefcaseBusiness, CalendarDays, MapPin } from 'lucide-react';

const Experience = React.memo(({ experiences }) => {
  if (!experiences?.length) return null;
  return (
    <section id="experience" className="bg-white">
      <div className="section-shell grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start" data-aos="fade-up">
          <p className="section-kicker">Experience</p>
          <h2 className="section-heading">A journey shaped by ownership and continuous learning.</h2>
          <p className="section-copy">Progressing through product teams and problem spaces while staying grounded in strong engineering fundamentals.</p>
        </div>
        <div className="relative space-y-5 before:absolute before:bottom-8 before:left-6 before:top-8 before:w-px before:bg-slate-200 sm:before:left-7">
          {experiences.map((exp, index) => (
            <article key={exp.id || `${exp.company}-${exp.role}`} className="relative pl-16 sm:pl-20" data-aos="fade-up" data-aos-delay={index * 60}>
              <span className={`absolute left-0 top-7 z-10 grid h-12 w-12 place-items-center rounded-2xl border-4 border-white sm:h-14 sm:w-14 ${index === 0 ? 'bg-orange-600 text-slate-950' : 'bg-blue-700 text-white'}`}><BriefcaseBusiness size={21} aria-hidden="true" /></span>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 transition duration-200 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-bold text-blue-700">{exp.company}</p><h3 className="mt-1 text-xl font-semibold text-slate-950">{exp.role}</h3></div><span className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200"><CalendarDays size={15} aria-hidden="true" />{exp.duration}</span></div>
                {exp.location && <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><MapPin size={15} aria-hidden="true" />{exp.location}</p>}
                {exp.description && <p className="mt-4 leading-7 text-slate-600">{exp.description}</p>}
                {exp.projects?.length > 0 && <div className="mt-6 border-t border-slate-200 pt-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Key projects</p><div className="mt-3 flex flex-wrap gap-2">{exp.projects.map((project) => <span key={project.id || project.name} className="tag">{project.name}</span>)}</div></div>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

Experience.displayName = 'Experience';
export default Experience;
