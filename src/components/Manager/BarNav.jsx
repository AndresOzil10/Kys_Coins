import React from 'react'
import logo from '../../assets/images/logo.jpeg'
import coin from '../../assets/png/coins_2.png'

function BarNav({nomina, nombre}) {

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        // Redirect to login and prevent back navigation
        window.location.replace("/");
    }
    
  return (
          <>
          <div className="navbar bg-[#2b2b2b] shadow-sm">
              <div className="flex-1">
                  {/* <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:bg-transparent">
                      <div className="w-10 rounded-full">
                      <img
                          width={1000}
                          src={coin} />
                      </div>
                  </div>
                  <a className="btn btn-ghost text-[20px] ml-[-15px] text-white hover:bg-transparent">230 pts.</a> */}
              </div>
              <div className="flex-none">
                  <div className="dropdown dropdown-end">
                      <button className="btn btn-ghost btn-dash text-white hover:bg-transparent">{nomina +" "+nombre} </button>
                  </div>
                  {/* <div className="dropdown dropdown-end">
                      <button tabIndex={0} className="btn btn-ghost btn-dash btn-circle text-white hover:bg-transparent">
                          <div className="indicator">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
                          </div>
                      </button>
                      
                      <div
                          tabIndex={0}
                          className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                          <div className="card-body">
                          <span className="text-lg font-bold">8 Items</span>
                          <span className="text-info">Subtotal: $999</span>
                          <div className="card-actions">
                              <button className="btn btn-primary btn-block">View cart</button>
                          </div>
                          </div>
                      </div>
                  </div> */}
                  <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                          <div className="w-10 rounded-full">
                          <img
                              alt="Tailwind CSS Navbar component"
                              src={logo} />
                          </div>
                      </div>
                      {/* <ul
                          tabIndex={0}
                          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                          <li>
                          <a className="justify-between">
                              Profile
                              <span className="badge">New</span>
                          </a>
                          </li>
                          <li><a>Settings</a></li>
                          <li><a>Logout</a></li>
                      </ul> */}
                  </div>
                  <div className="dropdown dropdown-end">
                      <button 
                          className="btn btn-ghost btn-dash btn-circle text-white hover:bg-transparent"
                          onClick={handleLogout} // Agregado: ejecuta la función al hacer click
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-power" viewBox="0 0 16 16">
                              <path d="M7.5 1v7h1V1z"/>
                              <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/>
                          </svg>
                      </button>
                  </div>
              </div>
          </div>
          </>
      )
}

export default BarNav