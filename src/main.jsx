import React, { lazy, Suspense, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useLocation, useParams } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname]);
  return null;
}

// /oatsense was merged into /precision-ag/fields — preserve the query string so
// any old bookmarks land on the new dashboard with their BusinessID intact.
function OatSenseRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/precision-ag/fields${search}`} replace />;
}

// Scouting was merged into the Field Journal (Notes). Old bookmarks redirect.
function ScoutingRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/oatsense/notes${search}`} replace />;
}

// Old Saige viz buttons used /precision-ag/fields/:id which matches no SPA route.
function PrecisionAgFieldIdRedirect() {
  const { fieldId } = useParams();
  const [searchParams] = useSearchParams();
  let businessId = searchParams.get('BusinessID') || '';
  if (!businessId) {
    try { businessId = localStorage.getItem('selected_business_id') || ''; } catch { /* ignore */ }
  }
  const qs = new URLSearchParams();
  if (businessId) qs.set('BusinessID', businessId);
  if (fieldId) qs.set('FieldID', fieldId);
  return <Navigate to={`/precision-ag/analyses?${qs.toString()}`} replace />;
}

// Persistent Saige widget — mounted once above <Routes> so open/closed state survives
// navigation. Returns null only for pages that already have an embedded AI agent,
// print/portal pages, and public marketing pages.
function SaigeWidgetGlobal() {
  const { pathname, search } = useLocation();
  const { isNavActive } = useNavConfig();

  // Never show to unauthenticated users
  const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
  if (!token) return null;

  // Respect admin toggle for the Saige widget
  if (!isNavActive('widget_saige')) return null;

  // Pages whose own layout/component already renders an AI agent
  if (pathname.startsWith('/herd-health'))  return null; // HerdHealthLayout has its own Saige
  if (pathname.startsWith('/accounting'))   return null; // Thaiyme handles accounting
  if (pathname.startsWith('/supply-chain')) return null; // TarrigonChat handles supply chain
  if (pathname.startsWith('/saige'))        return null; // SaigePage embeds the widget directly
  if (pathname === '/cassia')               return null;

  // Auth, public landing, and marketing pages — no widget
  const staticNoWidget = ['/', '/login', '/signup', '/forgot-password', '/about',
    '/contact-us', '/news', '/website-builder', '/agriculture-support',
    '/ai-agents', '/chef-pantry', '/event-registration'];
  if (staticNoWidget.includes(pathname))   return null;
  if (pathname.startsWith('/contact-us/')) return null;
  if (pathname.startsWith('/platform/'))   return null;
  if (pathname.startsWith('/for-'))        return null;
  if (pathname.startsWith('/sites/'))      return null;

  // Account/profile management — user handles their own account, no farm advisory needed
  if (pathname.startsWith('/account'))     return null;

  // Print and single-use portal pages
  if (pathname.includes('/admin/print'))   return null;
  if (pathname.endsWith('/certificate'))   return null;
  if (pathname.startsWith('/provenance/')) return null;
  if (pathname.startsWith('/judge/'))      return null;
  if (pathname.startsWith('/speaker/'))    return null;

  // Event attendee-registration pages that already embed Saige in their component
  if (/^\/events\/[^/]+\/register(\/wizard)?$/.test(pathname)) return null;
  if (/^\/events\/[^/]+\/(rsvp|conference|compete|dining|tour)$/.test(pathname)) return null;

  // Precision Ag pages that embed SaigeWidget directly with field-specific
  // context (avoid a second, generic bubble stacking on top of it)
  if (pathname.startsWith('/precision-ag/analyses'))       return null;
  if (pathname.startsWith('/precision-ag/geospatial'))     return null;
  if (pathname.startsWith('/precision-ag/statistics'))     return null;
  if (pathname.startsWith('/precision-ag/analysis/zoning')) return null;
  if (pathname.startsWith('/precision-ag/analysis/maps'))   return null;

  // Specialty-crop pages that embed SaigeWidget directly (avoid duplicate bubbles)
  if (pathname.startsWith('/chilling-hours'))      return null;
  if (pathname.startsWith('/grain-bin'))            return null;
  if (pathname.startsWith('/harvest-bins'))         return null;
  if (pathname.startsWith('/iot-greenhouse'))       return null;
  if (pathname.startsWith('/ca-storage'))           return null;
  if (pathname.startsWith('/spray-applications'))   return null;
  if (pathname.startsWith('/scouting'))             return null;
  if (pathname.startsWith('/irrigation'))           return null;
  if (pathname.startsWith('/equipment-maint'))      return null;
  if (pathname.startsWith('/soil-tests'))           return null;
  if (pathname.startsWith('/field-activity'))        return null;
  if (pathname.startsWith('/yield-records'))         return null;
  if (pathname.startsWith('/field-health'))          return null;
  if (pathname.startsWith('/nutrients'))             return null;
  if (pathname.startsWith('/farm-pl'))               return null;
  if (pathname.startsWith('/documents'))             return null;
  if (pathname.startsWith('/weather'))               return null;
  if (pathname.startsWith('/crop-planning'))         return null;
  if (pathname.startsWith('/seeds'))                 return null;
  if (pathname.startsWith('/farm-safety'))           return null;

  // Business-ops pages that embed ThaiymeChat — no global Saige bubble
  if (pathname.startsWith('/cash-flow'))             return null;
  if (pathname.startsWith('/reports'))               return null;
  if (pathname.startsWith('/crop-budget'))           return null;
  if (pathname.startsWith('/farm-inputs'))           return null;
  if (pathname.startsWith('/farm-infrastructure'))   return null;
  if (pathname.startsWith('/farm-kpi'))              return null;
  if (pathname.startsWith('/harvest-lots'))          return null;
  if (pathname.startsWith('/export-compliance'))     return null;
  if (pathname.startsWith('/packhouse'))             return null;
  if (pathname.startsWith('/plant-tags'))            return null;
  if (pathname.startsWith('/work-orders'))           return null;
  if (pathname.startsWith('/procurement'))           return null;
  if (pathname.startsWith('/cold-chain'))            return null;
  if (pathname.startsWith('/farmer-settlement'))     return null;
  if (pathname.startsWith('/hr'))                    return null;
  if (pathname.startsWith('/nursery'))               return null;
  if (pathname.startsWith('/outgrower'))             return null;
  if (pathname.startsWith('/picker-performance'))    return null;
  if (pathname.startsWith('/perishable-trace'))      return null;
  if (pathname.startsWith('/scale-tickets'))         return null;
  if (pathname.startsWith('/supplier-scorecard'))    return null;

  // New batch — BuyerCRM + ComplianceAudit use Thaiyme; HarvestSchedule + PriceList use embedded widgets
  if (pathname.startsWith('/buyer-crm'))             return null;
  if (pathname.startsWith('/compliance'))            return null;
  if (pathname.startsWith('/harvest-schedule'))      return null;
  if (pathname.startsWith('/price-list'))            return null;

  // Farm ops pages that embed ThaiymeChat or SaigeWidget directly
  if (pathname.startsWith('/farm-stand'))            return null;
  if (pathname.startsWith('/delivery-routes'))       return null;
  if (pathname.startsWith('/meetings'))              return null;
  if (pathname.startsWith('/agro-consult'))          return null;

  // ── Assign a page context for Saige ──────────────────────────────────────
  let pageContext;
  if      (pathname.startsWith('/precision-ag'))          pageContext = 'Precision Ag';
  else if (pathname.startsWith('/oatsense'))               pageContext = 'Precision Ag';
  else if (pathname.startsWith('/livestock'))              pageContext = 'Livestock';
  else if (pathname.startsWith('/animals'))                pageContext = 'Livestock';
  else if (pathname.startsWith('/supply-chain'))           pageContext = 'Enterprise Supply Chain';
  else if (pathname.startsWith('/cold-chain'))             pageContext = 'Cold Chain & Logistics';
  else if (pathname.startsWith('/farmer-settlement'))      pageContext = 'Farmer Settlement';
  else if (pathname.startsWith('/hr'))                     pageContext = 'HR & Workforce';
  else if (pathname.startsWith('/farm-inputs'))            pageContext = 'Farm Inputs';
  else if (pathname.startsWith('/crop-budget'))            pageContext = 'Crop Budgeting';
  else if (pathname.startsWith('/harvest-lots'))           pageContext = 'Harvest Lot Traceability';
  else if (pathname.startsWith('/farm-infrastructure'))    pageContext = 'Farm Infrastructure';
  else if (pathname.startsWith('/farm-kpi'))               pageContext = 'Farm KPI Dashboard';
  else if (pathname.startsWith('/nursery'))               pageContext = 'Nursery Management';
  else if (pathname.startsWith('/outgrower'))             pageContext = 'Contract Farming & Outgrower';
  else if (pathname.startsWith('/procurement'))           pageContext = 'Purchase & Procurement';
  else if (pathname.startsWith('/work-orders'))           pageContext = 'Work Orders & Field Crews';
  else if (pathname.startsWith('/packhouse'))             pageContext = 'Packhouse & QC Inspection';
  else if (pathname.startsWith('/plant-tags'))            pageContext = 'Plant Tagging & Asset Geo';
  else if (pathname.startsWith('/export-compliance'))     pageContext = 'Export Compliance & Traceability';
  else if (pathname.startsWith('/supplier-scorecard'))   pageContext = 'Supplier Scorecard & Performance';
  else if (pathname.startsWith('/agri-erp/mobile'))      pageContext = 'AgriERP Mobile Field Shell';
  else if (pathname.startsWith('/permissions'))           pageContext = 'Roles & Permissions';
  else if (pathname.startsWith('/picker-performance'))   pageContext = 'Picker Performance Tracking';
  else if (pathname.startsWith('/iot-greenhouse'))       pageContext = 'IoT Greenhouse Monitoring';
  else if (pathname.startsWith('/perishable-trace'))     pageContext = 'Perishable Traceability';
  else if (pathname.startsWith('/chilling-hours'))       pageContext = 'Chilling Hour & Bloom Forecast';
  else if (pathname.startsWith('/grain-bin'))            pageContext = 'Grain Bin & Silo Monitoring';
  else if (pathname.startsWith('/scale-tickets'))        pageContext = 'Scale Tickets & Contract Reconciliation';
  else if (pathname.startsWith('/harvest-bins'))         pageContext = 'Bin-Level Harvest Traceability';
  else if (pathname.startsWith('/ca-storage'))           pageContext = 'CA Cold Storage Management';
  else if (pathname.startsWith('/cash-flow'))            pageContext = 'Cash Flow Forecasting';
  else if (pathname.startsWith('/reports'))              pageContext = 'Report & Export Center';
  else if (pathname.startsWith('/certifications'))         pageContext = 'Certifications Tracker';
  else if (pathname.startsWith('/grants'))                 pageContext = 'Grants & Programs';
  else if (pathname.startsWith('/suppliers'))              pageContext = 'Supplier Directory';
  else if (pathname.startsWith('/csa'))                    pageContext = 'CSA Management';
  else if (pathname.startsWith('/aggregator'))             pageContext = 'Food Aggregator';
  else if (pathname.startsWith('/seller'))                 pageContext = 'Seller Dashboard';
  else if (pathname.startsWith('/marketplaces') ||
           pathname.startsWith('/marketplace'))            pageContext = 'Marketplace';
  else if (pathname.startsWith('/produce'))                pageContext = 'Produce Inventory';
  else if (pathname.startsWith('/products'))               pageContext = 'Products';
  else if (pathname.startsWith('/orders'))                 pageContext = 'Orders';
  else if (pathname.startsWith('/events'))                 pageContext = 'Events';
  else if (pathname.startsWith('/jobs'))                   pageContext = 'Job Board';
  else if (pathname.startsWith('/land'))                   pageContext = 'Land Leasing';
  else if (pathname.startsWith('/blog'))                   pageContext = 'Blog';
  else if (pathname.startsWith('/properties'))             pageContext = 'Properties';
  else if (pathname.startsWith('/restaurant') ||
           pathname.startsWith('/farm/standing'))          pageContext = 'Restaurant Hub';
  else if (pathname.startsWith('/recipes') ||
           pathname.startsWith('/batches'))                pageContext = 'Recipe & Batch Management';
  else if (pathname.startsWith('/commodity-prices'))       pageContext = 'Commodity Prices';
  else if (pathname.startsWith('/education'))              pageContext = 'Education Center';
  else if (pathname.startsWith('/over-the-fence/forums'))  pageContext = 'Community Forums';
  else if (pathname.startsWith('/app/news') ||
           pathname.startsWith('/over-the-fence'))         pageContext = 'Community';
  else if (pathname.startsWith('/esg'))                    pageContext = 'ESG Dashboard';
  else if (pathname.startsWith('/dashboard'))              pageContext = 'Dashboard';
  else if (pathname.startsWith('/directory'))              pageContext = 'Farm Directory';
  else if (pathname.startsWith('/profile'))                pageContext = 'Business Profile';
  else if (pathname.startsWith('/services'))               pageContext = 'Services Directory';
  else if (pathname.startsWith('/testimonials'))           pageContext = 'Testimonials';
  else if (pathname.startsWith('/knowledgebases') ||
           pathname.startsWith('/plant-knowledgebase') ||
           pathname.startsWith('/ingredient-knowledgebase')) pageContext = 'Knowledge Base';
  else if (pathname.startsWith('/chef'))                   pageContext = 'Chef Dashboard';
  else if (pathname.startsWith('/website/'))               pageContext = 'Website Builder';
  else                                                     pageContext = 'OatmealFarmNetwork';

  const businessId = new URLSearchParams(search).get('BusinessID');
  return <SaigeWidget businessId={businessId} pageContext={pageContext} />;
}
import OfflineIndicator from './OfflineIndicator';
import GlobalBackBar from './GlobalBackBar';
import './i18n.js';
import { useTranslation } from 'react-i18next';
import './index.css'
import { AccountProvider } from './AccountContext';
import { LanguageProvider } from './LanguageContext';
import SaigeWidget from './SaigeWidget';
import { useNavConfig } from './useNavConfig';
import "./AnimalAddWizard.css";
import AnimalEdit from "./AnimalEdit";
import MeatInventory from './MeatInventory';
import AccountLayout from './AccountLayout';
import AppShell from './AppShell';
import { PRECISION_AG_ONLY, isPrecisionAgAllowedPath, precisionAgHomeUrl } from './precisionAgMode';
import NewsFeed from "./NewsFeed";
import ArticleDetail from "./ArticleDetail";
import OFNComingSoon from "./OFNComingSoon";
import OverTheFenceDM from "./OverTheFenceDM";
import MarketplaceCatalog from './MarketplaceCatalog';
import MarketplaceProduct from './MarketplaceProduct';
import MarketplaceCart from './MarketplaceCart';
import MarketplaceOrders from './MarketplaceOrders';
import OrderDetail from './OrderDetail';
import SellerOrders from './SellerOrders';
import SellerListings from './SellerListings';
import EquipmentMarketplace from './EquipmentMarketplace';
import EquipmentListingDetail from './EquipmentListingDetail';
import MyEquipmentListings from './MyEquipmentListings';
import AboutEquipmentMarketplace from './AboutEquipmentMarketplace';
import RealEstateMarketplace from './RealEstateMarketplace';
import AboutMarketplaces from './AboutMarketplaces';
import ESGDashboard from './ESGDashboard';
import FoodWantedBoard from './FoodWantedBoard';
import FoodWantedAdDetail from './FoodWantedAdDetail';
import MyFoodWantedAds from './MyFoodWantedAds';
import JobBoard, { MyJobListings } from './JobBoard';
import { CSABrowse, CSAManage } from './CSAManager';
import LandLeasing, { MyLandListings } from './LandLeasing';
import CertificationsTracker from './CertificationsTracker';
import SupplierDirectory from './SupplierDirectory';
import GrantTracker from './GrantTracker';
import CommodityPrices from './CommodityPrices';
import EducationCenter from './EducationCenter';
import { ForumCategories, ForumThreads, ForumThread } from './OTFForums';
import CSAAdvanced from './CSAAdvanced';
import ColdChain from './ColdChain';
import FarmerSettlement from './FarmerSettlement';
import ForgotPassword from './ForgotPassword';
import ServicesDirectory from './ServicesDirectory';
import ServiceDetail from './ServiceDetail';
import EventsList from './EventsList';
import EventDetail from './EventDetail';
import EventRegister from './EventRegister';
import EventRegisterWizard from './EventRegisterWizard';
import EventRegistrationsAdmin from './EventRegistrationsAdmin';
import EventMealsAdmin from './EventMealsAdmin';
import EventCartReceipt from './EventCartReceipt';
import EventExportsHub from './EventExportsHub';
import EventMailingListAdmin from './EventMailingListAdmin';
import PromoCodesAdmin from './PromoCodesAdmin';
import WaitlistAdmin from './WaitlistAdmin';
import AbandonedCartsAdmin from './AbandonedCartsAdmin';
import EventPrintHub from './EventPrintHub';
import EventPrintNametags from './EventPrintNametags';
import EventPrintBarnCards from './EventPrintBarnCards';
import EventPrintClassSheets from './EventPrintClassSheets';
import EventsManage from './EventsManage';
import EventAdd from './EventAdd';
import EventAddDetails from './EventAddDetails';
import EventsMyRegistrations from './EventsMyRegistrations';
import FiberArtsAdmin from './FiberArtsAdmin';
import FiberArtsRegister from './FiberArtsRegister';
import FleeceAdmin from './FleeceAdmin';
import FleeceRegister from './FleeceRegister';
import SpinOffAdmin from './SpinOffAdmin';
import SpinOffRegister from './SpinOffRegister';
import HalterAdmin from './HalterAdmin';
import HalterRegister from './HalterRegister';
import AuctionAdmin from './AuctionAdmin';
import AuctionBrowse from './AuctionBrowse';
import VendorFairAdmin from './VendorFairAdmin';
import VendorFairApply from './VendorFairApply';
import SponsorshipAdmin from './SponsorshipAdmin';
import EventLeadRetrieval from './EventLeadRetrieval';
import FloorPlanAdmin from './FloorPlanAdmin';
import FloorPlanPublic from './FloorPlanPublic';
import BoothServicesAdmin from './BoothServicesAdmin';
import EventCOIAdmin from './EventCOIAdmin';
const AggregatorHub       = lazy(() => import('./AggregatorHub.jsx'));
const AggregatorFarms     = lazy(() => import('./AggregatorFarms.jsx'));
const AggregatorProduce   = lazy(() => import('./AggregatorProduce.jsx'));
const AggregatorLogistics = lazy(() => import('./AggregatorLogistics.jsx'));
const AggregatorSales     = lazy(() => import('./AggregatorSales.jsx'));
const AggregatorESG       = lazy(() => import('./AggregatorESG.jsx'));

