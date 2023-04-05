import React from 'react'
import classNames from 'classnames';

const Button = (props) => {
  let buttonStyles = [
    "cta-button"
  ]

  if (props.link) {
    return (
      <a href = {props.link}
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