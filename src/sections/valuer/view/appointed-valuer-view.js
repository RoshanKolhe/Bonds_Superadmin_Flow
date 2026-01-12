import { useGetBondApplication, useGetBondApplications } from "src/api/bondApplications";
import AppointedValuerListView from "./appointed-valuer-list-view";
import ValuatorApprovalCard from "../valuer-appointed-card";
import { useParams } from "src/routes/hook";

const VALUERS = [
  {
    id: 'val-1',
    legalEntityName: 'RBSA Valuation Advisors LLP',
    experience: '10+ yrs',
    regulatory: 'IBBI Registered Valuer',
    feeStructure: '₹1.5L – ₹3L per valuation',
    responseTime: '12 hrs',
    pastIssues: '80+ secured bond valuations',
    techCapability: 'Digital valuation reports / Excel models',
    rating: '4.6/5.0',
    chargeCreationSupport: 'Yes',
    headOffice: 'Mumbai',
    contactEmail: 'valuation@rbsa.in',
  },
  {
    id: 'val-2',
    legalEntityName: 'ASA & Associates LLP',
    experience: '14+ yrs',
    regulatory: 'IBBI Registered Valuer',
    feeStructure: '₹2L – ₹4L per valuation',
    responseTime: '24 hrs',
    pastIssues: '100+ infrastructure & NBFC issues',
    techCapability: 'Automated valuation tools',
    rating: '4.5/5.0',
    chargeCreationSupport: 'Yes',
    headOffice: 'Delhi',
    contactEmail: 'valuation@asa.in',
  },
];

export default function AppointedValuerView(){

  const params = useParams();

  const {id , intermediaryType} = params;

  const {bondApplication}= useGetBondApplication(id, intermediaryType);

  console.log("bondApplications", bondApplication)
  

  return(
    <>
    <AppointedValuerListView currentValuer={bondApplication} />
    {/* <ValuatorApprovalCard/> */}
    </>
  )
}