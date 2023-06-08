import { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineWarning, AiOutlineInfoCircle, AiOutlineCheckCircle } from 'react-icons/ai';
import { BiErrorAlt } from 'react-icons/bi';

type Link = {
    text: string;
    url: string;
}

type Type = "success" | "warning" | "error" | "tip";

type Props = {
    title?: string;
    children?: any;
    links?: Link[];
    permaDismiss: boolean;
    id: string;
    open?: boolean;
    type?: Type;
    closeable?: boolean;
    backgroundVisible?: boolean;
    ephemeral?: boolean;
    autoDismissTime?: number;
    onClose?: Function;
}

interface ColorScheme {
    background: string;
    border:     string;
    text:       string;
    noBgText:   string;
}

const colors: { [ key in Type ]: ColorScheme } = {
    "warning": {
        background: "bg-yellow-700",
        border: "border-yellow-800",
        text: "text-white",
        noBgText: "text-yellow-600",
    },
    "success": {
        background: "bg-green-700",
        border: "border-green-800",
        text: "text-white",
        noBgText: "text-green-600",
    },
    "error": {
        background: "bg-red-700",
        border: "border-red-800",
        text: "text-white",
        noBgText: "text-red-600",
    },
    "tip": {
        background: "bg-sky-700",
        border: "border-sky-800",
        text: "text-white",
        noBgText: "text-sky-600",
    }
}

var autoDismissTimeout = setTimeout(() => {}, Infinity);

const Alert = (props: Props) => {
    const [open, setOpen] = useState(true);

    let { onClose=() => {} } = props;

    useEffect(() => {
        let localDismissed = localStorage.getItem("alert-dismissed-" + props.id);
        if (localDismissed !== null) setOpen(false);
    }, [])

    let { closeable=true, backgroundVisible=true, ephemeral=false, autoDismissTime=3000 } = props
	
    const close = () => {
        setOpen(false);

        onClose();

        if (props.permaDismiss) localStorage.setItem("alert-dismissed-" + props.id, "true");
    }

    useEffect(() => {
        clearTimeout(autoDismissTimeout);

        if (ephemeral && open) {
            autoDismissTimeout = setTimeout(() => {
                setOpen(false);
            }, autoDismissTime)
        }
    }, [ ephemeral, autoDismissTime ])

    if (open) {
        return (
            <div className = {`alert lg:text-lg text-sm pointer-events-auto ${backgroundVisible ? "p-4 border-2 lg:mx-auto mx-4" : "p-1"} backdrop-blur-sm ${backgroundVisible && colors[props.type].background} ${backgroundVisible ? colors[props.type].border : "border-0"} ${backgroundVisible ? colors[props.type].text : colors[props.type].noBgText} bg-opacity-80 rounded-lg flex flex-row drop-shadow-lg transition duration-500`}>
                <div className = "my-auto lg:text-3xl text-xl mr-4">
                    { props.type === "warning" && <AiOutlineWarning /> }
                    { props.type === "error" && <BiErrorAlt /> }
                    { props.type === "tip" && <AiOutlineInfoCircle /> }
                    { props.type === "success" && <AiOutlineCheckCircle /> }
                </div>

                <div>
                    <span className = "font-extrabold mr-2">{ props.title }</span>
                </div>
                
                <div className = "alert-body">
                    <span className = "alert-body-inner">{ props.children }</span>
                </div>

                { closeable ? (
                    <div>
                        <a className = "cursor-pointer" onClick = {close} ><AiOutlineClose className = "inline ml-4" /></a>
                    </div>
                ) : <div className = ""></div>}
            </div>
        )
    } else return <></>;
}

export default Alert