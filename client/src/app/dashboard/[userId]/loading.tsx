import React from 'react'

const loading = () => {
  return (
    <div className=" w-full z-50 flex items-center justify-center h-[25rem]  ">
      <div className="w-10 h-10 border-4 border-t-transparent border-[#0400ff] rounded-full animate-spin" />
    </div>
  )
}

export default loading