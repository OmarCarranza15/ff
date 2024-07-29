import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import { styled } from "styled-components";
import {FaUndo,FaSearch} from "react-icons/fa"; // Importa los íconos
import axios from "axios";
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
  RedButton,
  DataTableContainer,
} from "./Estilos.jsx";



const StyledDataTable = styled(DataTable)`
  border-collapse: collapse;
  width: 65%;
  position: relative;
  margin: center;
  margin: 0% 15%;

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



function Auditoria() {
  const [records, setRecords] = useState([]);
  const [usuario, setUsuario] = useState([])
  const [filters, setFilters] = useState({
    Tabla: "",
    Accion: "",
    ID_Usuario: "",
    Nombre: "",
    Fecha: "",
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
              Tabla: auditoria.Tabla,
              Accion: auditoria.Accion === 1 ? "Insercion" : "Modificacion",
              Fecha: auditoria.Fecha,
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
      name: "Tabla",
      selector: (row) => row.Tabla,
      sortable: true,
      minWidth: "200px",
      maxWidth: "500px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <input
            type="text"
            value={editedRow.Tabla}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <div>{row.Tabla}</div>
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
    },
    {
      name: "Fecha de la Accion",
      selector: (row) => row.Fecha,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => <div>{row.Fecha}</div>,
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
      (filters.Tabla === "" || row.Tabla.toLowerCase().includes(filters.Tabla.toLowerCase())) &&
      (filters.Accion === "" || row.Accion.toLowerCase().includes(filters.Accion.toLowerCase())) &&
      (filters.Fecha === "" || row.Fecha.toLowerCase().includes(filters.Fecha.toLowerCase())) &&
      (filters.Nombre === "" || row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())) 
    );
  });

  const resetFilters = () => {
    setFilters({
      Tabla: "",
      Accion: "",
      ID_Usuario: "",
      Nombre: "",
      Fecha: ""
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
          <FilterWrapper show={showFilters}>
            <FilterInput
              type="text"
              value={filters.Tabla}
              onChange={(e) => handleFilterChange(e, "Tabla")}
              placeholder="Buscar por Tabla"
            />
            <FilterInput
              type="text"
              value={filters.Accion}
              onChange={(e) => handleFilterChange(e, "Accion")}
              placeholder="Buscar por Accion"
            />
            <FilterInput
              type="text"
              value={filters.Nombre}
              onChange={(e) => handleFilterChange(e, "Nombre")}
              placeholder="Buscar por Nombre"
            />
            <FilterInput
                  type="text"
                  value={filters.Fecha}
                  onChange={(e) => handleFilterChange(e, "Fecha")}
                  placeholder="Buscar por Fecha"
                />
              <ButtonGroup>
            <RedButton onClick={resetFilters}>
              <FaUndo /> Resetear Filtros
            </RedButton>
            </ButtonGroup>
          </FilterWrapper>
          {loading ? (
            <CustomLoader />
          ) : (
          <StyledDataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationPerPage={15}
          showFilters={showFilters}
          customStyles={customStyles}
          />)}
        </DataTableContainer>
      </ContentContainer>
    </MainContainer>
  );
}

export default Auditoria;