import React from 'react';
import { Link } from 'react-router-dom';

const SITE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'Join', to: '/signup' },
  { label: 'Contact us', to: '/contact-us' },
  { label: 'Events', to: '/events' },
  { label: 'Site Map', to: '/directory' },
];

const DIRECTORY_LINKS = [
  { label: 'List', to: '/directory' },
  { label: 'Agricultural Associations', to: '/directory/agricultural-associations' },
  { label: 'Artisan Food Producers', to: '/directory/artisan-producers' },
  { label: 'Business Resources', to: '/directory/business-resources' },
  { label: 'Crafter Organization', to: '/directory/crafter-organizations' },
  { label: 'Farmers Markets', to: '/directory/farmers-markets' },
  { label: 'Farms and Ranches', to: '/directory/farms-ranches' },
  { label: 'Fiber Cooperatives', to: '/directory/fiber-cooperatives' },
  { label: 'Fiber Mills', to: '/directory/fiber-mills' },
  { label: 'Fisheries', to: '/directory/fisheries' },
  { label: 'Fishermen', to: '/directory/fishermen' },
  { label: 'Food Cooperatives', to: '/directory/food-cooperatives' },
  { label: 'Food Hubs', to: '/directory/food-hubs' },
  { label: 'Grocery Stores', to: '/directory/grocery-stores' },
  { label: 'Herb and Tea Producers', to: '/directory/herb-and-tea-producers' },
  { label: 'Manufacturers', to: '/directory/manufacturers' },
  { label: 'Marinas', to: '/directory/marinas' },
  { label: 'Meat Wholesalers', to: '/directory/meat-wholesalers' },
  { label: 'Real Estate Agents', to: '/directory/real-estate-agents' },
  { label: 'Restaurants', to: '/directory/restaurants' },
  { label: 'Retailers', to: '/directory/retailers' },
  { label: 'Service Providers', to: '/directory/service-providers' },
  { label: 'Transporters', to: '/directory/transporters' },
  { label: 'Universities', to: '/directory/universities' },
  { label: 'Veterinarians', to: '/directory/veterinarians' },
  { label: 'Vineyards', to: '/directory/vineyards' },
  { label: 'Wineries', to: '/directory/wineries' },
  { label: 'Other', to: '/directory/others' },
];

const LIVESTOCK_LINKS = [
  { label: 'List', to: '/livestock' },
  { label: 'Alpacas', to: '/livestock/alpacas' },
  { label: 'Bison', to: '/livestock/bison' },
  { label: 'Buffalo', to: '/livestock/buffalo' },
  { label: 'Camels', to: '/livestock/camels' },
  { label: 'Cattle', to: '/livestock/cattle' },
  { label: 'Chickens', to: '/livestock/chickens' },
  { label: 'Crocodiles and Alligators', to: '/livestock/crocodiles' },
  { label: 'Deer', to: '/livestock/deer' },
  { label: 'Donkeys', to: '/livestock/donkeys' },
  { label: 'Ducks', to: '/livestock/ducks' },
  { label: 'Emus', to: '/livestock/emus' },
  { label: 'Geese', to: '/livestock/geese' },
  { label: 'Goats', to: '/livestock/goats' },
  { label: 'Guinea Fowl', to: '/livestock/guinea-fowl' },
  { label: 'Honey Bees', to: '/livestock/honey-bees' },
  { label: 'Horses', to: '/livestock/horses' },
  { label: 'Llamas', to: '/livestock/llamas' },
  { label: 'Musk Ox', to: '/livestock/musk-ox' },
  { label: 'Ostriches', to: '/livestock/ostriches' },
  { label: 'Pheasants', to: '/livestock/pheasants' },
  { label: 'Pigeons', to: '/livestock/pigeons' },
  { label: 'Pigs', to: '/livestock/pigs' },
  { label: 'Quails', to: '/livestock/quails' },
  { label: 'Rabbits', to: '/livestock/rabbits' },
  { label: 'Sheep', to: '/livestock/sheep' },
  { label: 'Snails', to: '/livestock/snails' },
  { label: 'Turkeys', to: '/livestock/turkeys' },
  { label: 'Yaks', to: '/livestock/yaks' },
];

const headingStyle = {
  fontFamily: "'Lora', 'Times New Roman', serif",
  fontWeight: 700,
  fontSize: '1.05rem',
  color: '#fff',
  marginBottom: '0.85rem',
};

const linkClass =
  'block text-[0.8rem] leading-snug !text-white/85 hover:!text-[#a8c47a] hover:underline transition-colors py-[0.12rem] no-underline';

function splitColumns(items) {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

export default function Footer() {
  const isLoggedIn = !!localStorage.getItem('access_token');
  const year = new Date().getFullYear();
  const [dirLeft, dirRight] = splitColumns(DIRECTORY_LINKS);
  const [liveLeft, liveRight] = splitColumns(LIVESTOCK_LINKS);

  if (isLoggedIn) {
    return (
      <footer className="bg-[#1a1a1a] text-white py-4 mt-12">
        <div className="text-center">
          <p className="text-white/50 text-xs">
            Copyright © 2023 - {year} Oatmeal AI. All Rights Reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#1a1a1a] text-white mt-12 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-8">

          {/* Site Links */}
          <div className="lg:col-span-2">
            <h3 style={headingStyle}>Site Links</h3>
            <ul className="space-y-0.5">
              {SITE_LINKS.map((item) => (
                <li key={item.to + item.label}>
                  <Link to={item.to} className={linkClass}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Directories — two columns */}
          <div className="lg:col-span-5">
            <h3 style={headingStyle}>Directories</h3>
            <div className="grid grid-cols-2 gap-x-4">
              <ul className="space-y-0.5">
                {dirLeft.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={linkClass}>{item.label}</Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-0.5">
                {dirRight.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={linkClass}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Livestock DB — two columns */}
          <div className="lg:col-span-5">
            <h3 style={headingStyle}>Livestock DB</h3>
            <div className="grid grid-cols-2 gap-x-4">
              <ul className="space-y-0.5">
                {liveLeft.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={linkClass}>{item.label}</Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-0.5">
                {liveRight.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={linkClass}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media sits under Livestock on the right, matching the mock */}
            <div className="mt-8">
              <h3 style={headingStyle}>Social Media</h3>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-5 text-center">
          <p className="text-white/55 text-xs tracking-wide">
            Copyright © 2023 - {year} Oatmeal AI. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
