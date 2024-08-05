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
  width: 50%;
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
  const [rsocial] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [errors, setErrors] = useState({ pais: "", rsocial: "" }); //validaciones para insertar una nueva razon social
  const [modalValues, setModalValues] = useState({ ID_Pais: "", rsocial: "" });
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    N_RSocial: "",
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
        const response = await axios.get(`http://localhost:3000/rsocial/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (rsocial) => {
            const paisResponse = await axios.get(
              `http://localhost:3000/pais/${rsocial.ID_Pais}`
            );

            return {
              id: rsocial.id,
              N_RSocial: rsocial.N_RSocial,
              ID_Pais: rsocial.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
            };
          })
        );
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las Razones Sociales:", error);
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
    setModalValues({ pais: "", rsocial: "" });
    setErrors({ pais: "", rsocial: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const SaveModal = async () => {
    const newErrors = { pais: "", rsocial: "" };

    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo Pais es obligatorio";
    }

    if (!modalValues.rsocial.trim()) {
      newErrors.rsocial = "El campo Razón Social es obligatorio";
    } else if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s|]+$/.test(modalValues.rsocial)) {
      newErrors.rsocial =
        "El campo Razón Social solo acepta letras y espacios en blanco y el símbolo '|'";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si la razón social ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/rsocial`);
        const rsocialExists = response.data.some(
          (rsocial) =>
            rsocial.ID_Pais === parseInt(modalValues.ID_Pais) &&
            rsocial.N_RSocial.toLowerCase() === modalValues.rsocial.toLowerCase()
        );
        if (rsocialExists) {
          setErrors({ rsocial: "La Razón social ya existe para este país" });
          return;
        }

        // Insertar una nueva razón social
        const newRSocial = {
          N_RSocial: modalValues.rsocial,
          ID_Pais: modalValues.ID_Pais,
        };
        const insertResponse = await axios.post(
          `http://localhost:3000/rsocial`,
          newRSocial
        );

        
        // Actualizar la lista de razones sociales con la nueva razón social
        const paisResponse = await axios.get(
          `http://localhost:3000/pais/${modalValues.ID_Pais}`
        );

        const newIndex = records.length + 1;

        // Preparar datos de auditoría
        const auditoriaData = {
          Campo_Nuevo: `- País: ${paisResponse.data.N_Pais}¬ - Razón Social: ${modalValues.rsocial}`,
          Tabla: 'Razones Sociales',
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
            N_RSocial: modalValues.rsocial,
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
          },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ ID_Pais: "", rsocial: "" }); // Limpiar los valores del modal

       // Estilo de notificacion
       const toastElement = document.createElement("div");
       toastElement.className = "toast-success";
       toastElement.innerHTML = "¡Razón Social insertada correctamente!";

       document.body.appendChild(toastElement);

       // Ocultar la notificacion luego de 1 segundo
       setTimeout(() => {
         toastElement.remove();
         window.location.reload(); // Recargar la pagina despues de 1 segundos
       }, 1000);
      } catch (error) {
        console.error("Error al insertar la nueva Razón Social:", error);
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
      ...(field === "ID_RSocial" && {
        N_RSocial: rsocial.find((p) => p.id === parseInt(value)).N_RSocial,
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
    } else if (field === "rsocial") {
      if (!value.trim()) {
        newErrors.rsocial = "La razón social es un campo obligatorio";
      } else if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s|]+$/.test(value)) {
        newErrors.rsocial =
          "El campo Razón Social solo acepta letras y espacios en blanco y el símbolo '|'";
      } else {
        newErrors.rsocial = "";
      }
    }
    setErrors(newErrors);
  };

  const saveChanges = async (id) => {
    try {
      const updateRow = {
        ...editedRow,
      };

       // Verificar si la razon social ya existe en la base de datos para el mismo país
       if (editedRow && editedRow.ID_Pais && editedRow.N_RSocial) {
        const response = await axios.get(`http://localhost:3000/rsocial`);
        console.log("Response:", response.data);

        const rsocialExists = response.data.some((rsocial) => {
          if (
            rsocial.ID_Pais === parseInt(editedRow.ID_Pais) &&
            rsocial.id !== id
          ) {
            const editedrsocialName = editedRow.N_RSocial
              ? editedRow.N_RSocial.toLowerCase()
              : "";
            return rsocial.N_RSocial.toLowerCase() === editedrsocialName;
          }
          return false;
        });

        if (rsocialExists) {
          setErrors({ rsocial: "La razón social ya existe en este país" });

          const errorNotification = document.createElement("div");
          errorNotification.className = "error-notification";
          errorNotification.innerHTML = `
            <span class="error-icon">!</span>
            <span class="error-message">
              La razón social que intenta registrar ya existe en la base de datos para este país.
              Por favor, ingrese una razón social diferente.
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
          "Error: editedRow.rsocial or editedRow.ID_Pais is undefined or empty"
        );
        setErrors({
          rsocial: "El campo Razón Social o País no puede estar vacío",
        });
        return;
      }

      await axios.put(`http://localhost:3000/rsocial/${id}`, updateRow);

     // Obtener el valor original del campo
    const originalRow = records.find((row) => row.id === id);

    const editedIndex = records.findIndex((row) => row.id === id) + 1;

    // Construir los valores para la auditoría
    const originalCountry = originalRow.N_Pais;
    const originalRSocial = originalRow.N_RSocial;
    const editedCountry = editedRow.N_Pais;
    const editedRSocial = editedRow.N_RSocial;

    const hasCountryChanged = originalCountry !== editedCountry;
    const hasRSocialChanged = originalRSocial !== editedRSocial;

    const auditoriaData = {
      Campo_Original: [
        hasCountryChanged ? `- País: ${originalCountry}` : '',
        hasRSocialChanged ? `- Razón Social: ${originalRSocial}` : ''
      ].filter(Boolean).join('¬ '),
      Campo_Nuevo: [
        hasCountryChanged ? `- País: ${editedCountry}` : '',
        hasRSocialChanged ? `- Razón Social: ${editedRSocial}` : ''
      ].filter(Boolean).join('¬ '),
      Tabla: 'Razones Sociales',
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

      //setRecords(updatedRecordsPuesto);
      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);

      // Notificación de datos actualizados
      const toastElement = document.createElement("div");
      toastElement.className = "toast-notification";
      toastElement.innerHTML = "Razón Social actualizada con éxito!";

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
      (filters.N_RSocial === "" ||
        row.N_RSocial.toLowerCase().includes(filters.N_RSocial.toLowerCase()))
    );
  });

  const resetFilters = () => {
    setFilters({
      N_Pais: "",
      N_RSocial: "",
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
      maxWidth: "50px",
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
      name: "Razón Social",
      selector: (row) => row.N_RSocial,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.N_RSocial}
            onChange={(e) => handleEditChange(e, "N_RSocial")}  
          />
        ) : (
          <div>{row.N_RSocial}</div>
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
            <Title>Razones Sociales</Title>
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
                Nueva Razón Social
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
              value={filters.N_RSocial}
              onChange={(e) => handleFilterChange(e, "N_RSocial")}
              placeholder="Buscar por Razon Social"
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

      {/* Modal para insertar una nueva razón social */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nueva Razón Social</ModalTitle>
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
              <span style={{ textAlign: "left" }}>Nombre de la Razón Social:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.rsocial}
              onChange={(e) => handleModalChange(e, "rsocial")}
              placeholder="Ingrese el nombre"
              error={errors.rsocial}
            />
            {errors.rsocial && <ErrorMessage>{errors.rsocial}</ErrorMessage>}
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
