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

export interface Video {
  url: string;
  analysis?: any;
}

  export interface Product {
    _id?: string;
    id?: string;
    username: string;
    name: string;
    price: string;
    description: string;
    landings: string[];
    videoUrls: string[];
    tikTokLinks: string[];
    angles: string[];
    vomitoDeMercadoUrl: string;
    videos: Video[];
  }

  export function isValidProduct(product: Product): boolean {
    return product.username !== '';
  }

  export function isValidProductInformation(product: Product): boolean {
    return product.name !== '' && product.description !== '' && product.angles.length >= 0;
  }
