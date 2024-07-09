import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx";
import TopBar from "./TopBar.jsx";
import styled from "styled-components";
import "../styles/DataTable.css";
import axios from "axios";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1px 10px;
`;

const Title = styled.h2`
  flex-grow: 1;
  text-align: center;
`;

const FilterWrapper = styled.div`
  position: relative;
  right: 9px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-wrap: wrap;
  margin: 0% 30%; 
`;

const FilterInput = styled.input`
  padding: 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 14px;
  justify-content: center;
  flex: 1;
  display: flex; 
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: ${(props) => (props.primary ? "#008cba" : "#4caf50")};
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ButtonCancelar = styled.button`
  background-color: ${(props) =>
    props.primary ? "#008cba" : props.cancel ? "#bf1515" : "#4caf50"};
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const DataTableContainer = styled.div`
  flex: 1;
  padding: 1px;
  overflow: auto;
  position: relative;
  width: 100%;
  height: calc(100vh - 80px);
`;

const StyledDataTable = styled(DataTable)`
  border-collapse: collapse;
  width: 45%;
  position: relative;
  margin: center;
  margin: 0% 25%;

  th,
  td {
    border: 1px solid #ddd;
    padding: 15px;
    text-align: center;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  th {
    background-color: #f0f0f0;
    text-align: center;
  }

  td {
    min-width: 200px;
    max-width: 500px;
    text-align: center;
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 8px;
    }
  }

  @media (max-width: 480px) {
    th,
    td {
      padding: 6px;
    }
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalWrapper = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  z-index: 1100;
  animation: fadeIn 0.3s ease-out;
  max-width: 400px;
  width: 100%;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalTitle = styled.h3`
  margin-bottom: 15px;
  text-align: center;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid ${(props) => (props.error ? "red" : "#ccc")};
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #008cba;
    box-shadow: 0 0 5px rgba(0, 140, 186, 0.5);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButton = styled.button`
  background-color: ${(props) =>
    props.primary ? "#4caf50" : props.cancel ? "#bf1515" : "#4caf50"};
  color: #ffffff;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.primary ? "#45a049" : props.cancel ? "#ad1111" : "#45a049"};
  }
`;

const GuardarButton = styled(ModalButton)`
  background-color: #4caf50;
