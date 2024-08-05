USE [master]
GO
/****** Object:  Database [DB_Ficohsa]    Script Date: 23/7/2024 14:22:39 ******/
CREATE DATABASE [DB_Ficohsa]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'DB_Ficohsa', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\DB_Ficohsa.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'DB_Ficohsa_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\DB_Ficohsa_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [DB_Ficohsa] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [DB_Ficohsa].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [DB_Ficohsa] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET ARITHABORT OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [DB_Ficohsa] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [DB_Ficohsa] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET  ENABLE_BROKER 
GO
ALTER DATABASE [DB_Ficohsa] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [DB_Ficohsa] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET RECOVERY FULL 
GO
ALTER DATABASE [DB_Ficohsa] SET  MULTI_USER 
GO
ALTER DATABASE [DB_Ficohsa] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [DB_Ficohsa] SET DB_CHAINING OFF 
GO
ALTER DATABASE [DB_Ficohsa] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [DB_Ficohsa] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [DB_Ficohsa] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [DB_Ficohsa] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'DB_Ficohsa', N'ON'
GO
ALTER DATABASE [DB_Ficohsa] SET QUERY_STORE = OFF
GO
USE [DB_Ficohsa]
GO
/****** Object:  Table [dbo].[Ambientes]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ambientes](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[N_Ambiente] [nvarchar](255) NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Aplicaciones]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Aplicaciones](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[N_Aplicaciones] [nvarchar](100) NOT NULL,
	[Ambientes] [nvarchar](max) NULL,
	[ID_Pais] [int] NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Auditoria]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Auditoria](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Campo_Original] [nvarchar](100) NULL,
	[Cmapo_Nuevo] [nvarchar](100) NULL,
	[Matriz] [nvarchar](100) NULL,
	[Accion] [int] NULL,
	[ID_Usuario] [int] NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CentroCostos]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CentroCostos](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Codigo] [nvarchar](20) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[ID_Pais] [int] NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Departamento]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Departamento](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[N_Departamento] [nvarchar](100) NOT NULL,
	[ID_Pais] [int] NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Division]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Division](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[N_Division] [nvarchar](100) NOT NULL,
	[ID_Pais] [int] NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pais]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pais](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[N_Pais] [nvarchar](100) NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Perfiles]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Perfiles](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Rol] [nvarchar](100) NOT NULL,
	[Ticket] [nvarchar](10) NULL,
	[Observaciones] [nvarchar](500) NULL,
	[Puesto_Jefe] [nvarchar](100) NULL,
	[Estado_Perfil] [int] NOT NULL,
	[Cod_Menu] [int] NULL,
	[ID_Pais] [int] NOT NULL,
	[ID_Puesto] [int] NOT NULL,
	[ID_Aplicaciones] [int] NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Permisos]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permisos](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[P_Consulta] [int] NULL,
	[P_Insertar] [int] NULL,
	[P_Editar] [int] NULL,
	[P_Desactivar] [int] NULL,
	[P_Administrador] [int] NULL,
	[P_Paises] [int] NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PuestoIn]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PuestoIn](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[N_PuestoIn] [nvarchar](100) NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Puestos]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Puestos](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Codigo] [int] NOT NULL,
	[N_Puesto] [nvarchar](100) NOT NULL,
	[ID_Pais] [int] NOT NULL,
	[ID_RSocial] [int] NOT NULL,
	[ID_Division] [int] NOT NULL,
	[ID_Departamento] [int] NOT NULL,
	[ID_CentroCostos] [int] NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RolUsuario]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RolUsuario](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[N_Rol] [nvarchar](100) NOT NULL,
	[Des_Rol] [nvarchar](500) NULL,
	[Fec_Creacion] [date] NULL,
	[Fec_Modificacion] [date] NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
	[ID_Permisos] [int] NULL,
	[Insertar] [int] NULL,
	[Editar] [int] NULL,
	[Paises] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RSocial]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RSocial](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[N_RSocial] [nvarchar](100) NOT NULL,
	[ID_Pais] [int] NOT NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 23/7/2024 14:22:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Usuario] [nvarchar](100) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[Contrasenia] [nvarchar](100) NOT NULL,
	[Fec_Creacion] [date] NULL,
	[Fec_Ult_Conexion] [date] NULL,
	[Fec_Exp_Acceso] [date] NULL,
	[Estado] [int] NULL,
	[ID_PuestoIn] [int] NULL,
	[ID_RolUsuario] [int] NULL,
	[createdAt] [datetime2](7) NULL,
	[updatedAt] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Ambientes] ON 

INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (1, N'A1', CAST(N'2024-07-12T13:46:50.4733333' AS DateTime2), CAST(N'2024-07-12T13:46:50.4733333' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (2, N'A2', CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2), CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (3, N'A3', CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2), CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (4, N'A4', CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2), CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (5, N'A5', CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2), CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (6, N'A6', CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2), CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (7, N'A7', CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2), CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (8, N'A8', CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2), CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (9, N'A9', CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2), CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (10, N'A10', CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2), CAST(N'2024-07-12T13:46:50.4833333' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (11, N'A11', CAST(N'2024-07-12T13:46:50.4866667' AS DateTime2), CAST(N'2024-07-12T13:46:50.4866667' AS DateTime2))
INSERT [dbo].[Ambientes] ([ID], [N_Ambiente], [createdAt], [updatedAt]) VALUES (12, N'A12', CAST(N'2024-07-12T13:46:50.4866667' AS DateTime2), CAST(N'2024-07-12T13:46:50.4866667' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Ambientes] OFF
GO
SET IDENTITY_INSERT [dbo].[Aplicaciones] ON 

INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (1, N'CORREO', N'1, 2', 1, CAST(N'2024-07-12T13:47:42.8900000' AS DateTime2), CAST(N'2024-07-12T13:47:42.8900000' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (2, N'SAP', N'3, 4', 2, CAST(N'2024-07-12T13:47:42.8900000' AS DateTime2), CAST(N'2024-07-12T13:47:42.8900000' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (3, N'Cobis', N'12,7', 3, CAST(N'2024-07-12T13:47:42.8933333' AS DateTime2), CAST(N'2024-07-12T13:47:42.8933333' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (4, N'Abanks', N'10,4', 4, CAST(N'2024-07-12T13:47:42.8933333' AS DateTime2), CAST(N'2024-07-12T13:47:42.8933333' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (5, N'VASA', N'11,9', 1, CAST(N'2024-07-12T13:47:42.8933333' AS DateTime2), CAST(N'2024-07-12T13:47:42.8933333' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (6, N'Abanks', N'9,2', 1, CAST(N'2024-07-12T13:47:42.8933333' AS DateTime2), CAST(N'2024-07-12T13:47:42.8933333' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (7, N'abanks', N'10,1', 2, CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2), CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (8, N'VISION', N'10,12', 2, CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2), CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (9, N'sap', N'10,1', 3, CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2), CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (10, N'Salesforce', N'10,7,8', 3, CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2), CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (11, N'Abanks ', N'10,5,4', 4, CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2), CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (12, N'V+', N'10,7,9', 4, CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2), CAST(N'2024-07-12T13:47:42.8966667' AS DateTime2))
INSERT [dbo].[Aplicaciones] ([ID], [N_Aplicaciones], [Ambientes], [ID_Pais], [createdAt], [updatedAt]) VALUES (30, N'T24', N'2, 4, 6, 9', 1, CAST(N'2024-07-15T11:15:33.7233333' AS DateTime2), CAST(N'2024-07-15T11:15:33.7233333' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Aplicaciones] OFF
GO
SET IDENTITY_INSERT [dbo].[CentroCostos] ON 

INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (1, N'GT01GT01600106', N'Soporte Operativo', 2, CAST(N'2024-07-12T13:46:41.9433333' AS DateTime2), CAST(N'2024-07-12T13:46:41.9433333' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (2, N'HN01HN01100402', N'ORGANIZACION Y GESTI', 1, CAST(N'2024-07-12T13:46:41.9466667' AS DateTime2), CAST(N'2024-07-12T13:46:41.9466667' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (3, N'NI01NI01M12446', N'FIN-INTELIGENCIA DE NEGOCIOS', 3, CAST(N'2024-07-12T13:46:41.9466667' AS DateTime2), CAST(N'2024-07-12T13:46:41.9466667' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (4, N'PA06PA06500135', N'Cobros', 4, CAST(N'2024-07-12T13:46:41.9466667' AS DateTime2), CAST(N'2024-07-12T13:46:41.9466667' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (5, N'GT01GT01203106', N'Atenci?n Telef?nica', 2, CAST(N'2024-07-12T13:46:41.9500000' AS DateTime2), CAST(N'2024-07-12T13:46:41.9500000' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (6, N'GT01GT01503102', N'Recuperaci?n Legal', 2, CAST(N'2024-07-12T13:46:41.9500000' AS DateTime2), CAST(N'2024-07-12T13:46:41.9500000' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (7, N'HN01HN17100106', N'TELEVENTAS SOS *3000', 1, CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2), CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (8, N'HN01HN10100100', N'TEGUCIGALPA (CREDICORP)', 1, CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2), CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (9, N'NI01NI01M72419', N'AUDITORIA INTERNA', 3, CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2), CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (10, N'NI01NI01F44001', N'BANCA EMPRESARIAL Y CORPORATIVA', 3, CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2), CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (11, N'PA06PA06300115', N'Banca Corporativa', 4, CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2), CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2))
INSERT [dbo].[CentroCostos] ([ID], [Codigo], [Nombre], [ID_Pais], [createdAt], [updatedAt]) VALUES (12, N'PA06PA06360141', N'Finanzas', 4, CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2), CAST(N'2024-07-12T13:46:41.9533333' AS DateTime2))
SET IDENTITY_INSERT [dbo].[CentroCostos] OFF
GO
SET IDENTITY_INSERT [dbo].[Departamento] ON 

INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (1, N'ADMINISTRACION', 2, CAST(N'2024-07-12T13:46:39.5833333' AS DateTime2), CAST(N'2024-07-12T13:46:39.5833333' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (2, N'CONTRALORIA', 1, CAST(N'2024-07-12T13:46:39.5833333' AS DateTime2), CAST(N'2024-07-12T13:46:39.5833333' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (3, N'CREDITOS', 3, CAST(N'2024-07-12T13:46:39.5866667' AS DateTime2), CAST(N'2024-07-12T13:46:39.5866667' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (4, N'COBROS', 4, CAST(N'2024-07-12T13:46:39.5866667' AS DateTime2), CAST(N'2024-07-12T13:46:39.5866667' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (5, N'COMPRAS', 2, CAST(N'2024-07-12T13:46:39.5866667' AS DateTime2), CAST(N'2024-07-12T13:46:39.5866667' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (6, N'SERVICIOS GENERALES', 2, CAST(N'2024-07-12T13:46:39.5900000' AS DateTime2), CAST(N'2024-07-12T13:46:39.5900000' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (7, N'CALL CENTER', 1, CAST(N'2024-07-12T13:46:39.5900000' AS DateTime2), CAST(N'2024-07-12T13:46:39.5900000' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (8, N'CLINICA', 1, CAST(N'2024-07-12T13:46:39.5933333' AS DateTime2), CAST(N'2024-07-12T13:46:39.5933333' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (9, N'INTELIGENCIA DE NEGOCIOS', 3, CAST(N'2024-07-12T13:46:39.5933333' AS DateTime2), CAST(N'2024-07-12T13:46:39.5933333' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (10, N'IMAGEN CORPORATIVA', 3, CAST(N'2024-07-12T13:46:39.5966667' AS DateTime2), CAST(N'2024-07-12T13:46:39.5966667' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (11, N'EJECUCION DE OPERACIONES', 4, CAST(N'2024-07-12T13:46:39.5966667' AS DateTime2), CAST(N'2024-07-12T13:46:39.5966667' AS DateTime2))
INSERT [dbo].[Departamento] ([ID], [N_Departamento], [ID_Pais], [createdAt], [updatedAt]) VALUES (12, N'LOGISTICA', 4, CAST(N'2024-07-12T13:46:39.5966667' AS DateTime2), CAST(N'2024-07-12T13:46:39.5966667' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Departamento] OFF
GO
SET IDENTITY_INSERT [dbo].[Division] ON 

INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (1, N'ADMINISTRACION', 1, CAST(N'2024-07-12T13:46:36.8900000' AS DateTime2), CAST(N'2024-07-12T13:46:36.8900000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (2, N'ADMINISTRACION', 2, CAST(N'2024-07-12T13:46:36.8966667' AS DateTime2), CAST(N'2024-07-12T13:46:36.8966667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (3, N'ADMINISTRACION', 3, CAST(N'2024-07-12T13:46:36.9066667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9066667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (4, N'ADMINISTRACION', 4, CAST(N'2024-07-12T13:46:36.9100000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9100000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (5, N'AUDITORIA', 1, CAST(N'2024-07-12T13:46:36.9100000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9100000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (6, N'AUDITORIA', 2, CAST(N'2024-07-12T13:46:36.9166667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9166667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (7, N'AUDITORIA', 3, CAST(N'2024-07-12T13:46:36.9200000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9200000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (8, N'AUDITORIA', 4, CAST(N'2024-07-12T13:46:36.9200000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9200000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (9, N'CORPORATIVO', 1, CAST(N'2024-07-12T13:46:36.9233333' AS DateTime2), CAST(N'2024-07-12T13:46:36.9233333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (10, N'CORPORATIVO', 2, CAST(N'2024-07-12T13:46:36.9233333' AS DateTime2), CAST(N'2024-07-12T13:46:36.9233333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (11, N'CORPORATIVO', 3, CAST(N'2024-07-12T13:46:36.9233333' AS DateTime2), CAST(N'2024-07-12T13:46:36.9233333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (12, N'CORPORATIVO', 4, CAST(N'2024-07-12T13:46:36.9266667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9266667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (13, N'CUMPLIMIENTO', 1, CAST(N'2024-07-12T13:46:36.9300000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9300000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (14, N'CUMPLIMIENTO', 2, CAST(N'2024-07-12T13:46:36.9300000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9300000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (15, N'CUMPLIMIENTO', 3, CAST(N'2024-07-12T13:46:36.9333333' AS DateTime2), CAST(N'2024-07-12T13:46:36.9333333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (16, N'CUMPLIMIENTO', 4, CAST(N'2024-07-12T13:46:36.9366667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9366667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (17, N'DIGITAL', 1, CAST(N'2024-07-12T13:46:36.9366667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9366667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (18, N'DIGITAL', 2, CAST(N'2024-07-12T13:46:36.9400000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9400000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (19, N'DIGITAL', 3, CAST(N'2024-07-12T13:46:36.9466667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9466667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (20, N'ESTRATEGIA Y NORMATIVA', 1, CAST(N'2024-07-12T13:46:36.9500000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9500000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (21, N'ESTRATEGIA Y NORMATIVA', 2, CAST(N'2024-07-12T13:46:36.9533333' AS DateTime2), CAST(N'2024-07-12T13:46:36.9533333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (22, N'ESTRATEGIA Y NORMATIVA', 3, CAST(N'2024-07-12T13:46:36.9533333' AS DateTime2), CAST(N'2024-07-12T13:46:36.9533333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (23, N'ESTRATEGIA Y NORMATIVA', 4, CAST(N'2024-07-12T13:46:36.9600000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9600000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (24, N'FINANZAS', 1, CAST(N'2024-07-12T13:46:36.9666667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9666667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (25, N'FINANZAS', 2, CAST(N'2024-07-12T13:46:36.9700000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9700000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (26, N'FINANZAS', 3, CAST(N'2024-07-12T13:46:36.9700000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9700000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (27, N'FINANZAS', 4, CAST(N'2024-07-12T13:46:36.9700000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9700000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (28, N'GERENCIA GENERAL', 1, CAST(N'2024-07-12T13:46:36.9733333' AS DateTime2), CAST(N'2024-07-12T13:46:36.9733333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (29, N'GERENCIA GENERAL', 2, CAST(N'2024-07-12T13:46:36.9766667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9766667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (30, N'GERENCIA GENERAL', 3, CAST(N'2024-07-12T13:46:36.9766667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9766667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (31, N'GERENCIA GENERAL', 4, CAST(N'2024-07-12T13:46:36.9866667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9866667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (32, N'JURIDICO', 1, CAST(N'2024-07-12T13:46:36.9866667' AS DateTime2), CAST(N'2024-07-12T13:46:36.9866667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (33, N'JURIDICO', 2, CAST(N'2024-07-12T13:46:36.9900000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9900000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (34, N'JURIDICO', 3, CAST(N'2024-07-12T13:46:36.9900000' AS DateTime2), CAST(N'2024-07-12T13:46:36.9900000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (35, N'OPERACIONES', 1, CAST(N'2024-07-12T13:46:36.9933333' AS DateTime2), CAST(N'2024-07-12T13:46:36.9933333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (36, N'OPERACIONES', 2, CAST(N'2024-07-12T13:46:37.0000000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0000000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (37, N'OPERACIONES', 3, CAST(N'2024-07-12T13:46:37.0000000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0000000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (38, N'OPERACIONES', 4, CAST(N'2024-07-12T13:46:37.0066667' AS DateTime2), CAST(N'2024-07-12T13:46:37.0066667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (39, N'PERSONAS', 1, CAST(N'2024-07-12T13:46:37.0100000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0100000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (40, N'PERSONAS', 2, CAST(N'2024-07-12T13:46:37.0166667' AS DateTime2), CAST(N'2024-07-12T13:46:37.0166667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (41, N'PERSONAS', 3, CAST(N'2024-07-12T13:46:37.0166667' AS DateTime2), CAST(N'2024-07-12T13:46:37.0166667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (42, N'PERSONAS', 4, CAST(N'2024-07-12T13:46:37.0200000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0200000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (43, N'RIESGOS', 1, CAST(N'2024-07-12T13:46:37.0300000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0300000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (44, N'RIESGOS', 2, CAST(N'2024-07-12T13:46:37.0333333' AS DateTime2), CAST(N'2024-07-12T13:46:37.0333333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (45, N'RIESGOS', 3, CAST(N'2024-07-12T13:46:37.0400000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0400000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (46, N'RIESGOS', 4, CAST(N'2024-07-12T13:46:37.0433333' AS DateTime2), CAST(N'2024-07-12T13:46:37.0433333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (47, N'TALENTO HUMANO', 1, CAST(N'2024-07-12T13:46:37.0466667' AS DateTime2), CAST(N'2024-07-12T13:46:37.0466667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (48, N'TALENTO HUMANO', 2, CAST(N'2024-07-12T13:46:37.0533333' AS DateTime2), CAST(N'2024-07-12T13:46:37.0533333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (49, N'TALENTO HUMANO', 3, CAST(N'2024-07-12T13:46:37.0633333' AS DateTime2), CAST(N'2024-07-12T13:46:37.0633333' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (50, N'TALENTO HUMANO', 4, CAST(N'2024-07-12T13:46:37.0666667' AS DateTime2), CAST(N'2024-07-12T13:46:37.0666667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (51, N'TECNOLOGIA', 1, CAST(N'2024-07-12T13:46:37.0666667' AS DateTime2), CAST(N'2024-07-12T13:46:37.0666667' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (52, N'TECNOLOGIA', 2, CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (53, N'TECNOLOGIA', 3, CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (54, N'TECNOLOGIA', 4, CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (55, N'JUNTA DIRECTIVA', 1, CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (56, N'PRESIDENCIA', 1, CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (57, N'PRESIDENCIA', 3, CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (58, N'FUNDACION FICOHSA', 1, CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2), CAST(N'2024-07-12T13:46:37.0700000' AS DateTime2))
INSERT [dbo].[Division] ([ID], [N_Division], [ID_Pais], [createdAt], [updatedAt]) VALUES (59, N'eee', 1, CAST(N'2024-07-15T10:20:02.4833333' AS DateTime2), CAST(N'2024-07-15T10:20:02.4833333' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Division] OFF
GO
SET IDENTITY_INSERT [dbo].[Pais] ON 

INSERT [dbo].[Pais] ([ID], [N_Pais], [createdAt], [updatedAt]) VALUES (1, N'Honduras', CAST(N'2024-07-12T13:46:27.5833333' AS DateTime2), CAST(N'2024-07-12T13:46:27.5833333' AS DateTime2))
INSERT [dbo].[Pais] ([ID], [N_Pais], [createdAt], [updatedAt]) VALUES (2, N'Guatemala', CAST(N'2024-07-12T13:46:27.5900000' AS DateTime2), CAST(N'2024-07-12T13:46:27.5900000' AS DateTime2))
INSERT [dbo].[Pais] ([ID], [N_Pais], [createdAt], [updatedAt]) VALUES (3, N'Nicaragua', CAST(N'2024-07-12T13:46:27.5900000' AS DateTime2), CAST(N'2024-07-12T13:46:27.5900000' AS DateTime2))
INSERT [dbo].[Pais] ([ID], [N_Pais], [createdAt], [updatedAt]) VALUES (4, N'Panama', CAST(N'2024-07-12T13:46:27.5900000' AS DateTime2), CAST(N'2024-07-12T13:46:27.5900000' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Pais] OFF
GO
SET IDENTITY_INSERT [dbo].[Perfiles] ON 

INSERT [dbo].[Perfiles] ([ID], [Rol], [Ticket], [Observaciones], [Puesto_Jefe], [Estado_Perfil], [Cod_Menu], [ID_Pais], [ID_Puesto], [ID_Aplicaciones], [createdAt], [updatedAt]) VALUES (1, N'/GFF Honduras/HN - Nivel 02/HN - Banco - Nivel 2.1', N'146300', N'ASIGNAR EL MEN? 296', N'J1', 1, 0, 1, 2, 1, CAST(N'2024-07-12T13:50:50.0933333' AS DateTime2), CAST(N'2024-07-12T13:50:50.0933333' AS DateTime2))
INSERT [dbo].[Perfiles] ([ID], [Rol], [Ticket], [Observaciones], [Puesto_Jefe], [Estado_Perfil], [Cod_Menu], [ID_Pais], [ID_Puesto], [ID_Aplicaciones], [createdAt], [updatedAt]) VALUES (2, N'SUPERVISOR_PRESTAMOS', N'15300', N'Requerimiento de Talento HUmano', N'J2', 2, NULL, 4, 2, 2, CAST(N'2024-07-12T13:50:50.1033333' AS DateTime2), CAST(N'2024-07-12T13:50:50.1033333' AS DateTime2))
INSERT [dbo].[Perfiles] ([ID], [Rol], [Ticket], [Observaciones], [Puesto_Jefe], [Estado_Perfil], [Cod_Menu], [ID_Pais], [ID_Puesto], [ID_Aplicaciones], [createdAt], [updatedAt]) VALUES (3, N'64', NULL, N'', N'J3', 1, 0, 3, 3, 6, CAST(N'2024-07-12T13:50:50.1033333' AS DateTime2), CAST(N'2024-07-12T13:50:50.1033333' AS DateTime2))
INSERT [dbo].[Perfiles] ([ID], [Rol], [Ticket], [Observaciones], [Puesto_Jefe], [Estado_Perfil], [Cod_Menu], [ID_Pais], [ID_Puesto], [ID_Aplicaciones], [createdAt], [updatedAt]) VALUES (4, N'ZNW_SAP_BC_SPOOL_ADMn', N'78667', N'', N'J4', 1, 0, 2, 4, 2, CAST(N'2024-07-12T13:50:50.1066667' AS DateTime2), CAST(N'2024-07-12T13:50:50.1066667' AS DateTime2))
INSERT [dbo].[Perfiles] ([ID], [Rol], [Ticket], [Observaciones], [Puesto_Jefe], [Estado_Perfil], [Cod_Menu], [ID_Pais], [ID_Puesto], [ID_Aplicaciones], [createdAt], [updatedAt]) VALUES (5, N'Perfil para rol ZNW_SAP_BC_SPOOL_ADMIN', NULL, N'', N'J5', 1, 0, 1, 5, 5, CAST(N'2024-07-12T13:50:50.1066667' AS DateTime2), CAST(N'2024-07-12T13:50:50.1066667' AS DateTime2))
INSERT [dbo].[Perfiles] ([ID], [Rol], [Ticket], [Observaciones], [Puesto_Jefe], [Estado_Perfil], [Cod_Menu], [ID_Pais], [ID_Puesto], [ID_Aplicaciones], [createdAt], [updatedAt]) VALUES (6, N'CONNECT', NULL, N'', N'J6', 2, 7845, 1, 6, 30, CAST(N'2024-07-12T13:50:50.1100000' AS DateTime2), CAST(N'2024-07-12T13:50:50.1100000' AS DateTime2))
INSERT [dbo].[Perfiles] ([ID], [Rol], [Ticket], [Observaciones], [Puesto_Jefe], [Estado_Perfil], [Cod_Menu], [ID_Pais], [ID_Puesto], [ID_Aplicaciones], [createdAt], [updatedAt]) VALUES (7, N'Jefe de Estrategia', NULL, N'', N'J7', 1, NULL, 2, 7, 7, CAST(N'2024-07-12T13:50:50.1100000' AS DateTime2), CAST(N'2024-07-12T13:50:50.1100000' AS DateTime2))
INSERT [dbo].[Perfiles] ([ID], [Rol], [Ticket], [Observaciones], [Puesto_Jefe], [Estado_Perfil], [Cod_Menu], [ID_Pais], [ID_Puesto], [ID_Aplicaciones], [createdAt], [updatedAt]) VALUES (8, N'92', NULL, N'', N'J8', 2, NULL, 3, 8, 8, CAST(N'2024-07-12T13:50:50.1200000' AS DateTime2), CAST(N'2024-07-12T13:50:50.1200000' AS DateTime2))
INSERT [dbo].[Perfiles] ([ID], [Rol], [Ticket], [Observaciones], [Puesto_Jefe], [Estado_Perfil], [Cod_Menu], [ID_Pais], [ID_Puesto], [ID_Aplicaciones], [createdAt], [updatedAt]) VALUES (9, N'200', NULL, N'', N'J9', 2, NULL, 3, 9, 9, CAST(N'2024-07-12T13:50:50.1200000' AS DateTime2), CAST(N'2024-07-12T13:50:50.1200000' AS DateTime2))
INSERT [dbo].[Perfiles] ([ID], [Rol], [Ticket], [Observaciones], [Puesto_Jefe], [Estado_Perfil], [Cod_Menu], [ID_Pais], [ID_Puesto], [ID_Aplicaciones], [createdAt], [updatedAt]) VALUES (10, N'/GFF Panama/PA - Nivel 01/PA - Banco - Nivel 1.1', NULL, N'', N'J10', 1, NULL, 4, 10, 10, CAST(N'2024-07-12T13:50:50.1200000' AS DateTime2), CAST(N'2024-07-12T13:50:50.1200000' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Perfiles] OFF
GO
SET IDENTITY_INSERT [dbo].[Permisos] ON 

INSERT [dbo].[Permisos] ([ID], [P_Consulta], [P_Insertar], [P_Editar], [P_Desactivar], [P_Administrador], [P_Paises], [createdAt], [updatedAt]) VALUES (1, 1, 1, 1, 1, 1, 1, CAST(N'2024-07-12T13:50:59.5533333' AS DateTime2), CAST(N'2024-07-12T13:50:59.5533333' AS DateTime2))
INSERT [dbo].[Permisos] ([ID], [P_Consulta], [P_Insertar], [P_Editar], [P_Desactivar], [P_Administrador], [P_Paises], [createdAt], [updatedAt]) VALUES (2, 1, 1, 1, 1, 0, 2, CAST(N'2024-07-12T13:50:59.5533333' AS DateTime2), CAST(N'2024-07-12T13:50:59.5533333' AS DateTime2))
INSERT [dbo].[Permisos] ([ID], [P_Consulta], [P_Insertar], [P_Editar], [P_Desactivar], [P_Administrador], [P_Paises], [createdAt], [updatedAt]) VALUES (3, 1, 0, 0, 0, 0, 3, CAST(N'2024-07-12T13:50:59.5533333' AS DateTime2), CAST(N'2024-07-12T13:50:59.5533333' AS DateTime2))
INSERT [dbo].[Permisos] ([ID], [P_Consulta], [P_Insertar], [P_Editar], [P_Desactivar], [P_Administrador], [P_Paises], [createdAt], [updatedAt]) VALUES (4, 1, 1, 1, 1, 0, 4, CAST(N'2024-07-12T13:50:59.5566667' AS DateTime2), CAST(N'2024-07-12T13:50:59.5566667' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Permisos] OFF
GO
SET IDENTITY_INSERT [dbo].[PuestoIn] ON 

INSERT [dbo].[PuestoIn] ([ID], [N_PuestoIn], [createdAt], [updatedAt]) VALUES (1, N'Subgerente General de Monitoreo y Seguridad Logica', CAST(N'2024-07-12T13:50:57.4066667' AS DateTime2), CAST(N'2024-07-12T13:50:57.4066667' AS DateTime2))
INSERT [dbo].[PuestoIn] ([ID], [N_PuestoIn], [createdAt], [updatedAt]) VALUES (2, N'Oficial SR. de Seguridad Logica', CAST(N'2024-07-12T13:50:57.4133333' AS DateTime2), CAST(N'2024-07-12T13:50:57.4133333' AS DateTime2))
INSERT [dbo].[PuestoIn] ([ID], [N_PuestoIn], [createdAt], [updatedAt]) VALUES (3, N'Jefe Regional de Seguridad Logica', CAST(N'2024-07-12T13:50:57.4133333' AS DateTime2), CAST(N'2024-07-12T13:50:57.4133333' AS DateTime2))
INSERT [dbo].[PuestoIn] ([ID], [N_PuestoIn], [createdAt], [updatedAt]) VALUES (4, N'Oficial de Seguridad de la Informaci?n', CAST(N'2024-07-12T13:50:57.4133333' AS DateTime2), CAST(N'2024-07-12T13:50:57.4133333' AS DateTime2))
INSERT [dbo].[PuestoIn] ([ID], [N_PuestoIn], [createdAt], [updatedAt]) VALUES (5, N'Jefe Regional de Mesa de Servicio', CAST(N'2024-07-12T13:50:57.4133333' AS DateTime2), CAST(N'2024-07-12T13:50:57.4133333' AS DateTime2))
SET IDENTITY_INSERT [dbo].[PuestoIn] OFF
GO
SET IDENTITY_INSERT [dbo].[Puestos] ON 

INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (1, 8899, N'GERENTE ADMINISTRATIVO Y DE MEJORA CONTINUA', 1, 2, 1, 2, 2, CAST(N'2024-07-12T13:46:46.6166667' AS DateTime2), CAST(N'2024-07-12T13:46:46.6166667' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (2, 8891, N'ANALISTA QA', 1, 2, 2, 2, 2, CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2), CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (3, 8892, N'CAJERO DE APOYO', 3, 3, 3, 3, 3, CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2), CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (4, 8893, N'AUXILIAR DE COBROS', 4, 4, 4, 4, 4, CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2), CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (5, 8894, N'AUXILIAR ADMINISTRATIVO', 2, 5, 5, 5, 5, CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2), CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (6, 8895, N'OFICIAL SR. DE COMPRAS', 2, 1, 6, 6, 6, CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2), CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (7, 8896, N'OFICIAL SR. DE CONTABILIDAD', 1, 6, 7, 7, 7, CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2), CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (8, 8897, N'OFICIAL SR. DE CONSOLIDACION FINANCIERA', 1, 7, 8, 8, 8, CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2), CAST(N'2024-07-12T13:46:46.6200000' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (9, 8898, N'OFICIAL SR. DE CUMPLIMIENTO', 3, 3, 12, 9, 9, CAST(N'2024-07-12T13:46:46.6233333' AS DateTime2), CAST(N'2024-07-12T13:46:46.6233333' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (10, 8890, N'ANALISTA MIS', 3, 8, 13, 10, 10, CAST(N'2024-07-12T13:46:46.6233333' AS DateTime2), CAST(N'2024-07-12T13:46:46.6233333' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (11, 8889, N'AUXILIAR DE SERVICIO', 4, 4, 15, 11, 11, CAST(N'2024-07-12T13:46:46.6233333' AS DateTime2), CAST(N'2024-07-12T13:46:46.6233333' AS DateTime2))
INSERT [dbo].[Puestos] ([ID], [Codigo], [N_Puesto], [ID_Pais], [ID_RSocial], [ID_Division], [ID_Departamento], [ID_CentroCostos], [createdAt], [updatedAt]) VALUES (12, 8888, N'OFICIAL DE BANCA CORPORATIVA', 4, 9, 14, 12, 12, CAST(N'2024-07-12T13:46:46.6233333' AS DateTime2), CAST(N'2024-07-12T13:46:46.6233333' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Puestos] OFF
GO
SET IDENTITY_INSERT [dbo].[RolUsuario] ON 

INSERT [dbo].[RolUsuario] ([ID], [N_Rol], [Des_Rol], [Fec_Creacion], [Fec_Modificacion], [createdAt], [updatedAt], [ID_Permisos], [Insertar], [Editar], [Paises]) VALUES (1, N'SuperAdmin', N'Rol encargado del Sistema con el maximo nivel de permisos', CAST(N'2024-05-09' AS Date), NULL, CAST(N'2024-07-12T13:51:01.5966667' AS DateTime2), CAST(N'2024-07-12T13:51:01.5966667' AS DateTime2), 1, 1, 1, N'1,2,3,4')
INSERT [dbo].[RolUsuario] ([ID], [N_Rol], [Des_Rol], [Fec_Creacion], [Fec_Modificacion], [createdAt], [updatedAt], [ID_Permisos], [Insertar], [Editar], [Paises]) VALUES (2, N'Seguridad Logica', N'Rol encargado de el ?rea de Seguridad Logica', CAST(N'2024-05-27' AS Date), NULL, CAST(N'2024-07-12T13:51:01.6033333' AS DateTime2), CAST(N'2024-07-12T13:51:01.6033333' AS DateTime2), 2, 1, 1, N'1, 2, 3, 4')
INSERT [dbo].[RolUsuario] ([ID], [N_Rol], [Des_Rol], [Fec_Creacion], [Fec_Modificacion], [createdAt], [updatedAt], [ID_Permisos], [Insertar], [Editar], [Paises]) VALUES (3, N'Mesa de Servicio', N'Rol encargado de el ?rea de mesa de servicio', CAST(N'2024-05-27' AS Date), NULL, CAST(N'2024-07-12T13:51:01.6033333' AS DateTime2), CAST(N'2024-07-12T13:51:01.6033333' AS DateTime2), 3, 2, 2, N'1,2,3,4')
INSERT [dbo].[RolUsuario] ([ID], [N_Rol], [Des_Rol], [Fec_Creacion], [Fec_Modificacion], [createdAt], [updatedAt], [ID_Permisos], [Insertar], [Editar], [Paises]) VALUES (4, N'Jefe de Seguridad Logica', N'Rol especifico de Jefe de Seguridad Logica', CAST(N'2024-05-25' AS Date), NULL, CAST(N'2024-07-12T13:51:01.6066667' AS DateTime2), CAST(N'2024-07-12T13:51:01.6066667' AS DateTime2), 4, 1, 2, N'1, 4')
INSERT [dbo].[RolUsuario] ([ID], [N_Rol], [Des_Rol], [Fec_Creacion], [Fec_Modificacion], [createdAt], [updatedAt], [ID_Permisos], [Insertar], [Editar], [Paises]) VALUES (5, N'Oficial de SL', N'Rol Oficial de SL', CAST(N'2024-05-22' AS Date), NULL, CAST(N'2024-07-12T13:51:01.6066667' AS DateTime2), CAST(N'2024-07-12T13:51:01.6066667' AS DateTime2), 2, 2, 1, N'3,2,4')
SET IDENTITY_INSERT [dbo].[RolUsuario] OFF
GO
SET IDENTITY_INSERT [dbo].[RSocial] ON 

INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (1, N'Ficohsa|Banco GTM', 2, CAST(N'2024-07-12T13:46:31.2266667' AS DateTime2), CAST(N'2024-07-12T13:46:31.2266667' AS DateTime2))
INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (2, N'CONECTA COMUNICACIONES', 1, CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2), CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2))
INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (3, N'Ficohsa|Banco NIC', 3, CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2), CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2))
INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (4, N'Ficohsa|Banco PAN', 4, CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2), CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2))
INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (5, N'Ficohsa|Seguros GTM', 2, CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2), CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2))
INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (6, N'Ficohsa|Pensiones', 1, CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2), CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2))
INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (7, N'Ficohsa|Seguros', 1, CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2), CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2))
INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (8, N'Ficohsa|Tarjetas NIC', 3, CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2), CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2))
INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (9, N'Ficohsa|Tarjetas PAN', 4, CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2), CAST(N'2024-07-12T13:46:31.2333333' AS DateTime2))
INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (10, N'GRUPO FINANCIERO FICOHSA', 1, CAST(N'2024-07-12T13:46:31.2366667' AS DateTime2), CAST(N'2024-07-12T13:46:31.2366667' AS DateTime2))
INSERT [dbo].[RSocial] ([ID], [N_RSocial], [ID_Pais], [createdAt], [updatedAt]) VALUES (11, N'Tengo', 1, CAST(N'2024-07-12T13:46:31.2366667' AS DateTime2), CAST(N'2024-07-12T13:46:31.2366667' AS DateTime2))
SET IDENTITY_INSERT [dbo].[RSocial] OFF
GO
SET IDENTITY_INSERT [dbo].[Usuario] ON 

INSERT [dbo].[Usuario] ([ID], [Usuario], [Nombre], [Contrasenia], [Fec_Creacion], [Fec_Ult_Conexion], [Fec_Exp_Acceso], [Estado], [ID_PuestoIn], [ID_RolUsuario], [createdAt], [updatedAt]) VALUES (1, N'HN00222', N'Juan Roque', N'Realmadrid,15', CAST(N'2024-05-28' AS Date), CAST(N'2024-06-01' AS Date), CAST(N'2025-05-28' AS Date), 2, 1, 1, CAST(N'2024-07-12T13:51:03.9800000' AS DateTime2), CAST(N'2024-07-12T13:51:03.9800000' AS DateTime2))
INSERT [dbo].[Usuario] ([ID], [Usuario], [Nombre], [Contrasenia], [Fec_Creacion], [Fec_Ult_Conexion], [Fec_Exp_Acceso], [Estado], [ID_PuestoIn], [ID_RolUsuario], [createdAt], [updatedAt]) VALUES (2, N'PR00100', N'Oscar Reyes', N'Qwerty321', CAST(N'2024-05-30' AS Date), CAST(N'2024-06-03' AS Date), CAST(N'2025-05-30' AS Date), 3, 2, 2, CAST(N'2024-07-12T13:51:03.9833333' AS DateTime2), CAST(N'2024-07-12T13:51:03.9833333' AS DateTime2))
INSERT [dbo].[Usuario] ([ID], [Usuario], [Nombre], [Contrasenia], [Fec_Creacion], [Fec_Ult_Conexion], [Fec_Exp_Acceso], [Estado], [ID_PuestoIn], [ID_RolUsuario], [createdAt], [updatedAt]) VALUES (3, N'HN00278', N'Pedro Ordo?ez', N'Qwerty458', CAST(N'2024-06-01' AS Date), CAST(N'2024-06-05' AS Date), CAST(N'2025-06-01' AS Date), 2, 3, 3, CAST(N'2024-07-12T13:51:03.9833333' AS DateTime2), CAST(N'2024-07-12T13:51:03.9833333' AS DateTime2))
INSERT [dbo].[Usuario] ([ID], [Usuario], [Nombre], [Contrasenia], [Fec_Creacion], [Fec_Ult_Conexion], [Fec_Exp_Acceso], [Estado], [ID_PuestoIn], [ID_RolUsuario], [createdAt], [updatedAt]) VALUES (4, N'HN00002', N'David Flores', N'Qwerty910', CAST(N'2024-06-01' AS Date), CAST(N'2024-06-05' AS Date), CAST(N'2025-06-01' AS Date), 2, 4, 4, CAST(N'2024-07-12T13:51:03.9833333' AS DateTime2), CAST(N'2024-07-12T13:51:03.9833333' AS DateTime2))
INSERT [dbo].[Usuario] ([ID], [Usuario], [Nombre], [Contrasenia], [Fec_Creacion], [Fec_Ult_Conexion], [Fec_Exp_Acceso], [Estado], [ID_PuestoIn], [ID_RolUsuario], [createdAt], [updatedAt]) VALUES (5, N'HN00111', N'Alexis Sierra', N'Qwerty696', CAST(N'2024-06-01' AS Date), CAST(N'2024-06-05' AS Date), CAST(N'2025-06-01' AS Date), 2, 5, 5, CAST(N'2024-07-12T13:51:03.9833333' AS DateTime2), CAST(N'2024-07-12T13:51:03.9833333' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Usuario] OFF
GO
ALTER TABLE [dbo].[Ambientes] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Ambientes] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Aplicaciones] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Aplicaciones] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Auditoria] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Auditoria] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[CentroCostos] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[CentroCostos] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Departamento] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Departamento] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Division] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Division] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Pais] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Pais] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Perfiles] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Perfiles] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Permisos] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Permisos] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[PuestoIn] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[PuestoIn] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Puestos] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Puestos] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[RolUsuario] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[RolUsuario] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[RSocial] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[RSocial] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Usuario] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[Usuario] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[Aplicaciones]  WITH CHECK ADD FOREIGN KEY([ID_Pais])
REFERENCES [dbo].[Pais] ([ID])
GO
ALTER TABLE [dbo].[Auditoria]  WITH CHECK ADD FOREIGN KEY([ID_Usuario])
REFERENCES [dbo].[Usuario] ([ID])
GO
ALTER TABLE [dbo].[CentroCostos]  WITH CHECK ADD FOREIGN KEY([ID_Pais])
REFERENCES [dbo].[Pais] ([ID])
GO
ALTER TABLE [dbo].[Departamento]  WITH CHECK ADD FOREIGN KEY([ID_Pais])
REFERENCES [dbo].[Pais] ([ID])
GO
ALTER TABLE [dbo].[Division]  WITH CHECK ADD FOREIGN KEY([ID_Pais])
REFERENCES [dbo].[Pais] ([ID])
GO
ALTER TABLE [dbo].[Perfiles]  WITH CHECK ADD FOREIGN KEY([ID_Aplicaciones])
REFERENCES [dbo].[Aplicaciones] ([ID])
GO
ALTER TABLE [dbo].[Perfiles]  WITH CHECK ADD FOREIGN KEY([ID_Pais])
REFERENCES [dbo].[Pais] ([ID])
GO
ALTER TABLE [dbo].[Perfiles]  WITH CHECK ADD FOREIGN KEY([ID_Puesto])
REFERENCES [dbo].[Puestos] ([ID])
GO
ALTER TABLE [dbo].[Permisos]  WITH CHECK ADD FOREIGN KEY([P_Paises])
REFERENCES [dbo].[Pais] ([ID])
GO
ALTER TABLE [dbo].[Puestos]  WITH CHECK ADD FOREIGN KEY([ID_CentroCostos])
REFERENCES [dbo].[CentroCostos] ([ID])
GO
ALTER TABLE [dbo].[Puestos]  WITH CHECK ADD FOREIGN KEY([ID_Departamento])
REFERENCES [dbo].[Departamento] ([ID])
GO
ALTER TABLE [dbo].[Puestos]  WITH CHECK ADD FOREIGN KEY([ID_Division])
REFERENCES [dbo].[Division] ([ID])
GO
ALTER TABLE [dbo].[Puestos]  WITH CHECK ADD FOREIGN KEY([ID_Pais])
REFERENCES [dbo].[Pais] ([ID])
GO
ALTER TABLE [dbo].[Puestos]  WITH CHECK ADD FOREIGN KEY([ID_RSocial])
REFERENCES [dbo].[RSocial] ([ID])
GO
ALTER TABLE [dbo].[RolUsuario]  WITH CHECK ADD FOREIGN KEY([ID_Permisos])
REFERENCES [dbo].[Permisos] ([ID])
GO
ALTER TABLE [dbo].[RSocial]  WITH CHECK ADD FOREIGN KEY([ID_Pais])
REFERENCES [dbo].[Pais] ([ID])
GO
ALTER TABLE [dbo].[Usuario]  WITH CHECK ADD FOREIGN KEY([ID_PuestoIn])
REFERENCES [dbo].[PuestoIn] ([ID])
GO
ALTER TABLE [dbo].[Usuario]  WITH CHECK ADD FOREIGN KEY([ID_RolUsuario])
REFERENCES [dbo].[RolUsuario] ([ID])
GO
USE [master]
GO
ALTER DATABASE [DB_Ficohsa] SET  READ_WRITE 
GO
