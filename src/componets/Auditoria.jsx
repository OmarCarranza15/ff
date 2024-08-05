import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import { styled } from "styled-components";
import { FaUndo, FaSearch } from "react-icons/fa"; // Importa los íconos
import axios from "axios";
import moment from 'moment-timezone';
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

const timeZone = 'America/Tegucigalpa';


function Auditoria() {
  const [records, setRecords] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [filters, setFilters] = useState({
    Campo_Original: "",
    N: "",
    Campo_Nuevo: "",
    Tabla: "",
    Accion: "",
    ID_Usuario: "",
    Nombre: "",
    createdAt: "",
    usuario
  });

  const [showFilters, setShowFilters] = useState(false);
  const [editedRow, ] = useState(null); // Estado para la fila en edición
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/auditoria/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (auditoria) => {
            const usuarioResponse = await axios.get(`http://localhost:3000/usuarios/${auditoria.ID_Usuario}`);
            return {
              id: auditoria.id,
              N: auditoria.N,
              Campo_Original: auditoria.Campo_Original,
              Campo_Nuevo: auditoria.Campo_Nuevo,
              Tabla: auditoria.Tabla,
              Accion: auditoria.Accion === 1 ? "Insercion" : "Modificacion",
              createdAt: moment.utc(auditoria.createdAt).tz(timeZone).format('YYYY-MM-DD h:mm A'),
              ID_Usuario: auditoria.ID_Usuario,
              Nombre: usuarioResponse.data.Nombre,
            }
          })
        );

        // Ordenar los registros de más recientes a más antiguos
        const sortedData = mappedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setRecords(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los Puestos:', error);
        setLoading(false);
      }
    };

    const fetchUsuario = async () => {
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

  const formatDate = (date) => {
    return moment(date).tz(timeZone).format('YYYY-MM-DD h:mm A');
  };


  
  function formatFieldWithLineBreaks(field) {
    // Verifica si 'field' es null o undefined
    if (field == null) {
      return ""; // O algún valor por defecto adecuado
    }
    
    // Convierte el objeto a una cadena JSON si 'field' es un objeto
    const fieldString = typeof field === 'object' ? JSON.stringify(field) : field;
    
    return fieldString.split('¬').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  }


  const columns = [
    {
      name: "Tabla",
      selector: (row) => row.Tabla,
      sortable: true,
      minWidth: "150px",
      maxWidth: "200px",
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
      minWidth: "100px",
      maxWidth: "150px",
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
      name: "Registro",
      selector: (row) => row.N,
      sortable: true,
      minWidth: "120px",
      maxWidth: "120px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <input
            type="text"
            value={editedRow.N}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <div>{row.N}</div>
        ),
    },
    {
      name: "Campo Original",
      selector: (row) => row.Campo_Original,
      sortable: true,
      minWidth: "250px",
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
          <div>{formatFieldWithLineBreaks(row.Campo_Original)}</div>
        ),
    },
    {
      name: "Campo Nuevo",
      selector: (row) => row.Campo_Nuevo,
      sortable: true,
      minWidth: "250px",
      maxWidth: "500px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <input
            type="text"
            value={editedRow.Campo_Nuevo}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <div>{formatFieldWithLineBreaks(row.Campo_Nuevo)}</div>
        ),
    },
    {
      name: "Nombre",
      selector: (row) => row.Nombre,
      sortable: true,
      minWidth: "100px",
      maxWidth: "150px",
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
      name: "Fecha y Hora",
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
      minWidth: "150px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "200px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => <div>{formatDate(row.createdAt)}</div>,
    }
  ];

  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const formatDateForFilter = (date) => {
    return moment(date).format('YYYY-MM-DD h:mm A'); // Mantén el formato para el filtro
  };;

  const filteredData = records.filter((row) => {
    const formattedDate = formatDateForFilter(row.createdAt);

    return (
      (filters.Campo_Original === "" || row.Campo_Original.toLowerCase().includes(filters.Campo_Original.toLowerCase())) &&
      (filters.Campo_Nuevo === "" || row.Campo_Nuevo.toLowerCase().includes(filters.Campo_Nuevo.toLowerCase())) &&
      (filters.Tabla === "" || row.Tabla.toLowerCase().includes(filters.Tabla.toLowerCase())) &&
      (filters.Accion === "" || row.Accion.toLowerCase().includes(filters.Accion.toLowerCase())) &&
      (filters.createdAt === "" || formattedDate.includes(filters.createdAt)) &&
      (filters.Nombre === "" || row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase()))
    );
  });

  const resetFilters = () => {
    setFilters({
      Tabla: "",
      Accion: "",
      ID_Usuario: "",
      Nombre: "",
      createdAt: "",
      Campo_Original: "",
      Campo_Nuevo: "",
    });
  };

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
                style={{ marginRight: "30px" }}
                className="btn btn-outline-primary"
                onClick={toggleFilters}
              >
                <FaSearch style={{ margin: "0px 5px" }} />
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
          <FilterInput
              type="text"
              value={filters.Campo_Original}
              onChange={(e) => handleFilterChange(e, "Campo_Original")}
              placeholder="Buscar por Campo Original"
            />
            <FilterInput
              type="text"
              value={filters.Campo_Nuevo}
              onChange={(e) => handleFilterChange(e, "Campo_Nuevo")}
              placeholder="Buscar por Campo Nuevo"
            />
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
              value={filters.createdAt}
              onChange={(e) => handleFilterChange(e, "createdAt")}
              placeholder="Buscar por Fecha y Hora (YYYY-MM-DD h:mm A)"
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
            />
          )}
        </DataTableContainer>
      </ContentContainer>
    </MainContainer>
  );
}

export default Auditoria;
