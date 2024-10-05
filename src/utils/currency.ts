const formatearDinero = (valor: number, moneda: string, localizacion: string = 'es-ES'): string => {
    return new Intl.NumberFormat(localizacion, {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 0, // Para asegurarse de que siempre muestre dos decimales
      maximumFractionDigits: 0,
    }).format(valor);
  };


  export const formatearCOP = (valor: number): String => {
    return formatearDinero(valor, 'COP');
  }

  export const formatearCOPStr = (valor: string): String => {
    return formatearDinero(Number(valor), 'COP');
  }