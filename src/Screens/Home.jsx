import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Pagination from '@mui/material/Pagination'
import Tooltip from '@mui/material/Tooltip'
import { useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import Collapse from '@mui/material/Collapse'
import Fade from '@mui/material/Fade'

const url = import.meta.env.VITE_API_URL

const enviarData = async (url, data) => {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!resp.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    return await resp.json();
  } catch (error) {
    console.error("Error en la solicitud:", error)
    throw error
  }
}

function Home() {
  const location = useLocation()
  const { nombre, nomina, area } = location.state || {}
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [implementación, setImplementacion] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [openRows, setOpenRows] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const RequestData = async () => {
    setLoading(true)
    const dataToSend = {
      aksi: "GetData",
      nn: nomina
    }
    try {
      const response = await enviarData(url, dataToSend);
      setRows(response.data);
    } catch (error) {
      console.error("Error al solicitar los datos:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    RequestData()
  }, [])

  function Row(props) {
    const { row } = props;
    const open = openRows[row.id] || false;

    const handleToggle = () => {
      setOpenRows(prev => ({
        ...prev,
        [row.id]: !prev[row.id]
      }));
    };

    const getStatusColor = (estatus) => {
      switch (estatus) {
        case "En Revision": return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "En Proceso": return "bg-blue-100 text-blue-800 border-blue-200";
        case "Liberada": return "bg-green-100 text-green-800 border-green-200";
        case "Rechazada": return "bg-red-100 text-red-800 border-red-200";
        default: return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getStatusIcon = (estatus) => {
      switch (estatus) {
        case "En Revision": return "⏳";
        case "En Proceso": return "✅";
        case "Liberada": return "🎉";
        case "Rechazada": return "❌";
        default: return "📋";
      }
    };

    return (
      <React.Fragment>
        <TableRow 
          sx={{ 
            '& > *': { borderBottom: 'unset' }, 
            '&:hover': { 
              backgroundColor: 'rgba(99, 102, 241, 0.03)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }
          }}
          className="group cursor-pointer"
        >
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleToggle}
              sx={{ 
                color: '#6366f1',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: open ? 'rotate(180deg)' : 'rotate(0)',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  transform: open ? 'rotate(180deg) scale(1.2)' : 'scale(1.2)'
                }
              }}
              className="transform transition-all duration-300 ease-out hover:shadow-md"
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell 
            component="th" 
            scope="row" 
            sx={{ 
              fontWeight: '600', 
              color: '#1f2937',
              transition: 'all 0.3s ease'
            }}
            className="group-hover:text-indigo-600 transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">💡</span>
              <span className="truncate max-w-md">{row.titulo}</span>
            </div>
          </TableCell>
          <TableCell align="right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(row.estatus)} transition-all duration-300 hover:scale-105`}>
              <span className="mr-2">{getStatusIcon(row.estatus)}</span>
              {row.estatus}
            </span>
          </TableCell>
        </TableRow>
        
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse 
              in={open} 
              timeout={400}
              easing={{
                enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
                exit: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Box 
                sx={{ 
                  margin: 2, 
                  backgroundColor: 'rgba(249, 250, 251, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3, 
                  padding: 3,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.1)',
                  border: '1px solid',
                  borderColor: 'rgba(99, 102, 241, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Efecto de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-60"></div>
                
                <div className="relative z-10">
                  <div>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      component="div" 
                      sx={{ 
                        color: '#1f2937', 
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                      className="mb-4"
                    >
                      <span className="text-2xl">
                        {row.estatus === 'En Revision' ? '⏳' : 
                         row.estatus === 'En Proceso' ? '✅' : 
                         row.estatus === 'Liberada' ? '🎉' : 
                         row.estatus === 'Rechazada' ? '❌' : '📋'}
                      </span>
                      {row.estatus === 'En Revision' ? 'En Revisión' : 
                       row.estatus === 'En Proceso' ? 'Detalles de Aprobación' : 
                       row.estatus === 'Liberada' ? '¡Propuesta Implementada!' : 
                       row.estatus === 'Rechazada' ? 'Comentarios del Revisor' : null}
                    </Typography>
                    
                    <div className="space-y-3">
                      <Typography 
                        variant="body2" 
                        component="div" 
                        sx={{ 
                          color: '#4b5563',
                          lineHeight: 1.6
                        }}
                        className="text-sm"
                      >
                        {row.estatus === 'En Revision' ? (
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600">⏳</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Tu propuesta está en proceso de revisión.</p>
                              <p className="text-gray-600 mt-1">Pronto recibirás actualizaciones sobre su estado.</p>
                            </div>
                          </div>
                        ) : row.estatus === 'En Proceso' ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-white/50 p-3 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-600 font-semibold mb-1">👤 LÍDER ASIGNADO</p>
                                <p className="text-gray-800 font-medium">{row.lider || '-'}</p>
                              </div>
                              <div className="bg-white/50 p-3 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-600 font-semibold mb-1">👥 EQUIPO</p>
                                <p className="text-gray-800 font-medium">{row.equipo_asignado || '-'}</p>
                              </div>
                              <div className="bg-white/50 p-3 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-600 font-semibold mb-1">📅 PRIMERA JUNTA</p>
                                <p className="text-gray-800 font-medium">{row.primera_junta || '-'}</p>
                              </div>
                              <div className="bg-white/50 p-3 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-600 font-semibold mb-1">⏱️ PERIODO DESARROLLO</p>
                                <p className="text-gray-800 font-medium">{row.periodo_desarrollo || '-'}</p>
                              </div>
                            </div>
                          </div>
                        ) : row.estatus === 'Liberada' ? (
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600">🎉</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">¡Felicidades! Tu propuesta ha sido implementada con éxito.</p>
                              <p className="text-gray-600 mt-1">Tu contribución ha sido valorada y ahora está en producción.</p>
                            </div>
                          </div>
                        ) : row.estatus === 'Rechazada' ? (
                          <div className="bg-red-50/50 p-4 rounded-lg border border-red-100">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600">💬</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 mb-2">Comentarios del revisor:</p>
                                <p className="text-gray-700 italic">{row.comentario || 'No se proporcionaron comentarios adicionales.'}</p>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </Typography>
                    </div>
                    
                    {/* Barra de progreso animada */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          row.estatus === 'En Revision' ? 'bg-yellow-400 w-1/4' :
                          row.estatus === 'En Proceso' ? 'bg-blue-400 w-2/3' :
                          row.estatus === 'Liberada' ? 'bg-green-400 w-full' :
                          row.estatus === 'Rechazada' ? 'bg-red-400 w-full' : 'bg-gray-400 w-1/4'
                        }`}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>En Revision</span>
                        <span>En Proceso</span>
                        <span>Implementada</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  
  Row.propTypes = {
    row: PropTypes.shape({
      titulo: PropTypes.string.isRequired,
      estatus: PropTypes.string.isRequired,
      lider: PropTypes.string,
      equipo_asignado: PropTypes.string,
      primera_junta: PropTypes.string,
      periodo_desarrollo: PropTypes.string,
      comentario: PropTypes.string,
    }).isRequired,
  }

  const itemsPerPage = 5
  const paginatedRows = rows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(rows.length / itemsPerPage)

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setImplementacion('')
      setTitulo('')
      setDescripcion('')
    }
  }

  const handleSubmit = async (e) => {  
    e.preventDefault()
    const dataToSend = {
      aksi: "Insert",
      nn: nomina,
      autor: nombre,
      fechaCreacion: currentDate.toISOString().split('T')[0],
      areaTrabajo: area,
      areaImplementacion: implementación,
      titulo: titulo,
      descripcion: descripcion
    }
    try {
      const response = await enviarData(url, dataToSend);
      if (response.estado === "success") {
        Swal.fire({
          title: '¡Propuesta enviada! 🎉',
          text: response.mensaje,
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          background: '#f8fafc',
          color: '#1e293b',
          backdrop: 'rgba(0,0,0,0.4)'
        });
        toggleModal();
        RequestData();
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar la propuesta.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        background: '#f8fafc',
        color: '#1e293b'
      })
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 p-4 md:p-6 lg:p-8">
      {/* Header mejorado */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 drop-shadow-sm">
            Mis Propuestas
          </h1>
          
          {/* Stats header */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="text-2xl font-bold text-info">{rows.length}</div>
              <div className="text-sm text-gray-600">Propuestas totales</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="text-2xl font-bold text-green-600">
                {rows.filter(r => r.estatus === 'Liberada').length}
              </div>
              <div className="text-sm text-gray-600">Implementadas</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">
                {rows.filter(r => r.estatus === 'En Proceso').length}
              </div>
              <div className="text-sm text-gray-600">En desarrollo</div>
            </div>
          </div>
        </div>
      
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-indigo-100 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-indigo-600 font-medium">Cargando propuestas...</p>
              <p className="text-sm text-gray-500">Estamos obteniendo tus datos</p>
            </div>
          </div>
        ) : (
          <>
            {/* Tabla mejorada */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden mb-8">
              <TableContainer component={Paper} elevation={0} className="bg-transparent">
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow className="bg-gradient-to-r from-red-500 to-red-800">
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', py: 2 }}>
                        <div className="flex items-center">
                          <span className="mr-2">🔍</span>
                          Detalles
                        </div>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', py: 2 }}>
                        <div className="flex items-center">
                          <span className="mr-2">💡</span>
                          Título Propuesta
                        </div>
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', py: 2 }}>
                        <div className="flex items-center justify-end">
                          <span className="mr-2">📊</span>
                          Estatus
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((row) => (
                        <Row key={row.id} row={row} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                          <div className="text-center space-y-4">
                            <div className="text-6xl text-gray-300 mb-2">📝</div>
                            <Typography variant="h6" color="textSecondary">
                              No tienes propuestas aún
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="max-w-md mx-auto">
                              ¡Comienza creando tu primera propuesta de mejora!
                            </Typography>
                            <button
                              onClick={toggleModal}
                              className="btn btn-primary mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 text-white shadow-lg transition-all duration-300 hover:scale-105"
                            >
                              <span className="mr-2">✨</span>
                              Crear primera propuesta
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Paginación mejorada */}
              {rows.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-indigo-50/30">
                  <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Mostrando <span className="font-semibold">{Math.min(itemsPerPage, paginatedRows.length)}</span> de{' '}
                    <span className="font-semibold">{rows.length}</span> propuestas
                  </div>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: '12px',
                        margin: '0 4px',
                        fontWeight: 600,
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Botón flotante mejorado */}
            <Tooltip title="Nueva Propuesta" placement="left" arrow>
              <button
                className="fixed bottom-8 right-8 btn btn-secondary btn-circle shadow-2xl hover:shadow-3xl transition-all duration-300 animate-bounce-slow z-50 group"
                onClick={toggleModal}
                aria-label="Crear nueva propuesta"
                style={{
                  width: '64px',
                  height: '64px',
                  border: 'none'
                }}
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <div className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </div>
              </button>
            </Tooltip>

            {/* Modal mejorado */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                <Fade in={isModalOpen} timeout={300}>
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200/50">
                    {/* Header del modal */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">✨</span>
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">Nueva Propuesta</h2>
                            <p className="text-indigo-100 text-sm">Completa los detalles de tu idea</p>
                          </div>
                        </div>
                        <button
                          onClick={toggleModal}
                          className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20 transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Formulario */}
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Campos de solo lectura */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold text-gray-700 flex items-center">
                                <span className="mr-2">👤</span>
                                Autor
                              </span>
                            </label>
                            <input
                              type="text"
                              name="autor"
                              value={`${nomina} - ${nombre}`}
                              readOnly
                              className="input input-bordered w-full bg-gray-50 text-gray-700"
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold text-gray-700 flex items-center">
                                <span className="mr-2">📅</span>
                                Fecha
                              </span>
                            </label>
                            <input
                              type="text"
                              value={currentDate.toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                              readOnly
                              className="input input-bordered w-full bg-gray-50 text-gray-700"
                            />
                          </div>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold text-gray-700 flex items-center">
                              <span className="mr-2">🏢</span>
                              Área de Trabajo
                            </span>
                          </label>
                          <input
                            type="text"
                            value={area}
                            readOnly
                            required
                            className="input input-bordered w-full bg-gray-50 text-gray-700"
                          />
                        </div>

                        {/* Campos editables */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold text-gray-700 flex items-center">
                                <span className="mr-2">🎯</span>
                                Área de Implementación
                              </span>
                            </label>
                            <input
                              type="text"
                              value={implementación}
                              onChange={(e) => setImplementacion(e.target.value)}
                              required
                              placeholder="Ej: Procesos, Tecnología, Recursos Humanos..."
                              className="input input-bordered w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-semibold text-gray-700 flex items-center">
                                <span className="mr-2">💡</span>
                                Título de la Idea
                              </span>
                            </label>
                            <input
                              type="text"
                              value={titulo}
                              onChange={(e) => setTitulo(e.target.value)}
                              required
                              placeholder="Ej: Automatización de reportes mensuales"
                              className="input input-bordered w-full focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                            />
                          </div>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-semibold text-gray-700 flex items-center">
                              <span className="mr-2">📝</span>
                              Descripción Detallada
                            </span>
                          </label>
                          <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                            placeholder="Describe tu propuesta en detalle, incluyendo beneficios esperados y posibles impactos..."
                            className="textarea textarea-bordered w-full h-32 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 resize-none"
                            rows="4"
                          />
                          <div className="label">
                            <span className="label-text-alt text-gray-500">
                              {descripcion.length}/500 caracteres
                            </span>
                          </div>
                        </div>

                        {/* Botones del formulario */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={toggleModal}
                            className="btn btn-outline border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <span className="mr-2">🚀</span>
                            Enviar Propuesta
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Fade>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home