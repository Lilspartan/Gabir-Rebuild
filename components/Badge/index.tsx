import React from 'react'

const Badge = (props) => {
  return (
    <span className = "text-sm bg-light-card-handle text-black rounded-lg px-2 py-1 font-bold">{ props.children }</span>
  )
}

export default Badge