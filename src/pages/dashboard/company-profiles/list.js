import { Helmet } from 'react-helmet-async';
import { CompanyProfileListView } from 'src/sections/company-profiles/view';

// sections


// ----------------------------------------------------------------------

export default function CompanyProfileListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Company Profiles List</title>
      </Helmet>

      <CompanyProfileListView />
    </>
  );
}
