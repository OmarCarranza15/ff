CREATE DATABASE DB_Ficohsa;
USE DB_Ficohsa;

CREATE TABLE Pais (
	ID INT PRIMARY KEY IDENTITY,
	N_Pais NVARCHAR(100) NOT NULL,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE RSocial(
	ID INT PRIMARY KEY IDENTITY,
	N_RSocial NVARCHAR(100) NOT NULL,
	ID_Pais INT NOT NULL,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	FOREIGN KEY (ID_Pais) REFERENCES Pais(ID)
);

CREATE TABLE Division(
	ID INT PRIMARY KEY IDENTITY,
	N_Division NVARCHAR(100) NOT NULL,
	ID_Pais INT NOT NULL,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	FOREIGN KEY (ID_Pais) REFERENCES Pais(ID)
);

CREATE TABLE Departamento(
	ID INT PRIMARY KEY IDENTITY,
	N_Departamento NVARCHAR(100) NOT NULL,
	ID_Pais INT NOT NULL,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	FOREIGN KEY (ID_Pais) REFERENCES Pais(ID)
);


CREATE TABLE CentroCostos(
	ID INT PRIMARY KEY IDENTITY,
	Codigo NVARCHAR(20) NOT NULL,
	Nombre NVARCHAR(100) NOT NULL,
	ID_Pais INT NOT NULL,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	FOREIGN KEY (ID_Pais) REFERENCES Pais(ID)
);

CREATE TABLE Puestos(
	ID INT PRIMARY KEY IDENTITY,
	Codigo INT NOT NULL,
	N_Puesto NVARCHAR(100) NOT NULL,
	ID_Pais INT NOT NULL,
	ID_RSocial INT NOT NULL,
	ID_Division INT NOT NULL,
	ID_Departamento INT NOT NULL, 
	ID_CentroCostos INT NOT NULL,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	FOREIGN KEY (ID_Pais) REFERENCES Pais(ID),
	FOREIGN KEY (ID_RSocial) REFERENCES RSocial(ID),
	FOREIGN KEY (ID_Division) REFERENCES Division(ID),
	FOREIGN KEY (ID_Departamento) REFERENCES Departamento(ID),
	FOREIGN KEY (ID_CentroCostos) REFERENCES CentroCostos(ID)
);

CREATE TABLE Ambientes(
	ID INT PRIMARY KEY IDENTITY,
	N_Ambiente NVARCHAR(100) NOT NULL,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE Aplicaciones(
	ID INT PRIMARY KEY IDENTITY,
	N_Aplicaciones NVARCHAR(100) NOT NULL,
	ID_Pais INT NOT NULL,
	ID_Ambiente INT,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	FOREIGN KEY (ID_Pais) REFERENCES Pais(ID),
	FOREIGN KEY (ID_Ambiente) REFERENCES Ambientes(ID)
);

CREATE TABLE Perfiles (
	ID INT PRIMARY KEY IDENTITY,
	Rol NVARCHAR(100) NOT NULL,
	Ticket NVARCHAR(10),
	Observaciones NVARCHAR(500),
	Puesto_Jefe NVARCHAR(100),
	Estado_Perfil INT NOT NULL,
	ID_Pais INT NOT NULL,
	ID_Puesto INT NOT NULL,
	ID_Aplicaciones INT NOT NULL,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	FOREIGN KEY (ID_Pais) REFERENCES Pais(ID),
	FOREIGN KEY (ID_Puesto) REFERENCES Puestos(ID),
	FOREIGN KEY (ID_Aplicaciones) REFERENCES Aplicaciones(ID)
);


CREATE TABLE PuestoIn (
	ID INT PRIMARY KEY IDENTITY,
	N_PuestoIn NVARCHAR(100) NOT NULL,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE Permisos (
	ID INT PRIMARY KEY IDENTITY,
	P_Consulta INT,
	P_Insertar INT,
	P_Editar INT,
	P_Desactivar INT,
	P_Administrador INT,
	P_Paises INT,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	FOREIGN KEY (P_Paises) REFERENCES Pais(ID)
);

CREATE TABLE RolUsuario (
	ID INT PRIMARY KEY IDENTITY,
	N_Rol NVARCHAR(100)NOT NULL,
	Des_Rol NVARCHAR(500),
	Fec_Creacion DATE,
	Fec_Modificacion Date,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	ID_Permisos INT,
	FOREIGN KEY (ID_Permisos) REFERENCES Permisos (ID)
);

CREATE TABLE Usuario (
	ID INT PRIMARY KEY IDENTITY,
	Usuario NVARCHAR(100) NOT NULL,
	Nombre NVARCHAR(100) NOT NULL,
	Contrasenia NVARCHAR(100) NOT NULL,
	Fec_Creacion DATE,
	Fec_Ult_Conexion DATE,
	Fec_Exp_Acceso DATE,
	Estado INT,
	ID_PuestoIn INT,
	ID_RolUsuario INT,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	FOREIGN KEY (ID_PuestoIn) REFERENCES PuestoIn(ID),
	FOREIGN KEY (ID_RolUsuario) REFERENCES RolUsuario(ID)
);

CREATE TABLE Auditoria (
	ID INT PRIMARY KEY IDENTITY,
	Campo_Original NVARCHAR(100),
	Cmapo_Nuevo NVARCHAR(100),
	Matriz NVARCHAR(100),
	Accion INT,
	ID_Usuario INT,
	createdAt DATETIME2 DEFAULT GETDATE(),
	updatedAt DATETIME2 DEFAULT GETDATE(),
	FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID)

);

-------- Agregamos Datos a la tabla Pais-----------------
INSERT INTO Pais (N_Pais) VALUES ('Honduras');
INSERT INTO Pais (N_Pais) VALUES ('Guatemala');
INSERT INTO Pais (N_Pais) VALUES ('Nicaragua');
INSERT INTO Pais (N_Pais) VALUES ('Panama');

SELECT * FROM Pais;

		--Actualiza la fecha de updatedAt--
CREATE TRIGGER 
TRG_Pais_Update 
on Pais 
AFTER UPDATE 
AS 
BEGIN
	SET NOCOUNT ON;
	UPDATE Pais
	SET updatedAt = GETDATE()
	FROM Pais P
	INNER JOIN inserted I ON 
P.ID = I.ID;
END;

UPDATE Pais SET N_Pais = 'Honduras' WHERE ID_Pais = 1;


-------- Agregaos Datos a la tabla RSocial-----------------
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('Ficohsa|Banco GTM', 2);
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('CONECTA COMUNICACIONES', 1);
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('Ficohsa|Banco NIC', 3);
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('Ficohsa|Banco PAN', 4);
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('Ficohsa|Seguros GTM', 2);
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('Ficohsa|Pensiones', 1);
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('Ficohsa|Seguros', 1);
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('Ficohsa|Tarjetas NIC', 3);
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('Ficohsa|Tarjetas PAN', 4);
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('GRUPO FINANCIERO FICOHSA', 1);
INSERT INTO RSocial (N_RSocial, ID_Pais) VALUES ('Tengo', 1);

SELECT * FROM RSocial;


--------Agregamos Datos a la tabla de Division---------------
INSERT INTO Division (N_Division, ID_Pais) VALUES ('ADMINISTRACION',1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('ADMINISTRACION',2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('ADMINISTRACION',3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('ADMINISTRACION',4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('AUDITORIA',1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('AUDITORIA',2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('AUDITORIA',3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('AUDITORIA',4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('CORPORATIVO',1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('CORPORATIVO',2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('CORPORATIVO',3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('CORPORATIVO',4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('CUMPLIMIENTO', 1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('CUMPLIMIENTO', 2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('CUMPLIMIENTO', 3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('CUMPLIMIENTO', 4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('DIGITAL', 1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('DIGITAL', 2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('DIGITAL', 3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('ESTRATEGIA Y NORMATIVA', 1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('ESTRATEGIA Y NORMATIVA', 2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('ESTRATEGIA Y NORMATIVA', 3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('ESTRATEGIA Y NORMATIVA', 4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('FINANZAS', 1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('FINANZAS', 2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('FINANZAS', 3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('FINANZAS', 4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('GERENCIA GENERAL', 1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('GERENCIA GENERAL', 2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('GERENCIA GENERAL', 3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('GERENCIA GENERAL', 4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('JURIDICO',1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('JURIDICO',2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('JURIDICO',3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('OPERACIONES',1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('OPERACIONES',2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('OPERACIONES',3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('OPERACIONES',4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('PERSONAS',1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('PERSONAS',2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('PERSONAS',3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('PERSONAS',4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('RIESGOS',1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('RIESGOS',2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('RIESGOS',3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('RIESGOS',4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('TALENTO HUMANO',1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('TALENTO HUMANO',2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('TALENTO HUMANO',3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('TALENTO HUMANO',4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('TECNOLOGIA',1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('TECNOLOGIA',2);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('TECNOLOGIA',3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('TECNOLOGIA',4);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('JUNTA DIRECTIVA',1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('PRESIDENCIA', 1);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('PRESIDENCIA', 3);
INSERT INTO Division (N_Division, ID_Pais) VALUES ('FUNDACION FICOHSA', 1);

SELECT * FROM Division;


--------Agregamos Datos a la tabla de Departamento------------------
INSERT INTO Departamento (N_Departamento, ID_Pais) VALUES ('ADMINISTRACION', 2);
INSERT INTO Departamento (N_Departamento, ID_Pais) VALUES ('CONTRALORIA', 1);
INSERT INTO Departamento (N_Departamento,ID_Pais) VALUES ('CREDITOS', 3);
INSERT INTO Departamento (N_Departamento,ID_Pais) VALUES ('COBROS', 4);
INSERT INTO Departamento (N_Departamento,ID_Pais) VALUES ('COMPRAS', 2);
INSERT INTO Departamento (N_Departamento,ID_Pais) VALUES ('SERVICIOS GENERALES', 2);
INSERT INTO Departamento (N_Departamento,ID_Pais) VALUES ('CALL CENTER', 1);
INSERT INTO Departamento (N_Departamento,ID_Pais) VALUES ('CLINICA', 1);
INSERT INTO Departamento (N_Departamento,ID_Pais) VALUES ('INTELIGENCIA DE NEGOCIOS', 3);
INSERT INTO Departamento (N_Departamento,ID_Pais) VALUES ('IMAGEN CORPORATIVA', 3);
INSERT INTO Departamento (N_Departamento,ID_Pais) VALUES ('EJECUCION DE OPERACIONES', 4);
INSERT INTO Departamento (N_Departamento,ID_Pais) VALUES ('LOGISTICA', 4);

SELECT * FROM Departamento;




------Agregamos Datos de la taba CentroCostos-----------------
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('GT01GT01600106', 'Soporte Operativo', 2);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('HN01HN01100402', 'ORGANIZACION Y GESTI', 1);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('NI01NI01M12446', 'FIN-INTELIGENCIA DE NEGOCIOS', 3);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('PA06PA06500135', 'Cobros', 4);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('GT01GT01203106', 'Atención Telefónica', 2);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('GT01GT01503102', 'Recuperación Legal', 2);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('HN01HN17100106', 'TELEVENTAS SOS *3000', 1);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('HN01HN10100100', 'TEGUCIGALPA (CREDICORP)', 1);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('NI01NI01M72419', 'AUDITORIA INTERNA', 3);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('NI01NI01F44001', 'BANCA EMPRESARIAL Y CORPORATIVA', 3);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('PA06PA06300115', 'Banca Corporativa', 4);
INSERT INTO CentroCostos (Codigo, Nombre, ID_Pais) VALUES ('PA06PA06360141', 'Finanzas', 4);

SELECT * FROM CentroCostos;


-----Agregamos Datos de la tabla Puestos--------------------
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8899, 'GERENTE ADMINISTRATIVO Y DE MEJORA CONTINUA', 2, 1, 1, 1, 1);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8891, 'ANALISTA QA', 1, 2, 2, 2, 2);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8892, 'CAJERO DE APOYO', 3, 3, 3, 3, 3);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8893, 'AUXILIAR DE COBROS', 4, 4, 4, 4, 4);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8894, 'AUXILIAR ADMINISTRATIVO', 2, 5, 5, 5, 5);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8895, 'OFICIAL SR. DE COMPRAS', 2, 1, 6, 6, 6);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8896, 'OFICIAL SR. DE CONTABILIDAD', 1, 6, 7, 7, 7);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8897, 'OFICIAL SR. DE CONSOLIDACION FINANCIERA', 1, 7, 8, 8, 8);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8898, 'OFICIAL SR. DE CUMPLIMIENTO', 3, 3, 9, 12, 9);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8890, 'ANALISTA MIS', 3, 8, 10, 13, 10);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8889, 'AUXILIAR DE SERVICIO', 4, 4, 11, 15, 11);
INSERT INTO Puestos (Codigo, N_Puesto, ID_Pais, ID_RSocial, ID_Departamento, ID_Division, ID_CentroCostos) VALUES (8888, 'OFICIAL DE BANCA CORPORATIVA', 4, 9, 12, 14, 12);

SELECT * FROM Puestos;


SELECT R.N_RSocial, PS.N_Pais, P.N_Puesto, DV.N_Division, D.N_Departamento, CC.Codigo, CC.Nombre FROM Puestos P
INNER JOIN RSocial R ON P.ID_RSocial = R.ID
INNER JOIN Departamento D ON P.ID_Departamento = D.ID
INNER JOIN Pais PS ON P.ID_Pais = PS.ID
INNER JOIN Division DV ON P.ID_Division = DV.ID
INNER JOIN CentroCostos CC ON P.ID_CentroCostos = CC.ID;

-----Agregamos Datos de la tabla Ambientes ---------------
INSERT INTO Ambientes (N_Ambiente) VALUES ('A1');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A2');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A3');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A4');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A5');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A6');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A7');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A8');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A9');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A10');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A11');
INSERT INTO Ambientes (N_Ambiente) VALUES ('A12');


-----Agregamos Datos de la tabla de Aplicaciones--------------
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente ) VALUES ('CORREO', 1, 1);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('SAP', 2, 2);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('Cobis', 3, 3);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('Abanks', 4, 4);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('VASA', 1, 5);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('Abanks', 1, 6);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('abanks', 2, 7);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('VISION', 2, 8);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('sap', 3, 9);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('Salesforce', 3, 10);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('Abanks ', 4, 11);
INSERT INTO Aplicaciones (N_Aplicaciones, ID_Pais, ID_Ambiente) VALUES ('V+', 4, 12);

SELECT * FROM Aplicaciones;


-------Agregamos Datos de la tabla de Perfiles---------------
INSERT INTO Perfiles (Rol, Ticket, Observaciones, Puesto_Jefe, Estado_Perfil, ID_Pais, ID_Puesto, ID_Aplicaciones ) VALUES ('/GFF Honduras/HN - Nivel 02/HN - Banco - Nivel 2.1', 146300, 'ASIGNAR EL MENÚ 296', 'J1', 1, 1, 13, 1);
INSERT INTO Perfiles (Rol, Ticket, Observaciones, Puesto_Jefe, Estado_Perfil, ID_Pais, ID_Puesto, ID_Aplicaciones) VALUES ('SUPERVISOR_PRESTAMOS', 15300, 'Requerimiento de Talento HUmano', 'J2', 2, 4, 14, 2);
INSERT INTO Perfiles (Rol, Ticket, Observaciones, Puesto_Jefe, Estado_Perfil, ID_Pais, ID_Puesto, ID_Aplicaciones) VALUES ('64', '' , 'J3' , 1, 3, 15, 3);
INSERT INTO Perfiles (Rol, Ticket, Observaciones, Puesto_Jefe, Estado_Perfil, ID_Pais, ID_Puesto, ID_Aplicaciones) VALUES ('ZNW_SAP_BC_SPOOL_ADMn', 78667, '', 'J4' , 1, 2, 16, 4);
INSERT INTO Perfiles (Rol, Ticket, Observaciones, Puesto_Jefe, Estado_Perfil, ID_Pais, ID_Puesto, ID_Aplicaciones) VALUES ('Perfil para rol ZNW_SAP_BC_SPOOL_ADMIN', '' , 'J5', 1, 1, 17, 5);
INSERT INTO Perfiles (Rol, Ticket, Observaciones, Puesto_Jefe, Estado_Perfil, ID_Pais, ID_Puesto, ID_Aplicaciones) VALUES ('CONNECT', '', 'J6', 2, 1, 18, 6);
INSERT INTO Perfiles (Rol, Ticket, Observaciones, Puesto_Jefe, Estado_Perfil, ID_Pais, ID_Puesto, ID_Aplicaciones) VALUES ('Jefe de Estrategia', '', 'J7', 1, 2, 19, 7);
INSERT INTO Perfiles (Rol, Ticket, Observaciones, Puesto_Jefe, Estado_Perfil, ID_Pais, ID_Puesto, ID_Aplicaciones) VALUES ('92', '', 'J8', 2, 3, 20, 8);
INSERT INTO Perfiles (Rol, Ticket, Observaciones, Puesto_Jefe, Estado_Perfil, ID_Pais, ID_Puesto, ID_Aplicaciones) VALUES ('200', '', 'J9', 2, 3, 21, 9);
INSERT INTO Perfiles (Rol, Ticket, Observaciones, Puesto_Jefe, Estado_Perfil, ID_Pais, ID_Puesto, ID_Aplicaciones) VALUES ('/GFF Panama/PA - Nivel 01/PA - Banco - Nivel 1.1', '', 'J10', 1, 4, 22, 10);

SELECT * FROM Perfiles;

delete from Perfiles where id  = 42

UPDATE Perfiles SET Puesto_Jefe = 'SUBGERENTE DE INTELIGENCIA Y SISTEMAS DE COBRANZA' WHERE ID = 29;

SELECT PS.N_Pais, P.N_Puesto, PER.Rol, A.N_Aplicaciones, PER.Ticket, PER.Observaciones, PER.Estado_Perfil FROM Perfiles PER
INNER JOIN Puestos P ON PER.ID_Puesto = P.ID
INNER JOIN Aplicaciones A ON PER.ID_Aplicaciones = A.ID
INNER JOIN Pais PS ON PER.ID_Pais = PS.ID;


-----Agregamos Datos de la tabla de PuestoIn--------------
INSERT INTO PuestoIn (N_PuestoIn) VALUES ('Subgerente General de Monitoreo y Seguridad Logica');
INSERT INTO PuestoIn (N_PuestoIn) VALUES ('Oficial SR. de Seguridad Logica');
INSERT INTO PuestoIn (N_PuestoIn) VALUES ('Jefe Regional de Seguridad Logica');
INSERT INTO PuestoIn (N_PuestoIn) VALUES ('Oficial de Seguridad de la Información');
INSERT INTO PuestoIn (N_PuestoIn) VALUES ('Jefe Regional de Mesa de Servicio');

SELECT * FROM PuestoIn;

-----Agregamos Datos de la tabla de Permisos--------------
INSERT INTO Permisos (P_Consulta, P_Insertar, P_Editar, P_Desactivar, P_Administrador, P_Paises) VALUES (1 , 1, 1, 1, 1, 1);
INSERT INTO Permisos (P_Consulta, P_Insertar, P_Editar, P_Desactivar, P_Administrador, P_Paises) VALUES (1 , 1, 1, 1, 0, 2);
INSERT INTO Permisos (P_Consulta, P_Insertar, P_Editar, P_Desactivar, P_Administrador, P_Paises) VALUES (1 , 0, 0, 0, 0, 3);
INSERT INTO Permisos (P_Consulta, P_Insertar, P_Editar, P_Desactivar, P_Administrador, P_Paises) VALUES (1 , 1, 1, 1, 0, 4);

SELECT * FROM Permisos;

-----Agregamos Datos de la tabla de RolUsuario--------------
INSERT INTO RolUsuario (N_Rol, Des_Rol, Fec_Creacion, Fec_Modificacion, ID_Permisos) VALUES ('SuperAdmin' , 'Rol encargado del Sistema con el maximo nivel de permisos','2024-06-01', NULL, 1);
INSERT INTO RolUsuario (N_Rol, Des_Rol, Fec_Creacion, Fec_Modificacion, ID_Permisos) VALUES ('Seguridad Logica', 'Rol encargado de el área de Seguridad Logica','2024-06-01', NULL, 2);
INSERT INTO RolUsuario (N_Rol, Des_Rol, Fec_Creacion, Fec_Modificacion, ID_Permisos) VALUES ('Mesa de Servicio', 'Rol encargado de el área de mesa de servicio','2024-06-01', NULL, 3);
INSERT INTO RolUsuario (N_Rol, Des_Rol, Fec_Creacion, Fec_Modificacion, ID_Permisos) VALUES ('Jefe de Seguridad Logica', 'Rol especifico de Jefe de Seguridad Logica','2024-06-01',NULL, 4);
INSERT INTO RolUsuario (N_Rol, Des_Rol, Fec_Creacion, Fec_Modificacion, ID_Permisos) VALUES ('Oficial de SL', 'Rol Oficial de SL','2024-06-01', NULL, 2);

SELECT * FROM RolUsuario;

-----Agregamos Datos de la tabla de Usuarios--------------
INSERT INTO Usuario (Usuario, Nombre, Contrasenia, Fec_Creacion, Fec_Ult_Conexion, Fec_Exp_Acceso, Estado, ID_PuestoIn, ID_RolUsuario) VALUES ('HN00222','Juan Roque','Qwerty123','2024-06-01', '2024-06-05', '2025-06-01', 2, 1, 1);
INSERT INTO Usuario (Usuario, Nombre, Contrasenia, Fec_Creacion, Fec_Ult_Conexion, Fec_Exp_Acceso, Estado, ID_PuestoIn, ID_RolUsuario) VALUES ('PR00100','Oscar Reyes','Qwerty321','2024-06-01', '2024-06-05', '2025-06-01', 3, 2, 2);
INSERT INTO Usuario (Usuario, Nombre, Contrasenia, Fec_Creacion, Fec_Ult_Conexion, Fec_Exp_Acceso, Estado, ID_PuestoIn, ID_RolUsuario) VALUES ('HN00278','Pedro Ordoñez','Qwerty458','2024-06-01', '2024-06-05', '2025-06-01', 2, 3, 3);
INSERT INTO Usuario (Usuario, Nombre, Contrasenia, Fec_Creacion, Fec_Ult_Conexion, Fec_Exp_Acceso, Estado, ID_PuestoIn, ID_RolUsuario) VALUES ('HN00002','David Flores','Qwerty898','2024-06-01', '2024-06-05', '2025-06-01', 1, 4, 4);
INSERT INTO Usuario (Usuario, Nombre, Contrasenia, Fec_Creacion, Fec_Ult_Conexion, Fec_Exp_Acceso, Estado, ID_PuestoIn, ID_RolUsuario) VALUES ('HN00111','Alexis Sierra','Qwerty696','2024-06-01', '2024-06-05', '2025-06-01', 4, 5, 5);

SELECT * FROM Usuario;

SELECT U.Usuario, U.Nombre, U.Contrasenia, U.Fec_Creacion, U.Fec_Ult_Conexion, U.Fec_Exp_Acceso, U.Estado, P.N_PuestoIn, R.N_Rol FROM Usuario U
INNER JOIN PuestoIn P ON U.ID_PuestoIn = P.ID
INNER JOIN RolUsuario R ON U.ID_RolUsuario = R.ID