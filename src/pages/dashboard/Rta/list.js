import { Helmet } from "react-helmet-async";
import RtaListView from "src/sections/registrar-and-transfer-agents/view/rta-list-view";



export default function RtaListPage(){
    return(
        <>
        <Helmet>
            <title>Dashboard : RTA List view</title>
        </Helmet>
 <RtaListView/>
        </>
    )
}