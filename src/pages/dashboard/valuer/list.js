import { Helmet } from "react-helmet-async";
import { ValuerListView } from "src/sections/valuer/view";

export default function ValuerListPage(){
    return(
        <>
        <Helmet>
            <title>Dashboard : Valuer List view</title>
        </Helmet>
        <ValuerListView/>
        </>
    )
}