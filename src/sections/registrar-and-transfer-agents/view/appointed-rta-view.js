import { useParams } from "src/routes/hook";
import AppointedRtaListView from "./appointed-rta-list-view";
import { useGetBondApplications } from "src/api/bondApplications";
const RTAS = [
  {
    id: 'rta-1',
    legalEntityName: 'Kfin Technologies Ltd',
    experience: '12+ yrs',
    regulatory: 'SEBI Registered',
    feeStructure: '₹2L setup + ₹1L annual',
    responseTime: '2 hrs',
    pastIssues: '60+ secured issues',
    techCapability: 'Digital docs / API / NSDL-CDSL integration',
    rating: '4.7/5.0',
    chargeCreationSupport: 'Yes',
    headOffice: 'Hyderabad',
    contactEmail: 'bonds@kfintech.com',
  },
  {
    id: 'rta-2',
    legalEntityName: 'Link Intime India Pvt Ltd',
    experience: '15+ yrs',
    regulatory: 'SEBI Registered',
    feeStructure: '₹2.5L setup + ₹1.2L annual',
    responseTime: '3 hrs',
    pastIssues: '75+ secured issues',
    techCapability: 'Digital workflows / Investor portal',
    rating: '4.6/5.0',
    chargeCreationSupport: 'Yes',
    headOffice: 'Mumbai',
    contactEmail: 'issuance@linkintime.co.in',
  },
];


export default function AppointedRtaView(){

  const params = useParams();
  const {bondApplications}= useGetBondApplications();

  return(
    <>
    <AppointedRtaListView currentRta={bondApplications}/>
    </>
  )

}