import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import {
  MainContainer,
  TopBar,
  ContentContainer,
  Sidebar,
  DataTableContainer,
  HeaderContainer,
  Title,
  ButtonGroup,
  Button,
  FilterWrapper,
  FilterInput,
  StyledDataTable,
  ModalBackground,
  ModalWrapper,
  ModalTitle,
  SelectPais,
  ModalInput,
  ModalButtonGroup,
  GuardarButton,
  ModalButton,
  ErrorMessage,
} from "./StyledComponents";

function RazonSocial() {
  const [centrocosto] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [errors, setErrors] = useState({ ID_Pais: "", Codigo: "", Nombre: "" });
  const [modalValues, setModalValues] = useState({ ID_Pais: "", Codigo: "", Nombre: "" });
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    Codigo: "",
    Nombre: "",
    N_Pais: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/centrocosto/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (centrocosto) => {
            const paisResponse = await axios.get(`http://localhost:3000/pais/${centrocosto.ID_Pais}`);
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
      } catch (error) {
        console.error("Error al obtener los Centros de Costos:", error);
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
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const SaveModal = async () => {
    const newErrors = { ID_Pais: "", Codigo: "", Nombre: "" };

    if (!modalValues.ID_Pais) {
      newErrors.ID_Pais = "El campo País es obligatorio";
    }

    if (!modalValues.Codigo.trim()) {
      newErrors.Codigo = "El campo Código es obligatorio";
    }

    if (!modalValues.Nombre.trim()) {
      newErrors.Nombre = "El campo Nombre es obligatorio";
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.Nombre)) {
      newErrors.Nombre = "El campo Nombre solo acepta letras y espacios en blanco";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el centro costo ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/centrocosto`);
        const centrocostoExists = response.data.some(
          (centrocosto) =>
            centrocosto.Nombre.toLowerCase() === modalValues.Nombre.toLowerCase() ||
            centrocosto.Codigo.toLowerCase() === modalValues.Codigo.toLowerCase()
        );

        if (centrocostoExists) {
          setErrors({ ...newErrors, Nombre: "El Centro de Costos ya existe" });
          return;
        }

        // Insertar un nuevo Centro de Costos
        const newCentrocosto = {
          Nombre: modalValues.Nombre,
          Codigo: modalValues.Codigo,
          ID_Pais: modalValues.ID_Pais,
        };
        const insertResponse = await axios.post(`http://localhost:3000/centrocosto`, newCentrocosto);

        // Actualizar la lista de Centro de Costos con el nuevo Centro de Costos
        const paisResponse = await axios.get(`http://localhost:3000/pais/${modalValues.ID_Pais}`);

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            Nombre: modalValues.Nombre,
            Codigo: modalValues.Codigo,
            ID_Pais: modalValues.ID_Pais,
            N_Pais: paisResponse.data.N_Pais,
          },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ ID_Pais: "", Codigo: "", Nombre: "" }); // Limpiar los valores del modal
      } catch (error) {
        console.error("Error al insertar un nuevo Centro de Costos:", error);
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
      ...(field === "ID_CentroCostos" && { Nombre: centrocosto.find((p) => p.id === parseInt(value)).Nombre }),
      ...(field === "ID_CentroCostos" && { Codigo: centrocosto.find((p) => p.id === parseInt(value)).Codigo }),
      ...(field === "ID_Pais" && { N_Pais: pais.find((p) => p.id === parseInt(value)).N_Pais }),
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
        newErrors.Nombre = "El campo Nombre solo acepta letras y espacios en blanco";
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

      await axios.put(`http://localhost:3000/centrocosto/${id}`, updateRow);

      const updatedRecords = records.map((row) =>
        row.id === id ? { ...editedRow } : row
      );

      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null);

      console.log("Cambios guardados correctamente");
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

  const columns = [
    {
      name: "Pais",
      selector: (row) => row.N_Pais,
      sortable: true,
      minWidth: "200px",
      maxWidth: "500px",
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <select value={editedRow.ID_Pais} onChange={(e) => handleEditChange(e, "ID_Pais")}>
            {pais.map((pais) => (