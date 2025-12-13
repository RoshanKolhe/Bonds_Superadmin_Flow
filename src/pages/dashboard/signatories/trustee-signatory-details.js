import { Helmet } from 'react-helmet-async';
// sections

import SignatoiresDetailsView from 'src/sections/trustee-profiles/view/trustee-signatory-details-view';

// ----------------------------------------------------------------------

export default function TrusteeSignatoryDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Analytics</title>
      </Helmet>

      <SignatoiresDetailsView />
    </>
  );
}
