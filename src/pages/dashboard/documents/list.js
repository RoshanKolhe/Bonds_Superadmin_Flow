import { Helmet } from 'react-helmet-async';
// sections


import { DocumentListView } from 'src/sections/document/view';

// ----------------------------------------------------------------------

export default function DocumentListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Document List</title>
      </Helmet>

      {/* <MainFile /> */}
      {/* <StepFour />
      <RoiStepper /> */} 
      <DocumentListView/>
       {/* <CreateNewTrusteeDocumentDraftNewEditDetails/>  */}
    </>
  );
}
