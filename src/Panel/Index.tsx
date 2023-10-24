import Axios from "../Plugins/Requests";
import { ReactElement, useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";

function PanelIndex(): ReactElement {
    const state = useAuthUser()
    const [ Balance, setBalance ] = useState(0)

    useEffect(() => {
        console.log()
        Axios.Post({
            ...state(),
            action: 'service-list',
            type: 'vps'
        }, {
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        });

        Axios.Post({
            ...state(),
            action: 'user-get-balance',
            currency: 'HUF'
        }).then( a => {
            setBalance(a.data.amount)
        })
    }, [])

    return (
        <>
            <h1 className="text-3xl font-bold text-opacity-70">Üdv, { state()?.email }!</h1>

            <div className="grid grid-cols-1 gap-3 mt-4 max-w-[400px] w-full mx-auto">
                <div className="flex flex-col bg-gradient-to-br from-white/10 to-white/[.11] via-white/[.09] rounded-xl px-3 py-2 border-t border-t-white/[.1]">
                    <h2 className="text-xl font-bold text-white/70">Pénzügyek</h2>
                    
                    <div className="flex flex-col mt-3">
                        <div className="text-2xl font-bold flex items-center"><span className="text-lg font-medium mr-auto">Egyenleg</span><span className="bg-gradient-to-r from-green-400 to-green-700 bg-clip-text text-transparent">{ Balance }Ft</span></div>
                        <div className="text-2xl font-bold flex items-center"><span className="text-lg font-medium mr-auto">Az egyenleg napi alakulása</span><span className="bg-gradient-to-r from-red-400 to-yellow-300 bg-clip-text text-transparent">-37Ft</span></div>
                        <p className="text-end">(Elegendő 10 napra)</p>
                    </div>
                </div>

                <div className="flex flex-col bg-gradient-to-br from-white/10 to-white/[.11] via-white/[.09] rounded-xl px-3 py-2 border-t border-t-white/[.1]">
                    <h2 className="text-xl font-bold text-white/70">Hírek</h2>
                </div>

                <div className="flex flex-col bg-gradient-to-br from-white/10 to-white/[.11] via-white/[.09] rounded-xl px-3 py-2 border-t border-t-white/[.1]">
                    <h2 className="text-xl font-bold text-white/70">Statisztika</h2>
                </div>
            </div>
        </>
    )
}


export default PanelIndex;