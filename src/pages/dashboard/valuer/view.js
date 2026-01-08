import { Helmet } from "react-helmet-async";
import AppointedValuerView from "src/sections/valuer/view/appointed-valuer-view";

export default function ValuerViewPage(){
    return(
    <>
    <Helmet>
        <title>Dashboard: Appointed Valuer View</title>
    </Helmet>
    <AppointedValuerView/>
    </>)
}