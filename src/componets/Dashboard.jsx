import React, { useState, useEffect } from "react";
import Sidebar from "./SideNavBar.jsx";
import TopBar from "./TopBar.jsx";
import styled from "styled-components";
import axios from "axios";
import { Card } from "antd";
import { Card as AntCard, Col, Row, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Brush,
} from "recharts";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding-top: 0;
`;

const Title = styled.h2`
  flex-grow: 1;
  text-align: center;
  font-size: 35px;
  color: #083cac;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  padding-top: 0;
  background-color: #f4f4f4;
  overflow-y: auto;
  @media (max-width: 768px) {
    padding-top: 0;
  }
`;

const ChartCard = styled(AntCard)`
  width: 100%;
  max-width: 900px;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const ChartCardGraf = styled(AntCard)`
  width: 100%;
  max-width: 1900px;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;
const CountryCard = styled.div`
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const CountryCardTitle = styled.h3`
  margin-bottom: 16px;
  color: #333;
  font-size: 18px;
`;

const CountryCardList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CountryCardItem = styled.li`
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 4px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

const CountryCardsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const CountryCardCol = styled.div`
  flex: 1 1 calc(25% - 16px);
  max-width: calc(25% - 16px);

  @media (max-width: 1200px) {
    flex: 1 1 calc(33.33% - 16px);
    max-width: calc(33.33% - 16px);
  }

  @media (max-width: 992px) {
    flex: 1 1 calc(50% - 16px);
    max-width: calc(50% - 16px);
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    max-width: 100%;
  }
`;

const Banderas = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px; /* ajusta el valor según sea necesario */
`;
const MinimalScroll = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${(props) => props.scrollbarColor} #fff;

  &::-webkit-scrollbar {
    width: ${(props) => props.scrollbarWidth}px;
    height: ${(props) => props.scrollbarHeight}px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.scrollbarThumbColor};
    border-radius: ${(props) => props.scrollbarThumbRadius}px;
  }

  &::-webkit-scrollbar-track {
    background-color: #fff;
  }
