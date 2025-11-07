import React, { useState } from 'react'
import BarNav from '../components/Manager/BarNav'
import { useLocation } from 'react-router-dom'
import HomeManager from './HomeManager'
import MenuManager from '../components/Manager/MenuManager'

function ManagerPanel() {
    const location = useLocation()
    const {nombre, nomina } = location.state || {}
    const [currentScreen, setCurrentScreen] = useState('Home')

    const renderScreen = () => {
        switch (currentScreen) {
            case 'Home':
                return <HomeManager />
            case 'Images':
                return <PuntosScreen />
            default:
                return 
        }
    }
  return (
    <>  
        <div>
            <BarNav nomina={nomina} nombre={nombre}/>
            <MenuManager currentScreen={currentScreen} setCurrentScreen={setCurrentScreen}/>
            {renderScreen()}
        </div>
    </>
  )
}

export default ManagerPanel