import React from 'react';
import { ArrowUpRight, CheckCircle2, FolderKanban, Github } from 'lucide-react';

const Projects = React.memo(({ projects }) => {
  if (!projects?.length) return null;
  return (
    <section id="projects" className="bg-slate-50">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div data-aos="fade-up"><p className="section-kicker">Selected work</p><h2 className="section-heading">Systems built for scale, speed, and real outcomes.</h2></div>
          <p className="max-w-xl text-base leading-8 text-slate-600" data-aos="fade-up">A selection of platforms and integrations where thoughtful backend engineering translated into measurable product value.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <article key={project.id || project.name} className={`project-card group ${index === 0 ? 'md:col-span-2 md:grid md:grid-cols-[0.85fr_1.15fr]' : ''}`} data-aos="fade-up" data-aos-delay={(index % 2) * 70}>
              <div className={`relative flex min-h-56 items-end overflow-hidden bg-blue-700 p-7 ${index === 0 ? 'md:min-h-full' : ''}`}>
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:28px_28px]" aria-hidden="true" />
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-400/30 blur-2xl" aria-hidden="true" />
                <div className="relative"><span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur"><FolderKanban size={26} aria-hidden="true" /></span><p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">Case study {String(index + 1).padStart(2, '0')}</p></div>
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <div className="flex items-start justify-between gap-4"><h3 className="text-2xl font-semibold leading-tight text-slate-950">{project.name}</h3><div className="flex shrink-0 gap-2">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="icon-button !h-11 !w-11" aria-label={`View ${project.name} on GitHub`}><Github size={18} aria-hidden="true" /></a>}{project.liveDemoUrl && <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="icon-button !h-11 !w-11" aria-label={`Open ${project.name} live demo`}><ArrowUpRight size={18} aria-hidden="true" /></a>}</div></div>
                <p className="mt-4 leading-7 text-slate-600">{project.description}</p>
                {project.highlight?.length > 0 && <ul className="mt-6 space-y-3">{project.highlight.slice(0, index === 0 ? 3 : 2).map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" /><span>{item}</span></li>)}</ul>}
                {project.techStack && <div className="mt-auto flex flex-wrap gap-2 pt-7">{project.techStack.split(',').slice(0, 5).map((tech) => <span key={tech} className="tag">{tech.trim()}</span>)}</div>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';
export default Projects;
