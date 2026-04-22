import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Swal from 'sweetalert2';

const url = import.meta.env.VITE_API_URL

const enviarData = async (url, data) => {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!resp.ok) {
      throw new Error('Error en la respuesta de la API')
    }
    return await resp.json();
  } catch (error) {
    console.error("Error en la solicitud:", error)
    throw error
  }
}

function TablePay({toggleModalPay, total, cartSummary, nomina: propNomina}) {
    const location = useLocation()
    const { nomina: locationNomina } = location.state || {}
    const nomina = propNomina || locationNomina
    
    const [items, setItems] = useState([])

    const ListOfPay = async () =>{
        const dataToSend = {
            aksi: "GetListPointPay",
            nomina: nomina
        }

        try {
            const data = await enviarData(url, dataToSend);
            setItems(data.data)
        } catch (error) {
            console.error("Error fetching pay list:", error);
        }
    }

    useEffect(() => {
        if (nomina) {
            ListOfPay()
        }
    }, [nomina])

    const Payment = async () => {
        // obtener checkboxes seleccionados
        const selected = Array.from(document.querySelectorAll('.modal-box input[type="checkbox"]:checked'))
            .map(input => input.value);

        if (selected.length === 0) {
            Swal.fire({
                title: '¡Atención!',
                text: 'Seleccione al menos un punto para realizar el pago.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        // Crear un array con los IDs de productos respetando las cantidades (PERMITE DUPLICADOS)
        const expandedProducts = [];
        cartSummary.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
                expandedProducts.push({
                    id: item.id,
                    cartId: item.cartId,
                    nombre: item.nombre,
                    puntos: item.puntos
                });
            }
        });

        console.log('Productos a enviar (con duplicados):', expandedProducts);
        console.log('IDs de productos (con duplicados):', expandedProducts.map(p => p.id));

        const payload = {
            aksi: 'PaySelectedPoints',
            nomina: nomina,
            total: total,
            ids: selected,
            ids_product: expandedProducts.map(item => item.id) // Esto enviará IDs duplicados si el mismo producto se agregó múltiples veces
        }
        
        console.log('Payload enviado:', payload);

        try {
            const response = await enviarData(url, payload)
            console.log(response)
            if (response.estado === 'success') {
              toggleModalPay();
              Swal.fire({
                  title: '¡Pago exitoso!',
                  text: response.mensaje || 'Tu compra se ha realizado correctamente.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
              })
            } else {
              Swal.fire({
                title: '¡Error!',
                text: response.mensaje || 'Ocurrió un error al procesar el pago.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
        } catch (error) {
            console.error("Error en el pago:", error);
            Swal.fire({
                title: '¡Error!',
                text: 'Error de conexión al procesar el pago.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }

  return (
    <>
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Seleccione la cantidad de puntos:</h3>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Check</th>
                        <th>Titulo</th>
                        <th>Puntos</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center">No hay datos</td>
                        </tr>
                    ) : (
                        items.map((item, index) => (
                            <tr key={item.id ?? item.ID ?? index}>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" value={item.id} />
                                    </label>
                                </th>
                                <td>{item.titulo}</td>
                                <td>{item.puntosOtorgados ?? item.puntosRestantes}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th></th>
                        <th>Titulo</th>
                        <th>Puntos</th>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <div className="flex space-x-3 mt-4">
                <button 
                  className="btn btn-success flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transition duration-200"
                  onClick={Payment}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Comprar ({total} pts)
                </button>
              <button className="btn btn-outline btn-ghost flex-1 hover:bg-gray-100 transition duration-200" onClick={toggleModalPay}>Cerrar</button> 
            </div>
          </div>
        </div>
    </>
  )
}

export default TablePay