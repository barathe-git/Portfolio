import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Work', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${isScrolled || isOpen ? 'nav-glass' : 'bg-transparent'}`} aria-label="Primary navigation">
      <div className="page-shell flex h-20 items-center justify-between">
        <a href="#home" className="flex min-h-11 items-center gap-3 rounded-lg" aria-label="Barath E — home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 font-heading text-sm font-bold text-white shadow-lg shadow-blue-700/20">BE</span>
          <span className="font-heading text-sm font-semibold text-slate-900">Barath Elumalai</span>
        </a>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => <a key={link.name} href={link.href} className="rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-blue-700">{link.name}</a>)}
          <a href="#contact" className="button-primary ml-3 !min-h-11 !px-5">Let&apos;s talk <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <button type="button" className="icon-button lg:hidden" onClick={() => setIsOpen((value) => !value)} aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isOpen} aria-controls="mobile-navigation">
          {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>
      {isOpen && (
        <div id="mobile-navigation" className="border-t border-slate-200 bg-slate-50/95 px-5 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="min-h-12 rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-white hover:text-blue-700">{link.name}</a>)}
            <a href="#contact" onClick={() => setIsOpen(false)} className="button-primary mt-2">Let&apos;s talk <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
