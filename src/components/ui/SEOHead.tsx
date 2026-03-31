import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

function absoluteUrl(base: string, path: string): string {
  if (path.startsWith('http')) return path;
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Samuel Pinheiro - Full Stack Developer & AI Portfolio',
  description = 'Interactive AI-powered portfolio showcasing full-stack development projects, React expertise, and innovative solutions. Chat with my AI assistant to explore my work.',
  keywords = [
    'full stack developer',
    'react developer',
    'nodejs developer',
    'typescript',
    'ai integration',
    'portfolio',
    'samuel pinheiro',
    'web development',
    'frontend developer',
    'backend developer',
  ],
  ogImage = '/og-image.png',
  canonical = 'https://samuel.dev',
}) => {
  const ogImageAbsolute = absoluteUrl(canonical, ogImage);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${canonical}#person`,
        name: 'Samuel Pinheiro',
        jobTitle: 'Full Stack Developer',
        description:
          'Experienced full-stack developer specializing in React, Node.js, and AI integration',
        url: canonical,
        sameAs: [
          'https://github.com/samuel-pinheiro',
          'https://linkedin.com/in/samuel-pinheiro',
          'https://twitter.com/samuel_dev',
        ],
        knowsAbout: [
          'React',
          'Node.js',
          'TypeScript',
          'JavaScript',
          'AI Integration',
          'Full Stack Development',
          'Frontend Development',
          'Backend Development',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${canonical}#website`,
        url: canonical,
        name: 'Samuel Pinheiro — Portfolio',
        inLanguage: 'en-US',
        description,
        publisher: { '@id': `${canonical}#person` },
      },
    ],
  };

  React.useEffect(() => {
    const faviconHref = '/favicon.svg';
    let iconLink = document.querySelector(
      'link[rel="icon"][type="image/svg+xml"]'
    ) as HTMLLinkElement | null;
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      iconLink.type = 'image/svg+xml';
      document.head.appendChild(iconLink);
    }
    iconLink.href = faviconHref;

    let appleLink = document.querySelector(
      'link[rel="apple-touch-icon"]'
    ) as HTMLLinkElement | null;
    if (!appleLink) {
      appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleLink);
    }
    appleLink.href = faviconHref;

    let sitemapLink = document.querySelector(
      'link[rel="sitemap"]'
    ) as HTMLLinkElement | null;
    if (!sitemapLink) {
      sitemapLink = document.createElement('link');
      sitemapLink.rel = 'sitemap';
      sitemapLink.type = 'application/xml';
      sitemapLink.title = 'Sitemap';
      document.head.appendChild(sitemapLink);
    }
    sitemapLink.href = '/sitemap.xml';

    document.title = title;

    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let tag = document.querySelector(
        `meta[${attribute}="${name}"]`
      ) as HTMLMetaElement;

      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }

      tag.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('author', 'Samuel Pinheiro');
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', canonical, true);
    updateMetaTag('og:image', ogImageAbsolute, true);
    updateMetaTag('og:image:alt', title, true);
    updateMetaTag('og:site_name', 'Samuel Pinheiro Portfolio', true);
    updateMetaTag('og:locale', 'en_US', true);

    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImageAbsolute);
    updateMetaTag('twitter:image:alt', title);
    updateMetaTag('twitter:creator', '@samuel_dev');
    updateMetaTag('twitter:site', '@samuel_dev');

    let canonicalLink = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    let structuredDataScript = document.querySelector(
      '#structured-data'
    ) as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

    let viewportTag = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (!viewportTag) {
      viewportTag = document.createElement('meta');
      viewportTag.name = 'viewport';
      viewportTag.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewportTag);
    }

    document.documentElement.lang = 'en';
  }, [title, description, keywords, ogImage, canonical]);

  return null;
};

export const useSEO = () => {
  const updateSEO = React.useCallback((seoProps: SEOHeadProps) => {
    if (seoProps.title) {
      document.title = seoProps.title;
    }

    if (seoProps.description) {
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      ) as HTMLMetaElement;
      if (metaDescription) {
        metaDescription.content = seoProps.description;
      }
    }
  }, []);

  return { updateSEO };
};
