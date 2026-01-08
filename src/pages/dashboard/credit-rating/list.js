import { Helmet } from "react-helmet-async";
import { CreditRatingListView } from "src/sections/credit-rating/view";

export default function CredtingRatingListPage(){
    return(
        <>
        <Helmet>
            <title>Dashboard : Credting rating list view</title>
        </Helmet>
        <CreditRatingListView/>
        </>
    )
}