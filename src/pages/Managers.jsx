import { useQuery } from "@tanstack/react-query";
import { getManagers } from "../controllers/users";

export default function Managers() {

    const { data: managers, isLoading, error } = useQuery({
        queryKey: ['managers'],
        queryFn: getManagers,
    });

    return ( 
        <>
        
        </>
    )

}