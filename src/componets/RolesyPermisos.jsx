import React, { useState } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import { styled } from "styled-components";
import { FaSave, FaTimes, FaUndo, FaSearch, FaPlus } from "react-icons/fa"; // Importa los íconos necesarios
import Multiselect from "multiselect-react-dropdown";
import Select from "react-select";

/*
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
);*/

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
  position: relative;
  right: 9px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  padding: 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

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

//Boton de filtros
const SearchButton = styled(Button)`
  background-color: #008cba; /* Azul */
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
  width: 100%;

  th,
  td {
    border: 1px solid #ddd;
    padding: 15px;
    text-align: center; /* Centra el texto en las celdas */
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
    responsive: true;
  }

  th {
    background-color: #f0f0f0;
    text-align: center; /* Centra el texto en los encabezados */
  }

  td {
    min-width: 200px;
    max-width: 500px;
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

/////////////////////////MODAL//////////////////////////////////
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
  text-align: left;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid ${(props) => (props.error ? "red" : "#ccc")};
  border-radius: 5px;
  font-size: 14px;
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
  font-size: 14px;
  margin-bottom: 8px;
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
const StyledMultiselect = styled(Multiselect)`
  font-size: 14px;
  width: auto; /* Agregué width: auto para que el input se ajuste automáticamente al tamaño del texto del placeholder */
  text-align: left;
  margin-bottom: 15px;
  padding: 10px;

  ::placeholder {
    font-size: 14px;
    white-space: nowrap; /* Agregué white-space: nowrap para que el texto no se corte */
  }

  &:focus {
    box-shadow: 0 0 5px rgba(0, 140, 186, 0.5);
  }
