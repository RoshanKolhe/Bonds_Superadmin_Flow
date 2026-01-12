import { useGetCreditRatingAgencies } from "src/api/creditRatingsAndAgencies"
import AppointedCreditRatingListView from "./appointed-credit-rating-list-view";
import { useParams } from "src/routes/hook";
import { useGetBondApplication, useGetBondApplications } from "src/api/bondApplications";

export default function CreditRatingView(){

    const params = useParams();

    const {id , intermediaryType} = params;

    const {bondApplication}= useGetBondApplication(id, intermediaryType);

    return(
        <>
        <AppointedCreditRatingListView currentCreditRating={bondApplication}/>
        </>
    )
}