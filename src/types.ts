// src/types.ts
export interface Pedido {
    id: number;
    orderId: string;
    guia: string;
    status: string;
    statusManual: string;
    repartidora: string;
    nombreCliente: string;
    celular: string;
    valorTotal: string;
    costoProductos: string;
    observacion: string[];
    fechaOrden: string;
    hora: string;
    costoFlete: string;
  }
  
  export interface EstadoConfig {
    nombre: string;
    alias: string[];       // Nuevos alias para agrupar estados
    colorFondo: string;
    posicion: number;
    font?: string;
  }