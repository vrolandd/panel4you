import { ReactElement, useRef, useState, } from "react";
import { Outlet } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { useRipple } from "react-use-ripple";
import { logoDiscord, logoGithub } from 'ionicons/icons'

interface MenuParams {
    Opened: boolean;
    setOpened: (opened: boolean) => void;
}

function Navbar({ Opened, setOpened }: MenuParams): ReactElement {
    const MenuBtnRef = useRef<HTMLDivElement>(null);
    useRipple(MenuBtnRef, {
        rippleColor: window.matchMedia("(prefers-color-scheme: dark)").matches ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
    })

    return (
        <div className="flex justify-center text-black bg-gray-200 dark:bg-zinc-800 dark:text-white h-16 fixed top-0 w-full">
            <div className="max-w-[1448px] px-6 w-full flex items-center select-none">
                <div ref={ MenuBtnRef } onClick={() => setOpened(!Opened)} className="grid grid-rows-3 gap-1 px-3 py-2.5 cursor-pointer rounded-md dark:bg-black/10 border border-black/20 dark:border-black/10">
                    <div className="w-7 h-[3px] bg-current"></div>
                    <div className="w-7 h-[3px] bg-current"></div>
                    <div className="w-7 h-[3px] bg-current"></div>
                </div>

                <h1 className="font-semibold font-Oswald text-2xl ml-3">VPS4you</h1>


                <div className="flex ml-auto gap-1 items-center">
                    <a className="flex" href="https://discord.gg/29qYFMH" target="_blank">
                        <IonIcon className="text-2xl" icon={ logoDiscord }></IonIcon>
                    </a>
                    <a className="flex" href="https://github.com/vrolandd/panel4you" target="_blank">
                        <IonIcon className="text-2xl" icon={ logoGithub }></IonIcon>
                    </a>
                </div>
            </div>
        </div>
    )
}

function LeftMenu({ Opened, setOpened }: MenuParams): ReactElement {
    interface MenuBtnParams {
        IconName: string;
        Url: string;
        Title: string;
    }

    function MenuBtn({ IconName, Title, Url }: MenuBtnParams): ReactElement {
        const Btn = useRef<HTMLButtonElement>(null);
        useRipple(Btn, { rippleColor: 'rgba(20, 220, 140, .4)', rippleSize: 500 });

        return (
            <button ref={ Btn } className="flex items-center px-3.5 border border-white/20 h-16 rounded-xl gap-2.5 bg-black/30 cursor-pointer">
                <IonIcon className="text-3xl" icon={ IconName } />
                <p className="text-xl font-bold text-white text-opacity-70">{ Title }</p>
            </button>
        )
    }   

    return (
        <div className="flex flex-col items-center overflow-hidden text-black bg-gray-200 dark:bg-zinc-800 dark:text-white h-auto shrink-0 border-white/20 transition-all duration-500" style={{ width: Opened ? '374px' : '0' }}>
            <div className="flex flex-col w-[374px] py-3.5 px-3">
                <h2 className="font-semibold font-Oswald text-3xl">Menü</h2>

                <div className="flex flex-col gap-1 mt-4">
                    <MenuBtn IconName="home-outline" Title="Főoldal" Url="/" />
                    <MenuBtn IconName="server-outline" Title="Szolgáltatásaim" Url="/vps" />
                    <MenuBtn IconName="cart-outline" Title="Rendelés" Url="/shop" />
                </div>
            </div>
        </div>
    )
}

function PanelLayout(): ReactElement {
    const [ MenuOpened, setMenuOpened ] = useState<boolean>(true);

    return (
        <div className="flex justify-center h-max overflow-hidden w-full bg-gray-200 dark:bg-zinc-950 min-h-screen">
            <Navbar Opened={ MenuOpened } setOpened={ setMenuOpened }/>


            <div className="flex w-full">
                <LeftMenu Opened={ MenuOpened } setOpened={ setMenuOpened }></LeftMenu>

                <div className="flex w-full shrink-0 mt-16 bg-gray-50 dark:bg-zinc-900">
                    <div className="flex-1 flex items-center shrink w-[1px] overflow-hidden flex-col text-black dark:text-white">
                        <div className="flex flex-col w-screen px-4 pt-2 w400:w-full">
                            <Outlet></Outlet>
                        </div>
                    </div>
                </div>
            </div>
            
            
        </div>
    )
}

export default PanelLayout