import { Event } from '../../utils/interfaces';

interface Props {
  event: Event;
}

const EventComponent = ({ event }) => {
  return (
    <tr className="">
      <td>{ event.date } { event.hasPassed && <span className = "italic font-bold opacity-70">COMPLETED</span> }</td>
      <td>{ event.track.paid && <span className = "text-green-500 font-extrabold">$</span> } { event.track.name }</td>
      { event.cars.map((car, index) => (
        <>
          { car.paid && <span className = "text-green-500 font-extrabold">$</span> }
          <span>{ car.name }</span>
        </>
      )) }
      <td>{ event.notes }</td>
    </tr>
  );
};

export default EventComponent;