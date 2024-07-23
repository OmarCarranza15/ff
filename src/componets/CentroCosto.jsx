import React, { useState, useEffect } from "react";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import "../styles/error.css";
import DataTable from "react-data-table-component";
import styled from "styled-components";
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
  StyledSelect,
  RedButton,
  DataTableContainer,
  ModalBackground,
  ModalWrapper,
  ModalTitle,
  ErrorMessage,
  ModalButtonGroup,
} from "./Estilos.jsx";
import "../styles/DataTable.css"; // Importa el archivo CSS
import axios from "axios";
import { FaUndo, FaSearch, FaPlus } from "react-icons/fa"; // Importa los íconos necesarios

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

function RazonSocial() {
  const [centrocosto] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [errors, setErrors] = useState({ ID_Pais: "", Codigo: "", Nombre: "" });
  const [modalValues, setModalValues] = useState({
    ID_Pais: "",
    Codigo: "",
    Nombre: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    Codigo: "",
    Nombre: "",
    N_Pais: "",
  });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/centrocosto/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (centrocosto) => {
            const paisResponse = await axios.get(
              `http://localhost:3000/pais/${centrocosto.ID_Pais}`
            );
            return {
              id: centrocosto.id,
              Nombre: centrocosto.Nombre,
              Codigo: centrocosto.Codigo,
              ID_Pais: centrocosto.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
            };
          })
        );
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los Centros de Costos:", error);
        setLoading(false);
      }
    };
    const fetchPais = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/pais/`);
        setPais(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de Paises", error);
      }
    };

    fetchData();
    fetchPais();
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
    setModalValues({ ID_Pais: "", Codigo: "", Nombre: "" });
    setErrors({ ID_Pais: "", Codigo: "", Nombre: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const SaveModal = async () => {
    const newErrors = { ID_Pais: "", Codigo: "", Nombre: "" };

    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo País es obligatorio";
    }

    if (!modalValues.Codigo.trim()) {
      newErrors.Codigo = "El campo Código es obligatorio";
    }

    if (!modalValues.Nombre.trim()) {
      newErrors.Nombre = "El campo Nombre es obligatorio";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el centro costE ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/centrocosto`);
        const centrocostos = response.data;

        const nombreExistente = centrocostos.some(
          (centrocosto) =>
            centrocosto.Nombre.toLowerCase() ===
            modalValues.Nombre.toLowerCase()
        );

        const codigoExistente = centrocostos.some(
          (centrocosto) =>
            centrocosto.Codigo.toLowerCase() ===
            modalValues.Codigo.toLowerCase()
        );

        if (nombreExistente || codigoExistente) {
          const errorMessages = {};
          if (nombreExistente) {
            errorMessages.Nombre = "El nombre del Centro de Costo ya existe";
          }
          if (codigoExistente) {
            errorMessages.Codigo = "El codigo del Centro de Costo ya existe";
          }
          setErrors({ ...newErrors, ...errorMessages });
          return;
        }

        // Insertar un nuevo Centro de Costos
        const newCentrocosto = {
          Nombre: modalValues.Nombre,
          Codigo: modalValues.Codigo,
          ID_Pais: modalValues.ID_Pais,
        };
        const insertResponse = await axios.post(
          `http://localhost:3000/centrocosto`,
          newCentrocosto
        );

        // Actualizar la lista de Centro de Costos con el nuevo Centro de Costos
        const paisResponse = await axios.get(
          `http://localhost:3000/pais/${modalValues.ID_Pais}`
        );

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            Nombre: modalValues.Nombre,
            Codigo: modalValues.Codigo,
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
          },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ ID_Pais: "", Codigo: "", Nombre: "" }); // Limpiar los valores del modal

        // Estilo de notificacion
        const toastElement = document.createElement("div");
        toastElement.className = "toast-success";
        toastElement.innerHTML = "Centro de Coste insertado correctamente!";

        document.body.appendChild(toastElement);

        // Ocultar la notificacion luego de 1 segundo
        setTimeout(() => {
          toastElement.remove();
          window.location.reload(); // Recargar la pagina despues de 1 segundos
        }, 1000);
      } catch (error) {
        console.error("Error al insertar un nuevo Centro de Coste:", error);
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
      ...(field === "ID_CentroCostos" && {
        Nombre: centrocosto.find((p) => p.id === parseInt(value)).Nombre,
      }),
      ...(field === "ID_CentroCostos" && {
        Codigo: centrocosto.find((p) => p.id === parseInt(value)).Codigo,
      }),
      ...(field === "ID_Pais" && {
        N_Pais: pais.find((p) => p.id === parseInt(value)).N_Pais,
      }),
    }));
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
    } else if (field === "Codigo") {
      if (!value.trim()) {
        newErrors.Codigo = "El campo Código es obligatorio";
      } else {
        newErrors.Codigo = "";
      }
    } else if (field === "Nombre") {
      if (!value.trim()) {
        newErrors.Nombre = "El campo Nombre es obligatorio";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.Nombre =
          "El campo Nombre solo acepta letras y espacios en blanco";
      } else {
        newErrors.Nombre = "";
      }
    }
    setErrors(newErrors);
  };

