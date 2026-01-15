import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import StorageIcon from '@mui/icons-material/Storage'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

function MenuManager({ currentScreen, setCurrentScreen }) {

    const handleNavigationChange = (event, newValue) => {
    // Validación básica: Solo permite valores esperados
        if (newValue !== 'Home' && newValue !== 'Images' && newValue !== 'All' && newValue !== 'Orders') {
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

        <BottomNavigationAction
          key="All"
          label="All"
          value="All"
          icon={<StorageIcon />} // Icono blanco
          aria-label="Navegar a sección Points"
        />

        {/* Pestaña Points */}
        <BottomNavigationAction
          key="Orders"
          label="Orders"
          value="Orders"
          icon={<ContentPasteIcon />} // Icono blanco
          aria-label="Navegar a sección Points"
        />

        {/* Pestaña Points */}
        <BottomNavigationAction
          key="Images"
          label="Images"
          value="Images"
          icon={<AddPhotoAlternateIcon />} // Icono blanco
          aria-label="Navegar a sección Points"
        />
      </BottomNavigation>
      
    </nav>
  );
}

export default MenuManager