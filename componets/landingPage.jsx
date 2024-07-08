const handleSearch = () => {
    if (!showButton) {
        const requiredFilters = ["N_Puesto", "Rol", "N_Aplicaciones", "Puesto_Jefe"];
        const emptyRequiredFilters = requiredFilters.filter(filter => filters[filter].trim() === "");
        
        if (emptyRequiredFilters.length === 4) {
            alert("Por favor, complete al menos uno de los siguientes filtros: Puesto, Rol, Aplicación o Jefe Inmediato.");
            return;
        }
    }
    
    const filteredData = records.filter((row) => {
        const isActive = filters.Estado_Perfil.toLowerCase() === "activo";
        return (
            (filters.N_RSocial === "" || row.N_RSocial.toLowerCase().includes(filters.N_RSocial.toLowerCase())) &&
            (selectedCountry === "" || row.N_Pais.toLowerCase().includes(selectedCountry.toLowerCase())) &&
            (filters.N_Departamento === "" || row.N_Departamento.toLowerCase().includes(filters.N_Departamento.toLowerCase())) &&
            (filters.Rol === "" || row.Rol.toLowerCase().includes(filters.Rol.toLowerCase())) &&
            (filters.Nombre === "" || row.Nombre.toLowerCase().includes(filters.Nombre.toLowerCase())) &&
            (filters.N_Puesto === "" || row.N_Puesto.toLowerCase().includes(filters.N_Puesto.toLowerCase())) &&
            (filters.Observaciones === "" || row.Observaciones.toLowerCase().includes(filters.Observaciones.toLowerCase())) &&
            (filters.N_Aplicaciones === "" || row.N_Aplicaciones.toLowerCase().includes(filters.N_Aplicaciones.toLowerCase())) &&
            (filters.Ticket === "" || (row.Ticket ? row.Ticket.toString().includes(filters.Ticket.toString()) : false)) &&
            (filters.Puesto_Jefe === "" || row.Puesto_Jefe.toLowerCase().includes(filters.Puesto_Jefe.toLowerCase())) &&
            (filters.Estado_Perfil === "" || row.Estado_Perfil.toLowerCase().includes(filters.Estado_Perfil.toLowerCase())) &&
            (isActive ? row.Estado_Perfil.toLowerCase() === "activo" : true)
        );
    });

    setFilteredData(filteredData);
};

// Usa el handleSearch en tu botón de búsqueda
<Button primary onClick={handleSearch}>Buscar</Button>