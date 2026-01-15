import React, { useEffect, useState } from 'react'
import { 
  Visibility, 
  CheckCircle, 
  Cancel,
  Search,
  Refresh,
  Warning,
  Schedule,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
  Info
} from '@mui/icons-material'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  CircularProgress,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Grid,
  Alert,
  Button,
  IconButton
} from '@mui/material'
import ModalAprobada from '../components/Manager/ApprovedModal'
import CreatedModal from '../components/Manager/CreateModal'
import Swal from 'sweetalert2'
import { styled } from '@mui/material/styles'
import useProposalLock from '../components/functions/useProposalLock'
import { useLocation } from 'react-router-dom'

const url = import.meta.env.VITE_API_URL

const enviarData = async (url, data) => {
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const json = await resp.json()
  return json
}

// Componentes estilizados
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  overflow: 'hidden'
}))

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = 'default'
  let bgColor = 'grey.100'
  
  if (status === 'En Revision') {
    color = '#f59e0b'
    bgColor = 'rgba(245, 158, 11, 0.1)'
  } else if (status === 'Aprobada') {
    color = '#10b981'
    bgColor = 'rgba(16, 185, 129, 0.1)'
  } else if (status === 'Rechazada') {
    color = '#ef4444'
    bgColor = 'rgba(239, 68, 68, 0.1)'
  }
  
  return {
    backgroundColor: bgColor,
    color: color,
    fontWeight: 600,
    border: `1px solid ${color}20`,
    '& .MuiChip-icon': {
      color: color
    }
  }
})

// Componente personalizado de paginación
const CustomPagination = ({ 
  count, 
  page, 
  onChange, 
  disabled = false,
  showFirstLast = true 
}) => {
  const handleChange = (event, value) => {
    if (!disabled) {
      onChange(event, value)
    }
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: 1,
      flexWrap: 'wrap'
    }}>
      {/* Botón Primera Página */}
      {showFirstLast && (
        <Tooltip title="Primera página">
          <span>
            <IconButton
              onClick={(e) => handleChange(e, 1)}
              disabled={disabled || page <= 1}
              size="small"
              sx={{ 
                color: page <= 1 ? 'grey.400' : 'primary.main',
                '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.08)' }
              }}
            >
              <FirstPage />
            </IconButton>
          </span>
        </Tooltip>
      )}

      {/* Botón Anterior */}
      <Tooltip title="Página anterior">
        <span>
          <IconButton
            onClick={(e) => handleChange(e, page - 1)}
            disabled={disabled || page <= 1}
            size="small"
            sx={{ 
              color: page <= 1 ? 'grey.400' : 'primary.main',
              '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.08)' }
            }}
          >
            <NavigateBefore />
          </IconButton>
        </span>
      </Tooltip>

      {/* Números de página */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {Array.from({ length: Math.min(3, count) }, (_, i) => {
          let pageNum = i + 1
          if (page > 2 && page < count - 1) {
            pageNum = page - 1 + i
          } else if (page >= count - 1) {
            pageNum = count - 2 + i
          }
          
          if (pageNum < 1 || pageNum > count) return null
          
          return (
            <Button
              key={pageNum}
              onClick={(e) => handleChange(e, pageNum)}
              variant={page === pageNum ? "contained" : "outlined"}
              size="small"
              sx={{
                minWidth: '36px',
                height: '36px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: page === pageNum ? 600 : 400,
                backgroundColor: page === pageNum ? 'primary.main' : 'transparent',
                color: page === pageNum ? 'white' : 'text.primary',
                borderColor: page === pageNum ? 'primary.main' : 'divider',
                '&:hover': {
                  backgroundColor: page === pageNum ? 'primary.dark' : 'action.hover',
                  borderColor: page === pageNum ? 'primary.dark' : 'primary.main'
                }
              }}
            >
              {pageNum}
            </Button>
          )
        })}
        
        {/* Puntos suspensivos si hay muchas páginas */}
        {count > 5 && page < count - 2 && (
          <Typography sx={{ mx: 0.5, color: 'text.secondary' }}>...</Typography>
        )}
        
        {/* Última página si hay muchas */}
        {count > 5 && page < count - 1 && (
          <Button
            onClick={(e) => handleChange(e, count)}
            variant="outlined"
            size="small"
            sx={{
              minWidth: '36px',
              height: '36px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: page === count ? 600 : 400,
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderColor: 'primary.main'
              }
            }}
          >
            {count}
          </Button>
        )}
      </Box>

      {/* Botón Siguiente */}
      <Tooltip title="Página siguiente">
        <span>
          <IconButton
            onClick={(e) => handleChange(e, page + 1)}
            disabled={disabled || page >= count}
            size="small"
            sx={{ 
              color: page >= count ? 'grey.400' : 'primary.main',
              '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.08)' }
            }}
          >
            <NavigateNext />
          </IconButton>
        </span>
      </Tooltip>

      {/* Botón Última Página */}
      {showFirstLast && (
        <Tooltip title="Última página">
          <span>
            <IconButton
              onClick={(e) => handleChange(e, count)}
              disabled={disabled || page >= count}
              size="small"
              sx={{ 
                color: page >= count ? 'grey.400' : 'primary.main',
                '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.08)' }
              }}
            >
              <LastPage />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </Box>
  )
}

