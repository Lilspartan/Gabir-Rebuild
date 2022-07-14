import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

type Link = {
    text: string;
    url: string;
}

type Props = {
    title?: string;
    children?: any;
    links?: Link[];
    permaDismiss: boolean;
    id: string;
    open?: boolean;
    color?: string;
    textColor?: string;
}

const Alert = (props: Props) => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        let localDismissed = localStorage.getItem("alert-dismissed-" + props.id);
        if (localDismissed !== null) setOpen(false);
    }, [])

    const close = () => {
        setOpen(false);

        if (props.permaDismiss) localStorage.setItem("alert-dismissed-" + props.id, "true");
    }

    return (
        <div className = "flex flex-row justify-center w-full">
            <div style = {{ backgroundColor: props.color, color: props.textColor }} className = {`p-4 fixed ${props.color !== undefined ? "" : "bg-dark-card-handle dark:bg-light-card-handle"} ${props.textColor !== undefined ? "" : "text-white dark:text-black"} z-40 m-4 rounded-lg flex flex-row drop-shadow-lg transition durstion-500 ${open ? "translate-y-0" : "-translate-y-24"}`}>
                <div>
                    <span className = "pr-2 font-bold">{ props.title }</span>
                    <span>{ props.children }</span>
                </div>

                <div>
                    <a className = "cursor-pointer" onClick = {close} ><AiOutlineClose className = "inline ml-4" /></a>
                </div>
            </div>
        </div>
    )
}

export default Alert