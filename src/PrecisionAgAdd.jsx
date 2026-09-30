import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';

// "/precision-ag/add" is linked from AccountNav, AccountHome's "Add Field"
// quick action, and the Crop Monitor marketing page — all of them expect
// landing here to actually let the user add a field. The real add-field flow
// (with crop-detection-assisted soil/crop lookup) lives on the Crop Detection
// page, so redirect straight there instead of showing the plain field list.
export default function PrecisionAgAdd() {
  const [searchParams] = useSearchParams();
  const BusinessID = searchParams.get('BusinessID');
  return (
    <Navigate
      to={`/precision-ag/crop-detection?BusinessID=${BusinessID || ''}&mode=add-field`}
      replace
    />
  );
}