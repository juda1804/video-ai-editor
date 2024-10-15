import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  IconButton
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

interface Variable {
  name: string;
  value: string;
  type: string;
}

interface VariableModalProps {
  isOpen: boolean;
  variables: Variable[];
  onClose: () => void;
  onSave: (variables: Variable[]) => void;
  onVariableChange: (index: number, field: string, value: string) => void;
  onAddVariable: () => void;
  onRemoveVariable: (index: number) => void;
}

const VariableModal: React.FC<VariableModalProps> = ({
  isOpen,
  variables,
  onClose,
  onSave,
  onVariableChange,
  onAddVariable,
  onRemoveVariable
}) => {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      fullWidth 
      maxWidth="lg"
    >
      <DialogTitle>Variables</DialogTitle>
      <DialogContent>
        {variables.map((variable, index) => (
          <Grid
            container
            spacing={1}
            alignItems="center"
            key={index}
            style={{ marginBottom: '16px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          >
            <Grid item xs={5}>
              <TextField
                label="Nombre de la Variable"
                value={variable.name}
                onChange={(e) => onVariableChange(index, 'name', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              {variable.type === 'textarea' ? (
                <TextField
                  label="Valor de la Variable"
                  value={variable.value}
                  onChange={(e) => onVariableChange(index, 'value', e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                />
              ) : (
                <TextField
                  label="Valor de la Variable"
                  value={variable.value}
                  onChange={(e) => onVariableChange(index, 'value', e.target.value)}
                  fullWidth
                />
              )}
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => onRemoveVariable(index)}>
                <RemoveCircle />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={onAddVariable}
          startIcon={<AddCircle />}
        >
          Agregar Variable
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
        <Button onClick={() => onSave(variables)} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VariableModal;
