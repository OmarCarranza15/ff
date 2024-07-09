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



function Puesto() {
  const [usuario] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [puestoin, setPuestoin] = useState([]);
  const [rolusuario, setRolusuario] = useState([]);
 

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
              Estado: usuario.Estado  === 1 ?  "Nuevo" : usuario.Estado ===  2 ? "En Servicio":usuario.Estado === 3 ? "Suspendido": "Expirado",
              ID_PuestoIn: usuario.ID_PuestoIn,
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
    //setShowModal(true);
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
      ...(field === "ID_Usuario" && { Usuario: usuario.find((p) => p.id === parseInt(value)).Usuario }),
      ...(field === "ID_Usuario" && { Nombre: usuario.find((p) => p.id === parseInt(value)).Nombre }),
      ...(field === "ID_Usuario" && { Estado: usuario.find((p) => p.id === parseInt(value)).Estado }),
      ...(field === "ID_PuestoIn" && { N_PuestoIn: puestoin.find((p) => p.id === parseInt(value)).N_PuestoIn }),
      ...(field === "ID_RolUsuario" && { N_Rol: rolusuario.find((p) => p.id === parseInt(value)).N_Rol }),
    
  }));
   
  };

  
  

  const saveChanges = async(id) => {
    try {

      const updateRow = {
        ...editedRow,
        
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
        name: "Puesto Interno",
        selector: (row) => row.N_PuestoIn,
        sortable: true,
        minWidth: "250px", // Ajusta el tamaño mínimo según sea necesario
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
        minWidth: "300px", // Ajusta el tamaño mínimo según sea necesario
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
        minWidth: "10px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "2000px", // Ajusta el tamaño máximo según sea necesario
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
      
    </MainContainer>
  );
}

export default Puesto;
