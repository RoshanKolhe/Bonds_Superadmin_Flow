import { Helmet } from 'react-helmet-async';
import CompanyBankDetails from 'src/sections/company-profiles/company-bank-details';


// sections


// ----------------------------------------------------------------------

export default function CompanyProfileNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Company Profiles List</title>
      </Helmet>

      <CompanyBankDetails />
    </>
  );
}
