import { Helmet } from "react-helmet-async";
import AppointedRtaView from "src/sections/registrar-and-transfer-agents/view/appointed-rta-view";

export default function RtaViewPage(){

    return(
        <>
        <Helmet>
            <title>Dashboard: Rta view</title>
        </Helmet>
        <AppointedRtaView/>
        </>
    )
}