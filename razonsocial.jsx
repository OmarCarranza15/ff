import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaEdit, FaTimes } from "react-icons/fa";
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
  ErrorMessage,
  ModalButtonGroup,
  ModalButton,
  ButtonCancelar
} from "./StyledComponents"; // Asegúrate de que las rutas son correctas

function RazonSocial() {
  const [rsocial, setRSocial] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [pais, setPais] = useState([]);
  const [errors, setErrors] = useState({ pais: "", rsocial: "" }); //validaciones para insertar una nueva razon social
  const [modalValues, setModalValues] = useState({ pais: "", rsocial: "" });
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal


  const [filters, setFilters] = useState({
    N_RSocial: "",
    N_Pais: "",
  });

  useEffect(()=> {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/rsocial/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (rsocial)=> {
            const paisResponse = await axios.get(`http://localhost:3000/pais/${rsocial.ID_Pais}`); 
            
            return {
              id: rsocial.id,   
              N_RSocial: rsocial.N_RSocial,
              ID_Pais: rsocial.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
            }
          })
        )
        setRecords(mappedData);
      } catch (error) {
        console.error ('Error al obtener las Razones Sociales:', error);
      }
    };
    const fetchPais = async () =>{
        try {
            const response = await axios.get(`http://localhost:3000/pais/`);
            setPais(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de Paises', error);
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

    if (!modalValues.pais.trim()) {
      newErrors.pais = "El campo País es obligatorio";
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.pais)) {
      newErrors.pais = "El campo País solo acepta letras y espacios en blanco";
    }

    if (!modalValues.rsocial.trim()) {
      newErrors.rsocial = "El campo Razón Social es obligatorio";
    } else if (!/^[a-zA-Z\s|]+$/.test(modalValues.rsocial)) {
      newErrors.rsocial =
        "El campo Razón Social solo acepta letras y espacios en blanco y el símbolo '|'";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si la razón social ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/rsocial`);
        const rsocialExists = response.data.some(
          (rsocial) => rsocial.N_RSocial.toLowerCase() === modalValues.rsocial.toLowerCase()
        );
        if (rsocialExists) {
          setErrors({ rsocial: "La razón social ya existe" });
          return;
        }

        // Insertar una nueva razón social
        const newRSocial = {
          N_RSocial: modalValues.rsocial,
          ID_Pais: modalValues.pais,
        };
        const insertResponse = await axios.post(`http://localhost:3000/rsocial`, newRSocial);

        // Actualizar la lista de razones sociales con la nueva razón social
        const paisResponse = await axios.get(`http://localhost:3000/pais/${modalValues.pais}`);
        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            N_RSocial: modalValues.rsocial,
            ID_Pais: modalValues.pais,
            N_Pais: paisResponse.data.N_Pais,
          },
        ];
        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({ pais: "", rsocial: "" }); // Limpiar los valores del modal
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
      ...(field === "ID_RSocial" && { N_RSocial: rsocial.find((p) => p.id === parseInt(value)).N_RSocial }),
      ...(field === "ID_Pais" && { N_Pais: pais.find((p) => p.id === parseInt(value)).N_Pais }),
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
      } else if (!/^[a-zA-Z\s|]+$/.test(value)) {
        newErrors.rsocial =
          "El campo Razón Social solo acepta letras y espacios en blanco y el símbolo '|'";
      } else {
        newErrors.rsocial = "";
      }
    }
    setErrors(newErrors);
  };
  

  const saveChanges = async(id) => {
    try {

      const updateRow = {
        ...editedRow,
      }
      
      await axios.put(`http://localhost:3000/rsocial/${id}`,updateRow);   

      const updatedRecords = records.map ((row) => 
        row.id === id ? {...editedRow} : row
      )
      
      //setRecords(updatedRecordsPuesto);
      setRecords(updatedRecords);
      setEditedRow(null);
      setEditMode(null); 
    
                                                                               
      console.log("Cambios guardados correctamente");
    } catch(error) {
      console.error("Error al guardar los cambios", error)
    }
  };

  const cancelEdit = () => {
    setEditedRow(null);
    setEditMode(null);
  };

  const filteredData = records.filter((row) => {
   return(
    (filters.N_Pais === "" ||
        row.N_Pais
          .toLowerCase()
          .includes(filters.N_Pais.toLowerCase())) &&
      (filters.N_RSocial === "" ||
        row.N_RSocial.toLowerCase().includes(filters.N_RSocial.toLowerCase()))
    );
  });

  const columns = [
    {
        name: "Pais",
        selector: (row) => row.N_Pais,
        sortable: true,
        minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
        maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
        cell: (row) =>
          editMode && editedRow?.id === row.id ? (
            <select value={editedRow.ID_Pais} onChange={(e) => handleEditChange(e, "ID_Pais")}>
              {pais.map((pais) => (
                <option key={pais.id} value={pais.id}>
                  {pais.N_Pais}
                </option>
              ))}
            </select>
          ) : (
            <div>{row.N_Pais}</div>
          ),
      },
    {
      name: "Razon Social",
      selector: (row) => row.N_RSocial,
      sortable: true,
      minWidth: "330px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "50px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
            <input
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => saveChanges(row.id)}>
              <FaSave />
            </Button>
            <ButtonCancelar cancel onClick={cancelEdit}>
              <FaTimes />
            </ButtonCancelar>
          </div>
        ) : (
          <Button onClick={() => startEdit(row)}>
            <FaEdit />
          </Button>
        ),
    },
  ];
  {/* Modal para insertar una nueva razón social */}
  {showModal && (
    <ModalBackground>
      <ModalWrapper>
        <ModalTitle>Nueva Razón Social</ModalTitle>
        <SelectPais
          value={modalValues.ID_Pais}
          onChange={(e) => handleModalChange(e, "ID_Pais")}
          placeholder="País"
          error={errors.pais}
          required
        >
          <option value="">Seleccione un país</option>
          {pais.map((p) => (
            <option key={p.id} value={p.id}>
              {p.N_Pais}
            </option>
          ))}
        </SelectPais>
        {errors.pais && <ErrorMessage>{errors.pais}</ErrorMessage>}

        <ModalInput
          type="text"
          value={modalValues.rsocial}
          onChange={(e) => handleModalChange(e, "rsocial")}
          placeholder="Razón Social"
          error={errors.rsocial}
        />
        {errors.rsocial && <ErrorMessage>{errors.rsocial}</ErrorMessage>}
        <ModalButtonGroup>
          <ModalButton primary onClick={SaveModal}>
            <FaSave /> Guardar
          </ModalButton>
          <ModalButton cancel onClick={handleCloseModal}>
            <FaTimes /> Cancelar
          </ModalButton>
        </ModalButtonGroup>
      </ModalWrapper>
    </ModalBackground>
  )}
</MainContainer>