const saveChanges = async (id) => {
  try {
    const updateRow = {
     ...editedRow,
    };

    if (editedRow && editedRow.Codigo && editedRow.Nombre) {
      try {
        const response = await axios.get(`http://localhost:3000/centrocosto`);
        console.log("Response:", response.data);

        const centrocosteExists = response.data.some((centrocosto) => {
          if (centrocosto.id!== id && 
            centrocosto.ID_Pais === parseInt(editedRow.ID_Pais) &&
            centrocosto.Codigo === editedRow.Codigo 
          ) {
            const editedcentrocoste = editedRow.Nombre
             ? editedRow.Nombre.toLowerCase()
              : "";
            return centrocosto.Nombre.toLowerCase() === editedcentrocoste;
          }
          return false;
        });

        if (centrocosteExists) {
          setErrors({ centrocosto: "Este centro de coste ya existe." });

          const errorNotification = document.createElement("div");
          errorNotification.className = "error-notification";
          errorNotification.innerHTML = `
            <span class="error-icon">!</span>
            <span class="error-message">
              El centro de coste que intenta registrar ya existe en la base de datos para este país.
              Por favor, ingrese una centro de coste diferente.
            </span>
          `;

          document.body.appendChild(errorNotification);

          // Ocultar la notificación después de 2 segundos
          setTimeout(() => {
            errorNotification.remove();
          }, 2000);
          return;
        }
      } catch (error) {
        console.error("Error retrieving centrocosto data:", error);
        setErrors({ centrocosto: "Error al verificar centro de coste" });
        return;
      }
    } else {
      console.error(
        "Error: editedRow.Codigo or editedRow.Nombre is undefined or empty"
      );
      setErrors({
        centrocosto: "El campo Codigo o Nombre no puede estar vacío",
      });
      return;
    }   

      await axios.put(`http://localhost:3000/centrocosto/${id}`, updateRow);

      const updatedRecords = records.map((row) =>
        row.id === id ? { ...editedRow } : row
      );

      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);

      // Notificación de datos actualizados
      const toastElement = document.createElement("div");
      toastElement.className = "toast-notification";
      toastElement.innerHTML = "Centro de Coste actualizado con éxito!";

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
      (filters.N_Pais === "" ||
        row.N_Pais.toLowerCase().includes(filters.N_Pais.toLowerCase())) &&
      (filters.Nombre === "" ||
        row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())) &&
      (filters.Codigo === "" ||
        row.Codigo.toLowerCase().includes(filters.Codigo.toLowerCase()))
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
      name: "País",
      selector: (row) => row.N_Pais,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledSelect
            value={editedRow.ID_Pais}
            onChange={(e) => handleEditChange(e, "ID_Pais")}
          >
            {pais.map((pais) => (
              <option key={pais.id} value={pais.id}>
                {pais.N_Pais}
              </option>
            ))}
          </StyledSelect>
        ) : (
          <div>{row.N_Pais}</div>
        ),
    },
    {
      name: "Código",
      selector: (row) => row.Codigo,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Codigo}
            onChange={(e) => handleEditChange(e, "Codigo")}
          />
        ) : (
          <div>{row.Codigo}</div>
        ),
    },
    {
      name: "Nombre",
      selector: (row) => row.Nombre,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Nombre}
            onChange={(e) => handleEditChange(e, "Nombre")}
          />
        ) : (
          <div>{row.Nombre}</div>
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
      N_Pais: "",
      Nombre: "",
      Codigo: "",
    });
  };

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>Centro de Costes</Title>
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
                Nuevo Centro de Coste
              </Button>
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
              value={filters.Codigo}
              onChange={(e) => handleFilterChange(e, "Codigo")}
              placeholder="Buscar por Codigo"
            />
            <FilterInput
              type="text"
              value={filters.Nombre}
              onChange={(e) => handleFilterChange(e, "Nombre")}
              placeholder="Buscar por Nombre"
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
      {/* Modal para insertar una nueva departamento */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Centro de Coste</ModalTitle>
            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>País:</span>
            </label>
            <select
              class="form-select"
              aria-label="Default select example"
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
            </select>
            {errors.pais && <ErrorMessage>{errors.pais}</ErrorMessage>}

            <div style={{ margin: "15px" }} />
            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Código del Centro de Coste:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.Codigo}
              onChange={(e) => handleModalChange(e, "Codigo")}
              placeholder="Ingrese el código"
              error={errors.Codigo}
              required
            />
            {errors.Codigo && <ErrorMessage>{errors.Codigo}</ErrorMessage>}

            <div style={{ margin: "15px" }} />

            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Nombre del Centro de Coste:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.Nombre}
              onChange={(e) => handleModalChange(e, "Nombre")}
              placeholder="Ingrese el nombre"
              error={errors.Nombre}
              required
            />
            {errors.Nombre && <ErrorMessage>{errors.Nombre}</ErrorMessage>}

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

export default RazonSocial;
