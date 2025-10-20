import React from 'react'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PaidIcon from '@mui/icons-material/Paid'
import RuleIcon from '@mui/icons-material/Rule'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

function Menu({ currentScreen, setCurrentScreen }) {
  // Función para manejar cambio de pestaña (sincroniza con props del padre)
  const handleNavigationChange = (event, newValue) => {
    // Validación básica: Solo permite valores esperados
    if (newValue !== 'Home' && newValue !== 'Puntos' && newValue !== 'Products' && newValue !== 'Reglamento') {
      console.warn(`Valor de navegación inválido: ${newValue}. Ignorando cambio.`)
      return
    }
    setCurrentScreen(newValue) // Actualiza el estado en el padre
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 shrink-0" role="navigation" aria-label="Navegación inferior">
      <BottomNavigation
        sx={{
          width: "100%",
          backgroundColor: "#e9e9e9", // Corregido: Rojo corporativo (en lugar de gris)
          height: "80px", // Altura fija para consistencia
        }}
        value={currentScreen} // Sincronizado con prop del padre
        onChange={handleNavigationChange} // Actualiza via prop
        showLabels // Muestra labels para mejor UX
      >
        {/* Pestaña Home */}
        <BottomNavigationAction
          key="Home"
          label="Home"
          value="Home"
          icon={<HomeIcon />} // Icono blanco
          aria-label="Navegar a sección Home"
        />

        {/* Pestaña Points */}
        <BottomNavigationAction
          key="Puntos"
          label="Puntos"
          value="Puntos"
          icon={<PaidIcon />} // Icono blanco
          aria-label="Navegar a sección Points"
        />
        <BottomNavigationAction
          key="Products"
          label="Products"
          value="Products"
          icon={<ShoppingBasketIcon />} // Icono blanco
          aria-label="Navegar a sección Purchase"
        />
        <BottomNavigationAction
          key="Reglamento"
          label="Reglamento"
          value="Reglamento"
          icon={<RuleIcon />} // Icono blanco
          aria-label="Navegar a sección Reglamento"
        />
      </BottomNavigation>
      
    </nav>
  );
}

export default Menu;