import { Helmet } from 'react-helmet-async';

import { DocumentCreateView } from 'src/sections/document/view';

// sections


// ----------------------------------------------------------------------

export default function NewDocumentPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create  Document</title>
      </Helmet>

      <DocumentCreateView/>
    </>
  );
}
