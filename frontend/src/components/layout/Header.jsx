import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/UseAuth'
import { useState } from 'react'

function Header() {
   const { user, logout } = useAuth()
   const [menuOpen, setMenuOpen] = useState(false)
   return (<>
      <div className="navbar bg-base-200 shadow sticky top-0">
         <div className="flex-1">
            <Link to="/" className='text-xl font-bold'>Finsight</Link>
         </div>
         <div className="hidden md:flex gap-6 items-center">
            <Link to="/upload" className='btn btn-ghost btn-sm'>Upload</Link>
            <Link to="/contact" className='btn btn-ghost btn-sm'>Contact</Link>

            {/* setting dropdown */}
            <div className="dropdown dropdown-end">
               <label tabIndex={0} className='btn btn-ghost btn-sm'>Setting</label>
               <ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-52 mt-8 text-gray-700 font-bold '>
                  <li><Link to="/profile" className='hover:bg-base-50'>Profile</Link></li>
                  <li><button>Theme</button></li>
                  <li><button onClick={logout} className='hover:bg-red-300'>Logout</button></li>
               </ul>
            </div>
         </div>

         {/* mobile menu button */}
         <div className="md:hidden">
            <button
               className='btn btn-ghost '
               onClick={() => { setMenuOpen(!menuOpen) }}
            >☰
            </button>
         </div>
         {/* for code */}
         {menuOpen && (
            <div className="absolute top-16 right-4 bg-gray-100 shadow rounded p-4 flex flex-col gap-3  md:hidden w-52 font-bold text-gray-700">
               <Link to="/upload" className='btn btn-ghost btn-sm'>Upload</Link>
               <Link to="/contact" className='btn btn-ghost btn-sm'>Contact</Link>
               <div className="dropdown dropdown-end">
                  <label tabIndex={0} className='btn btn-ghost btn-sm'>Setting</label>
                  <ul tabIndex={0} className='dropdown-content menu p-2 shadow bg-gray-100 rounded-box w-52  text-gray-700 font-bold '>
                     <li><Link to="/profile" className='hover:bg-base-50'>Profile</Link></li>
                     <li><button>Theme</button></li>
                     <li><button onClick={logout} className='hover:bg-red-300'>Logout</button></li>
                  </ul>
               </div>
            </div>
         )}
      </div>
      {/* <div>Header</div> */}

      {/* desktop menu */}

   </>

   )
}

export default Header