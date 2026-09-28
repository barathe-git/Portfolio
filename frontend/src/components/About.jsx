import { createElement } from 'react';
import { Blocks, Gauge, Network, Quote } from 'lucide-react';

const strengths = [
  { icon: Blocks, title: 'Backend craftsmanship', text: 'Clean APIs, resilient services, and pragmatic domain models built for change.' },
  { icon: Network, title: 'Systems thinking', text: 'Event-driven flows, cloud integrations, and data layers designed as one coherent system.' },
  { icon: Gauge, title: 'Performance by design', text: 'Fast paths, predictable failure handling, and production observability from day one.' },
];

const About = ({ profile }) => {
  if (!profile) return null;
  return (
    <section id="about" className="relative bg-white">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div data-aos="fade-up">
          <p className="section-kicker">About</p>
          <h2 className="section-heading">Engineering with clarity, ownership, and care.</h2>
          <p className="section-copy">I enjoy turning ambiguous requirements into dependable software—balancing technical depth with the practical needs of teams, users, and the business.</p>
        </div>
        <div className="space-y-6" data-aos="fade-up" data-aos-delay="80">
          <div className="surface-card relative overflow-hidden p-7 sm:p-10">
            <Quote className="absolute right-7 top-7 text-blue-100" size={64} strokeWidth={1.5} aria-hidden="true" />
            <p className="relative max-w-3xl text-lg leading-9 text-slate-700">{profile.summary}</p>
            <div className="mt-8 flex items-center gap-4 border-t border-slate-200 pt-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-700 font-heading text-sm font-bold text-white">BE</span>
              <div><p className="font-heading font-semibold text-slate-900">{profile.name}</p><p className="text-sm text-slate-500">{profile.title}</p></div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {strengths.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-200 hover:border-blue-200 hover:bg-white" data-aos="fade-up" data-aos-delay={index * 60}>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-700">{createElement(Icon, { size: 21, 'aria-hidden': true })}</span>
                <h3 className="mt-5 text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
