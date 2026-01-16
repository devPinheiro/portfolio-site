import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
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
    'backend developer'
  ],
  ogImage = '/og-image.png',
  canonical = 'https://samuel.dev'
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Samuel Pinheiro',
    jobTitle: 'Full Stack Developer',
    description: 'Experienced full-stack developer specializing in React, Node.js, and AI integration',
    url: canonical,
    sameAs: [
      'https://github.com/samuel-pinheiro',
      'https://linkedin.com/in/samuel-pinheiro',
      'https://twitter.com/samuel_dev'
    ],
    knowsAbout: [
      'React',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'AI Integration',
      'Full Stack Development',
      'Frontend Development',
      'Backend Development'
    ],
    alumniOf: {
      '@type': 'Organization',
      name: 'University of Technology'
    }
  };

  React.useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    updateMetaTag('author', 'Samuel Pinheiro');
    updateMetaTag('robots', 'index, follow');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', canonical, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:site_name', 'Samuel Pinheiro Portfolio', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:creator', '@samuel_dev');

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    // Structured data
    let structuredDataScript = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

    // Viewport meta tag
    let viewportTag = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewportTag) {
      viewportTag = document.createElement('meta');
      viewportTag.name = 'viewport';
      viewportTag.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewportTag);
    }

    // Language
    document.documentElement.lang = 'en';

  }, [title, description, keywords, ogImage, canonical]);

  return null; // This component doesn't render anything
};

// Hook for dynamic SEO updates
export const useSEO = () => {
  const updateSEO = React.useCallback((seoProps: SEOHeadProps) => {
    if (seoProps.title) {
      document.title = seoProps.title;
    }
    
    if (seoProps.description) {
      const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDescription) {
        metaDescription.content = seoProps.description;
      }
    }
  }, []);

  return { updateSEO };
};