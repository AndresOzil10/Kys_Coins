import React, { useEffect, useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Pagination from '@mui/material/Pagination'
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'

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
      throw new Error(`Error ${resp.status}: ${resp.statusText}`)
    }
    return await resp.json()
  } catch (error) {
    console.error("Error en la solicitud:", error)
    throw error
  }
}

// Función para formatear fecha sin date-fns
const formatFecha = (fechaString) => {
  if (!fechaString) return 'Fecha no disponible'
  
  try {
    const fecha = new Date(fechaString)
    if (isNaN(fecha.getTime())) return 'Fecha inválida'
    
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return fecha.toLocaleDateString('es-ES', opciones)
  } catch (error) {
    console.error('Error formateando fecha:', error)
    return 'Fecha no disponible'
  }
}

// Componente de estado con colores personalizados
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || ''
    switch (statusLower) {
      case 'liberada':
        return {
          label: 'Liberada',
          bgColor: '#dcfce7',
          textColor: '#166534',
          borderColor: '#22c55e'
        }
      case 'rechazada':
        return {
          label: 'Rechazada',
          bgColor: '#fee2e2',
          textColor: '#991b1b',
          borderColor: '#ef4444'
        }
      default:
        return {
          label: status || 'Desconocido',
          bgColor: '#e5e7eb',
          textColor: '#4b5563',
          borderColor: '#9ca3af'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`,
        fontWeight: '600',
        fontSize: '0.75rem',
        height: '24px'
      }}
    />
  )
}

function Allproposals() {
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const RequestData = async () => {
    setLoading(true)
    const dataToSend = {
      aksi: "GetAllProposals"
    }
    try {
      const response = await enviarData(url, dataToSend)
      // Filtrar y formatear fechas
      const filteredData = response.data
        ?.filter(row => row.estatus === 'Liberada' || row.estatus === 'Rechazada')
        ?.map(row => ({
          ...row,
          fechaFormateada: formatFecha(row.fechaCreacion)
        })) || []
      
      setRows(filteredData)
      setFilteredRows(filteredData)
    } catch (error) {
      console.error("Error al solicitar los datos:", error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos. Por favor, intente nuevamente.',
        icon: 'error',
        confirmButtonText: 'Reintentar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          RequestData()
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    RequestData()
  }, [])

  // Usar useMemo para optimizar el filtrado
  const paginatedRows = useMemo(() => {
    const filtered = searchTerm
      ? rows.filter(row => {
          const searchLower = searchTerm.toLowerCase()
          return (
            row.titulo?.toLowerCase().includes(searchLower) ||
            row.estatus?.toLowerCase().includes(searchLower) ||
            row.nombre?.toLowerCase().includes(searchLower) ||
            row.nn?.toLowerCase().includes(searchLower) ||
            row.areaImp?.toLowerCase().includes(searchLower) ||
            row.descripcionProp?.toLowerCase().includes(searchLower)
          )
        })
      : rows
    
    setFilteredRows(filtered)
    if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
      setCurrentPage(1)
    }
    
    return filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
  }, [rows, searchTerm, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage)

  function Row({ row }) {
    const [open, setOpen] = useState(false)

    return (
      <React.Fragment>
        <TableRow 
          sx={{ 
            '& > *': { borderBottom: 'unset' },
            '&:hover': { 
              backgroundColor: '#f8fafc',
              transition: 'background-color 0.2s ease'
            },
            cursor: 'pointer'
          }}
          onClick={() => setOpen(!open)}
        >
          <TableCell>
            <IconButton
              aria-label={open ? "Contraer detalles" : "Expandir detalles"}
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(!open)
              }}
              sx={{ 
                color: '#6366f1',
                transition: 'transform 0.2s ease',
                '&:hover': { 
                  backgroundColor: '#eef2ff',
                  transform: 'scale(1.1)'
                }
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: '600', 
                color: '#1f2937',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {row.titulo || 'Sin título'}
            </Typography>
          </TableCell>
          <TableCell>
            <Tooltip title={row.nn && row.nombre ? `${row.nn} ${row.nombre}` : 'Autor no disponible'}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6b7280',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '150px'
                }}
              >
                {row.nn && row.nombre ? `${row.nn} ${row.nombre}` : 'N/A'}
              </Typography>
            </Tooltip>
          </TableCell>
          <TableCell align="right">
            <StatusBadge status={row.estatus} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ 
                margin: 2, 
                backgroundColor: '#f9fafb', 
                borderRadius: 3, 
                padding: 3,
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: '#1f2937', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  {row.estatus === 'Liberada' ? '🎉 Propuesta Implementada' : '📝 Comentarios de Rechazo'}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#4b5563',
                      lineHeight: 1.6,
                      mb: 2
                    }}
                  >
                    {row.estatus === 'Liberada' 
                      ? '¡Felicidades! Esta propuesta ha sido implementada con éxito y está generando valor para la organización.'
                      : `Lamentablemente, esta propuesta ha sido rechazada. ${row.comentario || 'No hay comentarios adicionales disponibles.'}`
                    }
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 2,
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <Tooltip title="Fecha de creación">
                      <Chip
                        icon={<span>📅</span>}
                        label={row.fechaFormateada}
                        size="small"
                        variant="outlined"
                        sx={{ backgroundColor: 'white' }}
                      />
                    </Tooltip>
                    
                    {row.areaImp && (
                      <Tooltip title="Área de implementación">
                        <Chip
                          icon={<span>🏢</span>}
                          label={row.areaImp}
                          size="small"
                          variant="outlined"
                          sx={{ backgroundColor: 'white' }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </Box>
                
                {row.descripcionProp && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: '#374151', 
                        fontWeight: '600',
                        mb: 1
                      }}
                    >
                      Descripción de la propuesta:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6b7280',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {row.descripcionProp}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    // Scroll suave hacia arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Estadísticas
  const liberadasCount = rows.filter(r => r.estatus === 'Liberada').length
  const rechazadasCount = rows.filter(r => r.estatus === 'Rechazada').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-4">
            Propuestas Finalizadas
          </h1>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Revisa el historial de propuestas que han sido liberadas o rechazadas
          </Typography>
        </div>

        {/* Buscador */}
        <div className="mb-8">
          <Paper 
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por título, autor, área o estatus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#10b981' }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      sx={{ color: '#9ca3af' }}
                    >
                      ✕
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#10b981',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#10b981',
                    borderWidth: '2px'
                  },
                },
              }}
            />
            {searchTerm && (
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  mt: 1,
                  ml: 2,
                  color: '#6b7280'
                }}
              >
                {filteredRows.length} propuesta{filteredRows.length !== 1 ? 's' : ''} encontrada{filteredRows.length !== 1 ? 's' : ''}
              </Typography>
            )}
          </Paper>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '400px',
              gap: 2
            }}
          >
            <CircularProgress 
              size={60}
              sx={{ 
                color: '#10b981',
                animationDuration: '800ms'
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#374151',
                mt: 2
              }}
            >
              Cargando propuestas...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Resumen rápido */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#dcfce7',
                  minWidth: '120px',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ color: '#166534', fontWeight: 'bold' }}>
                  {liberadasCount}
                </Typography>
                <Typography variant="body2" sx={{ color: '#166534' }}>
                  Liberadas
                </Typography>
              </Paper>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#fee2e2',
                  minWidth: '120px',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ color: '#991b1b', fontWeight: 'bold' }}>
                  {rechazadasCount}
                </Typography>
                <Typography variant="body2" sx={{ color: '#991b1b' }}>
                  Rechazadas
                </Typography>
              </Paper>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#e0f2fe',
                  minWidth: '120px',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" sx={{ color: '#0c4a6e', fontWeight: 'bold' }}>
                  {rows.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#0c4a6e' }}>
                  Total
                </Typography>
              </Paper>
            </Box>

            {/* Tabla */}
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                border: '1px solid #e5e7eb',
                mb: 4
              }}
            >
              <TableContainer>
                <Table aria-label="tabla de propuestas finalizadas">
                  <TableHead>
                    <TableRow sx={{ 
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      '& th': {
                        borderBottom: 'none',
                        py: 3
                      }
                    }}>
                      <TableCell sx={{ width: '60px', color: 'white', fontWeight: 'bold' }} />
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                        Título de la Propuesta
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                        Autor
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
                        Estado
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((row, index) => (
                        <Row key={`${row.id || index}-${index}`} row={row} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Box 
                            sx={{ 
                              textAlign: 'center', 
                              py: 8,
                              color: '#9ca3af'
                            }}
                          >
                            <Typography 
                              variant="h6" 
                              sx={{ mb: 1 }}
                            >
                              No se encontraron propuestas
                            </Typography>
                            <Typography variant="body2">
                              {searchTerm 
                                ? 'Intenta con otros términos de búsqueda'
                                : 'No hay propuestas finalizadas disponibles'
                              }
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Paginación */}
              {totalPages > 1 && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    p: 3,
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 }
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: '10px',
                        margin: '0 2px',
                        fontSize: '0.875rem',
                        '&.Mui-selected': {
                          backgroundColor: '#10b981',
                          color: 'white',
                          fontWeight: 'bold',
                          '&:hover': {
                            backgroundColor: '#059669'
                          }
                        },
                        '&:hover': {
                          backgroundColor: '#e5e7eb'
                        }
                      }
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: { sm: 3 },
                      color: '#6b7280',
                      textAlign: 'center'
                    }}
                  >
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredRows.length)} de {filteredRows.length} propuestas
                  </Typography>
                </Box>
              )}
            </Paper>
          </>
        )}
      </div>
    </div>
  )
}

export default Allproposals