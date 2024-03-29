import React from 'react'
import classNames from 'classnames';

const Button = (props) => {
  let buttonStyles = [
    // "border-2",
    // "p-2",
    // "text-xl",
    // "hover:bg-white",
    // "hover:text-black",
    // "cursor-pointer",
    // "transition",
    // "duration-200",
    "cta-button rounded-md",
    props.block && "w-full"
  ]

  if (props.link) {
    return (
      <a href = {props.link} target = {props.target || "_self"} 
        className = {classNames(buttonStyles)}>{ props.children }</a>
    )
  } else {
    return (
      <a onClick = {props.click} 
        className = {classNames(buttonStyles)}>{ props.children }</a>
    )
  }
}

export default Button