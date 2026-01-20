import { useLocation } from "react-router-dom";
import Barnav from "../components/Personal/Navbar";
import Menu from "../components/Personal/Menu";
import PuntosScreen from "./PuntosScreen";
import { useState } from "react";
import Home from "./Home";
import Rules from "./Rules";
import ShoppStore from "./ShoppStore";
import Orders from "./Orders";

const Panel = () => { 
    const location = useLocation();
    const {nombre, nomina, area } = location.state || {}
    const [currentScreen, setCurrentScreen] = useState('Home');

    const renderScreen = () => {
        switch (currentScreen) {
            case 'Home':
                return <Home nombre={nombre} nomina={nomina} area={area}/>
            case 'Puntos':
                return <PuntosScreen nomina={nomina}/>
            case 'Products':
                return <ShoppStore nomina={nomina}/>
            case 'Reglamento':
                return <Rules />
            case 'Pedidos':
                return <Orders nomina={nomina}/>
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