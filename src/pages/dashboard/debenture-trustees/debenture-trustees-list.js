import { Helmet } from 'react-helmet-async';
import CreateNewTrusteeDocumentDraftNewEditDetails from 'src/sections/debenture-trustees-list/debenture-trustee-draft-new-edit-form';
// sections


import { DebentureTrusteesListView } from 'src/sections/debenture-trustees-list/view';

// ----------------------------------------------------------------------

export default function DebentureTrusteesListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Debenture Trustees List</title>
      </Helmet>

      {/* <MainFile /> */}
      {/* <StepFour />
      <RoiStepper /> */} 
      <DebentureTrusteesListView/>
       {/* <CreateNewTrusteeDocumentDraftNewEditDetails/>  */}
    </>
  );
}