import DiningAdmin from './DiningAdmin';
import DiningRegister from './DiningRegister';
import FarmTourAdmin from './FarmTourAdmin';
import FarmTourRegister from './FarmTourRegister';
import SimpleEventAdmin from './SimpleEventAdmin';
import SimpleEventRegister from './SimpleEventRegister';
import ConferenceAdmin from './ConferenceAdmin';
import ConferenceRegister from './ConferenceRegister';
import CompetitionAdmin from './CompetitionAdmin';
import CompetitionRegister from './CompetitionRegister';
import JudgePortal from './JudgePortal';
import ConferenceAgenda from './ConferenceAgenda';
import CompetitionLeaderboard from './CompetitionLeaderboard';
import MyRegistrations from './MyRegistrations';
import EventCheckIn from './EventCheckIn';
import EventCertificate from './EventCertificate';
import EventBroadcast from './EventBroadcast';
import SpeakerPortal from './SpeakerPortal';
import EventAnalytics from './EventAnalytics';
import EventAdminDashboard from './EventAdminDashboard';
import EventFeaturesAdmin from './EventFeaturesAdmin';
import EventClone from './EventClone';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import BlogManage from './BlogManage';
import BlogAuthors from './BlogAuthors';
import BlogAuthorDetail from './BlogAuthorDetail';


