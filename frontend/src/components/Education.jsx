import React from 'react';
import { Award, BookOpen, CalendarDays, GraduationCap } from 'lucide-react';

const Education = React.memo(({ education }) => {
  if (!education?.length) return null;
  return (
    <section id="education" className="bg-slate-50">
      <div className="section-shell">
        <div data-aos="fade-up"><p className="section-kicker">Education</p><h2 className="section-heading">The foundations behind the work.</h2><p className="section-copy">Formal education paired with an ongoing habit of learning, experimenting, and refining the craft.</p></div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {education.map((item, index) => (
            <article key={item.id || item.institute} className="surface-card flex flex-col p-7" data-aos="fade-up" data-aos-delay={index * 60}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-700 text-white"><GraduationCap size={24} aria-hidden="true" /></span>
              <h3 className="mt-6 text-xl font-semibold leading-7 text-slate-950">{item.institute}</h3>
              {item.degree && <p className="mt-4 flex gap-2 text-sm leading-6 text-blue-800"><BookOpen size={17} className="mt-0.5 shrink-0" aria-hidden="true" />{item.degree}</p>}
              {item.board && <p className="mt-3 text-sm leading-6 text-slate-600">{item.board}</p>}
              <div className="mt-auto space-y-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
                <p className="flex items-center gap-2"><CalendarDays size={16} className="text-blue-700" aria-hidden="true" />{item.duration}</p>
                {(item.cgpa || item.percentage) && <p className="flex items-center gap-2 font-bold text-slate-800"><Award size={16} className="text-orange-600" aria-hidden="true" />{item.cgpa ? `CGPA ${item.cgpa}` : item.percentage}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

Education.displayName = 'Education';
export default Education;
