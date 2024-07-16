useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/puesto/`);
      const data = response.data;
      const mappedData = await Promise.all(
        data.map(async (puesto) => {
          const paisResponse = await axios.get(`http://localhost:3000/pais/${puesto.ID_Pais}`);
          const rsocialResponse = await axios.get(`http://localhost:3000/rsocial/${puesto.ID_RSocial}`);
          const divisionResponse = await axios.get(`http://localhost:3000/division/${puesto.ID_Division}`);
          const departamentoResponse = await axios.get(`http://localhost:3000/departamento/${puesto.ID_Departamento}`);
          const centrocostoResponse = await axios.get(`http://localhost:3000/centrocosto/${puesto.ID_CentroCostos}`);

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
      console.error('Error al obtener los Puestos:', error);
      setLoading(false);
    }
  };

  const fetchPais = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/pais/`);
      setPais(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de Paises', error);
    }
  };

  const fetchRsocial = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/rsocial?ID_Pais=${modalValues.ID_Pais}`);
      setRsocial(response.data.map((rs) => ({ value: rs.ID_RSocial, label: rs.N_RSocial })));
    } catch (error) {
      console.error('Error al obtener la lista de razon social', error);
    }
  };

  const fetchDivision = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/division/`);
      setDivision(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de division', error);
    }
  };

  const fetchDepartamento = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/departamento/`);
      setDepartamento(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de departamentos', error);
    }
  };

  const fetchCentrocostos = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/centrocosto/`);
      setCentrocostos(response.data);
    } catch (error) {
      console.error('Error al obtener la lista de centro de costos', error);
    }
  };

  fetchData();
  fetchPais();
  if (modalValues.ID_Pais) {
    fetchRsocial(); // Llamar fetchRsocial solo si modalValues.ID_Pais está definido
  }
  fetchDivision();
  fetchDepartamento();
  fetchCentrocostos();
}, [modalValues.ID_Pais]);