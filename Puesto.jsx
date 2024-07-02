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
  width: 100%;
  position: relative;
  margin: center;

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
  font-size: 14px;
  margin-bottom: 8px;
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

const Select = styled.select`
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


function Puesto() {
  const [puesto] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [rsocial, setRsocial] = useState([]);
  const [division, setDivision] = useState([]);
  const [departamento, setDepartamento] = useState([]);
  const [centrocosto, setCentrocostos] = useState([]);
  const [errors, setErrors] = useState({ ID_Pais: "", Codigo: "", N_Puesto: "", ID_RSocial: "", ID_Division: "", ID_Departamento: "", ID_CentroCostos: "" });
  const [modalValues, setModalValues] = useState({ ID_Pais: "", Codigo: "", N_Puesto: "", ID_RSocial: "", ID_Division: "", ID_Departamento: "", ID_CentroCostos: "" });
  const [showModal, setShowModal] = useState(false);


  const [filters, setFilters] = useState({
    N_Puesto: "",
    Codigo: "",
    N_Pais: "",
    N_RSocial: "",
    N_Division: "",
    N_Departamento: "",
    Nombre: "",
  });

  useEffect(()=> {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/puesto/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (puesto)=> {
            const paisResponse = await axios.get(`http://localhost:3000/pais/${puesto.ID_Pais}`); 
            const rsocialResponse = await axios.get(`http://localhost:3000/rsocial/${puesto.ID_RSocial}`); 
            const divisionResponse = await axios.get(`http://localhost:3000/division/${puesto.ID_Division}`); 
            const departamentoResponse = await axios.get(`http://localhost:3000/departamento/${puesto.ID_Departamento}`); 
            const centrocostoResponse = await axios.get(`http://localhost:3000/centrocosto/${puesto.ID_CentroCostos}`); 
            
            return {
              id: puesto.id,   
              N_Puesto: puesto.N_Puesto,
              Codigo: puesto.Codigo,
              ID_Pais: puesto.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
              ID_RSocial: puesto.ID_RSocial,
              N_RSocial: rsocialResponse.data.N_RSocial,
              ID_Division: puesto.ID_Division,
              N_Division: divisionResponse.data.N_Division,
              ID_Departamento: puesto.ID_Departamento,
              N_Departamento: departamentoResponse.data.N_Departamento,
              ID_CentroCostos: puesto.ID_CentroCostos,
              Nombre: centrocostoResponse.data.Nombre,
            }
          })
        )
        setRecords(mappedData);
      } catch (error) {
        console.error ('Error al obtener los Puestos:', error);
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
    const fetchRsocial = async () =>{
        try {
             const response = await axios.get(`http://localhost:3000/rsocial/`);
             setRsocial(response.data);
         } catch (error) {
             console.error('Error al obtener la lista de razon social', error);
         }
     };
     const fetchDivision = async () =>{
        try {
             const response = await axios.get(`http://localhost:3000/division/`);
             setDivision(response.data);
        } catch (error) {
             console.error('Error al obtener la lista de division', error);
        }
    };
    const fetchDepartamento = async () =>{
        try {
             const response = await axios.get(`http://localhost:3000/departamento/`);
             setDepartamento(response.data);
        } catch (error) {
             console.error('Error al obtener la lista de departamentos', error);
        }
    };
  
      const fetchCentrocostos = async () =>{
        try {
             const response = await axios.get(`http://localhost:3000/centrocosto/`);
             setCentrocostos(response.data);
        } catch (error) {
             console.error('Error al obtener la lista de centro de costos', error);
        }
    };
  
    fetchData();
    fetchPais();
    fetchRsocial();
    fetchDivision();
    fetchDepartamento();
    fetchCentrocostos();
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
    setModalValues({ ID_Pais: "", Codigo: "", N_Puesto: "", ID_RSocial: "", ID_Division: "", ID_Departamento: "", ID_CentroCostos: "" });
    setErrors({ ID_Pais: "", Codigo: "", N_Puesto: "", ID_RSocial: "", ID_Division: "", ID_Departamento: "", ID_CentroCostos: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const SaveModal = async () => {
    const newErrors = { ID_Pais: "", Codigo: "", N_Puesto: "", ID_RSocial: "", ID_Division: "", ID_Departamento: "", ID_CentroCostos: "" };

    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo País es obligatorio";
    }
    if (!modalValues.ID_RSocial) {
      newErrors.rsocial = "El campo Razon Social es obligatorio";
    }
    if (!modalValues.ID_Division) {
      newErrors.division = "El campo Division es obligatorio";
    }
    if (!modalValues.ID_Departamento) {
      newErrors.departamento = "El campo Departamento es obligatorio";
    }
    if (!modalValues.ID_CentroCostos) {
      newErrors.centrocosto = "El campo País es obligatorio";
    }

    if (!modalValues.Codigo.trim()) {
      newErrors.Codigo = "El campo Código es obligatorio";
    }else if (/^\d*s/.test(modalValues.Codigo)){
      newErrors.Codigo = "Solo se aceptan Digitos"
    }

    if (!modalValues.N_Puesto.trim()) {
      newErrors.N_Puesto = "El campo Nombre es obligatorio";
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.N_Puesto)) {
      newErrors.N_Puesto = "El campo Nombre solo acepta letras y espacios en blanco";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el centro costo ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/puesto`);
        const puestoExists = response.data.some(
          (puesto) =>
            puesto.N_Puesto.toLowerCase() === modalValues.N_Puesto.toLowerCase() ||
            puesto.Codigo.toLowerCase() === modalValues.Codigo.toLowerCase()
        );

        if (puestoExists) {
          setErrors({ ...newErrors, N_Puesto: "El Nombre o Codigo del Centro de cosntos ya existe" });
          return;
        }

        // Insertar un nuevo Centro de Costos
        const newPuesto = {
          N_Puesto: modalValues.N_Puesto,
          Codigo: modalValues.Codigo,
          ID_Pais: modalValues.ID_Pais,
          ID_Division: modalValues.ID_Division,
          ID_Departamento: modalValues.ID_Departamento,
          ID_CentroCostos: modalValues.ID_CentroCostos,
          ID_RSocial: modalValues.ID_RSocial, 
        };
        const insertResponse = await axios.post(`http://localhost:3000/puesto`, newPuesto);

        // Actualizar la lista de Centro de Costos con el nuevo Centro de Costos
        const paisResponse = await axios.get(`http://localhost:3000/pais/${modalValues.ID_Pais}`);
        const divisionResponse = await axios.get(`http://localhost:3000/division/${modalValues.ID_Division}`);
        const departamentoResponse = await axios.get(`http://localhost:3000/departamento/${modalValues.ID_Departamento}`);
        const centrocostoResponse = await axios.get(`http://localhost:3000/centrocosto/${modalValues.ID_CentroCostos}`);
        const rsocialResponse = await axios.get(`http://localhost:3000/rsocial/${modalValues.ID_RSocial}`);

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            N_Puesto: modalValues.N_Puesto,
            Codigo: modalValues.Codigo,
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
            ID_Division: modalValues.ID_Division,
            N_Division: divisionResponse.data.N_Division,
            ID_Departamento: modalValues.ID_Departamento,
            N_Departamento: departamentoResponse.data.N_Departamento,
            ID_CentroCostos: modalValues.ID_CentroCostos,
            Nombre: centrocostoResponse.data.Nombre,
            ID_RSocial: modalValues.ID_RSocial,
            N_RSocial: rsocialResponse.data.N_RSocial,

          },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ ID_Pais: "", Codigo: "", N_Puesto: "", ID_RSocial: "", ID_Division: "", ID_Departamento: "", ID_CentroCostos: ""}); // Limpiar los valores del modal
      } catch (error) {
        console.error("Error al insertar un nuevo Puesto:", error);
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
      ...(field === "ID_Pais" && { N_Pais: pais.find((p) => p.id === parseInt(value)).N_Pais }),
      ...(field === "ID_Puesto" && { N_Puesto: puesto.find((p) => p.id === parseInt(value)).N_Puesto }),
      ...(field === "ID_Puesto" && { Codigo: puesto.find((p) => p.id === parseInt(value)).Codigo }),
      ...(field === "ID_RSocial" && { N_RSocial: rsocial.find((p) => p.id === parseInt(value)).N_RSocial }),
      ...(field === "ID_Division" && { N_Division: division.find((p) => p.id === parseInt(value)).N_Division }),
      ...(field === "ID_Departamento" && { N_Departamento: departamento.find((p) => p.id === parseInt(value)).N_Departamento }),
      ...(field === "ID_CentroCostos" && { Nombre: centrocosto.find((p) => p.id === parseInt(value)).Nombre }),
  }));
    validateInput(field, value);
  };

  const validateInput = (field, value) => {
    let newErrors = { ...errors };
    if (field === "ID_Pais") {
      if (!value.trim()) {
        newErrors.ID_Pais = "El campo País es obligatorio";
      } else {
        newErrors.ID_Pais = "";
      }
    }else if (field === "ID_RSocial") {
      if (!value.trim()) {
        newErrors.ID_RSocial = "El campo Razin social es obligatorio";
      } else {
        newErrors.ID_RSocial = "";
      }
    }else if (field === "ID_Division") {
      if (!value.trim()) {
        newErrors.ID_Division = "El campo Division es obligatorio";
      } else {
        newErrors.ID_Division = "";
      }
    }else if (field === "ID_Departamento") {
      if (!value.trim()) {
        newErrors.ID_Departamento = "El campo Departamento es obligatorio";
      } else {
        newErrors.ID_Departamento = "";
      }
    }else if (field === "ID_CentroCostos") {
      if (!value.trim()) {
        newErrors.ID_CentroCostos = "El campo Centro de Costos es obligatorio";
      } else {
        newErrors.ID_CentroCostos = "";
      }
    }else if (field === "Codigo") {
      if (!value.trim()) {
        newErrors.Codigo = "El campo Código es obligatorio";
      } else if (/^\d*s/.test(modalValues.Codigo)){
        newErrors.Codigo = "Solo se aceptan Digitos"
      }
    } else if (field === "Nombre") {
      if (!value.trim()) {
        newErrors.Nombre = "El campo Nombre es obligatorio";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.Nombre = "El campo Nombre solo acepta letras y espacios en blanco";
      } else {
        newErrors.Nombre = "";
      }
    }
    setErrors(newErrors);
  };
  

  const saveChanges = async(id) => {
    try {

      const updateRow = {
        ...editedRow,
      }
      
      await axios.put(`http://localhost:3000/puesto/${id}`,updateRow);   

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
        row.N_Departamento
            .toLowerCase()
            .includes(filters.N_Departamento.toLowerCase())) &&
    (filters.Nombre === "" ||
        row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())) &&
    (filters.N_RSocial === "" ||
        row.N_RSocial.toLowerCase().includes(filters.N_RSocial.toLowerCase())) &&
    (filters.N_Division === "" ||
        row.N_Division.toLowerCase().includes(filters.N_Division.toLowerCase())) &&
    (filters.Codigo === "" ||
        row.Codigo.toString().toLowerCase().includes(filters.Codigo.toLowerCase())) &&
    (filters.N_Puesto === "" ||
        row.N_Puesto.toLowerCase().includes(filters.N_Puesto.toLowerCase())) 
    
        );
  });

  const columns = [
    {
        name: "Pais",
        selector: (row) => row.N_Pais,
        sortable: true,
        minWidth: "10px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "100px", // Ajusta el tamaño máximo según sea necesario
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
        name: "Razon Social",
        selector: (row) => row.N_RSocial,
        sortable: true,
        minWidth: "240px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
            <select value={editedRow.ID_RSocial} onChange={(e) => handleEditChange(e, "ID_RSocial")}>
              {rsocial.map((rsocial) => (
                <option key={rsocial.id} value={rsocial.id}>
                  {rsocial.N_RSocial}
                </option>
              ))}
            </select>
          ) : (
            <div>{row.N_RSocial}</div>
          ),
      },
      {
        name: "Division",
        selector: (row) => row.N_Division,
        sortable: true,
        minWidth: "220px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
            <select value={editedRow.ID_Division} onChange={(e) => handleEditChange(e, "ID_Division")}>
              {division.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.N_Division}
                </option>
              ))}
            </select>
          ) : (
            <div>{row.N_Division}</div>
          ),
      },
      {
        name: "Departamento",
        selector: (row) => row.N_Departamento,
        sortable: true,
        minWidth: "250px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
            <select value={editedRow.ID_Departamento} onChange={(e) => handleEditChange(e, "ID_Departamento")}>
              {departamento.map((departamento) => (
                <option key={departamento.id} value={departamento.id}>
                  {departamento.N_Departamento}
                </option>
              ))}
            </select>
          ) : (
            <div>{row.N_Departamento}</div>
          ),
      },
      {
        name: "Centro de Costos",
        selector: (row) => row.Nombre,
        sortable: true,
        minWidth: "300px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
            <select value={editedRow.ID_CentroCostos} onChange={(e) => handleEditChange(e, "ID_CentroCostos")}>
              {centrocosto.map((centrocosto) => (
                <option key={centrocosto.id} value={centrocosto.id}>
                  {centrocosto.Nombre}
                </option>
              ))}
            </select>
          ) : (
            <div>{row.Nombre}</div>
          ),
      },
      {
        name: "Codigo",
        selector: (row) => row.Codigo,
        sortable: true,
        minWidth: "10px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "2000px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
              <input
              type= "text"
              value={editedRow.Codigo}
              onChange={(e) => handleEditChange(e, "Codigo")}
            />
          ) : (
            <div>{row.Codigo}</div>
          ),
      },
    {
      name: "Puesto",
      selector: (row) => row.N_Puesto,
      sortable: true,
      minWidth: "300px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
            <input
            type="text"
            value={editedRow.N_Puesto}
            onChange={(e) => handleEditChange(e, "N_Puesto")}
          />
        ) : (
          <div>{row.N_Puesto}</div>
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
            <Title><h2 className="Title">Puestos</h2></Title>
            <ButtonGroup>
              <Button primary onClick={toggleFilters}>
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
              <Button onClick={handleInsert}>Nuevo Puesto</Button>
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
              value={filters.N_RSocial}
              onChange={(e) => handleFilterChange(e, "N_RSocial")}
              placeholder="Buscar por Razon Social"
            />
            <FilterInput
              type="text"
              value={filters.N_Division}
              onChange={(e) => handleFilterChange(e, "N_Division")}
              placeholder="Buscar por Division"
            />
            <FilterInput
              type="text"
              value={filters.N_Departamento}
              onChange={(e) => handleFilterChange(e, "N_Departamento")}
              placeholder="Buscar por Departamento"
            />
            <FilterInput
              type="text"
              value={filters.Nombre}
              onChange={(e) => handleFilterChange(e, "Nombre")}
              placeholder="Buscar por Centro de Costos"
            />
            <FilterInput
              type="text"
              value={filters.Codigo}
              onChange={(e) => handleFilterChange(e, "Codigo")}
              placeholder="Buscar por Codigo"
            />
            <FilterInput
              type="text"
              value={filters.N_Puesto}
              onChange={(e) => handleFilterChange(e, "N_Puesto")}
              placeholder="Buscar por Puesto"
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
      {/* Modal para insertar una nuevo departamento */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Puesto</ModalTitle>
            <ModalInput
              type="text"
              value={modalValues.Codigo}
              onChange={(e) => handleModalChange(e, "Codigo")}
              placeholder="Codigo del Puesto"
              error={errors.Codigo}
              required
            />
            {errors.Codigo && (
              <ErrorMessage>{errors.Codigo}</ErrorMessage>
            )}
            <ModalInput
              type="text"
              value={modalValues.N_Puesto}
              onChange={(e) => handleModalChange(e, "N_Puesto")}
              placeholder="Nombre del Puesto"
              error={errors.N_Puesto}
              required
            />
            {errors.N_Puesto && (
              <ErrorMessage>{errors.N_Puesto}</ErrorMessage>
            )}
            <Select
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
            </Select>
            {errors.pais && <ErrorMessage>{errors.pais}</ErrorMessage>}

            <Select
              value={modalValues.ID_RSocial}
              onChange={(e) => handleModalChange(e, "ID_RSocial")}
              error={errors.rsocial}
              required
            >
              <option value="">Seleccione una Razon Social</option>
              {rsocial.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_RSocial}
                </option>
              ))}
            </Select>
            {errors.rsocial && <ErrorMessage>{errors.rsocial}</ErrorMessage>}

            <Select
              value={modalValues.ID_Division}
              onChange={(e) => handleModalChange(e, "ID_Division")}
              error={errors.division}
              required
            >
              <option value="">Seleccione una Division</option>
              {division.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Division}
                </option>
              ))}
            </Select>
            {errors.division && <ErrorMessage>{errors.division}</ErrorMessage>}

            <Select
              value={modalValues.ID_Departamento}
              onChange={(e) => handleModalChange(e, "ID_Departamento")}
              error={errors.departamento}
              required
            >
              <option value="">Seleccione una Departamento</option>
              {departamento.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Departamento}
                </option>
              ))}
            </Select>
            {errors.departamento && (
              <ErrorMessage>{errors.departamento}</ErrorMessage>
            )}

            <Select
              value={modalValues.ID_CentroCostos}
              onChange={(e) => handleModalChange(e, "ID_CentroCostos")}
              error={errors.centrocosto}
              required
            >
              <option value="">Seleccione un Centro de Costos</option>
              {centrocosto.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.Nombre}
                </option>
              ))}
            </Select>
            {errors.centrocoste && (
              <ErrorMessage>{errors.centrocoste}</ErrorMessage>
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

export default Puesto;