function HomeManager() {
  const location = useLocation()
  const { nombre } = location.state || {}
  const [pending, setPending] = useState([])
  const [filteredPending, setFilteredPending] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingTable, setLoadingTable] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionLoad, setActionLoad] = useState(false)
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  // Estados para checkboxes y campos
  const [acceptChecked, setAcceptChecked] = useState(false)
  const [rejectChecked, setRejectChecked] = useState(false)
  const [periodoDesarrollo, setPeriodoDesarrollo] = useState('')
  const [liderManager, setLiderManager] = useState('')
  const [equipoAsignado, setEquipoAsignado] = useState('')
  const [primeraJunta, setPrimeraJunta] = useState('')
  const [comentarios, setComentarios] = useState('')
  const [puntosAsignados, setPuntosAsignados] = useState('')
  const {isProposalLocked, lockProposal, getLockInfo, releaseProposalLock, userSesssionId} = useProposalLock(url) 
  const [locallyLockedProposals, setLocallyLockedProposals] = useState({})

  const handleOpenModal = async (item) => {
  // Verificar si está bloqueada
    if (isProposalLocked(item.id)) {
      const lockInfo = getLockInfo(item.id)
      Swal.fire({
        title: '⚠️ Propuesta en uso',
        html: lockInfo ? 
          `Esta propuesta está siendo editada por <strong>${lockInfo.userName}</strong><br>
          <small>Desde: ${new Date(lockInfo.lockedAt).toLocaleTimeString()}</small>` :
          'Otro usuario está gestionando esta propuesta en este momento.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#4F46E5',
        timer: 4000
      })
      return
    }
    console.log('Intentando bloquear propuesta:', item.id, nombre)
    // Intentar bloquear
    const locked = await lockProposal(item.id, nombre)
    if (!locked) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo bloquear la propuesta. Inténtalo de nuevo.',
        icon: 'error'
      })
      return
    }

    // Registrar bloqueo local
    setLocallyLockedProposals(prev => ({
      ...prev,
      [item.id]: true
    }))

    // Abrir modal
    setSelectedId(item.id)
    setSelectedStatus(item.estatus)
  }

  // Estados para paginación - AHORA 4 REGISTROS POR PÁGINA
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4 // Cambiado de 8 a 4

  // Estadísticas
  const [stats, setStats] = useState({
    total: 0,
    EnRevision: 0,
    EnProceso: 0,
    rechazadas: 0
  })

  const fetchData = async () => {
    setLoadingTable(true)
    const Pendientes = {
      "aksi": "Pendiente",
    }
    try {
      const respuesta = await enviarData(url, Pendientes)
      if (respuesta.estado === 'success') {
        const data = respuesta.data || []
        setPending(data)
        setFilteredPending(data)
        
        // Calcular estadísticas
        const statsData = {
          total: data.length,
          EnRevision: data.filter(item => item.estatus === 'En Revision').length,
          EnProceso: data.filter(item => item.estatus === 'En Proceso').length,
          rechazadas: data.filter(item => item.estatus === 'Rechazada').length
        }
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error fetching groups:", error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las propuestas',
        icon: 'error'
      })
    }
    setLoadingTable(false)
  }

  const fetchItemDetails = async (id) => {
    setLoading(true)
    const data = {
      "aksi": "GetItemDetails",
      "id": id
    }
    try {
      const respuesta = await enviarData(url, data)
      if (respuesta.estado === 'success') {
        setSelectedItem(respuesta.data[0])
        if (selectedStatus === 'Liberada') {
          setPuntosAsignados(respuesta.data[0].puntosAsignados || '')
        }
      }
    } catch (error) {
      console.error("Error fetching item details:", error)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!acceptChecked && !rejectChecked) {
      Swal.fire({
        title: 'Selecciona una opción',
        text: 'Debes seleccionar Aceptar o Rechazar',
        icon: 'warning'
      })
      return
    }
    setActionLoading(true)
    const action = acceptChecked ? 'approve' : 'reject'
    const data = {
      "aksi": action === 'approve' ? "ApproveProposal" : "RejectProposal",
      "id": selectedId,
      ...(action === 'approve' && {
        "periodoDesarrollo": periodoDesarrollo,
        "lider": liderManager,
        "equipoAsignado": equipoAsignado,
        "primeraJunta": primeraJunta,
        "comentarios": comentarios
      }),
      ...(action === 'reject' && {
        "comentarios": comentarios
      })
    }
    
    try {
      const respuesta = await enviarData(url, data)
      if (respuesta.estado === 'success') {
        fetchData()
        closeModal()
        Swal.fire({
          title: respuesta.mensaje,
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        })
      } else {
        Swal.fire({
          title: respuesta.mensaje,
          icon: "error"
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo procesar la acción',
        icon: 'error'
      })
    }
    setActionLoading(false)
  }

  const handleSaveAprobada = async () => {
    if (!puntosAsignados || parseInt(puntosAsignados) <= 0) {
      Swal.fire({
        title: 'Puntos inválidos',
        text: 'Debes asignar una cantidad válida de puntos',
        icon: 'warning'
      })
      return
    }
    
    setActionLoad(true)
    const data = {
      "aksi": "UpdatePuntosAsignados",
      "id": selectedId,
      "puntosAsignados": puntosAsignados
    }
    
    try {
      const respuesta = await enviarData(url, data)
      if (respuesta.estado === 'success') {
        fetchData()
        closeModal()
        Swal.fire({
          title: respuesta.mensaje,
          icon: "success",
          showConfirmButton: false,
          timer: 2000
        })
      } else {
        Swal.fire({
          title: respuesta.mensaje,
          icon: "error"
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron guardar los puntos',
        icon: 'error'
      })
    }
    setActionLoad(false)
  }

  // Filtrar y ordenar datos
  useEffect(() => {
    let result = [...pending]
    
    // Filtrar por búsqueda
    if (searchTerm) {
      result = result.filter(item => 
        item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nn?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      result = result.filter(item => item.estatus === statusFilter)
    }
    
    // Ordenar
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.titulo?.localeCompare(b.titulo))
    }
    
    setFilteredPending(result)
    setCurrentPage(1) // Resetear a primera página al filtrar
  }, [pending, searchTerm, statusFilter, sortBy])

  // Cálculo de paginación con 4 registros
  const totalPages = Math.ceil(filteredPending.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredPending.slice(startIndex, endIndex)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedId) {
      fetchItemDetails(selectedId)
    }
  }, [selectedId])

  const closeModal = () => {
    if (selectedId) {
      releaseProposalLock(selectedId)
      // Remover bloqueo local
      setLocallyLockedProposals(prev => {
        const newLocks = { ...prev }
        delete newLocks[selectedId]
        return newLocks
      })
    }
    setSelectedId(null)
    setSelectedItem(null)
    setSelectedStatus(null)
    setAcceptChecked(false)
    setRejectChecked(false)
    setPeriodoDesarrollo('')
    setLiderManager('')
    setEquipoAsignado('')
    setPrimeraJunta('')
    setComentarios('')
    setPuntosAsignados('')
  }

  // Manejar cambio de página
  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    // Scroll suave al inicio de la tabla
    const tableElement = document.querySelector('.MuiTableContainer-root')
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Función para renderizar el botón de acción
  const renderActionButton = (item) => {
  const isLocked = isProposalLocked(item.id)
  const lockInfo = getLockInfo(item.id)
  const isLocallyLocked = locallyLockedProposals[item.id]

  // Si está bloqueada por otro usuario
  if (isLocked && !isLocallyLocked) {
    return (
      <Tooltip title={lockInfo ? 
        `Editando: ${lockInfo.userName}` : 
        "En uso por otro usuario"
      }>
        <span>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Schedule />}
            disabled
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              borderColor: '#f59e0b',
              color: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              cursor: 'not-allowed',
              '&:disabled': {
                opacity: 0.8
              }
            }}
          >
            En uso
          </Button>
        </span>
      </Tooltip>
    )
  }

  // Si el usuario actual tiene el bloqueo
  if (isLocallyLocked) {
    return (
      <Tooltip title="Tú estás editando esta propuesta">
        <Button
          variant="contained"
          size="small"
          startIcon={<CheckCircle />}
          onClick={() => {
            setSelectedId(item.id)
            setSelectedStatus(item.estatus)
          }}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            backgroundColor: '#10b981',
            '&:hover': {
              backgroundColor: '#059669'
            }
          }}
        >
          Editando...
        </Button>
      </Tooltip>
    )
  }

  // Propuesta disponible para editar
  return (
    <Tooltip title="Ver detalles y tomar acción">
      <Button
        variant="contained"
        size="small"
        startIcon={<Visibility />}
        onClick={() => handleOpenModal(item)}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          backgroundColor: '#4F46E5',
          '&:hover': {
            backgroundColor: '#4338CA'
          }
        }}
      >
        Gestionar
      </Button>
    </Tooltip>
  )
  }
  

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      p: { xs: 2, md: 3 },
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#1e293b" gutterBottom>
          📋 Gestión de Propuestas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Revisa y gestiona todas las propuestas de mejora
        </Typography>
      </Box>

      {/* Cards de estadísticas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold">{stats.total}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Propuestas</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold">{stats.EnRevision}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>En Revisión</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold">{stats.EnProceso}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>En Proceso</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            {/* <CardContent>
              <Typography variant="h3" fontWeight="bold">{stats.rechazadas}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Rechazadas</Typography>
            </CardContent> */}
          </Card>
        </Grid>
      </Grid>

      {/* Filtros y controles */}
      <StyledCard sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Buscar propuestas por título, nombre o nómina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <Cancel fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Select
                fullWidth
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
                displayEmpty
              >
                <MenuItem value="all">Todos los estados</MenuItem>
                <MenuItem value="En Revision">En Revision</MenuItem>
                <MenuItem value="En Proceso">En Proceso</MenuItem>
                {/* <MenuItem value="Rechazada">Rechazadas</MenuItem> */}
              </Select>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Select
                fullWidth
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
              >
                <MenuItem value="recent">Más recientes</MenuItem>
                <MenuItem value="title">Orden alfabético</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Tabla */}
      <StyledCard className='mb-20'>
        {loadingTable ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress size={60} sx={{ color: '#3b82f6' }} />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                  }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Propuesta</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Autor</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Estado</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'center' }}>Fecha</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem', textAlign: 'center' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Schedule sx={{ fontSize: 60, color: '#9ca3af', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary">
                            No hay propuestas
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {searchTerm || statusFilter !== 'all' 
                              ? 'No se encontraron resultados con los filtros aplicados' 
                              : 'No hay propuestas pendientes de revisión'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((item) => (
                      <TableRow 
                        key={item.id} 
                        hover
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'rgba(79, 70, 229, 0.04)' 
                          },
                          height: '80px' // Altura fija para mejor visualización con 4 registros
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="600" noWrap sx={{ maxWidth: '200px' }}>
                              {item.titulo}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Área: {item.areaImp}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {item.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Nómina: {item.nn}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <StatusChip 
                            icon={item.estatus === 'En Revision' ? <Warning /> : 
                                  item.estatus === 'En Proceso' ? <CheckCircle /> : 
                                  <Cancel />}
                            label={item.estatus}
                            status={item.estatus}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {new Date(item.fechaCreacion).toLocaleDateString('es-MX', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {renderActionButton(item)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación personalizada de 4 registros */}
            {filteredPending.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Mostrando <strong>{startIndex + 1}-{Math.min(endIndex, filteredPending.length)}</strong> de <strong>{filteredPending.length}</strong> propuestas
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    (4 registros por página)
                  </Typography>
                </Box>

                {/* Paginación personalizada */}
                <CustomPagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  disabled={loadingTable}
                  showFirstLast={totalPages > 1}
                />

                
              </Box>
            )}
          </>
        )}
      </StyledCard>

      {/* Modales */}
      {selectedId && selectedStatus === 'En Revision' && (
        <CreatedModal 
          selectedId={selectedId}
          selectedItem={selectedItem}
          acceptChecked={acceptChecked}
          setAcceptChecked={setAcceptChecked}
          rejectChecked={rejectChecked}
          setRejectChecked={setRejectChecked}
          periodoDesarrollo={periodoDesarrollo}
          setPeriodoDesarrollo={setPeriodoDesarrollo}
          liderManager={liderManager}
          setLiderManager={setLiderManager}
          equipoAsignado={equipoAsignado}
          setEquipoAsignado={setEquipoAsignado}
          primeraJunta={primeraJunta}
          setPrimeraJunta={setPrimeraJunta}
          comentarios={comentarios}
          setComentarios={setComentarios}
          handleSave={handleSave}
          closeModal={closeModal}
          loading={loading}
          actionLoading={actionLoading}
        />
      )}

      {selectedId && selectedStatus === 'En Proceso' && (
        <ModalAprobada 
          selectedId={selectedId}
          selectedItem={selectedItem}
          puntosAsignados={puntosAsignados}
          setPuntosAsignados={setPuntosAsignados}
          handleSaveAprobada={handleSaveAprobada}
          closeModal={closeModal}
          loading={loading}
          actionLoad={actionLoad}
        />
      )}
    </Box>
  )
}

export default HomeManager