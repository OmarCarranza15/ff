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
  width: 40%;
  position: relative;
  margin: center;
  margin: 0% 30%;

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

const GuardarButton = styled(ModalButton)`
  background-color: #4caf50;
`;





function RazonSocial() {
  const [departamento] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [errors, setErrors] = useState({ pais: "", departamento: "" }); //validaciones para insertar una nueva razon social
  const [modalValues, setModalValues] = useState({ ID_Pais: "", departamento: "" });
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal


  const [filters, setFilters] = useState({
    N_Departamento: "",
    N_Pais: "",
  });

  useEffect(()=> {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/departamento/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (departamento)=> {
            const paisResponse = await axios.get(`http://localhost:3000/pais/${departamento.ID_Pais}`); 
            
            return {
              id: departamento.id,   
              N_Departamento: departamento.N_Departamento,
              ID_Pais: departamento.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
            }
          })
        )
        setRecords(mappedData);
      } catch (error) {
        console.error ('Error al obtener los Departamentos:', error);
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
  
    fetchData();
    fetchPais();
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
    setModalValues({ pais: "", departamento: "" });
    setErrors({ pais: "", departamento: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };


  const SaveModal = async () => {
    const newErrors = { pais: "", departamento: "" };

    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo Pais es obligatorio";
    }

    if (!modalValues.departamento.trim()) {
      newErrors.departamento = "El campo división es obligatorio";
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.departamento)) {
      newErrors.departamento =
        "El campo departamento solo acepta letras y espacios en blanco";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el Departamento ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/departamento`);
        const departamentoExists = response.data.some(
          (departamento) => departamento.N_Departamento.toLowerCase() === modalValues.departamento.toLowerCase()
        );
        if (departamentoExists) {
          setErrors({ departamento: "El departamento ya existe" });
          return;
        }

        // Insertar una nuevo Departamento
        const newDepartamento = {
          N_Departamento: modalValues.departamento,
          ID_Pais: modalValues.ID_Pais,
        };
        const insertResponse = await axios.post(`http://localhost:3000/departamento`, newDepartamento);

        // Actualizar la lista de Depatamentos con el nuevo Departamento
        const paisResponse = await axios.get(`http://localhost:3000/pais/${modalValues.ID_Pais}`);

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            N_Departamento: modalValues.departamento,
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
            
          },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ ID_Pais: "", departamento: "" }); // Limpiar los valores del modal
      } catch (error) {
        console.error("Error al insertar un nuevo departamento:", error);
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
      ...(field === "ID_Departamento" && { N_Departamento: departamento.find((p) => p.id === parseInt(value)).N_Departamento }),
      ...(field === "ID_Pais" && { N_Pais: pais.find((p) => p.id === parseInt(value)).N_Pais }),
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
    } else if (field === "departamento") {
      if (!value.trim()) {
        newErrors.departamento = "El campo Departamento es obligatorio";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.departamento = "El campo Departamento solo acepta letras y espacios en blanco";
      } else {
        newErrors.departamento = "";
      }
    }
    setErrors(newErrors);
  };
  

  const saveChanges = async(id) => {
    try {

      const updateRow = {
        ...editedRow,
      }
      
      await axios.put(`http://localhost:3000/departamento/${id}`,updateRow);   

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
      (filters.N_Departamento === "" ||
        row.N_Departamento.toLowerCase().includes(filters.N_Departamento.toLowerCase()))
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
      name: "Departamento",
      selector: (row) => row.N_Departamento,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
            <input
            type="text"
            value={editedRow.N_Departamento}
            onChange={(e) => handleEditChange(e, "N_Departamento")}
          />
        ) : (
          <div>{row.N_Departamento}</div>
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
            <Title><h2 className="Title">Departamentos</h2></Title>
            <ButtonGroup>
              <Button primary onClick={toggleFilters}>
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
              <Button onClick={handleInsert}>Nuevo Departamento</Button>
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
              value={filters.N_Departamento}
              onChange={(e) => handleFilterChange(e, "N_Departamento")}
              placeholder="Buscar por Departamento"
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

      {/* Modal para insertar un nuevo departamento */}
{showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Departamento</ModalTitle>
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

            <ModalInput
              type="text"
              value={modalValues.departamento}
              onChange={(e) => handleModalChange(e, "departamento")}
              placeholder="Departamento"
              error={errors.departamento}
              required
            />
            {errors.departamento && <ErrorMessage>{errors.departamento}</ErrorMessage>}
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

export default RazonSocial;