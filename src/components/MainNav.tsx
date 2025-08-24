'use client';

import { Github, Linkedin, Instagram, PanelLeft, Home, User, Briefcase, Mail, Code } from 'lucide-react';
import type { Socials } from '@/lib/markdown';
import { useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '#about', label: 'About', number: '01.' },
  { href: '#experience', label: 'Experience', number: '02.' },
  { href: '#projects', label: 'Projects', number: '03.' },
  { href: '#contact', label: 'Contact', number: '04.' },
];

export function MainNav({ name, socials }: { name: string; socials: Socials }) {
  const { setOpenMobile } = useSidebar();
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => document.getElementById(link.href.substring(1)));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let currentSection = '';
      for (const section of sections) {
        if (section && scrollPosition >= section.offsetTop) {
          currentSection = `#${section.id}`;
        }
      }
      setActiveLink(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between p-2">
        <a href="#hero" className="font-headline text-2xl font-bold text-primary">
          {name.charAt(0)}
        </a>
        <Button
          data-sidebar="trigger"
          variant="ghost"
          size="icon"
          className="h-7 w-7 md:hidden"
          onClick={() => setOpenMobile(false)}
        >
          <PanelLeft />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <nav className="my-auto flex flex-col items-center justify-center gap-4">
        {navLinks.map(({ href, label, number }) => (
          <a 
            key={label} 
            href={href}
            onClick={() => {
              setOpenMobile(false);
              setActiveLink(href);
            }}
            className={`
              font-mono text-sm
              transition-colors hover:text-primary 
              md:flex md:flex-col md:items-center md:gap-1
              ${activeLink === href ? 'text-primary' : 'text-muted-foreground'}
            `}
          >
            <span className="text-primary">{number}</span>
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="mt-auto flex justify-center gap-4">
        <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
          <Github className="h-5 w-5" />
        </a>
        <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
          <Linkedin className="h-5 w-5" />
        </a>
        <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
          <Instagram className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
