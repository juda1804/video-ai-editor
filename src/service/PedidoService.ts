// src/services/pedidoService.ts
import axios from "axios";
import { Pedido } from "../types";

const BASE_URL = "http://localhost:8080";

const getHeaders = () => {
  const userContext = localStorage.getItem('userContext');
  return {
    headers: {
      'Content-Type': 'application/json',
      'context': userContext || ''
    }
  };
};

export const getPedidos = async (url: string): Promise<Pedido[]> => {
  try {
    const response = await axios.get<Pedido[]>(`${BASE_URL}/${url}`, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    throw new Error("No se pudieron obtener los pedidos. Por favor, inténtalo de nuevo más tarde.");
  }
};

export const getPedido = async (guia: string): Promise<Pedido> => {
  try {
    const response = await axios.get<Pedido>(`${BASE_URL}/order/${guia}`, getHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    throw new Error("No se pudo obtener el pedido. Por favor, inténtalo de nuevo más tarde.");
  }
};

/**
export const updatePedido = async (pedido: Pedido): Promise<Pedido> => {
  try {
    const response = await axios.post<Pedido>(
      `${BASE_URL}/order/${pedido.id}`,
      pedido,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    throw new Error("No se pudo actualizar el pedido. Por favor, inténtalo de nuevo más tarde.");
  }
};
*/

export const updatePedido = async (
  guia: string,
  pedido: Pedido,
  setSelectedPedido: (pedido: Pedido) => void,
  onClose: () => void
) => {
  const updatedPedido = {
    observacion: pedido.observacion.at(-1),
    statusManual: pedido.statusManual
  };

  axios
    .post(`${BASE_URL}/order/${guia}`, updatedPedido, getHeaders())
    .then((response) => {
      console.log("Pedido actualizado:", response.data);
      setSelectedPedido(response.data);
      onClose();
    })
    .catch((error) => {
      console.error("Error al actualizar el pedido:", error);
    });
};
