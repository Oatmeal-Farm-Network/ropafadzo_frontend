import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavIcon = ({ children }) => (
  <div className="w-10 h-10 flex items-center justify-center text-[#5a7a40]">{children}</div>
);

export default function AccountNav({ Business, BusinessID, PeopleID }) {
  const { t } = useTranslation();
  const BT = Business?.BusinessTypeID;

  return (
    <table className="w-full border-collapse">
      <tbody>

        {/* Produce - BusinessTypeID 8, 10, 14, 26, 29, 31 */}
        {[8, 10, 14, 26, 29, 31].includes(BT) && (
          <tr className="border-b border-gray-200">
            <td className="w-20 py-3 pr-4">
              <NavIcon><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 4-2.5 7.4-6 9"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></NavIcon>
            </td>
            <td className="py-3">
              <p className="font-bold text-gray-800 mb-1">{t('account_nav.sec_produce')}</p>
              <ul className="flex flex-wrap gap-3 text-sm">
                <li><Link to={`/produce/inventory?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.inventory')}</Link></li>
              </ul>
            </td>
          </tr>
        )}

        {/* Precision Ag - BusinessTypeID 8 only */}
        {BT === 8 && (
          <tr className="border-b border-gray-200">
            <td className="w-20 py-3 pr-4">
              <NavIcon><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></NavIcon>
            </td>
            <td className="py-3">
              <p className="font-bold text-gray-800 mb-1">{t('account_nav.sec_precision_ag')}</p>
              <ul className="flex flex-wrap gap-3 text-sm">
                <li><Link to={`/precision-ag/fields?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.dashboard')}</Link></li>
                <li><Link to={`/precision-ag/add?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.add_field')}</Link></li>
                <li><Link to={`/precision-ag/analyses?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.analyses')}</Link></li>
                <li><Link to={`/oatsense/crop-rotation?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.crop_rotation')}</Link></li>
                <li><Link to={`/oatsense/notes?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.notes')}</Link></li>
              </ul>
            </td>
          </tr>
        )}

        {/* Livestock - BusinessTypeID 8 only */}
        {BT === 8 && (
          <tr className="border-b border-gray-200">
            <td className="w-20 py-3 pr-4">
              <NavIcon><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="14" rx="7" ry="5"/><path d="M5 14c0-1-1-3-1-5a3 3 0 0 1 6 0"/><path d="M19 14c0-1 1-3 1-5a3 3 0 0 0-6 0"/><circle cx="9" cy="11" r="0.8" fill="currentColor"/><circle cx="15" cy="11" r="0.8" fill="currentColor"/></svg></NavIcon>
            </td>
            <td className="py-3">
              <p className="font-bold text-gray-800 mb-1">{t('account_nav.sec_livestock')}</p>
              <ul className="flex flex-wrap gap-3 text-sm">
                <li><Link to={`/animals?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.animals_list')}</Link></li>
                <li><Link to={`/animals/add?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.add')}</Link></li>
                <li><Link to={`/animals/delete?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.delete')}</Link></li>
                <li><Link to={`/animals/transfer?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.transfer')}</Link></li>
                <li><Link to={`/animals/stats?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.statistics')}</Link></li>
              </ul>
            </td>
          </tr>
        )}

        {/* Products - all types */}
        <tr className="border-b border-gray-200">
          <td className="w-20 py-3 pr-4">
              <NavIcon><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></NavIcon>
          </td>
          <td className="py-3">
            <p className="font-bold text-gray-800 mb-1">{t('account_nav.sec_products')}</p>
            <ul className="flex flex-wrap gap-3 text-sm">
              <li><Link to={`/products?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.list')}</Link></li>
              <li><Link to={`/products/add?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.add')}</Link></li>
              <li><Link to={`/products/settings?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.settings')}</Link></li>
            </ul>
          </td>
        </tr>

        {/* Services - all types */}
        <tr className="border-b border-gray-200">
          <td className="w-20 py-3 pr-4">
              <NavIcon><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></NavIcon>
          </td>
          <td className="py-3">
            <p className="font-bold text-gray-800 mb-1">{t('account_nav.sec_services')}</p>
            <ul className="flex flex-wrap gap-3 text-sm">
              <li><Link to={`/services?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.list')}</Link></li>
              <li><Link to={`/services/add?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.add')}</Link></li>
              <li><Link to={`/services/delete?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.delete')}</Link></li>
              <li><Link to={`/services/suggest-category?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.suggest_category')}</Link></li>
            </ul>
          </td>
        </tr>

        {/* Properties - BusinessTypeID 8 or 30 */}
        {[8, 30].includes(BT) && (
          <tr className="border-b border-gray-200">
            <td className="w-20 py-3 pr-4">
              <NavIcon><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></NavIcon>
            </td>
            <td className="py-3">
              <p className="font-bold text-gray-800 mb-1">{t('account_nav.sec_properties')}</p>
              <ul className="flex flex-wrap gap-3 text-sm">
                <li><Link to={`/properties?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.properties_list')}</Link></li>
                <li><Link to={`/properties/add?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.add_property')}</Link></li>
              </ul>
            </td>
          </tr>
        )}

        {/* Associations - BusinessTypeID 1 */}
        {BT === 1 && (
          <tr className="border-b border-gray-200">
            <td className="w-20 py-3 pr-4">
              <NavIcon><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></NavIcon>
            </td>
            <td className="py-3">
              <p className="font-bold text-gray-800 mb-1">{t('account_nav.sec_associations')}</p>
              <ul className="flex flex-wrap gap-3 text-sm">
                <li><Link to={`/association/create?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.create_account')}</Link></li>
                <li><Link to={`/association/delete?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.delete_account')}</Link></li>
              </ul>
            </td>
          </tr>
        )}

        {/* My Website - all types */}
        <tr>
          <td className="w-20 py-3 pr-4">
              <NavIcon><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></NavIcon>
          </td>
          <td className="py-3">
            <p className="font-bold text-gray-800 mb-1">{t('account_nav.sec_website')}</p>
            <ul className="flex flex-wrap gap-3 text-sm">
              <li><Link to={`/website/design?BusinessID=${BusinessID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.graphic_design')}</Link></li>
              <li><Link to={`/website/home?BusinessID=${BusinessID}&PeopleID=${PeopleID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.home_page')}</Link></li>
              <li><Link to={`/website/about?BusinessID=${BusinessID}&PeopleID=${PeopleID}`} className="text-[#3D6B34] hover:underline">{t('account_nav.about_page')}</Link></li>
            </ul>
          </td>
        </tr>

      </tbody>
    </table>
  );
}
