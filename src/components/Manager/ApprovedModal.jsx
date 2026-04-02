import React, { useEffect, useState } from 'react'
import { 
  CheckCircle, 
  Close,
  EmojiEvents,
  Schedule,
  Person,
  Groups,
  Event,
  Description,
  AccountCircle,
  Save,
  ArrowBack,
  Edit,
  Cancel,
  Delete
} from '@mui/icons-material'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Divider,
  Paper,
  Alert,
  Stack,
  IconButton,
  Fade,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

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

const url = import.meta.env.VITE_API_URL

import { styled } from '@mui/material/styles'

// Componentes estilizados
const SuccessCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.25)',
  border: `2px solid ${theme.palette.success.light}`,
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
}))

const PointsInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    fontSize: '1.25rem',
    fontWeight: 600,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.success.main,
      borderWidth: 2
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.success.main,
      borderWidth: 2
    }
  }
}))

const DetailCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.success.light}`,
  background: 'rgba(240, 253, 244, 0.5)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    background: 'rgba(240, 253, 244, 0.8)'
  }
}))

// Componente estilizado para el textfield de descripción - MÁS ANCHO
const DescriptionTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(240, 253, 244, 0.5)',
    borderRadius: theme.spacing(2),
    '& textarea': {
      fontSize: '1rem',
      lineHeight: 1.5,
      padding: theme.spacing(1.5),
      minHeight: '80px !important',
      maxHeight: '120px !important',
      overflow: 'auto',
      width: '100%',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word'
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
    fontWeight: 600,
    '&.Mui-focused': {
      color: '#10B981'
    }
  }
}))

function ModalAprobada({ 
    selectedId, 
    selectedItem, 
    puntosAsignados, 
    setPuntosAsignados, 
    handleSaveAprobada, 
    closeModal, 
    actionLoading,
    handleSaveEdit, 
    setPeriodoDesarrollo,
    setLiderManager,
    setEquipoAsignado,
    setPrimeraJunta,
    handleConfirmReject,
    comentarios,
    setComentarios
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({
        periodo_desarrollo: '',
        lider: '',
        equipo_asignado: '',
        primera_junta: ''
    })
    const [lideres, setLideres] = useState([])
    const [loadingLideres, setLoadingLideres] = useState(false)
    const [openRejectDialog, setOpenRejectDialog] = useState(false)

    const fetchLideres = async () => {
        setLoadingLideres(true)
        try {
            const LiderManager = {
                "aksi": "LiderManager",
            }
            const response = await enviarData(url, LiderManager)
            console.log('Respuesta de líderes:', response) // Debug
            
            if (response.estado === "success" && response.data) {
                setLideres(response.data)
                console.log('Líderes cargados:', response.data)
            } else {
                console.error('Error al obtener líderes:', response)
            }
        } catch (error) {
            console.error('Error en fetchLideres:', error)
        } finally {
            setLoadingLideres(false)
        }
    }

    useEffect(() => {
        fetchLideres()
    }, [])

    const getPointsColor = (points) => {
        if (!points) return 'text.secondary'
        const numPoints = parseInt(points)
        if (numPoints >= 100) return '#059669'
        if (numPoints >= 50) return '#10B981'
        if (numPoints >= 20) return '#34D399'
        return '#6EE7B7'
    }

    const obtenerFechaMinima = () => {
        const hoy = new Date();
        return hoy.toISOString().split('T')[0];
    }

    const obtenerFechaMaxima = () => {
        const hoy = new Date();
        const unAnioDespues = new Date(hoy);
        unAnioDespues.setFullYear(hoy.getFullYear() + 1);
        return unAnioDespues.toISOString().split('T')[0];
    }

    // Manejar clic en el botón de edición
    const handleEditClick = () => {
        // Asegurar que los líderes están cargados
        if (lideres.length === 0) {
            console.log('Esperando carga de líderes...')
            // Opcional: mostrar un mensaje o recargar líderes
            fetchLideres().then(() => {
                // Después de cargar, abrir edición
                openEditMode()
            })
        } else {
            openEditMode()
        }
    }

    const openEditMode = () => {
        const periodo = selectedItem.periodo_desarrollo || '';
        let lider = selectedItem.lider || '';
        const equipo = selectedItem.equipo_asignado || '';
        const junta = selectedItem.primera_junta || '';
        
        // Si selectedItem.lider es un nombre, buscar su ID
        const liderEncontrado = lideres.find(l => l.nombre === lider || l.id == lider);
        const liderId = liderEncontrado ? liderEncontrado.id : lider;
        
        console.log('Abriendo edición:', {
            liderOriginal: lider,
            liderIdEncontrado: liderId,
            liderEncontrado: liderEncontrado
        });
        
        setEditData({
            periodo_desarrollo: periodo,
            lider: liderId, // Usar el ID
            equipo_asignado: equipo,
            primera_junta: junta
        });
        
        // Actualizar los estados del padre
        setPeriodoDesarrollo(periodo);
        setLiderManager(liderId); // Enviar el ID al backend
        setEquipoAsignado(equipo);
        setPrimeraJunta(junta);
        
        setIsEditing(true);
    }
    

    const handleRejectClick = () => {
        setOpenRejectDialog(true)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Por programar'
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch {
            return dateString
        }
    }

    return (
        <>
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1300,
                p: { xs: 2, sm: 3 }
            }}>
                <Fade in={true} timeout={400}>
                    <SuccessCard sx={{
                        width: '100%',
                        maxWidth: 1600, // Aumentado de 1400 a 1600 para más espacio horizontal
                        maxHeight: '90vh',
                        overflow: 'hidden'
                    }}>
                        {/* Header con gradiente */}
                        <Box sx={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            color: 'white',
                            p: { xs: 2.5, sm: 3 }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ 
                                        bgcolor: 'white',
                                        width: 48,
                                        height: 48
                                    }}>
                                        <CheckCircle sx={{ fontSize: 32, color: '#10B981' }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            🎉 Propuesta Aprobada
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                            <Chip 
                                                label={`ID: ${selectedId}`}
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    fontWeight: 600
                                                }}
                                            />
                                            <Chip 
                                                icon={<EmojiEvents sx={{ fontSize: 16 }} />}
                                                label="Lista para implementar"
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                    color: 'white',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <IconButton 
                                    onClick={closeModal}
                                    sx={{ 
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    <Close />
                                </IconButton>
                            </Box>
                        </Box>

                        <CardContent sx={{ 
                            p: { xs: 2.5, sm: 3 },
                            overflowY: 'auto',
                            maxHeight: 'calc(90vh - 112px)'
                        }}>
                            {selectedItem ? (
                                <Box>
                                    {/* Información principal */}
                                    <Grid container spacing={3} sx={{ mb: 4 }}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Description fontSize="small" />
                                                        <Typography variant="subtitle2" fontWeight="600">
                                                            Título de la Propuesta
                                                        </Typography>
                                                    </Box>
                                                }
                                                value={selectedItem.titulo || ''}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="outlined"
                                                multiline
                                                rows={2}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: 'rgba(240, 253, 244, 0.5)'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <AccountCircle fontSize="small" />
                                                        <Typography variant="subtitle2" fontWeight="600">
                                                            Autor
                                                        </Typography>
                                                    </Box>
                                                }
                                                value={`${selectedItem.nn || ''} - ${selectedItem.nombre || ''}`}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="outlined"
                                                multiline
                                                rows={2}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: 'rgba(240, 253, 244, 0.5)'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        
                                        <Grid item xs={12}>
                                            <DescriptionTextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Description fontSize="small" />
                                                        <Typography variant="subtitle2" fontWeight="600">
                                                            Descripción Detallada
                                                        </Typography>
                                                    </Box>
                                                }
                                                value={selectedItem.descripcionProp || ''}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="outlined"
                                                helperText="Descripción completa de la propuesta (puede hacer scroll si es necesario)"
                                                FormHelperTextProps={{
                                                    sx: { ml: 1.5, mt: 0.5, fontSize: '0.7rem' }
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& textarea': {
                                                            width: '100%',
                                                            whiteSpace: 'pre-wrap',
                                                            wordBreak: 'break-word'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* Detalles de implementación con botón de edición */}
                                    <Box sx={{ mb: 4 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between',
                                            mb: 3 
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{
                                                    width: 4,
                                                    height: 24,
                                                    backgroundColor: 'success.main',
                                                    borderRadius: 2
                                                }} />
                                                <Typography variant="h6" fontWeight="bold" color="success.main">
                                                    📋 Plan de Implementación
                                                </Typography>
                                            </Box>
                                            {!isEditing && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Edit />}
                                                    onClick={handleEditClick}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        borderColor: '#10B981',
                                                        color: '#10B981',
                                                        '&:hover': {
                                                            borderColor: '#059669',
                                                            backgroundColor: 'rgba(16, 185, 129, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    Editar
                                                </Button>
                                            )}
                                        </Box>

                                        {isEditing ? (
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Período Desarrollo</InputLabel>
                                                        <Select
                                                            value={editData.periodo_desarrollo}
                                                            label="Período Desarrollo"
                                                            onChange={(e) => {
                                                                setEditData({...editData, periodo_desarrollo: e.target.value});
                                                                setPeriodoDesarrollo(e.target.value); // ← Actualizar estado padre
                                                            }}
                                                            MenuProps={{
                                                                style: { zIndex: 1400 }
                                                            }}
                                                        >
                                                            <MenuItem value="Corto plazo (1-3 meses)">
                                                                Corto plazo (1-3 meses)
                                                            </MenuItem>
                                                            <MenuItem value="Mediano plazo (3-6 meses)">
                                                                Mediano plazo (3-6 meses)
                                                            </MenuItem>
                                                            <MenuItem value="Largo plazo (6-12 meses)">
                                                                Largo plazo (6-12 meses)
                                                            </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                               <Grid item xs={12} sm={6} md={3}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Líder Asignado</InputLabel>
                                                        <Select
                                                            value={editData.lider || ''}
                                                            label="Líder Asignado"
                                                            onChange={(e) => {
                                                                const selectedLiderId = e.target.value;
                                                                setEditData({...editData, lider: selectedLiderId});
                                                                setLiderManager(selectedLiderId); // ← Actualizar estado padre
                                                            }}
                                                            MenuProps={{
                                                                style: { zIndex: 1400 }
                                                            }}
                                                            renderValue={(selected) => {
                                                                // Mostrar el nombre del líder seleccionado en lugar del ID
                                                                const selectedLider = lideres.find(l => l.id == selected);
                                                                return selectedLider ? selectedLider.nombre : selected;
                                                            }}
                                                        >
                                                            {/* Mostrar opciones de líderes */}
                                                            {lideres && lideres.length > 0 ? (
                                                                lideres.map((lider) => (
                                                                    <MenuItem key={lider.id} value={lider.id}>
                                                                        {lider.nombre} {lider.email ? `(${lider.email})` : ''}
                                                                    </MenuItem>
                                                                ))
                                                            ) : (
                                                                <MenuItem disabled>No hay líderes disponibles</MenuItem>
                                                            )}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        fullWidth
                                                        label="Equipo Asignado"
                                                        value={editData.equipo_asignado}
                                                        onChange={(e) => {
                                                            setEditData({...editData, equipo_asignado: e.target.value});
                                                            setEquipoAsignado(e.target.value); // ← Actualizar estado padre
                                                        }}
                                                        placeholder="Miembros del equipo"
                                                        multiline
                                                        rows={2}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={3}>
                                                    <TextField
                                                        fullWidth
                                                        label="Primera Junta"
                                                        type="date"
                                                        value={editData.primera_junta}
                                                        onChange={(e) => {
                                                            setEditData({...editData, primera_junta: e.target.value});
                                                            setPrimeraJunta(e.target.value); // ← Actualizar estado padre
                                                        }}
                                                        InputLabelProps={{ shrink: true }}
                                                        inputProps={{
                                                            min: obtenerFechaMinima(),
                                                            max: obtenerFechaMaxima()
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => {
                                                                setIsEditing(false);
                                                                // Restaurar valores originales si es necesario
                                                                setEditData({
                                                                    periodo_desarrollo: selectedItem.periodo_desarrollo || '',
                                                                    lider: selectedItem.lider || '',
                                                                    equipo_asignado: selectedItem.equipo_asignado || '',
                                                                    primera_junta: selectedItem.primera_junta || ''
                                                                });
                                                            }}
                                                            sx={{ borderRadius: 2 }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => {
                                                                // Guardar cambios y salir del modo edición
                                                                handleSaveEdit();
                                                                setIsEditing(false);
                                                            }}
                                                            startIcon={<Save />}
                                                            sx={{
                                                                borderRadius: 2,
                                                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                                                            }}
                                                        >
                                                            Guardar Cambios
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6} md={3}>
                                                    <DetailCard>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                            <Schedule sx={{ color: 'success.main', fontSize: 20 }} />
                                                            <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                                                                Período Desarrollo
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1" fontWeight="600" color="success.main">
                                                            {selectedItem.periodo_desarrollo || 'Por definir'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Tiempo estimado
                                                        </Typography>
                                                    </DetailCard>
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={3}>
                                                    <DetailCard>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                            <Person sx={{ color: 'success.main', fontSize: 20 }} />
                                                            <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                                                                Líder Asignado
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1" fontWeight="600" color="success.main">
                                                            {selectedItem.lider || 'Por asignar'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Responsable principal
                                                        </Typography>
                                                    </DetailCard>
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={3}>
                                                    <DetailCard>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                            <Groups sx={{ color: 'success.main', fontSize: 20 }} />
                                                            <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                                                                Equipo Asignado
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1" fontWeight="600" color="success.main">
                                                            {selectedItem.equipo_asignado || 'Por asignar'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Miembros del equipo
                                                        </Typography>
                                                    </DetailCard>
                                                </Grid>

                                                <Grid item xs={12} sm={6} md={3}>
                                                    <DetailCard>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                            <Event sx={{ color: 'success.main', fontSize: 20 }} />
                                                            <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                                                                Primera Junta
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1" fontWeight="600" color="success.main">
                                                            {formatDate(selectedItem.primera_junta)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Fecha y lugar
                                                        </Typography>
                                                    </DetailCard>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Box>

                                    {/* Asignación de puntos */}
                                    <Box sx={{ mb: 5 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1.5,
                                            mb: 3 
                                        }}>
                                            <Box sx={{
                                                width: 4,
                                                height: 24,
                                                backgroundColor: '#f59e0b',
                                                borderRadius: 2
                                            }} />
                                            <Typography variant="h6" fontWeight="bold" color="#f59e0b">
                                                🏆 Asignación de Puntos
                                            </Typography>
                                        </Box>

                                        <Alert 
                                            severity="info" 
                                            sx={{ 
                                                mb: 3, 
                                                borderRadius: 2,
                                                backgroundColor: 'rgba(59, 130, 246, 0.05)'
                                            }}
                                        >
                                            Los puntos serán asignados al autor como recompensa por su propuesta aprobada
                                        </Alert>

                                        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                                            <Box sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                                                        Puntos recomendados
                                                    </Typography>
                                                    <Typography 
                                                        variant="body2" 
                                                        fontWeight="600" 
                                                        sx={{ color: getPointsColor(puntosAsignados) }}
                                                    >
                                                        {puntosAsignados || '0'} pts
                                                    </Typography>
                                                </Box>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={Math.min((parseInt(puntosAsignados) || 0) * 100 / 200, 100)}
                                                    sx={{ 
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: 'grey.200',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: getPointsColor(puntosAsignados),
                                                            borderRadius: 4
                                                        }
                                                    }}
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">0</Typography>
                                                    <Typography variant="caption" color="text.secondary">100</Typography>
                                                    <Typography variant="caption" color="text.secondary">200+</Typography>
                                                </Box>
                                            </Box>

                                            <PointsInput
                                                fullWidth
                                                type="number"
                                                label="Cantidad de puntos a asignar"
                                                value={puntosAsignados}
                                                onChange={(e) => setPuntosAsignados(e.target.value)}
                                                placeholder="Ingrese puntos (ej: 50, 100, 150)"
                                                InputProps={{
                                                    startAdornment: (
                                                        <Box sx={{ mr: 1 }}>
                                                            <EmojiEvents sx={{ color: 'text.secondary' }} />
                                                        </Box>
                                                    ),
                                                    endAdornment: (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                                            puntos
                                                        </Typography>
                                                    )
                                                }}
                                                helperText="Los puntos pueden canjearse por recompensas en la tienda"
                                            />

                                            <Box sx={{ mt: 3 }}>
                                                <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                                                    Sugerencias rápidas:
                                                </Typography>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    {[20, 50, 75, 100, 150, 200].map((points) => (
                                                        <Chip
                                                            key={points}
                                                            label={`${points} pts`}
                                                            onClick={() => setPuntosAsignados(points.toString())}
                                                            variant={parseInt(puntosAsignados) === points ? "filled" : "outlined"}
                                                            color={parseInt(puntosAsignados) === points ? "success" : "default"}
                                                            sx={{ 
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    transform: 'scale(1.05)'
                                                                }
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Acciones */}
                                    <Divider sx={{ my: 4 }} />
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 2,
                                        flexWrap: 'wrap'
                                    }}>
                                        <Button
                                            variant="outlined"
                                            onClick={closeModal}
                                            startIcon={<ArrowBack />}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                borderColor: 'grey.300',
                                                '&:hover': {
                                                    borderColor: 'grey.400',
                                                    backgroundColor: 'grey.50'
                                                }
                                            }}
                                        >
                                            Regresar
                                        </Button>

                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={handleRejectClick}
                                                startIcon={<Cancel />}
                                                sx={{
                                                    px: 4,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontSize: '1rem',
                                                    borderColor: '#dc2626',
                                                    color: '#dc2626',
                                                    '&:hover': {
                                                        borderColor: '#b91c1c',
                                                        backgroundColor: 'rgba(220, 38, 38, 0.04)'
                                                    }
                                                }}
                                            >
                                                Rechazar
                                            </Button>
                                            
                                            <Button
                                                variant="contained"
                                                onClick={handleSaveAprobada}
                                                disabled={actionLoading || !puntosAsignados}
                                                startIcon={
                                                    actionLoading ? 
                                                    <CircularProgress size={20} color="inherit" /> : 
                                                    <Save />
                                                }
                                                sx={{
                                                    px: 4,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                                    boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                                        boxShadow: '0 6px 20px 0 rgba(16, 185, 129, 0.5)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    '&:disabled': {
                                                        background: 'grey.300',
                                                        boxShadow: 'none'
                                                    },
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {actionLoading ? 'Asignando puntos...' : 'Asignar Puntos'}
                                            </Button>
                                        </Box>
                                    </Box>

                                    {!puntosAsignados && (
                                        <Alert severity="warning" sx={{ mt: 3, borderRadius: 2 }}>
                                            ⚠️ Debe asignar puntos antes de guardar
                                        </Alert>
                                    )}
                                </Box>
                            ) : (
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    height: 300
                                }}>
                                    <CircularProgress 
                                        size={60} 
                                        sx={{ 
                                            color: '#10B981',
                                            mb: 3 
                                        }} 
                                    />
                                    <Typography variant="h6" color="success.main" fontWeight="600" gutterBottom>
                                        Cargando detalles...
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Estamos obteniendo la información completa de la propuesta
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </SuccessCard>
                </Fade>
            </Box>

            {/* Diálogo de rechazo */}
            <Dialog 
                open={  openRejectDialog} 
                onClose={() => setOpenRejectDialog(false)}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiDialog-container': {
                        zIndex: 1400
                    }
                }}
                PaperProps={{
                    sx: {
                        zIndex: 1400
                    }
                }}
            >
                <DialogTitle sx={{ 
                    backgroundColor: '#fef2f2',
                    borderBottom: '1px solid #fecaca',
                    color: '#dc2626'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Cancel />
                        <Typography variant="h6" fontWeight="bold">
                            Rechazar Propuesta
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        ¿Está seguro que desea rechazar esta propuesta? Esta acción no se puede deshacer.
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Razón del rechazo"
                        value={comentarios}
                        onChange={(e) => setComentarios(e.target.value)}
                        placeholder="Describa detalladamente las razones por las cuales se rechaza esta propuesta..."
                        variant="outlined"
                        required
                        autoFocus
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
                    <Button 
                        onClick={() => setOpenRejectDialog(false)}
                        variant="outlined"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleConfirmReject}
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                    >
                        Rechazar Propuesta
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ModalAprobada