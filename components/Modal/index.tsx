import { motion, AnimatePresence  } from 'framer-motion';

import { AiOutlineClose } from 'react-icons/ai';

interface BackdropTypes {
    setOpen: Function;
    id: string;
    onClose?: Function;
}

interface ModalTypes {
    open: boolean;
    id: string;
    setOpen: Function;
    children: any;
    closeButton?: boolean;
    onClose?: Function;
}

const Backdrop = ({ setOpen, id, onClose = () => {} }: BackdropTypes) => {
    return (
        <motion.div 
            initial = {{ opacity: 0 }} 
            animate = {{ opacity: 0.5 }} 
            exit = {{ opacity: 0 }}
            transition = {{ duration: 0.1 }} 
            onClick = {() => { setOpen(false); onClose(); }} 
            className = "bg-black cursor-pointer z-40 text-white top-0 left-0 w-screen h-screen grid place-items-center fixed" 
            id = {id + "-backdrop"}
        >
        </motion.div>
    )
}

const Modal = ({ open, setOpen, id, children, closeButton = false, onClose = () => {} }: ModalTypes) => {
    const closedState = { opacity: 0, scale: 0.9 };
    const openState = { opacity: 1, scale: 1 };
    const timings = { duration: 0.15 }

    return (
        <AnimatePresence>
            { open && (
                <>
                    <Backdrop setOpen = { setOpen } id = { id } onClose = { onClose } />
                    <div className = "w-screen h-screen fixed top-0 left-0 grid place-items-center z-40 text-white pointer-events-none">
                        <motion.div 
                            id = {id + "-modal"}
                            key = {id + "-modal"}
                            initial = {closedState} 
                            animate = {openState} 
                            exit = {closedState} 
                            transition = {timings} 
                            className = {`bg-dark-card-handle p-4 pointer-events-auto rounded-md lg:max-w-4xl mx-4 fixed z-40 ${closeButton && "pr-12"}`}
                        >
                            { closeButton && (
                                <div>
                                    <AiOutlineClose className = "text-white absolute right-4 text-xl cursor-pointer" aria-label = "Close Modal Button" onClick = {() => { setOpen(false); onClose(); }} />
                                </div>
                            ) }

                            { children }
                        </motion.div>
                    </div>
                </>
            ) }
        </AnimatePresence>
    )
}

export default Modal