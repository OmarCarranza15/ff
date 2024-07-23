import React, { useState, useEffect } from "react";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import "../styles/DataTable.css"; // Importa el archivo CSS
import axios from "axios";
import { FaUndo, FaSearch, FaPlus } from "react-icons/fa"; // Importa el ícono de edición
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

function Usuario() {
  //const [usuario] = useState([]);
  const [records, setRecords] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [puestoin, setPuestoin] = useState([]);
  const [rolusuario, setRolusuario] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
  const [modalValues, setModalValues] = useState({
    Usuario: "",
    Nombre: "",
    Contrasenia: "",
    ID_PuestoIn: "",
    ID_RolUsuario: "",
    Fec_Creacion: "",
    Fec_Exp_Acceso: "",
    Fec_Ult_Conexion: "",
  });
  const [errors, setErrors] = useState({
    Usuario: "",
    Nombre: "",
    Contrasenia: "",
    ID_PuestoIn: "",
    ID_RolUsuario: "",
    Fec_Creacion: "",
    Fec_Exp_Acceso: "",
    Fec_Ult_Conexion: "",
  });
  const [showColumns, setShowColumns] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    N_PuestoIn: "",
    N_Rol: "",
    Usuario: "",
    Nombre: "",
    Estado: "",
    Fec_Creacion: "",
    Fec_Exp_Acceso: "",
    Fec_Ult_Conexion: "",
  });

  const today = new Date();
  const oneYearFromToday = new Date(today.setFullYear(today.getFullYear() + 1));

  const [fecExpAcceso, setFecExpAcceso] = useState(
    oneYearFromToday.toISOString().substr(0, 10)
  );

  const handleToggleColumns = () => {
    setShowColumns(!showColumns);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/usuarios/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (usuario) => {
            const puestoinResponse = await axios.get(
              `http://localhost:3000/puestoin/${usuario.ID_PuestoIn}`
            );
            const rolusuarioResponse = await axios.get(
              `http://localhost:3000/rolusuario/${usuario.ID_RolUsuario}`
            );

            return {
              id: usuario.id,
              Usuario: usuario.Usuario,
              Nombre: usuario.Nombre,
              Contrasenia: usuario.Contrasenia,
              Estado:
                usuario.Estado === 1
                  ? "Nuevo"
                  : usuario.Estado === 2
                  ? "En Servicio"
                  : "Expirado",
              ID_PuestoIn: usuario.ID_PuestoIn,
              Fec_Exp_Acceso: usuario.Fec_Exp_Acceso,
              Fec_Creacion: usuario.Fec_Creacion,
              Fec_Ult_Conexion: usuario.Fec_Ult_Conexion,
              ID_RolUsuario: usuario.ID_RolUsuario,
              N_PuestoIn: puestoinResponse.data.N_PuestoIn,
              N_Rol: rolusuarioResponse.data.N_Rol,
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
    const fetchPuestoin = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/puestoin/`);
        setPuestoin(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de Puestoin", error);
      }
    };
    const fetchRolusuario = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/rolusuario/`);
        setRolusuario(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de razon social", error);
      }
    };

    fetchData();
    fetchPuestoin();
    fetchRolusuario();
  }, []);

  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  const generateRandomPassword = () => {
    const length = 12; // Longitud de la contraseña
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.,"; // Caracteres permitidos
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
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
      Usuario: "",
      Nombre: "",
      Contrasenia: "",
      ID_PuestoIn: "",
      ID_RolUsuario: "",
      Fec_Creacion: "",
      Fec_Exp_Acceso: "",
      Fec_Ult_Conexion: "",
      Estado: "",
    });
    setErrors({
      Usuario: "",
      Nombre: "",
      Contrasenia: "",
      ID_PuestoIn: "",
      ID_RolUsuario: "",
      Fec_Creacion: "",
      Fec_Exp_Acceso: "",
      Fec_Ult_Conexion: "",
      Estado: "",
    });
  };
  const handleModalChange = (event, field) => {
    const { value } = event.target;
    setModalValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const SaveModal = async () => {
    const newErrors = {
      Usuario: "",
      Nombre: "",
      Contrasenia: "",
      ID_PuestoIn: "",
      ID_RolUsuario: "",
      Fec_Creacion: "",
      Fec_Exp_Acceso: "",
      Fec_Ult_Conexion: "",
      Estado: "",
    };

    // Generar nueva contraseña
    const newPassword = generateRandomPassword();

    // Validación de campos
    if (!modalValues.Usuario.trim()) {
      newErrors.Usuario = "El código de Usuario es obligatorio.";
    }
    if (!modalValues.Nombre.trim()) {
      newErrors.Nombre = "El nombre del empleado es obligatorio.";
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.Nombre)) {
      newErrors.Nombre =
        "El nombre del empleado solo acepta letras y espacios en blanco.";
    } else {
      newErrors.Nombre = "";
    }
    /*if (!modalValues.Contrasenia.trim()) {
      newErrors.Contrasenia = "El Contrasenia es un campo obligatorio.";
    }*/

    if (!modalValues.ID_PuestoIn.trim()) {
      newErrors.puestoin = "El puesto interno es obligatorio.";
    }
    if (!modalValues.ID_RolUsuario.trim()) {
      newErrors.rolusuario = "El Rol del Usuario es obligatorio.";
    }

   /* if (!modalValues.Fec_Exp_Acceso.trim()) {
      newErrors.Fec_Exp_Acceso = "La fecha de expiración es obligatoria.";
    }*/

    setErrors(newErrors);

    // Si no hay errores, proceder a insertar el nuevo puesto
    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el Usuario ya existe en la base de datos
        console.log("Verificando si el puesto ya existe...");
        const response = await axios.get(`http://localhost:3000/usuarios`);
        console.log("Datos recibidos del servidor:", response.data);

        const usuarios = response.data;

        const usuarioExistente = usuarios.some(
          (usuario) =>
            usuario.Usuario.toLowerCase() === modalValues.Usuario.toLowerCase()
        );

        if (usuarioExistente) {
          const errorMessages = {};
          if (usuarioExistente) {
            errorMessages.Usuario = "El codigo de usuario ya existe";
            setErrors({ ...newErrors, ...errorMessages });
            return;
          }
        }

        // Datos del nuevo puesto
        const newUsuario = {
          Usuario: modalValues.Usuario,
          Nombre: modalValues.Nombre,
          Contrasenia: newPassword, // Usar la contraseña generada
          Fec_Creacion: "2024-05-24",
          Fec_Exp_Acceso: modalValues.Fec_Exp_Acceso,
          Fec_Ult_Conexion: "2024-10-30",
          Estado: 1,
          ID_RolUsuario: modalValues.ID_RolUsuario,
          ID_PuestoIn: modalValues.ID_PuestoIn,
        };

        console.log("Enviando datos:", newUsuario);

        // Enviar solicitud POST para insertar el nuevo puesto
        const insertResponse = await axios.post(
          `http://localhost:3000/usuarios`,
          newUsuario
        );
        console.log("Respuesta de inserción:", insertResponse.data);

        // Actualizar la lista de puestos con el nuevo puesto
        const rolusuarioResponse = await axios.get(
          `http://localhost:3000/rolusuario/${modalValues.ID_RolUsuario}`
        );
        const puestoinResponse = await axios.get(
          `http://localhost:3000/puestoin/${modalValues.ID_PuestoIn}`
        );

        console.log("Datos de respuesta para actualizar la UI:", {
          rolusuarioResponse: rolusuarioResponse.data,
          puestoinResponse: puestoinResponse.data,
        });

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            Usuario: modalValues.Usuario,
            Nombre: modalValues.Nombre,
            Contrasenia: newPassword, // Usar la contraseña generada
            Fec_Exp_Acceso: modalValues.Fec_Exp_Acceso,
            ID_RolUsuario: modalValues.ID_RolUsuario,
            N_Rol: rolusuarioResponse.data.N_Rol,
            ID_PuestoIn: modalValues.ID_PuestoIn,
            N_PuestoIn: puestoinResponse.data.N_PuestoIn,
          },
        ];

        setRecords(updatedRecords);
        setShowModal(false); // Ocultar el modal después de guardar
        setModalValues({
          Usuario: "",
          Nombre: "",
          Contrasenia: "",
          ID_PuestoIn: "",
          ID_RolUsuario: "",
          Fec_Exp_Acceso: "",
        }); // Limpiar los valores del modal
        // Estilo de notificacion
        const toastElement = document.createElement("div");
        toastElement.className = "toast-success";
        toastElement.innerHTML = "¡Usuario insertado correctamente!";

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
  };

  const handleEditChange = (event, field) => {
    const { value } = event.target;
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === "ID_PuestoIn" && {
        N_PuestoIn: puestoin.find((p) => p.id === parseInt(value)).N_PuestoIn,
      }),
      ...(field === "ID_RolUsuario" && {
        N_Rol: rolusuario.find((p) => p.id === parseInt(value)).N_Rol,
      }),
    }));
    validateInput(field, value);
  };

  const validateInput = (field, value) => {
    let newErrors = { ...errors };
    if (field === "Usuario") {
      if (!value.trim()) {
        newErrors.Usuario = "El código del Usuario es obligatorio.";
      } else {
        newErrors.Usuario = "";
      }
    } else if (field === "nombre") {
      if (!value.trim()) {
        newErrors.Nombre = "El nombre del empleado es obligatorio.";
      } else if (!/^[a-zA-Z\s]+$/.test(modalValues.Nombre)) {
        newErrors.Nombre =
          "El nombre del empleado solo acepta letras y espacios en blanco.";
      } else {
        newErrors.Nombre = "";
      }
    } else if (field === "Contrasenia") {
      if (!value.trim()) {
        newErrors.Contrasenia = "El campo Contraseña es obligatorio.";
      } else {
        newErrors.Contrasenia = "";
      }
    } else if (field === "Fec_Exp_Acceso") {
      if (!value.trim()) {
        newErrors.Fec_Exp_Acceso =
          "La fecha de expiración de acceso es obligatoria.";
      } else {
        newErrors.Fec_Exp_Acceso = "";
      }
    } else if (field === "ID_RolUsuario") {
      if (!value.trim()) {
        newErrors.ID_RolUsuario = "El campo Rol Usuario";
      } else {
        newErrors.ID_RolUsuario = "";
      }
      setErrors(newErrors);
    } else if (field === "ID_PuestoIn") {
      if (!value.trim()) {
        newErrors.ID_PuestoIn = "El campo puesto interno";
      } else {
        newErrors.ID_PuestoIn = "";
      }
      setErrors(newErrors);
    }
  };
  const saveChanges = async (id) => {
    try {
      const updateRow = {
        ...editedRow,
        Estado:
          editedRow.Estado === "Nuevo"
            ? 1
            : editedRow.Estado === "En Servicio"
            ? 2
            : 3,
      };

      // Verificar si el Usuario ya existe en la base de datos
      console.log("Verificando si el puesto ya existe...");
      const response = await axios.get(`http://localhost:3000/usuarios`);
      console.log("Datos recibidos del servidor:", response.data);

      const usuarios = response.data;

      const usuarioExistente = usuarios.some(
        (usuario) =>
          usuario.Usuario.toLowerCase() === editedRow.Usuario.toLowerCase() &&
          usuario.id !== id
      );

      if (usuarioExistente) {
        setErrors({
          usuario: "El usuario ya existe.",
        });

        const errorNotification = document.createElement("div");
        errorNotification.className = "error-notification";
        errorNotification.innerHTML = `
          <span class="error-icon">!</span>
          <span class="error-message">
            El código de usuario que intenta actualizar ya existe en la base de datos.
            Por favor, ingrese un usuario diferente.
          </span>
        `;

        document.body.appendChild(errorNotification);

        // Ocultar la notificación después de 2 segundos
        setTimeout(() => {
          errorNotification.remove();
        }, 2000);
        return;
      }

      await axios.put(`http://localhost:3000/usuarios/${id}`, updateRow);

      const updatedRecords = records.map((row) =>
        row.id === id ? { ...editedRow } : row
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

  const filteredData = records.filter((row) => {
    return (
      (filters.N_PuestoIn === "" ||
        row.N_PuestoIn.toLowerCase().includes(
          filters.N_PuestoIn.toLowerCase()
        )) &&
      (filters.N_Rol === "" ||
        row.N_Rol.toLowerCase().includes(filters.N_Rol.toLowerCase())) &&
      (filters.Usuario === "" ||
        row.Usuario.toLowerCase().includes(filters.Usuario.toLowerCase())) &&
      (filters.Nombre === "" ||
        row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())) &&
      (filters.Fec_Creacion === "" ||
        row.Fec_Creacion.toLowerCase().includes(
          filters.Fec_Creacion.toLowerCase()
        )) &&
      (filters.Fec_Ult_Conexion === "" ||
        row.Fec_Ult_Conexion.toLowerCase().includes(
          filters.Fec_Ult_Conexion.toLowerCase()
        )) &&
      (filters.Fec_Exp_Acceso === "" ||
        row.Fec_Exp_Acceso.toLowerCase().includes(
          filters.Fec_Exp_Acceso.toLowerCase()
        )) &&
      (filters.Estado === "" ||
        row.Estado.toLowerCase().includes(filters.Estado.toLowerCase()))
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
      name: "Puesto Interno",
      selector: (row) => row.N_PuestoIn,
      sortable: true,
      minWidth: "370px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledSelect
            value={editedRow.ID_PuestoIn}
            onChange={(e) => handleEditChange(e, "ID_PuestoIn")}
          >
            {puestoin.map((puestoin) => (
              <option key={puestoin.id} value={puestoin.id}>
                {puestoin.N_PuestoIn}
              </option>
            ))}
          </StyledSelect>
        ) : (
          <div>{row.N_PuestoIn}</div>
        ),
    },
    {
      name: "Rol del Usuario",
      selector: (row) => row.N_Rol,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledSelect
            value={editedRow.ID_RolUsuario}
            onChange={(e) => handleEditChange(e, "ID_RolUsuario")}
          >
            {rolusuario.map((rolusuario) => (
              <option key={rolusuario.id} value={rolusuario.id}>
                {rolusuario.N_Rol}
              </option>
            ))}
          </StyledSelect>
        ) : (
          <div>{row.N_Rol}</div>
        ),
    },
    {
      name: "Usuario",
      selector: (row) => row.Usuario,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "200px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Usuario}
            onChange={(e) => handleEditChange(e, "Usuario")}
          />
        ) : (
          <div>{row.Usuario}</div>
        ),
    },
    {
      name: "Nombre",
      selector: (row) => row.Nombre,
      sortable: true,
      minWidth: "300px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Nombre}
            onChange={(e) => handleEditChange(e, "Nombre")}
          />
        ) : (
          <div>{row.Nombre}</div>
        ),
    },
    {
      name: "Contraseña",
      selector: (row) => row.Contrasenia,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "500px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="password"
            value={editedRow.Contrasenia}
            onChange={(e) => handleEditChange(e, "Contrasenia")}
          />
        ) : (
          <div>*********</div>
        ),
    },
    {
      name: "Fecha de Creacion",
      selector: (row) => row.Fec_Creacion,
      omit: !showColumns,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => <div>{row.Fec_Creacion}</div>,
    },
    {
      name: "Fecha de Ultima Conexion",
      selector: (row) => row.Fec_Ult_Conexion,
      omit: !showColumns,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => <div>{row.Fec_Ult_Conexion}</div>,
    },
    {
      name: "Fecha de Expiracion",
      selector: (row) => row.Fec_Exp_Acceso,
      omit: !showColumns,
      sortable: true,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="date"
            value={editedRow.Fec_Exp_Acceso}
            onChange={(e) => handleEditChange(e, "Fec_Exp_Acceso")}
          />
        ) : (
          <div>{row.Fec_Exp_Acceso}</div>
        ),
    },
    {
      name: "Estado",
      selector: (row) =>
        editMode === row.id ? (
          <StyledSelect
            value={editedRow.Estado}
            onChange={(e) => handleEditChange(e, "Estado")}
          >
            {/*<option value={"Nuevo"}>Nuevo</option>*/}
            <option value={"En Servicio"}>En Servicio</option>
            <option value={"Expirado"}>Expirado</option>
          </StyledSelect>
        ) : (
          <div>{row.Estado}</div>
        ),
      sortable: true,
    },
    {
      name: "Acciones",
      minWidth: "170px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "170px", // Ajusta el tamaño máximo según sea necesario
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
                    "¿Estás seguro que deseas eliminar este Usuario?"
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
      N_PuestoIn: "",
      N_Rol: "",
      Usuario: "",
      Nombre: "",
      Estado: "",
      Fec_Creacion: "",
      Fec_Exp_Acceso: "",
      Fec_Ult_Conexion: "",
    });
  };

  return (
    <MainContainer>
      <TopBar />
      <ContentContainer>
        <Sidebar />
        <DataTableContainer>
          <HeaderContainer>
            <Title>
              <h2 className="Title">Usuarios</h2>
            </Title>
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
                Nuevo Usuario
              </Button>
            </ButtonGroup>
          </HeaderContainer>
          <FilterWrapper show={showFilters}>
            <FilterInput
              type="text"
              value={filters.N_PuestoIn}
              onChange={(e) => handleFilterChange(e, "N_PuestoIn")}
              placeholder="Buscar por Puesto Interno"
            />
            <FilterInput
              type="text"
              value={filters.N_Rol}
              onChange={(e) => handleFilterChange(e, "N_Rol")}
              placeholder="Buscar por Rol del Usuario"
            />
            <FilterInput
              type="text"
              value={filters.Usuario}
              onChange={(e) => handleFilterChange(e, "Usuario")}
              placeholder="Buscar por Usuario"
            />
            <FilterInput
              type="text"
              value={filters.Nombre}
              onChange={(e) => handleFilterChange(e, "Nombre")}
              placeholder="Buscar por Nombre"
            />
            {showColumns && (
              <>
                <FilterInput
                  type="text"
                  value={filters.Fec_Creacion}
                  onChange={(e) => handleFilterChange(e, "Fec_Creacion")}
                  placeholder="Buscar por Fecha de Creacion"
                />
                <FilterInput
                  type="text"
                  value={filters.Fec_Ult_Conexion}
                  onChange={(e) => handleFilterChange(e, "Fec_Ult_Conexion")}
                  placeholder="Buscar por ultima conexion"
                />
                <FilterInput
                  type="text"
                  value={filters.Fec_Exp_Acceso}
                  onChange={(e) => handleFilterChange(e, "Fec_Exp_Acceso")}
                  placeholder="Buscar por Fecha de Expiracion"
                />
              </>
            )}
            <FilterInput
              type="text"
              value={filters.Estado}
              onChange={(e) => handleFilterChange(e, "Estado")}
              placeholder="Buscar por Estado"
            />
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
              data={filteredData}
              pagination
              paginationPerPage={30}
              showFilters={showFilters}
              customStyles={customStyles}
            />
          )}
        </DataTableContainer>
      </ContentContainer>
      {/* Modal para insertar un nuevo usuario */}
      {showModal && (
        <ModalBackground>
          <ModalWrapper>
            <ModalTitle>Nuevo Usuario</ModalTitle>
            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Código del Usuario:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.Usuario}
              onChange={(e) => handleModalChange(e, "Usuario")}
              placeholder="Ingrese el Código"
              error={errors.Usuario}
              required
            />
            {errors.Usuario && <ErrorMessage>{errors.Usuario}</ErrorMessage>}
            <div style={{ margin: "15px" }} />

            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Nombre del Empleado:</span>
            </label>
            <input
              class="form-control"
              type="text"
              value={modalValues.Nombre}
              onChange={(e) => handleModalChange(e, "Nombre")}
              placeholder="Ingrese el Nombre"
              onKeyPress={(e) => {
                if (!/^[a-zA-ZÑñ-]$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              error={errors.Nombre}
              required
            />
            {errors.Nombre && <ErrorMessage>{errors.Nombre}</ErrorMessage>}
            <div style={{ margin: "15px" }} />

            {/*<ModalInput
              type="password"
              value={modalValues.Contrasenia}
              onChange={(e) => handleModalChange(e, "Contrasenia")}
              placeholder="Contraseña del Empleado"
              error={errors.Contrasenia}
              required
            />*/}
            {errors.Contrasenia && (
              <ErrorMessage>{errors.Contrasenia}</ErrorMessage>
            )}

            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Rol:</span>
            </label>
            <select
              class="form-select"
              aria-label="Default select example"
              value={modalValues.ID_RolUsuario}
              onChange={(e) => handleModalChange(e, "ID_RolUsuario")}
              error={errors.rolusuario}
              required
            >
              <option value="">Seleccione un rol de usuario</option>
              {rolusuario.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Rol}
                </option>
              ))}
            </select>
            {errors.rolusuario && (
              <ErrorMessage>{errors.rolusuario}</ErrorMessage>
            )}
            <div style={{ margin: "15px" }} />

            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Puesto Interno:</span>
            </label>
            <select
              class="form-select"
              aria-label="Default select example"
              value={modalValues.ID_PuestoIn}
              onChange={(e) => handleModalChange(e, "ID_PuestoIn")}
              error={errors.puestoin}
              required
            >
              <option value="">Seleccione un puesto interno</option>
              {puestoin.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_PuestoIn}
                </option>
              ))}
            </select>
            {errors.puestoin && <ErrorMessage>{errors.puestoin}</ErrorMessage>}
            <div style={{ margin: "15px" }} />

            <label
              style={{ width: "100%", display: "block", textAlign: "left" }}
            >
              <span style={{ textAlign: "left" }}>Fecha de Expiración:</span>
            </label>
            <input
              class="form-control"
              type="date"
              value={fecExpAcceso}
              onChange={(e) => {
                setFecExpAcceso(e.target.value);
                handleModalChange(e, "Fec_Exp_Acceso");
              }}
              error={errors.Fec_Exp_Acceso}
              required
            />
            {errors.Fec_Exp_Acceso && (
              <ErrorMessage>{errors.Fec_Exp_Acceso}</ErrorMessage>
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

export default Usuario;
