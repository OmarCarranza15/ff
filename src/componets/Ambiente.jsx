import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import {styled, keyframes} from "styled-components";
import "../styles/DataTable.css"; // Importa el archivo CSS
import axios from "axios";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUndo,
  FaSearch,
  FaPlus,
} from "react-icons/fa"; // Importa los íconos necesarios

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
  color: #083cac;
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

//Boton de Reset de filtros
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
  width: 30%;
  position: relative;
  margin: center;
  margin: 1% 30%;

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

const GuardarButton = styled(ModalButton)`
  background-color: #4caf50;
`;

function Paises() {
  const [ambiente] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [errors, setErrors] = useState({ pais: "" }); // validaciones para insertar un nuevo país
  const [modalValues, setModalValues] = useState({ pais: "" });
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    N_Ambiente: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/ambiente/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (ambiente) => {
            return {
              id: ambiente.id,
              N_Ambiente: ambiente.N_Ambiente,
            };
          })
        );
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los perfiles:", error);
        setLoading(false);
      }
    };

    fetchData();
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
    setModalValues({ ambiente: "" });
    setErrors({ ambiente: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const SaveModal = async () => {
    const newErrors = { ambiente: "" };

    if (!modalValues.ambiente.trim()) {
      newErrors.ambiente = "El campo ambiente es obligatorio";
    }
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el ambiente ya existe en la base de datos
        const response = await axios.get(
          `http://localhost:3000/ambiente?ambiente=${modalValues.ambiente}`
        );
        if (
          response.data.some(
            (ambiente) =>
              ambiente.N_Ambiente.toLowerCase() ===
              modalValues.ambiente.toLowerCase()
          )
        ) {
          setErrors({ ambiente: "El Ambiente ya existe" });
          return;
        }

        // Insertar un nuevo ambiente
        const newAmbiente = { N_Ambiente: modalValues.ambiente };
        const insertResponse = await axios.post(
          `http://localhost:3000/ambiente`,
          newAmbiente
        );

        // Actualizar la lista de ambientes con el nuevo ambiente
        const updatedRecords = [
          ...records,
          { id: insertResponse.data.id, N_Ambiente: modalValues.ambiente },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ ambiente: "" }); // Limpiar los valores del modal
      } catch (error) {
        console.error("Error al insertar el nuevo Ambiente:", error);
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
      ...(field === "ID_Ambiente" && {
        N_Ambiente: ambiente.find((p) => p.id === parseInt(value)).N_Ambiente,
      }),
    }));
    validateInput(field, value);
  };

  const validateInput = (field, value) => {
    let newErrors = { ...errors };
    if (field === "ambiente") {
      if (!value.trim()) {
        newErrors.ambiente = "El campo ambiente es obligatorio";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.ambiente =
          "El campo ambiente solo acepta letras y espacios en blanco";
      } else {
        newErrors.ambiente = "";
      }
    }
    setErrors(newErrors);
  };

  const saveChanges = async (id) => {
    try {
      const updateRow = {
        ...editedRow,
      };

      await axios.put(`http://localhost:3000/ambiente/${id}`, updateRow);

      const updatedRecords = records.map((row) =>
        row.id === id ? { ...editedRow } : row
      );

      //setRecords(updatedRecordsPuesto);
      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);

      console.log("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al guardar los cambios", error);
    }
  };

  const cancelEdit = () => {
    setEditedRow(null);
    setEditMode(null);
  };

  const filteredData = records.filter((row) => {
    return (
      filters.N_Ambiente === "" ||
      row.N_Ambiente.toLowerCase().includes(filters.N_Ambiente.toLowerCase())
    );
  });

  const columns = [
    {
      name: "Ambiente",
      selector: (row) => row.N_Ambiente,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <input
            type="text"
            value={editedRow.N_Ambiente}
            onChange={(e) => handleEditChange(e, "N_Ambiente")}
          />
        ) : (
          <div>{row.N_Ambiente}</div>
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

  const resetFilters = () => {
    setFilters({
      N_Ambiente: "",
    });
  };

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>Ambientes</Title>
            <ButtonGroup>
              <SearchButton primary onClick={toggleFilters}>
                <FaSearch />
                {showFilters ? "Ocultar" : "Buscar"}
              </SearchButton>

              <Button onClick={handleInsert}>
                <FaPlus />
                Nuevo Ambiente
              </Button>
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
            <FilterInput
              type="text"
              value={filters.N_Ambiente}
              onChange={(e) => handleFilterChange(e, "N_Ambiente")}
              placeholder="Buscar por Ambiente"
            />

            <RedButton onClick={resetFilters}>
              <FaUndo /> Limpiar Filtros
            </RedButton>
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
            />
          )}
        </DataTableContainer>
      </ContentContainer>
      {/* Modal para insertar nuevo país */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Insertar Nuevo Ambiente</ModalTitle>
            <ModalInput
              type="text"
              value={modalValues.ambiente}
              onChange={(e) => handleModalChange(e, "ambiente")}
              placeholder="Ambiente"
              error={errors.ambiente}
              pattern="[a-zA-Z\s]+"
              required
            />
            {errors.ambiente && <ErrorMessage>{errors.ambiente}</ErrorMessage>}
            <ModalButtonGroup>
              <GuardarButton primary onClick={SaveModal}>
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

export default Paises;
