// Maps an event's EventType to its dedicated admin module route.
// Route paths are relative to `/events/:eventId/`.
// Returns { path, label } or null if the type has no dedicated admin module.

const SIMPLE_TYPES = [
  'Seminar', 'Free Event', 'Basic Event',
  'Workshop/Clinic', 'Webinar/Online Class', 'Networking Event',
];

const TYPE_MAP = {
  'Alpaca Cottage Industry Fleece Show': { path: 'admin/fiber-arts',  label: 'Fiber Arts Admin' },
  'Basic Animal or Fleece Show':         { path: 'admin/fleece',      label: 'Fleece Show Admin' },
  'Spin-Off':                            { path: 'admin/spinoff',     label: 'Spin-Off Admin' },
  'Halter Show':                         { path: 'admin/halter',      label: 'Halter Show Admin' },
  'Auction':                             { path: 'admin/auction',     label: 'Auction Admin' },
  'Market/Vendor Fair':                  { path: 'admin/vendor-fair', label: 'Vendor Fair Admin' },
  'Dining Event':                        { path: 'admin/dining',      label: 'Dining Admin' },
  'Farm Tour/Open House':                { path: 'admin/tour',        label: 'Farm Tour Admin' },
  'Conference':                          { path: 'admin/conference',  label: 'Conference Admin' },
  'Competition/Judging':                 { path: 'admin/competition', label: 'Competition Admin' },
};

export function typeAdminModule(evType) {
  if (!evType) return null;
  if (TYPE_MAP[evType]) return TYPE_MAP[evType];
  if (SIMPLE_TYPES.includes(evType)) return { path: 'admin/simple', label: `${evType} Admin` };
  return null;
}
