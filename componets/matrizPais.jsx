const handleToggleT24 = () =>{
    setT24(!T24)
  }
  

  useEffect(()=> {
    const searchParams = new URLSearchParams(location.search);
    const paisId = searchParams.get("pais") || setShowALLColumns(true) || setShowButton(false) || setShowFilters(false) || setShowButtonB(true);
    const paisNombre = searchParams.get("Nombre");
    setSelectedCountryId(paisId);
    setSelectedCountry(paisNombre);
    
      
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/perfil/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (perfil)=> {
            const puestoResponse = await axios.get(`http://localhost:3000/puesto/${perfil.ID_Puesto}`);
            const aplicacionResponse = await axios.get(`http://localhost:3000/aplicacion/${perfil.ID_Aplicaciones}`);
            const rsocialResponse = await axios.get(`http://localhost:3000/rsocial/${puestoResponse.data.ID_RSocial}`);
            const divisionResponse = await axios.get(`http://localhost:3000/division/${puestoResponse.data.ID_Division}`);
            const departamentoResponse = await axios.get(`http://localhost:3000/departamento/${puestoResponse.data.ID_Departamento}`);
            const centrocostosResponse = await axios.get(`http://localhost:3000/centrocosto/${puestoResponse.data.ID_CentroCostos}`)
            const paisResponse = await axios.get(`http://localhost:3000/pais/${perfil.ID_Pais}`); 
            const ambienteResponse = await axios.get(`http://localhost:3000/ambiente/${aplicacionResponse.data.ID_Ambiente}`)

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
              Estado_Perfil: perfil.Estado_Perfil === 1 ? "Activo": "Inactivo",
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
            }
          })
        )
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error ('Error al obtener los perfiles:', error);
        setLoading(false);
      }
    };

    const fetchPuestos = async () =>{
      try {
          const response = await axios.get(`http://localhost:3000/puesto/`);
          const allPuestos = response.data;
          const filteredPuestos = allPuestos.filter(puestos => puestos.ID_Pais === parseInt(paisId, 10));
          setPuestos(filteredPuestos);
      } catch (error) {
          console.error('Error al obtener la lista de puestos', error);
      }
  }
    const fetchRsocial = async () =>{
     try {
          const response = await axios.get(`http://localhost:3000/rsocial/`);
          setRsocial(response.data);
      } catch (error) {
          console.error('Error al obtener la lista de razon social', error);
      }
  };
    const fetchDivision = async () =>{
      try {
           const response = await axios.get(`http://localhost:3000/division/`);
           setDivision(response.data);
      } catch (error) {
           console.error('Error al obtener la lista de division', error);
      }
  };
    const fetchDepartamento = async () =>{
      try {
           const response = await axios.get(`http://localhost:3000/departamento/`);
           setDepartamento(response.data);
      } catch (error) {
           console.error('Error al obtener la lista de departamentos', error);
      }
  };
    const fetchCentrocostos = async () =>{
      try {
           const response = await axios.get(`http://localhost:3000/centrocosto/`);
           setCentrocostos(response.data);
      } catch (error) {
           console.error('Error al obtener la lista de centro de costos', error);
      }
  };
    const fetchAplicacion = async () =>{
      try {
           const response = await axios.get(`http://localhost:3000/aplicacion/`);
           const allAplicaciones = response.data;
           const filteredAplicaciones = allAplicaciones.filter(aplicacion => aplicacion.ID_Pais === parseInt(paisId, 10));
           setAplicacion(filteredAplicaciones)
      } catch (error) {
           console.error('Error al obtener la lista de aplicaciones', error);
      }
  };
    const fetchAmbiente = async () =>{
      try {
           const response = await axios.get(`http://localhost:3000/ambiente/`);
           setAmbiente(response.data);
      } catch (error) {
           console.error('Error al obtener la lista de ambientes', error);
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
