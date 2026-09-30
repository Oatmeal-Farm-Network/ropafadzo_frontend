import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Footer from './Footer';
import PageMeta from './PageMeta';
import Breadcrumbs from './Breadcrumbs';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen font-sans">
      <PageMeta
        title="About Oatmeal Farm Network | Our Mission & Vision"
        description="Learn how Oatmeal Farm Network connects farmers, ranchers, buyers, and food businesses using Oatmeal AI, comprehensive livestock and plant knowledgebases, and a direct-to-market platform."
        keywords="about oatmeal farm network, farming technology, agricultural AI, farm marketplace, farm to table platform"
        canonical="https://oatmealfarmnetwork.com/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Oatmeal Farm Network',
          url: 'https://oatmealfarmnetwork.com/about',
          description: 'Learn how Oatmeal Farm Network connects farmers, ranchers, buyers, and food businesses using AI-powered tools.'
        }}
      />
      <Header />

      {/* Container with correct JSX style object and className */}
      <div className="container-fluid mx-auto px-4" style={{ maxWidth: '1300px', minHeight: '67px', backgroundColor: 'white' }}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
        <div className="py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">{t('about.title')}</h1>
            
            {/* Self-closing img tag with correct width object */}
            <div className="flex justify-center mb-4">
               <img 
                 src="/images/Oatmeal-Farm-Network-logo-horizontal.svg" 
                 style={{ width: '220px' }} 
                 alt="Oatmeal Farm Network Logo" 
               />
            </div>
            
            <p className="text-xl italic mb-8">
              {t('about.tagline')}
            </p>
          </div>

          {/* Floated image replaced with a responsive grid or flex for better React behavior */}
          <div className="block overflow-hidden">
            <img 
              src="/images/AboutUs.webp" 
              className="md:float-right m-4 rounded-lg shadow-md max-w-sm w-full" 
              alt="About Us" 
            />
            
            <p className="mb-4">{t('about.body1')}</p>
            <p className="mb-4">{t('about.body2')}</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.h2_ai')}</h2>
            <p className="mb-4">{t('about.ai_body')}</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.h2_ecosystem')}</h2>
            <p className="mb-4">{t('about.ecosystem_body')}</p>

            <ul className="list-disc ml-8 space-y-2 mb-8">
              <li>{t('about.li_livestock')}</li>
              <li>{t('about.li_directory')}</li>
              <li>{t('about.li_farm2table')}</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">{t('about.h2_ready')}</h2>
            <p className="mb-4">{t('about.ready_body1')}</p>
            <p className="font-bold mb-4">{t('about.ready_body2')}</p>

            <ul className="space-y-2">
              <li><Link to="/LivestockDB/" className="text-blue-600 hover:underline">{t('about.link_marketplace')}</Link></li>
              <li><Link to="/Livestockmarketplace/" className="text-blue-600 hover:underline">{t('about.link_livestock_db')}</Link></li>
              <li><Link to="/directory" className="text-blue-600 hover:underline">{t('about.link_directory')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default About;