// Reload once if a lazy chunk 404s after a redeploy (stale index-*.js pointing at old hashes).
// Guarded by a sessionStorage timestamp so a genuinely missing chunk doesn't infinite-loop.
const lazyWithReload = (importFn) => lazy(async () => {
  try {
    return await importFn();
  } catch (err) {
    const msg = String(err?.message || err || '');
    const isChunkError = /Failed to fetch dynamically imported module|Loading chunk|Importing a module script failed|error loading dynamically imported module/i.test(msg);
    if (isChunkError) {
      const key = '__ofn_last_chunk_reload__';
      const last = parseInt(sessionStorage.getItem(key) || '0', 10);
      if (Date.now() - last > 10000) {
        sessionStorage.setItem(key, String(Date.now()));
        window.location.reload();
        return new Promise(() => {});
      }
    }
    throw err;
  }
});

const SupplyChainHub            = lazyWithReload(() => import('./SupplyChainHub.jsx'));
const SupplyChainVisibility     = lazyWithReload(() => import('./SupplyChainVisibility.jsx'));
const SupplyChainQuality        = lazyWithReload(() => import('./SupplyChainQuality.jsx'));
const SupplyChainMargin         = lazyWithReload(() => import('./SupplyChainMargin.jsx'));
const SupplyChainForecasting    = lazyWithReload(() => import('./SupplyChainForecasting.jsx'));
const SupplyChainExceptions     = lazyWithReload(() => import('./SupplyChainExceptions.jsx'));
const SupplyChainSettings       = lazyWithReload(() => import('./SupplyChainSettings.jsx'));
const SupplyChainScorecard      = lazyWithReload(() => import('./SupplyChainScorecard.jsx'));
const SupplyChainControlTower   = lazyWithReload(() => import('./SupplyChainControlTower.jsx'));
const SupplyChainSupplierPortal = lazyWithReload(() => import('./SupplyChainSupplierPortal.jsx'));

const HRDashboard          = lazyWithReload(() => import('./HRDashboard.jsx'));
const FarmInputInventory   = lazyWithReload(() => import('./FarmInputInventory.jsx'));
const CropBudget           = lazyWithReload(() => import('./CropBudget.jsx'));
const HarvestLots          = lazyWithReload(() => import('./HarvestLots.jsx'));
const FarmInfrastructure   = lazyWithReload(() => import('./FarmInfrastructure.jsx'));
const FarmKPIDashboard     = lazyWithReload(() => import('./FarmKPIDashboard.jsx'));
const Nursery              = lazyWithReload(() => import('./Nursery.jsx'));
const Outgrower            = lazyWithReload(() => import('./Outgrower.jsx'));
const Procurement          = lazyWithReload(() => import('./Procurement.jsx'));
const WorkOrders           = lazyWithReload(() => import('./WorkOrders.jsx'));
const PackhouseQC          = lazyWithReload(() => import('./PackhouseQC.jsx'));
const PlantTagging         = lazyWithReload(() => import('./PlantTagging.jsx'));
const ExportCompliance     = lazyWithReload(() => import('./ExportCompliance.jsx'));
const SupplierScorecard    = lazyWithReload(() => import('./SupplierScorecard.jsx'));
const AgriERPMobile        = lazyWithReload(() => import('./AgriERPMobile.jsx'));
const Permissions          = lazyWithReload(() => import('./Permissions.jsx'));;
const PickerPerformance    = lazyWithReload(() => import('./PickerPerformance.jsx'));
const IoTGreenhouse        = lazyWithReload(() => import('./IoTGreenhouse.jsx'));
const PerishableTrace      = lazyWithReload(() => import('./PerishableTrace.jsx'));
const ChillingHours        = lazyWithReload(() => import('./ChillingHours.jsx'));
const GrainBinMonitor      = lazyWithReload(() => import('./GrainBinMonitor.jsx'));
const ScaleTickets         = lazyWithReload(() => import('./ScaleTickets.jsx'));
const HarvestBins          = lazyWithReload(() => import('./HarvestBins.jsx'));
const CAStorage            = lazyWithReload(() => import('./CAStorage.jsx'));
const SprayApplicationLog  = lazyWithReload(() => import('./SprayApplicationLog.jsx'));
const ScoutingLog          = lazyWithReload(() => import('./ScoutingLog.jsx'));
const IrrigationManager    = lazyWithReload(() => import('./IrrigationManager.jsx'));
const EquipmentMaintenance = lazyWithReload(() => import('./EquipmentMaintenance.jsx'));
const SoilTestRecords      = lazyWithReload(() => import('./SoilTestRecords.jsx'));
const CashFlowForecast     = lazyWithReload(() => import('./CashFlowForecast.jsx'));
const FieldActivityJournal  = lazyWithReload(() => import('./FieldActivityJournal.jsx'));
const YieldRecords          = lazyWithReload(() => import('./YieldRecords.jsx'));
const ReportCenter          = lazyWithReload(() => import('./ReportCenter.jsx'));
const FieldHealthDashboard  = lazyWithReload(() => import('./FieldHealthDashboard.jsx'));
const NutrientManagement    = lazyWithReload(() => import('./NutrientManagement.jsx'));
const FarmPL                = lazyWithReload(() => import('./FarmPL.jsx'));
const DocumentVault         = lazyWithReload(() => import('./DocumentVault.jsx'));
const WeatherDashboard      = lazyWithReload(() => import('./WeatherDashboard.jsx'));
const CropPlanner           = lazyWithReload(() => import('./CropPlanner.jsx'));
const SeedVarieties         = lazyWithReload(() => import('./SeedVarieties.jsx'));
const FarmSafety            = lazyWithReload(() => import('./FarmSafety.jsx'));
const BuyerCRM              = lazyWithReload(() => import('./BuyerCRM.jsx'));
const ComplianceAudit       = lazyWithReload(() => import('./ComplianceAudit.jsx'));
const HarvestSchedule       = lazyWithReload(() => import('./HarvestSchedule.jsx'));
const PriceList             = lazyWithReload(() => import('./PriceList.jsx'));
const FarmStand             = lazyWithReload(() => import('./FarmStand.jsx'));
const DeliveryRoutes        = lazyWithReload(() => import('./DeliveryRoutes.jsx'));
const Meetings              = lazyWithReload(() => import('./Meetings.jsx'));
const AgroConsultations     = lazyWithReload(() => import('./AgroConsultations.jsx'));

