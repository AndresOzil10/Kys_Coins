import { Visibility, CheckCircle, Cancel, Schedule, Person, Groups, Event, Comment, Save, Close, Person as PersonIcon, Search } from '@mui/icons-material'
import { Box, Typography, Card, CardContent, TextField, Checkbox, Button, Grid, Chip, CircularProgress, 
         Divider, Paper, Alert, Stack, IconButton, Fade, Grow, FormControl, InputLabel, Select, MenuItem, 
         FormHelperText, Autocomplete, Popper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useEffect, useState, useMemo } from 'react'
import Swal from 'sweetalert2'

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
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  overflow: 'hidden'
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.divider}`
}))

const DescriptionTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'action.hover',
    '& textarea': {
      fontSize: '0.95rem',
      lineHeight: 1.5,
      padding: theme.spacing(1.5),
      minHeight: '80px !important'
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem'
  }
}))

// Componente estilizado para comentarios más anchos
const CommentTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'action.hover',
    '& textarea': {
      fontSize: '1rem',
      lineHeight: 1.6,
      padding: theme.spacing(2),
      minHeight: '100px !important',
      maxHeight: '200px !important',
      overflow: 'auto',
      width: '100%',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word'
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#4F46E5'
    }
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
    borderColor: '#4F46E5'
  }
}))

function CreatedModal({ selectedId, selectedItem, acceptChecked, setAcceptChecked, rejectChecked, 
    setRejectChecked, periodoDesarrollo, setPeriodoDesarrollo, liderManager, setLiderManager, 
    equipoAsignado, setEquipoAsignado, primeraJunta, setPrimeraJunta, comentarios, setComentarios, 
    handleSave, closeModal, actionLoading }) {

    const [loadingLideres, setLoadingLideres] = useState(false)
    const [loadingPersonal, setLoadingPersonal] = useState(false)
    const [lideresData, setLideresData] = useState([])
    const [personalData, setPersonalData] = useState([])
    const [equipoSeleccionado, setEquipoSeleccionado] = useState([])
    const [inputEquipoValue, setInputEquipoValue] = useState('')

    const fetchLideres = async () => {
        setLoadingLideres(true)
        const Pendientes = {
            "aksi": "LiderManager",
        }
        try {
            const respuesta = await enviarData(url, Pendientes)
            if (respuesta.estado === 'success') {
                const data = respuesta.data || []
                setLideresData(data)
            }
        } catch (error) {
            console.error("Error fetching leaders:", error)
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los líderes',
                icon: 'error'
            })
        } finally {
            setLoadingLideres(false)
        }
    }

    const fetchPersonal = async () => {
        setLoadingPersonal(true)
        const Personal = {
            "aksi": "GetEmpleados",
        }
        try {
            const respuesta = await enviarData(url, Personal)
            if (respuesta.estado === 'success') {
                const data = respuesta.data || []
                setPersonalData(data)
            }
        } catch (error) {
            console.error("Error fetching personal data:", error)
        } finally {
            setLoadingPersonal(false)
        }
    }

    useEffect(() => {
        fetchLideres()
        fetchPersonal()
    }, [])

    // Sincronizar equipoSeleccionado cuando equipoAsignado cambie desde fuera
    useEffect(() => {
        if (equipoAsignado) {
            try {
                // Intentar parsear como JSON (formato: [{"nomina":"0002","nombre":"MARIA..."}])
                const equipoArray = JSON.parse(equipoAsignado)
                if (Array.isArray(equipoArray)) {
                    setEquipoSeleccionado(equipoArray)
                }
            } catch {
                // Si no es JSON, intentar con el formato antiguo (solo nombres separados por coma)
                const nombresArray = equipoAsignado.split(',').map(item => item.trim()).filter(item => item)
                // Buscar en personalData para obtener el objeto completo
                const objetosEncontrados = nombresArray.map(nombre => {
                    const encontrado = personalData.find(p => 
                        p.nombre && p.nombre.toLowerCase().includes(nombre.toLowerCase())
                    )
                    return encontrado || { nombre, nomina: '' }
                })
                setEquipoSeleccionado(objetosEncontrados)
            }
        } else {
            setEquipoSeleccionado([])
        }
    }, [equipoAsignado, personalData])

    // Obtener opciones para el autocomplete basado en personalData
    const opcionesAutocomplete = useMemo(() => {
        if (!personalData || personalData.length === 0) return []
        
        // Opciones base del personal
        const opciones = [...personalData]
        
        // Agregar colaboradores de la propuesta si existen
        if (selectedItem?.colaboradores && selectedItem.colaboradores.length > 0) {
            const colaboradoresObjetos = selectedItem.colaboradores.map(c => ({
                nomina: c.nomina || c.nn_colaborador || '',
                nombre: c.nombre_completo || c.nn_colaborador || ''
            })).filter(c => c.nombre)
            
            // Solo agregar si no existen ya en las opciones
            colaboradoresObjetos.forEach(colab => {
                if (!opciones.some(o => o.nombre === colab.nombre)) {
                    opciones.push(colab)
                }
            })
        }
        
        // Agregar integrantes del grupo si existen
        if (selectedItem?.integrantes_grupo) {
            const integrantesArray = selectedItem.integrantes_grupo.split(',').map(i => i.trim()).filter(i => i)
            integrantesArray.forEach(nombre => {
                if (!opciones.some(o => o.nombre === nombre)) {
                    opciones.push({ nomina: '', nombre })
                }
            })
        }
        
        return opciones
    }, [personalData, selectedItem])

    const handleAcceptChange = (e) => {
        setAcceptChecked(e.target.checked)
        if (e.target.checked) setRejectChecked(false)
    }

    const handleRejectChange = (e) => {
        setRejectChecked(e.target.checked)
        if (e.target.checked) setAcceptChecked(false)
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

    // Determinar el tipo de propuesta
    const esPropuestaGrupal = selectedItem?.colaboracion === "Sí"
    
    // Formatear nombres de colaboradores
    const formatoColaboradores = useMemo(() => {
        if (!selectedItem?.colaboradores || selectedItem.colaboradores.length === 0) {
            return "No hay colaboradores registrados"
        }
        return selectedItem.colaboradores.map(colab => 
            colab.nombre_completo || colab.nn_colaborador
        ).join(', ')
    }, [selectedItem])

    // Función para obtener la etiqueta de visualización de un empleado
    const getOptionLabel = (option) => {
        if (typeof option === 'string') return option
        if (option.nombre) {
            return option.nomina ? `${option.nombre} (Nómina: ${option.nomina})` : option.nombre
        }
        return ''
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
                    maxWidth: 1400,
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
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="h6" fontWeight="bold" color="primary">
                                                📋 Información General
                                            </Typography>
                                        </Box>
                                        {/* Badge de tipo de propuesta */}
                                        <Chip
                                            icon={esPropuestaGrupal ? <Groups /> : <PersonIcon />}
                                            label={esPropuestaGrupal ? "Propuesta en Grupo" : "Propuesta Individual"}
                                            color={esPropuestaGrupal ? "secondary" : "info"}
                                            sx={{
                                                fontWeight: 'bold',
                                                px: 1,
                                                '& .MuiChip-icon': {
                                                    fontSize: 18
                                                }
                                            }}
                                        />
                                    </Box>
                                </SectionHeader>

                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Título"
                                            value={selectedItem.titulo || ''}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            multiline
                                            rows={2}
                                            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'action.hover' } }}
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Autor"
                                            value={`${selectedItem.nn || ''} - ${selectedItem.nombre || ''}`}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            multiline
                                            rows={2}
                                            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'action.hover' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Área de Implementación"
                                            value={selectedItem.areaImp || ''}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            multiline
                                            rows={2}
                                            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'action.hover' } }}
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Fecha de Creación"
                                            value={selectedItem.fechaCreacion || ''}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'action.hover' } }}
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12}>
                                        <DescriptionTextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Descripción"
                                            value={selectedItem.descripcionProp || ''}
                                            InputProps={{ readOnly: true }}
                                            variant="outlined"
                                            helperText="Descripción completa de la propuesta (puede hacer scroll si es necesario)"
                                        />
                                    </Grid>

                                    {/* Colaboradores */}
                                    {esPropuestaGrupal && (
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Groups fontSize="small" />
                                                        Colaboradores
                                                    </Box>
                                                }
                                                value={formatoColaboradores}
                                                InputProps={{ readOnly: true }}
                                                variant="outlined"
                                                multiline
                                                rows={3}
                                                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'action.hover' } }}
                                                helperText="Miembros que colaboran en esta propuesta"
                                            />
                                        </Grid>
                                    )}
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
                                                    <FormControl fullWidth>
                                                        <InputLabel id="periodo-desarrollo-label">
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Schedule fontSize="small" />
                                                                Período de Desarrollo
                                                            </Box>
                                                        </InputLabel>
                                                        <Select
                                                            labelId="periodo-desarrollo-label"
                                                            value={periodoDesarrollo}
                                                            onChange={(e) => setPeriodoDesarrollo(e.target.value)}
                                                            MenuProps={{ style: { zIndex: 1400 } }}
                                                        >
                                                            <MenuItem value=""><em>Seleccione un período</em></MenuItem>
                                                            <MenuItem value="Corto plazo (1-3 meses)">Corto plazo (1-3 meses)</MenuItem>
                                                            <MenuItem value="Mediano plazo (3-6 meses)">Mediano plazo (3-6 meses)</MenuItem>
                                                            <MenuItem value="Largo plazo (6-12 meses)">Largo plazo (6-12 meses)</MenuItem>
                                                        </Select>
                                                        <FormHelperText>Seleccione el tiempo estimado para el desarrollo</FormHelperText>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="lider-asignado-label">
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Person fontSize="small" />
                                                                Líder Asignado
                                                            </Box>
                                                        </InputLabel>
                                                        <Select
                                                            labelId="lider-asignado-label"
                                                            value={liderManager}
                                                            onChange={(e) => setLiderManager(e.target.value)}
                                                            disabled={loadingLideres || lideresData.length === 0}
                                                            MenuProps={{ style: { zIndex: 1400 } }}
                                                        >
                                                            <MenuItem value=""><em>Seleccione un líder</em></MenuItem>
                                                            {loadingLideres ? (
                                                                <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} />Cargando...</MenuItem>
                                                            ) : lideresData.map((lider, index) => (
                                                                <MenuItem key={index} value={lider.id}>{lider.nombre}</MenuItem>
                                                            ))}
                                                        </Select>
                                                        <FormHelperText>Seleccione el responsable de la implementación</FormHelperText>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    {/* Equipo Asignado - AUTOCOMPLETABLE MÚLTIPLE con objetos */}
                                                    <Autocomplete
                                                        multiple
                                                        id="equipo-autocomplete"
                                                        options={opcionesAutocomplete}
                                                        value={equipoSeleccionado}
                                                        inputValue={inputEquipoValue}
                                                        onInputChange={(event, newInputValue) => {
                                                            setInputEquipoValue(newInputValue);
                                                        }}
                                                        onChange={(event, newValue) => {
                                                            setEquipoSeleccionado(newValue);
                                                            // Guardar como JSON string con nomina y nombre
                                                            const equipoJson = JSON.stringify(newValue);
                                                            setEquipoAsignado(equipoJson);
                                                        }}
                                                        getOptionLabel={getOptionLabel}
                                                        isOptionEqualToValue={(option, value) => {
                                                            // Comparar por nombre y nómina
                                                            return option.nombre === value.nombre && 
                                                                   option.nomina === value.nomina;
                                                        }}
                                                        freeSolo
                                                        loading={loadingPersonal}
                                                        renderTags={(value, getTagProps) =>
                                                            value.map((option, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={getOptionLabel(option)}
                                                                    {...getTagProps({ index })}
                                                                    sx={{
                                                                        backgroundColor: '#e0e7ff',
                                                                        color: '#4F46E5',
                                                                        '& .MuiChip-deleteIcon': {
                                                                            color: '#4F46E5',
                                                                            '&:hover': {
                                                                                color: '#4338CA'
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            ))
                                                        }
                                                        renderOption={(props, option) => (
                                                            <Box component="li" {...props}>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <Typography variant="body1">
                                                                        {option.nombre}
                                                                    </Typography>
                                                                    {option.nomina && (
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Nómina: {option.nomina}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        )}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Groups fontSize="small" />
                                                                        Equipo Asignado
                                                                    </Box>
                                                                }
                                                                placeholder="Escriba un nombre y presione Enter..."
                                                                helperText={
                                                                    loadingPersonal 
                                                                        ? 'Cargando personal...' 
                                                                        : 'Puede agregar múltiples miembros del equipo. Escriba y presione Enter para agregar.'
                                                                }
                                                                FormHelperTextProps={{
                                                                    sx: { ml: 1.5, mt: 0.5 }
                                                                }}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <>
                                                                            <Search sx={{ color: 'text.secondary', mr: 1 }} />
                                                                            {params.InputProps.startAdornment}
                                                                        </>
                                                                    ),
                                                                    endAdornment: (
                                                                        <>
                                                                            {loadingPersonal && <CircularProgress color="inherit" size={20} />}
                                                                            {params.InputProps.endAdornment}
                                                                        </>
                                                                    )
                                                                }}
                                                                sx={{
                                                                    '& .MuiOutlinedInput-root': {
                                                                        fontSize: '1rem'
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        PopperComponent={(props) => (
                                                            <Popper 
                                                                {...props} 
                                                                style={{ 
                                                                    ...props.style, 
                                                                    zIndex: 1400 
                                                                }} 
                                                                placement="bottom-start"
                                                            />
                                                        )}
                                                        sx={{
                                                            '& .MuiAutocomplete-clearIndicator': {
                                                                display: 'none'
                                                            }
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Event fontSize="small" />Primera Junta</Box>}
                                                        type="date"
                                                        value={primeraJunta}
                                                        onChange={(e) => setPrimeraJunta(e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                        inputProps={{ min: obtenerFechaMinima(), max: obtenerFechaMaxima() }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    {/* Comentarios Adicionales - AHORA MÁS ANCHO */}
                                                    <CommentTextField
                                                        fullWidth
                                                        multiline
                                                        rows={5}
                                                        label={
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Comment fontSize="small" />
                                                                <Typography variant="subtitle2" fontWeight="600">
                                                                    Comentarios Adicionales
                                                                </Typography>
                                                            </Box>
                                                        }
                                                        value={comentarios}
                                                        onChange={(e) => setComentarios(e.target.value)}
                                                        placeholder="Agregue cualquier comentario, observación o nota adicional..."
                                                        helperText="Puede escribir comentarios detallados para el equipo de implementación"
                                                        FormHelperTextProps={{
                                                            sx: { ml: 1.5, mt: 0.5, fontSize: '0.8rem' }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grow>
                                )}
                                
                                {/* Comentarios de rechazo - AHORA MÁS ANCHO */}
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
                                            <CommentTextField
                                                fullWidth
                                                multiline
                                                rows={5}
                                                label="Razones del rechazo"
                                                value={comentarios}
                                                onChange={(e) => setComentarios(e.target.value)}
                                                placeholder="Describa las razones específicas por las cuales la propuesta no cumple con los criterios..."
                                                helperText="Este comentario será visible para el autor de la propuesta"
                                                FormHelperTextProps={{
                                                    sx: { ml: 1.5, mt: 0.5, fontSize: '0.8rem' }
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: '#fef2f2',
                                                        '& textarea': {
                                                            minHeight: '120px !important'
                                                        }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: '#dc2626'
                                                    }
                                                }}
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
                                        sx={{ px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleSave}
                                        disabled={actionLoading || (!acceptChecked && !rejectChecked)}
                                        startIcon={actionLoading ? <CircularProgress size={20} /> : <Save />}
                                        sx={{
                                            px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem',
                                            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                                            '&:hover': { background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)' }
                                        }}
                                    >
                                        {actionLoading ? 'Guardando...' : 'Guardar Decisión'}
                                    </Button>
                                </Box>

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