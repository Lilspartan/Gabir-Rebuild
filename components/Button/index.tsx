import React from 'react'

const Button = (props) => {
  if (props.link) {
    return (
      <a href = {props.link} className = {`${props.block ? "block" : ""} font-bold text-lg text-center cursor-pointer border-2 border-black dark:border-white px-4 py-2 rounded-lg transition duration-500 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black`}>{ props.children }</a>
    )
  } else {
    return (
      <a onClick = {props.click} className = {`${props.block ? "block" : ""} font-bold text-lg text-center cursor-pointer border-2 border-black dark:border-white px-4 py-2 rounded-lg transition duration-500 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black`}>{ props.children }</a>
    )
  }
}

export default Button