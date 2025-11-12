import logo from '../assets/images/kayser_logo.webp'
import user from "../assets/gif/user.gif"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomAlert from '../components/CustomAlert';

const API_URL = import.meta.env.VITE_API_URL; // Renombré para claridad

const enviarData = async (apiUrl, data) => {
  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!resp.ok) {
      throw new Error(`Error en la respuesta de la API: ${resp.status}`)
    }
    return await resp.json();
  } catch (error) {
    console.error("Error en la solicitud:", error)
    throw error
  }
}

const Personal = () => { 
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("") // Para mostrar errores en UI
  const navigate = useNavigate()
  const [CustomAlertVisible, setCustomAlertVisible] = useState(false)
    const [customAlertMessage, setCustomAlertMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault() // ¡Clave! Previene el submit por defecto del form (recarga de página)
    
    // Validación básica
    const nomina = username.trim()
    if (!nomina || nomina.length < 4 || isNaN(nomina)) {
      setError("Ingresa un número de nómina válido (al menos 4 dígitos).")
      return;
    }
    
    setError("") // Limpia errores previos
    setLoading(true)

    const loginData = { aksi: "login", username: nomina }
    // console.log("Enviando datos:", loginData); // Debug: Verifica en consola

    try {
      const response = await enviarData(API_URL, loginData)
    //   console.log("Respuesta de API:", response); // Debug: Verifica la respuesta

      if (response.estado === "success") {
        console.log("Login exitoso, navegando...") // Debug
        navigate("/personal", { 
          replace: true, 
          state: { 
            nombre: response.data, // Ajusta según estructura real de response.data
            nomina: nomina,
            area : response.area
          } 
        })
      } else {
        setCustomAlertVisible(true)
        setCustomAlertMessage(response.mensaje)
        setTimeout(() => {
            setCustomAlertVisible(false)
            setCustomAlertMessage('')
        }, 4000)
      }
    } catch (error) {
      setError("Error de conexión. Intenta de nuevo más tarde.")
    //   console.error("Error during API call:", error);
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Solo permite números
    setUsername(value)
    if (error) setError("") // Limpia error al escribir
  }

  return (
    <div className="flex items-center justify-center min-h-[98svh] md:min-h-[90svh] mt-[-100px]">
      <div className="card bg-base-300 w-96 shadow-2xl">
        <figure className="px-8 pt-8">
          <img
            src={logo}
            alt="Logo de Kayser Automotive"
            className="w-full max-w-xs mx-auto" // Responsivo y centrado
          />
        </figure>
        <div className="card-body items-center">
          <form className="w-full space-y-4" onSubmit={handleSubmit}> {/* Removí action="", agregué spacing */}
            <div className="w-full relative">
              <label className={`input w-full ${error ? 'input-error' : ''}`} aria-label="Número de nómina">
                <img 
                  src={user} 
                  alt="Icono de usuario" 
                  width={20} 
                  height={20}
                  className="mr-2"
                />
                <input
                  className="flex-1 ml-2" // Ajusté para espacio con icono
                  type="text" // Corregido: type="text" (o "number" si prefieres)
                  required
                  placeholder="Número de Nómina"
                  title="Solo números"
                  pattern="[0-9]*" // Validación HTML5 para números
                  value={username}
                  onChange={handleInputChange} // Filtra solo números
                  disabled={loading}
                  autoFocus // UX: Enfoca automáticamente
                />
              </label>
              <CustomAlert CustomAlertVisible={CustomAlertVisible} customAlertMessage={customAlertMessage} />
            </div>
            <button 
              className="btn btn-error btn-block" // Removí btn-soft si no es necesario
              type="submit"
              disabled={loading || !username}
            >
              {loading ? (
                <span className="loading loading-spinner"></span> // Spinner de DaisyUI durante loading
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Personal