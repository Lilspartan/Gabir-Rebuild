import { motion, AnimatePresence  } from 'framer-motion';
import { useEffect, ReactNode } from 'react';

import { AiOutlineClose } from 'react-icons/ai';

interface BackdropTypes {
    setOpen: Function;
    id: string;
    onClose?: Function;
}

interface AnimationState {
    [key: string]: string | number;
}

interface ModalTypes {
    children:            ReactNode;
    id:                  string;
    open:                boolean;
    closeButton?:        boolean;
    hideBackdrop?:       boolean;
    setOpen:             Function;
    onClose?:            Function;
    onOpen?:             Function;
    customTimings?:      AnimationState;
    customOpenState?:    AnimationState;
    customClosedState?:  AnimationState;
}

const DEFAULT_CLOSED_STATE = { opacity: 0, scale: 0.9 };
const DEFAULT_OPEN_STATE = { opacity: 1, scale: 1 };
const DEFAULT_TIMINGS = { duration: 0.15 }

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

/**
 * A modal component with open/close animations
 * @param   {boolean} open the open state of the modal
 * @param   {string} id the ID prefix to use for the modal
 * @param   {boolean} [closeButton=false] if the close button should be shown or not (if false, clicking on backdrop will still close the modal)
 * @param   {boolean} [hideBackdrop=false] if the backdrop should be shown
 * @param   {Function} setOpen the state mutator that changes the open state of the modal
 * @param   {Function} [onOpen] the function to call when the modal is opened
 * @param   {Function} [onClose] the function to call when the modal is closed
 * @param   {AnimationState} [customClosedState] custom framer-motion state for when the modal is closed
 * @param   {AnimationState} [customOpenState] custom framer-motion state for when the modal is open
 * @param   {AnimationState} [customTimings] custom framer-motion timings for the modal open & close animations
*/
const Modal = ({ 
    open, 
    setOpen, 
    id, 
    children, 
    closeButton = false, 
    hideBackdrop = false, 
    onClose = () => {}, 
    onOpen = () => {}, 
    customClosedState = DEFAULT_CLOSED_STATE,
    customOpenState = DEFAULT_OPEN_STATE,
    customTimings = DEFAULT_TIMINGS,
}: ModalTypes) => {
    useEffect(() => {
        if (open) onOpen();
    }, [ open ])

    return (
        <AnimatePresence>
            { open && (
                <>
                    { 
                        !hideBackdrop && <Backdrop setOpen = { setOpen } id = { id } onClose = { onClose } /> 
                    }

                    <div className = "w-screen h-screen fixed top-0 left-0 grid place-items-center z-40 text-white pointer-events-none">
                        <motion.div 
                            id = {id + "-modal"}
                            key = {id + "-modal"}
                            initial = {customClosedState} 
                            animate = {customOpenState} 
                            exit = {customClosedState} 
                            transition = {customTimings} 
                            className = {`bg-dark-card-handle text-white p-4 pointer-events-auto rounded-md lg:max-w-4xl mx-4 fixed z-40 ${closeButton && "pr-12"}`}
                        >
                            { (closeButton) && (
                                <div id = {`${id}-close`} >
                                    <AiOutlineClose className = "text-white absolute right-4 text-xl cursor-pointer" aria-label = "Close Modal Button" onClick = {() => { setOpen(false); onClose(); }} />
                                </div>
                            ) }

                            <div id = {`${id}-content`}>
                                { children }
                            </div>
                        </motion.div>
                    </div>
                </>
            ) }
        </AnimatePresence>
    )
}

export default Modal