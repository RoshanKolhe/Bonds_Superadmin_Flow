import { useGetCreditRatingAgencies } from "src/api/creditRatingsAndAgencies"
import AppointedCreditRatingListView from "./appointed-credit-rating-list-view";
import { useParams } from "src/routes/hook";
import { useGetBondApplications } from "src/api/bondApplications";

export default function CreditRatingView(){

    const params = useParams();

    const {bondApplications}= useGetBondApplications();

    return(
        <>
        <AppointedCreditRatingListView currentCreditRating={bondApplications}/>
        </>
    )
}