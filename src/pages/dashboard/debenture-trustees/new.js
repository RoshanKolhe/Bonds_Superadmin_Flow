import { Helmet } from 'react-helmet-async';

import DebentureTrusteeCreateView from 'src/sections/debenture-trustees-list/view/debenture-trustee-create-view';

// sections


// ----------------------------------------------------------------------

export default function NewDebentureTrusteesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Debenture Trustees</title>
      </Helmet>

      <DebentureTrusteeCreateView />
    </>
  );
}
