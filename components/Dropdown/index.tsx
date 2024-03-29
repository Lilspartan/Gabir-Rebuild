import { ChangeEventHandler } from 'react'

interface Props {
    change:  ChangeEventHandler<HTMLSelectElement>;
    options: Option[];
}

type Option = {
    value:     string;
    text:      string;
    selected?: boolean;
}

const Dropdown = ({ change = ()=>{}, options }: Props) => {
  return (
    <select onChange = { change } className="w-full text-white px-2 py-1 text-lg rounded-md bg-[#333333]">
        {options.map(option => (
            <option value={ option.value } selected = { option.selected !== undefined && option.selected }>{ option.text }</option>
        ))}
    </select>
  )
}

export default Dropdown