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
}

const colors = {
    "warning": {
        background: "bg-yellow-700",
        border: "border-yellow-800",
        text: "text-white"
    },
    "success": {
        background: "bg-green-700",
        border: "border-green-800",
        text: "text-white",
    },
    "error": {
        background: "bg-red-700",
        border: "border-red-800",
        text: "text-white",
    },
    "tip": {
        background: "bg-sky-700",
        border: "border-sky-800",
        text: "text-white",
    }
}

const Alert = (props: Props) => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        let localDismissed = localStorage.getItem("alert-dismissed-" + props.id);
        if (localDismissed !== null) setOpen(false);
    }, [])

		let { closeable=true } = props
	
    const close = () => {
        setOpen(false);

        if (props.permaDismiss) localStorage.setItem("alert-dismissed-" + props.id, "true");
    }

    if (open) {
        return (
            <div className = {`alert lg:text-lg text-sm pointer-events-auto lg:mx-auto p-4 backdrop-blur-sm ${colors[props.type].background} ${colors[props.type].border} ${colors[props.type].text} bg-opacity-80 border-2 mx-4 rounded-lg flex flex-row drop-shadow-lg transition duration-500`}>
                <div className = "my-auto lg:text-3xl text-xl mr-4">
                    { props.type === "warning" && <AiOutlineWarning /> }
                    { props.type === "error" && <BiErrorAlt /> }
                    { props.type === "tip" && <AiOutlineInfoCircle /> }
                    { props.type === "success" && <AiOutlineCheckCircle /> }
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