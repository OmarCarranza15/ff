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
  text-align: left;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid ${(props) => (props.error ? "red" : "#ccc")};
  border-radius: 5px;
  font-size: 14px;
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

const LabelModal = styled.label`
  width: 100px;
  text-align: left;
  font-weight: bold;
  margin-right: 10px;
`;


function Puesto() {
  //const [usuario] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [puestoin, setPuestoin] = useState([]);
  const [rolusuario, setRolusuario] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [modalValues, setModalValues] = useState({Usuario: "", Nombre: "",Contrasenia: "" , ID_PuestoIn: "", ID_RolUsuario: "", Fec_Creacion: "", Fec_Exp_Acceso: "", Fec_Ult_Conexion: "",});
  const [errors, setErrors] = useState({Usuario: "", Nombre: "",Contrasenia: "" , ID_PuestoIn: "", ID_RolUsuario: "", Fec_Creacion: "", Fec_Exp_Acceso: "", Fec_Ult_Conexion: "",});
  const [showColumns, setShowColumns] = useState(false);

  const [filters, setFilters] = useState({
    N_PuestoIn: "",
    N_Rol: "",
    Usuario: "",
    Nombre: "",
    Estado: "",
    Fec_Creacion: "",
    Fec_Exp_Acceso: "",
    Fec_Ult_Conexion: "",

  });

  const handleToggleColumns = () =>{
    setShowColumns(!showColumns);
  } 

  useEffect(()=> {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/usuarios/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (usuario)=> {
            const puestoinResponse = await axios.get(`http://localhost:3000/puestoin/${usuario.ID_PuestoIn}`); 
            const rolusuarioResponse = await axios.get(`http://localhost:3000/rolusuario/${usuario.ID_RolUsuario}`); 
            
            return {
              id: usuario.id,   
              Usuario: usuario.Usuario,
              Nombre: usuario.Nombre,
              Contrasenia: usuario.Contrasenia,
              Estado: usuario.Estado === 1?"Nuevo":  usuario.Estado === 2? "En Servicio":  usuario.Estado ===3 ? "Suspendido": "Expirado",
              ID_PuestoIn: usuario.ID_PuestoIn,
              Fec_Exp_Acceso: usuario.Fec_Exp_Acceso,
              Fec_Creacion: usuario.Fec_Creacion,
              Fec_Ult_Conexion: usuario.Fec_Ult_Conexion,
              ID_RolUsuario: usuario.ID_RolUsuario,
              N_PuestoIn: puestoinResponse.data.N_PuestoIn,
              N_Rol: rolusuarioResponse.data.N_Rol,
              
        
            }
          })
        )
        setRecords(mappedData);
      } catch (error) {
        console.error ('Error al obtener los Puestos:', error);
      }
    };
    const fetchPuestoin = async () =>{
        try {
            const response = await axios.get(`http://localhost:3000/puestoin/`);
            setPuestoin(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de Puestoin', error);
        }
    };
    const fetchRolusuario = async () =>{
        try {
             const response = await axios.get(`http://localhost:3000/rolusuario/`);
             setRolusuario(response.data);
         } catch (error) {
             console.error('Error al obtener la lista de razon social', error);
         }
     };
  
    fetchData();
    fetchPuestoin();
    fetchRolusuario();
    
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
    setModalValues({Usuario: "", Nombre: "",Contrasenia: "" , ID_PuestoIn: "", ID_RolUsuario: "", Fec_Creacion: "", Fec_Exp_Acceso: "", Fec_Ult_Conexion: "", Estado: ""});
    setErrors({Usuario: "", Nombre: "",Contrasenia: "" , ID_PuestoIn: "", ID_RolUsuario: "", Fec_Creacion: "", Fec_Exp_Acceso: "", Fec_Ult_Conexion: "", Estado:""});
  };
  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  
  const SaveModal = async () => {
    const newErrors = { Usuario: "", Nombre: "",Contrasenia: "" , ID_PuestoIn: "", ID_RolUsuario: "", Fec_Creacion: "", Fec_Exp_Acceso: "", Fec_Ult_Conexion: "", Estado:""};
  
    // Validación de campos
    if (!modalValues.Usuario.trim()) {
      newErrors.Usuario = "El código de Usuario es obligatorio.";
    }
    if (!modalValues.Nombre.trim()) {
      newErrors.Nombre = "El nombre del empleado es obligatorio.";
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.Nombre)) {
      newErrors.Nombre =
        "El nombre del empleado solo acepta letras y espacios en blanco.";
    } else {
      newErrors.Nombre = "";
    }
    if (!modalValues.Contrasenia.trim()) {
      newErrors.Contrasenia = "El Contrasenia es un campo obligatorio.";
    }

    if (!modalValues.ID_PuestoIn.trim()) {
      newErrors.puestoin = "El puesto interno es obligatorio.";
    }
    if (!modalValues.ID_RolUsuario.trim()) {
      newErrors.rolusuario = "El Rol del Usuario es obligatorio.";
    }

    if (!modalValues.Fec_Exp_Acceso.trim()) {
      newErrors.Fec_Exp_Acceso = "La fecha de expiración es obligatoria.";
    }
    

    setErrors(newErrors);
  
    // Si no hay errores, proceder a insertar el nuevo puesto
    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el Usuario ya existe en la base de datos
        console.log("Verificando si el puesto ya existe...");
        const response = await axios.get(`http://localhost:3000/usuarios`);
        console.log("Datos recibidos del servidor:", response.data);

        const usuarios = response.data;

        const usuarioExistente = usuarios.some(
          (usuario) => usuario.Usuario.toLowerCase() === modalValues.Usuario.toLowerCase()
        );

        if (usuarioExistente){
          const errorMessages = {};
          if (usuarioExistente){
            errorMessages.Usuario = "El codigo de usuario ya existe";
          setErrors({...newErrors, ...errorMessages});
          return;
          }
        }


  
         // Datos del nuevo puesto
         const newUsuario = {
          Usuario: modalValues.Usuario,
          Nombre: modalValues.Nombre,
          Contrasenia: modalValues.Contrasenia,
          Fec_Creacion: "2024-05-24",
          Fec_Exp_Acceso: modalValues.Fec_Exp_Acceso,
          Fec_Ult_Conexion: "2024-10-30",
          Estado: 1,
          ID_RolUsuario: modalValues.ID_RolUsuario,
          ID_PuestoIn: modalValues.ID_PuestoIn, 
        };
  
        console.log("Enviando datos:", newUsuario);
  
        // Enviar solicitud POST para insertar el nuevo puesto
        const insertResponse = await axios.post(`http://localhost:3000/usuarios`, newUsuario);
        console.log("Respuesta de inserción:", insertResponse.data);
  
        // Actualizar la lista de puestos con el nuevo puesto
        const rolusuarioResponse = await axios.get(`http://localhost:3000/rolusuario/${modalValues.ID_RolUsuario}`);
        const puestoinResponse = await axios.get(`http://localhost:3000/puestoin/${modalValues.ID_PuestoIn}`);
        
  
        console.log("Datos de respuesta para actualizar la UI:", {
          rolusuarioResponse: rolusuarioResponse.data,
          puestoinResponse: puestoinResponse.data,
        });
  
        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            Usuario: modalValues.Usuario,
            Nombre: modalValues.Nombre,
            Contrasenia: modalValues.Contrasenia,
            Fec_Exp_Acceso: modalValues.Fec_Exp_Acceso,
            ID_RolUsuario: modalValues.ID_RolUsuario,
            N_Rol: rolusuarioResponse.data.N_Rol,
            ID_PuestoIn: modalValues.ID_PuestoIn,
            N_PuestoIn: puestoinResponse.data.N_PuestoIn,
          },
        ];
  
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ Usuario: "", Nombre: "",Contrasenia: "" , ID_PuestoIn: "", ID_RolUsuario: "", Fec_Exp_Acceso: "" }); // Limpiar los valores del modal
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
      ...(field === "ID_PuestoIn" && { N_PuestoIn: puestoin.find((p) => p.id === parseInt(value)).N_PuestoIn }),
      ...(field === "ID_RolUsuario" && { N_Rol: rolusuario.find((p) => p.id === parseInt(value)).N_Rol }),
    
  }));
   validateInput(field, value);
  };

  const validateInput = (field, value) => {
    let newErrors = { ...errors };
    if (field === "Usuario") {
      if (!value.trim()) {
        newErrors.Usuario = "El código del Usuario es obligatorio.";
      } else {
        newErrors.Usuario = "";
      }
    }else if (field === "nombre") {
      if (!value.trim()) {
        newErrors.Nombre = "El nombre del empleado es obligatorio.";
      } else if (!/^[a-zA-Z\s]+$/.test(modalValues.Nombre)) {
        newErrors.Nombre =
          "El nombre del empleado solo acepta letras y espacios en blanco.";
      } else {
        newErrors.Nombre = "";
      }
     }else if (field === "Contrasenia") {
      if (!value.trim()) {
        newErrors.Contrasenia = "El campo Contraseña es obligatorio.";
      } else {
        newErrors.Contrasenia = "";
      }
    }else if (field === "Fec_Exp_Acceso") {
      if (!value.trim()) {
        newErrors.Fec_Exp_Acceso =
          "La fecha de expiración de acceso es obligatoria.";
      } else {
        newErrors.Fec_Exp_Acceso = "";
      }
    }else if (field === "ID_RolUsuario") {
      if (!value.trim()) {
        newErrors.ID_RolUsuario = "El campo Rol Usuario";
      } else {
        newErrors.ID_RolUsuario = "";
      } 
    setErrors(newErrors);
    }else if (field === "ID_PuestoIn") {
      if (!value.trim()) {
        newErrors.ID_PuestoIn = "El campo puesto interno";
      } else {
        newErrors.ID_PuestoIn = "";
      } 
    setErrors(newErrors);
    };
  }
  const saveChanges = async(id) => {

    try {
      const updateRow = {
        ...editedRow,
        Estado: editedRow.Estado === "Nuevo" ? 1: editedRow.Estado ==="En Servicio"? 2:  editedRow.Estado ==="Suspendido" ? 3: 4,
      }
      
      await axios.put(`http://localhost:3000/usuarios/${id}`,updateRow);   

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
    (filters.N_PuestoIn === "" ||
      row.N_PuestoIn
          .toLowerCase()
          .includes(filters.N_PuestoIn.toLowerCase())) &&
    (filters.N_Rol === "" ||
      row.N_Rol
          .toLowerCase()
          .includes(filters.N_Rol.toLowerCase())) &&
    (filters.Usuario === "" ||
        row.Usuario
          .toLowerCase()
          .includes(filters.Usuario.toLowerCase())) &&
    (filters.Nombre === "" ||
        row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())) &&
    (filters.Fec_Creacion === "" ||
        row.Fec_Creacion.toLowerCase().includes(filters.Fec_Creacion.toLowerCase())) &&
    (filters.Fec_Ult_Conexion === "" ||
        row.Fec_Ult_Conexion.toLowerCase().includes(filters.Fec_Ult_Conexion.toLowerCase())) &&
    (filters.Fec_Exp_Acceso === "" ||
        row.Fec_Exp_Acceso.toLowerCase().includes(filters.Fec_Exp_Acceso.toLowerCase())) &&
    (filters.Estado === "" ||
        row.Estado.toLowerCase().includes(filters.Estado.toLowerCase())) 
    
        );
  });

  const columns = [
      {
        name: "Puesto Interno",
        selector: (row) => row.N_PuestoIn,
        sortable: true,
        minWidth: "370px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
            <select value={editedRow.ID_PuestoIn} onChange={(e) => handleEditChange(e, "ID_PuestoIn")}>
              {puestoin.map((puestoin) => (
                <option key={puestoin.id} value={puestoin.id}>
                  {puestoin.N_PuestoIn}
                </option>
              ))}
            </select>
          ) : (
            <div>{row.N_PuestoIn}</div>
          ),
      },
      {
        name: "Rol del Usuario",
        selector: (row) => row.N_Rol,
        sortable: true,
        minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
            <select value={editedRow.ID_RolUsuario} onChange={(e) => handleEditChange(e, "ID_RolUsuario")}>
              {rolusuario.map((rolusuario) => (
                <option key={rolusuario.id} value={rolusuario.id}>
                  {rolusuario.N_Rol}
                </option>
              ))}
            </select>
          ) : (
            <div>{row.N_Rol}</div>
          ),
      },
      {
        name: "Usuario",
        selector: (row) => row.Usuario,
        sortable: true,
        minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "200px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
              <input
              type= "text"
              value={editedRow.Usuario}
              onChange={(e) => handleEditChange(e, "Usuario")}
            />
          ) : (
            <div>{row.Usuario}</div>
          ),
      },
    {
      name: "Nombre",
      selector: (row) => row.Nombre,
      sortable: true,
      minWidth: "300px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
            <input
            type="text"
            value={editedRow.Nombre}
            onChange={(e) => handleEditChange(e, "Nombre")}
          />
        ) : (
          <div>{row.Nombre}</div>
        ),
    },
    {
      name: "Contraseña",
      selector: (row) => row.Contrasenia,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
            <input
            type="password"
            value={editedRow.Contrasenia}
            onChange={(e) => handleEditChange(e, "Contrasenia")}
          />
        ) : (
          <div >*********</div>
        ),
    },
    {
      name: "Fecha de Creacion",
      selector: (row) => row.Fec_Creacion,
      omit: !showColumns,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
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
      name: "Fecha de Ultima Conexion",
      selector: (row) => row.Fec_Ult_Conexion,
      omit: !showColumns,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
            <input
            type="text"
            value={editedRow.Fec_Ult_Conexion}
            onChange={(e) => handleEditChange(e, "Fec_Ult_Conexion")}
          />
        ) : (
          <div>{row.Fec_Ult_Conexion}</div>
        ),
    },
    {
      name: "Fecha de Expiracion",
      selector: (row) => row.Fec_Exp_Acceso,
      omit: !showColumns,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
            <input
            type="text"
            value={editedRow.Fec_Exp_Acceso}
            onChange={(e) => handleEditChange(e, "Fec_Exp_Acceso")}
          />
        ) : (
          <div>{row.Fec_Exp_Acceso}</div>
        ),
    },
    {
      name: "Estado",
      selector: (row) => editMode === row.id ?(
        <select value={editedRow.Estado} onChange={(e) => handleEditChange(e, "Estado")}>
          <option value={"Nuevo"}>
            Nuevo
          </option>
          <option value={"En Servicio"}>
            En Servicio
          </option>
          <option value={"Suspendido"}>
            Suspendido
          </option>
          <option value={"Expirado"}>
          Expirado
          </option>
        </select>
      )
        : (
          <div>{row.Estado}</div>
        ),
        sortable: true,
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
            <Title><h2 className="Title">Usuarios</h2></Title>
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
              value={filters.N_PuestoIn}
              onChange={(e) => handleFilterChange(e, "N_PuestoIn")}
              placeholder="Buscar por Puesto Interno"
            />
            <FilterInput
              type="text"
              value={filters.N_Rol}
              onChange={(e) => handleFilterChange(e, "N_Rol")}
              placeholder="Buscar por Rol del Usuario"
            />
            <FilterInput
              type="text"
              value={filters.Usuario}
              onChange={(e) => handleFilterChange(e, "Usuario")}
              placeholder="Buscar por Usuario"
            />
            <FilterInput
              type="text"
              value={filters.Nombre}
              onChange={(e) => handleFilterChange(e, "Nombre")}
              placeholder="Buscar por Nombre"
            />
            {showColumns && (
            <>
            <FilterInput
              type="text"
              value={filters.Fec_Creacion}
              onChange={(e) => handleFilterChange(e, "Fec_Creacion")}
              placeholder="Buscar por Fecha de Creacion"
            />
            <FilterInput
              type="text"
              value={filters.Fec_Ult_Conexion}
              onChange={(e) => handleFilterChange(e, "Fec_Ult_Conexion")}
              placeholder="Buscar por ultima conexion"
            />
            <FilterInput
              type="text"
              value={filters.Fec_Exp_Acceso}
              onChange={(e) => handleFilterChange(e, "Fec_Exp_Acceso")}
              placeholder="Buscar por Fecha de Expiracion"
            />
            </>)}
            <FilterInput
              type="text"
              value={filters.Estado}
              onChange={(e) => handleFilterChange(e, "Estado")}
              placeholder="Buscar por Estado"
            />
            
          </FilterWrapper>
          <Button onClick={handleToggleColumns} style={{marginLeft: "auto", position: "relative", marginRight: 10, backgroundColor: "white", color:"blue"}}>{showColumns ? 'Ver Menos Detalles' : 'Ver Mas Detalles'}</Button>
          <StyledDataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={30}
            showFilters={showFilters}
          />
        </DataTableContainer>
      </ContentContainer>
      {/* Modal para insertar un nuevo usuario */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Usuario</ModalTitle>
            <ModalInput
              type="text"
              value={modalValues.Usuario}
              onChange={(e) => handleModalChange(e, "Usuario")}
              placeholder="Código del Usuario"
              error={errors.Usuario}
              required
            />
            {errors.Usuario && (
              <ErrorMessage>{errors.Usuario}</ErrorMessage>
            )}

            <ModalInput
              type="text"
              value={modalValues.Nombre}
              onChange={(e) => handleModalChange(e, "Nombre")}
              placeholder="Nombre del Empleado"
              error={errors.Nombre}
              required
            />
            {errors.Nombre && <ErrorMessage>{errors.Nombre}</ErrorMessage>}

            <ModalInput
              type="password"
              value={modalValues.Contrasenia}
              onChange={(e) => handleModalChange(e, "Contrasenia")}
              placeholder="Contraseña del Empleado"
              error={errors.Contrasenia}
              required
            />
            {errors.Contrasenia && <ErrorMessage>{errors.Contrasenia}</ErrorMessage>}
            <Select
              value={modalValues.ID_RolUsuario}
              onChange={(e) => handleModalChange(e, "ID_RolUsuario")}
              error={errors.rolusuario}
              required
            >
              <option value="">Seleccione un rol de usuario</option>
              {rolusuario.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Rol}
                </option>
              ))}
            </Select>
            {errors.rolusuario && <ErrorMessage>{errors.rolusuario}</ErrorMessage>}

            <Select
              value={modalValues.ID_PuestoIn}
              onChange={(e) => handleModalChange(e, "ID_PuestoIn")}
              error={errors.puestoin}
              required
            >
              <option value="">Seleccione un puesto interno</option>
              {puestoin.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_PuestoIn}
                </option>
              ))}
            </Select>
            {errors.puestoin && <ErrorMessage>{errors.puestoin}</ErrorMessage>}

            <LabelModal style={{ textAlign: "left" }}>
              Fecha de Expiración:
            </LabelModal>
            <ModalInput
              type="date"
              value={modalValues.Fec_Exp_Acceso}
              onChange={(e) => handleModalChange(e, "Fec_Exp_Acceso")}
              placeholder="Fecha de Expiración"
              error={errors.Fec_Exp_Acceso}
              required
            />
            {errors.Fec_Exp_Acceso && (
              <ErrorMessage>{errors.Fec_Exp_Acceso}</ErrorMessage>
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
