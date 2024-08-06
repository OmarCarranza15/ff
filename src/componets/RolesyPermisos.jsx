 const createCampoNuevo = (modalValues) => {
          let campoNuevo = `- Rol: ${modalValues.N_Rol}¬ - Descripción Rol: ${modalValues.Des_Rol}¬`;
          if (modalValues.Insertar) {
            campoNuevo += ` - Permiso Insertar: ${modalValues.Insertar === true ? "Habilitado": "Deshabilitado"}¬`;
          }
          if (modalValues.Editar) {
            campoNuevo += `- Permiso Editar: ${modalValues.Editar === true ? "Habilitado": "Deshabilitado"}¬`;
          }
          if (modalValues.Paises){
            campoNuevo += `- Paises: ${modalValues.Paises.map(
            (id) => pais.find((a) => a.id === id)?.N_Pais
          ).join(",")}`;
          }

          return campoNuevo;
        };