const App = lazyWithReload(() => import('./App.jsx'))
const About = lazyWithReload(() => import('./About.jsx'))
const AppDownload = lazyWithReload(() => import('./AppDownload.jsx'))
const Login = lazyWithReload(() => import('./login.jsx'))
const Signup = lazyWithReload(() => import('./Signup.jsx'))
const Dashboard = lazyWithReload(() => import('./Dashboard.jsx'))
const AccountHome = lazyWithReload(() => import('./AccountHome.jsx'))
const PrecisionAgFields = lazyWithReload(() => import('./PrecisionAgFields.jsx'))
const ChefDashboard = lazyWithReload(() => import('./ChefDashboard.jsx'))
const PrecisionAgAdd = lazyWithReload(() => import('./PrecisionAgAdd.jsx'))
const PrecisionAgAnalyses = lazyWithReload(() => import('./PrecisionAgAnalyses.jsx'))
const PrecisionAgHistograms = lazyWithReload(() => import('./PrecisionAgHistograms.jsx'))
const PrecisionAgZoning = lazyWithReload(() => import('./PrecisionAgZoning.jsx'))
const PrecisionAgMaps = lazyWithReload(() => import('./PrecisionAgMaps.jsx'))
const PrecisionAgGeospatialCenter = lazyWithReload(() => import('./PrecisionAgGeospatialCenter.jsx'))
const PrecisionAgCropStatus = lazyWithReload(() => import('./PrecisionAgCropStatus.jsx'))
const PrecisionAgMultiLayer = lazyWithReload(() => import('./PrecisionAgMultiLayer.jsx'))
const PrecisionAgPrescriptions = lazyWithReload(() => import('./PrecisionAgPrescriptions.jsx'))
const PrecisionAgSoilSamples = lazyWithReload(() => import('./PrecisionAgSoilSamples.jsx'))
const PrecisionAgReports = lazyWithReload(() => import('./PrecisionAgReports.jsx'))
const FieldAssessmentReport = lazyWithReload(() => import('./FieldAssessmentReport.jsx'))
const PrecisionAgAlerts = lazyWithReload(() => import('./PrecisionAgAlerts.jsx'))
const PrecisionAgGDD = lazyWithReload(() => import('./PrecisionAgGDD.jsx'))
const PrecisionAgActivityLog = lazyWithReload(() => import('./PrecisionAgActivityLog.jsx'))
const PrecisionAgScouting = lazyWithReload(() => import('./PrecisionAgScouting.jsx'))
const PrecisionAgIrrigation = lazyWithReload(() => import('./PrecisionAgIrrigation.jsx'))
const PrecisionAgYieldForecast = lazyWithReload(() => import('./PrecisionAgYieldForecast.jsx'))
const PrecisionAgCarbon = lazyWithReload(() => import('./PrecisionAgCarbon.jsx'))
const PrecisionAgBenchmark = lazyWithReload(() => import('./PrecisionAgBenchmark.jsx'))
const CropRotation = lazyWithReload(() => import('./CropRotation.jsx'))
const PrecisionAgWaterUse = lazyWithReload(() => import('./PrecisionAgWaterUse.jsx'))
const PrecisionAgStatistics = lazyWithReload(() => import('./PrecisionAgStatistics.jsx'))
const OatSenseNotes = lazyWithReload(() => import('./OatSenseNotes.jsx'))
const WebsiteBuilder = lazyWithReload(() => import('./WebsiteBuilder.jsx'))
const WebsitePublic = lazyWithReload(() => import('./WebsitePublic.jsx'))
const AudioSettings = lazyWithReload(() => import('./AudioSettings.jsx'))
const AccountSettings = lazyWithReload(() => import('./AccountSettings.jsx'))
const AccountAssociations = lazyWithReload(() => import('./AccountAssociations.jsx'))
const AccountTeamMembers = lazyWithReload(() => import('./AccountTeamMembers.jsx'))
const SaigePage = lazyWithReload(() => import('./SaigePage.jsx'))
const SaigeComingSoon = lazyWithReload(() => import('./SaigeComingSoon.jsx'))
const CassiaPage = lazyWithReload(() => import('./CassiaPage.jsx'))
const CompanionPlanting = lazyWithReload(() => import('./CompanionPlanting.jsx'))
const CropNames = lazyWithReload(() => import('./CropNames.jsx'))
const WeatherMitigation = lazyWithReload(() => import('./WeatherMitigation.jsx'))
const RegionCrops = lazyWithReload(() => import('./RegionCrops.jsx'))
const SoilChallenges = lazyWithReload(() => import('./SoilChallenges.jsx'))
const PestDetection = lazyWithReload(() => import('./PestDetection.jsx'))
const PriceForecast = lazyWithReload(() => import('./PriceForecast.jsx'))
const Subsidies = lazyWithReload(() => import('./Subsidies.jsx'))
const Insurance = lazyWithReload(() => import('./Insurance.jsx'))
const PushNotifications = lazyWithReload(() => import('./PushNotifications.jsx'))
const SaigeProfile = lazyWithReload(() => import('./SaigeProfile.jsx'))
const AnimalsHome = lazyWithReload(() => import('./AnimalsHome.jsx'))
const AnimalDelete = lazyWithReload(() => import('./AnimalDelete.jsx'))
const AnimalPackages = lazyWithReload(() => import('./AnimalPackages.jsx'))
const HerdHealthDashboard = lazyWithReload(() => import('./HerdHealthDashboard.jsx'))
const HerdHealthEvents = lazyWithReload(() => import('./HerdHealthEvents.jsx'))
const HerdHealthVaccinations = lazyWithReload(() => import('./HerdHealthVaccinations.jsx'))
const HerdHealthTreatments = lazyWithReload(() => import('./HerdHealthTreatments.jsx'))
const HerdHealthVetVisits = lazyWithReload(() => import('./HerdHealthVetVisits.jsx'))
const HerdHealthMedications = lazyWithReload(() => import('./HerdHealthMedications.jsx'))
const HerdHealthWeight = lazyWithReload(() => import('./HerdHealthWeight.jsx'))
const HerdHealthParasites = lazyWithReload(() => import('./HerdHealthParasites.jsx'))
const HerdHealthQuarantine = lazyWithReload(() => import('./HerdHealthQuarantine.jsx'))
const HerdHealthMortality = lazyWithReload(() => import('./HerdHealthMortality.jsx'))
const HerdHealthLabResults = lazyWithReload(() => import('./HerdHealthLabResults.jsx'))
const HerdHealthBiosecurity = lazyWithReload(() => import('./HerdHealthBiosecurity.jsx'))
const HerdHealthVetContacts = lazyWithReload(() => import('./HerdHealthVetContacts.jsx'))
const HerdHealthReproduction = lazyWithReload(() => import('./HerdHealthReproduction.jsx'))
const HerdHealthReports = lazyWithReload(() => import('./HerdHealthReports.jsx'))
const AccountChangeType = lazyWithReload(() => import('./AccountChangeType.jsx'))
const AnimalAddWizard = lazyWithReload(() => import('./AnimalAddWizard'))
const DirectoryList = lazyWithReload(() => import('./Directory/pages/DirectoryList'))
const DirectoryDetail = lazyWithReload(() => import('./Directory/pages/DirectoryDetail'))
const Accounts = lazyWithReload(() => import('./Accounts.jsx'))
const Knowledgebases = lazyWithReload(() => import('./Knowledgebases.jsx'))
const IngredientKnowledgebase = lazyWithReload(() => import('./IngredientKnowledgebase.jsx'))
const IngredientCategory = lazyWithReload(() => import('./IngredientCategory.jsx'))
const IngredientVarieties = lazyWithReload(() => import('./IngredientVarieties.jsx'))
const LivestockDB = lazyWithReload(() => import('./LivestockDB.jsx'))
const LivestockSpecies = lazyWithReload(() => import('./LivestockSpecies.jsx'))
const LivestockBreed = lazyWithReload(() => import('./LivestockBreed.jsx'))
const LivestockAbout = lazyWithReload(() => import('./LivestockAbout.jsx'))
const PlantKnowledgebase = lazyWithReload(() => import('./PlantKnowledgebase.jsx'))
const PlantCategory = lazyWithReload(() => import('./PlantCategory.jsx'))
const PlantVarietals = lazyWithReload(() => import('./PlantVarietals.jsx'))
const PlantVarietalDetail = lazyWithReload(() => import('./PlantVarietalDetail.jsx'))
const Marketplaces = lazyWithReload(() => import('./Marketplaces.jsx'))
const ContactUs = lazyWithReload(() => import('./ContactUs.jsx'))
const ContactUsConfirm = lazyWithReload(() => import('./ContactUsConfirm.jsx'))
const AccountNew = lazyWithReload(() => import('./AccountNew.jsx'))
const AccountProfile = lazyWithReload(() => import('./AccountProfile.jsx'))
const AccountDelete = lazyWithReload(() => import('./AccountDelete.jsx'))
const AccountSubscription = lazyWithReload(() => import('./AccountSubscription.jsx'))
const UnifiedCart = lazyWithReload(() => import('./UnifiedCart.jsx'))
const ProduceInventory = lazyWithReload(() => import('./ProduceInventory.jsx'))
const ProcessedFoodInventory = lazyWithReload(() => import('./ProcessedFoodInventory.jsx'))
const CropDetection = lazyWithReload(() => import('./CropDetection.jsx'))
const VisualizationsDashboard = lazyWithReload(() => import('./VisualizationsDashboard.jsx'))
const CropAnalysisSummary = lazyWithReload(() => import('./CropAnalysisSummary.jsx'))
const ServicesHome = lazyWithReload(() => import('./ServicesHome.jsx'))
const AboutSaige = lazyWithReload(() => import('./AboutSaige.jsx'))
const AboutRosemarie = lazyWithReload(() => import('./AboutRosemarie.jsx'))
const AboutPairsley = lazyWithReload(() => import('./AboutPairsley.jsx'))
const AboutThaiyme = lazyWithReload(() => import('./AboutThaiyme.jsx'))
const RecipeManager = lazyWithReload(() => import('./RecipeManager.jsx'))
const BatchTracker = lazyWithReload(() => import('./BatchTracker.jsx'))
const AboutWebsiteBuilder = lazyWithReload(() => import('./AboutWebsiteBuilder.jsx'))
const AboutMarketplace = lazyWithReload(() => import('./AboutMarketplace.jsx'))
const AboutEvents = lazyWithReload(() => import('./AboutEvents.jsx'))
const AboutCropMonitor = lazyWithReload(() => import('./AboutCropMonitor.jsx'))
const AboutPrecisionAg = lazyWithReload(() => import('./AboutPrecisionAg.jsx'))
const AboutAgSupport = lazyWithReload(() => import('./AboutAgSupport.jsx'))
const AboutAIAgents = lazyWithReload(() => import('./AboutAIAgents.jsx'))
const AboutChefPantry = lazyWithReload(() => import('./AboutChefPantry.jsx'))
const AboutEventRegistration = lazyWithReload(() => import('./AboutEventRegistration.jsx'))
const ForBusinessPage = lazyWithReload(() => import('./ForBusinessPage.jsx'))
const AboutDirectory = lazyWithReload(() => import('./AboutDirectory.jsx'))
const AboutLivestockMarketplace = lazyWithReload(() => import('./AboutLivestockMarketplace.jsx'))
const AboutLivestockHerdHealth = lazyWithReload(() => import('./AboutLivestockHerdHealth.jsx'))
const AboutProductsStorefront = lazyWithReload(() => import('./AboutProductsStorefront.jsx'))
const AboutCSA = lazyWithReload(() => import('./AboutCSA.jsx'))
const AboutAggregator = lazyWithReload(() => import('./AboutAggregator.jsx'))
const AboutJobBoard = lazyWithReload(() => import('./AboutJobBoard.jsx'))
const AboutLandLeasing = lazyWithReload(() => import('./AboutLandLeasing.jsx'))
const AboutCertificationsTracker = lazyWithReload(() => import('./AboutCertificationsTracker.jsx'))
const AboutGrants = lazyWithReload(() => import('./AboutGrants.jsx'))
const AboutCommunity = lazyWithReload(() => import('./AboutCommunity.jsx'))
const AboutBlog = lazyWithReload(() => import('./AboutBlog.jsx'))
const AboutAccounting = lazyWithReload(() => import('./AboutAccounting.jsx'))
const ServicesAdd = lazyWithReload(() => import('./ServicesAdd.jsx'))
const ServicesSuggestCategory = lazyWithReload(() => import('./ServicesSuggestCategory.jsx'))
const ServicesEdit = lazyWithReload(() => import('./ServicesEdit.jsx'))
const FarmToTableMarketplace = lazyWithReload(() => import('./FarmToTableMarketplace.jsx'))
const ProductsMarketplace = lazyWithReload(() => import('./ProductsMarketplace.jsx'))
const ProductDetail = lazyWithReload(() => import('./ProductDetail.jsx'))
const ProductsInventory = lazyWithReload(() => import('./ProductsInventory.jsx'))
const ProductEdit = lazyWithReload(() => import('./ProductEdit.jsx'))
const LivestockMarketplace = lazyWithReload(() => import('./LivestockMarketplace.jsx'))
const LivestockForSale = lazyWithReload(() => import('./LivestockForSale.jsx'))
const LivestockAnimalDetail = lazyWithReload(() => import('./LivestockAnimalDetail.jsx'))
const LivestockAnimalProgeny = lazyWithReload(() => import('./LivestockAnimalProgeny.jsx'))
const RanchList = lazyWithReload(() => import('./RanchList.jsx'))
const OrgProfile = lazyWithReload(() => import('./OrgProfile.jsx'))
const Accounting = lazyWithReload(() => import('./Accounting.jsx'))
const Properties = lazyWithReload(() => import('./Properties.jsx'))
const TestimonialsManage = lazyWithReload(() => import('./TestimonialsManage.jsx'))
const TestimonialsRequest = lazyWithReload(() => import('./TestimonialsRequest.jsx'))
const ProvenanceCard = lazyWithReload(() => import('./ProvenanceCard.jsx'))
const RestaurantSavedFarms = lazyWithReload(() => import('./RestaurantSavedFarms.jsx'))
const RestaurantStandingOrders = lazyWithReload(() => import('./RestaurantStandingOrders.jsx'))
const FarmStandingOrders = lazyWithReload(() => import('./FarmStandingOrders.jsx'))
const RestaurantDigest = lazyWithReload(() => import('./RestaurantDigest.jsx'))
const SellerStripeConnect = lazyWithReload(() => import('./SellerStripeConnect.jsx'))

