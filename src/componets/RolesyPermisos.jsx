
import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import { styled, keyframes } from "styled-components";
import "../styles/DataTable.css"; // Importa el archivo CSS
import axios from "axios";
import Select from "react-select";

import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUndo,
  FaSearch,
  FaPlus,
} from "react-icons/fa"; // Importa los íconos necesarios

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const CustomLoader = () => (
  <div style={{ padding: "54px" }}>
    <Spinner />
    <div>Cargando Registros...</div>
  </div>
);

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
  color: #083cac;
  font-size: 30px;
`;

const FilterWrapper = styled.div`
  position: relative; /* Cambiado de 'absolute' a 'relative' */
  right: 9px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-wrap: wrap;
  margin: 0% 20%;
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

//Estilos de Boton de Buscar y de Insertar un nuevo perfil
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

//Estilos del Boton cancelar
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

//Boton de filtros
const SearchButton = styled(Button)`
  background-color: #008cba; /* Azul */
`;

//Boton de Reset de filtros
const RedButton = styled(Button)`
  background-color: #ff0000; /* Rojo */
  font-size: 13px;
  padding: 2px 4px;
  border-radius: 5px;
  height: 35px;
  width: 120px;
`;

const DataTableContainer = styled.div`
  flex: 1;
  padding: 1px;
  overflow: auto;
  position: relative;
  width: 100%;
  height: calc(100vh - 80px); /* Ajusta el tamaño del contenedor de la tabla */
`;

const StyledDataTable = styled(DataTable)`
  border-collapse: collapse;
  width: 100%;
  position: relative;
  margin: center;
  //margin: 0% 20%;

  th,
  td {
    border: 1px solid #ddd;
    padding: 15px;
    text-align: center; /* Centra el texto en las celdas */
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  th {
    background-color: #f0f0f0;
    text-align: center; /* Centra el texto en los encabezados */
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


const Checkbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid #005baa;
  background-color: ${(props) => (props.checked ? '#005baa' : '#fff')};
  cursor: pointer;
  position: relative;
  outline: none;

  &:checked::after {
    content: '✓';
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
  }

  &:hover {
    border-color: #0056b3;
  }
`;


