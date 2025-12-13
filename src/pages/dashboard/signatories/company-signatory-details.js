import { Helmet } from 'react-helmet-async';
import { CompanySignatoiresDetailsView } from 'src/sections/company-profiles/view';
// sections


// ----------------------------------------------------------------------

export default function CompanySignatoryDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Analytics</title>
      </Helmet>
      <CompanySignatoiresDetailsView/>
    </>
  );
}
