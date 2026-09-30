import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventAdminLayout from './EventAdminLayout';

const IcoNametag = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3D6B34" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const IcoBarnCard = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3D6B34" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const IcoClassSheet = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3D6B34" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>;

export default function EventPrintHub() {
  const { t } = useTranslation();
  const { eventId } = useParams();

  const CARDS = [
    { key: 'nametags',     icon: <IcoNametag />,    title: t('event_print.nametags_title'),     desc: t('event_print.nametags_desc') },
    { key: 'barn-cards',   icon: <IcoBarnCard />,   title: t('event_print.barn_cards_title'),   desc: t('event_print.barn_cards_desc') },
    { key: 'class-sheets', icon: <IcoClassSheet />, title: t('event_print.class_sheets_title'), desc: t('event_print.class_sheets_desc') },
  ];

  return (
    <EventAdminLayout eventId={eventId}>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold text-[#3D6B34]">{t('event_print.heading')}</h1>
        <p className="text-sm text-gray-600 mt-1 mb-6">
          {t('event_print.subheading_prefix')} <strong>{t('event_print.none')}</strong> {t('event_print.subheading_mid')} <strong>{t('event_print.letter')}</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CARDS.map(c => (
            <Link key={c.key}
              to={`/events/${eventId}/admin/print/${c.key}`}
              className="bg-white rounded-xl shadow p-5 hover:shadow-md hover:border-[#3D6B34] border border-transparent transition">
              <div className="mb-2 flex items-center">{c.icon}</div>
              <div className="font-semibold text-gray-800 mb-1">{c.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{c.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </EventAdminLayout>
  );
}
