import React from 'react'

interface AlertAreaTypes {
    children: any;
}

const AlertArea = ({ children }: AlertAreaTypes) => {
  return (
    <div className = "pointer-events-none fixed z-40 w-screen flex flex-row justify-center">
        <div className = "flex flex-col gap-2 mt-2 justify-start lg:w-2/3">
            { children }
        </div>
    </div>
  )
}

export default AlertArea