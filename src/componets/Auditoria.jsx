import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import { styled, keyframes } from "styled-components";
import {FaUndo,FaSearch} from "react-icons/fa"; // Importa los íconos
import axios from "axios";

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

//Boton Limpiar filtros 
const RedButton = styled(Button)`
  background-color: #ff0000; /* Rojo */
  font-size: 13px; 
  padding: 2px 4px; 
  border-radius: 5px; 
  height: 35px; 
  width: 120px; 
`;  

//Boton de filtros 
const SearchButton = styled(Button)`
  background-color: #008cba; /* Azul */
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
    responsive: true;
  }

  th {
    background-color: #f0f0f0;
    text-align: center; /* Centra el texto en los encabezados */
  }

  td {
    min-width: 200px;
    max-width: 500px;
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



function Auditoria() {
  const [records, setRecords] = useState([]);
  const [usuario, setUsuario] = useState([])
  const [filters, setFilters] = useState({
    Campo_Original: "",
    Cmapo_Nuevo: "",
    Matriz: "",
    Accion: "",
    ID_Usuario: "",
    Nombre: "",
    usuario
  });

  const [showFilters, setShowFilters] = useState(false);
  const [editedRow, ] = useState(null); // Estado para la fila en edición
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/auditoria/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (auditoria)=> {
            const usuarioResponse = await axios.get(`http://localhost:3000/usuarios/${auditoria.ID_Usuario}`); 
            
            return {
              id: auditoria.id,   
              Campo_Original: auditoria.Campo_Original,
              Cmapo_Nuevo: auditoria.Cmapo_Nuevo,
              Matriz: auditoria.Matriz,
              Accion: auditoria.Accion === 1 ? "Insercion" : "Modificacion",
              ID_Usuario: auditoria.ID_Usuario,
              Nombre: usuarioResponse.data.Nombre,
            }
          })
        )
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error ('Error al obtener los Puestos:', error);
        setLoading(false);
      }
    };
    const fetchUsuario = async () =>{
        try {
             const response = await axios.get(`http://localhost:3000/auditoria/`);
             setUsuario(response.data);
         } catch (error) {
             console.error('Error al obtener la lista de razon social', error);
         }
     };
  
    fetchData();
    fetchUsuario();
  }, []);

  const columns = [
    {
      name: "Campo Original",
      selector: (row) => row.Campo_Original,
      sortable: true,
      minWidth: "300px",
      maxWidth: "500px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <input
            type="text"
            value={editedRow.Campo_Original}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <div>{row.Campo_Original}</div>
        ),
    },
    {
      name: "Campo Nuevo",
      selector: (row) => row.Cmapo_Nuevo,
      sortable: true,
      minWidth: "200px",
      maxWidth: "500px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <input
            type="text"
            value={editedRow.Cmapo_Nuevo}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <div>{row.Cmapo_Nuevo}</div>
        ),
    },
    {
      name: "Matriz",
      selector: (row) => row.Matriz,
      sortable: true,
      minWidth: "200px",
      maxWidth: "500px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <input
            type="text"
            value={editedRow.Matriz}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <div>{row.Matriz}</div>
        ),
    },
    {
      name: "Accion",
      selector: (row) => row.Accion,
      sortable: true,
      minWidth: "300px",
      maxWidth: "500px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <input
            type="text"
            value={editedRow.Accion}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <div>{row.Accion}</div>
        ),
    },
    {
      name: "Nombre",
      selector: (row) => row.Nombre,
      sortable: true,
      minWidth: "300px",
      maxWidth: "500px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <input
            type="text"
            value={editedRow.Nombre}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <div>{row.Nombre}</div>
        ),
    }
  ];

  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredData = records.filter((row) => {
    return (
      (filters.Campo_Original === "" || row.Campo_Original.toLowerCase().includes(filters.Campo_Original.toLowerCase())) &&
      (filters.Cmapo_Nuevo === "" || row.Cmapo_Nuevo.toLowerCase().includes(filters.Cmapo_Nuevo.toLowerCase())) &&
      (filters.Matriz === "" || row.Matriz.toLowerCase().includes(filters.Matriz.toLowerCase())) &&
      (filters.Accion === "" || row.Accion.toLowerCase().includes(filters.Accion.toLowerCase())) &&
      (filters.Nombre === "" || row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())) 
    );
  });

  const resetFilters = () => {
    setFilters({
      Campo_Original: "",
      Cmapo_Nuevo: "",
      Matriz: "",
      Accion: "",
      ID_Usuario: "",
      Nombre: "",
    })};

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>Auditoría</Title>
            <ButtonGroup>
            <SearchButton primary onClick={toggleFilters}>
              <FaSearch />
                {showFilters ? "Ocultar" : "Buscar"}
              </SearchButton>
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
            <FilterInput
              type="text"
              value={filters.Campo_Original}
              onChange={(e) => handleFilterChange(e, "Campo_Original")}
              placeholder="Campo Original"
            />
            <FilterInput
              type="text"
              value={filters.Cmapo_Nuevo}
              onChange={(e) => handleFilterChange(e, "Cmapo_Nuevo")}
              placeholder="Campo Nuevo"
            />
            <FilterInput
              type="text"
              value={filters.Matriz}
              onChange={(e) => handleFilterChange(e, "Matriz")}
              placeholder="Matriz"
            />
            <FilterInput
              type="text"
              value={filters.Accion}
              onChange={(e) => handleFilterChange(e, "Accion")}
              placeholder="Accion"
            />
            <FilterInput
              type="text"
              value={filters.Nombre}
              onChange={(e) => handleFilterChange(e, "Nombre")}
              placeholder="Nombre del Usuario"
            />
            <RedButton onClick={resetFilters}>
              <FaUndo /> Resetear Filtros
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
            noHeader
          />)}
        </DataTableContainer>
      </ContentContainer>
    </MainContainer>
  );
}

export default Auditoria;