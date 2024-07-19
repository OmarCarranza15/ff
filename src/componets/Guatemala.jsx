import React, { useState } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import styled from "styled-components";
import "../styles/DataTable.css"; // Importa el archivo CSS

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
  justify-content: center; /* Centra los elementos horizontalmente */
  padding: 1px 10px;
`;

const FilterWrapper = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
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

const FilterButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 101;
`;
const DataTableContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow: auto; /* Add overflow-x: auto to allow horizontal scrolling */
  position: relative;
`;

const StyledDataTable = styled(DataTable)`
  margin-top: ${(props) => (props.showFilters? "10px" : "1px")}; /* Ajusta el margen según necesites */
  border-collapse: collapse;
  max-width: 100%; /* Add max-width to prevent table from exceeding parent container's width */
  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  th {
    background-color: #f0f0f0;
  }
  @media (max-width: 768px) {
    th,
    td {
      padding: 5px;
    }
  }
  @media (max-width: 480px) {
    th,
    td {
      padding: 2px;
    }
  }
`;

function Guatemala() {
  const columns = [
    {
      name: "Pais",
      selector: (row) => row.pais,
      sortable: true,
    },
    {
      name: "Razon Social",
      selector: (row) => row.rsocial,
      sortable: true,
    },
    {
      name: "División",
      selector: (row) => row.division,
      sortable: true,
    },
    {
      name: "Departamento",
      selector: (row) => row.departamento,
      sortable: true,
    },
    {
      name: "Puesto",
      selector: (row) => row.puesto,
      sortable: true,
    },
    {
      name: "Rol",
      selector: (row) => row.rol,
      sortable: true,
    },
    {
      name: "Aplicación",
      selector: (row) => row.aplicacion,
      sortable: true,
    },
    {
      name: "Ambiente",
      selector: (row) => row.ambiente,
      sortable: true,
    },
    {
      name: "Jefe Inmediato",
      selector: (row) => row.jefeInmediato,
      sortable: true,
    },
    {
      name: "Ticket",
      selector: (row) => row.Ticket,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
    },
    {
      name: "Observación",
      selector: (row) => row.observacion,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
    },
  ];

  const data = [
    {
      ID: 1,
      pais: "HND",
      rsocial: "Ficohsa | Banco",
      division: "ADMINISTRACION",
      departamento: "Compras",
      puesto: "ADMINISTRADOR SISTEMA DE COBRANZA",
      rol: "PRFCOB16",
      aplicacion: "VASA",
      ambiente: "Producción",
      jefeInmediato: "GERENTE GENERAL FICOHSA TARJETAS/VP REGIONAL DE SERVICIO AL CLIENTE",
      Ticket: "12345",
      fecha: "2024-06-18",
      observacion: "",
      estado: "Activo"
    },
    // Agrega más datos aquí según sea necesario
  ];

  const [records] = useState(data);
  const [filters, setFilters] = useState({
    pais: "",
    rsocial: "",
    departamento: "",
    puesto: "",
    rol: "",
    aplicacion: "",
    ambiente: "",
    jefeInmediato: "",
    Ticket: "",
    fecha: "",
    observacion: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filteredData = records.filter((row) => {
    return (
      (filters.pais === "" ||
        row.pais.toLowerCase().includes(filters.pais.toLowerCase())) &&
      (filters.rsocial === "" ||
        row.rsocial.toLowerCase().includes(filters.rsocial.toLowerCase())) &&
      (filters.departamento === "" ||
        row.departamento
          .toLowerCase()
          .includes(filters.departamento.toLowerCase())) &&
      (filters.puesto === "" ||
        row.puesto.toLowerCase().includes(filters.puesto.toLowerCase())) &&
      (filters.rol === "" ||
        row.rol.toLowerCase().includes(filters.rol.toLowerCase())) &&
      (filters.aplicacion === "" ||
        row.aplicacion.toLowerCase().includes(filters.aplicacion.toLowerCase())) &&
      (filters.ambiente === "" ||
        row.ambiente.toLowerCase().includes(filters.ambiente.toLowerCase())) &&
      (filters.jefeInmediato === "" ||
        row.jefeInmediato.toLowerCase().includes(filters.jefeInmediato.toLowerCase())) &&
      (filters.Ticket === "" ||
        row.Ticket.toLowerCase().includes(filters.Ticket.toLowerCase())) &&
      (filters.fecha === "" ||
        row.fecha.toLowerCase().includes(filters.fecha.toLowerCase())) &&
      (filters.observacion === "" ||
        row.observacion.toLowerCase().includes(filters.observacion.toLowerCase()))
    );
  });

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <h2>Matiz de perfiles {'N_Pais'}</h2>
            <FilterButton onClick={toggleFilters}>
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </FilterButton>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
            <FilterInput
              type="text"
              value={filters.pais}
              onChange={(e) => handleFilterChange(e, "pais")}
              placeholder="Buscar por País"
            />
            <FilterInput
              type="text"
              value={filters.rsocial}
              onChange={(e) => handleFilterChange(e, "rsocial")}
              placeholder="Buscar por Razón Social"
            />
            <FilterInput
              type="text"
              value={filters.departamento}
              onChange={(e) => handleFilterChange(e, "departamento")}
              placeholder="Buscar por Departamento"
            />
            <FilterInput
              type="text"
              value={filters.puesto}
              onChange={(e) => handleFilterChange(e, "puesto")}
              placeholder="Buscar por Puesto"
            />
            <FilterInput
              type="text"
              value={filters.rol}
              onChange={(e) => handleFilterChange(e, "rol")}
              placeholder="Buscar por Rol"
            />
            <FilterInput
              type="text"
              value={filters.aplicacion}
              onChange={(e) => handleFilterChange(e, "aplicacion")}
              placeholder="Buscar por Aplicación"
            />
            <FilterInput
              type="text"
              value={filters.ambiente}
              onChange={(e) => handleFilterChange(e, "ambiente")}
              placeholder="Buscar por Ambiente"
            />
            <FilterInput
              type="text"
              value={filters.jefeInmediato}
              onChange={(e) => handleFilterChange(e, "jefeInmediato")}
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
              value={filters.fecha}
              onChange={(e) => handleFilterChange(e, "fecha")}
              placeholder="Buscar por Fecha"
            />
            <FilterInput
              type="text"
              value={filters.observacion}
              onChange={(e) => handleFilterChange(e, "observacion")}
              placeholder="Buscar por Observación"
            />
          </FilterWrapper>
          <StyledDataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            showFilters={showFilters}
          />
        </DataTableContainer>
      </ContentContainer>
    </MainContainer>
  );
}

export default Guatemala;