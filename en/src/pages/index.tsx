import React, { type ReactNode } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

/* ------------------------------------------------------------------ */
/*  Duotone SVG Icon Components                                        */
/* ------------------------------------------------------------------ */
// Shared frame: outline in currentColor, `tint` shapes get a soft fill
function IconFrame({ children }: { children: ReactNode }): ReactNode {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const tint = { fill: 'currentColor', fillOpacity: 0.18 };

function IconGetStarted(): ReactNode {
  // Rocket — launch quickly
  return (
    <IconFrame>
      <path {...tint} d="M12 2.5c3 2 4.5 5.5 4.5 9.5l-2 3h-5l-2-3c0-4 1.5-7.5 4.5-9.5z" />
      <circle cx="12" cy="9.5" r="1.75" />
      <path d="M7.5 12L5 14.5v3l4-1.5" />
      <path d="M16.5 12l2.5 2.5v3l-4-1.5" />
      <path d="M10.5 18c0 1.5 1.5 3.5 1.5 3.5s1.5-2 1.5-3.5" />
    </IconFrame>
  );
}

function IconDevelop(): ReactNode {
  // Package — install and set up
  return (
    <IconFrame>
      <path {...tint} d="M3.5 8L12 3.5 20.5 8v8.5L12 21l-8.5-4.5z" />
      <path d="M3.5 8L12 12.5 20.5 8" />
      <path d="M12 12.5V21" />
      <path d="M7.75 5.75l8.5 4.5v3" />
    </IconFrame>
  );
}

function IconFHIR(): ReactNode {
  // Official FHIR flame icon from the HL7 FHIR icon pack (hl7.org/fhir/iconpack)
  const src = useBaseUrl('/img/logos/fhir-icon.png');
  return <img src={src} alt="FHIR" width={22} height={22} />;
}

function IconHL7(): ReactNode {
  // Message bubble with pipe-delimited segments — HL7v2 messaging
  return (
    <IconFrame>
      <path {...tint} d="M4 3.5h16A1.5 1.5 0 0121.5 5v10a1.5 1.5 0 01-1.5 1.5h-9.5L6 20.5v-4H4A1.5 1.5 0 012.5 15V5A1.5 1.5 0 014 3.5z" />
      <path d="M6 8h3" />
      <path d="M11 6.5v3" />
      <path d="M13 8h5" />
      <path d="M6 12h5" />
      <path d="M13 10.5v3" />
      <path d="M15 12h3" />
    </IconFrame>
  );
}

function IconSmartOnFhir(): ReactNode {
  // Shield with keyhole — SMART app launch and secure authorization
  return (
    <IconFrame>
      <path {...tint} d="M12 2.5l7.5 3V11c0 5-3.2 8.6-7.5 10.5C7.7 19.6 4.5 16 4.5 11V5.5z" />
      <circle cx="12" cy="10" r="2" />
      <path d="M12 12v3.5" />
    </IconFrame>
  );
}

function IconTutorials(): ReactNode {
  // Two documents with conversion arrows — data transformation
  return (
    <IconFrame>
      <rect {...tint} x="2.5" y="3" width="7" height="9" rx="1.5" />
      <rect {...tint} x="14.5" y="12" width="7" height="9" rx="1.5" />
      <path d="M5 6.5h2" />
      <path d="M5 9h2" />
      <path d="M17 15.5h2" />
      <path d="M17 18h2" />
      <path d="M6 12v3.5a2 2 0 002 2h4.5" />
      <path d="M10.5 15.5l2 2-2 2" />
      <path d="M18 12V8.5a2 2 0 00-2-2h-4.5" />
      <path d="M13.5 4.5l-2 2 2 2" />
    </IconFrame>
  );
}

function IconDeploy(): ReactNode {
  // Hospital linked to external systems — EMR connectivity
  return (
    <IconFrame>
      <path {...tint} d="M3 21V6.5A1.5 1.5 0 014.5 5h8A1.5 1.5 0 0114 6.5V21z" />
      <path d="M8.5 8.5v4" />
      <path d="M6.5 10.5h4" />
      <path d="M7 21v-3.5h3V21" />
      <path d="M2 21h13" />
      <path d="M14 10.5l3.5-2.5" />
      <path d="M14 14.5l3.5 2.5" />
      <circle cx="19.5" cy="6.75" r="2" />
      <circle cx="19.5" cy="18.25" r="2" />
    </IconFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Data                                                       */
/* ------------------------------------------------------------------ */
type SectionCard = {
  title: string;
  description: string;
  link: string;
  icon: ReactNode;
  iconBg: string;
  iconBgDark: string;
  iconColor: string;
};

const sections: SectionCard[] = [
  {
    title: 'Get started',
    description: 'Install and understand the accelerator architecture quickly.',
    link: '/docs/get-started/architecture',
    icon: <IconGetStarted />,
    iconBg: '#ECFDF5',
    iconBgDark: 'rgba(5, 150, 105, 0.15)',
    iconColor: '#059669',
  },
  {
    title: 'Install and setup',
    description: 'Follow manual setup steps to run the healthcare accelerator.',
    link: '/docs/install-and-setup/manual',
    icon: <IconDevelop />,
    iconBg: '#EFF6FF',
    iconBgDark: 'rgba(37, 99, 235, 0.15)',
    iconColor: '#2563EB',
  },
  {
    title: 'FHIR',
    description: 'Work with FHIR resources, validation, bundles, and profiles.',
    link: '/docs/fhir/guides/overview-of-fhir',
    icon: <IconFHIR />,
    iconBg: '#FFF1F2',
    iconBgDark: 'rgba(225, 29, 72, 0.15)',
    iconColor: '#E11D48',
  },
  {
    title: 'HL7',
    description: 'Process HL7 messages and connect with HL7-based systems.',
    link: '/docs/hl7/guides/overview',
    icon: <IconHL7 />,
    iconBg: '#EFF6FF',
    iconBgDark: 'rgba(37, 99, 235, 0.15)',
    iconColor: '#2563EB',
  },
  {
    title: 'Data transformation',
    description: 'Transform healthcare payloads such as HL7v2 and CCDA to FHIR.',
    link: '/docs/data-transformation/guides/hl7v2-fhir',
    icon: <IconTutorials />,
    iconBg: '#FFF8EB',
    iconBgDark: 'rgba(217, 119, 6, 0.15)',
    iconColor: '#D97706',
  },
  {
    title: 'EMR connectivity',
    description: 'Integrate with EMR systems including Epic integrations.',
    link: '/docs/emr-connectivity/guides/emr-systems-overview',
    icon: <IconDeploy />,
    iconBg: '#ECFEFF',
    iconBgDark: 'rgba(8, 145, 178, 0.15)',
    iconColor: '#0891B2',
  },
  {
    title: 'SMART on FHIR',
    description: 'Set up SMART on FHIR and secure healthcare API access.',
    link: '/docs/secure-health-apis/guides/smart-on-fhir-overview',
    icon: <IconSmartOnFhir />,
    iconBg: '#ECFDF5',
    iconBgDark: 'rgba(5, 150, 105, 0.15)',
    iconColor: '#059669',
  },
];

/* ------------------------------------------------------------------ */
/*  Quick-links shown when the search input is focused but empty       */
/* ------------------------------------------------------------------ */
const quickLinks = [
  { label: 'Get started', to: '/docs/get-started/architecture' },
  { label: 'Install manually', to: '/docs/install-and-setup/manual' },
  { label: 'FHIR overview', to: '/docs/fhir/guides/overview-of-fhir' },
  { label: 'HL7 overview', to: '/docs/hl7/guides/overview' },
];

/* ------------------------------------------------------------------ */
/*  Central Search Bar                                                 */
/* ------------------------------------------------------------------ */
function SearchBar(): ReactNode {
  const history = useHistory();
  const searchPath = useBaseUrl('/search');
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (e.target as HTMLElement).tagName,
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (query.trim()) {
        history.push(`${searchPath}?q=${encodeURIComponent(query.trim())}`);
        setFocused(false);
      }
    },
    [query, history, searchPath],
  );

  return (
    <div ref={wrapperRef} className={styles.searchWrapper}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <button type="submit" className={styles.searchIconButton} aria-label="Search">
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          aria-label="Search documentation"
        />
        <kbd className={styles.searchKbd}>/</kbd>
      </form>

      {/* Quick-links dropdown when focused and empty query */}
      {focused && !query && (
        <div className={styles.searchDropdown}>
          <p className={styles.searchDropdownLabel}>Popular pages</p>
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={styles.searchDropdownItem}
              onClick={() => setFocused(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Banner                                                        */
/* ------------------------------------------------------------------ */
function HomepageHeader(): ReactNode {
  return (
    <header className={styles.heroBanner}>
      <div className="container">

        <Heading as="h1">WSO2 Open Healthcare</Heading>
        <p className={styles.heroSubtitle}>
          Build healthcare integrations with FHIR and HL7 interoperability.
        </p>
        <SearchBar />
        <div className={styles.buttons}>
          <Link
            className={styles.heroBtn}
            to="/docs/get-started/architecture">
            Start with healthcare docs
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Cards                                                      */
/* ------------------------------------------------------------------ */
function SectionCards(): ReactNode {
  return (
    <section className={styles.sectionCards}>
      <div className="container">
        <div className={styles.sectionGrid}>
          {sections.map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className={styles.sectionCard}
              style={
                {
                  '--icon-bg': card.iconBg,
                  '--icon-bg-dark': card.iconBgDark,
                  '--icon-color': card.iconColor,
                } as React.CSSProperties
              }>
              <span className={styles.sectionIcon}>{card.icon}</span>
              <Heading as="h3" className={styles.sectionCardTitle}>
                {card.title}
              </Heading>
              <p className={styles.sectionCardDesc}>{card.description}</p>
              <span className={styles.sectionCardArrow}>&rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  What's New banner                                                  */
/* ------------------------------------------------------------------ */
function WhatsNew(): ReactNode {
  return (
    <section className={styles.whatsNew}>
      <div className="container">
        <Link
          to="/docs/advance-topics/overview"
          className={styles.whatsNewLink}>
          <span className={styles.whatsNewBadge}>New</span>
          Advanced Topics
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Home page                                                          */
/* ------------------------------------------------------------------ */
export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <SectionCards />
        <WhatsNew />
      </main>
    </Layout>
  );
}
