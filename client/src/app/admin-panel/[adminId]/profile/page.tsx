"use client"
import { useData } from '@/context/Context'
import React from 'react'

const Page = () => {

  const {userData} = useData()

  return (
    <div>
      <h3 className=' text-[1.3rem] font-medium '>My Profile</h3>
      <div className=' text-center mt-[2rem] '>
        <div className=' text-[1.5rem] font-medium '>{userData.name}</div>
        <div className=' text-lg text-[#555] '>{userData.email}</div>
      </div>
    </div>
  )
}

export default Page