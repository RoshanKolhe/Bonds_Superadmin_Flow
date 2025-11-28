import { Helmet } from 'react-helmet-async';
import DocumentCreateView from 'src/sections/document-drafting/view/document-create-view';
// sections
import { JobCreateView } from 'src/sections/job/view';

// ----------------------------------------------------------------------

export default function NewDocumentPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create New Document</title>
      </Helmet>

      <DocumentCreateView />
    </>
  );
}