`;

function RolesyPermisos() {
  const [records, setRecords] = useState([
    {
      id: 1,
      nombrerol: "Admin",
      desrol: "Administrador del sistema",
      permisoconsultar: 1,
      permisoinsertar: 1,
      permisoeditar: 1,
      permisoadmin: 1,
      pais: "Honduras, Panama, Guatemala, Nicaragua",
      fechacreacion: "05/05/2024",
      fechamodificacion: "05/05/2024",
    },
    {
      id: 2,
      nombrerol: "Mesa",
      desrol: "Area de mesa de servicio",
      permisoconsultar: 1,
      permisoinsertar: 2,
      permisoeditar: 2,
      permisoadmin: 2,
      pais: "Honduras",
      fechacreacion: "05/05/2024",
      fechamodificacion: "05/05/2024",
    },
    {
      id: 3,
      nombrerol: "Oficial de Seguridad",
      desrol: "Rol para oficial de seguridad",
      permisoconsultar: 1,
      permisoinsertar: 2,
      permisoeditar: 2,
      permisoadmin: 2,
      pais: 2,
      fechacreacion: "05/05/2024",
      fechamodificacion: "05/05/2024",
    },
  ]);

  const [filters, setFilters] = useState({
    nombrerol: "",
    desrol: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [editedRow, setEditedRow] = useState(null); // Estado para la fila en edición
  const [editedRowData, setEditedRowData] = useState({});
  const [errors, setErrors] = useState({
    nombrerol: "",
    desrol: "",
    permisoconsultar: "",
    permisoinsertar: "",
    permisoeditar: "",
    permisoadmin: "",
    pais: "",
  }); //validaciones para insertar un nuevo puesto
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [modalValues, setModalValues] = useState({
    nombrerol: "",
    desrol: "",
    permisoconsultar: "",
    permisoinsertar: "",
    permisoeditar: "",
    permisoadmin: "",
    pais: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  //const [loading, setLoading] = useState(true);

  const columns = [
    {
      name: "Nombre del Rol",
      selector: (row) => row.nombrerol,
      sortable: true,
      minWidth: "200px",
      maxWidth: "500px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <input
            type="text"
            value={editedRow.nombrerol}
            onChange={(e) => handleEditChange(e, "nombrerol")}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <div>{row.nombrerol}</div>
        ),
    },
    {
      name: "Descripción del Rol",
      selector: (row) => row.desrol,
      sortable: true,
      minWidth: "200px",
      maxWidth: "500px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <input
            type="text"
            value={editedRow.desrol}
            onChange={(e) => handleEditChange(e, "desrol")}
            style={{
              padding: "8px",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          />
        ) : (
          <div>{row.desrol}</div>
        ),
    },
    {
      name: "Consultar",
      selector: (row) => row.permisoconsultar,
      sortable: true,
      minWidth: "100px",
      maxWidth: "500px",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.permisoconsultar === 1}
          onChange={(e) =>
            handleEditChange(e, "permisoconsultar", e.target.checked ? 1 : 2)
          }
          style={{
            width: "20px",
            height: "20px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxShadow: "0 0 5px rgba(0,0,0,0.2)",
            color: "blue",
          }}
          disabled={!editedRow} // Aquí se condiciona la propiedad disabled para que se pueda editar
        />
      ),
    },
    {
      name: "Insertar",
      selector: (row) => row.permisoinsertar,
      sortable: true,
      minWidth: "100px",
      maxWidth: "500px",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.permisoinsertar === 1}
          onChange={(e) =>
            handleEditChange(e, "permisoinsertar", e.target.checked ? 1 : 2)
          }
          style={{
            width: "20px",
            height: "20px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxShadow: "0 0 5px rgba(0,0,0,0.2)",
          }}
          disabled={!editedRow} // Aquí se condiciona la propiedad disabled para que se pueda editar
        />
      ),
    },
    {
      name: "Editar",
      selector: (row) => row.permisoeditar,
      sortable: true,
      minWidth: "50px",
      maxWidth: "100px",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.permisoeditar === 1}
          onChange={(e) =>
            handleEditChange(e, "permisoeditar", e.target.checked ? 1 : 2)
          }
          style={{
            width: "20px",
            height: "20px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxShadow: "0 0 5px rgba(0,0,0,0.2)",
          }}
          disabled={!editedRow} // Aquí se condiciona la propiedad disabled para que se pueda editar
        />
      ),
    },
    {
      name: "País",
      selector: (row) => row.pais,
      sortable: true,
      minWidth: "300px",
      maxWidth: "600px",
      cell: (row) =>
        editedRow && editedRow.id === row.id ? (
          <Select
            placeholder="Seleccione uno o mas paises"
            value={selectedCountries.map((value) => ({ value, label: value }))}
            onChange={(options) => {
              setSelectedCountries(options.map((option) => option.value));
              setEditedRow({
                ...editedRow,
                pais: options.map((option) => option.value).join(","),
              });
              handleEditChange(editedRow, "pais");
            }}
            isMulti
            options={[
              { value: "Honduras", label: "Honduras" },
              { value: "Guatemala", label: "Guatemala" },
              { value: "Panama", label: "Panama" },
              { value: "Nicaragua", label: "Nicaragua" },
            ]}
            components={{ Option }}
            closeMenuOnSelect={false}
            isSearchable={true}
            noOptionsMessage={() => "No hay más opciones"}
          />
        ) : (
          <div>{row.pais}</div>
        ),
    },
    {
      name: "Fecha de Creación",
      selector: (row) => row.fechacreacion,
      sortable: true,
      minWidth: "100px",
      maxWidth: "500px",
    },
    {
      name: "Fecha de Modificación",
      selector: (row) => row.fechamodificacion,
      sortable: true,
      minWidth: "100px",
      maxWidth: "500px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div>
          <Button onClick={() => handleEdit(row)}>Editar</Button>
        </div>
      ),
    },
  ];
  const handleEdit = (row) => {
    setEditedRowData(row);
    setShowEditModal(true);
  };

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
      nombrerol: "",
      desrol: "",
      permisoconsultar: "",
      permisoinsertar: "",
      permisoeditar: "",
      permisoadmin: "",
      pais: "",
    });

    setErrors({
      nombrerol: "",
      desrol: "",
      permisoconsultar: "",
      permisoinsertar: "",
      permisoeditar: "",
      permisoadmin: "",
      pais: "",
    });
  };

  const handleModalChange = (event, field) => {
    const { value, checked } = event.target;
    if (event.target.type === "checkbox") {
      setModalValues((prevValues) => ({
        ...prevValues,
        [field]: checked ? 1 : 2,
      }));
    } else {
      setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
    }
  };

  const SaveModal = () => {
    const newErrors = {
      nombrerol: "",
      desrol: "",
      permisoconsultar: "",
      permisoinsertar: "",
      permisoeditar: "",
      permisoadmin: "",
      pais: "",
    };

    if (!modalValues.nombrerol.trim()) {
      newErrors.nombrerol = "El nombre del rol es obligatorio.";
    }

    if (!modalValues.desrol.trim()) {
      newErrors.desrol = "La descripción del rol es un campo obligatorio.";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      // Ingresar un rol y permiso
      console.log("Nuevo puesto:", modalValues.codempleado);
      const updatedRecords = [
        ...records,
        {
          id: records.length + 1,
          nombrerol: modalValues.nombrerol,
          desrol: modalValues.desrol,
          permisoconsultar: modalValues.permisoconsultar,
          permisoinsertar: modalValues.permisoinsertar,
          permisoeditar: modalValues.permisoeditar,
          permisoadmin: modalValues.permisoadmin,
          pais: modalValues.pais,
        },
      ];
      setRecords(updatedRecords);
      setShowModal(false); // Ocultar el modal después de guardar
      setModalValues({
        nombrerol: "",
        desrol: "",
        permisoconsultar: "",
        permisoinsertar: "",
        permisoeditar: "",
        permisoadmin: "",
        pais: "",
      }); // Limpiar los valores del modal
    }
  };

  const handleEditChange = (event, field) => {
    const { value } = event.target;
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    validateInput(field, value);
  };

  const validateInput = (field, value) => {
    let newErrors = { ...errors };
    if (field === "nombrerol") {
      if (!value.trim()) {
        newErrors.nombrerol = "El nombre del rol es obligatorio.";
      } else {
        newErrors.nombrerol = "";
      }
    } else if (field === "desrol") {
      if (!value.trim()) {
        newErrors.desrol = "La descripcion del rol es obligatoria.";
      } else {
        newErrors.desrol = "";
      }
    }
    setErrors(newErrors);
  };

  const filteredData = records.filter((row) => {
    return (
      (filters.nombrerol === "" ||
        row.nombrerol
          .toLowerCase()
          .includes(filters.nombrerol.toLowerCase())) &&
      (filters.desrol === "" ||
        row.desrol.toLowerCase().includes(filters.desrol.toLowerCase()))
    );
  });

  const resetFilters = () => {
    setFilters({
      nombrerol: "",
      desrol: "",
      permisoconsultar: "",
      permisoinsertar: "",
      permisoeditar: "",
      permisoadmin: "",
      pais: "",
    });
  };

  const SaveEditModal = () => {
    // Lógica para guardar los cambios del rol y permisos
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleModalEdit = (field, value) => {
    setEditedRowData({ ...editedRowData, [field]: value });
  };

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>Roles y Permisos</Title>
            <ButtonGroup>
              <SearchButton primary onClick={toggleFilters}>
                <FaSearch />
                {showFilters ? "Ocultar" : "Buscar"}
              </SearchButton>
              <Button onClick={handleInsert}>
                <FaPlus />
                Nuevo Rol
              </Button>
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
            <FilterInput
              type="text"
              value={filters.nombrerol}
              onChange={(e) => handleFilterChange(e, "nombrerol")}
              placeholder="Nombre del Rol"
            />
            <FilterInput
              type="text"
              value={filters.desrol}
              onChange={(e) => handleFilterChange(e, "desrol")}
              placeholder="Descripción del Rol"
            />

            <RedButton onClick={resetFilters}>
              <FaUndo /> Limpiar Filtros
            </RedButton>
          </FilterWrapper>
          <StyledDataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={30}
            noHeader
          />
        </DataTableContainer>
      </ContentContainer>

      {/* Modal para insertar una nuevo rol y permisos */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Rol</ModalTitle>
            <ModalInput
              type="text"
              value={modalValues.nombrerol}
              onChange={(e) => handleModalChange(e, "nombrerol")}
              placeholder="Nombre del Rol"
              error={errors.nombrerol}
              required
            />
            {errors.nombrerol && (
              <ErrorMessage>{errors.nombrerol}</ErrorMessage>
            )}

            <ModalInput
              type="text"
              value={modalValues.desrol}
              onChange={(e) => handleModalChange(e, "desrol")}
              placeholder="Descripción del Rol"
              error={errors.desrol}
              required
            />
            {errors.desrol && <ErrorMessage>{errors.desrol}</ErrorMessage>}
            <h3>Permisos por País</h3>
            <StyledMultiselect
              isObject={false}
              placeholder="Seleccione uno o mas paises"
              emptyRecordMsg="No hay mas opciones"
              hidePlaceholder={true}
              onKeyPressFn={function noRefCheck() {}}
              onRemove={function noRefCheck() {}}
              onSearch={function noRefCheck() {}}
              onSelect={function noRefCheck() {}}
              options={["Honduras", "Guatemala", "Panama", "Nicaragua"]} //options={pais}
              selected={editedRowData.pais || []}
              onChange={(values) =>
                handleModalEdit({ target: { value: values } }, "pais")
              }
            />
            <h3>Permisos</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ width: 200, textAlign: "left" }}>
                  Permiso de Consultar
                </span>
                <ModalInput
                  type="checkbox"
                  checked={modalValues.permisoconsultar === 1}
                  onChange={(e) => handleModalChange(e, "permisoconsultar")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ width: 200, textAlign: "left" }}>
                  Permiso de Insertar
                </span>
                <ModalInput
                  type="checkbox"
                  checked={modalValues.permisoinsertar === 1}
                  onChange={(e) => handleModalChange(e, "permisoinsertar")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ width: 200, textAlign: "left" }}>
                  Permiso de Editar
                </span>
                <ModalInput
                  type="checkbox"
                  checked={modalValues.permisoeditar === 1}
                  onChange={(e) => handleModalChange(e, "permisoeditar")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ width: 200, textAlign: "left" }}>
                  Permiso de Administrador
                </span>
                <ModalInput
                  type="checkbox"
                  checked={modalValues.permisoadmin === 1}
                  onChange={(e) => handleModalChange(e, "permisoadmin")}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>
            <div>
              <ModalButtonGroup>
                <GuardarButton onClick={SaveModal}>
                  <FaSave /> Guardar
                </GuardarButton>
                <ModalButton cancel onClick={handleCloseModal}>
                  <FaTimes /> Cancelar
                </ModalButton>
              </ModalButtonGroup>
            </div>
          </ModalWrapper>
        </ModalBackground>
      )}

      {/* Modal para editar un rol y permisos */}
      {showEditModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Editar Rol</ModalTitle>
            <ModalInput
              type="text"
              value={editedRowData.nombrerol || ""}
              onChange={(e) => handleModalEdit("nombrerol", e.target.value)}
              placeholder="Nombre del Rol"
              error={errors.nombrerol}
              required
            />
            {errors.nombrerol && (
              <ErrorMessage>{errors.nombrerol}</ErrorMessage>
            )}

            <ModalInput
              type="text"
              value={editedRowData.desrol || ""}
              onChange={(e) => handleModalEdit("desrol", e.target.value)}
              placeholder="Descripción del Rol"
              error={errors.desrol}
              required
            />
            {errors.desrol && <ErrorMessage>{errors.desrol}</ErrorMessage>}

            <h3>Permisos por País</h3>
            <StyledMultiselect
              isObject={false}
              placeholder="Seleccione uno o mas paises"
              emptyRecordMsg="No hay mas opciones"
              hidePlaceholder={true}
              onKeyPressFn={function noRefCheck() {}}
              onRemove={function noRefCheck() {}}
              onSearch={function noRefCheck() {}}
              onSelect={function noRefCheck() {}}
              options={["Honduras", "Guatemala", "Panama", "Nicaragua"]} //options={pais}
              value={editedRowData.pais || []}
              selectedValues={selectedCountries}
              onChange={(values) =>
                handleModalEdit({ target: { value: values } }, "pais")
              }
            />
            <h3>Permisos</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ width: 200, textAlign: "left" }}>
                  Permiso de Consultar
                </span>
                <ModalInput
                  type="checkbox"
                  checked={!!editedRowData.permisoconsultar} // Convert to boolean
                  onChange={(e) => {
                    handleModalEdit(
                      "permisoconsultar",
                      e.target.checked ? 1 : 0
                    ); // Update value
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ width: 200, textAlign: "left" }}>
                  Permiso de Insertar
                </span>
                <ModalInput
                  type="checkbox"
                  checked={!!editedRowData.permisoinsertar} // Convert to boolean
                  onChange={(e) => {
                    handleModalEdit(
                      "permisoinsertar",
                      e.target.checked ? 1 : 0
                    ); // Update value
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ width: 200, textAlign: "left" }}>
                  Permiso de Editar
                </span>
                <ModalInput
                  type="checkbox"
                  checked={!!editedRowData.permisoeditar} // Convert to boolean
                  onChange={(e) => {
                    handleModalEdit("permisoeditar", e.target.checked ? 1 : 0); // Update value
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ width: 200, textAlign: "left" }}>
                  Permiso de Administrador
                </span>
                <ModalInput
                  type="checkbox"
                  checked={!!editedRowData.permisoadmin} // Convert to boolean
                  onChange={(e) => {
                    handleModalEdit("permisoadmin", e.target.checked ? 1 : 0); // Update value
                  }}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>
            <div>
              <ModalButtonGroup>
                <GuardarButton onClick={SaveEditModal}>
                  <FaSave /> Guardar
                </GuardarButton>
                <ModalButton cancel onClick={handleCloseEditModal}>
                  <FaTimes /> Cancelar
                </ModalButton>
              </ModalButtonGroup>
            </div>
          </ModalWrapper>
        </ModalBackground>
      )}
    </MainContainer>
  );
}
export default RolesyPermisos;
