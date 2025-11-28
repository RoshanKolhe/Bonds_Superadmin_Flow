import { Helmet } from 'react-helmet-async';
// sections

import { JobsDetailsView } from 'src/sections/jobList/view';

// ----------------------------------------------------------------------

export default function DebentureTrusteesDocumentDraftPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Document Draf</title>
      </Helmet>

      <JobsDetailsView />
    </>
  );
}
