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
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const {nombre, nomina } = location.state || {}
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
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-gray-200">
            {/* Header del Modal */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Nueva Propuesta
              </h2>
              <button
                onClick={toggleModal}
                className="btn btn-circle btn-ghost btn-sm text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Autor */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Autor
                  </span>
                </label>
                <input
                  type="text"
                  name="autor"
                  value={nomina+"   "+nombre}
                  readOnly
                  className="input input-bordered input-primary w-full focus:ring-2 focus:ring-blue-500 transition duration-200"
                  placeholder="Ingresa el autor"
                />
              </div>

              {/* Campo Fecha de Creación */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Fecha de Creación
                  </span>
                </label>
                <input
                  type="date"
                  name="fechaCreacion"
                  value={formData.fechaCreacion}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered input-primary w-full focus:ring-2 focus:ring-green-500 transition duration-200"
                />
              </div>

              {/* Campo Área de Trabajo */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Área de Trabajo
                  </span>
                </label>
                <input
                  type="text"
                  name="areaTrabajo"
                  value={formData.areaTrabajo}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered input-primary w-full focus:ring-2 focus:ring-purple-500 transition duration-200"
                  placeholder="Ingresa el área de trabajo"
                />
              </div>

              {/* Campo Área de Implementación */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Área de Implementación
                  </span>
                </label>
                <input
                  type="text"
                  name="areaImplementacion"
                  value={formData.areaImplementacion}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered input-primary w-full focus:ring-2 focus:ring-orange-500 transition duration-200"
                  placeholder="Ingresa el área de implementación"
                />
              </div>

              {/* Campo Título de la Idea */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Título de la Idea
                  </span>
                </label>
                <input
                  type="text"
                  name="tituloIdea"
                  value={formData.tituloIdea}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered input-primary w-full focus:ring-2 focus:ring-red-500 transition duration-200"
                  placeholder="Ingresa el título de la idea"
                />
              </div>

              {/* Campo Descripción de la Propuesta */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descripción de la Propuesta
                  </span>
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  className="textarea textarea-bordered textarea-primary w-full focus:ring-2 focus:ring-teal-500 transition duration-200 resize-none"
                  placeholder="Ingresa la descripción de la propuesta"
                  rows="4"
                />
              </div>

              {/* Footer con Botones */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="btn btn-outline btn-ghost hover:bg-gray-100 transition duration-200"
                  onClick={toggleModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Propuesta
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
