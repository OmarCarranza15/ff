const SaveModal = async () => {
  const newErrors = { ID_Pais: "", Codigo: "", N_Puesto: "", ID_RSocial: "", ID_Division: "", ID_Departamento: "", ID_CentroCostos: "" };

  // Validación de campos
  if (!modalValues.ID_Pais) {
    newErrors.ID_Pais = "El campo País es obligatorio";
  }
  if (!modalValues.ID_RSocial) {
    newErrors.ID_RSocial = "El campo Razon Social es obligatorio";
  }
  if (!modalValues.ID_Division) {
    newErrors.ID_Division = "El campo Division es obligatorio";
  }
  if (!modalValues.ID_Departamento) {
    newErrors.ID_Departamento = "El campo Departamento es obligatorio";
  }
  if (!modalValues.ID_CentroCostos) {
    newErrors.ID_CentroCostos = "El campo Centro de Costos es obligatorio";
  }

  if (!modalValues.Codigo.trim()) {
    newErrors.Codigo = "El campo Código es obligatorio";
  } else if (/^\d*s/.test(modalValues.Codigo)) {
    newErrors.Codigo = "Solo se aceptan Dígitos";
  }

  if (!modalValues.N_Puesto.trim()) {
    newErrors.N_Puesto = "El campo Nombre es obligatorio";
  } else if (!/^[a-zA-Z\s]+$/.test(modalValues.N_Puesto)) {
    newErrors.N_Puesto = "El campo Nombre solo acepta letras y espacios en blanco";
  }

  setErrors(newErrors);

  // Si no hay errores, proceder a insertar el nuevo puesto
  if (Object.values(newErrors).every((error) => error === "")) {
    try {
      // Verificar si el puesto ya existe en la base de datos
      console.log("Verificando si el puesto ya existe...");
      const response = await axios.get(`http://localhost:3000/puesto`);
      console.log("Datos recibidos del servidor:", response.data);

      const puestoExists = response.data.some(
        (puesto) =>
          puesto.N_Puesto.toLowerCase() === modalValues.N_Puesto.toLowerCase() ||
          puesto.Codigo.toLowerCase() === modalValues.Codigo.toLowerCase()
      );

      if (puestoExists) {
        setErrors({ ...newErrors, N_Puesto: "El Nombre o Codigo del Centro de costos ya existe" });
        return;
      }

      // Datos del nuevo puesto
      const newPuesto = {
        N_Puesto: modalValues.N_Puesto,
        Codigo: modalValues.Codigo,
        ID_Pais: modalValues.ID_Pais,
        ID_Division: modalValues.ID_Division,
        ID_Departamento: modalValues.ID_Departamento,
        ID_CentroCostos: modalValues.ID_CentroCostos,
        ID_RSocial: modalValues.ID_RSocial, 
      };

      console.log("Enviando datos:", newPuesto);

      // Enviar solicitud POST para insertar el nuevo puesto
      const insertResponse = await axios.post(`http://localhost:3000/puesto`, newPuesto);
      console.log("Respuesta de inserción:", insertResponse.data);

      // Actualizar la lista de puestos con el nuevo puesto
      const paisResponse = await axios.get(`http://localhost:3000/pais/${modalValues.ID_Pais}`);
      const divisionResponse = await axios.get(`http://localhost:3000/division/${modalValues.ID_Division}`);
      const departamentoResponse = await axios.get(`http://localhost:3000/departamento/${modalValues.ID_Departamento}`);
      const centrocostoResponse = await axios.get(`http://localhost:3000/centrocosto/${modalValues.ID_CentroCostos}`);
      const rsocialResponse = await axios.get(`http://localhost:3000/rsocial/${modalValues.ID_RSocial}`);

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
          Codigo: modalValues.Codigo,
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
      setModalValues({ ID_Pais: "", Codigo: "", N_Puesto: "", ID_RSocial: "", ID_Division: "", ID_Departamento: "", ID_CentroCostos: "" }); // Limpiar los valores del modal
    } catch (error) {
      console.error("Error al insertar un nuevo Puesto:", error);
    }
  }
};