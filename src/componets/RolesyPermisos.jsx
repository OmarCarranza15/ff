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
    Insertar: false,
    Editar: false,
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
    Insertar: false,
    Editar: false,
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
      Insertar: false,
      Editar: false,
    });
    setErrors({ pais: "", rolusuario: "" });
  };

  const handleModalChange = (event, field) => {
    const { value, type, checked } = event.target;
    setModalValues((prevValues) => ({
      ...prevValues,
      [field]: type === "checkbox" ? checked : value,
    }));
  };

  const SaveModal = async () => {
    const newErrors = { pais: "", rolusuario: "", Des_Rol: "" };

    if (!modalValues.Paises.length) {
      newErrors.pais = "El campo Pais es obligatorio";
    }

    if (!modalValues.N_Rol.trim()) {
      newErrors.rolusuario = "El campo Rol es obligatorio";
    }

    if (!modalValues.Des_Rol.trim()) {
      newErrors.Des_Rol = "El campo descripción es obligatorio";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        const response = await axios.get(`http://localhost:3000/rolusuario`);
        const rolusuarioExists = response.data.some(
          (rolusuario) =>
            rolusuario.N_Rol.toLowerCase() === modalValues.N_Rol.toLowerCase()
        );
        if (rolusuarioExists) {
          setErrors({ rolusuario: "El Rol ya existe." });
          return;
        }

        const newRolUsuario = {
          N_Rol: modalValues.N_Rol,
          Des_Rol: modalValues.Des_Rol,
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
        const auditoriaData = {
          Campo_Nuevo: `- Rol: ${modalValues.N_Rol}¬ - Descripción Rol: ${
            modalValues.Des_Rol
          }¬ - Permiso Insertar: ${
            modalValues.Insertar === true ? "Habilitado" : "Deshabilitado"
          }¬ - Permiso Editar: ${
            modalValues.Editar === true ? "Habilitado" : "Deshabilitado"
          }¬ - Paises: ${modalValues.Paises.map(
            (id) => pais.find((a) => a.id === id)?.N_Pais
          ).join(",")}`,

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
            N_Rol: newRolUsuario.N_Rol,
            Des_Rol: newRolUsuario.Des_Rol,
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
    } else {
    }

    const { value, type, checked } = event.target;
    if (type === "checkbox") {
      setEditedRow((prevState) => ({
        ...prevState,
        [field]: checked,
      }));
    } else {
      setEditedRow((prevState) => ({
        ...prevState,
        [field]: value,
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

  const saveChanges = async (id) => {
    try {
      const updateRow = {
        ...editedRow,
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
      const originalInsertar = originalRow.Insertar;
      const originalEditar = originalRow.Editar;
      const originalPais = originalRow.Paises;

      const EditedRol = editedRow.N_Rol;
      const editedDesRol = editedRow.Des_Rol;
      const editedInsertar = editedRow.Insertar;
      const EditedEditar = editedRow.Editar;
      const EditedPais = editedRow.Paises.map(
        (id) => pais.find((a) => a.id === Number(id))?.N_Pais
      );

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
          hasInsertarChanged
            ? `- Permiso Insertar: ${
                originalInsertar === true ? "Habilitado" : "Deshabilitado"
              }`
            : "",
          hasEditarChanged
            ? `- Permiso Editar:  ${
                originalEditar === true ? "Habilitado" : "Deshabilitado"
              }`
            : "",
          hasPaisChanged ? `- Paises: ${originalPais}` : "",
        ]
          .filter(Boolean)
          .join("¬ "),
        Campo_Nuevo: [
          hasRolChanged ? `- Rol: ${EditedRol}` : "",
          hasDesRolChanged ? `- Descripción:  ${editedDesRol}` : "",
          hasInsertarChanged
            ? `- Permiso Insertar: ${
                editedInsertar === true ? "Habilitado" : "Deshabilitado"
              }`
            : "",
          hasEditarChanged
            ? `- Permiso Editar:  ${
                EditedEditar === true ? "Habilitado" : "Deshabilitado"
              }`
            : "",
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
      sortable: true,
      minWidth: "50px",
      maxWidth: "70px",
    },
    {
      name: "Roles",
      selector: (row) => row.N_Rol,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.N_Rol}
            onChange={(e) => handleEditChange(e, "N_Rol")}
          />
        ) : (
          <div>{row.N_Rol}</div>
        ),
    },
    {
      name: "Descripcion",
      selector: (row) => row.Des_Rol,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Des_Rol}
            onChange={(e) => handleEditChange(e, "Des_Rol")}
          />
        ) : (
          <div>{row.Des_Rol}</div>
        ),
    },
    {
      name: "Fecha de Creacion",
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
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
      sortable: true,
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
            {errors.pais && <ErrorMessage>{errors.pais}</ErrorMessage>}
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
