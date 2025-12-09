import { Helmet } from 'react-helmet-async';
import DebentureTrusteeEditView from 'src/sections/debenture-trustees-list/view/debenture-trustee-edit-view';


// ----------------------------------------------------------------------

export default function DebentureTrusteeEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Dashboard: Job Edit</title>
      </Helmet>

      <DebentureTrusteeEditView />
    </>
  );
}
