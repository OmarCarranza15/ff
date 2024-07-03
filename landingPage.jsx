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
  };

  // Validación de campos
  if (!modalValues.ID_Pais) {
    newErrors.pais = "El campo País es obligatorio";
  }
  if (!modalValues.ID_Puesto) {
    newErrors.puesto = "El campo Puesto es obligatorio";
  }
  if (!modalValues.ID_Aplicaciones) {
    newErrors.aplicacion = "El campo Aplicación es obligatorio";
  }
  if (!modalValues.Rol.trim()) {
    newErrors.Rol = "El rol es obligatorio";
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

      const perfilExistente = perfiles.some(
        (perfil) =>
          perfil.ID_Pais.toString() === modalValues.ID_Pais &&
          perfil.ID_Aplicaciones.toString() === modalValues.ID_Aplicaciones &&
          perfil.ID_Puesto.toString() === modalValues.ID_Puesto &&
          perfil.Rol.toLowerCase() === modalValues.Rol.toLowerCase() &&
          perfil.Puesto_Jefe.toLowerCase() === modalValues.Puesto_Jefe.toLowerCase()
      );

      if (perfilExistente) {
        setErrors({
          ...newErrors,
          ID_Pais: "El perfil ya existe con los valores proporcionados",
        });
        return;
      }

      // Datos del nuevo perfil
      const newPerfil = {
        Estado_Perfil: 1,
        ID_Pais: parseInt(modalValues.ID_Pais, 10),
        ID_Aplicaciones: parseInt(modalValues.ID_Aplicaciones, 10),
        ID_Puesto: parseInt(modalValues.ID_Puesto, 10),
        Rol: modalValues.Rol,
        Ticket: parseInt(modalValues.Ticket, 10),
        Observaciones: modalValues.Observaciones,
        Puesto_Jefe: modalValues.Puesto_Jefe,
      };

      console.log("Enviando datos:", newPerfil);

      // Enviar solicitud POST para insertar el nuevo perfil
      const insertResponse = await axios.post(
        `http://localhost:3000/perfil`,
        newPerfil
      );

      console.log("Respuesta de inserción:", insertResponse.data);

      // Actualizar la lista de perfiles con el nuevo perfil
      const paisResponse = await axios.get(
        `http://localhost:3000/pais/${modalValues.ID_Pais}`
      );
      const aplicacionResponse = await axios.get(
        `http://localhost:3000/aplicacion/${modalValues.ID_Aplicaciones}`
      );
      const puestoResponse = await axios.get(
        `http://localhost:3000/puesto/${modalValues.ID_Puesto}`
      );

      console.log("Datos de respuesta para actualizar la UI:", {
        paisResponse: paisResponse.data,
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
          ID_Pais: modalValues.ID_Pais,
          N_Pais: paisResponse.data.N_Pais,
          ID_Aplicaciones: modalValues.ID_Aplicaciones,
          N_Aplicaciones: aplicacionResponse.data.N_Aplicaciones,
          ID_Puesto: modalValues.ID_Puesto,
          N_Puesto: puestoResponse.data.N_Puesto,
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
      }); // Limpiar los valores del modal
    } catch (error) {
      console.error("Error al insertar un nuevo Perfil:", error);
    }
  }
};

const startEdit = (row) => {
  setEditedRow({ ...row });
  setEditMode(row.id);
};