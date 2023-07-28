import axios from "axios";
import { ReactElement, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";

function PanelIndex(): ReactElement {
    const state = useAuthUser()

    useEffect(() => {
        console.log()
        axios.post('https://corsproxy.io/?https://vps4you.hu/api.php', {
            ...state(),
            action: 'service-list',
            type: 'vps'
        }, {
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        });
    }, [])

    return (
        <h1 className="text-4xl font-bold text-opacity-70">Főoldal</h1>
    )
}


export default PanelIndex;