import { Helmet } from 'react-helmet-async';
import { DocumentEditView } from 'src/sections/document-drafting/view';

// sections


// ----------------------------------------------------------------------

export default function DocumentEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Dashboard:Document Edit</title>
      </Helmet>

      <DocumentEditView />
    </>
  );
}
