import { Helmet } from 'react-helmet-async';
import { DocumentCreateView } from 'src/sections/debenture-trustees-list/view';

// sections


// ----------------------------------------------------------------------

export default function NewDebentureTrusteesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Debenture Trustees</title>
      </Helmet>

      <DocumentCreateView />
    </>
  );
}