const CustomCheckbox = ({ checked, onChange, disabled }) => {
  return (
    <Checkbox
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

const PermissionCheckbox = ({ checked, onChange, disabled }) => {
  return (
    <Checkbox
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
};



// Estilo para la sección de permisos
const PermissionsSection = styled.div`
  margin-top: 20px;
`;

// Estilo para las etiquetas de los checkboxes
const PermissionLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1em;
`;


// Estilo para los botones del modal


const CancelButton = styled.button`
  background: #f44336;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
`;

function Roles() {
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState({
    id: null,
    Paises: [],
    N_Rol: "",
    Des_Rol: "",
    Insertar: false,
    Editar: false,
  });
  const [pais, setPais] = useState([]);
  const [errors, setErrors] = useState({
    pais: "",
    rolusuario: "",
  }); //validaciones para insertar una nueva razon social
  const [modalValues, setModalValues] = useState({
    Paises: [],
    N_Rol: "",
    Des_Rol: "",
    Insertar: false,
    Editar: false,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal

  const [filters, setFilters] = useState({
    N_Rol: "",
    N_Pais: "",
    N_Ambiente: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rolesResponse, paisResponse] = await Promise.all([
          axios.get(`http://localhost:3000/rolusuario/`),
          axios.get(`http://localhost:3000/pais/`)
        ]);
  
        const rolesData = rolesResponse.data;
        const paisData = paisResponse.data;
  
        const paisMap = paisData.reduce((map, pais) => {
          map[pais.id] = pais.N_Pais;
          return map;
        }, {});
  
        const mappedData = rolesData.map((rolusuario) => {
          const paisIds = rolusuario.Paises.split(',').map(Number);
          const paisNombres = paisIds.map((id) => paisMap[id]);
          return {
            id: rolusuario.id,
            N_Rol: rolusuario.N_Rol,
            Des_Rol: rolusuario.Des_Rol,
            Fec_Creacion: rolusuario.Fec_Creacion,
            Insertar: rolusuario.Insertar,
            Editar: rolusuario.Editar,
            Paises: paisNombres,
          };
        });
  
        setRecords(mappedData);
        setPais(paisData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los Roles:", error);
        setLoading(false);
      }
    };
  
    fetchData();
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
    setModalValues({
      Paises: [],
      N_Rol: "",
      Des_Rol: "",
      Insertar: false,
      Editar: false,
    });
    setErrors({ pais: "", rolusuario: "" });
  };

  const handleModalChange = (event, field) => {
    const { value, type, checked } = event.target;
    setModalValues((prevValues) => ({
      ...prevValues,
      [field]: type === "checkbox" ? checked : value,
    }));
  };
  

  const SaveModal = async () => {
    const newErrors = { pais: "", rolusuario: "" };
  
    if (!modalValues.Paises.length) {
      newErrors.pais = "El campo Pais es obligatorio";
    }
  
    if (!modalValues.N_Rol.trim()) {
      newErrors.rolusuario = "El campo Rol es obligatorio";
    }
    setErrors(newErrors);
  
    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        const response = await axios.get(`http://localhost:3000/rolusuario`);
        const rolusuarioExists = response.data.some(
          (rolusuario) =>
            rolusuario.N_Rol.toLowerCase() ===
            modalValues.N_Rol.toLowerCase()
        );
        if (rolusuarioExists) {
          setErrors({ rolusuario: "El Rol ya existe" });
          return;
        }
  
        const newRolUsuario = {
          N_Rol: modalValues.N_Rol,
          Des_Rol: modalValues.Des_Rol,
          Fec_Creacion: new Date(),
          Insertar: modalValues.Insertar ? 1 : 2,
          Editar: modalValues.Editar ? 1 : 2,
          Paises: modalValues.Paises.join(","),
        };
  
        const insertResponse = await axios.post(
          `http://localhost:3000/rolusuario`,
          newRolUsuario
        );
  
        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            N_Rol: newRolUsuario.N_Rol,
            Des_Rol: newRolUsuario.Des_Rol,
            Fec_Creacion: newRolUsuario.Fec_Creacion,
            Insertar: newRolUsuario.Insertar,
            Editar: newRolUsuario.Editar,
            Paises: modalValues.Paises.map(id => pais.find(a => a.id === id)?.N_Pais),
          },
        ];
  
        setRecords(updatedRecords);
        setShowModal(false);
        setModalValues({ N_Rol: "", Des_Rol: "", Paises: [] });
      } catch (error) {
        console.error("Error al insertar un nuevo Rol:", error);
      }
    }
  };

  const startEdit = (row) => {
    const paisIds = row.Paises.map((nombre) => {
      const paisObj = pais.find((a) => a.N_Pais === nombre);
      return paisObj ? paisObj.id : null;
    }).filter((id) => id !== null);
  
    setEditedRow({ 
      ...row, 
      Paises: paisIds,
      Insertar: row.Insertar === 1,
      Editar: row.Editar === 1
    });
    setEditMode(row.id);
  };
  

  const handleEditChange = (event, field) => {
    if (field === "Paises") {
      const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
      setEditedRow((prevState) => ({
        ...prevState,
        Paises: selectedOptions,
      }))
    } else {
      
    }

    const { value, type, checked } = event.target;
  if (type === "checkbox") {
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: checked,
    }));
  } else {
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }

  };
  const handleStaticCheckboxChange = (e, id, field) => {
    const updatedRecords = records.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          [field]: e.target.checked ? 1 : 2
        };
      }
      return row;
    });
  
    setRecords(updatedRecords);
  };

  const saveChanges = async (id) => {
    try {
      const updateRow = {
        ...editedRow,
        Insertar: editedRow.Insertar ? 1 : 2,
        Editar: editedRow.Editar ? 1 : 2,
        Paises: editedRow.Paises.join(","),
      };
  
      await axios.put(`http://localhost:3000/rolusuario/${id}`, updateRow);
  
      const updatedRecords = records.map((row) =>
        row.id === id ? { ...row, ...updateRow, Paises: updateRow.Paises.split(",").map(id => pais.find(a => a.id === Number(id))?.N_Pais) } : row
      );
  
      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);
  
      console.log("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar los cambios", error);
    }
  };
  

  const cancelEdit = () => {
    setEditedRow(null);
    setEditMode(null);
  };

  const filteredData = useMemo(() => {
    return records.filter((row) => {
      return (
        (filters.N_Pais === "" ||
          row.N_Pais.toLowerCase().includes(filters.N_Pais.toLowerCase())) &&
        (filters.N_Rol === "" ||
          row.N_Rol.toLowerCase().includes(
            filters.N_Rol.toLowerCase()
          ))
      );
    });
  }, [records, filters]);

  const resetFilters = () => {
    setFilters({
      N_Aplicaciones: "",
      N_Pais: "",
      N_Ambiente: "",
    });
  };
  const columns = [
    {
      name: "Roles",
      selector: (row) => row.N_Rol,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <input
            type="text"
            value={editedRow.N_Rol}
            onChange={(e) => handleEditChange(e, "N_Rol")}
          />
        ) : (
          <div>{row.N_Rol}</div>
        ),
    },
    {
      name: "Descripcion",
      selector: (row) => row.Des_Rol,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <input
            type="text"
            value={editedRow.Des_Rol}
            onChange={(e) => handleEditChange(e, "Des_Rol")}
          />
        ) : (
          <div>{row.Des_Rol}</div>
        ),
    },
    {
      name: "Fecha de Creacion",
      selector: (row) => row.Fec_Creacion,
      sortable: true,
      minWidth: "150px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "550px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <input
            type="text"
            value={editedRow.Fec_Creacion}
            onChange={(e) => handleEditChange(e, "Fec_Creacion")}
          />
        ) : (
          <div>{row.Fec_Creacion}</div>
        ),
    },
    {
      name: "Insertar",
      selector: (row) => (row.Insertar === 1 ? "Activo" : "Inactivo"),
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <CustomCheckbox
            checked={editedRow.Insertar}
            onChange={(e) => handleEditChange(e, "Insertar")}
          />
        ) : (
          <CustomCheckbox
            checked={row.Insertar === 1}
            disabled={!editMode || editedRow?.id !== row.id}
            onChange={(e) => handleStaticCheckboxChange(e, row.id, "Insertar")}
          />
        ),
    },
    {
      name: "Editar",
      selector: (row) => (row.Editar === 1 ? "Activo" : "Inactivo"),
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <CustomCheckbox
            checked={editedRow.Editar}
            onChange={(e) => handleEditChange(e, "Editar")}
          />
        ) : (
          <CustomCheckbox
            checked={row.Editar === 1}
            disabled={!editMode || editedRow?.id !== row.id}
            onChange={(e) => handleStaticCheckboxChange(e, row.id, "Editar")}
          />
        ),
    },
    {
      name: "Paises",
      selector: (row) => row.Paises.join(", "),
      sortable: true,
      minWidth: "330px",
      maxWidth: "50px",
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <Select
            isMulti
            value={editedRow.Paises.map((id) => ({
              value: id,
              label: pais.find((a) => a.id === id)?.N_Pais,
            }))}
            options={pais.map((a) => ({
              value: a.id,
              label: a.N_Pais,
            }))}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions.map(option => option.value);
              setEditedRow((prevState) => ({
                ...prevState,
                Paises: selectedValues,
              }));
            }}
          />
        ) : (
          <div>{row.Paises.join(', ')}</div>
        )
    },
    {
      name: "Acciones",
      cell: (row) =>
        editMode === row.id ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => saveChanges(row.id)}>
              <FaSave />
            </Button>
            <ButtonCancelar cancel onClick={cancelEdit}>
              <FaTimes />
            </ButtonCancelar>
          </div>
        ) : (
          <Button onClick={() => startEdit(row)}>
            <FaEdit />
          </Button>
        ),
    },
  ];

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>Roles y Permisos</Title>
            <ButtonGroup>
              <SearchButton primary onClick={toggleFilters}>
                <FaSearch />
                {showFilters ? "Ocultar" : "Buscar"}
              </SearchButton>

              <Button onClick={handleInsert}>
                <FaPlus />
                Nueva Aplicacion
              </Button>
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
            <FilterInput
              type="text"
              value={filters.N_Pais}
              onChange={(e) => handleFilterChange(e, "N_Pais")}
              placeholder="Buscar por Pais"
            />
            <FilterInput
              type="text"
              value={filters.N_Aplicaciones}
              onChange={(e) => handleFilterChange(e, "N_Aplicaciones")}
              placeholder="Buscar por Aplicacion"
            />
            <FilterInput
              type="text"
              value={filters.N_Ambiente}
              onChange={(e) => handleFilterChange(e, "N_Ambiente")}
              placeholder="Buscar por Ambiente"
            />

            <RedButton onClick={resetFilters}>
              <FaUndo /> Limpiar Filtros
            </RedButton>
          </FilterWrapper>
          {loading ? (
            <CustomLoader />
          ) : (
            <StyledDataTable
              columns={columns}
              data={filteredData}
              pagination
              paginationPerPage={30}
              showFilters={showFilters}
            />
          )}
        </DataTableContainer>
      </ContentContainer>
      {/* Modal para insertar una nueva aplicacion */}
      {showModal && (
  <ModalBackground>
    <ModalWrapper>
      <ModalTitle>Nuevo Rol de Usuario</ModalTitle>

      <ModalInput
        type="text"
        value={modalValues.N_Rol}
        onChange={(e) => handleModalChange(e, "N_Rol")}
        placeholder="Roles"
        error={errors.rolusuario}
        required
      />
      {errors.rolusuario && <ErrorMessage>{errors.rolusuario}</ErrorMessage>}
      
      <ModalInput
        type="text"
        value={modalValues.Des_Rol}
        onChange={(e) => handleModalChange(e, "Des_Rol")}
        placeholder="Descripción del Rol"
      />

      <Select
        isMulti
        value={modalValues.Paises.map((id) => ({
          value: id,
          label: pais.find((a) => a.id === id)?.N_Pais,
        }))}
        options={pais.map((a) => ({
          value: a.id,
          label: a.N_Pais,
        }))}
        onChange={(selectedOptions) => {
          const selectedValues = selectedOptions.map(option => option.value);
          setModalValues((prevValues) => ({
            ...prevValues,
            Paises: selectedValues,
          }));
        }}
        placeholder="Selecciona Paises"
      />
      {errors.pais && <ErrorMessage>{errors.pais}</ErrorMessage>}

      <h4>Permisos</h4>
      <PermissionsSection>
        <PermissionLabel>
          <PermissionCheckbox
            type="checkbox"
            checked={modalValues.Insertar}
            onChange={(e) => handleModalChange(e, "Insertar")}
          />
          Permitir Insertar
        </PermissionLabel>
        <PermissionLabel>
          <PermissionCheckbox
            type="checkbox"
            checked={modalValues.Editar}
            onChange={(e) => handleModalChange(e, "Editar")}
          />
          Permitir Editar
        </PermissionLabel>
      </PermissionsSection>

      <ModalButtonGroup>
        <GuardarButton onClick={SaveModal}>
          <FaSave /> Guardar
        </GuardarButton>
        <CancelButton onClick={handleCloseModal}>
          <FaTimes /> Cancelar
        </CancelButton>
      </ModalButtonGroup>
    </ModalWrapper>
  </ModalBackground>
)}
    </MainContainer>
  );
}

export default Roles;