import { Event } from '../../utils/interfaces';

import { AiFillCalendar } from 'react-icons/ai';
import { motion } from 'framer-motion';

interface Props {
  event: Event;
}

const EventComponent = ({ event, openModal, index }) => {
  return (
    <motion.tr initial = {{ opacity: 0 }} animate = {{ opacity: 1 }} transition = {{ delay: 2 + (0.1 * index), duration: 2 }} className="hover:bg-[#66666655] transition duration-200" style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
      <td className = "text-2xl px-4 py-6 font-bold">{ event.date } { event.hasPassed && <span className = "italic font-bold opacity-50">COMPLETED</span> }</td>
      <td className = "text-2xl">{ event.track.paid && <span className = "text-green-500 font-extrabold">$</span> } { event.track.name }</td>
      <td className = "text-2xl">
        { event.cars.map((car, index) => (
          <>
            { car.paid && <span className = "text-green-500 font-extrabold">$</span> }
            <span>{ car.name }</span>
          </>
        )) }
      </td>
      <td className = "text-2xl">{ event.notes }</td>
      <td><a className = "cursor-pointer opacity-50 hover:opacity-100 transition duration-200" onClick = {() => {
        openModal(event, index);
      }}><AiFillCalendar className = "inline mr-4" /></a></td>
    </motion.tr>
  );
};

export default EventComponent;