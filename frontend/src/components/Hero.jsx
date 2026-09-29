import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Download, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import DownloadModal from './DownloadModal';
import { downloadCVAsPDF, downloadPortfolioAsCSV, downloadPortfolioAsJSON } from '../utils/downloadCV';

const Hero = ({ profile, experiences, education, skills, projects }) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  if (!profile) return null;

  const handleDownload = (format) => {
    if (format === 'html') downloadCVAsPDF(profile, experiences, education, skills, projects);
    if (format === 'csv') downloadPortfolioAsCSV(profile, experiences, education, skills, projects);
    if (format === 'json') downloadPortfolioAsJSON(profile, experiences, education, skills, projects);
  };

  const metrics = [
    { value: '4.5+', label: 'Years building products' },
    { value: `${projects?.length || 6}`, label: 'Selected case studies' },
    { value: `${experiences?.length || 4}`, label: 'Teams and companies' },
  ];

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-28 sm:pt-32">
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -left-40 top-28 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-28 top-16 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" aria-hidden="true" />
      <div className="page-shell relative z-10 grid min-h-[calc(100vh-7rem)] items-center gap-14 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div data-aos="fade-up">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-blue-200 bg-white/75 px-4 py-2 text-sm font-bold text-blue-900 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" /></span>
            Software engineer based in Chennai
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.06] text-slate-950 sm:text-6xl lg:text-7xl xl:text-[5.25rem]">I build reliable systems that make complex work feel <span className="text-blue-700">simple.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">{profile.title} focused on scalable Java, Spring Boot, cloud integrations, and event-driven products that perform beautifully under real-world pressure.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#projects" className="button-primary">Explore selected work <ArrowDownRight size={18} aria-hidden="true" /></a>
            <button type="button" onClick={() => setShowDownloadModal(true)} className="button-secondary"><Download size={18} aria-hidden="true" /> Download résumé</button>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
            {profile.location && <span className="flex items-center gap-2"><MapPin size={17} className="text-blue-700" aria-hidden="true" />{profile.location}</span>}
            {profile.email && <a href={`mailto:${profile.email}`} className="flex min-h-11 items-center gap-2 transition hover:text-blue-700"><Mail size={17} className="text-blue-700" aria-hidden="true" />{profile.email}</a>}
          </div>
          <div className="mt-8 flex gap-3">
            {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="icon-button" aria-label="GitHub profile"><Github size={20} aria-hidden="true" /></a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="icon-button" aria-label="LinkedIn profile"><Linkedin size={20} aria-hidden="true" /></a>}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg" data-aos="fade-up" data-aos-delay="100">
          <div className="absolute -inset-5 rotate-3 rounded-[2.5rem] bg-blue-700" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2.25rem] border-8 border-white bg-slate-200 shadow-2xl shadow-blue-950/20">
            <img src="/profile.jpg" alt={`${profile.name}, ${profile.title}`} width="640" height="760" className="aspect-[4/5] w-full object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-7 pt-24 text-white"><p className="font-heading text-2xl font-semibold">{profile.name}</p><p className="mt-1 text-sm text-slate-200">{profile.title}</p></div>
          </div>
          <div className="metric-card gentle-float absolute -left-5 top-10 hidden items-center gap-3 sm:flex"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-100 text-orange-700"><BriefcaseBusiness size={21} aria-hidden="true" /></span><span><strong className="block font-heading text-sm text-slate-900">SDE II</strong><small className="text-slate-500">Product engineering</small></span></div>
          <a href="#experience" className="metric-card absolute -bottom-6 right-3 flex min-h-12 items-center gap-3 text-sm font-bold text-slate-800 transition hover:text-blue-700">View my journey <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:col-span-2" data-aos="fade-up">
          {metrics.map((metric) => <div key={metric.label} className="rounded-2xl border border-slate-200/80 bg-white/70 px-6 py-5 backdrop-blur-md"><p className="font-heading text-2xl font-semibold text-slate-950">{metric.value}</p><p className="mt-1 text-sm text-slate-500">{metric.label}</p></div>)}
        </div>
      </div>
      <DownloadModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} onDownload={handleDownload} />
    </section>
  );
};

export default Hero;