`;

const getFlagSrc = (paisName) => {
  try {
    return require(`../imgs/${paisName}.png`);
  } catch (e) {
    return require(`../imgs/globe.png`);
  }
};

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [paises, setPaises] = useState([]);
  const [setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countryCount, setCountryCount] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [appCountryCounts, setAppCountryCounts] = useState({});
  const [chartData, setChartData] = useState([]);
  const [countryAppCounts, setCountryAppCounts] = useState([]);
  const [puestosPorPais, setPuestosPorPais] = useState({});
  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/aplicacion/`);
        const data = response.data;
        const mappedData = await Promise.all(
          data.map(async (aplicacion) => {
            const paisResponse = await axios.get(
              `http://localhost:3000/pais/${aplicacion.ID_Pais}`
            );

            const ambienteIds = aplicacion.Ambientes.split(",").map(Number);
            const ambienteNombres = await Promise.all(
              ambienteIds.map(async (id) => {
                const ambienteResponse = await axios.get(
                  `http://localhost:3000/ambiente/${id}`
                );
                return ambienteResponse.data.N_Ambiente;
              })
            );
            return {
              id: aplicacion.id,
              N_Aplicaciones: aplicacion.N_Aplicaciones,
              ID_Pais: aplicacion.ID_Pais,
              N_Pais: paisResponse.data.N_Pais,
              Ambientes: ambienteNombres,
            };
          })
        );
        setRecords(mappedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los Ambientes:", error);
        setLoading(false);
      }
    };

    const fetchPais = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/pais/`);
        setPaises(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de Paises", error);
      }
    };

    const fetchAmbiente = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/ambiente/`);
        setAmbientes(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de ambientes", error);
      }
    };

    fetchData();
    fetchPais();
    fetchAmbiente();
  }, [setAmbientes]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/perfil");
        const data = response.data;

        const counts = {}; // Contador de registros por país y aplicación

        await Promise.all(
          data.map(async (perfil) => {
            const paisResponse = await axios.get(
              `http://localhost:3000/pais/${perfil.ID_Pais}`
            );
            const countryName = paisResponse.data.N_Pais;

            const aplicacionResponse = await axios.get(
              `http://localhost:3000/aplicacion/${perfil.ID_Aplicaciones}`
            );
            const appName = aplicacionResponse.data.N_Aplicaciones;

            if (!counts[countryName]) {
              counts[countryName] = {};
            }

            if (!counts[countryName][appName]) {
              counts[countryName][appName] = 0;
            }

            counts[countryName][appName] += 1;
          })
        );

        const structuredData = Object.keys(counts).map((countryName) => ({
          country: countryName,
          applications: Object.keys(counts[countryName]).map((appName) => ({
            name: appName,
            count: counts[countryName][appName],
          })),
        }));

        setCountryAppCounts(structuredData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los perfiles:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/perfil");
        const data = response.data;

        const countryCount = {}; // Contador de registros por país
        const counts = {}; // Contador de registros por país y aplicación

        await Promise.all(
          data.map(async (perfil) => {
            const paisResponse = await axios.get(
              `http://localhost:3000/pais/${perfil.ID_Pais}`
            );
            const countryName = paisResponse.data.N_Pais;

            if (!countryCount[countryName]) {
              countryCount[countryName] = 0;
            }
            countryCount[countryName] += 1;

            const aplicacionResponse = await axios.get(
              `http://localhost:3000/aplicacion/${perfil.ID_Aplicaciones}`
            );
            const appName = aplicacionResponse.data.N_Aplicaciones;

            if (!counts[appName]) {
              counts[appName] = {};
            }

            if (!counts[appName][countryName]) {
              counts[appName][countryName] = 0;
            }

            counts[appName][countryName] += 1;
          })
        );

        setCountryCount(countryCount); // Guardar el contador en el estado
        setAppCountryCounts(counts);

        const profilesData = Object.keys(countryCount).map((countryName) => ({
          name: countryName,
          Perfiles: countryCount[countryName], // Usamos el contar registros para cada pais
        }));

        // Aquí puedes usar la variable profilesData para mostrarla en tu card
        console.log(profilesData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los perfiles:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/perfil");
        const data = response.data;

        const today = new Date();
        const past90Days = new Date(today);
        past90Days.setDate(today.getDate() - 365);

        // Generar todas las fechas en el rango de los últimos 30 días
        const dateRange = generateDateRange(past90Days, today);
        const dateCountryCount = dateRange.reduce((acc, date) => {
          const formattedDate = date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          });
          acc[formattedDate] = { date: formattedDate };
          return acc;
        }, {});

        await Promise.all(
          data.map(async (perfil) => {
            const creationDate = new Date(perfil.createdAt);
            if (creationDate >= past90Days && creationDate <= today) {
              const formattedDate = creationDate.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              });
              const paisResponse = await axios.get(
                `http://localhost:3000/pais/${perfil.ID_Pais}`
              );
              const countryName = paisResponse.data.N_Pais;

              if (!dateCountryCount[formattedDate][countryName]) {
                dateCountryCount[formattedDate][countryName] = 0;
              }

              dateCountryCount[formattedDate][countryName] += 1;
            }
          })
        );

        const formattedData = Object.values(dateCountryCount);

        setChartData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los perfiles:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const profilesData = Object.keys(countryCount).map((countryName) => ({
    name: countryName,
    Perfiles: countryCount[countryName], // Usamos el contar registros para cada pais
  }));

  const data = paises.map((pais) => ({
    name: pais.N_Pais,
    Aplicaciones: records.filter((record) => record.ID_Pais === pais.id).length,
  }));

  function getColor(index) {
    const colors = [
      "#8884d8", // azul oscuro
      "#82ca9d", // verde claro
      "#ffc107", // naranja
      "#7cb5ec", // azul claro
      "#434a54", // gris oscuro
      "#f7dc6f", // amarillo claro
      "#8e44ad", // púrpura
      "#4CAF50", // verde oscuro
      "#03A9F4", // azul brillante
      "#FF9800", // naranja claro
      "#2196F3", // azul claro
      "#9C27B0", // púrpura claro
      "#009688", // verde claro
      "#FFC400", // naranja oscuro
      "#673AB7", // púrpura oscuro
      "#00BCD4", // azul claro
    ];
    return colors[index % colors.length];
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/perfil/`);
        const data = response.data;

        // Calcular la cantidad de puestos por país
        const puestosPorPais = {};
        const uniquePaises = [...new Set(data.map((perfil) => perfil.ID_Pais))];
        uniquePaises.forEach((pais) => {
          const uniquePuestos = [
            ...new Set(
              data
                .filter((perfil) => perfil.ID_Pais === pais)
                .map((perfil) => perfil.ID_Puesto)
            ),
          ];
          puestosPorPais[pais] = uniquePuestos.length;
        });

        setPuestosPorPais(puestosPorPais);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los perfiles:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <DashboardContainer>
      <TopBar />
      <MainContent>
        <Sidebar />
        <ContentContainer>
          <HeaderContainer>
            <Title>Dashboard</Title>
          </HeaderContainer>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <ChartCard title="Aplicaciones por Paises">
                <Spin spinning={data.length === 0} tip="Cargando...">
                  <BarChart
                    width={800}
                    height={300}
                    data={data}
                    maxWidth={500}
                    maxHeight={300}
                    className={
                      data.length > 0 ? "animate__animated animate__fadeIn" : ""
                    }
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="Aplicaciones" fill="#409EC0" />
                  </BarChart>
                </Spin>
              </ChartCard>
            </Col>
            <Col span={12}>
              <ChartCard
                title="Perfiles por Paises"
                style={{ overflowX: "auto" }}
              >
                <Spin spinning={profilesData.length === 0} tip="Cargando...">
                  <BarChart
                    width={800}
                    height={300}
                    data={profilesData}
                    maxWidth={800}
                    maxHeight={300}
                    className={
                      profilesData.length > 0
                        ? "animate__animated animate__fadeIn"
                        : ""
                    }
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Tooltip />
                    <Bar dataKey="Perfiles" fill="#2196F3" />
                  </BarChart>
                </Spin>
              </ChartCard>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <ChartCardGraf title="Registro de Perfiles">
                {loading ? (
                  <LoadingContainer>
                    <Spin tip="Cargando..." />
                  </LoadingContainer>
                ) : (
                  <LineChart
                    width={1700}
                    height={400}
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => {
                        const parts = date.split("/");
                        return `${parts[1]}/${parts[0]}/${parts[2]}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Array.from(
                      new Set(
                        chartData.flatMap((item) =>
                          Object.keys(item).filter((key) => key !== "date")
                        )
                      )
                    ).map((country, index) => (
                      <Line
                        key={country}
                        type="monotone"
                        dataKey={country}
                        name={country}
                        stroke={getColor(index)}
                        activeDot={{ r: 8 }}
                        connectNulls
                      />
                    ))}
                    <Brush
                      dataKey="date"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={chartData.length - 1}
                    />
                  </LineChart>
                )}
              </ChartCardGraf>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Países y Perfiles" bordered={false}>
                <CountryCardsRow>
                  {loading ? (
                    <LoadingContainer>
                      <Spin tip="Cargando..." />
                    </LoadingContainer>
                  ) : (
                    paises
                      .slice()
                      .sort((a, b) => a.N_Pais.localeCompare(b.N_Pais))
                      .map((pais, index) => (
                        <CountryCardCol key={index}>
                          <CountryCard>
                            <CountryCardTitle>
                              <Banderas
                                src={getFlagSrc(pais.N_Pais)}
                                alt="Flag image"
                              />
                              {pais.N_Pais}
                            </CountryCardTitle>
                            <div>
                              <strong>Cantidad de Puestos: </strong>
                              {puestosPorPais[pais.id] || 0}
                            </div>
                            <div
                              style={{
                                height: "400px",
                                overflowY:
                                  records.filter(
                                    (record) => record.ID_Pais === pais.id
                                  ).length > 5
                                    ? "auto"
                                    : "hidden",
                              }}
                            >
                              <MinimalScroll
                                scrollbarColor="#ccc"
                                scrollbarWidth={1}
                                scrollbarHeight={1}
                                scrollbarThumbColor="#ccc"
                                scrollbarThumbRadius={1}
                                style={{ height: "400px" }}
                              >
                                <CountryCardList>
                                  {records
                                    .filter(
                                      (record) => record.ID_Pais === pais.id
                                    )
                                    .map((record, index) => (
                                      <CountryCardItem key={index}>
                                        <span>{record.N_Aplicaciones}</span>
                                        <span>
                                          {record.Ambientes.join(", ")}
                                        </span>
                                      </CountryCardItem>
                                    ))}
                                </CountryCardList>
                              </MinimalScroll>
                            </div>
                            <div
                              style={{
                                marginTop: "20px",
                                borderTop: "1px solid #ccc",
                                paddingTop: "20px",
                              }}
                            >
                              <strong>Perfiles por Aplicaciones:</strong>
                              {countryAppCounts
                                .filter(
                                  (countryData) =>
                                    countryData.country === pais.N_Pais
                                )
                                .map((countryData) => (
                                  <div key={countryData.country}>
                                    <CountryCardList>
                                      {countryData.applications.map((app) => (
                                        <CountryCardItem key={app.name}>
                                          <span>
                                            {app.name}: {app.count} puestos de
                                            trabajo, {app.roles} roles
                                          </span>
                                        </CountryCardItem>
                                      ))}
                                    </CountryCardList>
                                  </div>
                                ))}
                            </div>
                          </CountryCard>
                        </CountryCardCol>
                      ))
                  )}
                </CountryCardsRow>
              </Card>
            </Col>
          </Row>
        </ContentContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
