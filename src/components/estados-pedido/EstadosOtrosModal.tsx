// src/components/EstadosOtrosModal.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from '@mui/material';

interface EstadosOtrosModalProps {
  open: boolean;
  onClose: () => void;
  estados: string[];
}

const EstadosOtrosModal: React.FC<EstadosOtrosModalProps> = ({ open, onClose, estados }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Estados en "Otros"</DialogTitle>
      <DialogContent>
        <List>
          {estados.map((estado, index) => (
            <ListItem key={index}>
              <ListItemText primary={estado} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EstadosOtrosModal;
