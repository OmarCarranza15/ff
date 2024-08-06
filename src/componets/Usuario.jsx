import React, { useState, useEffect } from "react";
import Sidebar from "./SideNavBar.jsx"; // Ajusta la ruta según la ubicación real de Sidebar.jsx
import TopBar from "./TopBar.jsx"; // Ajusta la ruta según la ubicación real de TopBar.jsx
import "../styles/DataTable.css"; // Importa el archivo CSS
import axios from "axios";
import CryptoJS from "crypto-js";
import { FaUndo, FaSearch, FaPlus, FaRegCopy  } from "react-icons/fa"; // Importa el ícono de edición
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

function Usuario() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const [userId, setUserId] = useState(null);
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
    const encryptedUser = sessionStorage.getItem("userId");
    if (encryptedUser) {
      const decryptedUser = decryptData(encryptedUser);
      //console.log('Rol desencriptado:', decryptedRole); // Consola para verificar el rol desencriptado
      setUserId(decryptedUser);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/usuarios/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (usuario) => {
            const [puestoinResponse, rolusuarioResponse] = await Promise.all([
              axios.get(
                `http://localhost:3000/puestoin/${usuario.ID_PuestoIn}`
              ),
              axios.get(
                `http://localhost:3000/rolusuario/${usuario.ID_RolUsuario}`
              ),
            ]);

            return {
              id: usuario.id,
              Usuario: usuario.Usuario,
              Nombre: usuario.Nombre,
              Contrasenia: usuario.Contrasenia,
              Estado:
                usuario.Estado === 1
                  ? "NUEVO"
                  : usuario.Estado === 2
                  ? "EN SERVICIO"
                  : "EXPIRADO",
              ID_PuestoIn: usuario.ID_PuestoIn,
              Fec_Creacion: usuario.Fec_Creacion,
              Fec_Ult_Conexion: usuario.Fec_Ult_Conexion,
              ID_RolUsuario: usuario.ID_RolUsuario,
              N_PuestoIn: puestoinResponse.data.N_PuestoIn,
              N_Rol: rolusuarioResponse.data.N_Rol,
            };
          })
        );
        setRecords(mappedData);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      } finally {
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
        console.error("Error al obtener la lista de rolusuario", error);
      }
    };

    fetchData();
    fetchPuestoin();
    fetchRolusuario();
  }, []); // Dependencias vacías si los datos no cambian a menudo

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
    let newValue = value;
    if (field !== "Nombre") {
      newValue = value.toUpperCase();
    }
    setModalValues((prevValues) => ({ ...prevValues, [field]: newValue }));
  };

  const SaveModal = async () => {
    const newErrors = {
      Usuario: "",
      Nombre: "",
      Contrasenia: "",
      ID_PuestoIn: "",
      ID_RolUsuario: "",
      Fec_Exp_Acceso: "",
    };

    const newPassword = generateRandomPassword();

    // Validación de campos
    if (!modalValues.Usuario.trim()) {
      newErrors.Usuario = "El código de Usuario es obligatorio.";
    }
    if (!modalValues.Nombre.trim()) {
      newErrors.Nombre = "El nombre del empleado es obligatorio.";
    } else if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s-]+$/.test(modalValues.Nombre)) {
      newErrors.Nombre =
        "El nombre del empleado solo acepta letras y espacios en blanco.";
    }
    if (!modalValues.ID_PuestoIn.trim()) {
      newErrors.ID_PuestoIn = "El puesto interno es obligatorio.";
    }
    if (!modalValues.ID_RolUsuario.trim()) {
      newErrors.ID_RolUsuario = "El Rol del Usuario es obligatorio.";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        // Verificar si el Usuario ya existe en la base de datos
        const response = await axios.get(`http://localhost:3000/usuarios`);
        const usuarios = response.data;
        const usuarioExistente = usuarios.some(
          (usuario) =>
            usuario.Usuario.toLowerCase() === modalValues.Usuario.toLowerCase()
        );

        if (usuarioExistente) {
          setErrors({ Usuario: "El código de usuario ya existe" });
          return;
        }

        // Datos del nuevo usuario
        const newUsuario = {
          Usuario: modalValues.Usuario,
          Nombre: modalValues.Nombre,
          Contrasenia: newPassword,
          Fec_Creacion: new Date(),
          Fec_Exp_Acceso: "2025-10-17",
          Fec_Ult_Conexion: "2024-10-30",
          Estado: 1,
          ID_RolUsuario: modalValues.ID_RolUsuario,
          ID_PuestoIn: modalValues.ID_PuestoIn,
        };

        // Enviar solicitud POST para insertar el nuevo usuario
        const insertResponse = await axios.post(
          `http://localhost:3000/usuarios`,
          newUsuario
        );

        // Actualizar la lista de registros con el nuevo usuario
        const rolusuarioResponse =
          rolusuario.find(
            (rol) => rol.id === parseInt(modalValues.ID_RolUsuario)
          ) || {}; // Usar objeto vacío si no se encuentra
        const puestoinResponse =
          puestoin.find(
            (puesto) => puesto.id === parseInt(modalValues.ID_PuestoIn)
          ) || {}; // Usar objeto vacío si no se encuentra

        const newIndex = records.length + 1;

        // Preparar datos de auditoría
        const auditoriaData = {
          Campo_Nuevo: `- Puesto Interno: ${
            puestoinResponse.N_PuestoIn || "No Disponible"
          }¬ 
                         - Rol del Usuario: ${
                           rolusuarioResponse.N_Rol || "No Disponible"
                         }¬
                         - Usuario: ${modalValues.Usuario}¬ - Nombre: ${
            modalValues.Nombre
          }¬ 
                         - Estado: NUEVO `,
          Tabla: "Usuarios",
          Accion: 1, // Inserción
          ID_Usuario: userId,
          N: newIndex,
        };

        // Registrar en la auditoría
        await axios.post("http://localhost:3000/auditoria", auditoriaData);

        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            Usuario: modalValues.Usuario,
            Nombre: modalValues.Nombre,
            Contrasenia: newPassword,
            Fec_Exp_Acceso: modalValues.Fec_Exp_Acceso,
            ID_RolUsuario: modalValues.ID_RolUsuario,
            N_Rol: rolusuarioResponse.N_Rol || "No Disponible",
            ID_PuestoIn: modalValues.ID_PuestoIn,
            N_PuestoIn: puestoinResponse.N_PuestoIn || "No Disponible",
          },
        ];

        setRecords(updatedRecords);
        handleCloseModal();

        // Notificación de éxito
        const toastElement = document.createElement("div");
        toastElement.className = "toast-success";
        toastElement.innerHTML = "¡Usuario insertado correctamente!";
        document.body.appendChild(toastElement);
        setTimeout(() => {
          toastElement.remove();
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Error al insertar un nuevo usuario:", error);
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
    setEditedRow({ ...row });
    setEditMode(row.id);
  };

  const handleEditChange = (event, field) => {
    const { value } = event.target;
    let newValue = value;
    if (field !== "Nombre") {
      newValue = value.toUpperCase();
    }
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: newValue,
      ...(field === "ID_PuestoIn" && {
        N_PuestoIn: puestoin.find((p) => p.id === parseInt(newValue))
          .N_PuestoIn,
      }),
      ...(field === "ID_RolUsuario" && {
        N_Rol: rolusuario.find((p) => p.id === parseInt(newValue)).N_Rol,
      }),
    }));
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

    if (!editedRow.Usuario.trim()) {
      setErrors({ Usuario: "El campo Usuario no puede estar vacío" });
      showNotification("El campo Usuario no puede estar vacío");
      return;
    } else if (!editedRow.Nombre.trim()) {
      setErrors({ Nombre: "El campo Nombre no puede estar vacío" });
      showNotification("El campo Nombre no puede estar vacío");
      return;
    }

    try {
      // No hacer nada si el estado es "Nuevo"
      const currentRow = records.find((row) => row.id === id);
      if (currentRow.Estado === "NUEVO") {
        return; // Evitar la actualización
      }

      // Validar que los campos nombre y usuario no estén vacíos
      if (!editedRow.Nombre || !editedRow.Usuario) {
        setErrors({
          nombre: !editedRow.Nombre ? "El nombre es requerido." : "",
          usuario: !editedRow.Usuario ? "El usuario es requerido." : "",
        });

        const errorNotification = document.createElement("div");
        errorNotification.className = "error-notification";
        errorNotification.innerHTML = `
          <span class="error-icon">!</span>
          <span class="error-message">
           Los campos Usuario y Nombre no pueden estar vacios.
          </span>
        `;

        document.body.appendChild(errorNotification);

        // Ocultar la notificación después de 2 segundos
        setTimeout(() => {
          errorNotification.remove();
        }, 2000);
        return;
      }

      // Actualizar el estado normalmente si no es "Nuevo"
      const updateRow = {
        ...editedRow,
        Estado:
          editedRow.Estado === "NUEVO"
            ? 1
            : editedRow.Estado === "EN SERVICIO"
            ? 2
            : editedRow.Estado === "EXPIRADO"
            ? 3
            : currentRow.Estado,
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

      // Obtener el valor original del campo
      const originalRow = records.find((row) => row.id === id);

      const editedIndex = records.findIndex((row) => row.id === id) + 1;

      // Construir los valores para la auditoría
      const originalPuestoIn = originalRow.N_PuestoIn;
      const originalRolUsuario = originalRow.N_Rol;
      const originalUsuario = originalRow.Usuario;
      const originalNombre = originalRow.Nombre;
      const originalEstado = originalRow.Estado;

      const EditedPuestoIn = editedRow.N_PuestoIn;
      const EditedRolUsuario = editedRow.N_Rol;
      const EditedUsuario = editedRow.Usuario;
      const EditedNombre = editedRow.Nombre;
      const EditedEstado = editedRow.Estado;

      const hasPuestoInChanged = originalPuestoIn !== EditedPuestoIn;
      const hasRolUsuarioChanged = originalRolUsuario !== EditedRolUsuario;
      const hasUsuarioChanged = originalUsuario !== EditedUsuario;
      const hasNombreChanged = originalNombre !== EditedNombre;
      const hasEstadoChanged = originalEstado !== EditedEstado;

      const auditoriaData = {
        Campo_Original: [
          hasPuestoInChanged ? `- Puesto Interno: ${originalPuestoIn}` : "",
          hasRolUsuarioChanged ? `- Rol Usuario: ${EditedRolUsuario}` : "",
          hasUsuarioChanged ? `- Usuario: ${originalUsuario}` : "",
          hasNombreChanged ? `- Nombre: ${originalNombre}` : "",
          hasEstadoChanged ? `- Estado: ${originalEstado}` : "",
        ]
          .filter(Boolean)
          .join("¬ "),
        Campo_Nuevo: [
          hasPuestoInChanged ? `- Puesto Interno: ${EditedPuestoIn}` : "",
          hasRolUsuarioChanged ? `- Rol Usuario: ${EditedRolUsuario}` : "",
          hasUsuarioChanged ? `- Usuario: ${EditedUsuario}` : "",
          hasNombreChanged ? `- Nombre: ${EditedNombre}` : "",
          hasEstadoChanged ? `- Estado: ${EditedEstado}` : "",
        ]
          .filter(Boolean)
          .join("¬ "),
        Tabla: "Usuarios",
        Accion: 2, // Modificación
        ID_Usuario: userId,
        N: editedIndex,
      };

      if (auditoriaData.Campo_Original || auditoriaData.Campo_Nuevo) {
        await axios.post("http://localhost:3000/auditoria", auditoriaData);
      }

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

  const resetPassword = async (userId) => {
    try {
      const newPassword = generateRandomPassword();
      // Actualizar el usuario con la nueva contraseña y estado "nuevo"
      await axios.put(`http://localhost:3000/usuarios/${userId}`, {
        Contrasenia: newPassword,
        Estado: 1, // Cambia el estado a "nuevo"
      });

      // Notificación de éxito
      const toastElement = document.createElement("div");
      toastElement.className = "toast-success";
      toastElement.innerHTML = "¡Contraseña restablecida correctamente!";
      document.body.appendChild(toastElement);
      setTimeout(() => {
        toastElement.remove();
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
    }
  };

  const columns = [
    {
      name: "N°",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
      minWidth: "60px",
      maxWidth: "60px",
    },
    {
      name: "Puesto Interno",
      selector: (row) => row.N_PuestoIn,
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
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "250px", // Ajusta el tamaño máximo según sea necesario
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
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "250px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Usuario}
            onChange={(e) => handleEditChange(e, "Usuario")}
            onClick={() => handleInputClick("Usuario")}
            onKeyPress={(e) => {
              const regex = /^[a-zA-Z0-9]$/;
              if (!regex.test(e.key)) {
                e.preventDefault();
              }
            }}
            onInput={(e) => {
              const value = e.target.value;
              const newValue = value
                .toLowerCase()
                .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
              e.target.value = newValue;
              handleModalChange(e, "Usuario"); // <--- Cambié "pais" por "Usuario"
            }}
          />
        ) : (
          <div>{row.Usuario}</div>
        ),
    },
    {
      name: "Nombre",
      selector: (row) => row.Nombre,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "250px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) =>
        editMode && editedRow?.id === row.id ? (
          <StyledInput
            type="text"
            value={editedRow.Nombre}
            onChange={(e) => handleEditChange(e, "Nombre")}
            onClick={() => handleInputClick("Nombre")}
            onKeyPress={(e) => {
              const regex = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s-]$/;
              if (!regex.test(e.key)) {
                e.preventDefault();
              }
              // Verificar si el usuario está intentando ingresar un guion seguido
              if (e.key === '-' && e.target.value.endsWith('-')) {
                e.preventDefault();
              }
            }}
            onInput={(e) => {
              const value = e.target.value;
              const newValue = value
                .toLowerCase()
                .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
              e.target.value = newValue;
              handleModalChange(e, "Nombre");
            }}
          />
        ) : (
          <div>{row.Nombre}</div>
        ),
    },
    {
      name: "Contraseña",
      selector: (row) => row.Contrasenia,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "200px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => {
        if (row.Estado === "NUEVO") {
          return (
            <div style={{ display: "flex", justifyContent: "space-between",alignItems: "center" }}>
              <span style={{ flexGrow: 1, marginRight: "8px", minWidth: "150px", textAlign:"left" }}>{row.Contrasenia}</span>
              <FaRegCopy
                style={{
                  fontSize: "18px",
                  color: "#337ab7", // Azul claro
                  cursor: "pointer",
                   // Agrega un margen derecho de 4px
                }}
                onClick={() => {
                  navigator.clipboard.writeText(row.Contrasenia);
                }}
              />
            </div>
          );
        } else {
          return <div>*********</div>;
        }
      },
    },
    {
      name: "Fecha de Creacion",
      selector: (row) => row.Fec_Creacion,
      omit: !showColumns,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => <div>{row.Fec_Creacion}</div>,
    },
    {
      name: "Fecha de Ultima Conexion",
      selector: (row) => row.Fec_Ult_Conexion,
      omit: !showColumns,
      minWidth: "200px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "300px", // Ajusta el tamaño máximo según sea necesario
      cell: (row) => <div>{row.Fec_Ult_Conexion}</div>,
    },
    {
      name: "Fecha de Expiracion",
      selector: (row) => row.Fec_Exp_Acceso,
      omit: !showColumns,
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
      minWidth: "120px",
      maxWidth: "120px",
      selector: (row) =>
        editMode === row.id ? (
          row.Estado === "NUEVO" ? (
            <div>{row.Estado}</div> // Mostrar texto si el estado es "Nuevo"
          ) : (
            <StyledSelect
              value={editedRow.Estado}
              onChange={(e) => handleEditChange(e, "Estado")}
            >
              <option value={"EN SERVICIO"}>EN SERVICIO</option>
              <option value={"EXPIRADO"}>EXPIRADO</option>
            </StyledSelect>
          )
        ) : (
          <div>{row.Estado}</div>
        ),
    },
    {
      name: "Acciones",
      minWidth: "180px", // Ajusta el tamaño mínimo según sea necesario
      maxWidth: "200px", // Ajusta el tamaño máximo según sea necesario
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
                    "¿Estás seguro que deseas restablecer la contraseña de este Usuario?"
                  )
                ) {
                  resetPassword(row.id); // Llama a la función para restablecer la contraseña
                }
              }}
            >
              Restablecer
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
                <FaSearch style={{ margin: "0px 5px" }} />
                {showFilters ? "Ocultar" : "Buscar"}
              </Button>
              <Button
                style={{ marginRight: "30px" }}
                className="btn btn-outline-success"
                onClick={handleInsert}
              >
                <FaPlus style={{ margin: "0px 5px" }} />
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
              paginationPerPage={15}
              showFilters={showFilters}
              customStyles={customStyles}
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
              onKeyPress={(e) => {
                const regex = /^[a-zA-Z0-9]$/;
                if (!regex.test(e.key)) {
                  e.preventDefault();
                }
              }}
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
              onInput={(e) => {
                const value = e.target.value;
                const newValue = value
                  .toLowerCase()
                  .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
                e.target.value = newValue;
                handleModalChange(e, "Nombre");
              }}
              onChange={(e) => handleModalChange(e, "Nombre")}
              onKeyPress={(e) => {
                const regex = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s-]$/;
                if (!regex.test(e.key)) {
                  e.preventDefault();
                }
                // Verificar si el usuario está intentando ingresar un guion seguido
                if (e.key === '-' && e.target.value.endsWith('-')) {
                  e.preventDefault();
                }
              }}
              placeholder="Ingrese el Nombre"
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
              error={errors.ID_RolUsuario}
              required
            >
              <option value="">Seleccione un rol de usuario</option>
              {rolusuario.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_Rol}
                </option>
              ))}
            </select>
            {errors.ID_RolUsuario && (
              <ErrorMessage>{errors.ID_RolUsuario}</ErrorMessage>
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
              error={errors.ID_PuestoIn}
              required
            >
              <option value="">Seleccione un puesto interno</option>
              {puestoin.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.N_PuestoIn}
                </option>
              ))}
            </select>
            {errors.ID_PuestoIn && (
              <ErrorMessage>{errors.ID_PuestoIn}</ErrorMessage>
            )}
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
