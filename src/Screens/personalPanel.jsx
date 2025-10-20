import { useLocation } from "react-router-dom";
import Barnav from "../components/Personal/Navbar";
import Menu from "../components/Personal/Menu";
import PuntosScreen from "./PuntosScreen";
import { useState } from "react";
import Home from "./Home";
import Rules from "./Rules";
import ShoppStore from "./ShoppStore";

const Panel = () => { 
    const location = useLocation();
    const {nombre, nomina } = location.state || {}
    const [currentScreen, setCurrentScreen] = useState('Home');

    const renderScreen = () => {
        switch (currentScreen) {
            case 'Home':
                return <Home />
            case 'Puntos':
                return <PuntosScreen />
            case 'Products':
                return <ShoppStore />
            case 'Reglamento':
                return <Rules />
            default:
                return 
        }
    }

    // console.log(nomina)
    // console.log(nombre)
    return (
        <>
            <div>
                <Barnav nomina={nomina} nombre={nombre}/>
                <Menu currentScreen={currentScreen} setCurrentScreen={setCurrentScreen}/>
                {renderScreen()}
            </div>
             
        </>
    )
 }

 export default Panel