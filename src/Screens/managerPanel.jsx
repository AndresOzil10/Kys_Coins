import React from 'react'
import BarNav from '../components/Manager/BarNav'
import { useLocation } from 'react-router-dom'

function ManagerPanel() {
    const location = useLocation()
    const {nombre, nomina } = location.state || {}
  return (
    <>  
        <div>
            <BarNav nomina={nomina} nombre={nombre}/>
            {/* <Menu currentScreen={currentScreen} setCurrentScreen={setCurrentScreen}/>
            {renderScreen()} */}
        </div>
    </>
  )
}

export default ManagerPanel