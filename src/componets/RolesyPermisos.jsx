import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import "../styles/DataTable.css"; // Importa el archivo CSS
import styled from "styled-components";
import axios from "axios";
import CryptoJS from "crypto-js";
import moment from 'moment-timezone';
import Select from "react-select";
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
  StyledDataTable,
  RedButton,
  DataTableContainer,
  ModalBackground,
  ModalWrapper,
  ModalTitle,
  ErrorMessage,
  ModalButtonGroup,
} from "./Estilos.jsx";
import { FaUndo, FaSearch, FaPlus } from "react-icons/fa"; // Importa los íconos necesarios

const Checkbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid #005baa;
  background-color: ${(props) => (props.checked ? "#005baa" : "#fff")};
  cursor: pointer;
  position: relative;
  outline: none;

  &:checked::after {
    content: "✓";
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
  }

  &:hover {
    border-color: #0056b3;
  }
`;

const timeZone = 'America/Tegucigalpa';

const CustomCheckbox = ({ checked, onChange, disabled }) => {
  return (
    <Checkbox
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

const PermissionCheckbox = ({ checked, onChange, disabled }) => {
  return (
    <Checkbox
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

// Estilo para la sección de permisos
const PermissionsSection = styled.div`
  margin-top: 20px;
`;

// Estilo para las etiquetas de los checkboxes
const PermissionLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1em;
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

function Roles() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState({
    id: null,
    Paises: [],
    N_Rol: "",
    Des_Rol: "",
    Insertar: "",
    Editar: "",
  });
  const [pais, setPais] = useState([]);
  const [errors, setErrors] = useState({
    pais: "",
    rolusuario: "",
  }); //validaciones para insertar una nueva razon social
  const [modalValues, setModalValues] = useState({
    Paises: [],
    N_Rol: "",
    Des_Rol: "",
    Insertar: "",
    Editar: "",
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    N_Rol: "",
    Des_Rol: "",
    createdAt: ""
  });
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
        const [rolesResponse, paisResponse] = await Promise.all([
          axios.get(`http://localhost:3000/rolusuario/`),
          axios.get(`http://localhost:3000/pais/`),
        ]);

        const rolesData = rolesResponse.data;
        const paisData = paisResponse.data;

        const paisMap = paisData.reduce((map, pais) => {
          map[pais.id] = pais.N_Pais;
          return map;
        }, {});

        const mappedData = rolesData.map((rolusuario) => {
          const paisIds = rolusuario.Paises.split(",").map(Number);
          const paisNombres = paisIds.map((id) => paisMap[id]);
          return {
            id: rolusuario.id,
            N_Rol: rolusuario.N_Rol,
            Des_Rol: rolusuario.Des_Rol,
            Insertar: rolusuario.Insertar,
            Editar: rolusuario.Editar,
            createdAt: rolusuario.createdAt,
            Paises: paisNombres,
          };
        });

        setRecords(mappedData);
        setPais(paisData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los Roles:", error);
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
    setModalValues({
      Paises: [],
      N_Rol: "",
      Des_Rol: "",
      Insertar: "",
      Editar: "",
    });
    setErrors({ pais: "", rolusuario: "" });
  };

  const handleModalChange = (event, field) => {
    const { value, type, checked } = event.target;
    let newValue = type === "checkbox" ? checked : value;
    if (field !== "Des_Rol") {
      newValue = String(newValue).toUpperCase();
    }
    setModalValues((prevValues) => ({ 
      ...prevValues, 
      [field]: type === "checkbox" ? checked : newValue, }));
  };



  const SaveModal = async () => {
    const trimmedRol = modalValues.N_Rol.trim();
    const trimmedDesRol = modalValues.Des_Rol.trim();
    const newErrors = { pais: "", rolusuario: "", Des_Rol: "" };

    if (!trimmedRol) {
      newErrors.rolusuario = "El campo Rol es obligatorio";
    }

    if (!trimmedDesRol) {
      newErrors.Des_Rol = "El campo descripción es obligatorio";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        const response = await axios.get(`http://localhost:3000/rolusuario`);
        const rolusuarioExists = response.data.some(
          (rolusuario) =>
            rolusuario.N_Rol.toLowerCase() === trimmedRol.toLowerCase()
        );
        if (rolusuarioExists) {
          setErrors({ rolusuario: "El Rol ya existe." });
          return;
        }

        const newRolUsuario = {
          N_Rol: trimmedRol,
          Des_Rol: trimmedDesRol,
          Insertar: modalValues.Insertar ? 1 : 2,
          Editar: modalValues.Editar ? 1 : 2,
          Paises: modalValues.Paises.join(","),
        };

        const insertResponse = await axios.post(
          `http://localhost:3000/rolusuario`,
          newRolUsuario
        );

        const newIndex = records.length + 1;

        // Guardar el campo nuevo en la auditoría


        const createCampoNuevo = (modalValues) => {
          let campoNuevo = `- Rol: ${trimmedRol}¬ - Descripción Rol: ${trimmedDesRol}¬`; 

          if (modalValues.Insertar) {
            campoNuevo += ` - Permiso Insertar: ${modalValues.Insertar === true ? "Habilitado": "Deshabilitado"}¬`;
          }
          if (modalValues.Editar) {
            campoNuevo += `- Permiso Editar: ${modalValues.Editar === true ? "Habilitado": "Deshabilitado"}¬`;
          }
          if (modalValues.Paises && modalValues.Paises.length > 0) {
            campoNuevo += `- Paises: ${modalValues.Paises.map((id) => pais.find((a) => a.id === Number(id))?.N_Pais).join(", ")}`;
          }
          
          return campoNuevo;
        };

        
        const auditoriaData = {
          Campo_Nuevo: createCampoNuevo(modalValues),
          Tabla: "Roles y Permisos",
          Accion: 1,
          ID_Usuario: userId,
          N: newIndex,
        };
        await axios.post("http://localhost:3000/auditoria", auditoriaData);

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            N_Rol: trimmedRol,
            Des_Rol: trimmedDesRol,
            Insertar: newRolUsuario.Insertar,
            Editar: newRolUsuario.Editar,
            Paises: modalValues.Paises.map(
              (id) => pais.find((a) => a.id === id)?.N_Pais
            ),
          },
        ];

        setRecords(updatedRecords);
        setShowModal(false);
        setModalValues({ N_Rol: "", Des_Rol: "", Paises: [] });
        // Estilo de notificacion
        const toastElement = document.createElement("div");
        toastElement.className = "toast-success";
        toastElement.innerHTML = "¡Rol incertado correctamente!";

        document.body.appendChild(toastElement);

        // Ocultar la notificacion luego de 1 segundo
        setTimeout(() => {
          toastElement.remove();
          window.location.reload(); // Recargar la pagina despues de 1 segundos
        }, 1000);
      } catch (error) {
        console.error("Error al insertar un nuevo Rol:", error);
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
    const paisIds = row.Paises.map((nombre) => {
      const paisObj = pais.find((a) => a.N_Pais === nombre);
      return paisObj ? paisObj.id : null;
    }).filter((id) => id !== null);

    setEditedRow({
      ...row,
      Paises: paisIds,
      Insertar: row.Insertar === 1,
      Editar: row.Editar === 1,
    });
    setEditMode(row.id);
  };

  const handleEditChange = (event, field) => {
    if (field === "Paises") {
      const selectedOptions = Array.from(
        event.target.selectedOptions,
        (option) => option.value
      );
      setEditedRow((prevState) => ({
        ...prevState,
        Paises: selectedOptions,
      }));
    } const { type, checked } = event.target;
    if (type === "checkbox") {
      setEditedRow((prevState) => ({
        ...prevState,
        [field]: checked,
      }));
    } else {
      const { value, type, checked } = event.target;
      let newValue = type === "checkbox" ? checked : value;
      if (field !== "Des_Rol") {
        newValue = String(newValue).toUpperCase();
      }
      setEditedRow((prevState) => ({
        ...prevState,
        [field]: newValue,
      }));
    }
  };
  const handleStaticCheckboxChange = (e, id, field) => {
    const updatedRecords = records.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          [field]: e.target.checked ? 1 : 2,
        };
      }
      return row;
    });

    setRecords(updatedRecords);
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
    const trimmedRol = editedRow.N_Rol.trim();
    const trimmedDesRol = editedRow.Des_Rol.trim();
    if (!trimmedRol) {
      setErrors({ N_Rol: "El campo Roles no puede estar vacío" });
      showNotification("El campo Roles no puede estar vacío");
      return;
    } else if (!trimmedDesRol) {
      setErrors({ Des_Rol: "El campo Descripcion no puede estar vacío" });
      showNotification("El campo Descripcion no puede estar vacío");
      return;
    }

     try {
       // Validar que los campos Rol no estén vacíos
       if (editedRow && editedRow.N_Rol) {
        const response = await axios.get(
          `http://localhost:3000/rolusuario?N_Rol=${editedRow.N_Rol}`
        );
  
        if (
          response.data.some(
            (rol) =>
              rol.N_Rol.toLowerCase() ===
              trimmedRol.toLowerCase() && rol.id !== id
          )
        ) {
          const errorNotification = document.createElement("div");
          errorNotification.className = "error-notification";
          errorNotification.innerHTML = `
            <span class="error-icon">!</span>
            <span class="error-message">
              El Rol que intenta actualizar ya existe en la base de datos.
              Por favor, ingrese un Rol diferente.
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
        console.error("Error: editedRow.N_Rol is undefined or empty");
        setErrors({ N_Rol: "El campo Rol no puede estar vacío" });
        return;
      }  

    const updateRow = {
      ...editedRow,
      N_Rol: trimmedRol,
      Des_Rol: trimmedDesRol,
      Insertar: editedRow.Insertar ? 1 : 2,
      Editar: editedRow.Editar ? 1 : 2,
      Paises: editedRow.Paises.join(","),
    };

      await axios.put(`http://localhost:3000/rolusuario/${id}`, updateRow);

      // Obtener el valor original del campo
      const originalRow = records.find((row) => row.id === id);

      const editedIndex = records.findIndex((row) => row.id === id) + 1;

      // Construir los valores para la auditoría
      const originalRol = originalRow.N_Rol;
      const originalDesRol = originalRow.Des_Rol;
      const originalInsertar = originalRow.Insertar === 1 ? "Habilitado": "Deshabilitado";
      const originalEditar = originalRow.Editar === 1 ? "Habilitado": "Deshabilitado";
      const originalPais = Array.isArray(originalRow.Paises) 
          ? originalRow.Paises.join(", ") 
          : originalRow.Paises || '';

      const EditedRol = trimmedRol;
      const editedDesRol = trimmedDesRol;
      const editedInsertar = editedRow.Insertar  === true ? "Habilitado": "Deshabilitado";
      const EditedEditar = editedRow.Editar  === true ? "Habilitado": "Deshabilitado";
      const EditedPais =  editedRow.Paises.map(
        (id) => pais.find((a) => a.id === id)?.N_Pais
    ).join(", ");

      const hasRolChanged = originalRol !== EditedRol;
      const hasDesRolChanged = originalDesRol !== editedDesRol;
      const hasInsertarChanged = originalInsertar !== editedInsertar;
      const hasEditarChanged = originalEditar !== EditedEditar;
      const hasPaisChanged = originalPais !== EditedPais;

      //Si permiso insertar esta en 1 mostramelo como habilitado y si esta en 2 como deshabilitado
      const auditoriaData = {
        Campo_Original: [
          hasRolChanged ? `- Rol: ${originalRol}` : "",
          hasDesRolChanged ? `- Descripción:  ${originalDesRol}` : "",
          hasInsertarChanged ? `- Permiso Insertar: ${ originalInsertar}` : "",
          hasEditarChanged ? `- Permiso Editar:  ${originalEditar}` : "",
          hasPaisChanged ? `- Paises: ${originalPais}` : "",
        ]
          .filter(Boolean)
          .join("¬ "),
        Campo_Nuevo: [
          hasRolChanged ? `- Rol: ${EditedRol}` : "",
          hasDesRolChanged ? `- Descripción:  ${editedDesRol}` : "",
          hasInsertarChanged
            ? `- Permiso Insertar: ${editedInsertar}`: "",
          hasEditarChanged
            ? `- Permiso Editar:  ${EditedEditar}` : "",
          hasPaisChanged ? `- Paises: ${EditedPais}` : "",
        ]
          .filter(Boolean)
          .join("¬ "),
        Tabla: "Roles y Permisos",
        Accion: 2, // Modificación
        ID_Usuario: userId,
        N: editedIndex,
      };

      if (auditoriaData.Campo_Original || auditoriaData.Campo_Nuevo) {
        await axios.post("http://localhost:3000/auditoria", auditoriaData);
      }

      const updatedRecords = records.map((row) =>
        row.id === id
          ? {
              ...row,
              ...updateRow,
              Paises: updateRow.Paises.split(",").map(
                (id) => pais.find((a) => a.id === Number(id))?.N_Pais
              ),
            }
          : row
      );

      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);

      // Notificación de datos actualizados
      const toastElement = document.createElement("div");
      toastElement.className = "toast-notification";
      toastElement.innerHTML = "¡Usuario actualizado con éxito!";

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

  const filteredData = useMemo(() => {
    return records.filter((row) => {
      return (
        (filters.N_Rol === "" ||
          row.N_Rol.toLowerCase().includes(filters.N_Rol.toLowerCase())) &&
        (filters.Des_Rol === "" ||
          row.Des_Rol.toLowerCase().includes(filters.Des_Rol.toLowerCase()))
      );
    });
  }, [records, filters]);

  const resetFilters = () => {
    setFilters({
      N_Rol: "",
      Des_Rol: "",
      Paises: "",
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

  const formatDate = (date) => {
    return moment(date).tz(timeZone).format('YYYY-MM-DD');
  };


  const columns = [
    {
      name: "N°",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      minWidth: "50px",
      maxWidth: "70px",
    },
    {
      name: "Roles",
      selector: (row) => row.N_Rol,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.N_Rol}
            onChange={(e) => handleEditChange(e, "N_Rol")}
            onClick={() => handleInputClick("N_Rol")}
          />
        ) : (
          <div>{row.N_Rol}</div>
        ),
    },
    {
      name: "Descripcion",
      selector: (row) => row.Des_Rol,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Des_Rol}
            onChange={(e) => handleEditChange(e, "Des_Rol")}
            onClick={() => handleInputClick("Des_Rol")}
          />
        ) : (
          <div>{row.Des_Rol}</div>
        ),
    },
    {
      name: "Fecha de Creacion",
      selector: (row) => formatDate(row.createdAt),
      minWidth: "150px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "550px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => <div>{formatDate(row.createdAt)}</div>
        
    },
    {
      name: "Insertar",
      selector: (row) => (row.Insertar === 1 ? "Activo" : "Inactivo"),
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <CustomCheckbox
            checked={editedRow.Insertar}
            onChange={(e) => handleEditChange(e, "Insertar")}
          />
        ) : (
          <CustomCheckbox
            checked={row.Insertar === 1}
            disabled={!editMode || editedRow?.id !== row.id}
            onChange={(e) => handleStaticCheckboxChange(e, row.id, "Insertar")}
          />
        ),
    },
    {
      name: "Editar",
      selector: (row) => (row.Editar === 1 ? "Activo" : "Inactivo"),
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <CustomCheckbox
            checked={editedRow.Editar}
            onChange={(e) => handleEditChange(e, "Editar")}
          />
        ) : (
          <CustomCheckbox
            checked={row.Editar === 1}
            disabled={!editMode || editedRow?.id !== row.id}
            onChange={(e) => handleStaticCheckboxChange(e, row.id, "Editar")}
          />
        ),
    },
    {
      name: "Paises",
      selector: (row) => row.Paises.join(", "),
      minWidth: "330px",
      maxWidth: "50px",
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <Select
            isMulti
            value={editedRow.Paises.map((id) => ({
              value: id,
              label: pais.find((a) => a.id === id)?.N_Pais,
            }))}
            options={pais.map((a) => ({
              value: a.id,
              label: a.N_Pais,
            }))}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions.map(
                (option) => option.value
              );
              setEditedRow((prevState) => ({
                ...prevState,
                Paises: selectedValues,
              }));
            }}
            menuPosition="fixed"
            menuPlacement="auto"
          />
        ) : (
          <div>{row.Paises.join(", ")}</div>
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
            <Title>Roles y Permisos</Title>
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
                Nuevo Rol
              </Button>
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
            <FilterInput
              type="text"
              value={filters.N_Rol}
              onChange={(e) => handleFilterChange(e, "N_Rol")}
              placeholder="Buscar por Rol"
            />
            <FilterInput
              type="text"
              value={filters.Des_Rol}
              onChange={(e) => handleFilterChange(e, "Des_Rol")}
              placeholder="Buscar por Descripción"
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
      {/* Modal para insertar una nueva aplicacion */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Rol de Usuario</ModalTitle>

            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Nombre del Rol:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.N_Rol}
              onChange={(e) => handleModalChange(e, "N_Rol")}
              placeholder="Ingrese el rol"
              error={errors.rolusuario}
              required
            />
            {errors.rolusuario && (
              <ErrorMessage>{errors.rolusuario}</ErrorMessage>
            )}

            <div style={{ margin: "15px" }} />
            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Descripción del Rol:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.Des_Rol}
              onChange={(e) => handleModalChange(e, "Des_Rol")}
              placeholder="Ingrese la descripción"
            />
            {errors.Des_Rol && <ErrorMessage>{errors.Des_Rol}</ErrorMessage>}

            <div style={{ margin: "15px" }} />
            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Permisos por paises:</span>
            </label>
            <Select
              isMulti
              value={modalValues.Paises.map((id) => ({
                value: id,
                label: pais.find((a) => a.id === id)?.N_Pais,
              }))}
              options={pais.map((a) => ({
                value: a.id,
                label: a.N_Pais,
              }))}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map(
                  (option) => option.value
                );
                setModalValues((prevValues) => ({
                  ...prevValues,
                  Paises: selectedValues,
                }));
              }}
              placeholder="Selecciona Paises"
            />
            
            <div style={{ margin: "15px" }} />

            <h4>Permisos</h4>
            <div style={{ margin: "15px" }} />

            <PermissionsSection>
              <PermissionLabel>
                <PermissionCheckbox
                  type="checkbox"
                  checked={modalValues.Insertar}
                  onChange={(e) => handleModalChange(e, "Insertar")}
                />
                Permitir Insertar
              </PermissionLabel>
              <PermissionLabel>
                <PermissionCheckbox
                  type="checkbox"
                  checked={modalValues.Editar}
                  onChange={(e) => handleModalChange(e, "Editar")}
                />
                Permitir Editar
              </PermissionLabel>
            </PermissionsSection>
            <div style={{ margin: "20px" }} />
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

export default Roles;

