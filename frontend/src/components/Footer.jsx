import { useState } from 'react';
import { ArrowUp, ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import DownloadModal from './DownloadModal';
import { downloadCVAsPDF, downloadPortfolioAsCSV, downloadPortfolioAsJSON } from '../utils/downloadCV';

const Footer = ({ profile, experiences, education, skills, projects }) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const handleDownload = (format) => {
    if (format === 'html') downloadCVAsPDF(profile, experiences, education, skills, projects);
    if (format === 'csv') downloadPortfolioAsCSV(profile, experiences, education, skills, projects);
    if (format === 'json') downloadPortfolioAsJSON(profile, experiences, education, skills, projects);
  };

  return (
    <footer id="contact" className="bg-slate-950 text-white">
      <div className="page-shell py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-blue-700 px-6 py-12 sm:px-10 lg:px-14">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-400/25 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">Have a project in mind?</p><h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">Let&apos;s build something reliable, useful, and memorable.</h2></div>
            <a href={`mailto:${profile?.email || 'barath.contact@gmail.com'}`} className="button-primary shrink-0">Start a conversation <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div><a href="#home" className="inline-flex min-h-12 items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white font-heading text-sm font-bold text-blue-800">BE</span><span className="font-heading font-semibold">Barath Elumalai</span></a><p className="mt-4 max-w-md text-sm leading-7 text-slate-400">Software engineer building scalable backend systems and thoughtful digital products.</p></div>
          <div><h3 className="text-sm font-semibold text-white">Navigate</h3><div className="mt-4 flex flex-col items-start gap-2 text-sm text-slate-400">{['About', 'Skills', 'Projects', 'Experience'].map((link) => <a key={link} href={`#${link.toLowerCase()}`} className="min-h-10 py-2 transition hover:text-white">{link}</a>)}</div></div>
          <div><h3 className="text-sm font-semibold text-white">Connect</h3><div className="mt-4 flex gap-3"><a href={profile?.github} target="_blank" rel="noopener noreferrer" className="icon-button !border-white/10 !bg-white/5 !text-slate-300 hover:!bg-white/10 hover:!text-white" aria-label="GitHub profile"><Github size={19} aria-hidden="true" /></a><a href={profile?.linkedin} target="_blank" rel="noopener noreferrer" className="icon-button !border-white/10 !bg-white/5 !text-slate-300 hover:!bg-white/10 hover:!text-white" aria-label="LinkedIn profile"><Linkedin size={19} aria-hidden="true" /></a><a href={`mailto:${profile?.email}`} className="icon-button !border-white/10 !bg-white/5 !text-slate-300 hover:!bg-white/10 hover:!text-white" aria-label="Send email"><Mail size={19} aria-hidden="true" /></a></div><button type="button" onClick={() => setShowDownloadModal(true)} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"><Download size={17} aria-hidden="true" />Download résumé</button></div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Barath Elumalai. Built with intention.</p><a href="#home" className="inline-flex min-h-11 items-center gap-2 self-start font-semibold text-slate-300 transition hover:text-white">Back to top <ArrowUp size={16} aria-hidden="true" /></a></div>
      </div>
      <DownloadModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} onDownload={handleDownload} />
    </footer>
  );
};

export default Footer;
