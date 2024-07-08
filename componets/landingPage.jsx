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
  color:#083cac;
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
`;

const FilterInput = styled.input`
  padding: 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 14px;
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

/////////////MODAL////////////////
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
  padding: 7px;
  margin-bottom: 9px;
  border: 1px solid ${(props) => (props.error ? "red" : "#ccc")};
  border-radius: 1px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #008cba;
    box-shadow: 0 0 5px rgba(0, 140, 186, 0.5);
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 2px;
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
////////////////////////////////////////////////////////////////////////////////


function LandingPage() {
  
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [rsocial, setRsocial] = useState([]);
  const [division, setDivision] = useState([]);
  const [departamento, setDepartamento] = useState([]);
  const [centrocosto, setCentrocostos] = useState([]);
  const [aplicacion, setAplicacion] = useState([]);
  const [ambiente, setAmbiente] = useState([]);
  const [pais, setPais] = useState([]);
  const [errors, setErrors] = useState({ ID_Pais: "", Rol: "", Ticket:"", Observaciones: "", Puesto_Jefe: "", Estado_Perfil: "", ID_Puesto: "", ID_Aplicaciones:"" });
  const [modalValues, setModalValues] = useState({ ID_Pais: "", Rol: "", Ticket:"", Observaciones: "", Puesto_Jefe: "", Estado_Perfil: "", ID_Puesto: "", ID_Aplicaciones:"" });
  const [showModal, setShowModal] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  
  
  

  const [filters, setFilters] = useState({
    N_RSocial: "",
    N_Departamento: "",
    N_Pais: "",
    N_Puesto: "",
    Rol: "",
    N_Aplicaciones: "",
    N_Ambiente: "",
    Puesto_Jefe: "",
    Ticket: "",
    Nombre: "", //Nombre del centro de costos
    Observaciones: "",
    Estado_Perfil: "",
    ID_Pais: "",
    ID_Aplicaciones: "",
    ID_Puesto:"",
    ID_Ambiente:"",
  });

  
  const handleToggleColumns = () =>{
    setShowColumns(!showColumns);
  } 
  

  useEffect(()=> {
   
      
      

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/perfil/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (perfil)=> {
            const puestoResponse = await axios.get(`http://localhost:3000/puesto/${perfil.ID_Puesto}`);
            const aplicacionResponse = await axios.get(`http://localhost:3000/aplicacion/${perfil.ID_Aplicaciones}`);
            const rsocialResponse = await axios.get(`http://localhost:3000/rsocial/${puestoResponse.data.ID_RSocial}`);
            const divisionResponse = await axios.get(`http://localhost:3000/division/${puestoResponse.data.ID_Division}`);
            const departamentoResponse = await axios.get(`http://localhost:3000/departamento/${puestoResponse.data.ID_Departamento}`);
            const centrocostosResponse = await axios.get(`http://localhost:3000/centrocosto/${puestoResponse.data.ID_CentroCostos}`)
            const paisResponse = await axios.get(`http://localhost:3000/pais/${perfil.ID_Pais}`); 
            const ambienteResponse = await axios.get(`http://localhost:3000/ambiente/${aplicacionResponse.data.ID_Ambiente}`)

            return {
              N_RSocial: rsocialResponse.data.N_RSocial,
              N_Division: divisionResponse.data.N_Division,
              N_Puesto: puestoResponse.data.N_Puesto,
              N_Pais: paisResponse.data.N_Pais,
              N_Departamento: departamentoResponse.data.N_Departamento,
              Rol: perfil.Rol,
              N_Aplicaciones: aplicacionResponse.data.N_Aplicaciones,
              N_Ambiente: ambienteResponse.data.N_Ambiente,
              Puesto_Jefe: perfil.Puesto_Jefe,
              Ticket: perfil.Ticket,
              Observaciones: perfil.Observaciones,
              Estado_Perfil: perfil.Estado_Perfil === 1 ? "Activo": "Inactivo",
              id: perfil.id,
              ID_Pais: perfil.ID_Pais,
              ID_Aplicaciones: perfil.ID_Aplicaciones,
              ID_Puesto: perfil.ID_Puesto,
              ID_Ambiente: aplicacionResponse.data.ID_Ambiente,
              ID_RSocial: puestoResponse.data.ID_RSocial,
              ID_Division: puestoResponse.data.ID_Division,
              ID_Departamento: puestoResponse.data.ID_Departamento,
              ID_CentroCostos: puestoResponse.data.ID_CentroCostos,
              Nombre: centrocostosResponse.data.Nombre, 
            }
          })
        )
        setRecords(mappedData);
      } catch (error) {
        console.error ('Error al obtener los perfiles:', error);
      }
    };

    const fetchPuestos = async () =>{
      try {
          const response = await axios.get(`http://localhost:3000/puesto/`);
          setPuestos(response.data);
      } catch (error) {
          console.error('Error al obtener la lista de puestos', error);
      }
  }
    const fetchPais = async () =>{
      try {
          const response = await axios.get(`http://localhost:3000/pais/`);
          setPais(response.data);
      } catch (error) {
          console.error('Error al obtener la lista de pais', error);
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
    const fetchAplicacion = async () =>{
      try {
           const response = await axios.get(`http://localhost:3000/aplicacion/`);
           setAplicacion(response.data);
      } catch (error) {
           console.error('Error al obtener la lista de aplicaciones', error);
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
    fetchAmbiente();
    fetchPais();
    fetchAplicacion();
    fetchCentrocostos();
    fetchDepartamento();
    fetchDivision();
    fetchRsocial();
    fetchPuestos();
    fetchData();
  })

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
    setModalValues({ ID_Pais: "", Rol: "", Ticket:"", Observaciones: "", Puesto_Jefe: "", Estado_Perfil: "", ID_Puesto: "", ID_Aplicaciones:"" });
    setErrors({ ID_Pais: "", Rol: "", Ticket:"", Observaciones: "", Puesto_Jefe: "", Estado_Perfil: "", ID_Puesto: "", ID_Aplicaciones:"" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const SaveModal = async () => {
    const newErrors = {
      ID_Pais: "",
      ID_Puesto: "",
      ID_Aplicaciones: "",
      Estado_Perfil: "",
      Rol: "",
      Puesto_Jefe: "",
      Observaciones: "",
      Ticket: "",
    };
  
    // Validación de campos
    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo País es obligatorio";
    }
    if (!modalValues.ID_Puesto) {
      newErrors.puesto = "El campo Puesto es obligatorio";
    }
    if (!modalValues.ID_Aplicaciones) {
      newErrors.aplicacion = "El campo Aplicación es obligatorio";
    }
    if (!modalValues.Rol.trim()) {
      newErrors.Rol = "El rol es obligatorio";
    }
    if (!modalValues.Ticket.trim()) {
      
    } else if (!/^\d+$/.test(modalValues.Ticket)) {
      newErrors.Ticket = "Solo se aceptan Dígitos";
    }
    if (!modalValues.Puesto_Jefe.trim()) {
      newErrors.Puesto_Jefe =
        "El nombre del puesto del jefe inmediato es obligatorio.";
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.Puesto_Jefe)) {
      newErrors.Puesto_Jefe =
        "El campo del jefe inmediato solo acepta letras y espacios en blanco.";
    }
  
    setErrors(newErrors);
  
    // Si no hay errores, proceder a insertar el nuevo perfil
    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el perfil ya existe en la base de datos
        console.log("Verificando si el perfil ya existe...");
        const response = await axios.get(`http://localhost:3000/perfil`);
        console.log("Datos recibidos del servidor:", response.data);
  
        const perfiles = response.data;

        const rollExistente = perfiles.some(
          (perfil) => perfil.Rol.toLowerCase() === modalValues.Rol.toLowerCase()
        )
        const jefeinExistente = perfiles.some(
          (perfil) => perfil.Puesto_Jefe.toLowerCase() === modalValues.Puesto_Jefe.toLowerCase()
        )
        const paisExistente = perfiles.some(
          (perfil) => perfil.ID_Pais.toString() === modalValues.ID_Pais
        )
        const puestoExistente = perfiles.some(
          (perfil) => perfil.ID_Puesto.toString() === modalValues.ID_Puesto
        )
        const aplicacionExistente = perfiles.some(
          (perfil) => perfil.ID_Aplicaciones.toString() === modalValues.ID_Aplicaciones
        )

        if (rollExistente && jefeinExistente && paisExistente && puestoExistente && aplicacionExistente){
    
          setErrors({...newErrors, PerError: "El perfil ya existe, cambiar uno de los valores Rol, Jefe Inmediato, Puesto, Aplicacion o Pais"});
          return;
        }
  
  
        // Datos del nuevo perfil
        const newPerfil = {
          Estado_Perfil: 1,
          ID_Pais: parseInt(modalValues.ID_Pais, 10),
          ID_Aplicaciones: parseInt(modalValues.ID_Aplicaciones, 10),
          ID_Puesto: parseInt(modalValues.ID_Puesto, 10),
          Rol: modalValues.Rol,
          Ticket: parseInt(modalValues.Ticket, 10),
          Observaciones: modalValues.Observaciones,
          Puesto_Jefe: modalValues.Puesto_Jefe,
        };
  
        console.log("Enviando datos:", newPerfil);
  
        // Enviar solicitud POST para insertar el nuevo perfil
        const insertResponse = await axios.post(
          `http://localhost:3000/perfil`,
          newPerfil
        );
  
        console.log("Respuesta de inserción:", insertResponse.data);
  
        // Actualizar la lista de perfiles con el nuevo perfil
        const paisResponse = await axios.get(
          `http://localhost:3000/pais/${modalValues.ID_Pais}`
        );
        const aplicacionResponse = await axios.get(
          `http://localhost:3000/aplicacion/${modalValues.ID_Aplicaciones}`
        );
        const puestoResponse = await axios.get(
          `http://localhost:3000/puesto/${modalValues.ID_Puesto}`
        );
  
        console.log("Datos de respuesta para actualizar la UI:", {
          paisResponse: paisResponse.data,
          aplicacionResponse: aplicacionResponse.data,
          puestoResponse: puestoResponse.data,
        });
  
        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            Rol: modalValues.Rol,
            Observaciones: modalValues.Observaciones,
            Puesto_Jefe: modalValues.Puesto_Jefe,
            Ticket: parseInt(modalValues.Ticket, 10),
            Estado_Perfil: 1,
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
            ID_Aplicaciones: modalValues.ID_Aplicaciones,
            N_Aplicaciones: aplicacionResponse.data.N_Aplicaciones,
            ID_Puesto: modalValues.ID_Puesto,
            N_Puesto: puestoResponse.data.N_Puesto,
          },
        ];
  
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({
          ID_Pais: "",
          Rol: "",
          Ticket: "",
          Observaciones: "",
          Puesto_Jefe: "",
          Estado_Perfil: "",
          ID_Puesto: "",
          ID_Aplicaciones: "",
        }); // Limpiar los valores del modal
        window.location.reload();
      } catch (error) {
        console.error("Error al insertar un nuevo Perfil:", error);
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
      ...(field === "ID_Aplicaciones" && { N_Aplicaciones: aplicacion.find((p) => p.id === parseInt(value)).N_Aplicaciones }),
      ...(field === "ID_Puesto" && { N_Puesto: puestos.find((p) => p.id === parseInt(value)).N_Puesto }),
      ...(field === "ID_Ambiente" && { N_Ambiente: ambiente.find((p) => p.id === parseInt(value)).N_Ambiente }),
      ...(field === "ID_RSocial" && { N_RSocial: rsocial.find((p) => p.id === parseInt(value)).N_RSocial }),
      ...(field === "ID_Division" && { N_Division: division.find((p) => p.id === parseInt(value)).N_Division }),
      ...(field === "ID_Departamento" && { N_Departamento: departamento.find((p) => p.id === parseInt(value)).N_Departamento }),
      ...(field === "ID_CentroCostos" && { Nombre: centrocosto.find((p) => p.id === parseInt(value)).Nombre }),
    } 
    ));
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
    }else if (field === "Ticket") {
      if (!/^\d+$/.test(modalValues.Ticket)){
        newErrors.Ticket = "Solo se aceptan Digitos"
      }
    }else if (field === "ID_Aplicaciones") {
      if (!value.trim()) {
        newErrors.ID_Aplicaciones = "El campo Aplicacion es obligatorio";
      } else {
        newErrors.ID_Aplicaciones = "";
      }
    }else if (field === "ID_Puesto") {
      if (!value.trim()) {
        newErrors.ID_Puesto = "El campo Puesto es obligatorio";
      } else {
        newErrors.ID_Puesto = "";
      }
    }else if (field === "Rol") {
      if (!value.trim()) {
        newErrors.Rol = "El campo Rol es obligatorio";
      } else {
        newErrors.Rol = "";
      }
    }else if (field === "Puesto_Jefe"){
      if (!value.trim()) {
        newErrors.Puesto_Jefe= "EL campo puesto es obligatorio"
      }else if (!/^[a-zA-Z\s]+$/.test(value)){
        newErrors.Puesto_Jefe = "El campo del jefe inmediato solo acepta letras y espacios en blanco.";
      }else {
        newErrors.Puesto_Jefe = "";
      }
    }
    setErrors(newErrors);
  };

  const saveChanges = async(id) => {
    try {

      const updateRow = {
        ...editedRow,
        Estado_Perfil: editedRow.Estado_Perfil === "Activo" ? 1: 2,
      }
      
      await axios.put(`http://localhost:3000/perfil/${id}`,updateRow);   

      if (editedRow.ID_Ambiente !== records.find(row => row.id === id).ID_Ambiente){
        await axios.put(`http://localhost:3000/aplicacion/${editedRow.ID_Aplicaciones}`,{
          ID_Ambiente: editedRow.ID_Ambiente
        });
      } 
      
      if (editedRow.ID_RSocial !== records.find(row => row.id === id).ID_RSocial){
        await axios.put(`http://localhost:3000/puesto/${editedRow.ID_Puesto}`,{
          ID_RSocial: editedRow.ID_RSocial
        });
      }  

      if (editedRow.ID_Division !== records.find(row => row.id === id).ID_Division){
        await axios.put(`http://localhost:3000/puesto/${editedRow.ID_Puesto}`,{
          ID_Division: editedRow.ID_Division
        });
      }  

      if (editedRow.ID_Departamento !== records.find(row => row.id === id).ID_Departamento){
        await axios.put(`http://localhost:3000/puesto/${editedRow.ID_Puesto}`,{
          ID_Departamento: editedRow.ID_Departamento
        });
      } 

      if (editedRow.ID_CentroCostos !== records.find(row => row.id === id).ID_CentroCostos){
        await axios.put(`http://localhost:3000/puesto/${editedRow.ID_Puesto}`,{
          ID_CentroCostos: editedRow.ID_CentroCostos
        });
      } 
      

      const updatedRecords = records.map ((row) => 
        row.id === id ? {...editedRow} : row
      )
      //setRecords(updatedRecordsPuesto);
      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null); 
    
                                                                               
      console.log("Cambios guardados correctamente");
      window.location.reload();
    } catch(error) {
      console.error("Error al guardar los cambios", error)
    }
  };

  const cancelEdit = () => {
    setEditedRow(null);
    setEditMode(null);
  };

  

      const filtered = records.filter((row) => {
        const isActive = filters.Estado_Perfil.toLowerCase() === "activo";
    
        return (
          (filters.N_RSocial === "" || row.N_RSocial.toLowerCase().includes(filters.N_RSocial.toLowerCase())) &&
          (filters.N_Pais === "" || row.N_Pais.toLowerCase().includes(filters.N_Pais.toLowerCase())) &&
          (filters.N_Departamento === "" || row.N_Departamento.toLowerCase().includes(filters.N_Departamento.toLowerCase())) &&
          (filters.Rol === "" || row.Rol.toLowerCase().includes(filters.Rol.toLowerCase())) &&
          (filters.Nombre === "" || row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())) &&
          (filters.N_Puesto === "" || row.N_Puesto.toLowerCase().includes(filters.N_Puesto.toLowerCase())) &&
          (filters.Observaciones === "" || row.Observaciones.toLowerCase().includes(filters.Observaciones.toLowerCase())) &&
          (filters.N_Aplicaciones === "" || row.N_Aplicaciones.toLowerCase().includes(filters.N_Aplicaciones.toLowerCase())) &&
          (filters.Ticket === "" || (row.Ticket ? row.Ticket.toString().includes(filters.Ticket.toString()) : false)) &&
          /*(filters.N_Ambiente === "" || row.N_Ambiente.toLowerCase().includes(filters.N_Ambiente.toLowerCase())) &&*/
          (filters.Puesto_Jefe === "" || row.Puesto_Jefe.toLowerCase().includes(filters.Puesto_Jefe.toLowerCase())) &&
          (filters.Estado_Perfil === "" || row.Estado_Perfil.toLowerCase().includes(filters.Estado_Perfil.toLowerCase())) &&
          (isActive ? row.Estado_Perfil.toLowerCase() === "activo" : true)
        );
      }); 
    
  
   

  const columns = [
    {
      name: "Pais",
      selector: (row) => row.N_Pais,
      //omit: !showColumns,
      
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
      name: "Razon Social",
      selector: (row) => row.N_RSocial,
      sortable: true,
      omit: !showColumns,
      minWidth: "250px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <div style={{color: "red"}}>{row.N_RSocial}</div>
        ):(
            <div>{row.N_RSocial}</div>
          )
    },
    /*{
      name: "División",
      selector: (row) => row.N_Division,
      sortable: true,
      minWidth: "230px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => 
        editMode && editedRow?.id === row.id ? (
          <div style={{color: "red"}}>{row.N_Division}</div>
        ):(
            <div>{row.N_Division}</div>
          )
    },*/
    {
      name: "Departamento",
      selector: (row) => row.N_Departamento,
      sortable: true,
      omit: !showColumns,
      minWidth: "250px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <div style={{color: "red"}}>{row.N_Departamento}</div>
        ):(
            <div>{row.N_Departamento}</div>
          )
    },
    {
      name: "Centro de Costos",
      selector: (row) => row.Nombre,
      sortable: true,
      omit: !showColumns,
      minWidth: "350px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
        <div style={{color: "red"}}>{row.Nombre}</div>
      ):(
          <div>{row.Nombre}</div>
        )
    },
    {
      name: "Puesto",
      selector: (row) => row.N_Puesto,
      sortable: true,
      minWidth: "350px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "800px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => 
        editMode && editedRow?.id === row.id ? (
          <select value={editedRow.ID_Puesto} onChange={(e) => handleEditChange(e, "ID_Puesto")}>
            {puestos.map((puestos) => (
              <option key={puestos.id} value={puestos.id}>
                {puestos.N_Puesto}
              </option>
            ))}
          </select>
        ) : (
          <div>{row.N_Puesto}</div>
      ),
    },
    {
      name: "Rol",
      selector: (row) => row.Rol,
      sortable: true,
      minWidth: "370px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "800px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => 
        editMode && editedRow?.id === row.id ? (
          <input
            type="text"
            value={editedRow.Rol}
            onChange={(e) => handleEditChange(e, "Rol")}
          />
        ) : (
          <div>{row.Rol}</div>
      ),
    },
    {
      name: "Aplicación",
      selector: (row) => row.N_Aplicaciones,
      sortable: true,
      minWidth: "150px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "600px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => 
        editMode && editedRow?.id === row.id ? (
          <select value={editedRow.ID_Aplicaciones} onChange={(e) => handleEditChange(e, "ID_Aplicaciones")}>
          {aplicacion.map((aplicacion) => (
            <option key={aplicacion.id} value={aplicacion.id}>
              {aplicacion.N_Aplicaciones}
            </option>
          ))}
        </select>
        ) : (
          <div>{row.N_Aplicaciones}</div>
      ),
    },
    /*{
      name: "Ambiente",
      selector: (row) => row.N_Ambiente,
      sortable: true,
      minWidth: "150px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => 
      editMode && editedRow?.id === row.id ? (
        <div style={{color: "red"}}>{row.N_Ambiente}</div>
      ):(
          <div>{row.N_Ambiente}</div>
        )
    },*/
    {
      name: "Jefe Inmediato",
      selector: (row) => row.Puesto_Jefe,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "800px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => 
        editMode && editedRow?.id === row.id ? (
          <input
            type="text"
            value={editedRow.Puesto_Jefe}
            onChange={(e) => handleEditChange(e, "Puesto_Jefe")}
          />
        ) : (
          <div>{row.Puesto_Jefe}</div>
      ),
    },
    {
      name: "Ticket",
      selector: (row) => row.Ticket,
      sortable: true,
      omit: !showColumns,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => 
        editMode && editedRow?.id === row.id ? (
          <input
            type="text"
            value={editedRow.Ticket}
            onChange={(e) => handleEditChange(e, "Ticket")}
          />
        ) : (
          <div>{row.Ticket}</div>
      ),
    },
    {
      name: "Observación",
      selector: (row) => row.Observaciones,
      sortable: true,
      omit: !showColumns,
      minWidth: "350px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "800px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <input
            type="text"
            value={editedRow.Observaciones}
            onChange={(e) => handleEditChange(e, "Observaciones")}
          />
        ) : (
          <div>{row.Observaciones}</div>
        ),
    },
    {
      name: "Estado",
      omit: !showColumns,
      selector: (row) => editMode === row.id ?(
        <select value={editedRow.Estado_Perfil} onChange={(e) => handleEditChange(e, "Estado_Perfil")}>
          <option value={"Activo"}>
            Activo
          </option>
          <option value={"Inactivo"}>
            Inactivo
          </option>
        </select>
      )
        : (
          <div>{row.Estado_Perfil}</div>
        ),
        sortable: true,
    },
    {
      name: "Acciones",
      omit: !showColumns,
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
            <Title>Matriz de perfiles de {" todos los Paises"}</Title>
            <ButtonGroup>
              <Button primary onClick={toggleFilters}>
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
              <Button onClick={handleInsert}>Insertar Nuevo Perfil</Button>
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
            <FilterInput
              type="text"
              value={filters.N_RSocial}
              onChange={(e) => handleFilterChange(e, "N_RSocial")}
              placeholder=" Razón Social"
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
            {/*<FilterInput
              type="text"
              value={filters.N_Pais}
              onChange={(e) => handleFilterChange(e, "N_Pais")}
              placeholder="Buscar por Pais"
            />*/}
            <FilterInput
              type="text"
              value={filters.N_Puesto}
              onChange={(e) => handleFilterChange(e, "N_Puesto")}
              placeholder="Buscar por Puesto"
            />
            <FilterInput
              type="text"
              value={filters.Rol}
              onChange={(e) => handleFilterChange(e, "Rol")}
              placeholder="Buscar por Rol"
            />
            <FilterInput
              type="text"
              value={filters.N_Aplicaciones}
              onChange={(e) => handleFilterChange(e, "N_Aplicaciones")}
              placeholder="Buscar por Aplicación"
            />
            {/*<FilterInput
              type="text"
              value={filters.N_Ambiente}
              onChange={(e) => handleFilterChange(e, "N_Ambiente")}
              placeholder="Buscar por Ambiente"
            />*/}
            <FilterInput
              type="text"
              value={filters.Puesto_Jefe}
              onChange={(e) => handleFilterChange(e, "Puesto_Jefe")}
              placeholder="Buscar por Jefe Inmediato"
            />
            <FilterInput
              type="text"
              value={filters.Ticket}
              onChange={(e) => handleFilterChange(e, "Ticket")}
              placeholder="Buscar por Ticket"
            />
            <FilterInput
              type="text"
              value={filters.Estado_Perfil}
              onChange={(e) => handleFilterChange(e, "Estado_Perfil")}
              placeholder="Buscar por Estado"
            />
            <FilterInput
              type="text"
              value={filters.Observaciones}
              onChange={(e) => handleFilterChange(e, "Observaciones")}
              placeholder="Buscar por Observaciones"
            />
          </FilterWrapper>
          <Button onClick={handleToggleColumns} style={{marginLeft: "auto", position: "relative", marginRight: 10, backgroundColor: "white", color:"blue"}}>{showColumns ? 'Ver Menos Detalles' : 'Ver Mas Detalles'}</Button>
          <StyledDataTable
            columns={columns}
            data={filtered}
            pagination
            paginationPerPage={13}
            showFilters={showFilters}
          />
        </DataTableContainer>
      </ContentContainer>

       {/* Modal para insertar una nuevo departamento */}
       {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Perfil</ModalTitle>

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
              value={modalValues.ID_Puesto}
              onChange={(e) => handleModalChange(e, "ID_Puesto")}
              error={errors.puesto}
              required
            >
              <option value="">Seleccione un puesto</option>
              {puestos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Puesto}
                </option>
              ))}
            </Select>
            {errors.puesto && <ErrorMessage>{errors.puesto}</ErrorMessage>}

            <Select
              value={modalValues.ID_Aplicaciones}
              onChange={(e) => handleModalChange(e, "ID_Aplicaciones")}
              error={errors.aplicacion}
              required
            >
              <option value="">Seleccione una aplicacion</option>
              {aplicacion.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Aplicaciones}
                </option>
              ))}
            </Select>
            {errors.aplicacion && <ErrorMessage>{errors.aplicacion}</ErrorMessage>}

            <ModalInput
              type="text"
              value={modalValues.Rol}
              onChange={(e) => handleModalChange(e, "Rol")}
              placeholder="Rol en la Aplicación"
              error={errors.Rol}
              required
            />
            {errors.Rol && <ErrorMessage>{errors.Rol}</ErrorMessage>}

            <ModalInput
              type="text"
              value={modalValues.Puesto_Jefe}
              onChange={(e) => handleModalChange(e, "Puesto_Jefe")}
              placeholder="Jefe Inmediato"
              error={errors.Puesto_Jefe}
              required
            />
            {errors.Puesto_Jefe && <ErrorMessage>{errors.Puesto_Jefe}</ErrorMessage>}
            {errors.PerError && <ErrorMessage>{errors.PerError}</ErrorMessage>}

            <ModalInput
              type="text"
              value={modalValues.Ticket}
              onChange={(e) => handleModalChange(e, "Ticket")}
              placeholder="Ticket"
              error={errors.Ticket}
              required
            />
            {errors.Ticket && <ErrorMessage>{errors.Ticket}</ErrorMessage>}

            <ModalInput
              type="text"
              value={modalValues.Observaciones}
              onChange={(e) => handleModalChange(e, "Observaciones")}
              placeholder="Observaciones"
              error={errors.Observaciones}
              required
            />
            {errors.Observaciones && <ErrorMessage>{errors.Observaciones}</ErrorMessage>}

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

export default LandingPage;
