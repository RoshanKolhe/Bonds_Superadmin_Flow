import { Helmet } from 'react-helmet-async';
import { AccountView } from 'src/sections/account/view';
import CompanyProfilesDetailsView from 'src/sections/company-profiles/view/company-profiles-details-view';
// sections



// ----------------------------------------------------------------------

export default function CompanyProfliesDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Details </title>
      </Helmet>

      {/* <UserProfileView /> */}
     <CompanyProfilesDetailsView/>
    </>
  );
}
