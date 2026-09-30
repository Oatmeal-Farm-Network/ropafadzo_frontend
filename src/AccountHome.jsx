import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { PRECISION_AG_ONLY } from './precisionAgMode';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ─── SVG icon helper ──────────────────────────────────────────────────────────
const I = ({ children, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// ─── Business-type → persona mapping ─────────────────────────────────────────
// Persona drives hero color, priority stats, and feature order.
const BIZ_PERSONA = {
  8:  'farmer',       // Farm / Ranch
  22: 'farmer',       // Fishery
  23: 'farmer',       // Fishermen
  31: 'farmer',       // Herb & Tea Producer
  34: 'farmer',       // Vineyards
  11: 'producer',     // Artisan Food Producer
  16: 'producer',     // Manufacturer
  19: 'producer',     // Meat Wholesaler
  33: 'producer',     // Winery
  10: 'distributor',  // Food Hub
  14: 'distributor',  // Food Cooperative
  24: 'distributor',  // Retailer
  26: 'distributor',  // Grocery Store
  29: 'distributor',  // Farmers Market
  36: 'food_aggregator', // Food Aggregator
  9:  'restaurant',   // Restaurant
  1:  'community',    // Agricultural Association
  15: 'community',    // Crafters Organization
  25: 'community',    // Fiber Cooperative (events-heavy)
  27: 'community',    // University
  35: 'community',    // Hunger Relief Organization
  17: 'services_biz', // Veterinarian
  20: 'services_biz', // Service Provider
  21: 'services_biz', // Marina
  28: 'services_biz', // Business Resources
  30: 'services_biz', // Real Estate Agent
  32: 'services_biz', // Transporter
  18: 'fiber',        // Fiber Mill
};

const PERSONAS = {
  farmer: {
    color: '#3D6B34', bg: '#f0f5e8', lightBg: '#e8f0e0',
    icon: <I size={56}><path d="M3 20l5-8 4 6 3-4 7 6H3z"/><circle cx="18" cy="7" r="2"/><line x1="18" y1="2" x2="18" y2="5"/><line x1="15" y1="4" x2="21" y2="4"/></I>,
    headline: 'Farm & Ranch Hub',
    tagline: 'Monitor your fields, manage your herd, and sell your harvest.',
    statKeys: ['fields', 'animals', 'pending_orders', 'upcoming_events'],
    priorityFeatures: ['precision_ag', 'livestock', 'farm_2_table', 'hr_management', 'traceability', 'picker_performance', 'iot_greenhouse', 'perishable_traceability', 'accounting', 'events', 'blog', 'my_website', 'certifications'],
  },
  producer: {
    color: '#A3301E', bg: '#fdf0ed', lightBg: '#fce5e0',
    icon: <I size={56}><rect x="2" y="14" width="20" height="8" rx="1"/><path d="M2 14l5-6h10l5 6"/><line x1="8" y1="22" x2="8" y2="14"/><line x1="16" y1="22" x2="16" y2="14"/><path d="M10 8h4"/><path d="M10 5h4"/></I>,
    headline: 'Producer Hub',
    tagline: 'Craft, package, and sell your artisan products to the world.',
    statKeys: ['products', 'produce', 'pending_orders', 'upcoming_events'],
    priorityFeatures: ['products', 'farm_2_table', 'enterprise_supply_chain', 'accounting', 'blog', 'events', 'rosemarie', 'my_website', 'certifications'],
  },
  distributor: {
    color: '#2563EB', bg: '#eff6ff', lightBg: '#dbeafe',
    icon: <I size={56}><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 4v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></I>,
    headline: 'Distribution Hub',
    tagline: 'Source, aggregate, and move food efficiently through your network.',
    statKeys: ['pending_orders', 'services', 'upcoming_events', 'blog_posts'],
    priorityFeatures: ['food_aggregation', 'enterprise_supply_chain', 'farm_2_table', 'cold_chain', 'farmer_settlement', 'accounting', 'events', 'blog', 'my_website'],
  },
  food_aggregator: {
    color: '#1D4ED8', bg: '#eff6ff', lightBg: '#dbeafe',
    icon: <I size={56}><circle cx="12" cy="12" r="2.5"/><circle cx="3.5" cy="6" r="1.5"/><circle cx="20.5" cy="6" r="1.5"/><circle cx="3.5" cy="18" r="1.5"/><circle cx="20.5" cy="18" r="1.5"/><line x1="5" y1="6.8" x2="9.5" y2="10"/><line x1="19" y1="6.8" x2="14.5" y2="10"/><line x1="5" y1="17.2" x2="9.5" y2="14"/><line x1="19" y1="17.2" x2="14.5" y2="14"/></I>,
    headline: 'Food Aggregation Hub',
    tagline: 'Source from your farm network, move product through B2B and D2C channels.',
    statKeys: ['aggregator_b2b_open', 'aggregator_farms', 'upcoming_events', 'blog_posts'],
    priorityFeatures: ['food_aggregation', 'enterprise_supply_chain', 'farm_2_table', 'cold_chain', 'farmer_settlement', 'accounting', 'events', 'blog', 'my_website'],
  },
  restaurant: {
    color: '#7C3AED', bg: '#f5f3ff', lightBg: '#ede9fe',
    icon: <I size={56}><line x1="9" y1="2" x2="9" y2="22"/><path d="M7 2v6a2 2 0 004 0V2"/><line x1="15" y1="2" x2="15" y2="22"/><path d="M13 2h4a3 3 0 010 6H13"/></I>,
    headline: 'Restaurant Hub',
    tagline: 'Source local ingredients, manage your kitchen, and fill your seats.',
    statKeys: ['pending_orders', 'upcoming_events', 'blog_posts', 'services'],
    priorityFeatures: ['restaurant_sourcing', 'events', 'accounting', 'blog', 'chef_dashboard', 'pairsley', 'my_website'],
  },
  community: {
    color: '#D97706', bg: '#fffbeb', lightBg: '#fef3c7',
    icon: <I size={56}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></I>,
    headline: 'Community Hub',
    tagline: 'Bring people together, share knowledge, and grow your community.',
    statKeys: ['upcoming_events', 'blog_posts', 'services', 'products'],
    priorityFeatures: ['events', 'blog', 'education_center', 'grants_programs', 'certifications', 'my_website', 'forums', 'accounting'],
  },
  services_biz: {
    color: '#0891B2', bg: '#ecfeff', lightBg: '#cffafe',
    icon: <I size={56}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></I>,
    headline: 'Services Hub',
    tagline: 'Manage your service offerings, clients, and grow your business.',
    statKeys: ['services', 'upcoming_events', 'blog_posts', 'pending_orders'],
    priorityFeatures: ['services', 'events', 'blog', 'accounting', 'my_website', 'certifications', 'testimonials'],
  },
  fiber: {
    color: '#7C5CBF', bg: '#f5f0ff', lightBg: '#ede5ff',
    icon: <I size={56}><circle cx="12" cy="12" r="9"/><path d="M3.6 9a9 9 0 0115.7 6"/><path d="M6 19.7A9 9 0 0120.4 9"/></I>,
    headline: 'Fiber Arts Hub',
    tagline: 'Manage your animals, showcase your fiber, and run your events.',
    statKeys: ['animals', 'upcoming_events', 'products', 'blog_posts'],
    priorityFeatures: ['livestock', 'events', 'products', 'farm_2_table', 'blog', 'my_website', 'accounting'],
  },
  default: {
    color: '#4B5563', bg: '#f9fafb', lightBg: '#f3f4f6',
    icon: <I size={56}><rect x="2" y="7" width="20" height="15" rx="1"/><path d="M16 22v-5a2 2 0 00-2-2h-4a2 2 0 00-2 2v5"/><path d="M2 12h20"/><path d="M7 12V7"/><path d="M17 12V7"/><path d="M12 2v5"/></I>,
    headline: 'Business Hub',
    tagline: 'Everything you need to run and grow your business on OFN.',
    statKeys: ['upcoming_events', 'blog_posts', 'pending_orders', 'services'],
    priorityFeatures: ['events', 'blog', 'precision_ag', 'accounting', 'my_website', 'services', 'products', 'certifications'],
  },
};

// ─── Stat metadata ────────────────────────────────────────────────────────────
const STAT_META = {
  fields:          { label: 'Fields', icon: <I><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="2" y1="15" x2="22" y2="15"/><line x1="9" y1="9" x2="9" y2="22"/></I>, path: (b) => `/precision-ag/fields?BusinessID=${b}` },
  animals:         { label: 'Animals', icon: <I><ellipse cx="12" cy="14" rx="7" ry="4.5"/><circle cx="6" cy="8" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="8" r="2"/></I>, path: (b) => `/animals?BusinessID=${b}` },
  pending_orders:  { label: 'Open Orders', icon: <I><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></I>, path: (b) => `/seller/orders?BusinessID=${b}` },
  upcoming_events: { label: 'Events', icon: <I><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></I>, path: (b) => `/events/manage?BusinessID=${b}` },
  blog_posts:      { label: 'Blog Posts', icon: <I><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></I>, path: (b) => `/blog/manage?BusinessID=${b}` },
  products:        { label: 'Products', icon: <I><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></I>, path: (b) => `/products?BusinessID=${b}` },
  services:        { label: 'Services', icon: <I><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></I>, path: (b) => `/services?BusinessID=${b}` },
  produce:             { label: 'Produce Listings', icon: <I><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 2C6 8 6 16 12 22"/><path d="M12 2c6 6 6 14 0 20"/><line x1="2" y1="12" x2="22" y2="12"/></I>, path: (b) => `/produce/inventory?BusinessID=${b}` },
  aggregator_b2b_open: { label: 'Open B2B Orders', icon: <I><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></I>, path: (b) => `/aggregator/sales?BusinessID=${b}` },
  aggregator_farms:    { label: 'Farm Partners', icon: <I><circle cx="12" cy="12" r="2.5"/><circle cx="3.5" cy="6" r="1.5"/><circle cx="20.5" cy="6" r="1.5"/><circle cx="3.5" cy="18" r="1.5"/><circle cx="20.5" cy="18" r="1.5"/><line x1="5" y1="6.8" x2="9.5" y2="10"/><line x1="19" y1="6.8" x2="14.5" y2="10"/><line x1="5" y1="17.2" x2="9.5" y2="14"/><line x1="19" y1="17.2" x2="14.5" y2="14"/></I>, path: (b) => `/aggregator/farms?BusinessID=${b}` },
};

// ─── Feature card metadata ────────────────────────────────────────────────────
const FEATURE_META = {
  precision_ag: {
    label: 'Precision Ag', color: '#3D6B34', bg: '#f0f5e8',
    icon: <I><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="2" y1="15" x2="22" y2="15"/><line x1="9" y1="9" x2="9" y2="22"/></I>,
    desc: 'Satellite field monitoring, NDVI analyses, soil samples, and crop planning.',
    cta: { label: 'Open Fields', path: (b) => `/precision-ag/fields?BusinessID=${b}` },
    addCta: { label: 'Add Field', path: (b) => `/precision-ag/add?BusinessID=${b}` },
    links: (b) => [
      { label: 'Analyses', to: `/precision-ag/analyses?BusinessID=${b}` },
      { label: 'Crop Detection', to: `/precision-ag/crop-detection?BusinessID=${b}` },
      { label: 'Statistics', to: `/precision-ag/statistics?BusinessID=${b}` },
      { label: 'Field Journal', to: `/precision-ag/field-journal?BusinessID=${b}` },
    ],
    platformPage: '/platform/precision-ag',
  },
  livestock: {
    label: 'Livestock & Herd Health', color: '#78350F', bg: '#fef3c7',
    icon: <I><ellipse cx="12" cy="14" rx="7" ry="4.5"/><circle cx="6" cy="8" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="8" r="2"/></I>,
    desc: 'Track animals, manage herd health events, vaccinations, and weights.',
    cta: { label: 'View Animals', path: (b) => `/animals?BusinessID=${b}` },
    addCta: { label: 'Add Animal', path: (b) => `/animals/add?BusinessID=${b}` },
    links: (b) => [
      { label: 'Herd Health', to: `/herd-health?BusinessID=${b}` },
      { label: 'Vaccinations', to: `/herd-health/vaccinations?BusinessID=${b}` },
      { label: 'Packages', to: `/animals/packages?BusinessID=${b}` },
    ],
    platformPage: '/platform/livestock-herd-health',
  },
  farm_2_table: {
    label: 'Farm 2 Table Marketplace', color: '#A3301E', bg: '#fdf0ed',
    icon: <I><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></I>,
    desc: 'List produce, meat, and processed foods. Manage incoming buyer orders.',
    cta: { label: 'View Orders', path: (b) => `/seller/orders?BusinessID=${b}` },
    addCta: { label: 'Add Produce', path: (b) => `/produce/inventory?BusinessID=${b}` },
    links: (b) => [
      { label: 'Produce Inventory', to: `/produce/inventory?BusinessID=${b}` },
      { label: 'Processed Foods', to: `/produce/processed-food?BusinessID=${b}` },
      { label: 'Meat Inventory', to: `/produce/meat?BusinessID=${b}` },
      { label: 'Stripe Payouts', to: `/account/stripe-connect?BusinessID=${b}` },
    ],
    platformPage: '/platform/marketplace',
  },
  products: {
    label: 'Products & Storefront', color: '#1D4ED8', bg: '#eff6ff',
    icon: <I><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></I>,
    desc: 'Sell artisan goods, processed foods, and branded products online.',
    cta: { label: 'My Products', path: (b) => `/products?BusinessID=${b}` },
    addCta: { label: 'Add Product', path: (b) => `/products/add?BusinessID=${b}` },
    links: (b) => [
      { label: 'Browse Marketplace', to: '/marketplace/products' },
      { label: 'Product Settings', to: `/products/settings?BusinessID=${b}` },
    ],
    platformPage: '/platform/products-storefront',
  },
  services: {
    label: 'Services Directory', color: '#0E7490', bg: '#ecfeff',
    icon: <I><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></I>,
    desc: 'List your services and get found by farms, restaurants, and food businesses.',
    cta: { label: 'My Services', path: (b) => `/services?BusinessID=${b}` },
    addCta: { label: 'Add Service', path: (b) => `/services/add?BusinessID=${b}` },
    links: (b) => [
      { label: 'Browse Directory', to: '/services/directory' },
      { label: 'Suggest Category', to: `/services/suggest-category?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  events: {
    label: 'Events', color: '#B45309', bg: '#fffbeb',
    icon: <I><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/></I>,
    desc: 'Create and manage workshops, shows, festivals, auctions, and farm tours.',
    cta: { label: 'My Events', path: (b) => `/events/manage?BusinessID=${b}` },
    addCta: { label: 'Create Event', path: (b) => `/events/add?BusinessID=${b}` },
    links: (b) => [
      { label: 'Browse Events', to: '/events' },
      { label: 'My Registrations', to: '/my-registrations' },
    ],
    platformPage: '/platform/events',
  },
  blog: {
    label: 'Blog', color: '#6D28D9', bg: '#f5f3ff',
    icon: <I><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></I>,
    desc: 'Publish stories, recipes, farm updates, and news. Builds trust and SEO.',
    cta: { label: 'Manage Blog', path: (b) => `/blog/manage?BusinessID=${b}` },
    addCta: { label: 'New Post', path: (b) => `/blog/manage?BusinessID=${b}&view=new` },
    links: (b) => [
      { label: 'Authors', to: `/blog/authors/manage?BusinessID=${b}` },
      { label: 'Categories', to: `/blog/manage?BusinessID=${b}&tab=categories` },
    ],
    platformPage: '/platform/blog',
  },
  my_website: {
    label: 'Farm Website', color: '#0F766E', bg: '#f0fdfa',
    icon: <I><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></I>,
    desc: 'Your own farm website with Lavendir AI — live in minutes on your own domain.',
    cta: { label: 'Edit Website', path: (b) => `/website/builder?BusinessID=${b}` },
    addCta: { label: 'Design', path: (b) => `/website/builder?BusinessID=${b}&view=design` },
    links: (b) => [
      { label: 'Lavendir AI Builder', to: `/website/builder?BusinessID=${b}&view=lavendir` },
      { label: 'Pages', to: `/website/builder?BusinessID=${b}&view=manage-pages` },
      { label: 'Settings', to: `/website/builder?BusinessID=${b}&view=settings` },
    ],
    platformPage: '/platform/website-builder',
  },
  accounting: {
    label: 'Accounting', color: '#065F46', bg: '#ecfdf5',
    icon: <I><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></I>,
    desc: 'Invoices, expenses, customer management, and financial reports.',
    cta: { label: 'Open Accounting', path: (b) => `/accounting?BusinessID=${b}` },
    addCta: { label: 'New Invoice', path: (b) => `/accounting?BusinessID=${b}#invoices` },
    links: (b) => [
      { label: 'Customers', to: `/accounting?BusinessID=${b}#customers` },
      { label: 'Vendors', to: `/accounting?BusinessID=${b}#vendors` },
      { label: 'Reports', to: `/accounting?BusinessID=${b}#reports` },
    ],
    platformPage: '/platform/accounting',
  },
  restaurant_sourcing: {
    label: 'Restaurant Sourcing', color: '#7C3AED', bg: '#f5f3ff',
    icon: <I><line x1="5" y1="2" x2="5" y2="22"/><path d="M3 2v6a2 2 0 004 0V2"/><line x1="11" y1="2" x2="11" y2="22"/><path d="M9 2h4a3 3 0 010 6H9"/></I>,
    desc: 'Browse local farms, place standing orders, and source seasonal ingredients.',
    cta: { label: 'Browse Farms', path: () => '/marketplaces/farm-to-table' },
    addCta: { label: 'Saved Farms', path: () => '/restaurant/farms' },
    links: () => [
      { label: 'Standing Orders', to: '/restaurant/standing-orders' },
      { label: 'Weekly Digest', to: '/restaurant/digest' },
    ],
    platformPage: null,
  },
  food_aggregation: {
    label: 'Food Aggregation Hub', color: '#1D4ED8', bg: '#eff6ff',
    icon: <I><circle cx="12" cy="12" r="2.5"/><circle cx="3.5" cy="6" r="1.5"/><circle cx="20.5" cy="6" r="1.5"/><circle cx="3.5" cy="18" r="1.5"/><circle cx="20.5" cy="18" r="1.5"/><line x1="5" y1="6.8" x2="9.5" y2="10"/><line x1="19" y1="6.8" x2="14.5" y2="10"/><line x1="5" y1="17.2" x2="9.5" y2="14"/><line x1="19" y1="17.2" x2="14.5" y2="14"/></I>,
    desc: 'Manage your farm network, procurement, logistics, and B2B sales.',
    cta: { label: 'Open Hub', path: (b) => `/aggregator?BusinessID=${b}` },
    addCta: { label: 'Farm Network', path: (b) => `/aggregator/farms?BusinessID=${b}` },
    links: (b) => [
      { label: 'Procurement', to: `/aggregator/produce?BusinessID=${b}` },
      { label: 'Logistics', to: `/aggregator/logistics?BusinessID=${b}` },
      { label: 'B2B Sales', to: `/aggregator/sales?BusinessID=${b}` },
    ],
    platformPage: '/platform/aggregator',
  },
  cold_chain: {
    label: 'Cold Chain & Logistics', color: '#0369A1', bg: '#f0f9ff',
    icon: <I><rect x="1" y="6" width="12" height="10" rx="1"/><path d="M13 9h3l3 3v4h-6V9z"/><circle cx="4" cy="17" r="1.5"/><circle cx="11" cy="17" r="1.5"/><circle cx="17" cy="17" r="1.5"/><line x1="6" y1="6" x2="6" y2="3"/><line x1="8" y1="3" x2="4" y2="3"/></I>,
    desc: 'Track refrigerated vehicles, monitor temps, and ensure food safety compliance.',
    cta: { label: 'Track Vehicles', path: (b) => `/cold-chain?BusinessID=${b}` },
    addCta: { label: 'Add Vehicle', path: (b) => `/cold-chain?BusinessID=${b}` },
    links: () => [],
    platformPage: null,
  },
  farmer_settlement: {
    label: 'Farmer Settlement & Pay', color: '#065F46', bg: '#ecfdf5',
    icon: <I><circle cx="12" cy="12" r="8"/><line x1="12" y1="6" x2="12" y2="18"/><path d="M9 9h4a2 2 0 010 4H9"/><path d="M8 13h5"/></I>,
    desc: 'Settle payments with farmers and suppliers quickly and accurately.',
    cta: { label: 'Settlements', path: (b) => `/farmer-settlement?BusinessID=${b}` },
    addCta: { label: 'New Settlement', path: (b) => `/farmer-settlement?BusinessID=${b}` },
    links: () => [],
    platformPage: null,
  },
  picker_performance: {
    label: 'Picker Performance', color: '#15803d', bg: '#f0fdf4',
    icon: <I><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><polyline points="9 11 11 13 15 9"/></I>,
    desc: 'Track per-picker sessions, drop-off scans, piece-rate wages, and payroll summaries.',
    cta: { label: 'View Sessions', path: (b) => `/picker-performance?BusinessID=${b}` },
    addCta: { label: 'Set Piece Rates', path: (b) => `/picker-performance?BusinessID=${b}&tab=Piece+Rates` },
    links: (b) => [
      { label: 'Leaderboard', to: `/picker-performance?BusinessID=${b}&tab=Analytics` },
      { label: 'Payroll Summary', to: `/picker-performance?BusinessID=${b}&tab=Payroll` },
    ],
    platformPage: null,
  },
  iot_greenhouse: {
    label: 'IoT Greenhouse', color: '#0e7490', bg: '#ecfeff',
    icon: <I><rect x="3" y="11" width="18" height="11" rx="1"/><path d="M3 11V7a5 5 0 0110 0v4"/><circle cx="17" cy="16" r="2"/><line x1="19" y1="11" x2="19" y2="14"/></I>,
    desc: 'Real-time greenhouse sensor monitoring, micro-climate alerts, and variety-specific thresholds.',
    cta: { label: 'Sensor Dashboard', path: (b) => `/iot-greenhouse?BusinessID=${b}` },
    addCta: { label: 'View Alerts', path: (b) => `/iot-greenhouse?BusinessID=${b}&tab=Alerts` },
    links: (b) => [
      { label: 'Trends', to: `/iot-greenhouse?BusinessID=${b}&tab=Trends` },
      { label: 'Sensor Settings', to: `/iot-greenhouse?BusinessID=${b}&tab=Settings` },
    ],
    platformPage: null,
  },
  perishable_traceability: {
    label: 'Perishable Traceability', color: '#7c3aed', bg: '#f5f3ff',
    icon: <I><rect x="2" y="3" width="5" height="5" rx="0.5"/><rect x="9" y="3" width="5" height="5" rx="0.5"/><rect x="2" y="10" width="5" height="5" rx="0.5"/><path d="M11.5 10v2.5h2.5"/><line x1="9" y1="12.5" x2="11.5" y2="12.5"/></I>,
    desc: 'Field-to-dispatch stage checkpoints, compliance records, withholding checks, and audit reports.',
    cta: { label: 'Lot Timeline', path: (b) => `/perishable-trace?BusinessID=${b}` },
    addCta: { label: 'Add Checkpoint', path: (b) => `/perishable-trace?BusinessID=${b}&tab=Lots` },
    links: (b) => [
      { label: 'Compliance Records', to: `/perishable-trace?BusinessID=${b}&tab=Compliance` },
      { label: 'Generate Report', to: `/perishable-trace?BusinessID=${b}&tab=Reports` },
    ],
    platformPage: null,
  },
  chilling_hours: {
    label: 'Chilling Hours & Bloom', color: '#1d4ed8', bg: '#eff6ff',
    icon: <I><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></I>,
    desc: 'Track daily chill unit accumulation (Simple & Utah models), manage cultivar requirements, and forecast bloom dates.',
    cta: { label: 'Dashboard', path: (b) => `/chilling-hours?BusinessID=${b}` },
    addCta: { label: 'Add Reading', path: (b) => `/chilling-hours?BusinessID=${b}&tab=Accumulation` },
    links: (b) => [
      { label: 'Bloom Forecast', to: `/chilling-hours?BusinessID=${b}&tab=Forecast` },
      { label: 'Cultivars', to: `/chilling-hours?BusinessID=${b}&tab=Cultivars` },
    ],
    platformPage: null,
  },
  grain_bin_monitoring: {
    label: 'Grain Bin Monitor', color: '#92400e', bg: '#fffbeb',
    icon: <I><ellipse cx="8" cy="4" rx="6" ry="2"/><path d="M2 4v12c0 1.1 2.7 2 6 2s6-.9 6-2V4"/><line x1="8" y1="9" x2="8" y2="14"/></I>,
    desc: 'Monitor grain bin temperature, moisture, and CO₂; run Chung-Pfost equilibrium checks; log aeration events.',
    cta: { label: 'Bin Dashboard', path: (b) => `/grain-bin?BusinessID=${b}` },
    addCta: { label: 'Add Reading', path: (b) => `/grain-bin?BusinessID=${b}&tab=Readings` },
    links: (b) => [
      { label: 'Active Alerts', to: `/grain-bin?BusinessID=${b}&tab=Alerts` },
      { label: 'EMC Calculator', to: `/grain-bin?BusinessID=${b}&tab=Equilibrium` },
    ],
    platformPage: null,
  },
  scale_tickets: {
    label: 'Scale Tickets', color: '#166534', bg: '#f0fdf4',
    icon: <I><rect x="2" y="6" width="12" height="9" rx="1"/><path d="M5 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/><line x1="5" y1="10" x2="11" y2="10"/><line x1="8" y1="8" x2="8" y2="12"/></I>,
    desc: 'Record weigh-bridge tickets, link to forward contracts, and track net margin per delivery.',
    cta: { label: 'View Tickets', path: (b) => `/scale-tickets?BusinessID=${b}` },
    addCta: { label: 'New Ticket', path: (b) => `/scale-tickets?BusinessID=${b}` },
    links: (b) => [
      { label: 'Forward Contracts', to: `/scale-tickets?BusinessID=${b}&tab=Forward+Contracts` },
      { label: 'Margin Analysis', to: `/scale-tickets?BusinessID=${b}&tab=Margin+Analysis` },
    ],
    platformPage: null,
  },
  harvest_bins: {
    label: 'Bin-Level Traceability', color: '#9a3412', bg: '#fff7ed',
    icon: <I><rect x="2" y="8" width="12" height="8" rx="1"/><path d="M5 8V5l3-3 3 3v3"/><line x1="8" y1="11" x2="8" y2="13"/></I>,
    desc: 'Register harvest bins by barcode, track 11-stage field-to-packhouse pipeline, and scan chain of custody.',
    cta: { label: 'Bin Dashboard', path: (b) => `/harvest-bins?BusinessID=${b}` },
    addCta: { label: 'Register Bins', path: (b) => `/harvest-bins?BusinessID=${b}` },
    links: (b) => [
      { label: 'Chain of Custody', to: `/harvest-bins?BusinessID=${b}&tab=Chain+of+Custody` },
      { label: 'Lot View', to: `/harvest-bins?BusinessID=${b}&tab=Lot+View` },
    ],
    platformPage: null,
  },
  ca_storage: {
    label: 'CA Cold Storage', color: '#0369a1', bg: '#f0f9ff',
    icon: <I><rect x="2" y="5" width="12" height="10" rx="1"/><path d="M7 5V3"/><path d="M9 5V3"/><line x1="2" y1="9" x2="14" y2="9"/></I>,
    desc: 'Manage controlled-atmosphere storage rooms; monitor O₂, CO₂, temperature, and RH against commodity protocols.',
    cta: { label: 'Room Dashboard', path: (b) => `/ca-storage?BusinessID=${b}` },
    addCta: { label: 'Add Reading', path: (b) => `/ca-storage?BusinessID=${b}&tab=Readings` },
    links: (b) => [
      { label: 'Active Alerts', to: `/ca-storage?BusinessID=${b}&tab=Alerts` },
      { label: 'Protocol Reference', to: `/ca-storage?BusinessID=${b}&tab=Protocols` },
    ],
    platformPage: null,
  },
  spray_applications: {
    label: 'Spray & Chemical Log', color: '#15803d', bg: '#f0fdf4',
    icon: <I><path d="M3 20h18"/><path d="M8 20V9a4 4 0 018 0v11"/><circle cx="12" cy="6" r="2"/><line x1="12" y1="8" x2="12" y2="9"/></I>,
    desc: 'Record spray events, manage your chemical product library, and track PHI/REI compliance with a PHI harvest calendar.',
    cta: { label: 'View Applications', path: (b) => `/spray-applications?BusinessID=${b}` },
    addCta: { label: 'Log Spray', path: (b) => `/spray-applications?BusinessID=${b}` },
    links: (b) => [
      { label: 'Product Library', to: `/spray-applications?BusinessID=${b}&tab=Products` },
      { label: 'PHI Calendar', to: `/spray-applications?BusinessID=${b}&tab=PHI Calendar` },
      { label: 'Season Summary', to: `/spray-applications?BusinessID=${b}&tab=Summary` },
    ],
    platformPage: null,
  },
  pest_scouting: {
    label: 'Pest & Disease Scouting', color: '#b45309', bg: '#fffbeb',
    icon: <I><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1"/></I>,
    desc: 'Log field scouting observations, track pest severity, trigger spray recommendations, and monitor active threats across all fields.',
    cta: { label: 'View Scouting', path: (b) => `/scouting?BusinessID=${b}` },
    addCta: { label: 'New Record', path: (b) => `/scouting?BusinessID=${b}` },
    links: (b) => [
      { label: 'Active Threats', to: `/scouting?BusinessID=${b}&tab=threats` },
      { label: 'Season Summary', to: `/scouting?BusinessID=${b}&tab=summary` },
      { label: 'Alerts', to: `/scouting?BusinessID=${b}&tab=alerts` },
    ],
    platformPage: null,
  },
  irrigation_mgmt: {
    label: 'Irrigation & Water Management', color: '#0369a1', bg: '#e0f2fe',
    icon: <I><path d="M12 2v8"/><path d="M8 7l4 4 4-4"/><path d="M5 17c0 3 3 5 7 5s7-2 7-5"/><path d="M5 17c0-2.5 2-4 3.5-4s2.5 1.5 2.5 3.5"/><path d="M19 17c0-2.5-2-4-3.5-4"/></I>,
    desc: 'Manage irrigation zones, log watering events, track soil moisture, and monitor your water budget with IoT sensor integration.',
    cta: { label: 'Dashboard', path: (b) => `/irrigation?BusinessID=${b}` },
    addCta: { label: 'Log Event', path: (b) => `/irrigation?BusinessID=${b}&tab=events` },
    links: (b) => [
      { label: 'Zones', to: `/irrigation?BusinessID=${b}&tab=zones` },
      { label: 'Water Budget', to: `/irrigation?BusinessID=${b}&tab=water-budget` },
    ],
    platformPage: null,
  },
  equipment_maint: {
    label: 'Equipment Maintenance', color: '#6d28d9', bg: '#f5f3ff',
    icon: <I><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></I>,
    desc: 'Track your full equipment fleet, log service records, record fuel usage, and get alerts for upcoming maintenance due dates.',
    cta: { label: 'Fleet Overview', path: (b) => `/equipment-maint?BusinessID=${b}` },
    addCta: { label: 'Log Service', path: (b) => `/equipment-maint?BusinessID=${b}&tab=service` },
    links: (b) => [
      { label: 'Due Now', to: `/equipment-maint?BusinessID=${b}&tab=due` },
      { label: 'Fuel Log', to: `/equipment-maint?BusinessID=${b}&tab=fuel` },
    ],
    platformPage: null,
  },
  soil_tests: {
    label: 'Soil Test Records', color: '#92400e', bg: '#fef3c7',
    icon: <I><path d="M12 20v-8"/><path d="M8 14h8"/><path d="M7 10c0-3 2-6 5-7 3 1 5 4 5 7"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/><line x1="4" y1="20" x2="20" y2="20"/></I>,
    desc: 'Store and analyse lab soil test results, auto-rate nutrient levels, track trends by field, and generate deficiency reports with amendment recommendations.',
    cta: { label: 'View Tests', path: (b) => `/soil-tests?BusinessID=${b}` },
    addCta: { label: 'Add Test', path: (b) => `/soil-tests?BusinessID=${b}` },
    links: (b) => [
      { label: 'By Field', to: `/soil-tests?BusinessID=${b}&tab=by-field` },
      { label: 'Trends', to: `/soil-tests?BusinessID=${b}&tab=trends` },
      { label: 'Deficiency Report', to: `/soil-tests?BusinessID=${b}&tab=deficiencies` },
    ],
    platformPage: null,
  },
  cash_flow_forecast: {
    label: 'Cash Flow Forecasting', color: '#065f46', bg: '#ecfdf5',
    icon: <I><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></I>,
    desc: 'Rolling 6-month actuals + 12-month cash flow projections pulling from grain sales, forward contracts, crop budgets, and manual entries.',
    cta: { label: 'View Forecast', path: (b) => `/cash-flow?BusinessID=${b}` },
    addCta: { label: 'Add Entry', path: (b) => `/cash-flow?BusinessID=${b}&tab=entries` },
    links: (b) => [
      { label: 'Manual Entries', to: `/cash-flow?BusinessID=${b}&tab=entries` },
    ],
    platformPage: null,
  },
  field_activity_journal: {
    label: 'Field Activity Journal', color: '#1e6b5a', bg: '#e8f5f1',
    icon: <I><rect x="4" y="2" width="14" height="20" rx="1"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></I>,
    desc: 'Log every field operation — planting, cultivation, spraying, harvesting — with operator, area, equipment, and cost. Offline-capable.',
    cta: { label: 'Activity Log', path: (b) => `/field-activity?BusinessID=${b}` },
    addCta: { label: 'Log Activity', path: (b) => `/field-activity?BusinessID=${b}` },
    links: (b) => [
      { label: 'Timeline', to: `/field-activity?BusinessID=${b}&tab=timeline` },
      { label: 'By Field', to: `/field-activity?BusinessID=${b}&tab=by-field` },
      { label: 'Summary', to: `/field-activity?BusinessID=${b}&tab=summary` },
    ],
    platformPage: null,
  },
  yield_records: {
    label: 'Yield & Production Records', color: '#166534', bg: '#f0fdf4',
    icon: <I><path d="M3 18l4-7 4 5 3-6 5 8H3z"/><circle cx="19" cy="6" r="2"/><line x1="19" y1="2" x2="19" y2="4"/></I>,
    desc: 'Record actual yield per field and crop, compare against budget, track grade breakdown and gross margin per hectare by season.',
    cta: { label: 'View Records', path: (b) => `/yield-records?BusinessID=${b}` },
    addCta: { label: 'Add Record', path: (b) => `/yield-records?BusinessID=${b}` },
    links: (b) => [
      { label: 'vs Budget', to: `/yield-records?BusinessID=${b}&tab=vs-budget` },
      { label: 'Season Summary', to: `/yield-records?BusinessID=${b}&tab=season-summary` },
    ],
    platformPage: null,
  },
  report_center: {
    label: 'Report & Export Center', color: '#374151', bg: '#f3f4f6',
    icon: <I><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-4"/><path d="M10 16h4"/></I>,
    desc: 'Download CSV exports of spray logs, soil tests, cash flow, equipment service history, yield variance, field activity, and scouting data.',
    cta: { label: 'Open Reports', path: (b) => `/reports?BusinessID=${b}` },
    addCta: { label: 'Export CSV', path: (b) => `/reports?BusinessID=${b}` },
    links: (b) => [
      { label: 'Spray Register', to: `/reports?BusinessID=${b}` },
      { label: 'Soil Tests', to: `/reports?BusinessID=${b}` },
      { label: 'Yield Variance', to: `/reports?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  field_health_dashboard: {
    label: 'Field Health Dashboard', color: '#2d6a4f', bg: '#d8f3dc',
    icon: <I><path d="M3 15l5-7 4 5 3-5 5 7H3z"/><line x1="3" y1="20" x2="21" y2="20"/></I>,
    desc: 'Unified field health view — spray PHI countdowns, scouting alerts, soil ratings, irrigation summary, and a cross-module activity timeline.',
    cta: { label: 'Field Overview', path: (b) => `/field-health?BusinessID=${b}` },
    addCta: { label: 'Timeline', path: (b) => `/field-health?BusinessID=${b}&tab=timeline` },
    links: (b) => [
      { label: 'Alerts', to: `/field-health?BusinessID=${b}` },
      { label: 'Soil Rating', to: `/field-health?BusinessID=${b}` },
      { label: 'Activity Stream', to: `/field-health?BusinessID=${b}&tab=timeline` },
    ],
    platformPage: null,
  },
  nutrient_mgmt: {
    label: 'Nutrient Management', color: '#40916c', bg: '#b7e4c7',
    icon: <I><path d="M12 20v-9"/><path d="M8 14c0-3 2-6 4-7 2 1 4 4 4 7"/><path d="M5 20h14"/><line x1="16" y1="10" x2="19" y2="7"/><line x1="8" y1="10" x2="5" y2="7"/></I>,
    desc: 'Plan N/P/K/S targets by field and crop, log product applications, and track nutrient budget vs actuals with soil deficiency cross-reference.',
    cta: { label: 'Nutrient Budget', path: (b) => `/nutrients?BusinessID=${b}&tab=budget` },
    addCta: { label: 'Log Application', path: (b) => `/nutrients?BusinessID=${b}` },
    links: (b) => [
      { label: 'Plans', to: `/nutrients?BusinessID=${b}&tab=plans` },
      { label: 'Applications', to: `/nutrients?BusinessID=${b}` },
      { label: 'Soil Deficiencies', to: `/soil-tests?BusinessID=${b}&tab=deficiencies` },
    ],
    platformPage: null,
  },
  farm_pl: {
    label: 'Farm P&L Dashboard', color: '#1b4332', bg: '#d8f3dc',
    icon: <I><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></I>,
    desc: 'Gross margin aggregated from yield records, cash flow, scale tickets, field activity, and nutrient costs — by season, crop, and field.',
    cta: { label: 'Open P&L', path: (b) => `/farm-pl?BusinessID=${b}` },
    addCta: { label: 'By Crop', path: (b) => `/farm-pl?BusinessID=${b}&tab=by-crop` },
    links: (b) => [
      { label: 'By Crop', to: `/farm-pl?BusinessID=${b}&tab=by-crop` },
      { label: 'By Field', to: `/farm-pl?BusinessID=${b}&tab=by-field` },
      { label: 'Cash Flow', to: `/cash-flow?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  document_vault: {
    label: 'Document Vault', color: '#374151', bg: '#f3f4f6',
    icon: <I><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></I>,
    desc: 'Secure storage for certifications, contracts, compliance docs, and farm records — with expiry tracking and drag-and-drop upload.',
    cta: { label: 'Open Vault', path: (b) => `/documents?BusinessID=${b}` },
    addCta: { label: 'Upload Doc', path: (b) => `/documents?BusinessID=${b}` },
    links: (b) => [
      { label: 'Certifications', to: `/documents?BusinessID=${b}&category=Certifications` },
      { label: 'Contracts', to: `/documents?BusinessID=${b}&category=Contracts` },
      { label: 'Compliance', to: `/documents?BusinessID=${b}&category=Compliance` },
    ],
    platformPage: null,
  },
  hr_management: {
    label: 'HR & Workforce', color: '#1e40af', bg: '#dbeafe',
    icon: <I><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></I>,
    desc: 'Workers, attendance, payroll, leave requests, and tasks — full workforce management.',
    cta: { label: 'Open HR', path: (b) => `/hr?BusinessID=${b}` },
    addCta: { label: 'Add Worker', path: (b) => `/hr?BusinessID=${b}&tab=workers` },
    links: (b) => [
      { label: 'Attendance', to: `/hr?BusinessID=${b}&tab=attendance` },
      { label: 'Payroll', to: `/hr?BusinessID=${b}&tab=payroll` },
      { label: 'Leave Requests', to: `/hr?BusinessID=${b}&tab=leave` },
      { label: 'Picker Performance', to: `/picker-performance?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  farm_inputs: {
    label: 'Farm Inputs & Chemicals', color: '#065f46', bg: '#d1fae5',
    icon: <I><path d="M9 3h6l1 4H8z"/><rect x="5" y="7" width="14" height="14" rx="1"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></I>,
    desc: 'Chemical and input inventory with transactions, reorder alerts, spray log, and pest scouting.',
    cta: { label: 'Open Inventory', path: (b) => `/farm-inputs?BusinessID=${b}` },
    addCta: { label: 'Add Input', path: (b) => `/farm-inputs?BusinessID=${b}` },
    links: (b) => [
      { label: 'Transactions', to: `/farm-inputs?BusinessID=${b}&tab=transactions` },
      { label: 'Spray Log', to: `/spray-applications?BusinessID=${b}` },
      { label: 'Pest Scouting', to: `/scouting?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  crop_budgeting: {
    label: 'Crop Budgeting & Actuals', color: '#1d4ed8', bg: '#eff6ff',
    icon: <I><rect x="2" y="3" width="20" height="14" rx="1"/><polyline points="8 17 12 13 16 15 20 9"/><line x1="2" y1="9" x2="8" y2="9"/></I>,
    desc: 'Plan crop budgets against actuals, track cost per hectare, and benchmark margins.',
    cta: { label: 'Open Budgets', path: (b) => `/crop-budget?BusinessID=${b}` },
    addCta: { label: 'New Budget', path: (b) => `/crop-budget?BusinessID=${b}` },
    links: (b) => [
      { label: 'Yield Records', to: `/yield-records?BusinessID=${b}` },
      { label: 'Farm P&L', to: `/farm-pl?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  traceability: {
    label: 'Harvest Lot Traceability', color: '#7c3aed', bg: '#ede9fe',
    icon: <I><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><path d="M18 14v2.5h2.5"/><line x1="14" y1="18" x2="18" y2="18"/></I>,
    desc: 'Link harvested lots to fields, track handling chain, and generate compliance reports.',
    cta: { label: 'Open Lots', path: (b) => `/harvest-lots?BusinessID=${b}` },
    addCta: { label: 'New Lot', path: (b) => `/harvest-lots?BusinessID=${b}` },
    links: (b) => [
      { label: 'Perishable Trace', to: `/perishable-trace?BusinessID=${b}` },
      { label: 'Bin-Level Trace', to: `/harvest-bins?BusinessID=${b}` },
      { label: 'Export Compliance', to: `/export-compliance?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  farm_infrastructure: {
    label: 'Infrastructure & Maintenance', color: '#92400e', bg: '#fef3c7',
    icon: <I><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><line x1="9" y1="21" x2="9" y2="13"/><line x1="15" y1="21" x2="15" y2="13"/><line x1="8" y1="11" x2="16" y2="11"/></I>,
    desc: 'Assets, maintenance logs, service schedules, structures, and grain bin monitoring.',
    cta: { label: 'Open Assets', path: (b) => `/farm-infrastructure?BusinessID=${b}` },
    addCta: { label: 'Add Asset', path: (b) => `/farm-infrastructure?BusinessID=${b}` },
    links: (b) => [
      { label: 'Maintenance Log', to: `/farm-infrastructure?BusinessID=${b}&tab=maintenance` },
      { label: 'Schedules', to: `/farm-infrastructure?BusinessID=${b}&tab=schedules` },
      { label: 'Grain Bin Monitor', to: `/grain-bin?BusinessID=${b}` },
      { label: 'Equipment Maint.', to: `/equipment-maint?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  farm_kpi: {
    label: 'Farm KPI Dashboard', color: '#0f766e', bg: '#ccfbf1',
    icon: <I><path d="M4 19c1-5 3-8 8-8s7 3 8 8"/><path d="M12 11V5"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/><line x1="8" y1="7" x2="9.5" y2="9"/><line x1="16" y1="7" x2="14.5" y2="9"/></I>,
    desc: 'Custom KPIs with alerts, trend charts, pest log integration, and performance tracking.',
    cta: { label: 'Open KPIs', path: (b) => `/farm-kpi?BusinessID=${b}` },
    addCta: { label: 'Manage KPIs', path: (b) => `/farm-kpi?BusinessID=${b}&tab=kpis` },
    links: (b) => [
      { label: 'Alerts', to: `/farm-kpi?BusinessID=${b}&tab=alerts` },
      { label: 'Pest Log', to: `/farm-kpi?BusinessID=${b}&tab=pest-log` },
      { label: 'Field Health', to: `/field-health?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  nursery_management: {
    label: 'Nursery & Early Growth', color: '#15803d', bg: '#dcfce7',
    icon: <I><path d="M12 19V10"/><path d="M8 10c0-3 2-7 4-8 2 1 4 5 4 8"/><path d="M5 14c-1.5-1.5-2-4 0-6"/><path d="M19 14c1.5-1.5 2-4 0-6"/><line x1="4" y1="21" x2="20" y2="21"/></I>,
    desc: 'Track seedling batches from germination to transplant with growth logs and QC checks.',
    cta: { label: 'Open Nursery', path: (b) => `/nursery?BusinessID=${b}` },
    addCta: { label: 'New Batch', path: (b) => `/nursery?BusinessID=${b}` },
    links: (b) => [
      { label: 'Growth Logs', to: `/nursery?BusinessID=${b}&tab=batches` },
      { label: 'QC Checks', to: `/nursery?BusinessID=${b}&tab=qc` },
      { label: 'Crop Planner', to: `/crop-planning?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  outgrower_management: {
    label: 'Contract Farming / Outgrower', color: '#b45309', bg: '#fef3c7',
    icon: <I><circle cx="6" cy="7" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 9v4l6 3 6-3V9"/><path d="M12 12v7"/><line x1="8" y1="21" x2="16" y2="21"/></I>,
    desc: 'Manage contract farmers, input distributions, delivery schedules, and outgrower payments.',
    cta: { label: 'Open Dashboard', path: (b) => `/outgrower?BusinessID=${b}&tab=dashboard` },
    addCta: { label: 'Add Farmer', path: (b) => `/outgrower?BusinessID=${b}&tab=farmers` },
    links: (b) => [
      { label: 'Contracts', to: `/outgrower?BusinessID=${b}&tab=contracts` },
      { label: 'Input Distributions', to: `/outgrower?BusinessID=${b}&tab=distributions` },
      { label: 'Deliveries & Pay', to: `/outgrower?BusinessID=${b}&tab=deliveries` },
      { label: 'Scale Tickets', to: `/scale-tickets?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  procurement: {
    label: 'Purchase & Procurement', color: '#0e7490', bg: '#cffafe',
    icon: <I><rect x="3" y="6" width="18" height="15" rx="1"/><path d="M9 6V5a3 3 0 016 0v1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="12" y1="9" x2="12" y2="15"/></I>,
    desc: 'Purchase orders, approval workflows, and supplier scorecard tracking.',
    cta: { label: 'Purchase Orders', path: (b) => `/procurement?BusinessID=${b}` },
    addCta: { label: 'New PO', path: (b) => `/procurement?BusinessID=${b}` },
    links: (b) => [
      { label: 'Pending Approval', to: `/procurement?BusinessID=${b}&filter=pending_approval` },
      { label: 'Supplier Scorecard', to: `/supplier-scorecard?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  work_orders: {
    label: 'Work Orders & Field Crews', color: '#4338ca', bg: '#e0e7ff',
    icon: <I><rect x="2" y="3" width="14" height="20" rx="1"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="6" y1="16" x2="8" y2="16"/><circle cx="18" cy="16" r="4"/><line x1="20.8" y1="18.8" x2="22.5" y2="20.5"/></I>,
    desc: 'Assign field tasks, track crew progress, greenhouse controls, and IoT sensors.',
    cta: { label: 'All Work Orders', path: (b) => `/work-orders?BusinessID=${b}` },
    addCta: { label: 'New Order', path: (b) => `/work-orders?BusinessID=${b}` },
    links: (b) => [
      { label: 'Greenhouse Controls', to: `/work-orders?BusinessID=${b}&tab=greenhouse` },
      { label: 'IoT Sensors', to: `/iot-greenhouse?BusinessID=${b}` },
      { label: 'Mobile Field Shell', to: `/agri-erp/mobile?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  packhouse_qc: {
    label: 'Packhouse & QC Inspection', color: '#0f766e', bg: '#ccfbf1',
    icon: <I><rect x="2" y="7" width="20" height="13" rx="1"/><path d="M7 7V5h10v2"/><polyline points="7 12 9 14 13 10"/></I>,
    desc: 'Packhouse batches, QC inspection templates, and grade-out tracking.',
    cta: { label: 'Open Packhouse', path: (b) => `/packhouse?BusinessID=${b}` },
    addCta: { label: 'New Batch', path: (b) => `/packhouse?BusinessID=${b}` },
    links: (b) => [
      { label: 'QC Templates', to: `/packhouse?BusinessID=${b}&tab=templates` },
      { label: 'Export Compliance', to: `/export-compliance?BusinessID=${b}` },
      { label: 'Harvest Lots', to: `/harvest-lots?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  plant_tagging: {
    label: 'Plant Tagging & Asset Geo', color: '#16a34a', bg: '#dcfce7',
    icon: <I><circle cx="12" cy="8" r="4"/><path d="M12 12v9"/><path d="M8.5 17h7"/><line x1="12" y1="4" x2="12" y2="2"/><line x1="15.5" y1="5.5" x2="17.1" y2="3.9"/><line x1="8.5" y1="5.5" x2="6.9" y2="3.9"/></I>,
    desc: 'Geo-tag individual plants, trees, or infrastructure assets with QR codes and field maps.',
    cta: { label: 'Plant Tags', path: (b) => `/plant-tags?BusinessID=${b}` },
    addCta: { label: 'Add Tag', path: (b) => `/plant-tags?BusinessID=${b}` },
    links: (b) => [
      { label: 'Infrastructure Assets', to: `/plant-tags?BusinessID=${b}&tab=assets` },
      { label: 'Field Health', to: `/field-health?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  export_compliance: {
    label: 'Export Compliance & Traceability', color: '#1e40af', bg: '#dbeafe',
    icon: <I><rect x="2" y="3" width="14" height="18" rx="1"/><line x1="6" y1="8" x2="12" y2="8"/><line x1="6" y1="12" x2="12" y2="12"/><line x1="6" y1="16" x2="9" y2="16"/><path d="M17 11l3 3-3 3"/><line x1="14" y1="14" x2="20" y2="14"/></I>,
    desc: 'Manage export shipments, phyto certifications, recall management, and crop margins.',
    cta: { label: 'Open Shipments', path: (b) => `/export-compliance?BusinessID=${b}` },
    addCta: { label: 'New Shipment', path: (b) => `/export-compliance?BusinessID=${b}` },
    links: (b) => [
      { label: 'Certifications', to: `/export-compliance?BusinessID=${b}&tab=certifications` },
      { label: 'Recalls', to: `/export-compliance?BusinessID=${b}&tab=recalls` },
      { label: 'Crop Margins', to: `/export-compliance?BusinessID=${b}&tab=margins` },
    ],
    platformPage: null,
  },
  weather_dashboard: {
    label: 'Weather & Climate', color: '#0369a1', bg: '#e0f2fe',
    icon: <I><circle cx="12" cy="10" r="4"/><path d="M4 18h16a5 5 0 000-10h-1.5A7 7 0 1 0 4 18z"/></I>,
    desc: 'Real-time forecasts, 7-day outlook, hourly strip, and farm location storage powered by Open-Meteo.',
    cta: { label: 'Open Weather', path: (b) => `/weather?BusinessID=${b}` },
    addCta: { label: 'Set Location', path: (b) => `/weather?BusinessID=${b}` },
    links: (b) => [
      { label: 'Irrigation Planner', to: `/irrigation?BusinessID=${b}` },
      { label: 'Spray Log', to: `/spray-applications?BusinessID=${b}` },
      { label: 'Field Health', to: `/field-health?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  crop_planning: {
    label: 'Crop Planning Calendar', color: '#15803d', bg: '#dcfce7',
    icon: <I><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><rect x="7" y="14" width="4" height="3" rx="0.5"/><rect x="13" y="12" width="5" height="5" rx="0.5"/></I>,
    desc: 'Gantt-style crop calendar, field rotation planner, and seasonal plan management.',
    cta: { label: 'Open Planner', path: (b) => `/crop-planning?BusinessID=${b}` },
    addCta: { label: 'Add Plan', path: (b) => `/crop-planning?BusinessID=${b}` },
    links: (b) => [
      { label: 'Seed & Varieties', to: `/seeds?BusinessID=${b}` },
      { label: 'Field Health', to: `/field-health?BusinessID=${b}` },
      { label: 'Yield Records', to: `/yield-records?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  seed_varieties: {
    label: 'Seed & Variety Management', color: '#854d0e', bg: '#fef9c3',
    icon: <I><circle cx="12" cy="14" r="4"/><path d="M12 10V6"/><path d="M9 7c0-3 1.5-6 3-7 1.5 1 3 4 3 7"/><path d="M7 18h10"/></I>,
    desc: 'Track seed lots, germination rates, expiry dates, and compare variety trial performance.',
    cta: { label: 'Seed Lots', path: (b) => `/seeds?BusinessID=${b}` },
    addCta: { label: 'Add Lot', path: (b) => `/seeds?BusinessID=${b}` },
    links: (b) => [
      { label: 'Variety Trials', to: `/seeds?BusinessID=${b}&tab=trials` },
      { label: 'Performance', to: `/seeds?BusinessID=${b}&tab=performance` },
      { label: 'Crop Planner', to: `/crop-planning?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  farm_safety: {
    label: 'Farm Safety & Incident Log', color: '#b91c1c', bg: '#fee2e2',
    icon: <I><path d="M12 2L3 7v7c0 5 3.5 9 9 11 5.5-2 9-6 9-11V7z"/><polyline points="9 12 11 14 15 10"/></I>,
    desc: 'Log incidents by severity, run digital safety checklists, and store chemical safety data sheets.',
    cta: { label: 'Incidents', path: (b) => `/farm-safety?BusinessID=${b}` },
    addCta: { label: 'Log Incident', path: (b) => `/farm-safety?BusinessID=${b}` },
    links: (b) => [
      { label: 'Checklists', to: `/farm-safety?BusinessID=${b}&tab=checklists` },
      { label: 'Chemical SDS', to: `/farm-safety?BusinessID=${b}&tab=sds` },
    ],
    platformPage: null,
  },
  buyer_crm: {
    label: 'Buyer & Customer CRM', color: '#0369a1', bg: '#e0f2fe',
    icon: <I><circle cx="8" cy="7" r="3"/><path d="M2 20c0-4 3-6 6-6h1"/><rect x="12" y="13" width="10" height="7" rx="1.5"/><line x1="15" y1="16.5" x2="19" y2="16.5"/></I>,
    desc: 'Manage buyer contacts, log interactions, and track custom pricing agreements by tier.',
    cta: { label: 'Open Contacts', path: (b) => `/buyer-crm?BusinessID=${b}` },
    addCta: { label: 'New Contact', path: (b) => `/buyer-crm?BusinessID=${b}` },
    links: (b) => [
      { label: 'Interaction Log', to: `/buyer-crm?BusinessID=${b}&tab=interactions` },
      { label: 'Pricing Agreements', to: `/buyer-crm?BusinessID=${b}&tab=pricing` },
    ],
    platformPage: null,
  },
  compliance_audit: {
    label: 'Compliance & Audit Manager', color: '#7c3aed', bg: '#ede9fe',
    icon: <I><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><polyline points="9 12 11 14 15 10"/></I>,
    desc: 'Track GlobalGAP, SQF, Organic, and HACCP audits, run digital checklists, and manage corrective actions.',
    cta: { label: 'Open Audits', path: (b) => `/compliance?BusinessID=${b}` },
    addCta: { label: 'New Audit', path: (b) => `/compliance?BusinessID=${b}` },
    links: (b) => [
      { label: 'Checklists', to: `/compliance?BusinessID=${b}&tab=checklists` },
      { label: 'Corrective Actions', to: `/compliance?BusinessID=${b}&tab=cars` },
    ],
    platformPage: null,
  },
  harvest_scheduling: {
    label: 'Harvest Scheduling & Labor Planner', color: '#3D6B34', bg: '#f0fdf4',
    icon: <I><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="8" y1="2" x2="8" y2="7"/><line x1="16" y1="2" x2="16" y2="7"/><path d="M8 14h8"/><path d="M8 18h5"/></I>,
    desc: 'Plan weekly harvests on a colour-coded calendar, assign crew, manage blocks, and track actual yields.',
    cta: { label: 'Open Calendar', path: (b) => `/harvest-schedule?BusinessID=${b}` },
    addCta: { label: 'New Schedule', path: (b) => `/harvest-schedule?BusinessID=${b}` },
    links: (b) => [
      { label: 'List View', to: `/harvest-schedule?BusinessID=${b}&view=list` },
    ],
    platformPage: null,
  },
  price_list: {
    label: 'Price List & Quote Builder', color: '#b45309', bg: '#fef3c7',
    icon: <I><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><path d="M14 5l4 4-4 4"/><line x1="10" y1="9" x2="18" y2="9"/><line x1="7" y1="13" x2="11" y2="13"/><line x1="7" y1="16" x2="9" y2="16"/></I>,
    desc: 'Create tiered price lists by buyer type (wholesale, retail, restaurant) and build professional sales quotes.',
    cta: { label: 'Price Lists', path: (b) => `/price-list?BusinessID=${b}` },
    addCta: { label: 'New Quote', path: (b) => `/price-list?BusinessID=${b}&tab=quotes` },
    links: (b) => [
      { label: 'Quotes', to: `/price-list?BusinessID=${b}&tab=quotes` },
    ],
    platformPage: null,
  },
  farm_stand: {
    label: 'Farm Stand & Market POS', color: '#be185d', bg: '#fdf2f8',
    icon: <I><path d="M3 3h18l-2 13H5z"/><path d="M3 3L2 1H0"/><path d="M9 17a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/><path d="M16 17a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/></I>,
    desc: 'Run a point-of-sale terminal for farmers markets and on-farm stands. Track sessions, products, and cash drawer.',
    cta: { label: 'Open POS', path: (b) => `/farm-stand?BusinessID=${b}` },
    addCta: { label: 'Products', path: (b) => `/farm-stand?BusinessID=${b}&tab=products` },
    links: (b) => [],
    platformPage: null,
  },
  delivery_routes: {
    label: 'Delivery Route Planner', color: '#0284c7', bg: '#e0f2fe',
    icon: <I><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></I>,
    desc: 'Plan and track delivery routes, manage stops, record proof of delivery, and monitor driver progress.',
    cta: { label: 'Routes', path: (b) => `/delivery-routes?BusinessID=${b}` },
    addCta: null,
    links: (b) => [],
    platformPage: null,
  },
  meetings: {
    label: 'Meetings & Cooperative Tools', color: '#4338ca', bg: '#eef2ff',
    icon: <I><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></I>,
    desc: 'Schedule meetings, build agendas with sections, capture minutes, assign action items, and email attendees.',
    cta: { label: 'Meetings', path: (b) => `/meetings?BusinessID=${b}` },
    addCta: null,
    links: (b) => [],
    platformPage: null,
  },
  agro_consultations: {
    label: 'Agronomist Consultation Log', color: '#15803d', bg: '#f0fdf4',
    icon: <I><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>,
    desc: 'Log agronomist visits, record findings, and track expert recommendations with priority and due-date tracking.',
    cta: { label: 'Consultations', path: (b) => `/agro-consult?BusinessID=${b}` },
    addCta: { label: 'Recommendations', path: (b) => `/agro-consult?BusinessID=${b}&tab=recommendations` },
    links: (b) => [],
    platformPage: null,
  },
  enterprise_supply_chain: {
    label: 'Supply Chain Intelligence', color: '#1e6b5a', bg: '#e8f5f1',
    icon: <I><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></I>,
    desc: 'End-to-end supply chain visibility: shipments, quality, margins, exceptions, and Tarrigon AI.',
    cta: { label: 'Open Dashboard', path: (b) => `/supply-chain?BusinessID=${b}` },
    addCta: { label: 'Control Tower', path: (b) => `/supply-chain/control-tower?BusinessID=${b}` },
    links: (b) => [
      { label: 'Exceptions', to: `/supply-chain/exceptions?BusinessID=${b}` },
      { label: 'Quality & Yield', to: `/supply-chain/quality?BusinessID=${b}` },
      { label: 'Margin Optimization', to: `/supply-chain/margin?BusinessID=${b}` },
      { label: 'Supplier Scorecards', to: `/supply-chain/scorecard?BusinessID=${b}` },
    ],
    platformPage: null,
  },
  chef_dashboard: {
    label: 'Chef Dashboard', color: '#7C3AED', bg: '#f5f3ff',
    icon: <I><path d="M4 13h8v7H4z"/><path d="M4 13a4 4 0 01-1-2.7A4 4 0 016.5 6a4 4 0 016 0A4 4 0 0116 13"/></I>,
    desc: 'Access chef-specific tools, menu costing, and kitchen intelligence.',
    cta: { label: 'Chef Dashboard', path: (b) => `/chef?BusinessID=${b}` },
    addCta: { label: 'Pairsley AI', path: (b) => `/platform/pairsley?BusinessID=${b}` },
    links: (b) => [
      { label: 'Sourced-From Card', to: `/provenance/${b}` },
    ],
    platformPage: '/platform/pairsley',
  },
  rosemarie: {
    label: 'Recipes & Batches', color: '#6D28D9', bg: '#f5f3ff',
    icon: <I><circle cx="12" cy="12" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="12" cy="20" r="2"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/></I>,
    desc: 'Scale recipes, track batch production, and manage ingredient sourcing.',
    cta: { label: 'Recipe Manager', path: (b) => `/recipes?BusinessID=${b}` },
    addCta: { label: 'New Recipe', path: (b) => `/recipes?BusinessID=${b}` },
    links: (b) => [
      { label: 'Batch Tracker', to: `/batches?BusinessID=${b}` },
      { label: 'About Rosemarie', to: '/platform/rosemarie' },
    ],
    platformPage: '/platform/rosemarie',
  },
  pairsley: {
    label: 'Pairsley AI', color: '#2F7D4A', bg: '#f0fdf4',
    icon: <I><line x1="5" y1="2" x2="5" y2="22"/><path d="M3 2v6a2 2 0 004 0V2"/><line x1="11" y1="2" x2="11" y2="22"/><path d="M9 2h4a3 3 0 010 6H9"/></I>,
    desc: 'AI assistant for restaurants — menus, sourcing, vendor relationships.',
    cta: { label: 'Open Pairsley', path: () => '/platform/pairsley' },
    addCta: { label: 'Learn More', path: () => '/platform/pairsley' },
    links: () => [],
    platformPage: '/platform/pairsley',
  },
  testimonials: {
    label: 'Testimonials', color: '#B45309', bg: '#fffbeb',
    icon: <I><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></I>,
    desc: 'Collect and display customer testimonials to build trust and social proof.',
    cta: { label: 'Manage Testimonials', path: (b) => `/testimonials/manage?BusinessID=${b}` },
    addCta: { label: 'Request Review', path: (b) => `/testimonials/request?BusinessID=${b}` },
    links: () => [],
    platformPage: null,
  },
  certifications: {
    label: 'Certifications', color: '#065F46', bg: '#ecfdf5',
    icon: <I><circle cx="12" cy="8" r="5"/><path d="M7 15.5L8 20h8l1-4.5"/><line x1="12" y1="13" x2="12" y2="20"/></I>,
    desc: 'Track USDA Organic, GAP, and other ag certifications in one place.',
    cta: { label: 'My Certifications', path: (b) => `/certifications?BusinessID=${b}` },
    addCta: { label: 'Add Certification', path: (b) => `/certifications?BusinessID=${b}` },
    links: () => [],
    platformPage: '/platform/certifications-tracker',
  },
  education_center: {
    label: 'Education Center', color: '#1D4ED8', bg: '#eff6ff',
    icon: <I><path d="M2 10l10-7 10 7-10 7-10-7z"/><path d="M20 10v7"/><path d="M6 12v4a7 4 0 0012 0v-4"/></I>,
    desc: 'Access courses, articles, and learning resources for ag professionals.',
    cta: { label: 'Courses & Articles', path: () => '/education' },
    addCta: { label: 'Browse', path: () => '/education' },
    links: () => [],
    platformPage: null,
  },
  grants_programs: {
    label: 'Grants & Programs', color: '#065F46', bg: '#ecfdf5',
    icon: <I><rect x="2" y="6" width="20" height="13" rx="1"/><path d="M6 6V5a3 3 0 016 0v1"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="10" y1="12" x2="14" y2="12"/></I>,
    desc: 'Find USDA grants, EQIP programs, and state funding for your operation.',
    cta: { label: 'Browse Programs', path: () => '/grants' },
    addCta: { label: 'My Tracker', path: (b) => `/grants?tab=my-tracking&BusinessID=${b}` },
    links: () => [],
    platformPage: '/platform/grants',
  },
  forums: {
    label: 'Community Forums', color: '#4B5563', bg: '#f9fafb',
    icon: <I><path d="M2 3h9a1 1 0 011 1v5a1 1 0 01-1 1H5L2 13V4a1 1 0 011-1z"/><path d="M14 7h8a1 1 0 011 1v4l-3 3h-5a1 1 0 01-1-1V8a1 1 0 011-1z"/></I>,
    desc: 'Connect with other farmers, producers, and food businesses in the community.',
    cta: { label: 'Browse Forums', path: () => '/forums' },
    addCta: { label: 'Start Thread', path: () => '/forums' },
    links: () => [],
    platformPage: '/platform/community',
  },
  csa_management: {
    label: 'CSA Management', color: '#065F46', bg: '#ecfdf5',
    icon: <I><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></I>,
    desc: 'Manage Community Supported Agriculture subscriptions and member pickups.',
    cta: { label: 'Manage CSA', path: (b) => `/csa/manage?BusinessID=${b}` },
    addCta: { label: 'Browse Plans', path: () => '/csa' },
    links: () => [],
    platformPage: '/platform/csa',
  },
  properties: {
    label: 'Properties', color: '#4B5563', bg: '#f9fafb',
    icon: <I><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></I>,
    desc: 'List and manage farm properties, buildings, and real estate.',
    cta: { label: 'My Properties', path: (b) => `/properties?BusinessID=${b}` },
    addCta: { label: 'Add Property', path: (b) => `/properties/add?BusinessID=${b}` },
    links: () => [],
    platformPage: null,
  },
};

// Features shown in "Discover More" that don't have full FEATURE_META entries
const DISCOVER_EXTRAS = [
  { key: 'equipment',         label: 'Equipment Marketplace', icon: <I><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></I>, path: '/marketplaces/equipment' },
  { key: 'food_wanted',       label: 'Food Wanted Board',     icon: <I><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/></I>, path: '/marketplaces/food-wanted' },
  { key: 'job_board',         label: 'Job Board',             icon: <I><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></I>, path: '/jobs' },
  { key: 'land_leasing',      label: 'Land Leasing',          icon: <I><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></I>, path: '/land' },
  { key: 'csa_advanced',      label: 'CSA Advanced',          icon: <I><polygon points="12 2 2 7 12 12 22 7"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></I>, path: '/csa-advanced' },
  { key: 'supplier_directory',label: 'Supplier Directory',    icon: <I><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></I>, path: '/suppliers' },
  { key: 'commodity_prices',  label: 'Commodity Prices',      icon: <I><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></I>, path: '/commodity-prices' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ statKey, businessId, persona }) {
  const meta = STAT_META[statKey];
  if (!meta) return null;
  return (
    <Link
      to={meta.path(businessId)}
      className="group flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:shadow-sm hover:-translate-y-0.5"
      style={{ backgroundColor: persona.lightBg, border: `1.5px solid ${persona.color}22` }}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: persona.color + '18', color: persona.color }}>
        {meta.icon}
      </div>
      <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{meta.label}</div>
    </Link>
  );
}

function FeatureCard({ fKey, businessId }) {
  const m = FEATURE_META[fKey];
  if (!m) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* header */}
      <div className="flex items-start gap-3 p-5 pb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: m.bg, color: m.color }}>
          {m.icon}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-tight">{m.label}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{m.desc}</p>
        </div>
      </div>

      {/* quick links */}
      <div className="px-5 pb-3 flex flex-wrap gap-x-3 gap-y-1">
        {m.links(businessId).map(l => (
          <Link key={l.to} to={l.to}
            className="text-xs hover:underline" style={{ color: m.color }}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* CTAs */}
      <div className="mt-auto flex items-center gap-2 px-5 py-3 border-t border-gray-100">
        {m.addCta && (
          <Link to={m.addCta.path(businessId)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
            style={{ backgroundColor: m.color + 'bb', color: '#ffffff' }}>
            + {m.addCta.label}
          </Link>
        )}
        <Link to={m.cta.path(businessId)}
          className="ml-auto text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: m.color, color: '#ffffff' }}>
          {m.cta.label} →
        </Link>
      </div>
    </div>
  );
}

function DiscoverCard({ item }) {
  return (
    <Link to={item.path}
      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all group">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-gray-700 shrink-0">
        {item.icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">{item.label}</p>
        <p className="text-[11px] text-gray-400">Browse →</p>
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AccountHome() {
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get('BusinessID');
  const peopleId   = searchParams.get('PeopleID') ||
                     localStorage.getItem('PeopleID') ||
                     localStorage.getItem('people_id');

  const [business, setBusiness]   = useState(null);
  const [features, setFeatures]   = useState(null);
  const [stats, setStats]         = useState(null);
  const [error, setError]         = useState(false);
  const [agriOps, setAgriOps]     = useState(null);

  useEffect(() => {
    if (!businessId) return;
    Promise.all([
      fetch(`${API_URL}/auth/account-home?BusinessID=${businessId}`).then(r => r.json()),
      fetch(`${API_URL}/api/company/features?business_id=${businessId}`).then(r => r.ok ? r.json() : []),
    ])
      .then(([biz, feats]) => {
        setBusiness(biz);
        const map = {};
        feats.forEach(f => { map[f.feature_key] = f; });
        setFeatures(map);
        setStats(biz.stats || {});
      })
      .catch(() => setError(true));
  }, [businessId]);

  useEffect(() => {
    if (!businessId) return;
    const h = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };
    Promise.all([
      fetch(`${API_URL}/api/work-orders/summary/dashboard?business_id=${businessId}`, { headers: h }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_URL}/api/farm-kpi/summary?business_id=${businessId}`, { headers: h }).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([wo, kpi]) => {
      const ops = {
        open_wo:        wo?.Open          || 0,
        overdue_wo:     wo?.Overdue       || 0,
        in_progress_wo: wo?.InProgress    || 0,
        active_pests:   kpi?.operations?.active_pests       || 0,
        low_stock:      kpi?.operations?.low_stock_inputs   || 0,
        overdue_maint:  kpi?.operations?.overdue_maintenance || 0,
        critical_alerts: kpi?.alerts?.critical || 0,
      };
      const hasAny = Object.values(ops).some(v => v > 0);
      if (hasAny) setAgriOps(ops);
    }).catch(() => {});
  }, [businessId]);

  if (error)    return <div className="p-8 text-red-600">Error loading account.</div>;
  if (!business || features === null || stats === null)
    return <div className="p-8 text-gray-400">Loading…</div>;

  const on = (key) => {
    if (PRECISION_AG_ONLY) return key === 'precision_ag';
    return features[key]?.is_enabled === true;
  };

  const persona = PERSONAS[BIZ_PERSONA[business.BusinessTypeID]] ?? PERSONAS.default;

  // Ordered active features — priority list first, then any remaining enabled
  const priorityKeys = persona.priorityFeatures.filter(k => on(k));
  const allEnabled   = Object.keys(features).filter(k => on(k) && !priorityKeys.includes(k) && FEATURE_META[k]);
  const featureKeys  = PRECISION_AG_ONLY
    ? ['precision_ag'].filter(k => FEATURE_META[k])
    : [...priorityKeys, ...allEnabled];

  // Stats: up to 4 from persona priority, then fill from any non-zero
  const statKeys = PRECISION_AG_ONLY ? [] : persona.statKeys.slice(0, 4);

  // Not-enabled features for Discover section
  const notEnabled = PRECISION_AG_ONLY ? [] : [
    ...Object.keys(FEATURE_META).filter(k => !on(k)),
    ...DISCOVER_EXTRAS.filter(d => !on(d.key)).map(d => d.key),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const discoverItems = PRECISION_AG_ONLY ? [] : [
    ...Object.entries(FEATURE_META)
      .filter(([k]) => notEnabled.includes(k))
      .map(([k, m]) => ({ key: k, label: m.label, icon: m.icon, path: m.platformPage || '/platform' })),
    ...DISCOVER_EXTRAS.filter(d => notEnabled.includes(d.key)),
  ].slice(0, 12);

  const city  = business.AddressCity;
  const state = business.AddressState;
  const location = city && state ? `${city}, ${state}` : (city || state || null);

  return (
    <AccountLayout
      Business={business}
      BusinessID={businessId}
      PeopleID={peopleId}
      pageTitle={business.BusinessName}
      breadcrumbs={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: business.BusinessName },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-7">

        {/* ── Hero banner ── */}
        <div className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: `linear-gradient(135deg, ${persona.color} 0%, ${persona.color}cc 100%)` }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-7">
            <div className="flex items-center gap-4">
              <div className="text-white opacity-90 shrink-0">{persona.icon}</div>
              <div>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">{persona.headline}</p>
                <h1 className="text-white text-2xl font-bold leading-tight">{business.BusinessName}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-white/80 text-sm">{business.BusinessType}</span>
                  {location && <><span className="text-white/40">·</span><span className="text-white/70 text-sm">📍 {location}</span></>}
                  {business.SubscriptionEndDate && (
                    <><span className="text-white/40">·</span>
                    <span className="text-white/70 text-xs">Subscription active through {new Date(business.SubscriptionEndDate).toLocaleDateString()}</span></>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end shrink-0">
              <Link to={`/account/profile?BusinessID=${businessId}`}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                style={{ color: '#ffffff' }}>
                Edit Profile
              </Link>
              <Link to={`/account/subscription?BusinessID=${businessId}`}
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                style={{ color: '#ffffff' }}>
                Subscription
              </Link>
            </div>
          </div>
          <div className="px-7 pb-4">
            <p className="text-white/60 text-sm italic">{persona.tagline}</p>
          </div>
        </div>

        {/* ── Stat bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statKeys.map(k => (
            <StatCard key={k} statKey={k} businessId={businessId} persona={persona} />
          ))}
        </div>

        {/* ── AgriERP farm ops quick-stats ── */}
        {agriOps && !PRECISION_AG_ONLY && (
          <section className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <I size={16}><path d="M3 20l5-8 4 6 3-4 7 6H3z"/><circle cx="18" cy="7" r="2"/></I>
                <h2 className="text-sm font-bold text-green-900 uppercase tracking-wide">Farm Operations</h2>
              </div>
              <Link to={`/work-orders?BusinessID=${businessId}`}
                className="text-xs font-medium text-green-700 hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { label: 'Open WOs',   value: agriOps.open_wo,       color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200',  path: `/work-orders?BusinessID=${businessId}` },
                { label: 'Overdue WOs',value: agriOps.overdue_wo,    color: 'text-red-700',   bg: 'bg-red-50 border-red-200',    path: `/work-orders?BusinessID=${businessId}` },
                { label: 'In Progress',value: agriOps.in_progress_wo, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200',path: `/work-orders?BusinessID=${businessId}` },
                { label: 'Low Stock',  value: agriOps.low_stock,     color: 'text-orange-700',bg: 'bg-orange-50 border-orange-200',path: `/farm-inputs?BusinessID=${businessId}` },
                { label: 'Active Pests',value: agriOps.active_pests, color: 'text-red-700',   bg: 'bg-red-50 border-red-200',    path: `/farm-kpi?BusinessID=${businessId}` },
                { label: 'Maint. Due', value: agriOps.overdue_maint, color: 'text-yellow-700',bg: 'bg-yellow-50 border-yellow-200',path: `/farm-infrastructure?BusinessID=${businessId}` },
              ].map(({ label, value, color, bg, path }) => (
                <Link key={label} to={path}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 gap-0.5 hover:shadow-sm transition-shadow ${bg}`}>
                  <span className={`text-xl font-bold ${value > 0 ? color : 'text-gray-300'}`}>{value}</span>
                  <span className="text-[10px] text-gray-500 text-center leading-tight">{label}</span>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-green-200">
              {[
                { label: '+ Work Order', to: `/work-orders?BusinessID=${businessId}` },
                { label: 'Farm Inputs',  to: `/farm-inputs?BusinessID=${businessId}` },
                { label: 'KPI Dashboard', to: `/farm-kpi?BusinessID=${businessId}` },
                { label: 'Packhouse QC', to: `/packhouse-qc?BusinessID=${businessId}` },
                { label: 'HR',           to: `/hr?BusinessID=${businessId}` },
                { label: 'Export Docs',  to: `/export-compliance?BusinessID=${businessId}` },
              ].map(({ label, to }) => (
                <Link key={to} to={to}
                  className="text-xs font-medium text-green-800 bg-white border border-green-300 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Active services ── */}
        {featureKeys.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Your Services</h2>
              <Link to={`/account/subscription?BusinessID=${businessId}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: persona.color, color: '#ffffff' }}>
                + Add Services
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featureKeys.map(k => <FeatureCard key={k} fKey={k} businessId={businessId} />)}
            </div>
          </section>
        )}

        {/* ── Quick actions block (always visible) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to={`/account/profile?BusinessID=${businessId}`}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow group">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-gray-700">
              <I size={18}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></I>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Edit Profile</p>
              <p className="text-xs text-gray-400">Update your public listing</p>
            </div>
          </Link>
          <Link to={`/permissions?BusinessID=${businessId}`}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow group">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-gray-700">
              <I size={18}><circle cx="9" cy="7" r="3"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 11l2 2 4-4"/></I>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Roles & Permissions</p>
              <p className="text-xs text-gray-400">Manage team access &amp; audit log</p>
            </div>
          </Link>
          <Link to={`/account/change-type?BusinessID=${businessId}`}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow group">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-gray-700">
              <I size={18}><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></I>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Change Account Type</p>
              <p className="text-xs text-gray-400">Switch business category</p>
            </div>
          </Link>
        </div>

        {/* ── Discover more ── */}
        {discoverItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Discover More</h2>
                <p className="text-xs text-gray-400">Explore other OFN tools available to your account</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {discoverItems.map(item => <DiscoverCard key={item.key} item={item} />)}
            </div>
          </section>
        )}

      </div>
    </AccountLayout>
  );
}
