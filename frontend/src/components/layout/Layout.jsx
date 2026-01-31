import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from "./Header"

function Layout() {
  return (
    <div className="min-h-screen bg-base-100">
        <Header/>
        <main className='p-4'>
            <Outlet/>
        </main>
    </div>
  )
}

export default Layout