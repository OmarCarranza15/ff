import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import styled from "styled-components";
import "../styles/error.css";
import "../styles/DataTable.css"; // Importa el archivo CSS
import axios from "axios";
import Select from "react-select";
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
  width: 55%;
  position: relative;
  margin: center;
  margin: 0% 20%;

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

function Aplicacion() {
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [ambiente, setAmbiente] = useState([]);
  const [errors, setErrors] = useState({
    pais: "",
    aplicacion: "",
    ambiente: "",
  }); //validaciones para insertar una nueva razon social
  const [modalValues, setModalValues] = useState({
    ID_Pais: "",
    aplicacion: "",
    Ambientes: [],
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    N_Aplicaciones: "",
    N_Pais: "",
    N_Ambiente: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/aplicacion/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (aplicacion) => {
            const paisResponse = await axios.get(
              `http://localhost:3000/pais/${aplicacion.ID_Pais}`
            );

            const ambienteIds = aplicacion.Ambientes.split(",").map(Number);
            const ambienteNombres = await Promise.all(
              ambienteIds.map(async (id) => {
                const ambienteResponse = await axios.get(
                  `http://localhost:3000/ambiente/${id}`
                );
                return ambienteResponse.data.N_Ambiente;
              })
            );
            return {
              id: aplicacion.id,
              N_Aplicaciones: aplicacion.N_Aplicaciones,
              ID_Pais: aplicacion.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
              Ambientes: ambienteNombres,
            };
          })
        );
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los Ambientes:", error);
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
    const fetchAmbiente = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/ambiente/`);
        setAmbiente(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de ambientes", error);
      }
    };

    fetchData();
    fetchPais();
    fetchAmbiente();
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
    setModalValues({ pais: "", aplicacion: "", Ambientes: [] });
    setErrors({ pais: "", aplicacion: "", Ambientes: "" });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  /*const handleModalAmbienteChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setModalValues((prevValues) => ({ ...prevValues, Ambientes: selectedOptions }));
  };*/

  const SaveModal = async () => {
    const newErrors = { pais: "", aplicacion: "", ambientes: "" };

    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo Pais es obligatorio";
    }
    if (!modalValues.Ambientes.length) {
      newErrors.ambientes = "El campo Ambiente es obligatorio";
    }

    if (!modalValues.aplicacion.trim()) {
      newErrors.aplicacion = "El campo aplicacion es obligatorio";
    }
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        const response = await axios.get(`http://localhost:3000/aplicacion`);
        const aplicacionExists = response.data.some(
          (aplicacion) =>
            aplicacion.ID_Pais === parseInt(modalValues.ID_Pais) &&
            aplicacion.N_Aplicaciones.toLowerCase() ===
              modalValues.aplicacion.toLowerCase()
        );
        if (aplicacionExists) {
          setErrors({ aplicacion: "La aplicación ya existe en este país" });
          return;
        }

        const newAplicacion = {
          N_Aplicaciones: modalValues.aplicacion,
          ID_Pais: modalValues.ID_Pais,
          Ambientes: modalValues.Ambientes.join(","),
        };
        const insertResponse = await axios.post(
          `http://localhost:3000/aplicacion`,
          newAplicacion
        );

        const paisResponse = await axios.get(
          `http://localhost:3000/pais/${modalValues.ID_Pais}`
        );
        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            N_Aplicaciones: modalValues.aplicacion,
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
            Ambientes: modalValues.Ambientes.map(
              (id) => ambiente.find((a) => a.id === id)?.N_Ambiente
            ),
          },
        ];
        setRecords(updatedRecords);
        setShowModal(false);
        setModalValues({ ID_Pais: "", aplicacion: "", Ambientes: [] });
        // Estilo de notificacion
        const toastElement = document.createElement("div");
        toastElement.className = "toast-success";
        toastElement.innerHTML = "¡Aplicación insertada correctamente!";

        document.body.appendChild(toastElement);

        // Ocultar la notificacion luego de 1 segundo
        setTimeout(() => {
          toastElement.remove();
          window.location.reload(); // Recargar la pagina despues de 1 segundos
        }, 1000);
      } catch (error) {
        console.error("Error al insertar un nuevo Ambiente:", error);
      }
    }
  };

  const startEdit = (row) => {
    const ambienteIds = row.Ambientes.map((nombre) => {
      const ambienteObj = ambiente.find((a) => a.N_Ambiente === nombre);
      return ambienteObj ? ambienteObj.id : null;
    }).filter((id) => id !== null);

    setEditedRow({ ...row, Ambientes: ambienteIds });
    setEditMode(row.id);
  };

  const handleEditChange = (event, field) => {
    if (field === "Ambientes") {
      const selectedOptions = Array.from(
        event.target.selectedOptions,
        (option) => option.value
      );
      setEditedRow((prevState) => ({
        ...prevState,
        Ambientes: selectedOptions,
      }));
    } else {
      const { value } = event.target;
      setEditedRow((prevState) => ({
        ...prevState,
        [field]: value,
        ...(field === "ID_Pais" && {
          N_Pais: pais.find((p) => p.id === parseInt(value)).N_Pais,
        }),
      }));
      validateInput(field, value);
    }
  };

  const validateInput = (field, value) => {
    let newErrors = { ...errors };
    if (field === "pais") {
      if (!value.trim()) {
        newErrors.pais = "El campo Pais es obligatorio";
      } else {
        newErrors.pais = "";
      }
    } else if (field === "ambiente") {
      if (!value.trim()) {
        newErrors.ambiente = "El campo Ambiente es obligatorio";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.ambiente =
          "El campo Ambiente solo acepta letras y espacios en blanco";
      } else {
        newErrors.ambiente = "";
      }
    } else if (field === "aplicacion") {
      if (!value.trim()) {
        newErrors.aplicacion = "El campo Aplicacion es obligatorio";
      } else {
        newErrors.aplicacion = "";
      }
    }
    setErrors(newErrors);
  };

  const saveChanges = async (id) => {
    try {
      const updateRow = {
        ...editedRow,
        Ambientes: editedRow.Ambientes.join(", "),
      };
      // Verificar si la aplicación ya existe en la base de datos para el mismo país
      if (editedRow && editedRow.ID_Pais && editedRow.N_Aplicaciones) {
        const response = await axios.get(`http://localhost:3000/aplicacion`);
        console.log("Response:", response.data);

        const aplicacionExists = response.data.some((division) => {
          if (
            division.ID_Pais === parseInt(editedRow.ID_Pais) &&
            division.id !== id
          ) {
            const editedAplicacionName = editedRow.N_Aplicaciones
              ? editedRow.N_Aplicaciones.toLowerCase()
              : "";
            return (
              division.N_Aplicaciones.toLowerCase() === editedAplicacionName
            );
          }
          return false;
        });

        if (aplicacionExists) {
          setErrors({ division: "La aplicaciónX ya existe en este país" });

          const errorNotification = document.createElement("div");
          errorNotification.className = "error-notification";
          errorNotification.innerHTML = `
            <span class="error-icon">!</span>
            <span class="error-message">
              La aplicación que intenta registrar ya existe en la base de datos para este país.
              Por favor, ingrese una aplicación diferente.
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

      await axios.put(`http://localhost:3000/aplicacion/${id}`, updateRow);

      const updatedRecords = records.map((row) =>
        row.id === id ? { ...editedRow } : row
      );

      //setRecords(updatedRecordsPuesto);
      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);

      console.log("Cambios guardados correctamente");
      window.location.reload();
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
      (filters.N_Aplicaciones === "" ||
        row.N_Aplicaciones.toLowerCase().includes(
          filters.N_Aplicaciones.toLowerCase()
        )) &&
      (filters.N_Ambiente === "" ||
        row.N_Ambiente.toLowerCase().includes(filters.N_Ambiente.toLowerCase()))
    );
  });

  const resetFilters = () => {
    setFilters({
      N_Aplicaciones: "",
      N_Pais: "",
      N_Ambiente: "",
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
      name: "Pais",
      selector: (row) => row.N_Pais,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "100px", // Ajusta el tamaño máximo según sea necesario
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
      name: "Aplicacion",
      selector: (row) => row.N_Aplicaciones,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "100px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.N_Aplicaciones}
            onChange={(e) => handleEditChange(e, "N_Aplicaciones")}
          />
        ) : (
          <div>{row.N_Aplicaciones}</div>
        ),
    },
    {
      name: "Ambientes",
      selector: (row) => row.Ambientes.join(", "),
      sortable: true,
      minWidth: "200px",
      maxWidth: "100px",
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <Select
            isMulti
            value={editedRow.Ambientes.map((id) => ({
              value: id,
              label: ambiente.find((a) => a.id === id)?.N_Ambiente,
            }))}
            options={ambiente.map((a) => ({
              value: a.id,
              label: a.N_Ambiente,
            }))}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions.map(
                (option) => option.value
              );
              setEditedRow((prevState) => ({
                ...prevState,
                Ambientes: selectedValues,
              }));
            }}
          />
        ) : (
          <div>{row.Ambientes.join(", ")}</div>
        ),
    },
    {
      name: "Acciones",
      cell: (row) =>
        editMode === row.id ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
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
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
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
          </div>
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
            <Title>Aplicaciones</Title>
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
                Nuva Aplicación
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
              value={filters.N_Aplicaciones}
              onChange={(e) => handleFilterChange(e, "N_Aplicaciones")}
              placeholder="Buscar por Aplicacion"
            />
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
              paginationPerPage={30}
              showFilters={showFilters}
              customStyles={customStyles}
            />
          )}
        </DataTableContainer>
      </ContentContainer>
      {/* Modal para insertar una nueva aplicacion */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nueva Aplicación</ModalTitle>
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
            <Select
              isMulti
              value={modalValues.Ambientes.map((id) => ({
                value: id,
                label: ambiente.find((a) => a.id === id)?.N_Ambiente,
              }))}
              options={ambiente.map((a) => ({
                value: a.id,
                label: a.N_Ambiente,
              }))}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map(
                  (option) => option.value
                );
                setModalValues((prevValues) => ({
                  ...prevValues,
                  Ambientes: selectedValues,
                }));
              }}
              placeholder="Selecciona Ambientes"
            />
            {errors.ambientes && (
              <ErrorMessage>{errors.ambientes}</ErrorMessage>
            )}
            <div style={{ margin: "15px" }} />

            <label style={{ width: "100%", display: "block" }}>
              <span style={{ textAlign: "left" }}>
                Nombre de la Aplicación:
              </span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.aplicacion}
              onChange={(e) => handleModalChange(e, "aplicacion")}
              placeholder="Aplicacion"
              error={errors.aplicacion}
              required
            />
            {errors.aplicacion && (
              <ErrorMessage>{errors.aplicacion}</ErrorMessage>
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

export default Aplicacion;
