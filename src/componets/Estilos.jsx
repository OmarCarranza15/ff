import React  from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "react-data-table-component";
import { styled, keyframes } from "styled-components";

const customStyles = {
  headCells: {
    style: {
      //height: 40, // Alto de los encabezados
      backgroundColor: "#e0e0e0", // Fondo suave para los encabezados
      color: "#333333", // Color de texto más oscuro para mejor contraste
      borderRight: "1px solid #d0d0d0", // Borde sutil para separación
      borderBottom: "1px solid #d0d0d0",
      borderTop: "1px solid #d0d0d0",
      fontWeight: "bold", // Negrita para encabezados
      fontSize: "14px", // Tamaño de fuente para encabezados
      textAlign: "left", // Alineación del texto
      padding: "12px", // Padding más grande para encabezados
      letterSpacing: "0.5px", // Espaciado de letras para un toque moderno 
    },
  },
  cells: {
    style: {
      //height: 45, // Alto de las celdas
      borderRight: "1px solid #d0d0d0", // Borde sutil para celdas
      borderBottom: "1px solid #d0d0d0",
      backgroundColor: "#ffffff", // Fondo blanco para celdas
      color: "#333333", // Color de texto elegante
      fontSize: "14px", // Tamaño de fuente para celdas
      textAlign: "left", // Alineación del texto a la izquierda
      padding: 4, // Elimina el padding entre celdas
      borderSpacing: 4, // Elimina
    },
    rows: {
      style: (row, rowIndex) => ({
        backgroundColor: rowIndex % 2 === 0 ? "#f9f9f9" : "#e6f7ff", // Color de fondo alternado con un color suave
        border: "none", // Sin borde adicional para las filas
        //minHeight: 50, // Alto mínimo de las filas
      }),
    },
  },
};

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const CustomLoader = () => (
  <div style={{ padding: "54px" }}>
    <Spinner />
    <div>Cargando Registros...</div>
  </div>
);

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Alinea el título y el grupo de botones en los extremos */
  align-items: center; /* Centra verticalmente los elementos */
  margin-bottom: 1px; /* Espacio debajo del encabezado */
  margin-top: 15px
`;

const Title = styled.h2`
  flex-grow: 1;
  text-align: center;
  font-size: 35px;
  color: #083cac;
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Altura completa del viewport */
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1; /* Ocupa el espacio restante */
`;

const FilterWrapper = styled.div`
  position: relative; /* Cambiado de 'absolute' a 'relative' */
  right: 9px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  padding: 8px;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 14px;
  justify-content: center;
  flex: 1;
  display: flex;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  //margin: 0px 30px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 6px 12px; /* Ajusta el padding para hacer los botones más pequeños */
  font-size: 14px; /* Ajusta el tamaño del texto */
  border-radius: 4px; /* Bordes redondeados */
  border: 1px solid transparent; /* Borde transparente para mantener el tamaño */
  cursor: pointer; /* Cambia el cursor para indicar que es clickeable */
  transition: background-color 0.3s ease, border-color 0.3s ease; /* Transición suave para cambios de color */
  flex-grow: 1; /* Ajusta el ancho del botón al texto */
  width: fit-content; /* Ajusta el ancho del botón al texto */
  min-width: 0; /* No tiene un ancho mínimo predeterminado */
  white-space: nowrap; /* Evita que el texto se deborde */
  overflow: hidden; /* Oculta el texto que se deborda */
  text-overflow: ellipsis; /* Agrega puntos suspensivos al final del texto si se deborda */
  &:focus {
    outline: none; /* Elimina el borde de enfoque por defecto */
  }

  &.btn-outline-primary {
    background-color: #fff; /* Fondo blanco para el botón de búsqueda */
    border-color: #007bff; /* Borde azul */
    color: #007bff; /* Color del texto azul */

    &:hover {
      background-color: #007bff; /* Fondo azul al pasar el mouse */
      color: #fff; /* Color del texto blanco */
    }
  }

  &.btn-outline-success {
    background-color: #fff; /* Fondo blanco para el botón de insertar */
    border-color: #28a745; /* Borde verde */
    color: #28a745; /* Color del texto verde */

    &:hover {
      background-color: #28a745; /* Fondo verde al pasar el mouse */
      color: #fff; /* Color del texto blanco */
    }
  }

  &.btn.btn-outline-danger {
    background-color: #fff; /* Fondo blanco para el botón de cancelar */
    border-color: #dc3545; /* Borde rojo */
    color: #dc3545; /* Color del texto rojo */

    &:hover {
      background-color: #dc3545; /* Fondo rojo al pasar el mouse */
      color: #fff; /* Color del texto blanco */
    }
  }
