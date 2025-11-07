import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Pagination from '@mui/material/Pagination'; // Para paginación
import Tooltip from '@mui/material/Tooltip'; // Importa Tooltip de MUI

function createData(name, calories) {
  return {
    name,
    calories,
  }
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right"><div aria-label="status" className="status status-xl"></div></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Comentarios
              </Typography>
              <Typography variant="body2" gutterBottom component="div">
                Aquí van los comentarios relacionados con la propuesta "{row.name}".
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
  }).isRequired,
}

const rows = [
  createData('Frozen yoghurt', 159),
  createData('Ice cream sandwich', 237),
  createData('Eclair', 262),
  createData('Cupcake', 305),
  createData('Gingerbread', 356),
  createData('Frozen', 159),
  createData('Ice', 237),
  createData('Ecla', 262),
  createData('Cup', 305),
  createData('Ginger', 355),
]

function Home() {
  const [currentPage, setCurrentPage] = useState(1) // Estado para paginación
  const [isModalOpen, setIsModalOpen] = useState(false) // Estado para el modal
  const [formData, setFormData] = useState({
    autor: '',
    fechaCreacion: '',
    areaTrabajo: '',
    areaImplementacion: '',
    tituloIdea: '',
    descripcion: ''
  }) // Estado para el formulario
  const itemsPerPage = 4 // 4 registros por página

  // Filtra los ítems para la página actual
  const paginatedRows = rows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    // Limpia el formulario al cerrar
    if (!isModalOpen) {
      setFormData({
        autor: '',
        fechaCreacion: '',
        areaTrabajo: '',
        areaImplementacion: '',
        tituloIdea: '',
        descripcion: ''
      });
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos a una API o procesarlos
    console.log('Datos del formulario:', formData);
    alert('Propuesta enviada exitosamente!');
    toggleModal(); // Cierra el modal después de enviar
  }

  return (
    <div className="relative"> {/* Contenedor relativo para posicionar el botón flotante */}
      <TableContainer component={Paper} className="shadow-lg mt-6 bg-white rounded-lg">
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell >Titulo Propuesta</TableCell>
              <TableCell align="right">Estatus</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>

        {/* Paginación debajo de la tabla */}
        <div className="mt-4 flex justify-center p-2">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            aria-label="Paginación de propuestas"
          />
        </div>
      </TableContainer>

      {/* Botón flotante con Tooltip mejorado */}
      <Tooltip title="Añadir Nueva Propuesta" placement="left" arrow>
        <button
          className="fixed bottom-22 right-4 btn btn-warning btn-circle z-50 shadow-lg"
          onClick={toggleModal}
          aria-label="Abrir modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </Tooltip>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Nueva Propuesta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Autor</label>
                <input
                  type="text"
                  name="autor"
                  value={formData.autor}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="Ingresa el autor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Creación</label>
                <input
                  type="date"
                  name="fechaCreacion"
                  value={formData.fechaCreacion}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Área de Trabajo</label>
                <input
                  type="text"
                  name="areaTrabajo"
                  value={formData.areaTrabajo}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="Ingresa el área de trabajo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Área de Implementación</label>
                <input
                  type="text"
                  name="areaImplementacion"
                  value={formData.areaImplementacion}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="Ingresa el área de implementación"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Título de la Idea</label>
                <input
                  type="text"
                  name="tituloIdea"
                  value={formData.tituloIdea}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="Ingresa el título de la idea"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción de la Propuesta</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  className="textarea textarea-bordered w-full"
                  placeholder="Ingresa la descripción de la propuesta"
                  rows="4"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={toggleModal}
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
