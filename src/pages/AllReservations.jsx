import { DataGrid } from "@mui/x-data-grid";
import { getReservations } from "../controllers/reservations";
import { useLoaderData } from "react-router-dom";

async function loader() {
    const reservations = await getReservations();
    return reservations;
}

export default function AllReservations() {
    const reservations = useLoaderData();


    return (
        <>

        </>
    )
}

AllReservations.loader = loader;