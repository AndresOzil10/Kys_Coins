import { useState } from "react"
import { BottomNavigation, BottomNavigationAction } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import GroupIcon from "@mui/icons-material/Group"
import Personal from "./Personal"
import Manager from "./Manager"

function Login() {
  const [currentScreen, setCurrentScreen] = useState("personal")// Estado para la pantalla actual

  // Función para manejar cambio de pestaña
  const handleNavigationChange = (event, newValue) => {
    setCurrentScreen(newValue)
  }

  // Renderiza la pantalla basada en el estado actual
  const renderScreen = () => {
    switch (currentScreen) {
      case "personal":
        return <Personal />
      case "manager":
        return <Manager />
      default:
        // Fallback seguro si hay un valor inesperado
        console.warn(`Pantalla no reconocida: ${currentScreen}. Mostrando Personal por defecto.`)
        return <Personal />
    }
  }

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Título principal */}
      <header className="text-center py-6 px-4 bg-[#130716] border-b border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-white underline decoration-[#bf2a23] decoration-2">
          Kayser Points
        </h1>
      </header>

      {/* Contenido principal (pantalla dinámica) */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
        {renderScreen()}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-10 shrink-0">
        <BottomNavigation
          sx={{
            width: "100%",
            backgroundColor: "#e9e9e9", 
            height: "80px", // Altura fija para consistencia (ajusta si es necesario)
          }}
          value={currentScreen}
          onChange={handleNavigationChange}
          showLabels
        >
          <BottomNavigationAction
            label="Personal"
            value="personal"
            icon={<PersonIcon />}
            aria-label="Navegar a sección personal"
          />
          <BottomNavigationAction
            label="Manager"
            value="manager"
            icon={<GroupIcon />}
            aria-label="Navegar a sección manager"
          />
        </BottomNavigation>
      </div>
    </div>
  )
}

export default Login