`;

const StyledInput = styled.input`
  padding: 8px 12px; /* Espaciado interno para un diseño más cómodo */
  font-size: 14px; /* Tamaño de fuente más grande para mejor legibilidad */
  border-radius: 4px; /* Bordes redondeados */
  border: 1px solid #ccc; /* Borde gris claro */
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1); /* Sombra ligera para un efecto de profundidad */
  background-color: #fff; /* Fondo blanco */
  color: #333; /* Color de texto oscuro */
  width: 100%; /* Ancho completo del contenedor */
  box-sizing: border-box; /* Incluye padding y border en el ancho total */

  /* Transición suave para cambios de estilo */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #007bff; /* Borde azul cuando el campo está enfocado */
    box-shadow: 0 0 6px rgba(0, 123, 255, 0.25); /* Sombra azul al enfocar */
    outline: none; /* Elimina el borde de enfoque por defecto */
  }

  /* Estilo para texto de error, si es necesario */
  &.error {
    border-color: #dc3545; /* Borde rojo para indicar error */
    box-shadow: 0 0 6px rgba(220, 53, 69, 0.25); /* Sombra roja para error */
  }
`;

const StyledSelect = styled.select`
  padding: 8px; /* Espaciado interno para un diseño más cómodo */
  font-size: 14px; /* Tamaño de fuente más grande para mejor legibilidad */
  border-radius: 4px; /* Bordes redondeados */
  border: 1px solid #ccc; /* Borde gris claro */
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1); /* Sombra ligera para un efecto de profundidad */
  background-color: #fff; /* Fondo blanco */
  color: #333; /* Color de texto oscuro */
  width: 100%; /* Ancho completo del contenedor */
  box-sizing: border-box; /* Incluye padding y border en el ancho total */

  /* Transición suave para cambios de estilo */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #007bff; /* Borde azul cuando el campo está enfocado */
    box-shadow: 0 0 6px rgba(0, 123, 255, 0.25); /* Sombra azul al enfocar */
    outline: none; /* Elimina el borde de enfoque por defecto */
  }

  /* Estilo para texto de error, si es necesario */
  &.error {
    border-color: #dc3545; /* Borde rojo para indicar error */
    box-shadow: 0 0 6px rgba(220, 53, 69, 0.25); /* Sombra roja para error */
  }
`;

//Boton Limpiar filtros
const RedButton = styled(Button)`
  background-color: #ff0000; /* Rojo */
  color: #ffffff; /* Blanco */
  font-size: 13px;
  padding: 2px 4px;
  border-radius: 5px;
  height: 35px;
  width: 120px;
`;


const DataTableContainer = styled.div`
  flex: 1;
  padding: 1px;
  overflow: auto;
  position: relative;
  width: 100%;
  height: calc(100vh - 80px); /* Ajusta el tamaño del contenedor de la tabla */
`;

const StyledDataTable = styled(DataTable)`
  border-collapse: collapse;
  width: 100%;
  position: relative;
  margin: center;

  th,
  td {
    border: 1px solid #ddd;
    padding: 15px;
    text-align: center; /* Centra el texto en las celdas */
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  th {
    background-color: #f0f0f0;
    text-align: center; /* Centra el texto en los encabezados */
  }

  td {
    min-width: 200px;
    max-width: 500px;
    text-align: center;
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 8px;
    }
  }

  @media (max-width: 480px) {
    th,
    td {
      padding: 6px;
    }
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalWrapper = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  z-index: 1100;
  animation: fadeIn 0.3s ease-out;
  max-width: 400px;
  width: 100%;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalTitle = styled.h3`
  margin-bottom: 15px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 8px;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export {
    customStyles,
    rotate360,
    Spinner,
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
    StyledSelect,
    RedButton,
    DataTableContainer,
    StyledDataTable,
    ModalBackground,
    ModalWrapper,
    ModalTitle,
    ErrorMessage,
    ModalButtonGroup,
  };

