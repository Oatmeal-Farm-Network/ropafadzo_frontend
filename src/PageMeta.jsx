/**
 * PageMeta — sets <title>, meta description, keywords, Open Graph, Twitter Card,
 * canonical, and optional JSON-LD structured data. Uses direct DOM manipulation,
 * no external library needed.
 *
 * Usage:
 *   <PageMeta
 *     title="Page Title | Oatmeal Farm Network"
 *     description="Page description for search engines."
 *     keywords="comma, separated, terms"                // optional
 *     image="/images/og-default.jpg"                    // optional
 *     canonical="https://oatmealfarmnetwork.com/some-path"  // optional
 *     noIndex={false}                                   // optional
 *     ogType="article"                                  // optional
 *     jsonLd={{ '@context': 'https://schema.org', ... }} // optional, object or array
 *   />
 */
import { useEffect } from 'react';

const SITE_NAME   = 'Oatmeal Farm Network';
const DEFAULT_IMG = 'https://oatmealfarmnetwork.com/images/Oatmeal-Farm-Network-og-default.jpg';
const BASE_URL    = 'https://oatmealfarmnetwork.com';
const JSONLD_MARKER = 'data-pagemeta-jsonld';

function setMeta(name, content) {
  if (content == null) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function setOG(property, content) {
  if (content == null) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
  el.setAttribute('href', href);
}

function clearJsonLd() {
  document.querySelectorAll(`script[${JSONLD_MARKER}]`).forEach(el => el.remove());
}

function addJsonLd(data) {
  if (!data) return;
  const items = Array.isArray(data) ? data : [data];
  items.forEach(item => {
    if (!item) return;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute(JSONLD_MARKER, 'true');
    el.text = JSON.stringify(item);
    document.head.appendChild(el);
  });
}

export default function PageMeta({
  title,
  description,
  keywords,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  canonical,
  noIndex = false,
  ogType = 'website',
  locale = 'en_US',
  publishedTime,
  modifiedTime,
  jsonLd,
}) {
  useEffect(() => {
    const fullTitle = title
      ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
      : SITE_NAME;
    const img   = image || DEFAULT_IMG;
    const canon = canonical || (BASE_URL + window.location.pathname);
    const desc  = description || '';

    document.title = fullTitle;

    // Standard meta
    setMeta('description', desc);
    if (keywords) setMeta('keywords', keywords);
    setMeta('robots', noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1');

    // Open Graph
    setOG('og:type',         ogType);
    setOG('og:locale',       locale);
    setOG('og:title',        fullTitle);
    setOG('og:description',  desc);
    setOG('og:image',        img);
    setOG('og:image:alt',    imageAlt || fullTitle);
    if (imageWidth)  setOG('og:image:width',  String(imageWidth));
    if (imageHeight) setOG('og:image:height', String(imageHeight));
    setOG('og:url',          canon);
    setOG('og:site_name',    SITE_NAME);
    if (ogType === 'article') {
      if (publishedTime) setOG('article:published_time', publishedTime);
      if (modifiedTime)  setOG('article:modified_time',  modifiedTime);
    }

    // Twitter Card
    setMeta('twitter:card',        'summary_large_image');
    setMeta('twitter:title',       fullTitle);
    setMeta('twitter:description', desc);
    setMeta('twitter:image',       img);
    setMeta('twitter:image:alt',   imageAlt || fullTitle);

    setCanonical(canon);

    // JSON-LD — always clear prior page's schema before adding this page's
    clearJsonLd();
    addJsonLd(jsonLd);

    return () => {
      clearJsonLd();
    };
  }, [title, description, keywords, image, imageAlt, imageWidth, imageHeight, canonical, noIndex, ogType, locale, publishedTime, modifiedTime, jsonLd]);

  return null;
}
