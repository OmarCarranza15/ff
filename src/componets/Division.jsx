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

function Division() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const [division] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [errors, setErrors] = useState({ pais: "", division: "" }); //validaciones para insertar una nueva razon social
  const [modalValues, setModalValues] = useState({ ID_Pais: "", division: "" });
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    N_Division: "",
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
        const response = await axios.get(`http://localhost:3000/division/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (division) => {
            const paisResponse = await axios.get(
              `http://localhost:3000/pais/${division.ID_Pais}`
            );

            return {
              id: division.id,
              N_Division: division.N_Division,
              ID_Pais: division.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
            };
          })
        );
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las Divisiones:", error);
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
    setModalValues({ pais: "", division: "" });
    setErrors({ pais: "", division: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value.toUpperCase() }));
  };

  const SaveModal = async () => {
    const newErrors = { pais: "", division: "" };

    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo País es obligatorio";
    }

    if (!modalValues.division.trim()) {
      newErrors.division = "El campo división es obligatorio";
    } else if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/.test(modalValues.division)) {
      newErrors.division =
        "El campo división solo acepta letras y espacios en blanco";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si la División ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/division`);
        const divisionExists = response.data.some(
          (division) =>
            division.ID_Pais === parseInt(modalValues.ID_Pais) &&
            division.N_Division.toLowerCase() ===
              modalValues.division.toLowerCase()
        );
        if (divisionExists) {
          setErrors({ division: "La División ya existe en este país" });
          return;
        }

        // Insertar una nueva división
        const newDivision = {
          N_Division: modalValues.division,
          ID_Pais: modalValues.ID_Pais,
        };
        const insertResponse = await axios.post(
          `http://localhost:3000/division`,
          newDivision
        );

        // Obtener información del país
        const paisResponse = await axios.get(
          `http://localhost:3000/pais/${modalValues.ID_Pais}`
        );

        // Preparar datos de auditoría
        const newIndex = records.length + 1;

        // Guardar el campo nuevo en la auditoría
        const auditoriaData = {
          Campo_Nuevo: `- País: ${paisResponse.data.N_Pais}¬ - Razón Social: ${modalValues.division}`, // Usar el índice generado
          Tabla: "Divisiones",
          Accion: 1,
          ID_Usuario: userId,
          N: newIndex,
        };
        await axios.post("http://localhost:3000/auditoria", auditoriaData);

        // Actualizar la lista de divisiones con la nueva división
        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            N_Division: modalValues.division,
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
          },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ ID_Pais: "", division: "" }); // Limpiar los valores del modal

        // Estilo de notificación
        const toastElement = document.createElement("div");
        toastElement.className = "toast-success";
        toastElement.innerHTML = "¡División insertada correctamente!";

        document.body.appendChild(toastElement);

        // Ocultar la notificación luego de 1 segundo
        setTimeout(() => {
          toastElement.remove();
          window.location.reload(); // Recargar la página después de 1 segundo
        }, 1000);
      } catch (error) {
        console.error("Error al insertar una nueva división:", error);
      }
    }
  };

  const showNotification = (message, type = 'error') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}-notification`;
    notification.innerHTML = `
      <span class="notification-message">${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000); // Oculta la notificación después de 2 segundos
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
    } else if (field === "division") {
      if (!value.trim()) {
        newErrors.division = "El campo Division es obligatorio";
      } else if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/.test(value)) {
        newErrors.division =
          "El campo Division solo acepta letras y espacios en blanco";
      } else {
        newErrors.division = "";
      }
    }
    setErrors(newErrors);
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
      ...(field === "ID_Division" && {
        N_Division: division.find((p) => p.id === parseInt(value)).N_Division,
      }),
      ...(field === "ID_Pais" && {
        N_Pais: pais.find((p) => p.id === parseInt(value)).N_Pais,
      }),
    }));
    validateInput(field, value);
  };
  const handleInputClick = (field) => {
    if (editMode) {
      setEditedRow((prevState) => ({
        ...prevState,
        [field]: '',
      }));
    }
  };

  const saveChanges = async (id) => {
    if (!editedRow.N_Division.trim()) {
      setErrors({ N_Division: "El campo Division no puede estar vacío" });
      showNotification("El campo Division no puede estar vacío");
      return;
    }
    try {

      const updateRow = {
        ...editedRow,
      };

      // Verificar si la División ya existe en la base de datos para el mismo país
      if (editedRow && editedRow.ID_Pais && editedRow.N_Division) {
        const response = await axios.get(`http://localhost:3000/division`);
        console.log("Response:", response.data);

        const divisionExists = response.data.some((division) => {
          if (
            division.ID_Pais === parseInt(editedRow.ID_Pais) &&
            division.id !== id
          ) {
            const editedDivisionName = editedRow.N_Division
              ? editedRow.N_Division.toLowerCase()
              : "";
            return division.N_Division.toLowerCase() === editedDivisionName;
          }
          return false;
        });

        if (divisionExists) {
          setErrors({ division: "La División ya existe en este país" });

          const errorNotification = document.createElement("div");
          errorNotification.className = "error-notification";
          errorNotification.innerHTML = `
          <span class="error-icon">!</span>
          <span class="error-message">
            La División que intenta registrar ya existe en la base de datos para este país.
            Por favor, ingrese una División diferente.
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
          "Error: editedRow.division or editedRow.ID_Pais is undefined or empty"
        );
        setErrors({
          division: "El campo División o País no puede estar vacío",
        });
        return;
      }

      await axios.put(`http://localhost:3000/division/${id}`, updateRow);

      // Obtener el valor original del campo
      const originalRow = records.find((row) => row.id === id);

      const editedIndex = records.findIndex((row) => row.id === id) + 1;

      // Construir los valores para la auditoría
      const originalCountry = originalRow.N_Pais;
      const originalDivision = originalRow.N_Division;
      const editedCountry = editedRow.N_Pais;
      const editedDivision = editedRow.N_Division;

      const hasCountryChanged = originalCountry !== editedCountry;
      const hasDivisionChanged = originalDivision !== editedDivision;

      const auditoriaData = {
        Campo_Original: [
          hasCountryChanged ? `- País: ${originalCountry}` : "",
          hasDivisionChanged ? `- División: ${originalDivision}` : "",
        ]
          .filter(Boolean)
          .join("¬ "),
        Campo_Nuevo: [
          hasCountryChanged ? `- País: ${editedCountry}` : "",
          hasDivisionChanged ? `- División: ${editedDivision}` : "",
        ]
          .filter(Boolean)
          .join("¬ "),
        Tabla: "Divisiones",
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

      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);

      // Notificación de datos actualizados
      const toastElement = document.createElement("div");
      toastElement.className = "toast-notification";
      toastElement.innerHTML = "¡División actualizada con éxito!";

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
      (filters.N_Division === "" ||
        row.N_Division.toLowerCase().includes(filters.N_Division.toLowerCase()))
    );
  });

  const resetFilters = () => {
    setFilters({
      N_Pais: "",
      N_Division: "",
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
      minWidth: "50px",
      maxWidth: "100px",
    },
    {
      name: "País",
      selector: (row) => row.N_Pais,
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
      name: "División",
      selector: (row) => row.N_Division,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.N_Division}
            onChange={(e) => handleEditChange(e, "N_Division")}
            onClick={() => handleInputClick("N_Division")}
          />
        ) : (
          <div>{row.N_Division}</div>
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
            <Title>Divisiones</Title>
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
                Nueva División
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
              value={filters.N_Division}
              onChange={(e) => handleFilterChange(e, "N_Division")}
              placeholder="Buscar por Division"
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
              onChangePage={(page) => setCurrentPage(page)}
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
            <ModalTitle>Nueva División</ModalTitle>

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
              style={{ width: "100%", display: "block" }}>
              <span style={{ textAlign: "left" }}>Nombre de la División:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.division}
              onChange={(e) => handleModalChange(e, "division")}
              placeholder="Ingrese el nombre"
              error={errors.division}
              required
            />
            {errors.division && <ErrorMessage>{errors.division}</ErrorMessage>}

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

export default Division;
