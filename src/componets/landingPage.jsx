import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import styled from "styled-components";
import "../styles/DataTable.css"; // Importa el archivo CSS
import axios from "axios";
import { FaUndo, FaSearch} from "react-icons/fa"; // Importa el ícono de edición
import {
  customStyles,
  CustomLoader,
  HeaderContainer,
  Title,
  MainContainer,
  ContentContainer,
  FilterWrapper,
  FilterInput,
  ButtonGroup,
  Button,

 // StyledDataTable,

  RedButton,
  DataTableContainer,
 // ModalBackground,
 // ModalWrapper,
 // ModalTitle,
  //ErrorMessage,
  //ModalButtonGroup,
} from "./Estilos.jsx";

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

function LandingPage() {
  
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [rsocial, setRsocial] = useState([]);
  const [division, setDivision] = useState([]);
  const [departamento, setDepartamento] = useState([]);
  const [centrocosto, setCentrocostos] = useState([]);
  const [aplicacion, setAplicacion] = useState([]);
  const [ambiente, setAmbiente] = useState([]);
  const [pais, setPais] = useState([]);
  const [showColumns, setShowColumns] = useState(false);
  const [loading, setLoading] = useState(true);

  
  
  

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
      setLoading(true);
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
              Estado_Perfil: perfil.Estado_Perfil === 1 ? "En Servicio": "Suspendido",
              id: perfil.id,
              Cod_Menu: perfil.Cod_Menu,
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
        setLoading(false);
      } catch (error) {
        console.error ('Error al obtener los perfiles:', error);
        setLoading(false);
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
  },[])

  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
  };

  
      const filtered = records.filter((row) => {
        const isActive = filters.Estado_Perfil.toLowerCase() === "activo";
    
        return (
          (filters.N_Pais === "" || row.N_Pais.toLowerCase().includes(filters.N_Pais.toLowerCase())) &&
          (filters.N_RSocial === "" || row.N_RSocial.toLowerCase().includes(filters.N_RSocial.toLowerCase())) &&
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
      minWidth: "150px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "150px", // Ajusta el tamaño máximo según sea necesario
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
      name: "Centro de Coste",
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
      minWidth: "450px", // Ajusta el tamaño mínimo según sea necesario
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
      selector: (row) => {
        const aplicacionText = row.N_Aplicaciones || "";
        const codMenuText = row.Cod_Menu || "";
        return aplicacionText + (aplicacionText && codMenuText ? " - " : "") + codMenuText;
      },
      sortable: true,
      minWidth: "350px",
      maxWidth: "1000px",
      cell: (row) => (
        editMode && editedRow?.id === row.id ? (
          <>
            <select
              value={editedRow.ID_Aplicaciones}
              onChange={(e) => handleEditChange(e, "ID_Aplicaciones")}
            >
              {aplicacion.map((aplicacion) => (
                <option key={aplicacion.id} value={aplicacion.id}>
                  {aplicacion.N_Aplicaciones}
                </option>
              ))}
            </select>
            {editedRow.N_Aplicaciones === 'T24' && (
              <input
                type="text"
                value={editedRow.Cod_Menu}
                onChange={(e) => handleEditChange(e, "Cod_Menu")}
              />
            )}
          </>
        ) : (
          <div>
            
              <>
                {row.N_Aplicaciones && <span>{row.N_Aplicaciones}</span>}
                {row.N_Aplicaciones && row.Cod_Menu && <span> - </span>}
                {row.Cod_Menu && <span>{row.Cod_Menu}</span>}
              </>
            
          </div>
        )
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
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
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
      minWidth: "100PX", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "100px", // Ajusta el tamaño máximo según sea necesario
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
      //omit: !showColumns,
      minWidth: "150px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "800px",
      selector: (row) => editMode === row.id ?(
        <select value={editedRow.Estado_Perfil} onChange={(e) => handleEditChange(e, "Estado_Perfil")}>
          <option value={"En Servicio"}>
            En Servicio
          </option>
          <option value={"Suspendido"}>
            Suspendido
          </option>
        </select>
      )
        : (
          <div>{row.Estado_Perfil}</div>
        ),
        sortable: true,
    },
    /*{
      name: "Acciones",
      //omit: !showColumns,
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
    },*/
  ];

  const resetFilters = () => {
    setFilters({
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
    })};
  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>Matriz de perfiles de {" todos los Paises"}</Title>
            <ButtonGroup>
              <Button
                style={{marginRight: "30px"}}
                className="btn btn-outline-primary"
                onClick={toggleFilters}
              >
                <FaSearch style={{margin: "0px 5px"}}/>
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters} >
          <FilterInput 
            type="text" 
            value={filters.N_Pais}
            onChange={(e) => handleFilterChange(e, "N_Pais" ) }
            placeholder=" Buscar Pais"
          /> 
          {showColumns && (
            <>
            <FilterInput 
            type="text" 
            value={filters.N_RSocial}
            onChange={(e) => handleFilterChange(e, "N_RSocial" ) }
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
              placeholder="Buscar por Centro de Coste"
              
            />
          </>
          )}
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
            {showColumns && (
              <>
              <FilterInput
              type="text"
              value={filters.Ticket}
              onChange={(e) => handleFilterChange(e, "Ticket")}
              placeholder="Buscar por Ticket"
            />
            <FilterInput
              type="text"
              value={filters.Observaciones}
              onChange={(e) => handleFilterChange(e, "Observaciones")}
              placeholder="Buscar por Observaciones"
            /> 
            <FilterInput
              type="text"
              value={filters.Estado_Perfil}
              onChange={(e) => handleFilterChange(e, "Estado_Perfil")}
              placeholder="Buscar por Estado"
            />
            </>
            )}         
            <ButtonGroup>
            <RedButton onClick={resetFilters}>
              <FaUndo /> Resetear Filtros
            </RedButton>
            </ButtonGroup>                  
          </FilterWrapper>
          <Button onClick={handleToggleColumns} style={{marginLeft: "auto", position: "relative", marginRight: 10, backgroundColor: "white", color:"blue"}}>{showColumns ? 'Ver Menos Detalles' : 'Ver Mas Detalles'}</Button>
          {loading ? (
            <CustomLoader />
          ) : (
          <StyledDataTable
            columns={columns}
            data={filtered}
            pagination
            paginationPerPage={15}
            showFilters={showFilters}
            customStyles={customStyles}
            noDataComponent= {<h2 style={{color:  " #004ea1"}}>Por favor busque un registro</h2>}
          />)}
        </DataTableContainer>
      </ContentContainer>
    </MainContainer>
  );
}

export default LandingPage;
