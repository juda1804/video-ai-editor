import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
    TextField,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import { Pedido } from "../../types";
import StatusChip from "../estados-pedido/StatusChip";
import { updatePedido } from "../../service/PedidoService";
import "./PedidoDialog.css";

interface PedidoDialogProps {
  open: boolean;
  onClose: () => void;
  pedido: Pedido;
  setSelectedPedido: (pedido: Pedido) => void;
}

const PedidoDialog: React.FC<PedidoDialogProps> = ({
  open,
  onClose,
  pedido,
  setSelectedPedido,
}) => {
  const [newObservation, setNewObservation] = useState("");
  const [alertOpen, setAlertOpen] = useState(!pedido?.guia);
  const [status, setStatus] = useState(pedido?.statusManual || "");

  const handleSave = () => {
    if (!pedido) return;
    const handleUpdatePedido = (updatedPedido: Pedido) => {
      setSelectedPedido(updatedPedido as Pedido);
    }

    const newPedido = {
      ...pedido,
      observacion: [...pedido.observacion, newObservation],
      statusManual: status, // Usamos el nuevo estado seleccionado
    }

    updatePedido(pedido.guia, newPedido, handleUpdatePedido, onClose);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles del Pedido</DialogTitle>
        <DialogContent>
          {pedido && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Guia:
                  </Typography>
                  <Typography variant="body1">{pedido.guia}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status:
                  </Typography>
                  <Box>
                    <StatusChip status={pedido.status} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status Gestion:
                  </Typography>
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    fullWidth
                    size="small"
                    className="status-select"
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="ENTREGADO">Entregado</MenuItem>
                    <MenuItem value="EN PROCESAMIENTO">En Procesamiento</MenuItem>
                    <MenuItem value="DEVOLUCION">Devolucion</MenuItem>                    
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}/>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Cliente:
                  </Typography>
                  <Typography variant="body1">
                    {pedido.nombreCliente}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Repartidora:
                  </Typography>
                  <Typography variant="body1">{pedido.repartidora}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Celular:
                  </Typography>
                  <Typography variant="body1">{pedido.celular}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Observaciones:
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: 150, // Fixed height to allow scrolling
                      overflowY: "auto",
                      backgroundColor: "#f5f5f5",
                      padding: 1,
                      borderRadius: 1,
                    }}>
                    {pedido.observacion.map((obs, index) => (
                      <Typography variant="body2" key={index}>
                        {obs}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
                {/* New Observation Field */}
                <Grid item xs={12}>
                  <TextField
                    label="Nueva Observación"
                    value={newObservation}
                    onChange={(e) => setNewObservation(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={!pedido?.guia}>
            Actualizar
          </Button>
          <Button onClick={onClose} color="error" variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar Alert */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}>
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}>
          No se puede actualizar porque el pedido no tiene guía.
        </Alert>
      </Snackbar>
    </>
  );
};

export default PedidoDialog;
