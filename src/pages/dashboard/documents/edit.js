import { Helmet } from 'react-helmet-async';
import { DocumentEditView } from 'src/sections/document/view';


// ----------------------------------------------------------------------

export default function DocumentEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Dashboard: Job Edit</title>
      </Helmet>

      <DocumentEditView />
    </>
  );
}
