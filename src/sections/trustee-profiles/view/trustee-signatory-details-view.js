import { Container } from '@mui/system';
import { useLocation, useParams } from 'react-router-dom';
import SignatoriesDetails from '../trustee-signatory-details';

export default function SignatoiresDetailsView() {
  const { id } = useParams();
  const { state } = useLocation();

  console.log("📌 Received Signatory Data:", state);



  return (
    <Container>
      <SignatoriesDetails currentUser={state?.signatoryData}
        isViewMode={true}
        isEditMode={false} />
    </Container>
  );
}
