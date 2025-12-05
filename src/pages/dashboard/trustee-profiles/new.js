import { Helmet } from 'react-helmet-async';
import KYCBankDetails from 'src/sections/trustee-profiles/kyc-bank-details';

// sections


// ----------------------------------------------------------------------

export default function TrusteeProfileNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Trustee Profiles New</title>
      </Helmet>

      <KYCBankDetails />
    </>
  );
}
