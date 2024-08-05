import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import styled from "styled-components";
import "../styles/error.css";
import "../styles/DataTable.css"; // Importa el archivo CSS
import axios from "axios";
import CryptoJS from "crypto-js";
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
  StyledSelect,
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
  width: 45%;
  position: relative;
  margin: center;
  margin: 0% 25%;

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

const secretKey = "mySecretKey"; // Clave secreta para desencriptar datos

const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8).replace(/^"|"$/g, ""); // Eliminar comillas
  } catch (error) {
    console.error("Error al desencriptar datos:", error);
    return "";
  }
};

function Departamento() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15; 
  const [departamento] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [errors, setErrors] = useState({ pais: "", departamento: "" }); //validaciones para insertar una nueva razon social
  const [modalValues, setModalValues] = useState({
    ID_Pais: "",
    departamento: "",
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [filters, setFilters] = useState({
    N_Departamento: "",
    N_Pais: "",
  });
  const [rows, setRows] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const encryptedUser = sessionStorage.getItem("userId");
    if (encryptedUser) {
      const decryptedUser = decryptData(encryptedUser);
      //console.log('Rol desencriptado:', decryptedRole); // Consola para verificar el rol desencriptado
      setUserId(decryptedUser);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/departamento/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (departamento) => {
            const paisResponse = await axios.get(
              `http://localhost:3000/pais/${departamento.ID_Pais}`
            );

            return {
              id: departamento.id,
              N_Departamento: departamento.N_Departamento,
              ID_Pais: departamento.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
            };
          })
        );
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los Departamentos:", error);
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
    setModalValues({ pais: "", departamento: "" });
    setErrors({ pais: "", departamento: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value.toUpperCase() }));
  };

  const SaveModal = async () => {
    const newErrors = { pais: "", departamento: "" };

    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo Pais es obligatorio";
    }

    if (!modalValues.departamento.trim()) {
      newErrors.departamento = "El campo división es obligatorio";
    } else if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/.test(modalValues.departamento)) {
      newErrors.departamento =
        "El campo departamento solo acepta letras y espacios en blanco";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el Departamento ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/departamento`);
        const departamentoExists = response.data.some(
          (departamento) =>
            departamento.ID_Pais === parseInt(modalValues.ID_Pais) &&
            departamento.N_Departamento.toLowerCase() ===
              modalValues.departamento.toLowerCase()
        );
        if (departamentoExists) {
          setErrors({
            departamento: "El departamento ya existe para este pais",
          });
          return;
        }

        // Insertar una nuevo Departamento
        const newDepartamento = {
          N_Departamento: modalValues.departamento,
          ID_Pais: modalValues.ID_Pais,
        };
        const insertResponse = await axios.post(
          `http://localhost:3000/departamento`,
          newDepartamento
        );

        // Obtener información del país
        const paisResponse = await axios.get(
          `http://localhost:3000/pais/${modalValues.ID_Pais}`
        );

        // Obtener el índice del nuevo país (último índice + 1)
        const newIndex = records.length + 1;

        // Guardar el campo nuevo en la auditoría
        const auditoriaData = {
          Campo_Nuevo: `- País: ${paisResponse.data.N_Pais}¬ - Departamento: ${modalValues.departamento}`,
          Tabla: "Departamentos",
          Accion: 1, // Inserción
          ID_Usuario: userId,
          N: newIndex
        };

        // Registrar en la auditoría
        await axios.post("http://localhost:3000/auditoria", auditoriaData);

        // Actualizar la lista de Depatamentos con el nuevo Departamento
        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            N_Departamento: modalValues.departamento,
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
          },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ ID_Pais: "", departamento: "" }); // Limpiar los valores del modal

        // Estilo de notificacion
        const toastElement = document.createElement("div");
        toastElement.className = "toast-success";
        toastElement.innerHTML = "Departamento insertado correctamente!";

        document.body.appendChild(toastElement);

        // Ocultar la notificacion luego de 1 segundo
        setTimeout(() => {
          toastElement.remove();
          window.location.reload(); // Recargar la pagina despues de 1 segundos
        }, 1000);
      } catch (error) {
        console.error("Error al insertar un nuevo departamento:", error);
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
      [field]: value.toUpperCase(),
      ...(field === "ID_Departamento" && {
        N_Departamento: departamento.find((p) => p.id === parseInt(value))
          .N_Departamento,
      }),
      ...(field === "ID_Pais" && {
        N_Pais: pais.find((p) => p.id === parseInt(value)).N_Pais,
      }),
    }));
    validateInput(field, value);
  };

  const validateInput = (field, value) => {
    let newErrors = { ...errors };
    if (field === "pais") {
      if (!value.trim()) {
        newErrors.pais = "El campo Pais es obligatorio";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.pais =
          "El campo Pais solo acepta letras y espacios en blanco";
      } else {
        newErrors.pais = "";
      }
    } else if (field === "departamento") {
      if (!value.trim()) {
        newErrors.departamento = "El campo Departamento es obligatorio";
      } else if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/.test(value)) {
        newErrors.departamento =
          "El campo Departamento solo acepta letras y espacios en blanco";
      } else {
        newErrors.departamento = "";
      }
    }
    setErrors(newErrors);
  };

  const saveChanges = async (id) => {
    try {
      const updateRow = {
        ...editedRow,
      };

      // Verificar si el departamento ya existe en la base de datos para el mismo país
      if (editedRow && editedRow.ID_Pais && editedRow.N_Departamento) {
        const response = await axios.get(`http://localhost:3000/departamento`);
        console.log("Response:", response.data);

        const departamentoExists = response.data.some((departamento) => {
          if (
            departamento.ID_Pais === parseInt(editedRow.ID_Pais) &&
            departamento.id !== id
          ) {
            const editedDivisionName = editedRow.N_Departamento
              ? editedRow.N_Departamento.toLowerCase()
              : "";
            return (
              departamento.N_Departamento.toLowerCase() === editedDivisionName
            );
          }
          return false;
        });

        if (departamentoExists) {
          setErrors({
            departamento: "El departamento ya existe en este país.",
          });

          const errorNotification = document.createElement("div");
          errorNotification.className = "error-notification";
          errorNotification.innerHTML = `
            <span class="error-icon">!</span>
            <span class="error-message">
              El departamento que intenta actualizar ya existe en la base de datos para este país.
              Por favor, ingrese un departamento diferente.
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
        console.error(
          "Error: editedRow.departamento or editedRow.ID_Pais is undefined or empty"
        );
        setErrors({
          division: "El campo Departamento o País no puede estar vacío",
        });
        return;
      }

      // Obtener el valor original del campo
      const originalRow = records.find((row) => row.id === id);

      await axios.put(`http://localhost:3000/departamento/${id}`, updateRow);

      // Obtener el índice del país editado
      const editedIndex = records.findIndex((row) => row.id === id) + 1;

      // Construir los valores para la auditoría
      const originalCountry = originalRow.N_Pais;
      const originalDepartamento = originalRow.N_Departamento;
      const editedCountry = editedRow.N_Pais;
      const editedDepartamento = editedRow.N_Departamento;

      const hasCountryChanged = originalCountry !== editedCountry;
      const hasDepartametnoChanged =
        originalDepartamento !== editedDepartamento;

      const auditoriaData = {
        Campo_Original: [
          hasCountryChanged ? `- País: ${originalCountry}` : "",
          hasDepartametnoChanged ? `- Departamento: ${originalDepartamento}` : "",
        ]
          .filter(Boolean)
          .join("¬ "),
        Campo_Nuevo: [
          hasCountryChanged ? `- País: ${editedCountry}` : "",
          hasDepartametnoChanged ? `- Departamento: ${editedDepartamento}` : "",
        ]
          .filter(Boolean)
          .join("¬ "),
        Tabla: "Departamentos",
        Accion: 2, // Modificación
        ID_Usuario: userId,
        N: editedIndex,
      };

      if (auditoriaData.Campo_Original || auditoriaData.Campo_Nuevo) {
        await axios.post("http://localhost:3000/auditoria", auditoriaData);
      }

      const updatedRecords = records.map((row) =>
        row.id === id ? { ...editedRow } : row
      );

      //setRecords(updatedRecordsPuesto);
      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);

      // Notificación de datos actualizados
      const toastElement = document.createElement("div");
      toastElement.className = "toast-notification";
      toastElement.innerHTML = "¡Departamento actualizado con éxito!";

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
      (filters.N_Departamento === "" ||
        row.N_Departamento.toLowerCase().includes(
          filters.N_Departamento.toLowerCase()
        ))
    );
  });

  const resetFilters = () => {
    setFilters({
      N_Pais: "",
      N_Departamento: "",
    });
  };

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
      name: "N°",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      sortable: true,
      minWidth: "50px",
      maxWidth: "100px",
    },
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
      name: "Departamento",
      selector: (row) => row.N_Departamento,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.N_Departamento}
            onChange={(e) => handleEditChange(e, "N_Departamento")}
          />
        ) : (
          <div>{row.N_Departamento}</div>
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

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>Departamentos</Title>
            <ButtonGroup>
              <Button
                className="btn btn-outline-primary"
                onClick={toggleFilters}
              >
                <FaSearch style={{ margin: "0px 5px" }} />
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
              <Button
                style={{ marginRight: "30px" }}
                className="btn btn-outline-success"
                onClick={handleInsert}
              >
                <FaPlus style={{ margin: "0px 5px" }} />
                Nuevo Departamento
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
              value={filters.N_Departamento}
              onChange={(e) => handleFilterChange(e, "N_Departamento")}
              placeholder="Buscar por Departamento"
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
            customStyles={customStyles}
            pagination
            paginationPerPage={15} // Fija la cantidad de filas por página en 15
            onChangePage={page => setCurrentPage(page)}
            paginationComponentOptions={{
              rowsPerPageText: "", // Oculta el texto de "Filas por página"
              rangeSeparatorText: "de",
              noRowsPerPage: true, // Oculta la opción de seleccionar filas por página
              selectAllRowsItem: false,
            }}
            />
          )}
        </DataTableContainer>
      </ContentContainer>

      {/* Modal para insertar un nuevo departamento */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Departamento</ModalTitle>
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
              <span style={{ textAlign: "left" }}>
                Nombre del departamento:
              </span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.departamento}
              onChange={(e) => handleModalChange(e, "departamento")}
              placeholder="Ingrese el nombre"
              error={errors.departamento}
              required
            />
            {errors.departamento && (
              <ErrorMessage>{errors.departamento}</ErrorMessage>
            )}
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

export default Departamento;
