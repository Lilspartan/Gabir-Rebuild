import { Event } from '../../utils/interfaces';

import { AiFillCalendar } from 'react-icons/ai';

interface Props {
  event: Event;
}

const EventComponent = ({ event, openModal, index }) => {
  return (
    <tr data-m = "bounce-up" data-m-delay = {(index * 0.1) + 1.5} data-m-duration = "0.5" className="hover:bg-[#66666655] transition duration-200" style = {{ borderWidth: "1px 0", borderColor: "#666666AA" }}>
      <td className = "p-4">{ event.date } { event.hasPassed && <span className = "italic font-bold opacity-70">COMPLETED</span> }</td>
      <td className = "">{ event.track.paid && <span className = "text-green-500 font-extrabold">$</span> } { event.track.name }</td>
      <td className = "">
        { event.cars.map((car, index) => (
          <>
            { car.paid && <span className = "text-green-500 font-extrabold">$</span> }
            <span>{ car.name }</span>
          </>
        )) }
      </td>
      <td className = "">{ event.notes }</td>
      <td><a className = "cursor-pointer opacity-50 hover:opacity-100 transition duration-200" onClick = {() => {
        openModal(event, index);
      }}><AiFillCalendar className = "inline" /></a></td>
    </tr>
  );
};

export default EventComponent;