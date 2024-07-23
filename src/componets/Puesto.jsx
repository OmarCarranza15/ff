
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import "../styles/error.css";
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

// eslint-disable-next-line
function Puesto() {
  const [puesto] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [rsocial, setRsocial] = useState([]);
  const [division, setDivision] = useState([]);
  const [departamento, setDepartamento] = useState([]);
  const [centrocosto, setCentrocostos] = useState([]);
  const [errors, setErrors] = useState({
    ID_Pais: "",
    Codigo: "",
    N_Puesto: "",
    ID_RSocial: "",
    ID_Division: "",
    ID_Departamento: "",
    ID_CentroCostos: "",
  });
  const [modalValues, setModalValues] = useState({
    ID_Pais: "",
    Codigo: "",
    N_Puesto: "",
    ID_RSocial: "",
    ID_Division: "",
    ID_Departamento: "",
    ID_CentroCostos: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredRsocial, setFilteredRsocial] = useState([]);
  const [filteredDivision, setFilteredDivision] = useState([]);
  const [filteredDepartamento, setFilteredDepartamento] = useState([]);
  const [filteredCentroCosto, setFilteredCentroCosto] = useState([]);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    N_Puesto: "",
    Codigo: "",
    N_Pais: "",
    N_RSocial: "",
    N_Division: "",
    N_Departamento: "",
    Nombre: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/puesto/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (puesto) => {
            const paisResponse = await axios.get(
              `http://localhost:3000/pais/${puesto.ID_Pais}`
            );
            const rsocialResponse = await axios.get(
              `http://localhost:3000/rsocial/${puesto.ID_RSocial}`
            );
            const divisionResponse = await axios.get(
              `http://localhost:3000/division/${puesto.ID_Division}`
            );
            const departamentoResponse = await axios.get(
              `http://localhost:3000/departamento/${puesto.ID_Departamento}`
            );
            const centrocostoResponse = await axios.get(
              `http://localhost:3000/centrocosto/${puesto.ID_CentroCostos}`
            );

            return {
              id: puesto.id,
              N_Puesto: puesto.N_Puesto,
              Codigo: puesto.Codigo,
              ID_Pais: puesto.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
              ID_RSocial: puesto.ID_RSocial,
              N_RSocial: rsocialResponse.data.N_RSocial,
              ID_Division: puesto.ID_Division,
              N_Division: divisionResponse.data.N_Division,
              ID_Departamento: puesto.ID_Departamento,
              N_Departamento: departamentoResponse.data.N_Departamento,
              ID_CentroCostos: puesto.ID_CentroCostos,
              Nombre: centrocostoResponse.data.Nombre,
            };
          })
        );
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los Puestos:", error);
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
    const fetchRsocial = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/rsocial/`);
        setRsocial(response.data);
        if (modalValues.ID_Pais) {
          const filtered = response.data.filter(
            (item) => item.ID_Pais === parseInt(modalValues.ID_Pais)
          );
          setFilteredRsocial(filtered);
        }
      } catch (error) {
        console.error("Error al obtener la lista de razones sociales", error);
      }
    };

    const fetchDivision = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/division/`);
        setDivision(response.data);
        if (modalValues.ID_Pais) {
          const filtered = response.data.filter(
            (item) => item.ID_Pais === parseInt(modalValues.ID_Pais)
          );
          setFilteredDivision(filtered);
        }
      } catch (error) {
        console.error("Error al obtener la lista de division", error);
      }
    };
    const fetchDepartamento = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/departamento/`);
        setDepartamento(response.data);
        if (modalValues.ID_Pais) {
          const filtered = response.data.filter(
            (item) => item.ID_Pais === parseInt(modalValues.ID_Pais)
          );
          setFilteredDepartamento(filtered);
        }
      } catch (error) {
        console.error("Error al obtener la lista de departamentos", error);
      }
    };

    const fetchCentrocostos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/centrocosto/`);
        setCentrocostos(response.data);
        if (modalValues.ID_Pais) {
          const filtered = response.data.filter(
            (item) => item.ID_Pais === parseInt(modalValues.ID_Pais)
          );
          setFilteredCentroCosto(filtered);
        }
      } catch (error) {
        console.error("Error al obtener la lista de centro de costos", error);
      }
    };

    fetchData();
    fetchPais();
    fetchRsocial();
    fetchDivision();
    fetchDepartamento();
    fetchCentrocostos();
  }, [modalValues.ID_Pais]);

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
      ID_Pais: "",
      Codigo: "",
      N_Puesto: "",
      ID_RSocial: "",
      ID_Division: "",
      ID_Departamento: "",
      ID_CentroCostos: "",
    });
    setErrors({
      ID_Pais: "",
      Codigo: "",
      N_Puesto: "",
      ID_RSocial: "",
      ID_Division: "",
      ID_Departamento: "",
      ID_CentroCostos: "",
    });
  };

  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));

    /*if (field === "ID_Pais") {
      const filtered = rsocial.filter((item) => item.ID_Pais === parseInt(value));
      setFilteredRsocial(filtered);
    }*/
  };

  const SaveModal = async () => {
    const newErrors = {
      ID_Pais: "",
      Codigo: "",
      N_Puesto: "",
      ID_RSocial: "",
      ID_Division: "",
      ID_Departamento: "",
      ID_CentroCostos: "",
    };

    // Validación de campos
    if (!modalValues.ID_Pais) {
      newErrors.pais = "El campo País es obligatorio";
    }
    if (!modalValues.ID_RSocial) {
      newErrors.rsocial = "El campo Razon Social es obligatorio";
    }
    if (!modalValues.ID_Division) {
      newErrors.division = "El campo Division es obligatorio";
    }
    if (!modalValues.ID_Departamento) {
      newErrors.departamento = "El campo Departamento es obligatorio";
    }
    if (!modalValues.ID_CentroCostos) {
      newErrors.centrocosto = "El campo Centro de Costos es obligatorio";
    }

    if (!modalValues.Codigo.trim()) {
      newErrors.Codigo = "El campo Código es obligatorio";
    } else if (!/^\d+$/.test(modalValues.Codigo)) {
      newErrors.Codigo = "Solo se aceptan Dígitos";
    }

    if (!modalValues.N_Puesto.trim()) {
      newErrors.N_Puesto = "El campo Nombre es obligatorio";
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.N_Puesto)) {
      newErrors.N_Puesto =
        "El campo Nombre solo acepta letras y espacios en blanco";
    }

    setErrors(newErrors);

    // Si no hay errores, proceder a insertar el nuevo puesto
    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el puesto ya existe en la base de datos
        console.log("Verificando si el puesto ya existe...");
        const response = await axios.get(`http://localhost:3000/puesto`);
        console.log("Datos recibidos del servidor:", response.data);

        const puestos = response.data;

        const nombreExistente = puestos.some(
          (puesto) =>
            puesto.N_Puesto.toLowerCase() === modalValues.N_Puesto.toLowerCase()
        );
        const codigoExistente = puestos.some(
          (puesto) => puesto.Codigo.toString() === modalValues.Codigo
        );

        if (nombreExistente || codigoExistente) {
          const errorMessages = {};
          if (nombreExistente) {
            errorMessages.N_Puesto = "El nombre del puesto ya existe";
          }
          if (codigoExistente) {
            errorMessages.Codigo = "El codigo del puesto ya existe";
          }
          setErrors({ ...newErrors, ...errorMessages });
          return;
        }

        // Datos del nuevo puesto
        const newPuesto = {
          N_Puesto: modalValues.N_Puesto,
          Codigo: parseInt(modalValues.Codigo, 10),
          ID_Pais: modalValues.ID_Pais,
          ID_Division: modalValues.ID_Division,
          ID_Departamento: modalValues.ID_Departamento,
          ID_CentroCostos: modalValues.ID_CentroCostos,
          ID_RSocial: modalValues.ID_RSocial,
        };

        console.log("Enviando datos:", newPuesto);

        // Enviar solicitud POST para insertar el nuevo puesto
        const insertResponse = await axios.post(
          `http://localhost:3000/puesto`,
          newPuesto
        );
        console.log("Respuesta de inserción:", insertResponse.data);

        // Actualizar la lista de puestos con el nuevo puesto
        const paisResponse = await axios.get(
          `http://localhost:3000/pais/${modalValues.ID_Pais}`
        );
        const divisionResponse = await axios.get(
          `http://localhost:3000/division/${modalValues.ID_Division}`
        );
        const departamentoResponse = await axios.get(
          `http://localhost:3000/departamento/${modalValues.ID_Departamento}`
        );
        const centrocostoResponse = await axios.get(
          `http://localhost:3000/centrocosto/${modalValues.ID_CentroCostos}`
        );
        const rsocialResponse = await axios.get(
          `http://localhost:3000/rsocial/${modalValues.ID_RSocial}`
        );

        console.log("Datos de respuesta para actualizar la UI:", {
          paisResponse: paisResponse.data,
          divisionResponse: divisionResponse.data,
          departamentoResponse: departamentoResponse.data,
          centrocostoResponse: centrocostoResponse.data,
          rsocialResponse: rsocialResponse.data,
        });

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            N_Puesto: modalValues.N_Puesto,
            Codigo: parseInt(modalValues.Codigo, 10),
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
            ID_Division: modalValues.ID_Division,
            N_Division: divisionResponse.data.N_Division,
            ID_Departamento: modalValues.ID_Departamento,
            N_Departamento: departamentoResponse.data.N_Departamento,
            ID_CentroCostos: modalValues.ID_CentroCostos,
            Nombre: centrocostoResponse.data.Nombre,
            ID_RSocial: modalValues.ID_RSocial,
            N_RSocial: rsocialResponse.data.N_RSocial,
          },
        ];

        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({
          ID_Pais: "",
          Codigo: "",
          N_Puesto: "",
          ID_RSocial: "",
          ID_Division: "",
          ID_Departamento: "",
          ID_CentroCostos: "",
        }); // Limpiar los valores del modal

        // Estilo de notificacion
        const toastElement = document.createElement("div");
        toastElement.className = "toast-success";
        toastElement.innerHTML = "¡Puesto incertado correctamente!";

        document.body.appendChild(toastElement);

        // Ocultar la notificacion luego de 1 segundo
        setTimeout(() => {
          toastElement.remove();
          window.location.reload(); // Recargar la pagina despues de 1 segundos
        }, 1000);
      } catch (error) {
        console.error("Error al insertar un nuevo Puesto:", error);
      }
    }
  };

  const startEdit = (row) => {
    setEditedRow({ ...row });
    setEditMode(row.id);

    // Filtrar razón social según el país seleccionado
    const filteredRsocial = rsocial.filter(
      (item) => item.ID_Pais === row.ID_Pais
    );
    setFilteredRsocial(filteredRsocial);

    // Filtrar división según el país seleccionado
    const filteredDivision = division.filter(
      (item) => item.ID_Pais === row.ID_Pais
    );
    setFilteredDivision(filteredDivision);

    // Filtrar departamento según el país seleccionado
    const filteredDepartamento = departamento.filter(
      (item) => item.ID_Pais === row.ID_Pais
    );
    setFilteredDepartamento(filteredDepartamento);

    // Filtrar centro de costos según el país seleccionado
    const filteredCentroCosto = centrocosto.filter(
      (item) => item.ID_Pais === row.ID_Pais
    );
    setFilteredCentroCosto(filteredCentroCosto);
  };

  const handleEditChange = (event, field) => {
    const { value } = event.target;
    if (field === "ID_Pais") {
      const filtered = rsocial.filter(
        (item) => item.ID_Pais === parseInt(value)
      );
      setFilteredRsocial(filtered);

      const filteredDiv = division.filter(
        (item) => item.ID_Pais === parseInt(value)
      );
      setFilteredDivision(filteredDiv);

      const filteredDep = departamento.filter(
        (item) => item.ID_Pais === parseInt(value)
      );
      setFilteredDepartamento(filteredDep);

      const filteredCC = centrocosto.filter(
        (item) => item.ID_Pais === parseInt(value)
      );
      setFilteredCentroCosto(filteredCC);
    }
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === "ID_Pais" && {
        N_Pais: pais.find((p) => p.id === parseInt(value)).N_Pais,
      }),
      ...(field === "ID_Puesto" && {
        N_Puesto: puesto.find((p) => p.id === parseInt(value)).N_Puesto,
      }),
      ...(field === "ID_Puesto" && {
        Codigo: puesto.find((p) => p.id === parseInt(value)).Codigo,
      }),
      ...(field === "ID_RSocial" && {
        N_RSocial: filteredRsocial.find((p) => p.id === parseInt(value))
          .N_RSocial,
      }),
      ...(field === "ID_Division" && {
        N_Division: filteredDivision.find((p) => p.id === parseInt(value))
          .N_Division,
      }),
      ...(field === "ID_Departamento" && {
        N_Departamento: filteredDepartamento.find(
          (p) => p.id === parseInt(value)
        ).N_Departamento,
      }),
      ...(field === "ID_CentroCostos" && {
        Nombre: filteredCentroCosto.find((p) => p.id === parseInt(value))
          .Nombre,
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
    } else if (field === "ID_RSocial") {
      if (!value.trim()) {
        newErrors.ID_RSocial = "El campo Razin social es obligatorio";
      } else {
        newErrors.ID_RSocial = "";
      }
    } else if (field === "ID_Division") {
      if (!value.trim()) {
        newErrors.ID_Division = "El campo Division es obligatorio";
      } else {
        newErrors.ID_Division = "";
      }
    } else if (field === "ID_Departamento") {
      if (!value.trim()) {
        newErrors.ID_Departamento = "El campo Departamento es obligatorio";
      } else {
        newErrors.ID_Departamento = "";
      }
    } else if (field === "ID_CentroCostos") {
      if (!value.trim()) {
        newErrors.ID_CentroCostos = "El campo Centro de Costos es obligatorio";
      } else {
        newErrors.ID_CentroCostos = "";
      }
    } else if (field === "Codigo") {
      if (!value.trim()) {
        newErrors.Codigo = "El campo Código es obligatorio";
      } else if (!/^\d+$/.test(value)) {
        newErrors.Codigo = "Solo se aceptan Digitos";
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

      if (editedRow && editedRow.Codigo && editedRow.N_Puesto) {
        const response = await axios.get(`http://localhost:3000/puesto`);
        console.log("Response:", response.data);

        const puestoExists = response.data.some((puesto) => {
          if (
            puesto.ID_Pais === parseInt(editedRow.ID_Pais) &&
            puesto.id !== id
          ) {
            const editedPuestoName = editedRow.N_Puesto
              ? editedRow.N_Puesto.toLowerCase()
              : "";
            let editedCodigo = "";
            if (typeof editedRow.Codigo === "string") {
              editedCodigo = editedRow.Codigo.toLowerCase();
            } else {
              editedCodigo = editedRow.Codigo.toString();
            }
            return (
              puesto.N_Puesto.toLowerCase() === editedPuestoName &&
              puesto.Codigo.toString() === editedCodigo
            );
          }
          return false;
        });

        if (puestoExists) {
          setErrors({ puesto: "El puesto ya existe." });

          const errorNotification = document.createElement("div");
          errorNotification.className = "error-notification";
          errorNotification.innerHTML = `
            <span class="error-icon">!</span>
            <span class="error-message">
              El Puesto que intenta registrar ya existe en la base de datos para este país.
              Por favor, ingrese un puesto diferente.
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
      // Check if the Codigo field contains only digits
      if (/[^0-9]/.test(editedRow.Codigo)) {
        // Display an error message
        alert("El campo Código solo acepta digitos.");
        return;
      }

      await axios.put(`http://localhost:3000/puesto/${id}`, updateRow);

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
      (filters.N_Departamento === "" ||
        row.N_Departamento.toLowerCase().includes(
          filters.N_Departamento.toLowerCase()
        )) &&
      (filters.Nombre === "" ||
        row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())) &&
      (filters.N_RSocial === "" ||
        row.N_RSocial.toLowerCase().includes(
          filters.N_RSocial.toLowerCase()
        )) &&
      (filters.N_Division === "" ||
        row.N_Division.toLowerCase().includes(
          filters.N_Division.toLowerCase()
        )) &&
      (filters.Codigo === "" ||
        row.Codigo.toString()
          .toLowerCase()
          .includes(filters.Codigo.toLowerCase())) &&
      (filters.N_Puesto === "" ||
        row.N_Puesto.toLowerCase().includes(filters.N_Puesto.toLowerCase()))
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
      name: "Pais",
      selector: (row) => row.N_Pais,
      sortable: true,
      minWidth: "100px", // Ajusta el tamaño mínimo según sea necesario
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
      name: "Razon Social",
      selector: (row) => row.N_RSocial,
      sortable: true,
      minWidth: "240px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledSelect
            value={editedRow.ID_RSocial}
            onChange={(e) => handleEditChange(e, "ID_RSocial")}
          >
            <option value="">Seleccione una Razon Social</option>
            {filteredRsocial.map((rsocial) => (
              <option key={rsocial.id} value={rsocial.id}>
                {rsocial.N_RSocial}
              </option>
              
            ))}
          </StyledSelect>
        ) : (
          <div>{row.N_RSocial}</div>
        ),
    },
    {
      name: "Division",
      selector: (row) => row.N_Division,
      sortable: true,
      minWidth: "220px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledSelect
            value={editedRow.ID_Division}
            onChange={(e) => handleEditChange(e, "ID_Division")}
          >
            <option value="">Seleccione una Division</option>
            {filteredDivision.map((division) => (
              <option key={division.id} value={division.id}>
                {division.N_Division}
              </option>
            ))}
          </StyledSelect>
        ) : (
          <div>{row.N_Division}</div>
        ),
    },
    {
      name: "Departamento",
      selector: (row) => row.N_Departamento,
      sortable: true,
      minWidth: "250px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledSelect
            value={editedRow.ID_Departamento}
            onChange={(e) => handleEditChange(e, "ID_Departamento")}
          >
            <option value="">Seleccione un Departamento</option>
            {filteredDepartamento.map((departamento) => (
              <option key={departamento.id} value={departamento.id}>
                {departamento.N_Departamento}
              </option>
            ))}
          </StyledSelect>
        ) : (
          <div>{row.N_Departamento}</div>
        ),
    },
    {
      name: "Centro de Coste",
      selector: (row) => row.Nombre,
      sortable: true,
      minWidth: "300px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledSelect
            value={editedRow.ID_CentroCostos}
            onChange={(e) => handleEditChange(e, "ID_CentroCostos")}
          >
            <option value="">Seleccione un Centro de Coste</option>
            {filteredCentroCosto.map((centrocosto) => (
              <option key={centrocosto.id} value={centrocosto.id}>
                {centrocosto.Nombre}
              </option>
            ))}
          </StyledSelect>
        ) : (
          <div>{row.Nombre}</div>
        ),
    },
    {
      name: "Código",
      selector: (row) => row.Codigo,
      sortable: true,
      minWidth: "10px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "2000px", // Ajusta el tamaño máximo según sea necesario
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
      name: "Puesto",
      selector: (row) => row.N_Puesto,
      sortable: true,
      minWidth: "300px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.N_Puesto}
            onChange={(e) => handleEditChange(e, "N_Puesto")}
          />
        ) : (
          <div>{row.N_Puesto}</div>
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
      N_Puesto: "",
      Codigo: "",
      N_Pais: "",
      N_RSocial: "",
      N_Division: "",
      N_Departamento: "",
      Nombre: "",
    });
  };

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>Puestos</Title>
            < ButtonGroup >
              <Button
              //style={{marginLeft}}
                className="btn btn-outline-primary"
                onClick={toggleFilters}
              >
                <FaSearch />
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
              <Button
                style={{marginRight: "30px"}}
                className="btn btn-outline-success"
                onClick={handleInsert}
              >
                <FaPlus />
                Insertar
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
            <FilterInput
              type="text"
              value={filters.N_Division}
              onChange={(e) => handleFilterChange(e, "N_Division")}
              placeholder="Buscar por Division"
            />
            <FilterInput
              type="text"
              value={filters.N_Departamento}
              onChange={(e) => handleFilterChange(e, "N_Departamento")}
              placeholder="Buscar por Departamento"
            />
            <FilterInput
              type="text"
              value={filters.Nombre}
              onChange={(e) => handleFilterChange(e, "Nombre")}
              placeholder="Buscar por Centro de Coste"
            />
            <FilterInput
              type="text"
              value={filters.Codigo}
              onChange={(e) => handleFilterChange(e, "Codigo")}
              placeholder="Buscar por Codigo"
            />
            <FilterInput
              type="text"
              value={filters.N_Puesto}
              onChange={(e) => handleFilterChange(e, "N_Puesto")}
              placeholder="Buscar por Puesto"
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
      {/* Modal para insertar una nuevo departamento */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Puesto</ModalTitle>
            <label style={{ width: "100%", display: "block" }}>
              <span style={{ textAlign: "left" }}>Código del Puesto:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.Codigo}
              onChange={(e) => handleModalChange(e, "Codigo")}
              placeholder="Ingrese el código"
              required
            />
            {errors.Codigo && <ErrorMessage>{errors.Codigo}</ErrorMessage>}

            <div style={{ margin: "15px" }} />

            <label style={{ width: "100%", display: "block" }}>
              <span style={{ textAlign: "left" }}>Nombre del Puesto:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.N_Puesto}
              onChange={(e) => handleModalChange(e, "N_Puesto")}
              placeholder="Ingrese el Puesto"
              error={errors.N_Puesto}
              required
            />
            {errors.N_Puesto && <ErrorMessage>{errors.N_Puesto}</ErrorMessage>}
            <div style={{ margin: "15px" }} />

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
            <select
              class="form-select"
              aria-label="Default select example"
              value={modalValues.ID_RSocial}
              onChange={(e) => handleModalChange(e, "ID_RSocial")}
              error={errors.rsocial}
              required
            >
              <option value="">Seleccione una Razon Social</option>
              {filteredRsocial.map((rsocial) => (
                <option key={rsocial.id} value={rsocial.id}>
                  {rsocial.N_RSocial}
                </option>
              ))}
            </select>
            {errors.rsocial && <ErrorMessage>{errors.rsocial}</ErrorMessage>}
            <div style={{ margin: "15px" }} />
            <select
              class="form-select"
              aria-label="Default select example"
              value={modalValues.ID_Division}
              onChange={(e) => handleModalChange(e, "ID_Division")}
              error={errors.division}
              required
            >
              <option value="">Seleccione una Division</option>
              {filteredDivision.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Division}
                </option>
              ))}
            </select>
            {errors.division && <ErrorMessage>{errors.division}</ErrorMessage>}
            <div style={{ margin: "15px" }} />
            <select
              class="form-select"
              aria-label="Default select example"
              value={modalValues.ID_Departamento}
              onChange={(e) => handleModalChange(e, "ID_Departamento")}
              error={errors.departamento}
              required
            >
              <option value="">Seleccione una Departamento</option>
              {filteredDepartamento.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Departamento}
                </option>
              ))}
            </select>
            {errors.departamento && (
              <ErrorMessage>{errors.departamento}</ErrorMessage>
            )}
            <div style={{ margin: "15px" }} />
            <select
              class="form-select"
              aria-label="Default select example"
              value={modalValues.ID_CentroCostos}
              onChange={(e) => handleModalChange(e, "ID_CentroCostos")}
              error={errors.centrocosto}
              required
            >
              <option value="">Seleccione un Centro de Coste</option>
              {filteredCentroCosto.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.Nombre}
                </option>
              ))}
            </select>
            {errors.centrocosto && (
              <ErrorMessage>{errors.centrocosto}</ErrorMessage>
            )}

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

export default Puesto;