`;

function Usuario() {
  const [puestos, setPuestos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [errors, setErrors] = useState({ usuario: "", nombre: "", contrasenia: "" });
  const [modalValues, setModalValues] = useState({ usuario: "", nombre: "", contrasenia: "", estado: "", ID_PuestoIn: "", ID_RolUsuario: "" });
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    Usuario: "",
    Nombre: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/usuario/`);
        setRecords(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    const fetchPuestos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/puestoIn/`);
        setPuestos(response.data);
      } catch (error) {
        console.error("Error al obtener los puestos:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/rolUsuario/`);
        setRoles(response.data);
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    };

    fetchData();
    fetchPuestos();
    fetchRoles();
  }, []);

  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleInsert = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalValues({ usuario: "", nombre: "", contrasenia: "", estado: "", ID_PuestoIn: "", ID_RolUsuario: "" });
    setErrors({ usuario: "", nombre: "", contrasenia: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const SaveModal = async ()
   => {
    const { usuario, nombre, contrasenia, estado, ID_PuestoIn, ID_RolUsuario } = modalValues;
    const newErrors = { usuario: "", nombre: "", contrasenia: "" };

    if (usuario.trim() === "") newErrors.usuario = "Usuario es requerido";
    if (nombre.trim() === "") newErrors.nombre = "Nombre es requerido";
    if (contrasenia.trim() === "") newErrors.contrasenia = "Contraseña es requerida";

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        const response = await axios.post(`http://localhost:3000/usuario/`, { usuario, nombre, contrasenia, estado, ID_PuestoIn, ID_RolUsuario });
        setRecords((prevRecords) => [...prevRecords, response.data]);
        handleCloseModal();
      } catch (error) {
        console.error("Error al insertar usuario:", error);
      }
    }
  };

  const handleEdit = (row) => {
    setEditMode(true);
    setEditedRow({ ...row });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedRow(null);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:3000/usuario/${editedRow.ID_Usuario}`, editedRow);
      setRecords((prevRecords) =>
        prevRecords.map((record) => (record.ID_Usuario === editedRow.ID_Usuario ? editedRow : record))
      );
      setEditMode(false);
      setEditedRow(null);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  const columns = [
    {
      name: "Usuario",
      selector: (row) =>
        editMode && editedRow && editedRow.ID_Usuario === row.ID_Usuario ? (
          <input
            type="text"
            name="Usuario"
            value={editedRow.Usuario}
            onChange={handleChange}
          />
        ) : (
          row.Usuario
        ),
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) =>
        editMode && editedRow && editedRow.ID_Usuario === row.ID_Usuario ? (
          <input
            type="text"
            name="Nombre"
            value={editedRow.Nombre}
            onChange={handleChange}
          />
        ) : (
          row.Nombre
        ),
      sortable: true,
    },
    {
      name: "Contraseña",
      selector: (row) =>
        editMode && editedRow && editedRow.ID_Usuario === row.ID_Usuario ? (
          <input
            type="password"
            name="Contrasenia"
            value={editedRow.Contrasenia}
            onChange={handleChange}
          />
        ) : (
          row.Contrasenia
        ),
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) =>
        editMode && editedRow && editedRow.ID_Usuario === row.ID_Usuario ? (
          <select
            name="Estado"
            value={editedRow.Estado}
            onChange={handleChange}
          >
            <option value="1">Activo</option>
            <option value="2">Inactivo</option>
          </select>
        ) : row.Estado === 1 ? (
          "Activo"
        ) : (
          "Inactivo"
        ),
      sortable: true,
    },
    {
      name: "Puesto",
      selector: (row) =>
        editMode && editedRow && editedRow.ID_Usuario === row.ID_Usuario ? (
          <select
            name="ID_PuestoIn"
            value={editedRow.ID_PuestoIn}
            onChange={handleChange}
          >
            {puestos.map((puesto) => (
              <option key={puesto.ID_PuestoIn} value={puesto.ID_PuestoIn}>
                {puesto.Nombre}
              </option>
            ))}
          </select>
        ) : (
          row.NombrePuesto
        ),
      sortable: true,
    },
    {
      name: "Rol",
      selector: (row) =>
        editMode && editedRow && editedRow.ID_Usuario === row.ID_Usuario ? (
          <select
            name="ID_RolUsuario"
            value={editedRow.ID_RolUsuario}
            onChange={handleChange}
          >
            {roles.map((rol) => (
              <option key={rol.ID_RolUsuario} value={rol.ID_RolUsuario}>
                {rol.Nombre}
              </option>
            ))}
          </select>
        ) : (
          row.NombreRol
        ),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) =>
        editMode && editedRow && editedRow.ID_Usuario === row.ID_Usuario ? (
          <div>
            <Button onClick={handleSaveEdit}>
              <FaSave /> Guardar
            </Button>
            <ButtonCancelar cancel onClick={handleCancelEdit}>
              <FaTimes /> Cancelar
            </ButtonCancelar>
          </div>
        ) : (
          <Button primary onClick={() => handleEdit(row)}>
            <FaEdit /> Editar
          </Button>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredRecords = records.filter(
    (record) =>
      record.Usuario.toLowerCase().includes(filters.Usuario.toLowerCase()) &&
      record.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())
  );

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <div style={{ flex: 1, padding: "0px" }}>
          <HeaderContainer>
            <Title>Matriz de Perfiles</Title>
            <ButtonGroup>
              <Button primary onClick={toggleFilters}>
                Filtrar
              </Button>
              <Button onClick={handleInsert}>
                Insertar
              </Button>
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
            <FilterInput
              type="text"
              placeholder="Usuario"
              value={filters.Usuario}
              onChange={(e) => handleFilterChange(e, "Usuario")}
            />
            <FilterInput
              type="text"
              placeholder="Nombre"
              value={filters.Nombre}
              onChange={(e) => handleFilterChange(e, "Nombre")}
            />
          </FilterWrapper>
          <DataTableContainer>
            <StyledDataTable
              columns={columns}
              data={filteredRecords}
              highlightOnHover
              pagination
            />
          </DataTableContainer>
        </div>
      </ContentContainer>

      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Insertar Usuario</ModalTitle>
            <ModalInput
              type="text"
              placeholder="Usuario"
              value={modalValues.usuario}
              onChange={(e) => handleModalChange(e, "usuario")}
              error={errors.usuario}
            />
            {errors.usuario && <ErrorMessage>{errors.usuario}</ErrorMessage>}
            <ModalInput
              type="text"
              placeholder="Nombre"
              value={modalValues.nombre}
              onChange={(e) => handleModalChange(e, "nombre")}
              error={errors.nombre}
            />
            {errors.nombre && <ErrorMessage>{errors.nombre}</ErrorMessage>}
            <ModalInput
              type="password"
              placeholder="Contraseña"
              value={modalValues.contrasenia}
              onChange={(e) => handleModalChange(e, "contrasenia")}
              error={errors.contrasenia}
            />
            {errors.contrasenia && <ErrorMessage>{errors.contrasenia}</ErrorMessage>}
            <ModalInput
              type="text"
              placeholder="Estado"
              value={modalValues.estado}
              onChange={(e) => handleModalChange(e, "estado")}
            />
            <select
              name="ID_PuestoIn"
              value={modalValues.ID_PuestoIn}
              onChange={(e) => handleModalChange(e, "ID_PuestoIn")}
            >
              {puestos.map((puesto) => (
                <option key={puesto.ID_PuestoIn} value={puesto.ID_PuestoIn}>
                  {puesto.Nombre}
                </option>
              ))}
            </select>
            <select
              name="ID_RolUsuario"
              value={modalValues.ID_RolUsuario}
              onChange={(e) => handleModalChange(e, "ID_RolUsuario")}
            >
              {roles.map((rol) => (
                <option key={rol.ID_RolUsuario} value={rol.ID_RolUsuario}>
                  {rol.Nombre}
                </option>
              ))}
            </select>
            <ModalButtonGroup>
              <GuardarButton onClick={SaveModal} disabled={!modalValues.usuario || !modalValues.nombre || !modalValues.contrasenia}>
                <FaSave /> Guardar
              </GuardarButton>
              <ModalButton cancel onClick={handleCloseModal}>
                <FaTimes /> Cancelar
              </ModalButton>
            </ModalButtonGroup>
          </ModalWrapper>
        </ModalBackground>
      )}
    </MainContainer>
  );
}

export default Usuario;