function RequireAuth({ children }) {
  const token = localStorage.getItem('access_token');
  const location = useLocation();
  return token ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

/** When VITE_PRECISION_AG_ONLY=true, bounce non–Precision Ag routes to the fields home. */
function PrecisionAgOnlyGate() {
  const { pathname, search } = useLocation();
  if (!PRECISION_AG_ONLY) return null;
  if (isPrecisionAgAllowedPath(pathname)) return null;
  return <Navigate to={precisionAgHomeUrl(search)} replace />;
}

// Redirect legacy ASP URL: /livestockmarketplace/Animals/Details.asp?ID=xxx
function LegacyAnimalRedirect() {
  const [params] = useSearchParams();
  const id = params.get('ID') || params.get('id');
  return <Navigate to={id ? `/marketplaces/livestock/animal/${id}` : '/marketplaces/livestock'} replace />;
}

// Legacy alias: /account/events → /events/manage (preserve query string)
function AccountEventsRedirect() {
  const [params] = useSearchParams();
  const qs = params.toString();
  return <Navigate to={`/events/manage${qs ? `?${qs}` : ''}`} replace />;
}

// Custom domains (not OFN or localhost) get the full public site renderer for every path.
const OFN_HOSTS = [
  'oatmealfarmnetwork.com',
  'www.oatmealfarmnetwork.com',
  'localhost',
  '127.0.0.1',
  // Staging Cloud Run (both URL forms)
  'oatmeal-frontend-staging-1087130530284.us-central1.run.app',
  'oatmeal-frontend-staging-lrviw4iujq-uc.a.run.app',
  // Development Cloud Run
  'oatmeal-frontend-development-1087130530284.us-central1.run.app',
  'oatmeal-frontend-development-lrviw4iujq-uc.a.run.app',
];
const isCustomDomain = !(
  OFN_HOSTS.some(
    h => window.location.hostname === h || window.location.hostname.endsWith(`.${h}`)
  )
  || window.location.hostname.startsWith('oatmeal-frontend-staging')
  || window.location.hostname.startsWith('oatmeal-frontend-testing')
  || window.location.hostname.startsWith('oatmeal-frontend-development')
  || window.location.hostname.startsWith('oatmealfarmnetwork-')
  || window.location.hostname.startsWith('oatsense-frontend-development')
  || window.location.hostname.startsWith('oatsense-frontend-staging')
  || window.location.hostname.startsWith('oatsense-frontend-testing')
  || window.location.hostname.startsWith('oatsense-frontend-usa')
);

// Register the unified service worker (push + offline + bg-sync) on first paint.
// Uses the new /sw.js. The legacy /push-sw.js is left in place so existing
// installations don't break, but the PushNotifications page now also tries
// the new SW first.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // ?v=12 busts the old Cache-Control:immutable cached sw.js — browsers treat
    // the versioned URL as a new registration and fetch it fresh from the server.
    navigator.serviceWorker.register('/sw.js?v=12', { scope: '/' })
      .then(reg => {
        console.log('[OFN] SW registered:', reg.scope);
        // Clean up any stale registration at the old unversioned URL.
        navigator.serviceWorker.getRegistrations().then(regs => {
          regs.forEach(r => {
            if (r !== reg && r.active?.scriptURL.includes('/sw.js') && !r.active.scriptURL.includes('?v=')) {
              r.unregister();
            }
          });
        });
      })
      .catch(err => console.warn('[OFN] SW registration failed:', err));
  });
}

function LoadingScreen() {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {t('main.loading')}
    </div>
  );
}

function NewsFeedPage() {
  const { t } = useTranslation();
  return (
    <AccountLayout allowAnonymous pageTitle={t('main.news_feed')} breadcrumbs={[{ label: t('main.dashboard'), to: '/dashboard' }, { label: t('main.news_feed') }]}>
      <NewsFeed />
    </AccountLayout>
  );
}

function NewsArticlePage() {
  const { t } = useTranslation();
  return (
    <AccountLayout allowAnonymous pageTitle={t('main.news_article')} breadcrumbs={[{ label: t('main.dashboard'), to: '/dashboard' }, { label: t('main.news_feed'), to: '/app/news' }, { label: t('main.article') }]}>
      <ArticleDetail />
    </AccountLayout>
  );
}

// Lazy import so install-prompt JS doesn't bloat the critical bundle.
const InstallPrompt = React.lazy(() => import('./InstallPrompt.jsx'));

