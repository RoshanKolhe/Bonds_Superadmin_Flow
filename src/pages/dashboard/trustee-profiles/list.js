import { Helmet } from 'react-helmet-async';
import TrusteeProfileListView from 'src/sections/trustee-profiles/view/trustee-profiles-list-view';

// sections


// ----------------------------------------------------------------------

export default function TrusteeProfileListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Trustee Profiles List</title>
      </Helmet>

      <TrusteeProfileListView />
    </>
  );
}
