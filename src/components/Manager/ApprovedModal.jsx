import React from 'react'
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
  ArrowBack
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
  LinearProgress
} from '@mui/material'
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

function ModalAprobada({ 
    selectedId, 
    selectedItem, 
    puntosAsignados, 
    setPuntosAsignados, 
    handleSaveAprobada, 
    closeModal, 
    loading, 
    actionLoading 
}) {
    const getPointsColor = (points) => {
        if (!points) return 'text.secondary'
        const numPoints = parseInt(points)
        if (numPoints >= 100) return '#059669' // verde oscuro
        if (numPoints >= 50) return '#10B981'  // verde
        if (numPoints >= 20) return '#34D399'  // verde claro
        return '#6EE7B7' // verde más claro
    }

    return (
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
            zIndex: 1400,
            p: { xs: 2, sm: 3 }
        }}>
            <Fade in={true} timeout={400}>
                <SuccessCard sx={{
                    width: '100%',
                    maxWidth: 950,
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
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'rgba(240, 253, 244, 0.5)'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
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
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'rgba(240, 253, 244, 0.5)'
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Detalles de implementación */}
                                <Box sx={{ mb: 4 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1.5,
                                        mb: 3 
                                    }}>
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
                                                    {selectedItem.primera_junta || 'Por programar'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Fecha y lugar
                                                </Typography>
                                            </DetailCard>
                                        </Grid>
                                    </Grid>
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

                                    <Box sx={{ maxWidth: 400, mx: 'auto' }}>
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

                                        {/* Sugerencias de puntos */}
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
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
    )
}

export default ModalAprobada