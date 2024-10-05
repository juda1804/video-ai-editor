// src/components/EstadoPedidos.tsx
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Box } from "@mui/material";
import { Pedido } from "../../types";
import EstadosOtrosModal from "./EstadosOtrosModal";
import { EstadosConfig } from "./EstadosConfig";

interface EstadoPedidosProps {
  pedidos: Pedido[];
}

const EstadoPedidos: React.FC<EstadoPedidosProps> = ({ pedidos }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [estadosOtros, setEstadosOtros] = useState<string[]>([]);

  // Mapeamos los estados y sus alias a un solo grupo
  const estadoMap = EstadosConfig.reduce((acc, { nombre, alias }) => {
    acc[nombre] = nombre; // Mapea el nombre original
    alias.forEach((a) => {
      acc[a] = nombre; // Mapea cada alias al nombre del grupo
    });
    return acc;
  }, {} as Record<string, string>);

  // Contamos los pedidos agrupados por estado, incluyendo los no listados en "Otros"
  const contadorEstados = pedidos.reduce((acc, pedido) => {
    const grupo = estadoMap[pedido.status] || "OTROS"; // Agrupa en "OTROS" si no está mapeado
    acc[grupo] = (acc[grupo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filtramos y ordenamos los estados según la configuración
  const estadosOrdenados = EstadosConfig
    //.filter((estado) => contadorEstados[estado.nombre] !== undefined)
    .sort((a, b) => a.posicion - b.posicion);

  // Recopilamos los estados que están bajo "Otros"
  const estadosEnOtros = Array.from(
    new Set(
      pedidos
        .map((pedido) => pedido.status)
        .filter((status) => !estadoMap[status])
    )
  );

  const handleOpenModal = () => {
    setEstadosOtros(estadosEnOtros);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleBoxClick = (estado: string) => {
    const estadoConfig = EstadosConfig.find((config) => config.nombre === estado);
    if (estadoConfig) {
      const aliasQueryParams = estadoConfig.alias.map(alias => `status=${alias}`).join('&');
      navigate(`/pedidos?${aliasQueryParams}`);
    }
  };

  return (
    <>
      <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={1}>
          {estadosOrdenados.map(({ nombre, colorFondo }) => (
            <Grid item xs={2} sm={2} md={4} key={nombre}>
              <Box
                sx={{
                  padding: 1,
                  textAlign: "center",
                  backgroundColor: colorFondo,
                  borderRadius: 1,
                }}
                onClick={nombre === "OTROS" ? handleOpenModal : () => handleBoxClick(nombre)}
                style={{ cursor: "pointer"}}>
                <Typography variant="subtitle2">{nombre}</Typography>
                <Typography variant="h6">{contadorEstados[nombre] || 0}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <EstadosOtrosModal
        open={openModal}
        onClose={handleCloseModal}
        estados={estadosOtros}
      />
    </>
  );
};

export default EstadoPedidos;
