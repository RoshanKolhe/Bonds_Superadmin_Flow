import { Helmet } from 'react-helmet-async';
import TrusteeProfilesDetailsView from 'src/sections/trustee-profiles/view/trustee-profiles-details-view';
// sections



// ----------------------------------------------------------------------

export default function TrusteeProfliesDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Details </title>
      </Helmet>

      {/* <UserProfileView /> */}
     <TrusteeProfilesDetailsView />
    </>
  );
}
