

import React, { useState, useEffect } from "react";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import "../styles/DataTable.css"; // Importa el archivo CSS
import axios from "axios";
import { FaPlus, FaUndo, FaSearch } from "react-icons/fa"; // Importa el ícono de edición
import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
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



function MatrizPais() {
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [rsocial, setRsocial] = useState([]);
  const [division, setDivision] = useState([]);
  const [departamento, setDepartamento] = useState([]);
  const [centrocosto, setCentrocostos] = useState([]);
  const [aplicacion, setAplicacion] = useState([]);
  const [ambiente, setAmbiente] = useState([]);
  const [errors, setErrors] = useState({
    ID_Pais: "",
    Rol: "",
    Ticket: "",
    Observaciones: "",
    Puesto_Jefe: "",
    Cod_Menu: "",
    Estado_Perfil: "",
    ID_Puesto: "",
    ID_Aplicaciones: "",
  });
  const [modalValues, setModalValues] = useState({
    ID_Pais: "",
    Rol: "",
    Ticket: "",
    Observaciones: "",
    Puesto_Jefe: "",
    Cod_Menu: "",
    Estado_Perfil: "",
    ID_Puesto: "",
    ID_Aplicaciones: "",
  });
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [showColumns, setShowColumns] = useState(false);
  const [loading, setLoading] = useState(true);
  const [T24, setT24] = useState(false);
  const [rows, setRows] = useState([]);
  const [permissions, setPermissions] = useState({
    // eslint-disable-next-line
    insert: false,
    edit: false,
  });
  const [userId, setUserId] = useState(null);
  const [filters, setFilters] = useState({
    N_RSocial: "",
    N_Departamento: "",
    N_Pais: "",
    N_Puesto: "",
    Rol: "",
    N_Aplicaciones: "",
    N_Ambiente: "",
    Puesto_Jefe: "",
    Ticket: "",
    Nombre: "", //Nombre del centro de costos
    Observaciones: "",
    Estado_Perfil: "",
    ID_Pais: "",
    ID_Aplicaciones: "",
    ID_Puesto: "",
    ID_Ambiente: "",
    Cod_Menu: "",
  });

  const handleToggleColumns = () => {
    setShowColumns(!showColumns);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const paisIdEncrypted  = searchParams.get("pais");
    const paisNombreEncrypted  = searchParams.get("Nombre");


    const paisId = decryptData(paisIdEncrypted);
    const paisNombre = decryptData(paisNombreEncrypted);
    


  setSelectedCountryId(paisId);
  setSelectedCountry(paisNombre);

  const encryptedUser = sessionStorage.getItem('userId');
    if (encryptedUser) {
        const decryptedUser = decryptData(encryptedUser);
        //console.log('Rol desencriptado:', decryptedRole); // Consola para verificar el rol desencriptado
        setUserId(decryptedUser);
    }

    //console.log('Nombre del Pais:', paisNombre);

    const encrypPermissions = sessionStorage.getItem("userPermissions");
    if (encrypPermissions) {
      const storedPermissions = decryptData(encrypPermissions);
      //console.log('Permisos:', storedPermissions);
      setPermissions(JSON.parse(storedPermissions));
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/perfil/`);
        const data = response.data;
        const filteredData = data.filter(
          (perfil) => perfil.ID_Pais === parseInt(paisId, 10)
        );
        const mappedData = await Promise.all(
          filteredData.map(async (perfil) => {
            const puestoResponse = await axios.get(
              `http://localhost:3000/puesto/${perfil.ID_Puesto}`
            );
            const aplicacionResponse = await axios.get(
              `http://localhost:3000/aplicacion/${perfil.ID_Aplicaciones}`
            );
            const rsocialResponse = await axios.get(
              `http://localhost:3000/rsocial/${puestoResponse.data.ID_RSocial}`
            );
            const divisionResponse = await axios.get(
              `http://localhost:3000/division/${puestoResponse.data.ID_Division}`
            );
            const departamentoResponse = await axios.get(
              `http://localhost:3000/departamento/${puestoResponse.data.ID_Departamento}`
            );
            const centrocostosResponse = await axios.get(
              `http://localhost:3000/centrocosto/${puestoResponse.data.ID_CentroCostos}`
            );
            const paisResponse = await axios.get(
              `http://localhost:3000/pais/${perfil.ID_Pais}`
            );
            const ambienteResponse = await axios.get(
              `http://localhost:3000/ambiente/${aplicacionResponse.data.ID_Ambiente}`
            );

            return {
              N_RSocial: rsocialResponse.data.N_RSocial,
              N_Division: divisionResponse.data.N_Division,
              N_Puesto: puestoResponse.data.N_Puesto,
              N_Pais: paisResponse.data.N_Pais,
              N_Departamento: departamentoResponse.data.N_Departamento,
              Rol: perfil.Rol,
              N_Aplicaciones: aplicacionResponse.data.N_Aplicaciones,
              N_Ambiente: ambienteResponse.data.N_Ambiente,
              Puesto_Jefe: perfil.Puesto_Jefe,
              Ticket: perfil.Ticket,
              Observaciones: perfil.Observaciones,
              Estado_Perfil:
              perfil.Estado_Perfil === 1 ? "En Servicio" : "Suspendido",
              id: perfil.id,
              ID_Pais: perfil.ID_Pais,
              ID_Aplicaciones: perfil.ID_Aplicaciones,
              ID_Puesto: perfil.ID_Puesto,
              Cod_Menu: perfil.Cod_Menu,
              ID_Ambiente: aplicacionResponse.data.ID_Ambiente,
              ID_RSocial: puestoResponse.data.ID_RSocial,
              ID_Division: puestoResponse.data.ID_Division,
              ID_Departamento: puestoResponse.data.ID_Departamento,
              ID_CentroCostos: puestoResponse.data.ID_CentroCostos,
              Nombre: centrocostosResponse.data.Nombre,
            };
          })
        );
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los perfiles:", error);
        setLoading(false);
      }
    };

    const fetchPuestos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/puesto/`);
        const allPuestos = response.data;
        const filteredPuestos = allPuestos.filter(
          (puestos) => puestos.ID_Pais === parseInt(paisId, 10)
        );
        setPuestos(filteredPuestos);
      } catch (error) {
        console.error("Error al obtener la lista de puestos", error);
      }
    };
    const fetchRsocial = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/rsocial/`);
        setRsocial(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de razon social", error);
      }
    };
    const fetchDivision = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/division/`);
        setDivision(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de division", error);
      }
    };
    const fetchDepartamento = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/departamento/`);
        setDepartamento(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de departamentos", error);
      }
    };
    const fetchCentrocostos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/centrocosto/`);
        setCentrocostos(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de centro de costos", error);
      }
    };
    const fetchAplicacion = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/aplicacion/`);
        const allAplicaciones = response.data;
        const filteredAplicaciones = allAplicaciones.filter(
          (aplicacion) => aplicacion.ID_Pais === parseInt(paisId, 10)
        );
        setAplicacion(filteredAplicaciones);
      } catch (error) {
        console.error("Error al obtener la lista de aplicaciones", error);
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
    fetchAmbiente();
    fetchAplicacion();
    fetchCentrocostos();
    fetchDepartamento();
    fetchDivision();
    fetchRsocial();
    fetchPuestos();
    fetchData();
  }, [location.search]);

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
      Rol: "",
      Ticket: "",
      Observaciones: "",
      Puesto_Jefe: "",
      Cod_Menu: "",
      Estado_Perfil: "",
      ID_Puesto: "",
      ID_Aplicaciones: "",
    });
    setErrors({
      ID_Pais: "",
      Rol: "",
      Ticket: "",
      Observaciones: "",
      Puesto_Jefe: "",
      Cod_Menu: "",
      Estado_Perfil: "",
      ID_Puesto: "",
      ID_Aplicaciones: "",
    });
    setT24(false);
  };

  const handleModalChange = (e, fieldName) => {
    const value = e.target.value;

    // Actualizar el valor del campo en modalValues
    setModalValues((prevModalValues) => ({
      ...prevModalValues,
      [fieldName]: value,
    }));

    // Encontrar la aplicación seleccionada en la lista de aplicaciones
    const selectedApplication = aplicacion.find(
      (app) => app.id === parseInt(value)
    ); // Asegúrate de convertir a entero si es necesario

    // Verificar si la aplicación seleccionada es T24
    const isT24 = selectedApplication
      ? selectedApplication.N_Aplicaciones === "T24"
      : false;

    // Actualizar el estado T24
    setT24(isT24);

    // Log para verificar en consola la aplicación seleccionada
    //console.log('Aplicación seleccionada:', selectedApplication);
  };

  const SaveModal = async () => {
    const newErrors = {
      ID_Pais: "",
      ID_Puesto: "",
      ID_Aplicaciones: "",
      Estado_Perfil: "",
      Rol: "",
      Puesto_Jefe: "",
      Observaciones: "",
      Ticket: "",
      Cod_Menu: "",
    };

    if (!modalValues.ID_Puesto) {
      newErrors.puesto = "El campo Puesto es obligatorio";
    }
    if (!modalValues.ID_Aplicaciones) {
      newErrors.aplicacion = "El campo Aplicación es obligatorio";
    }
    if (!modalValues.Rol.trim()) {
      newErrors.Rol = "El rol es obligatorio";
    }
    if (!modalValues.Ticket.trim()) {
    } else if (!/^\d+$/.test(modalValues.Ticket)) {
      newErrors.Ticket = "Solo se aceptan Dígitos";
    }
    if (!modalValues.Puesto_Jefe.trim()) {
      newErrors.Puesto_Jefe =
        "El nombre del puesto del jefe inmediato es obligatorio.";
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.Puesto_Jefe)) {
      newErrors.Puesto_Jefe =
        "El campo del jefe inmediato solo acepta letras y espacios en blanco.";
    }

    setErrors(newErrors);

    // Si no hay errores, proceder a insertar el nuevo perfil
    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el perfil ya existe en la base de datos
        console.log("Verificando si el perfil ya existe...");
        const response = await axios.get(`http://localhost:3000/perfil`);
        console.log("Datos recibidos del servidor:", response.data);

        const perfiles = response.data;

        const rollExistente = perfiles.some(
          (perfil) => perfil.Rol.toLowerCase() === modalValues.Rol.toLowerCase()
        );
        const jefeinExistente = perfiles.some(
          (perfil) =>
            perfil.Puesto_Jefe.toLowerCase() ===
            modalValues.Puesto_Jefe.toLowerCase()
        );
        const paisExistente = perfiles.some(
          (perfil) => perfil.ID_Pais.toString() === modalValues.ID_Pais
        );
        const puestoExistente = perfiles.some(
          (perfil) => perfil.ID_Puesto.toString() === modalValues.ID_Puesto
        );
        const aplicacionExistente = perfiles.some(
          (perfil) =>
            perfil.ID_Aplicaciones.toString() === modalValues.ID_Aplicaciones
        );

        if (
          rollExistente &&
          jefeinExistente &&
          paisExistente &&
          puestoExistente &&
          aplicacionExistente
        ) {
          setErrors({
            ...newErrors,
            PerError:
              "El perfil ya existe, cambiar uno de los valores Rol, Jefe Inmediato, Puesto, Aplicacion o Pais",
          });
          return;
        }

        // Datos del nuevo perfil
        const newPerfil = {
          Estado_Perfil: 1,
          ID_Pais: selectedCountryId,
          ID_Aplicaciones: parseInt(modalValues.ID_Aplicaciones, 10),
          ID_Puesto: parseInt(modalValues.ID_Puesto, 10),
          Rol: modalValues.Rol,
          Ticket: parseInt(modalValues.Ticket, 10),
          Observaciones: modalValues.Observaciones,
          Puesto_Jefe: modalValues.Puesto_Jefe,
          Cod_Menu: modalValues.Cod_Menu,
        };

        console.log("Enviando datos:", newPerfil);

        // Enviar solicitud POST para insertar el nuevo perfil
        const insertResponse = await axios.post(
          `http://localhost:3000/perfil`,
          newPerfil
        );
        console.log("Respuesta de inserción:", insertResponse.data);

        await axios.post('http://localhost:3000/auditoria', {
          Tabla: `Matriz de ${selectedCountry}`,
          Accion: 1, // 1 for Insert
          ID_Usuario: userId
        });

        // Actualizar la lista de perfiles con el nuevo perfil
        /*const paisResponse = await axios.get(
          `http://localhost:3000/pais/${modalValues.ID_Pais}`
        );*/
        const aplicacionResponse = await axios.get(
          `http://localhost:3000/aplicacion/${modalValues.ID_Aplicaciones}`
        );

        const puestoResponse = await axios.get(
          `http://localhost:3000/puesto/${modalValues.ID_Puesto}`
        );

        console.log("Datos de respuesta para actualizar la UI:", {
          aplicacionResponse: aplicacionResponse.data,
          puestoResponse: puestoResponse.data,
        });

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            Rol: modalValues.Rol,
            Observaciones: modalValues.Observaciones,
            Puesto_Jefe: modalValues.Puesto_Jefe,
            Ticket: parseInt(modalValues.Ticket, 10),
            Estado_Perfil: 1,
            ID_Pais: selectedCountryId,
            ID_Aplicaciones: modalValues.ID_Aplicaciones,
            N_Aplicaciones: aplicacionResponse.data.N_Aplicaciones,
            ID_Puesto: modalValues.ID_Puesto,
            N_Puesto: puestoResponse.data.N_Puesto,
            Cod_Menu: modalValues.Cod_Menu,
          },
        ];

        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({
          ID_Pais: "",
          Rol: "",
          Ticket: "",
          Observaciones: "",
          Puesto_Jefe: "",
          Estado_Perfil: "",
          ID_Puesto: "",
          ID_Aplicaciones: "",
          Cod_Menu: "",
        }); // Limpiar los valores del modal
        window.location.reload();
      } catch (error) {
        console.error("Error al insertar un nuevo Perfil:", error);
      }
    }
  };

  const startEdit = (row) => {
    setEditedRow({ ...row });
    setEditMode(row.id);
  };

  const handleEditChange = (event, field) => {
    const { value } = event.target;
    setEditedRow((prevState) => {
      const updatedRow = {
        ...prevState,
        [field]: value,
        ...(field === "ID_Aplicaciones" && {
          N_Aplicaciones: aplicacion.find((p) => p.id === parseInt(value))
            .N_Aplicaciones,
        }),
        ...(field === "ID_Puesto" && {
          N_Puesto: puestos.find((p) => p.id === parseInt(value)).N_Puesto,
        }),
        ...(field === "ID_Ambiente" && {
          N_Ambiente: ambiente.find((p) => p.id === parseInt(value)).N_Ambiente,
        }),
        ...(field === "ID_RSocial" && {
          N_RSocial: rsocial.find((p) => p.id === parseInt(value)).N_RSocial,
        }),
        ...(field === "ID_Division" && {
          N_Division: division.find((p) => p.id === parseInt(value)).N_Division,
        }),
        ...(field === "ID_Departamento" && {
          N_Departamento: departamento.find((p) => p.id === parseInt(value))
            .N_Departamento,
        }),
        ...(field === "ID_CentroCostos" && {
          Nombre: centrocosto.find((p) => p.id === parseInt(value)).Nombre,
        }),
      };

      // Si la aplicación no es T24, borrar el Cod_Menu
      if (field === "ID_Aplicaciones" && updatedRow.N_Aplicaciones !== "T24") {
        updatedRow.Cod_Menu = "";
      }

      return updatedRow;
    });
    validateInput(field, value);
  };

  const validateInput = (field, value) => {
    let newErrors = { ...errors };
    if (field === "Ticket") {
      if (!/^\d+$/.test(modalValues.Ticket)) {
        newErrors.Ticket = "Solo se aceptan Digitos";
      }
    } else if (field === "ID_Aplicaciones") {
      if (!value.trim()) {
        newErrors.ID_Aplicaciones = "El campo Aplicacion es obligatorio";
      } else {
        newErrors.ID_Aplicaciones = "";
      }
    } else if (field === "ID_Puesto") {
      if (!value.trim()) {
        newErrors.ID_Puesto = "El campo Puesto es obligatorio";
      } else {
        newErrors.ID_Puesto = "";
      }
    } else if (field === "Rol") {
      if (!value.trim()) {
        newErrors.Rol = "El campo Rol es obligatorio";
      } else {
        newErrors.Rol = "";
      }
    } else if (field === "Puesto_Jefe") {
      if (!value.trim()) {
        newErrors.Puesto_Jefe = "EL campo puesto es obligatorio";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.Puesto_Jefe =
          "El campo del jefe inmediato solo acepta letras y espacios en blanco.";
      } else {
        newErrors.Puesto_Jefe = "";
      }
    }
    setErrors(newErrors);
  };

  const saveChanges = async (id) => {
    try {
      const updateRow = {
        ...editedRow,
        Estado_Perfil: editedRow.Estado_Perfil === "En Servicio" ? 1 : 2,
      };

      await axios.put(`http://localhost:3000/perfil/${id}`, updateRow);

      await axios.post('http://localhost:3000/auditoria', {
        Tabla: `Matriz de ${selectedCountry}`,
        Accion: 2, // 2 for Update
        ID_Usuario: userId
        })


      if (
        editedRow.ID_Ambiente !==
        records.find((row) => row.id === id).ID_Ambiente
      ) {
        await axios.put(
          `http://localhost:3000/aplicacion/${editedRow.ID_Aplicaciones}`,
          {
            ID_Ambiente: editedRow.ID_Ambiente,
          }
        );
      }

      if (
        editedRow.ID_RSocial !== records.find((row) => row.id === id).ID_RSocial
      ) {
        await axios.put(`http://localhost:3000/puesto/${editedRow.ID_Puesto}`, {
          ID_RSocial: editedRow.ID_RSocial,
        });
      }

      if (
        editedRow.ID_Division !==
        records.find((row) => row.id === id).ID_Division
      ) {
        await axios.put(`http://localhost:3000/puesto/${editedRow.ID_Puesto}`, {
          ID_Division: editedRow.ID_Division,
        });
      }

      if (
        editedRow.ID_Departamento !==
        records.find((row) => row.id === id).ID_Departamento
      ) {
        await axios.put(`http://localhost:3000/puesto/${editedRow.ID_Puesto}`, {
          ID_Departamento: editedRow.ID_Departamento,
        });
      }

      if (
        editedRow.ID_CentroCostos !==
        records.find((row) => row.id === id).ID_CentroCostos
      ) {
        await axios.put(`http://localhost:3000/puesto/${editedRow.ID_Puesto}`, {
          ID_CentroCostos: editedRow.ID_CentroCostos,
        });
      }

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

  const filtered = records.filter((row) => {
    const isActive = filters.Estado_Perfil.toLowerCase() === "activo";

    return (
      (filters.N_RSocial === "" ||
        row.N_RSocial.toLowerCase().includes(
          filters.N_RSocial.toLowerCase()
        )) &&
      (filters.N_Departamento === "" ||
        row.N_Departamento.toLowerCase().includes(
          filters.N_Departamento.toLowerCase()
        )) &&
      (filters.Rol === "" ||
        row.Rol.toLowerCase().includes(filters.Rol.toLowerCase())) &&
      (filters.Nombre === "" ||
        row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())) &&
      (filters.N_Puesto === "" ||
        row.N_Puesto.toLowerCase().includes(filters.N_Puesto.toLowerCase())) &&
      (filters.Observaciones === "" ||
        row.Observaciones.toLowerCase().includes(
          filters.Observaciones.toLowerCase()
        )) &&
      (filters.N_Aplicaciones === "" ||
        row.N_Aplicaciones.toLowerCase().includes(
          filters.N_Aplicaciones.toLowerCase()
        )) &&
      (filters.Ticket === "" ||
        (row.Ticket
          ? row.Ticket.toString().includes(filters.Ticket.toString())
          : false)) &&
      /*(filters.N_Ambiente === "" || row.N_Ambiente.toLowerCase().includes(filters.N_Ambiente.toLowerCase())) &&*/
      (filters.Puesto_Jefe === "" ||
        row.Puesto_Jefe.toLowerCase().includes(
          filters.Puesto_Jefe.toLowerCase()
        )) &&
      (filters.Estado_Perfil === "" ||
        row.Estado_Perfil.toLowerCase().includes(
          filters.Estado_Perfil.toLowerCase()
        )) &&
      (isActive ? row.Estado_Perfil.toLowerCase() === "activo" : true)
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
      name: "Razon Social",
      selector: (row) => row.N_RSocial,
      sortable: true,
      omit: !showColumns,
      minWidth: "250px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <div style={{ color: "red" }}>{row.N_RSocial}</div>
        ) : (
          <div>{row.N_RSocial}</div>
        ),
    },
    /*{
      name: "División",
      selector: (row) => row.N_Division,
      sortable: true,
      minWidth: "230px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => 
        editMode && editedRow?.id === row.id ? (
          <div style={{color: "red"}}>{row.N_Division}</div>
        ):(
            <div>{row.N_Division}</div>
          )
    },*/
    {
      name: "Departamento",
      selector: (row) => row.N_Departamento,
      sortable: true,
      omit: !showColumns,
      minWidth: "250px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <div style={{ color: "red" }}>{row.N_Departamento}</div>
        ) : (
          <div>{row.N_Departamento}</div>
        ),
    },
    {
      name: "Centro de Coste",
      selector: (row) => row.Nombre,
      sortable: true,
      omit: !showColumns,
      minWidth: "350px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <div style={{ color: "red" }}>{row.Nombre}</div>
        ) : (
          <div>{row.Nombre}</div>
        ),
    },
    {
      name: "Puesto",
      selector: (row) => row.N_Puesto,
      sortable: true,
      minWidth: "400px", // Adjust the minimum width as needed
      maxWidth: "800px", // Adjust the maximum width as needed
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledSelect
            type="select"
            value={editedRow.ID_Puesto}
            onChange={(e) => handleEditChange(e, "ID_Puesto")}
          >
            {puestos.map((puesto) => (
              <option key={puesto.id} value={puesto.id}>
                {puesto.N_Puesto}
              </option>
            ))}
          </StyledSelect>
        ) : (
          <div>{row.N_Puesto}</div>
        ),
    },
    {
      name: "Rol",
      selector: (row) => row.Rol,
      sortable: true,
      minWidth: "370px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "800px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Rol}
            onChange={(e) => handleEditChange(e, "Rol")}
          />
        ) : (
          <div>{row.Rol}</div>
        ),
    },
      {
        name: "Aplicación",
        selector: (row) => {
          const aplicacionText = row.N_Aplicaciones || "";
          const codMenuText = row.Cod_Menu || "";
          return aplicacionText + (aplicacionText && codMenuText && aplicacionText === "T24" ? " - " : "") + (aplicacionText === "T24" ? codMenuText : "");
        },
        sortable: true,
        minWidth: "350px",
        maxWidth: "1000px",
        cell: (row) => (
          editMode && editedRow?.id === row.id ? (
            <>
              <StyledSelect
                value={editedRow.ID_Aplicaciones}
                onChange={(e) => handleEditChange(e, "ID_Aplicaciones")}
              >
                {aplicacion.map((aplicacion) => (
                  <option key={aplicacion.id} value={aplicacion.id}>
                    {aplicacion.N_Aplicaciones}
                  </option>
                ))}
              </StyledSelect>
              {editedRow.N_Aplicaciones === 'T24' && (
                <StyledInput
                  type="text"
                  value={editedRow.Cod_Menu}
                  onChange={(e) => handleEditChange(e, "Cod_Menu")}
                  onKeyPress={(e) => {
                    if (!/\d/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            </>
          ) : (
            <div>
              {row.N_Aplicaciones && (
                <>
                  <span>{row.N_Aplicaciones}</span>
                  {row.N_Aplicaciones === 'T24' && row.Cod_Menu && <span> - {row.Cod_Menu}</span>}
                </>
              )}
            </div>
          )
        ),
      },
    /*{
      name: "Ambiente",
      selector: (row) => row.N_Ambiente,
      sortable: true,
      minWidth: "150px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => 
      editMode && editedRow?.id === row.id ? (
        <div style={{color: "red"}}>{row.N_Ambiente}</div>
      ):(
          <div>{row.N_Ambiente}</div>
        )
    },*/
    {
      name: "Jefe Inmediato",
      selector: (row) => row.Puesto_Jefe,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "800px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Puesto_Jefe}
            onChange={(e) => handleEditChange(e, "Puesto_Jefe")}
          />
        ) : (
          <div>{row.Puesto_Jefe}</div>
        ),
    },
    {
      name: "Ticket",
      selector: (row) => row.Ticket,
      sortable: true,
      omit: !showColumns,
      minWidth: "100px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "100px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Ticket}
            onChange={(e) => handleEditChange(e, "Ticket")}
            onKeyPress={(e) => {
              if (!/\d/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        ) : (
          <div>{row.Ticket}</div>
        ),
    },
    {
      name: "Observación",
      selector: (row) => row.Observaciones,
      sortable: true,
      omit: !showColumns,
      minWidth: "350px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "800px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Observaciones}
            onChange={(e) => handleEditChange(e, "Observaciones")}
          />
        ) : (
          <div>{row.Observaciones}</div>
        ),
    },
    {
      name: "Estado",
      selector: (row) =>
        editMode === row.id ? (
          <StyledSelect
            value={editedRow.Estado_Perfil}
            onChange={(e) => handleEditChange(e, "Estado_Perfil")}
          >
            <option value={"En Servicio"}>En Servicio</option>
            <option value={"Suspendido"}>Suspendido</option>
          </StyledSelect>
        ) : (
          <div>{row.Estado_Perfil}</div>
        ),
      sortable: true,
    },
    {
      name: "Acciones",
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "200px", // Ajusta el tamaño máximo según sea necesario
      omit: !permissions.edit,
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
      N_RSocial: "",
      N_Departamento: "",
      N_Pais: "",
      N_Puesto: "",
      Rol: "",
      N_Aplicaciones: "",
      N_Ambiente: "",
      Puesto_Jefe: "",
      Ticket: "",
      Nombre: "", //Nombre del centro de costos
      Observaciones: "",
      Estado_Perfil: "",
      ID_Pais: "",
      ID_Aplicaciones: "",
      ID_Puesto: "",
      ID_Ambiente: "",
    });
  };
  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>Matriz de perfiles de {selectedCountry}</Title>
            <ButtonGroup>
              <Button
                className="btn btn-outline-primary"
                onClick={toggleFilters}
              >
                <FaSearch style={{margin: "0px 5px"}}/>
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
              {permissions.insert && (
                <Button 
                  style={{marginRight: "30px"}}
                  onClick={handleInsert}
                  className="btn btn-outline-success">
                  <FaPlus style={{margin: "0px 5px"}}/>
                   Nuevo Perfil
                </Button>
              )}
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
            {showColumns && (
              <>
                <FilterInput
                  type="text"
                  value={filters.N_RSocial}
                  onChange={(e) => handleFilterChange(e, "N_RSocial")}
                  placeholder=" Razón Social"
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
              </>
            )}
            {/*<FilterInput
              type="text"
              value={filters.N_Pais}
              onChange={(e) => handleFilterChange(e, "N_Pais")}
              placeholder="Buscar por Pais"
            />*/}
            <FilterInput
              type="text"
              value={filters.N_Puesto}
              onChange={(e) => handleFilterChange(e, "N_Puesto")}
              placeholder="Buscar por Puesto"
            />
            <FilterInput
              type="text"
              value={filters.Rol}
              onChange={(e) => handleFilterChange(e, "Rol")}
              placeholder="Buscar por Rol"
            />
            <FilterInput
              type="text"
              value={filters.N_Aplicaciones}
              onChange={(e) => handleFilterChange(e, "N_Aplicaciones")}
              placeholder="Buscar por Aplicación"
            />
            {/*<FilterInput
              type="text"
              value={filters.N_Ambiente}
              onChange={(e) => handleFilterChange(e, "N_Ambiente")}
              placeholder="Buscar por Ambiente"
            />*/}
            <FilterInput
              type="text"
              value={filters.Puesto_Jefe}
              onChange={(e) => handleFilterChange(e, "Puesto_Jefe")}
              placeholder="Buscar por Jefe Inmediato"
            />
            {showColumns && (
              <>
                <FilterInput
                  type="text"
                  value={filters.Ticket}
                  onChange={(e) => handleFilterChange(e, "Ticket")}
                  placeholder="Buscar por Ticket"
                />
                <FilterInput
                  type="text"
                  value={filters.Estado_Perfil}
                  onChange={(e) => handleFilterChange(e, "Estado_Perfil")}
                  placeholder="Buscar por Estado"
                />
                <FilterInput
                  type="text"
                  value={filters.Observaciones}
                  onChange={(e) => handleFilterChange(e, "Observaciones")}
                  placeholder="Buscar por Observaciones"
                />
              </>
            )}
            <ButtonGroup>
              <RedButton onClick={resetFilters}>
                <FaUndo /> Resetear Filtros
              </RedButton>
            </ButtonGroup>
          </FilterWrapper>
          <Button
            onClick={handleToggleColumns}
            style={{
              marginLeft: "auto",
              position: "relative",
              marginRight: 10,
              backgroundColor: "white",
              color: "blue",
            }}
          >
            {showColumns ? "Ver Menos Detalles" : "Ver Mas Detalles"}
          </Button>
          {loading ? (
            <CustomLoader />
          ) : (
            <StyledDataTable
              columns={columns}
              data={filtered}
              pagination
              paginationPerPage={15}
              showFilters={showFilters}
              customStyles={customStyles}
              noDataComponent={
                <h2 style={{ color: " #004ea1" }}>
                  Por favor busque un registro
                </h2>
              }
            />
          )}
        </DataTableContainer>
      </ContentContainer>

      {/* Modal para insertar una nuevo departamento */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Perfil {selectedCountry}</ModalTitle>
            <div style={{ margin: "15px" }} />
            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Puesto:</span>
            </label>
            <select
              class="form-select"
              aria-label="Default select example"
              value={modalValues.ID_Puesto}
              onChange={(e) => handleModalChange(e, "ID_Puesto")}
              error={errors.puesto}
              required
            >
              <option value="">Seleccione un puesto</option>
              {puestos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Puesto}
                </option>
              ))}
            </select>
            {errors.puesto && <ErrorMessage>{errors.puesto}</ErrorMessage>}

            <div style={{ margin: "15px" }} />
            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Aplicación:</span>
            </label>
            <select
              class="form-select"
              aria-label="Default select example"
              value={modalValues.ID_Aplicaciones}
              onChange={(e) => handleModalChange(e, "ID_Aplicaciones")}
              error={errors.aplicacion}
              required
            >
              <option value="">Seleccione una aplicación</option>
              {aplicacion.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Aplicaciones}
                </option>
              ))}
            </select>
            {errors.aplicacion && (
              <ErrorMessage>{errors.aplicacion}</ErrorMessage>
            )}
            <div style={{ margin: "15px" }} />
            {T24 && (
              <div>
                <label
                  style={{
                    width: "100%",
                    display: "block",
                    textAlign: "left",
                  }}
                >
                  Número de Menú:
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={modalValues.Cod_Menu}
                  onChange={(e) => handleEditChange(e, "Cod_Menu")}
                  placeholder="Ingrese el número de menu"
                  {...(errors.Cod_Menu && { className: "is-invalid" })}
                  required
                />
              </div>
            )}
            <div style={{ margin: "15px" }} />

            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Rol en la Aplicación:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.Rol}
              onChange={(e) => handleModalChange(e, "Rol")}
              placeholder="Ingrese el Rol"
              error={errors.Rol}
              required
            />
            {errors.Rol && <ErrorMessage>{errors.Rol}</ErrorMessage>}
            <div style={{ margin: "15px" }} />

            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>
                Puesto del Jefe Inmediato:
              </span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.Puesto_Jefe}
              onChange={(e) => handleModalChange(e, "Puesto_Jefe")}
              placeholder="Ingrese el Puesto del Jefe"
              error={errors.Puesto_Jefe}
              required
            />
            {errors.Puesto_Jefe && (
              <ErrorMessage>{errors.Puesto_Jefe}</ErrorMessage>
            )}
            {errors.PerError && <ErrorMessage>{errors.PerError}</ErrorMessage>}
            <div style={{ margin: "15px" }} />

            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Número de Ticket:</span>
            </label>
            <input
              className="form-control"
              type="text"
              value={modalValues.Ticket}
              onChange={(e) => handleModalChange(e, "Ticket")}
              placeholder="Ingrese el número de ticket"
              onKeyPress={(e) => {
                if (!/\d/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              error={errors.Ticket}
              required
            />
            {errors.Ticket && <ErrorMessage>{errors.Ticket}</ErrorMessage>}
            <div style={{ margin: "15px" }} />

            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Observaciones:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.Observaciones}
              onChange={(e) => handleModalChange(e, "Observaciones")}
              placeholder=""
              error={errors.Observaciones}
              required
            />
            {errors.Observaciones && (
              <ErrorMessage>{errors.Observaciones}</ErrorMessage>
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

export default MatrizPais;
