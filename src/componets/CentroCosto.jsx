import React, { useState, useEffect } from "react";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import "../styles/error.css";
import CryptoJS from "crypto-js";
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
  width: 75%;
  position: relative;
  margin: center;
  margin: 0% 10%;

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

const secretKey = 'mySecretKey'; // Clave secreta para desencriptar datos

const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8).replace(/^"|"$/g, ''); // Eliminar comillas
  } catch (error) {
    console.error("Error al desencriptar datos:", error);
    return '';
  }
};

function RazonSocial() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15; 
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
  const [userId, setUserId] = useState(null);

  useEffect(() => {

    const encryptedUser = sessionStorage.getItem('userId');
    if (encryptedUser) {
        const decryptedUser = decryptData(encryptedUser);
        //console.log('Rol desencriptado:', decryptedRole); // Consola para verificar el rol desencriptado
        setUserId(decryptedUser);
    }

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
    setModalValues((prevValues) => ({ ...prevValues, [field]: value.toUpperCase() }));
  };

  const SaveModal = async () => {
    const trimmedCodigo = modalValues.Codigo.trim();
    const trimmedNombre = modalValues.Nombre.trim();
    const newErrors = { ID_Pais: "", Codigo: "", Nombre: "" };

    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo País es obligatorio";
    }

    if (!trimmedCodigo) {
      newErrors.Codigo = "El campo Código es obligatorio";
    }

    if (!trimmedNombre) {
      newErrors.Nombre = "El campo Nombre es obligatorio";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el centro costE ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/centrocosto`);
        const centrocostos = response.data;

        const codigoExistente = centrocostos.some(
          (centrocosto) =>
            centrocosto.Codigo.toLowerCase() ===
            trimmedCodigo.toLowerCase()
        );

        if (codigoExistente) {
          const errorMessages = {};
          if (codigoExistente) {
            errorMessages.Codigo = "El codigo del Centro de Costo ya existe";
          }
          setErrors({ ...newErrors, ...errorMessages });
          return;
        }

        // Insertar un nuevo Centro de Costos
        const newCentrocosto = {
          Nombre: trimmedNombre,
          Codigo: trimmedCodigo,
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

        const newIndex = records.length + 1;

        // Preparar datos de auditoría
        const auditoriaData = {
          Campo_Nuevo: `- País: ${paisResponse.data.N_Pais}¬ - Código: ${trimmedCodigo}¬ - Nombre: ${trimmedNombre}`,
          Tabla: 'Centro de Costes',
          Accion: 1, // Inserción
          ID_Usuario: userId,
          N: newIndex
        };

        // Registrar en la auditoría
       await axios.post('http://localhost:3000/auditoria', auditoriaData);

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            Nombre: trimmedNombre,
            Codigo: trimmedCodigo,
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

  const startEdit = (row) => {
    setEditedRow({ ...row });
    setEditMode(row.id);
  };

  const handleEditChange = (event, field) => {
    const { value } = event.target;
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value.toUpperCase(),
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

  const handleInputClick = (field) => {
    if (editMode) {
      setEditedRow((prevState) => ({
        ...prevState,
        [field]: '',
      }));
    }
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
  const trimmedCodigo = editedRow.Codigo.trim();
  const trimmedNombre = editedRow.Nombre.trim();
  if (!trimmedCodigo) {
    setErrors({ Codigo: "El campo Codigo no puede estar vacío" });
    showNotification("El campo Codigo no puede estar vacío");
    return;
  } else if (!trimmedNombre) {
    setErrors({ Nombre: "El campo Nombre no puede estar vacío" });
    showNotification("El campo Nombre no puede estar vacío");
    return;
  }

  try {
    const updateRow = {
     ...editedRow,
     Codigo: trimmedCodigo,
     Nombre: trimmedNombre,
    };

    if (editedRow && editedRow.Codigo) {
      const response = await axios.get(
        `http://localhost:3000/centrocosto?Codigo=${editedRow.Codigo}`
      );

      if (
        response.data.some(
          (codigo) =>
            codigo.Codigo.toLowerCase() ===
            trimmedCodigo.toLowerCase()
        )
      ) {
        const errorNotification = document.createElement("div");
        errorNotification.className = "error-notification";
        errorNotification.innerHTML = `
          <span class="error-icon">!</span>
          <span class="error-message">
            El Codigo de Centro de Coste que intenta actualizar ya existe en la base de datos.
            Por favor, ingrese un Codigo diferente.
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
      console.error("Error: editedRow.Codigo is undefined or empty");
      setErrors({ Codigo: "El campo Codigo no puede estar vacío" });
      return;
    }  

      await axios.put(`http://localhost:3000/centrocosto/${id}`, updateRow);

       // Obtener el valor original del campo
    const originalRow = records.find((row) => row.id === id);

    const editedIndex = records.findIndex((row) => row.id === id) + 1;

    // Construir los valores para la auditoría
    const originalCountry = originalRow.N_Pais;
    const originalCodigo = originalRow.Codigo;
    const originalNombre = originalRow.Nombre;
    const editedCountry = editedRow.N_Pais;
    const editedCodigo = trimmedCodigo;
    const editedNombre = trimmedNombre;

    const hasCountryChanged = originalCountry !== editedCountry;
    const hasCodigoChanged = originalCodigo !== editedCodigo;
    const hasNombreChanged = originalNombre !== editedNombre;

    const auditoriaData = {
      Campo_Original: [
        hasCountryChanged ? `- País: ${originalCountry}` : '',
        hasCodigoChanged ? `- Código: ${originalCodigo}` : '',
        hasNombreChanged ? `- Nombre: ${originalNombre}` : ''
      ].filter(Boolean).join('¬ '),
      Campo_Nuevo: [
        hasCountryChanged ? `- País: ${editedCountry}` : '',
        hasCodigoChanged ? `- Código: ${editedCodigo}` : '',
        hasNombreChanged ? `- Nombre: ${editedNombre}` : ''
      ].filter(Boolean).join('¬ '),
      Tabla: 'Centro de Costes',
      Accion: 2, // Modificación
      ID_Usuario: userId,
      N: editedIndex
    };

    if (auditoriaData.Campo_Original || auditoriaData.Campo_Nuevo) {
      await axios.post('http://localhost:3000/auditoria', auditoriaData);
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
      name: "N°",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      minWidth: "30px",
      maxWidth: "50px",
    },
    {
      name: "País",
      selector: (row) => row.N_Pais,
      minWidth: "100px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
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
      minWidth: "100px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "400px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Codigo}
            onChange={(e) => handleEditChange(e, "Codigo")}
            onClick={() => handleInputClick("Codigo")}
          />
        ) : (
          <div>{row.Codigo}</div>
        ),
    },
    {
      name: "Nombre",
      selector: (row) => row.Nombre,
      minWidth: "300px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "600px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Nombre}
            onChange={(e) => handleEditChange(e, "Nombre")}
            onClick={() => handleInputClick("Nombre")}
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
              customStyles={customStyles}
              pagination
              paginationPerPage={15}
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
