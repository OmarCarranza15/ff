

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import styled from "styled-components";
import "../styles/DataTable.css"; // Importa el archivo CSS
import "../styles/error.css";
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

function Paises() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const [pais] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [errors, setErrors] = useState({ pais: "" }); // validaciones para insertar un nuevo país
  const [modalValues, setModalValues] = useState({ pais: ""});
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
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
        const response = await axios.get(`http://localhost:3000/pais/`);
        const data = response.data;
        const mappedData = data.map((pais) => ({
          id: pais.id,
          N_Pais: pais.N_Pais,
        }));
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los Paises:", error);
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
    setModalValues({ pais: "" });
    setErrors({ pais: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const SaveModal = async () => {
    const newErrors = { pais: "" };
  
    if (!modalValues.pais.trim()) {
      newErrors.pais = "El campo País es obligatorio";
    } else if (!/^[a-zA-ZÑñ\s]+$/.test(modalValues.pais)) {
      newErrors.pais = "El campo País solo acepta letras y espacios en blanco";
    }
    setErrors(newErrors);
  
    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el país ya existe en la base de datos
        const response = await axios.get(
          `http://localhost:3000/pais?N_Pais=${modalValues.pais}`
        );
        if (
          response.data.some(
            (pais) =>
              pais.N_Pais.toLowerCase() === modalValues.pais.toLowerCase()
          )
        ) {
          setErrors({ pais: "El país ya existe" });
          return;
        }
  
        // Insertar un nuevo país
        const newPais = { N_Pais: modalValues.pais };
        const insertResponse = await axios.post(
          `http://localhost:3000/pais`,
          newPais
        );
  
        // Obtener el índice del nuevo país (último índice + 1)
        const newIndex = records.length + 1;
  
        // Guardar el campo nuevo en la auditoría
        const auditoriaData = {
          Campo_Nuevo: `- País: ${modalValues.pais}`, // Usar el índice generado
          Tabla: 'Paises',
          Accion: 1,
          ID_Usuario: userId,
          N: newIndex
        };
        await axios.post('http://localhost:3000/auditoria', auditoriaData);
  
        // Actualizar la lista de países con el nuevo país
        const updatedRecords = [
          ...records,
          { id: insertResponse.data.id, N_Pais: modalValues.pais },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ pais: "" }); // Limpiar los valores del modal
  
        // Estilo de notificación
        const toastElement = document.createElement("div");
        toastElement.className = "toast-success";
        toastElement.innerHTML = "¡País insertado correctamente!";
  
        document.body.appendChild(toastElement);
  
        // Ocultar la notificación luego de 1 segundo
        setTimeout(() => {
          toastElement.remove();
          window.location.reload(); // Recargar la página después de 1 segundo
        }, 1000);
      } catch (error) {
        console.error("Error al insertar el nuevo País:", error);
      }
    }
  };

  const startEdit = (row) => {
    console.log("row object:", row);
    setEditedRow({ ...row });
    setEditMode(row.id);
  };

  const handleEditChange = (event, field) => {
    const { value } = event.target;
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value,
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
    if (field === "N_Pais") {
      if (!value.trim()) {
        newErrors.N_Pais = "El campo País es obligatorio";
        showNotification(newErrors.N_Pais);
      } else if (!/^[a-zA-ZÑñ\s]+$/.test(value)) {
        newErrors.N_Pais = "El campo País solo acepta letras y espacios en blanco";
        showNotification(newErrors.N_Pais);
      } else {
        newErrors.N_Pais = "";
      }
    }
    setErrors(newErrors);
  };

  const saveChanges = async (id) => {
    if (!editedRow.N_Pais.trim()) {
      setErrors({ N_Pais: "El campo País no puede estar vacío" });
      showNotification("El campo País no puede estar vacío");
      return;
    }
    try {
      const updateRow = {
        ...editedRow,
      };

      if (!editedRow.N_Pais) {
        setErrors({ N_Pais: "El campo país no puede estar vacío" });
        return;
      }

      const response = await axios.get(`http://localhost:3000/pais?N_Pais=${editedRow.N_Pais}`);

      if (response.data.some(pais => pais.N_Pais.toLowerCase() === editedRow.N_Pais.toLowerCase())) {
        const errorNotification = document.createElement("div");
        errorNotification.className = "error-notification";
        errorNotification.innerHTML = `
          <span class="error-icon">!</span>
          <span class="error-message">
            El País que intenta actualizar ya existe en la base de datos.
            Por favor, ingrese una país diferente.
          </span>
        `;
        document.body.appendChild(errorNotification);

        setTimeout(() => {
          errorNotification.remove();
        }, 2000);
        return;
      }

      const existingCountry = records.find(row => row.N_Pais.toLowerCase() === editedRow.N_Pais.toLowerCase());

      if (existingCountry && existingCountry.id !== id) {
        setErrors({ N_Pais: "El país ya está registrado" });
        return;
      }

      const originalRow = records.find(row => row.id === id);

      await axios.put(`http://localhost:3000/pais/${id}`, updateRow);

      const editedIndex = records.findIndex(row => row.id === id) + 1;

      const auditoriaData = {
        Campo_Original: `- País: ${originalRow.N_Pais}`,
        Campo_Nuevo: `- País: ${editedRow.N_Pais}`,
        Tabla: 'Paises',
        Accion: 2,
        ID_Usuario: userId,
        N: editedIndex
      };

      await axios.post('http://localhost:3000/auditoria', auditoriaData);

      const updatedRecords = records.map(row =>
        row.id === id ? { ...editedRow } : row
      );

      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);

      const toastElement = document.createElement("div");
      toastElement.className = "toast-notification";
      toastElement.innerHTML = "País actualizado con éxito!";
      document.body.appendChild(toastElement);

      setTimeout(() => {
        toastElement.remove();
        window.location.reload();
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
      filters.N_Pais === "" ||
      row.N_Pais.toLowerCase().includes(filters.N_Pais.toLowerCase())
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
      minWidth: "50px",
      maxWidth: "100px",
    },
    {
      name: "País",
      selector: (row) => row.id,
      minWidth: "200px",
      maxWidth: "50px",
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
            <StyledInput
              type="text"
              value={editedRow.N_Pais}
              onChange={(e) => handleEditChange(e, "N_Pais")}
              onClick={() => handleInputClick("N_Pais")}
              onKeyPress={(e) => {
                if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
        ) : (
          <div>{row.N_Pais}</div>
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
    });
  };

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>Paises</Title>
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
                Nuevo Pais
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
              customStyles={customStyles}
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
      {/* Modal para insertar nuevo país */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Insertar Nuevo País</ModalTitle>

            <div style={{ margin: "15px" }} />
            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Nombre del País:</span>
            </label>
            <input
              className="form-control"
              type="text"
              value={modalValues.pais}
              onInput={(e) => {
                const value = e.target.value;
                const newValue = value.toLowerCase().replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
                e.target.value = newValue;
                handleModalChange(e, "pais");
              }}
              placeholder="Ingrese el nombre"
              error={errors.pais}
              pattern="[a-zA-ZÑñ\s]+"
              required
            />
            {errors.pais && <ErrorMessage>{errors.pais}</ErrorMessage>}
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
