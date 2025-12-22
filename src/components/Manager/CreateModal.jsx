import React from 'react'
import { 
  Visibility, 
  CheckCircle, 
  Cancel, 
  Schedule,
  Person,
  Groups,
  Event,
  Comment,
  Save,
  Close
} from '@mui/icons-material'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Checkbox,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Alert,
  Stack,
  IconButton,
  Fade,
  Grow
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Componentes estilizados
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  overflow: 'hidden'
}))

const DecisionChip = styled(Chip)(({ theme, decision }) => ({
  fontWeight: 600,
  backgroundColor: decision === 'accept' 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(239, 68, 68, 0.1)',
  color: decision === 'accept' 
    ? theme.palette.success.main 
    : theme.palette.error.main,
  border: `1px solid ${decision === 'accept' 
    ? theme.palette.success.light 
    : theme.palette.error.light}`,
  '&:hover': {
    backgroundColor: decision === 'accept' 
      ? 'rgba(34, 197, 94, 0.2)' 
      : 'rgba(239, 68, 68, 0.2)'
  }
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.divider}`
}))

function CreatedModal({ 
    selectedId, 
    selectedItem, 
    acceptChecked, 
    setAcceptChecked, 
    rejectChecked, 
    setRejectChecked, 
    periodoDesarrollo, 
    setPeriodoDesarrollo, 
    liderManager, 
    setLiderManager, 
    equipoAsignado, 
    setEquipoAsignado, 
    primeraJunta, 
    setPrimeraJunta, 
    comentarios, 
    setComentarios, 
    handleSave, 
    closeModal, 
    loading, 
    actionLoading 
}) {
    const handleAcceptChange = (e) => {
        setAcceptChecked(e.target.checked)
        if (e.target.checked) setRejectChecked(false)
    }

    const handleRejectChange = (e) => {
        setRejectChecked(e.target.checked)
        if (e.target.checked) setAcceptChecked(false)
    }

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            p: 2
        }}>
            <Fade in={true} timeout={300}>
                <StyledCard sx={{
                    width: '100%',
                    maxWidth: 900,
                    maxHeight: '90vh',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        color: 'white',
                        p: 3
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Visibility sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        Detalles de la Propuesta
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        ID: {selectedId}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton onClick={closeModal} sx={{ color: 'white' }}>
                                <Close />
                            </IconButton>
                        </Box>
                    </Box>

                    <CardContent sx={{ p: 3, overflowY: 'auto', maxHeight: 'calc(90vh - 80px)' }}>
                        {selectedItem ? (
                            <Box component="form" className="space-y-4">
                                {/* Información de la propuesta */}
                                <SectionHeader>
                                    <Typography variant="h6" fontWeight="bold" color="primary">
                                        📋 Información General
                                    </Typography>
                                </SectionHeader>

                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Título"
                                            value={selectedItem.titulo || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'action.hover'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Autor"
                                            value={`${selectedItem.nn || ''} - ${selectedItem.nombre || ''}`}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'action.hover'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Área de Implementación"
                                            value={selectedItem.areaImp || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'action.hover'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Fecha de Creación"
                                            value={selectedItem.fecha_creacion || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'action.hover'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Descripción"
                                            value={selectedItem.descripcionProp || ''}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'action.hover'
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Decisión */}
                                <SectionHeader>
                                    <Typography variant="h6" fontWeight="bold" color="primary">
                                        ⚖️ Decisión
                                    </Typography>
                                </SectionHeader>

                                <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
                                    <Paper 
                                        elevation={acceptChecked ? 3 : 0}
                                        sx={{
                                            p: 2,
                                            flex: 1,
                                            border: acceptChecked ? '2px solid' : '1px solid',
                                            borderColor: acceptChecked ? 'success.main' : 'divider',
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            backgroundColor: acceptChecked ? 'success.50' : 'background.paper',
                                            '&:hover': {
                                                backgroundColor: acceptChecked ? 'success.50' : 'action.hover'
                                            }
                                        }}
                                        onClick={() => {
                                            setAcceptChecked(true)
                                            setRejectChecked(false)
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <CheckCircle sx={{ color: 'success.main' }} />
                                            <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                                                Aprobar Propuesta
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            La propuesta cumple con los criterios y puede proceder
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                            <Checkbox
                                                checked={acceptChecked}
                                                onChange={handleAcceptChange}
                                                color="success"
                                            />
                                        </Box>
                                    </Paper>

                                    <Paper 
                                        elevation={rejectChecked ? 3 : 0}
                                        sx={{
                                            p: 2,
                                            flex: 1,
                                            border: rejectChecked ? '2px solid' : '1px solid',
                                            borderColor: rejectChecked ? 'error.main' : 'divider',
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            backgroundColor: rejectChecked ? 'error.50' : 'background.paper',
                                            '&:hover': {
                                                backgroundColor: rejectChecked ? 'error.50' : 'action.hover'
                                            }
                                        }}
                                        onClick={() => {
                                            setRejectChecked(true)
                                            setAcceptChecked(false)
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Cancel sx={{ color: 'error.main' }} />
                                            <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                                                Rechazar Propuesta
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            La propuesta no cumple con los criterios establecidos
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                            <Checkbox
                                                checked={rejectChecked}
                                                onChange={handleRejectChange}
                                                color="error"
                                            />
                                        </Box>
                                    </Paper>
                                </Stack>

                                {/* Detalles de aprobación */}
                                {acceptChecked && (
                                    <Grow in={acceptChecked} timeout={300}>
                                        <Box sx={{ mb: 4 }}>
                                            <SectionHeader>
                                                <Typography variant="h6" fontWeight="bold" color="success.main">
                                                    🚀 Detalles de Implementación
                                                </Typography>
                                            </SectionHeader>
                                            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                                                Complete los siguientes campos para proceder con la implementación
                                            </Alert>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Schedule fontSize="small" />
                                                                Período de Desarrollo
                                                            </Box>
                                                        }
                                                        value={periodoDesarrollo}
                                                        onChange={(e) => setPeriodoDesarrollo(e.target.value)}
                                                        placeholder="Ej: Corto plazo (1-3 meses)"
                                                        variant="outlined"
                                                        helperText="Indique el tiempo estimado para el desarrollo"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Person fontSize="small" />
                                                                Líder Asignado
                                                            </Box>
                                                        }
                                                        value={liderManager}
                                                        onChange={(e) => setLiderManager(e.target.value)}
                                                        placeholder="Ej: Juan Pérez - Área de Innovación"
                                                        variant="outlined"
                                                        helperText="Responsable de la implementación"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Groups fontSize="small" />
                                                                Equipo Asignado
                                                            </Box>
                                                        }
                                                        value={equipoAsignado}
                                                        onChange={(e) => setEquipoAsignado(e.target.value)}
                                                        placeholder="Ej: María Gómez, Carlos Ruiz"
                                                        variant="outlined"
                                                        helperText="Miembros del equipo de desarrollo"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Event fontSize="small" />
                                                                Primera Junta
                                                            </Box>
                                                        }
                                                        value={primeraJunta}
                                                        onChange={(e) => setPrimeraJunta(e.target.value)}
                                                        placeholder="Ej: 15/12/2024 - Sala de Conferencias"
                                                        variant="outlined"
                                                        helperText="Fecha y lugar de la primera reunión"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grow>
                                )}

                                {/* Comentarios de rechazo */}
                                {rejectChecked && (
                                    <Grow in={rejectChecked} timeout={300}>
                                        <Box sx={{ mb: 4 }}>
                                            <SectionHeader>
                                                <Typography variant="h6" fontWeight="bold" color="error.main">
                                                    📝 Comentarios del Rechazo
                                                </Typography>
                                            </SectionHeader>
                                            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                                                Por favor, proporcione una explicación detallada del rechazo
                                            </Alert>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Comment fontSize="small" />
                                                        Razones del rechazo
                                                    </Box>
                                                }
                                                value={comentarios}
                                                onChange={(e) => setComentarios(e.target.value)}
                                                placeholder="Describa las razones específicas por las cuales la propuesta no cumple con los criterios..."
                                                variant="outlined"
                                                helperText="Este comentario será visible para el autor de la propuesta"
                                            />
                                        </Box>
                                    </Grow>
                                )}

                                {/* Acciones */}
                                <Divider sx={{ my: 3 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={closeModal}
                                        startIcon={<Close />}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleSave}
                                        disabled={actionLoading || (!acceptChecked && !rejectChecked)}
                                        startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                        sx={{
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)'
                                            },
                                            '&:disabled': {
                                                background: 'grey.300'
                                            }
                                        }}
                                    >
                                        {actionLoading ? 'Guardando...' : 'Guardar Decisión'}
                                    </Button>
                                </Box>

                                {/* Nota informativa */}
                                {!acceptChecked && !rejectChecked && (
                                    <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                                        Por favor, seleccione una opción (Aprobar o Rechazar) antes de guardar
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
                                <CircularProgress size={48} sx={{ color: '#4F46E5', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Cargando detalles...
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Por favor espere mientras obtenemos la información
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </StyledCard>
            </Fade>
        </Box>
    )
}

export default CreatedModal