import logo from '../assets/images/kayser_logo.webp'
import user from "../assets/gif/user.gif"
import { useState } from 'react';
import gif from "../assets/gif/password.gif"
import { useNavigate } from 'react-router-dom'; // Agregado: importa useNavigate
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

const Manager = () => { 
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate() // Agregado: define navigate
    const [CustomAlertVisible, setCustomAlertVisible] = useState(false)
    const [customAlertMessage, setCustomAlertMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        setLoading(true)
        setError("") // Limpia errores previos

        const loginData = { aksi: "loginManager", username: username, password: password }
        console.log("Enviando datos:", loginData) // Debug: verifica que se ejecute

        try {
            // console.log("Entrando al try..."); // Debug: confirma entrada al try
            const response = await enviarData(API_URL, loginData)
            // console.log("Respuesta de API:", response); // Debug: verifica respuesta

            if (response.estado === "success") {
                navigate("/manager", { 
                    replace: true, 
                    state: { 
                        nombre: response.data,
                        nomina: response.nomina 
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
            console.error("Error during API call:", error); // Debug
            setError("Error de conexión. Intenta de nuevo más tarde.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-[98svh] md:min-h-[90svh] mt-[-100px]">
                <div className="card bg-base-300 w-96 shadow-2xl">
                    <figure className="px-8 pt-8">
                        <img
                            src={logo}
                            className="w-full max-w-xs mx-auto"
                        />
                    </figure>
                    <div className="card-body">
                        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                            <div className="w-full relative">
                                <label className="input validator w-full">
                                    <img src={user} alt="" width={20} height={20}/>
                                    <input
                                        className='w-full'
                                        type="input"
                                        required
                                        placeholder="Username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </label>
                                <p className="validator-hint">
                                    Complet the username
                                </p>
                            </div>
                            <div className="w-full relative ">
                                <label className="input validator w-full">
                                    <img src={gif} alt="" width={20} height={20}/>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Password"
                                        minLength="8"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </label>
                                <p className="validator-hint hidden">
                                    Complet the password
                                </p>
                                <CustomAlert CustomAlertVisible={CustomAlertVisible} customAlertMessage={customAlertMessage} />
                            </div>
                                <button 
                                    className="btn btn-success btn-block mt-5" // Removí btn-soft si no es necesario
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
        </>
    )
 }

 export default Manager
