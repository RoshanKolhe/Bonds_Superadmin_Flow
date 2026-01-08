import { Helmet } from "react-helmet-async";
import CreditRatingView from "src/sections/credit-rating/view/appointed-credit-rating-view";

export default function CreditRatingViewPage(){
    return(
        <>
        <Helmet>
            <title>Dashboard : Credit Rating View</title>
        </Helmet>
        <CreditRatingView/>
        </>
    )
}