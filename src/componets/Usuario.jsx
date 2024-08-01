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


 const newPassword = generateRandomPassword();


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
    } else if (!/^[a-zA-Z\s]+$/.test(modalValues.Nombre)) {
      newErrors.Nombre = "El nombre del empleado solo acepta letras y espacios en blanco.";
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
          (usuario) => usuario.Usuario.toLowerCase() === modalValues.Usuario.toLowerCase()
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
        const rolusuarioResponse = rolusuario.find(
          (rol) => rol.id === parseInt(modalValues.ID_RolUsuario)
        ) || {}; // Usar objeto vacío si no se encuentra
        const puestoinResponse = puestoin.find(
          (puesto) => puesto.id === parseInt(modalValues.ID_PuestoIn)
        ) || {}; // Usar objeto vacío si no se encuentra
  
        const newIndex = records.length + 1;
  
        // Preparar datos de auditoría
        const auditoriaData = {
          Campo_Nuevo: `- Puesto Interno: ${puestoinResponse.N_PuestoIn || 'No Disponible'}, 
                         - Rol del Usuario: ${rolusuarioResponse.N_Rol || 'No Disponible'}.
                         - Usuario: ${modalValues.Usuario}. - Nombre: ${modalValues.Nombre}. 
                         - Estado: Nuevo `,
          Tabla: 'Usuarios',
          Accion: 1, // Inserción
          ID_Usuario: userId,
          N: newIndex
        };
  
        // Registrar en la auditoría
        await axios.post('http://localhost:3000/auditoria', auditoriaData);
  
        const updatedRecords = [
          ...records,
          {
            id: insertResponse.data.id,
            Usuario: modalValues.Usuario,
            Nombre: modalValues.Nombre,
            Contrasenia: newPassword,
            Fec_Exp_Acceso: modalValues.Fec_Exp_Acceso,
            ID_RolUsuario: modalValues.ID_RolUsuario,
            N_Rol: rolusuarioResponse.N_Rol || 'No Disponible',
            ID_PuestoIn: modalValues.ID_PuestoIn,
            N_PuestoIn: puestoinResponse.N_PuestoIn || 'No Disponible',
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

                }
              }}
            >
              Restablecer
            </Button>
          </ButtonGroup>
        ),
    },
