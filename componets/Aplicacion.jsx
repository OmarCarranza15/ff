import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import styled from "styled-components";
import "../styles/DataTable.css"; // Importa el archivo CSS
import axios from "axios";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa"; // Importa el ícono de edición


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
  width: 55%;
  position: relative;
  margin: center;
  margin: 0% 20%;

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
const SelectPais = styled.select`
  width: 100%;
  padding: 7px;
  margin-bottom: 9px;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  ${(props) => props.error && `border: 1px solid red;`}
`;

const SelectAmbiente= styled.select`
  width: 100%;
  padding: 7px;
  margin-bottom: 9px;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  ${(props) => props.error && `border: 1px solid red;`}
`;

const GuardarButton = styled(ModalButton)`
  background-color: #4caf50;
`;





function Aplicacion() {
  const [aplicacion] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [ambiente, setAmbiente] = useState([]);
  const [errors, setErrors] = useState({ pais: "", aplicacion: "", ambiente: "" }); //validaciones para insertar una nueva razon social
  const [modalValues, setModalValues] = useState({ ID_Pais: "", aplicacion: "", ID_Ambiente: "" });
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal


  const [filters, setFilters] = useState({
    N_Aplicaciones: "",
    N_Pais: "",
    N_Ambiente: "",
  });

  useEffect(()=> {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/aplicacion/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (aplicacion)=> {
            const paisResponse = await axios.get(`http://localhost:3000/pais/${aplicacion.ID_Pais}`); 
            const ambienteResponse = await axios.get(`http://localhost:3000/ambiente/${aplicacion.ID_Ambiente}`); 
            
            return {
              id: aplicacion.id,   
              N_Aplicaciones: aplicacion.N_Aplicaciones,
              ID_Pais: aplicacion.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
              ID_Ambiente: aplicacion.ID_Ambiente,
              N_Ambiente: ambienteResponse.data.N_Ambiente,

            }
          })
        )
        setRecords(mappedData);
      } catch (error) {
        console.error ('Error al obtener los Ambientes:', error);
      }
    };
    const fetchPais = async () =>{
        try {
            const response = await axios.get(`http://localhost:3000/pais/`);
            setPais(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de Paises', error);
        }
    };
    const fetchAmbiente = async () =>{
        try {
             const response = await axios.get(`http://localhost:3000/ambiente/`);
             setAmbiente(response.data);
        } catch (error) {
             console.error('Error al obtener la lista de ambientes', error);
        }
    };
  
    fetchData();
    fetchPais();
    fetchAmbiente();
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
    setModalValues({ pais: "", aplicacion: "", ambiente: "" });
    setErrors({ pais: "", aplicacion: "", ambiente: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const SaveModal = async () => {
    const newErrors = { pais: "", aplicacion: "", ambiente: "" };

    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo Pais es obligatorio";
    }
    if (!modalValues.ID_Ambiente) {
      newErrors.ambiente = "El campo Ambiente es obligatorio";
    }

    if (!modalValues.aplicacion.trim()) {
      newErrors.aplicacion = "El campo aplicacion es obligatorio";
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.aplicacion)) {
      newErrors.aplicacion =
        "El campo aplicacion solo acepta letras y espacios en blanco";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si la Aplicacion ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/aplicacion`);
        const aplicacionExists = response.data.some(
          (aplicacion) => aplicacion.N_Aplicaciones.toLowerCase() === modalValues.aplicacion.toLowerCase()
        );
        if (aplicacionExists) {
          setErrors({ aplicacion: "El Aplicacion ya existe" });
          return;
        }

        // Insertar una nueva Aplicacion
        const newAplicacion = {
          N_Aplicaciones: modalValues.aplicacion,
          ID_Pais: modalValues.ID_Pais,
          ID_Ambiente: modalValues.ID_Ambiente,
        };
        const insertResponse = await axios.post(`http://localhost:3000/aplicacion`, newAplicacion);

        // Actualizar la lista de Aplicaciones con la nueva aplicacion
        const paisResponse = await axios.get(`http://localhost:3000/pais/${modalValues.ID_Pais}`);
        const ambienteResponse = await axios.get(`http://localhost:3000/ambiente/${modalValues.ID_Ambiente}`)

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            N_Aplicaciones: modalValues.aplicacion,
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
            ID_Ambiente: modalValues.ID_Ambiente,
            N_Ambiente: ambienteResponse.data.N_Ambiente,
            
          },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ ID_Pais: "", aplicacion: "", ID_Ambiente: "" }); // Limpiar los valores del modal
      } catch (error) {
        console.error("Error al insertar un nuevo Ambiente:", error);
      }
    }
  };


  const startEdit = (row) => {
    setEditedRow({ ...row });
    setEditMode(row.id);
  };

  const handleEditChange = (event, field) => {
    const { value } = event.target;
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === "ID_Aplicaciones" && { N_Aplicaciones: aplicacion.find((p) => p.id === parseInt(value)).N_Aplicaciones }),
      ...(field === "ID_Pais" && { N_Pais: pais.find((p) => p.id === parseInt(value)).N_Pais }),
      ...(field === "ID_Ambiente" && { N_Ambiente: ambiente.find((p) => p.id === parseInt(value)).N_Ambiente }),
  }));
  validateInput(field, value);
  };

  const validateInput = (field, value) => {
    let newErrors = { ...errors };
    if (field === "pais") {
      if (!value.trim()) {
        newErrors.pais = "El campo Pais es obligatorio";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.pais = "El campo Pais solo acepta letras y espacios en blanco";
      } else {
        newErrors.pais = "";
      }
    }else if (field === "ambiente") {
      if (!value.trim()) {
        newErrors.ambiente = "El campo Ambiente es obligatorio";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.ambiente = "El campo Ambiente solo acepta letras y espacios en blanco";
      } else {
        newErrors.ambiente = "";
      }
    }else if (field === "aplicacion") {
      if (!value.trim()) {
        newErrors.aplicacion = "El campo Aplicacion es obligatorio";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.aplicacion = "El campo Aplicacion solo acepta letras y espacios en blanco";
      } else {
        newErrors.aplicacion = "";
      }
    }
    setErrors(newErrors);
  };
  

  const saveChanges = async(id) => {
    try {

      const updateRow = {
        ...editedRow,
      }
      
      await axios.put(`http://localhost:3000/aplicacion/${id}`,updateRow);   

      const updatedRecords = records.map ((row) => 
        row.id === id ? {...editedRow} : row
      )
      
      //setRecords(updatedRecordsPuesto);
      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null); 
    
                                                                               
      console.log("Cambios guardados correctamente");
    } catch(error) {
      console.error("Error al guardar los cambios", error)
    }
  };

  const cancelEdit = () => {
    setEditedRow(null);
    setEditMode(null);
  };

  const filteredData = records.filter((row) => {
   return(
    (filters.N_Pais === "" ||
        row.N_Pais
          .toLowerCase()
          .includes(filters.N_Pais.toLowerCase())) &&
      (filters.N_Aplicaciones === "" ||
        row.N_Aplicaciones.toLowerCase().includes(filters.N_Aplicaciones.toLowerCase())) &&
        (filters.N_Ambiente === "" ||
            row.N_Ambiente.toLowerCase().includes(filters.N_Ambiente.toLowerCase())) 
        );
  });

  const columns = [
    {
        name: "Pais",
        selector: (row) => row.N_Pais,
        sortable: true,
        minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
            <select value={editedRow.ID_Pais} onChange={(e) => handleEditChange(e, "ID_Pais")}>
              {pais.map((pais) => (
                <option key={pais.id} value={pais.id}>
                  {pais.N_Pais}
                </option>
              ))}
            </select>
          ) : (
            <div>{row.N_Pais}</div>
          ),
      },
    {
      name: "Aplicacion",
      selector: (row) => row.N_Aplicaciones,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
            <input
            type="text"
            value={editedRow.N_Aplicaciones}
            onChange={(e) => handleEditChange(e, "N_Aplicaciones")}
          />
        ) : (
          <div>{row.N_Aplicaciones}</div>
        ),
    },
    {
        name: "Ambiente",
        selector: (row) => row.N_Ambiente,
        sortable: true,
        minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
            <select value={editedRow.ID_Ambiente} onChange={(e) => handleEditChange(e, "ID_Ambiente")}>
              {ambiente.map((ambiente) => (
                <option key={ambiente.id} value={ambiente.id}>
                  {ambiente.N_Ambiente}
                </option>
              ))}
            </select>
          ) : (
            <div>{row.N_Ambiente}</div>
          ),
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
            <Title><h2 className="Title">Aplicaciones</h2></Title>
            <ButtonGroup>
              <Button primary onClick={toggleFilters}>
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
              <Button onClick={handleInsert}>Nueva Aplicacion</Button>
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
          </FilterWrapper>
          <StyledDataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={30}
            showFilters={showFilters}
          />
        </DataTableContainer>
      </ContentContainer>
       {/* Modal para insertar una nueva aplicacion */}
       {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nueva Aplicación</ModalTitle>
            <SelectPais
              value={modalValues.ID_Pais}
              onChange={(e) => handleModalChange(e, "ID_Pais")}
              error={errors.pais}
              required
            >
              <option value="">Seleccione un país</option>
              {pais.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Pais}
                </option>
              ))}
            </SelectPais>
            {errors.pais && <ErrorMessage>{errors.pais}</ErrorMessage>}
            <SelectAmbiente
              value={modalValues.ID_Ambiente}
              onChange={(e) => handleModalChange(e, "ID_Ambiente")}
              error={errors.ambiente}
              required
            >
              <option value="">Seleccione un ambiente</option>
              {ambiente.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Ambiente}
                </option>
              ))}
            </SelectAmbiente>
            {errors.ambiente && <ErrorMessage>{errors.ambiente}</ErrorMessage>}
            <ModalInput
              type="text"
              value={modalValues.aplicacion}
              onChange={(e) => handleModalChange(e, "aplicacion")}
              placeholder="Aplicacion"
              error={errors.aplicacion}
              required
            />
            {errors.aplicacion && (
              <ErrorMessage>{errors.aplicacion}</ErrorMessage>
            )}
            <ModalButtonGroup>
              <GuardarButton onClick={SaveModal}>
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

export default Aplicacion;