import { EstadosConfig } from "../components/estados-pedido/EstadosConfig";

export const getStatusBgColor = (status: string): string => {
    const estadoConfig = EstadosConfig.find((config) => config.nombre === status || config.alias.includes(status));
    return estadoConfig ? estadoConfig.colorFondo : '#9E9E9E'; // Default color if not found
};

export const getStatusFontColor = (status: string): string => {
    const estadoConfig = EstadosConfig.find((config) => config.nombre === status || config.alias.includes(status));
    return estadoConfig ? estadoConfig.font || "#ffffff" : '#ffffff'; // Default color if not found
};