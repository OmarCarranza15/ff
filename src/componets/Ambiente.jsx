import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import styled from "styled-components";
import "../styles/DataTable.css"; // Importa el archivo CSS
import "../styles/error.css";
import axios from "axios";
import { FaUndo, FaSearch, FaPlus } from "react-icons/fa"; // Importa los íconos necesarios
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
  StyledInput,
  RedButton,
  DataTableContainer,
  ModalBackground,
  ModalWrapper,
  ModalTitle,
  ErrorMessage,
  ModalButtonGroup,
} from "./Estilos.jsx";

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
    text-align: left; /* Centra el texto en las celdas */
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
  const [rows, setRows] = useState([]);

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

        // Estilo de notificacion
        const toastElement = document.createElement("div");
        toastElement.className = "toast-success";
        toastElement.innerHTML = "¡Ambiente insertado correctamente!";

        document.body.appendChild(toastElement);

        // Ocultar la notificacion luego de 1 segundo
        setTimeout(() => {
          toastElement.remove();
          window.location.reload(); // Recargar la pagina despues de 1 segundos
        }, 1000);
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

      // Verificar si el ambiente ya existe
      if (editedRow && editedRow.N_Ambiente) {
        const response = await axios.get(
          `http://localhost:3000/ambiente?N_Ambiente=${editedRow.N_Ambiente}`
        );

        if (
          response.data.some(
            (ambiente) =>
              ambiente.N_Ambiente.toLowerCase() ===
              editedRow.N_Ambiente.toLowerCase()
          )
        ) {
          const errorNotification = document.createElement("div");
          errorNotification.className = "error-notification";
          errorNotification.innerHTML = `
            <span class="error-icon">!</span>
            <span class="error-message">
              El ambiente que intenta actualizar ya existe en la base de datos.
              Por favor, ingrese una ambiente diferente.
            </span>
          `;
          document.body.appendChild(errorNotification);

          // Ocultar la notificación después de 2 segundos
          setTimeout(() => {
            errorNotification.remove();
          }, 2000);
          return;
        }
      } else {
        console.error("Error: editedRow.N_Ambiente is undefined or empty");
        setErrors({ N_Ambiente: "El campo país no puede estar vacío" });
        return;
      }

      await axios.put(`http://localhost:3000/ambiente/${id}`, updateRow);
      console.log("Update successful");

      const updatedRecords = records.map((row) =>
        row.id === id ? { ...editedRow } : row
      );

      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);

      // Notificación de datos actualizados
      const toastElement = document.createElement("div");
      toastElement.className = "toast-notification";
      toastElement.innerHTML = "¡Ambiente actualizado con éxito!";

      document.body.appendChild(toastElement);

      // Ocultar la notificación después de 1 segundo
      setTimeout(() => {
        toastElement.remove();
        window.location.reload(); // Recargar la pagina despues de 1 segundo
      }, 1000);
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

  const deleteRow = (id) => {
    axios
      .get(`/Datosdependientes/${id}`)
      .then((response) => {
        if (response.data.hasDependencies) {
          alert(
            "No se puede eliminar este registro porque tiene dependencias en otros registros."
          );
        } else {
          axios
            .delete(`/delete/${id}`)
            .then((response) => {
              // Actualiza la lista de filas después de eliminar una fila
              setRows(rows.filter((row) => row.id !== id));
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  };

  const columns = [
    {
      name: "Ambiente",
      selector: (row) => row.N_Ambiente,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
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
          <ButtonGroup>
            <Button
              type="button"
              className="btn btn-outline-success"
              onClick={() => saveChanges(row.id)}
            >
              Guardar
            </Button>
            <Button
              type="button"
              className="btn btn-outline-danger"
              onClick={cancelEdit}
            >
              Cancelar
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            <Button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => startEdit(row)}
            >
              Editar
            </Button>
            <Button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                if (
                  window.confirm(
                    "¿Estás seguro que deseas eliminar este registro?"
                  )
                ) {
                  deleteRow(row.id);
                }
              }}
            >
              Eliminar
            </Button>
          </ButtonGroup>
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
              <Button
                className="btn btn-outline-primary"
                onClick={toggleFilters}
              >
                <FaSearch style={{margin: "0px 5px"}}/>
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
              <Button
                style={{marginRight: "30px"}}
                className="btn btn-outline-success"
                onClick={handleInsert}
              >
                <FaPlus style={{margin: "0px 5px"}}/>
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
      {/* Modal para insertar nuevo país */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Ambiente</ModalTitle>
            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Nombre del Ambiente:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.ambiente}
              onChange={(e) => handleModalChange(e, "ambiente")}
              placeholder="Ingrese el nombre"
              error={errors.ambiente}
              required
            />
            {errors.ambiente && <ErrorMessage>{errors.ambiente}</ErrorMessage>}
            <div style={{ margin: "15px" }} />
            <ModalButtonGroup>
              <button
                type="button"
                class="btn btn-success"
                style={{ fontSize: "14px", padding: "10px 10px" }}
                onClick={SaveModal}
              >
                Guardar
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                cancel
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
            </ModalButtonGroup>
          </ModalWrapper>
        </ModalBackground>
      )}
    </MainContainer>
  );
}

export default Paises;