// Capture the PWA install prompt as early as possible so the /app landing page
// can offer a one-tap install even when the browser fired the event before the
// page mounted. The page reads window.deferredInstallPrompt and the ready event.
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredInstallPrompt = e;
    window.dispatchEvent(new Event('ofn:installready'));
  });
  window.addEventListener('appinstalled', () => { window.deferredInstallPrompt = null; });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ScrollToTop />
    {/* <Suspense fallback={null}><InstallPrompt /></Suspense> */}
    <LanguageProvider>
    <AccountProvider>
      <Suspense fallback={<LoadingScreen />}>
        {/* On a custom domain every path renders the public site — no OFN chrome, no auth routes */}
        {isCustomDomain ? (
          <Routes>
            <Route path="*" element={<WebsitePublic />} />
          </Routes>
        ) : (
        <AppShell>
        <GlobalBackBar />
        <OfflineIndicator />
        <PrecisionAgOnlyGate />
        <Routes>
          <Route path="/" element={PRECISION_AG_ONLY ? <Navigate to="/dashboard" replace /> : <App />} />
          <Route path="/about" element={<About />} />
          <Route path="/app" element={<AppDownload />} />
          <Route path="/download" element={<AppDownload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<AccountHome />} />
          <Route path="/account/change-type" element={<AccountChangeType />} />
          <Route path="/account/profile" element={<AccountProfile />} />
          <Route path="/account/delete" element={<AccountDelete />} />
          <Route path="/account/subscription" element={<RequireAuth><AccountSubscription /></RequireAuth>} />
          <Route path="/cart" element={<RequireAuth><UnifiedCart /></RequireAuth>} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/accounts/new" element={<AccountNew />} />
          <Route path="/animals" element={<AnimalsHome />} />
          <Route path="/animals/add" element={<AnimalAddWizard />} />
          <Route path="/animals/edit" element={<AnimalEdit />} />
          <Route path="/animals/delete" element={<AnimalDelete />} />
          <Route path="/animals/packages" element={<AnimalPackages />} />
          <Route path="/herd-health" element={<RequireAuth><HerdHealthDashboard /></RequireAuth>} />
          <Route path="/herd-health/events" element={<RequireAuth><HerdHealthEvents /></RequireAuth>} />
          <Route path="/herd-health/vaccinations" element={<RequireAuth><HerdHealthVaccinations /></RequireAuth>} />
          <Route path="/herd-health/treatments" element={<RequireAuth><HerdHealthTreatments /></RequireAuth>} />
          <Route path="/herd-health/vet-visits" element={<RequireAuth><HerdHealthVetVisits /></RequireAuth>} />
          <Route path="/herd-health/medications" element={<RequireAuth><HerdHealthMedications /></RequireAuth>} />
          <Route path="/herd-health/weight" element={<RequireAuth><HerdHealthWeight /></RequireAuth>} />
          <Route path="/herd-health/parasites" element={<RequireAuth><HerdHealthParasites /></RequireAuth>} />
          <Route path="/herd-health/quarantine" element={<RequireAuth><HerdHealthQuarantine /></RequireAuth>} />
          <Route path="/herd-health/mortality" element={<RequireAuth><HerdHealthMortality /></RequireAuth>} />
          <Route path="/herd-health/lab-results" element={<RequireAuth><HerdHealthLabResults /></RequireAuth>} />
          <Route path="/herd-health/biosecurity" element={<RequireAuth><HerdHealthBiosecurity /></RequireAuth>} />
          <Route path="/herd-health/vet-contacts" element={<RequireAuth><HerdHealthVetContacts /></RequireAuth>} />
          <Route path="/herd-health/reproduction" element={<RequireAuth><HerdHealthReproduction /></RequireAuth>} />
          <Route path="/herd-health/reports" element={<RequireAuth><HerdHealthReports /></RequireAuth>} />
          <Route path="/saige" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <SaigePage />} />
          <Route path="/saige/*" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <SaigePage />} />
          <Route path="/cassia" element={<CassiaPage />} />
          <Route path="/saige/companion-planting" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <CompanionPlanting />} />
          <Route path="/saige/crop-names" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <CropNames />} />
          <Route path="/saige/weather-mitigation" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <WeatherMitigation />} />
          <Route path="/saige/region-crops" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <RegionCrops />} />
          <Route path="/saige/soil-challenges" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <SoilChallenges />} />
          <Route path="/saige/pest-detection" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <PestDetection />} />
          <Route path="/saige/price-forecast" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <PriceForecast />} />
          <Route path="/saige/subsidies" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <Subsidies />} />
          <Route path="/saige/insurance" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <Insurance />} />
          <Route path="/saige/push" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <PushNotifications />} />
          <Route path="/saige/profile" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <SaigeProfile />} />
          <Route path="/oatsense" element={<RequireAuth><OatSenseRedirect /></RequireAuth>} />
          <Route path="/oatsense/crop-rotation" element={<RequireAuth><CropRotation /></RequireAuth>} />
          <Route path="/oatsense/notes" element={<RequireAuth><OatSenseNotes /></RequireAuth>} />
          <Route path="/precision-ag/field-journal" element={<RequireAuth><OatSenseNotes /></RequireAuth>} />
          <Route path="/precision-ag/crop-rotation" element={<RequireAuth><CropRotation /></RequireAuth>} />
          <Route path="/precision-ag/water-use" element={<RequireAuth><PrecisionAgWaterUse /></RequireAuth>} />
          <Route path="/chef" element={<ChefDashboard />} />
          <Route path="/precision-ag/fields" element={<RequireAuth><PrecisionAgFields /></RequireAuth>} />
          <Route path="/precision-ag/fields/:fieldId" element={<RequireAuth><PrecisionAgFieldIdRedirect /></RequireAuth>} />
          <Route path="/precision-ag/add" element={<RequireAuth><PrecisionAgAdd /></RequireAuth>} />
          <Route path="/precision-ag/analyses" element={<RequireAuth><PrecisionAgAnalyses /></RequireAuth>} />
          <Route path="/precision-ag/analysis/histograms" element={<RequireAuth><PrecisionAgHistograms /></RequireAuth>} />
          <Route path="/precision-ag/analysis/zoning" element={<RequireAuth><PrecisionAgZoning /></RequireAuth>} />
          <Route path="/precision-ag/analysis/maps" element={<RequireAuth><PrecisionAgMaps /></RequireAuth>} />
          <Route path="/precision-ag/geospatial" element={<RequireAuth><PrecisionAgGeospatialCenter /></RequireAuth>} />
          <Route path="/precision-ag/analysis/crop-status" element={<RequireAuth><PrecisionAgCropStatus /></RequireAuth>} />
          <Route path="/precision-ag/analysis/multi-layer" element={<RequireAuth><PrecisionAgMultiLayer /></RequireAuth>} />
          <Route path="/precision-ag/scouting" element={<RequireAuth><ScoutingRedirect /></RequireAuth>} />
          <Route path="/precision-ag/prescriptions" element={<RequireAuth><PrecisionAgPrescriptions /></RequireAuth>} />
          <Route path="/precision-ag/soil-samples" element={<RequireAuth><PrecisionAgSoilSamples /></RequireAuth>} />
          <Route path="/precision-ag/reports" element={<RequireAuth><PrecisionAgReports /></RequireAuth>} />
          <Route path="/precision-ag/assessment-report" element={<RequireAuth><FieldAssessmentReport /></RequireAuth>} />
          <Route path="/precision-ag/alerts" element={<RequireAuth><PrecisionAgAlerts /></RequireAuth>} />
          <Route path="/precision-ag/gdd" element={<RequireAuth><PrecisionAgGDD /></RequireAuth>} />
          <Route path="/precision-ag/activity-log" element={<RequireAuth><PrecisionAgActivityLog /></RequireAuth>} />
          <Route path="/precision-ag/field-scouting" element={<RequireAuth><PrecisionAgScouting /></RequireAuth>} />
          <Route path="/precision-ag/crop-scan" element={<RequireAuth><PestDetection /></RequireAuth>} />
          <Route path="/precision-ag/irrigation" element={<RequireAuth><PrecisionAgIrrigation /></RequireAuth>} />
          <Route path="/precision-ag/yield-forecast" element={<RequireAuth><PrecisionAgYieldForecast /></RequireAuth>} />
          <Route path="/precision-ag/carbon" element={<RequireAuth><PrecisionAgCarbon /></RequireAuth>} />
          <Route path="/precision-ag/benchmark" element={<RequireAuth><PrecisionAgBenchmark /></RequireAuth>} />
          <Route path="/precision-ag/crop-detection" element={<RequireAuth><CropDetection /></RequireAuth>} />
          <Route path="/precision-ag/visualizations" element={<RequireAuth><VisualizationsDashboard /></RequireAuth>} />
          <Route path="/precision-ag/visualizations/crop-analysis-summary" element={<RequireAuth><CropAnalysisSummary /></RequireAuth>} />
          <Route path="/precision-ag/statistics" element={<RequireAuth><PrecisionAgStatistics /></RequireAuth>} />
          <Route path="/website/builder" element={<RequireAuth><WebsiteBuilder /></RequireAuth>} />
          <Route path="/account/audio-settings" element={<AudioSettings />} />
          <Route path="/account/settings" element={<RequireAuth><AccountSettings /></RequireAuth>} />
          <Route path="/account/associations" element={<RequireAuth><AccountAssociations /></RequireAuth>} />
          <Route path="/account/team" element={<RequireAuth><AccountTeamMembers /></RequireAuth>} />
          <Route path="/sites/:slug" element={<WebsitePublic />} />
          <Route path="/knowledgebases" element={<Knowledgebases />} />
          <Route path="/plant-knowledgebase" element={<PlantKnowledgebase />} />
          <Route path="/plant-knowledgebase/varietals/:plantId" element={<PlantVarietals />} />
          <Route path="/plant-knowledgebase/varietal-detail/:varietyId" element={<PlantVarietalDetail />} />
          <Route path="/plant-knowledgebase/:category" element={<PlantCategory />} />
          <Route path="/livestock" element={<LivestockDB />} />
          <Route path="/livestock/:species/about" element={<LivestockAbout />} />
          <Route path="/livestock/:species/breed/:breedId" element={<LivestockBreed />} />
          <Route path="/livestock/:species" element={<LivestockSpecies />} />
          <Route path="/ingredient-knowledgebase" element={<IngredientKnowledgebase />} />
          <Route path="/ingredient-knowledgebase/:category/varieties/:ingredientId" element={<IngredientVarieties />} />
          <Route path="/ingredient-knowledgebase/:category" element={<IngredientCategory />} />
          <Route path="/directory" element={<DirectoryList />} />
          <Route path="/directory/:directoryType" element={<DirectoryDetail />} />
          <Route path="/profile" element={<OrgProfile />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/contact-us/confirm" element={<ContactUsConfirm />} />
          <Route path="/produce/inventory" element={<ProduceInventory />} />
          <Route path="/produce/processed-food" element={<ProcessedFoodInventory />} />
          <Route path="/services" element={<ServicesHome />} />
          <Route path="/services/add" element={<ServicesAdd />} />
          <Route path="/services/suggest-category" element={<ServicesSuggestCategory />} />
          <Route path="/services/edit" element={<ServicesEdit />} />
          <Route path="/services/public/:servicesId" element={<ServiceDetail />} />
          <Route path="/services/directory/:categoryId" element={<ServicesDirectory />} />
          <Route path="/services/directory" element={<ServicesDirectory />} />
          {/* Platform services — OFN's own AI agents and offerings */}
          <Route path="/platform" element={<ServicesHome />} />
          <Route path="/platform/saige" element={PRECISION_AG_ONLY ? <SaigeComingSoon /> : <AboutSaige />} />
          <Route path="/platform/rosemarie" element={<AboutRosemarie />} />
          <Route path="/platform/pairsley" element={<AboutPairsley />} />
          <Route path="/platform/thaiyme" element={<AboutThaiyme />} />
          <Route path="/recipes" element={<RecipeManager />} />
          <Route path="/batches" element={<BatchTracker />} />
          <Route path="/platform/precision-ag" element={<AboutPrecisionAg />} />
          <Route path="/agriculture-support" element={<AboutAgSupport />} />
          <Route path="/ai-agents" element={<AboutAIAgents />} />
          <Route path="/chef-pantry" element={<AboutChefPantry />} />
          <Route path="/event-registration" element={<AboutEventRegistration />} />
          <Route path="/for-farms" element={<ForBusinessPage type="farms" />} />
          <Route path="/for-ranches" element={<ForBusinessPage type="ranches" />} />
          <Route path="/for-artisan-producers" element={<ForBusinessPage type="artisan-producers" />} />
          <Route path="/for-restaurants" element={<ForBusinessPage type="restaurants" />} />
          <Route path="/platform/website-builder" element={<AboutWebsiteBuilder />} />
          <Route path="/website-builder" element={<AboutWebsiteBuilder />} />
          <Route path="/platform/marketplace" element={<AboutMarketplace />} />
          <Route path="/platform/marketplaces" element={<AboutMarketplaces />} />
          <Route path="/esg-dashboard" element={<ESGDashboard />} />
          <Route path="/platform/events" element={<AboutEvents />} />
          <Route path="/platform/crop-monitor" element={<AboutCropMonitor />} />
          <Route path="/platform/directory" element={<AboutDirectory />} />
          <Route path="/platform/livestock-marketplace" element={<AboutLivestockMarketplace />} />
          <Route path="/platform/livestock-herd-health" element={<AboutLivestockHerdHealth />} />
          <Route path="/platform/products-storefront" element={<AboutProductsStorefront />} />
          <Route path="/platform/csa" element={<AboutCSA />} />
          <Route path="/platform/aggregator" element={<AboutAggregator />} />
          <Route path="/platform/jobs" element={<AboutJobBoard />} />
          <Route path="/platform/land-leasing" element={<AboutLandLeasing />} />
          <Route path="/platform/certifications-tracker" element={<AboutCertificationsTracker />} />
          <Route path="/platform/grants" element={<AboutGrants />} />
          <Route path="/platform/community" element={<AboutCommunity />} />
          <Route path="/platform/blog" element={<AboutBlog />} />
          <Route path="/platform/accounting" element={<AboutAccounting />} />

          {/* Events routes — specific before generic */}
          <Route path="/account/events" element={<AccountEventsRedirect />} />
          <Route path="/events/manage" element={<EventsManage />} />
          <Route path="/events/add" element={<EventAdd />} />
          <Route path="/events/add/details" element={<EventAddDetails />} />
          <Route path="/events/my-registrations" element={<EventsMyRegistrations />} />
          <Route path="/events/:eventId/admin/fiber-arts" element={<FiberArtsAdmin />} />
          <Route path="/events/:eventId/register/fiber-arts" element={<FiberArtsRegister />} />
          <Route path="/events/:eventId/admin/fleece" element={<FleeceAdmin />} />
          <Route path="/events/:eventId/register/fleece" element={<FleeceRegister />} />
          <Route path="/events/:eventId/admin/spinoff" element={<SpinOffAdmin />} />
          <Route path="/events/:eventId/register/spinoff" element={<SpinOffRegister />} />
          <Route path="/events/:eventId/admin/halter" element={<HalterAdmin />} />
          <Route path="/events/:eventId/register/halter" element={<HalterRegister />} />
          <Route path="/events/:eventId/admin/auction" element={<AuctionAdmin />} />
          <Route path="/events/:eventId/auction" element={<AuctionBrowse />} />
          <Route path="/events/:eventId/admin/vendor-fair" element={<VendorFairAdmin />} />
          <Route path="/events/:eventId/vendor-apply" element={<VendorFairApply />} />
          <Route path="/events/:eventId/admin/sponsorship" element={<SponsorshipAdmin />} />
          <Route path="/events/:eventId/leads" element={<EventLeadRetrieval />} />
          <Route path="/events/:eventId/admin/floor-plan" element={<FloorPlanAdmin />} />
          <Route path="/events/:eventId/floor-plan" element={<FloorPlanPublic />} />
          <Route path="/events/:eventId/admin/booth-services" element={<BoothServicesAdmin />} />
          <Route path="/events/:eventId/admin/coi" element={<EventCOIAdmin />} />

          {/* Food Aggregation — gated by on('food_aggregation') in the sidebar */}
          <Route path="/aggregator"           element={<AggregatorHub />} />
          <Route path="/aggregator/farms"     element={<AggregatorFarms />} />
          <Route path="/aggregator/produce"   element={<AggregatorProduce />} />
          <Route path="/aggregator/logistics" element={<AggregatorLogistics />} />
          <Route path="/aggregator/sales"     element={<AggregatorSales />} />
          <Route path="/aggregator/esg"       element={<AggregatorESG />} />
          <Route path="/events/:eventId/admin/dining" element={<DiningAdmin />} />
          <Route path="/events/:eventId/dining" element={<DiningRegister />} />
          <Route path="/events/:eventId/admin/tour" element={<FarmTourAdmin />} />
          <Route path="/events/:eventId/tour" element={<FarmTourRegister />} />
          <Route path="/events/:eventId/admin/simple" element={<SimpleEventAdmin />} />
          <Route path="/events/:eventId/rsvp" element={<SimpleEventRegister />} />
          <Route path="/events/:eventId/admin/conference" element={<ConferenceAdmin />} />
          <Route path="/events/:eventId/conference" element={<ConferenceRegister />} />
          <Route path="/events/:eventId/admin/competition" element={<CompetitionAdmin />} />
          <Route path="/events/:eventId/compete" element={<CompetitionRegister />} />
          <Route path="/events/:eventId/agenda" element={<ConferenceAgenda />} />
          <Route path="/events/:eventId/leaderboard" element={<CompetitionLeaderboard />} />
          <Route path="/judge/:accessCode" element={<JudgePortal />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/events/:eventId/checkin" element={<EventCheckIn />} />
          <Route path="/events/:eventId/certificate" element={<EventCertificate />} />
          <Route path="/events/:eventId/broadcast" element={<EventBroadcast />} />
          <Route path="/events/:eventId/analytics" element={<EventAnalytics />} />
          <Route path="/events/analytics" element={<EventAnalytics />} />
          <Route path="/events/:eventId/dashboard" element={<EventAdminDashboard />} />
          <Route path="/admin/events/features" element={<EventFeaturesAdmin />} />
          <Route path="/events/:eventId/clone" element={<EventClone />} />
          <Route path="/speaker/:accessCode" element={<SpeakerPortal />} />
          <Route path="/events/:eventId/register/wizard" element={<EventRegisterWizard />} />
          <Route path="/events/:eventId/admin/registrations" element={<EventRegistrationsAdmin />} />
          <Route path="/events/:eventId/admin/meals" element={<EventMealsAdmin />} />
          <Route path="/events/:eventId/admin/exports" element={<EventExportsHub />} />
          <Route path="/events/:eventId/admin/mailing-list" element={<EventMailingListAdmin />} />
          <Route path="/events/:eventId/admin/promo-codes" element={<PromoCodesAdmin />} />
          <Route path="/events/:eventId/admin/waitlist" element={<WaitlistAdmin />} />
          <Route path="/events/:eventId/admin/abandoned-carts" element={<AbandonedCartsAdmin />} />
          <Route path="/events/:eventId/admin/print" element={<EventPrintHub />} />
          <Route path="/events/:eventId/admin/print/nametags" element={<EventPrintNametags />} />
          <Route path="/events/:eventId/admin/print/barn-cards" element={<EventPrintBarnCards />} />
          <Route path="/events/:eventId/admin/print/class-sheets" element={<EventPrintClassSheets />} />
          <Route path="/events/cart/:cartId/receipt" element={<EventCartReceipt />} />
          <Route path="/events/:eventId/register" element={<EventRegister />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/events" element={<EventsList />} />

          <Route path="/testimonials/manage" element={<TestimonialsManage />} />
          <Route path="/testimonials/request" element={<TestimonialsRequest />} />

          {/* "Sourced From" provenance card — printable for menus, table tents, social */}
          <Route path="/provenance/:businessId" element={<ProvenanceCard />} />

          {/* Restaurant buyer's saved-farm list */}
          <Route path="/restaurant/farms" element={<RequireAuth><RestaurantSavedFarms /></RequireAuth>} />
          <Route path="/restaurant/standing-orders" element={<RequireAuth><RestaurantStandingOrders /></RequireAuth>} />
          <Route path="/farm/standing-orders" element={<RequireAuth><FarmStandingOrders /></RequireAuth>} />
          <Route path="/restaurant/digest" element={<RequireAuth><RestaurantDigest /></RequireAuth>} />
          <Route path="/account/stripe-connect" element={<RequireAuth><SellerStripeConnect /></RequireAuth>} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Marketplace routes — specific before generic */}
          <Route path="/marketplaces/equipment/:listingId" element={<EquipmentListingDetail />} />
          <Route path="/marketplaces/equipment" element={<EquipmentMarketplace />} />
          <Route path="/marketplaces/real-estate" element={<RealEstateMarketplace />} />
          <Route path="/equipment/my-listings" element={<RequireAuth><MyEquipmentListings /></RequireAuth>} />
          <Route path="/platform/equipment-marketplace" element={<AboutEquipmentMarketplace />} />
          <Route path="/marketplaces/food-wanted/:adId" element={<FoodWantedAdDetail />} />
          <Route path="/marketplaces/food-wanted" element={<FoodWantedBoard />} />
          <Route path="/food-wanted/my-ads" element={<RequireAuth><MyFoodWantedAds /></RequireAuth>} />

          {/* Job Board */}
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/my-listings" element={<RequireAuth><MyJobListings /></RequireAuth>} />

          {/* CSA Management */}
          <Route path="/csa" element={<CSABrowse />} />
          <Route path="/csa/manage" element={<RequireAuth><CSAManage /></RequireAuth>} />

          {/* CSA Advanced */}
          <Route path="/csa-advanced" element={<RequireAuth><CSAAdvanced /></RequireAuth>} />

          {/* Land Leasing */}
          <Route path="/land" element={<LandLeasing />} />
          <Route path="/land/my-listings" element={<RequireAuth><MyLandListings /></RequireAuth>} />

          {/* Cold Chain & Logistics */}
          <Route path="/cold-chain" element={<RequireAuth><ColdChain /></RequireAuth>} />

          {/* Farmer Settlement */}
          <Route path="/farmer-settlement" element={<RequireAuth><FarmerSettlement /></RequireAuth>} />

          {/* HR & Workforce Management */}
          <Route path="/hr" element={<RequireAuth><HRDashboard /></RequireAuth>} />

          {/* Farm Inputs & Chemical Inventory */}
          <Route path="/farm-inputs" element={<RequireAuth><FarmInputInventory /></RequireAuth>} />

          {/* Crop Budgeting & Actuals */}
          <Route path="/crop-budget" element={<RequireAuth><CropBudget /></RequireAuth>} />

          {/* Harvest Lot Traceability */}
          <Route path="/harvest-lots" element={<RequireAuth><HarvestLots /></RequireAuth>} />

          {/* Farm Infrastructure & Maintenance */}
          <Route path="/farm-infrastructure" element={<RequireAuth><FarmInfrastructure /></RequireAuth>} />

          {/* Farm KPI Dashboard & Alerts */}
          <Route path="/farm-kpi" element={<RequireAuth><FarmKPIDashboard /></RequireAuth>} />

          {/* Nursery & Early Growth */}
          <Route path="/nursery" element={<RequireAuth><Nursery /></RequireAuth>} />

          {/* Contract Farming / Outgrower Management */}
          <Route path="/outgrower" element={<RequireAuth><Outgrower /></RequireAuth>} />

          {/* Purchase & Procurement */}
          <Route path="/procurement" element={<RequireAuth><Procurement /></RequireAuth>} />

          {/* Work Orders & Field Crews */}
          <Route path="/work-orders" element={<RequireAuth><WorkOrders /></RequireAuth>} />

          {/* Packhouse & QC Inspection */}
          <Route path="/packhouse" element={<RequireAuth><PackhouseQC /></RequireAuth>} />

          {/* Plant Tagging & Asset Geo */}
          <Route path="/plant-tags" element={<RequireAuth><PlantTagging /></RequireAuth>} />

          {/* Export Compliance & Traceability */}
          <Route path="/export-compliance" element={<RequireAuth><ExportCompliance /></RequireAuth>} />

          {/* Supplier Scorecard */}
          <Route path="/supplier-scorecard" element={<RequireAuth><SupplierScorecard /></RequireAuth>} />

          {/* AgriERP Mobile Field Shell */}
          <Route path="/agri-erp/mobile" element={<RequireAuth><AgriERPMobile /></RequireAuth>} />

          {/* Roles & Permissions */}
          <Route path="/permissions" element={<RequireAuth><Permissions /></RequireAuth>} />

          {/* Picker Performance Tracking */}
          <Route path="/picker-performance" element={<RequireAuth><PickerPerformance /></RequireAuth>} />

          {/* IoT Greenhouse Monitoring */}
          <Route path="/iot-greenhouse" element={<RequireAuth><IoTGreenhouse /></RequireAuth>} />

          {/* Perishable Traceability */}
          <Route path="/perishable-trace" element={<RequireAuth><PerishableTrace /></RequireAuth>} />

          {/* Chilling Hour & Bloom Forecast */}
          <Route path="/chilling-hours" element={<RequireAuth><ChillingHours /></RequireAuth>} />

          {/* Grain Bin & Silo Monitoring */}
          <Route path="/grain-bin" element={<RequireAuth><GrainBinMonitor /></RequireAuth>} />

          {/* Scale Tickets & Contract Reconciliation */}
          <Route path="/scale-tickets" element={<RequireAuth><ScaleTickets /></RequireAuth>} />

          {/* Bin-Level Harvest Traceability */}
          <Route path="/harvest-bins" element={<RequireAuth><HarvestBins /></RequireAuth>} />

          {/* CA Cold Storage Management */}
          <Route path="/ca-storage" element={<RequireAuth><CAStorage /></RequireAuth>} />

          {/* Spray & Chemical Application Log */}
          <Route path="/spray-applications" element={<RequireAuth><SprayApplicationLog /></RequireAuth>} />

          {/* Pest & Disease Scouting Log */}
          <Route path="/scouting" element={<RequireAuth><ScoutingLog /></RequireAuth>} />

          {/* Irrigation & Water Management */}
          <Route path="/irrigation" element={<RequireAuth><IrrigationManager /></RequireAuth>} />

          {/* Equipment Maintenance Tracker */}
          <Route path="/equipment-maint" element={<RequireAuth><EquipmentMaintenance /></RequireAuth>} />

          {/* Soil Test Records */}
          <Route path="/soil-tests" element={<RequireAuth><SoilTestRecords /></RequireAuth>} />

          {/* Cash Flow Forecasting */}
          <Route path="/cash-flow" element={<RequireAuth><CashFlowForecast /></RequireAuth>} />

          {/* Field Activity Journal */}
          <Route path="/field-activity" element={<RequireAuth><FieldActivityJournal /></RequireAuth>} />

          {/* Yield & Production Records */}
          <Route path="/yield-records" element={<RequireAuth><YieldRecords /></RequireAuth>} />

          {/* Report & Export Center */}
          <Route path="/reports" element={<RequireAuth><ReportCenter /></RequireAuth>} />

          {/* Field Health Dashboard */}
          <Route path="/field-health" element={<RequireAuth><FieldHealthDashboard /></RequireAuth>} />

          {/* Nutrient Management */}
          <Route path="/nutrients" element={<RequireAuth><NutrientManagement /></RequireAuth>} />

          {/* Farm P&L Dashboard */}
          <Route path="/farm-pl" element={<RequireAuth><FarmPL /></RequireAuth>} />

          {/* Document Vault */}
          <Route path="/documents" element={<RequireAuth><DocumentVault /></RequireAuth>} />

          {/* Weather & Climate Dashboard */}
          <Route path="/weather" element={<RequireAuth><WeatherDashboard /></RequireAuth>} />

          {/* Crop Planning Calendar */}
          <Route path="/crop-planning" element={<RequireAuth><CropPlanner /></RequireAuth>} />

          {/* Seed & Variety Management */}
          <Route path="/seeds" element={<RequireAuth><SeedVarieties /></RequireAuth>} />

          {/* Farm Safety & Incident Log */}
          <Route path="/farm-safety" element={<RequireAuth><FarmSafety /></RequireAuth>} />

          {/* Buyer & Customer CRM */}
          <Route path="/buyer-crm" element={<RequireAuth><BuyerCRM /></RequireAuth>} />

          {/* Compliance & Audit Manager */}
          <Route path="/compliance" element={<RequireAuth><ComplianceAudit /></RequireAuth>} />

          {/* Harvest Scheduling & Labor Planner */}
          <Route path="/harvest-schedule" element={<RequireAuth><HarvestSchedule /></RequireAuth>} />

          {/* Price List & Quote Builder */}
          <Route path="/price-list" element={<RequireAuth><PriceList /></RequireAuth>} />

          {/* Farm Stand & Market POS */}
          <Route path="/farm-stand" element={<RequireAuth><FarmStand /></RequireAuth>} />

          {/* Delivery Route Planner */}
          <Route path="/delivery-routes" element={<RequireAuth><DeliveryRoutes /></RequireAuth>} />

          {/* Meetings & Cooperative Tools */}
          <Route path="/meetings" element={<RequireAuth><Meetings /></RequireAuth>} />

          {/* Agronomist Consultation Log */}
          <Route path="/agro-consult" element={<RequireAuth><AgroConsultations /></RequireAuth>} />

          {/* Enterprise Supply Chain Intelligence (ESCI) */}
          <Route path="/supply-chain" element={<RequireAuth><SupplyChainHub /></RequireAuth>} />
          <Route path="/supply-chain/visibility" element={<RequireAuth><SupplyChainVisibility /></RequireAuth>} />
          <Route path="/supply-chain/quality" element={<RequireAuth><SupplyChainQuality /></RequireAuth>} />
          <Route path="/supply-chain/margin" element={<RequireAuth><SupplyChainMargin /></RequireAuth>} />
          <Route path="/supply-chain/forecasting" element={<RequireAuth><SupplyChainForecasting /></RequireAuth>} />
          <Route path="/supply-chain/exceptions" element={<RequireAuth><SupplyChainExceptions /></RequireAuth>} />
          <Route path="/supply-chain/settings" element={<RequireAuth><SupplyChainSettings /></RequireAuth>} />
          <Route path="/supply-chain/scorecard" element={<RequireAuth><SupplyChainScorecard /></RequireAuth>} />
          <Route path="/supply-chain/control-tower" element={<RequireAuth><SupplyChainControlTower /></RequireAuth>} />
          <Route path="/supply-chain/portal/:token" element={<SupplyChainSupplierPortal />} />

          {/* Certifications */}
          <Route path="/certifications" element={<RequireAuth><CertificationsTracker /></RequireAuth>} />

          {/* Supplier Directory */}
          <Route path="/suppliers" element={<SupplierDirectory />} />

          {/* Grant & Program Tracker */}
          <Route path="/grants" element={<GrantTracker />} />

          {/* Commodity Prices */}
          <Route path="/commodity-prices" element={<CommodityPrices />} />

          {/* Education Center */}
          <Route path="/education" element={<EducationCenter />} />

          {/* Discussion Forums — live inside Over The Fence */}
          <Route path="/over-the-fence/forums" element={<ForumCategories />} />
          <Route path="/over-the-fence/forums/:categoryId" element={<ForumThreads />} />
          <Route path="/over-the-fence/forums/thread/:threadId" element={<ForumThread />} />
          <Route path="/marketplaces/farm-to-table" element={<FarmToTableMarketplace />} />
          <Route path="/marketplaces/livestock/animal/:id/progeny" element={<LivestockAnimalProgeny />} />
          <Route path="/marketplaces/livestock/animal/:id" element={<LivestockAnimalDetail />} />
          <Route path="/marketplaces/livestock/ranch/:businessId" element={<OrgProfile />} />
          <Route path="/marketplaces/livestock/ranches/:slug" element={<RanchList />} />
          <Route path="/marketplaces/livestock/studs/:slug" element={<LivestockForSale />} />
          <Route path="/marketplaces/livestock/:slug" element={<LivestockForSale />} />
          <Route path="/marketplaces/livestock" element={<LivestockMarketplace />} />
          <Route path="/marketplaces" element={<LivestockMarketplace />} />
          {/* Legacy ASP redirect */}
          <Route path="/livestockmarketplace/Animals/Details.asp" element={<LegacyAnimalRedirect />} />
          <Route path="/produce/meat" element={<MeatInventory />} />
          <Route path="/news" element={<OFNComingSoon />} />
          <Route path="/over-the-fence" element={<OverTheFenceDM />} />
          <Route path="/app/news" element={<NewsFeedPage />} />
          <Route path="/app/news/:id" element={<NewsArticlePage />} />
          <Route path="/blog/authors/manage" element={<BlogAuthors />} />
          <Route path="/blog/authors/:authorId" element={<BlogAuthorDetail />} />
          <Route path="/blog/manage" element={<BlogManage />} />
          <Route path="/blog/:postId" element={<BlogDetail />} />
          <Route path="/blog" element={<BlogList />} />

          {/* Public marketplace (anyone can browse) */}
          <Route path="/marketplace" element={<Navigate to="/marketplaces/farm-to-table" replace />} />
          <Route path="/marketplace/products/:id" element={<ProductDetail />} />
          <Route path="/marketplace/products" element={<ProductsMarketplace />} />
          <Route path="/marketplace/:id" element={<MarketplaceProduct />} />

          {/* Seller product management (login required) */}
          <Route path="/products" element={<RequireAuth><ProductsInventory /></RequireAuth>} />
          <Route path="/products/add" element={<RequireAuth><ProductEdit /></RequireAuth>} />
          <Route path="/products/edit/:prodId" element={<RequireAuth><ProductEdit /></RequireAuth>} />

          {/* Buyer pages (login required) — /cart is the unified cart, registered above */}
          <Route path="/marketplaces/cart" element={<MarketplaceCart />} />
          <Route path="/orders" element={<MarketplaceOrders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />

          {/* Seller pages (in AccountLayout) */}
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/listings" element={<SellerListings />} />

          {/* Accounting */}
          <Route path="/accounting" element={<RequireAuth><Accounting /></RequireAuth>} />

          {/* Properties */}
          <Route path="/properties" element={<RequireAuth><Properties /></RequireAuth>} />
          <Route path="/properties/add" element={<RequireAuth><Properties /></RequireAuth>} />


        </Routes>
        <SaigeWidgetGlobal />
        </AppShell>
        )} {/* end isCustomDomain ternary */}
      </Suspense>
    </AccountProvider>
    </LanguageProvider>
  </BrowserRouter>
)