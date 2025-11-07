import React, { useEffect, useState } from 'react'

const url = import.meta.env.VITE_API_URL

const enviarData = async (url, data) => {
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const json = await resp.json();
  return json;
}

function HomeManager() {
    const [pending, setPending] = useState([])

  const fetchData = async () => {
        const Pendientes = {
            "aksi": "Pendiente",
        }
        const respuesta = await enviarData(url, Pendientes)
        if (respuesta.estado === 'success') {
            setPending (respuesta.data)
        } else {
            console.error("Error fetching groups:", respuesta.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

  return (
    <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>Título</th>
        <th>Estatus</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      {pending.map((item, index) => (
        <tr key={index}>
          <td>
            <div className="flex items-center gap-3">
              <div>
                <div className="font-bold">{item.titulo}</div>
                <div className="text-sm opacity-50">{item.nn +" - "+item.nombre}</div>
              </div>
            </div>
          </td>
          <td>
            <span className={`badge ${item.estatus === 'Creada' ? 'badge-warning' : item.estatus === 'revision' ? 'badge-info' : 'badge-ghost'}`}>
              {item.estatus}
            </span>
          </td>
          <th>
            <button className="btn btn-ghost btn-xs">View</button>
          </th>
        </tr>
      ))}
    </tbody>
    {/* foot */}
    <tfoot>
      <tr>
        <th>Título</th>
        <th>Estatus</th>
        <th>Acción</th>
      </tr>
    </tfoot>
  </table>
</div>
  )
}

export default HomeManager