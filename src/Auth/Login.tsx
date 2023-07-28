import { ReactElement, useEffect, useRef, useState } from "react";
import { IonIcon } from "@ionic/react";
import { useSignIn } from 'react-auth-kit'
import Axios from '../Plugins/Requests';
import { useNavigate } from "react-router-dom";

interface ErrorCheckingFn {
    FieldName: string;
    value: string;
}

interface Field {
    FieldTitle: string;
    FieldName: string;
    FieldType: 'text' | 'password';
    Placeholder: string;
    value: string;
    Icon: string;
    ErrorText: ErrorCheckingReturn;
}

type ErrorCheckingReturn = string | null;

function ErrorChecking({ FieldName, value }: ErrorCheckingFn): ErrorCheckingReturn {
    switch (FieldName) {
        case "v4yapitoken":
            if (value.length != 20) {
                return "Nem megfelelő API token (20 karakter)"
            }

            return null;
        case "v4yapimail":
            if (!value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
                return "Nem megfelelő e-mail cím"
            }

            return null;
        default:
            return null;
    }
}

function LoginScreen(): ReactElement {
    const signIn = useSignIn(), nav = useNavigate();

    const [ Error, setError ] = useState<string | null>(null);
    const [ Loading, setLoading ] = useState<boolean>(false);
    const FieldsRef = useRef<Field[]>([
        {
            ErrorText: null,
            FieldTitle: "API Token",
            FieldName: "v4yapitoken",
            FieldType: "password",
            value: "",
            Placeholder: "************",
            Icon: "lock-closed-outline"
        },
        {
            ErrorText: null,
            FieldTitle: "Account email",
            FieldName: "v4yapimail",
            FieldType: "text",
            value: "",
            Placeholder: "pelda@gmail.com",
            Icon: "mail-outline"
        }
    ])

    const [ Fields, setFields ] = useState<Field[]>(FieldsRef.current)

    function InputCheck(el: HTMLInputElement) {
        const InputErr: ErrorCheckingReturn = ErrorChecking({ FieldName: el.name, value: el.value });

        let LFields: Field[] = JSON.parse(JSON.stringify(FieldsRef.current));
        for (let Field of LFields) {
            if (Field.FieldName == el.name) {
                Field.ErrorText = InputErr;

                break;
            }
        }

        FieldsRef.current = LFields;
        setFields(FieldsRef.current)
        return InputErr == null;
    }

    function InputValue(el: HTMLInputElement) {
        let LFields = JSON.parse(JSON.stringify(FieldsRef.current));
        for (let Field of LFields) {
            if (Field.FieldName == el.name) {
                Field.value = el.value;
            }
        }

        FieldsRef.current = LFields;
        setFields(FieldsRef.current)
    }

    async function Authorize() {
        let Checks = [];

        for (let fld of Fields) {
            const el = document.getElementById('input-' + fld.FieldName) as HTMLInputElement;
            
            let Check = InputCheck(el);
            Checks.push(Check);
        }

        if (Checks.includes(false)) return;

        setLoading( true );

        const
        email = Fields.find( i => i.FieldName == "v4yapimail" )?.value,
        apikey = Fields.find( i => i.FieldName == "v4yapitoken" )?.value;


        try {
            const res = await Axios.Post({
                email,
                apikey,
            });

            switch (res.data.error) {
                case "Invalid login":
                    setError("Helytelen bejelentkezési adatok.")
                    break;
                case "Invalid action":
                    setError(null)
                    signIn({
                        token: `${ email }:${ apikey }`,
                        expiresIn: 604800000,
                        tokenType: "Bearer",
                        authState: {
                            email,
                            apikey,
                            json: 1
                        }
                    })
                    
                    nav('/panel')

                    break;
            }
        } catch(e) {
            setError("Hálózati probléma történt.")
        }

        setLoading( false )
    }

    let [ EmptyFields, setEmptyFields ] = useState<number>(Fields.filter( field => field.value.length == 0 ).length)

    useEffect(() => {
        setEmptyFields(Fields.filter( field => field.value.length == 0 ).length);
    }, [ Fields ])

    return (
        <div className="flex flex-col">
            <div className="h-screen flex flex-col items-center" style={{ background: 'url(/background.jpg) no-repeat center/cover' }}>
                <div className={`absolute pointer-events-none transition-all duration-500 -z-1 inset-0`} style={{ background: `rgba(0, 0, 0, 0.${60 * ( EmptyFields / 2 )})` }}></div>
                <form onSubmit={(e) => {e.preventDefault(); Authorize()}} className="rounded-2xl bg-white/60 dark:bg-[#212020]/60 dark:text-white px-5 py-3.5 mt-auto select-none z-20 w-[350px] backdrop-blur-xl border-b border-black/20 flex flex-col">
                    <h1 className="text-3xl font-semibold text-opacity-70 text-black dark:text-white">Azonosítás</h1>

                    {
                        Error != null ? (
                            <p className="bg-red-600 text-white px-3.5 py-1 rounded-md mt-1">{ Error }</p>
                        ) : (<></>)
                    }

                    {
                        Fields.map(Field => (
                            <div className={`flex flex-col relative ${ Loading ? 'opacity-50 pointer-events-none' : 'opacity-100 pointer-events-auto' }`} key={ Field.FieldName }>
                                <span className="leading-none mt-5 text-lg">{ Field.FieldTitle }</span>

                                {
                                    Field.ErrorText != null ? (
                                        <p className="text-red-600 text-sm mt-1">{ Field.ErrorText }</p>
                                    ) : (<></>)
                                }

                                <div className="flex relative mt-1">
                                    <IonIcon icon={ Field.Icon } className="text-xl absolute top-1/2 left-3 -translate-y-1/2" ></IonIcon>
                                    <input id={ 'input-' + Field.FieldName } type={ Field.FieldType } disabled={ Loading } name={ Field.FieldName } onBlur={ (e) => InputCheck(e.currentTarget) } onSubmitCapture={ (e) => InputCheck(e.currentTarget) } onInput={ (e) => InputValue(e.currentTarget) } placeholder={ Field.Placeholder } className={`bg-black/20 dark:bg-white/20 w-full py-2 leading-none px-3 pl-[44px] outline-none text-lg rounded-md border dark:placeholder:text-white/70 placeholder:text-black/70 placeholder:font-light ${Field.ErrorText != null ? 'border-red-500/60' : 'border-[#212020]/30 dark:border-white/20'}`} />
                                </div>
                            </div>
                        ))
                    }

                    <div className="mt-4 flex flex-col">
                        <button type="submit" disabled={(EmptyFields != 0 || Loading)} className={`bg-[#212020]/30 dark:bg-white/20 text-white rounded-md border border-[#212020]/30 dark:border-white/20 hover:bg-black/30 active:bg-[#212020]/30 dark:hover:bg-white/30 dark:active:bg-white/20 transition-all outline-none duration-150 py-3 text-lg font-semibold leading-none ${EmptyFields != 0 ? 'opacity-50 pointer-events-none' : 'opacity-100 pointer-events-auto hover:tracking-widest'} ${ Loading ? 'opacity-50 pointer-events-none' : 'opacity-100 pointer-events-auto' }`}>Azonosítás</button>
                    </div>
                </form>

                <div className="rounded-2xl bg-white/60 dark:bg-[#212020]/60 dark:text-white px-5 py-3.5 mb-auto mt-3 select-none z-20 w-[350px] backdrop-blur-xl border-b border-black/20 flex flex-col">
                    <div className="flex gap-2">
                        <IonIcon className="shrink-0 text-2xl" icon="information-outline"></IonIcon>
                        <div className="flex flex-col gap-2">
                            <p>A panel4you projekt használatával elfogadod, hogy a panelt saját felelősséggel, a vps4you jóváhagyása és ellenőrzése nélkül használod.</p>
                            <p>A panel használatával 3. félnek adatot nem adsz ki, kizárólagosan a VPS4you KFT. az adatkezelő, ez a panel csak egy, a VPS4you által nyilvánosan elérhető API-t használ.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { LoginScreen }