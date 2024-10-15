import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Chip,
  Paper,
  Box
} from '@mui/material';
import VariableModal from './VariableModal';
import { BasicAgentChatbotPrompt } from './PromptAgenteChatbot'; // Ensure the path is correct

function PromptGeneratorComponent() {
 

  const [variables, setVariables] = useState([
    { name: 'agent-name', value: 'Camila', type: 'text' },
    { name: 'expertise', value: 'Productos para bebés, enfocados en la salud y bienestar', type: 'textArea' },
    { name: 'product-name', value: 'Tapete Aqua Magia', type: 'text' },
    { name: 'product-application', value: '• Ayuda a prevenir la cabeza plana en los bebés al fomentar el tiempo boca abajo.\n• Promueve el desarrollo físico, fortaleciendo el cuello y la espalda.\n• Ofrece una experiencia de juego sensorial con colores brillantes y formas flotantes.', type: 'textarea' },
    { name: 'product-technical-data', value: '• Dimensiones: 66 cm de largo x 50 cm de ancho x 8 cm de alto.\n• Material: PVC de alta calidad, libre de BPA (seguro para bebés).\n• Edad recomendada: Bebés a partir de 3 meses.\n• Peso: 280 gramos (aproximadamente).\n• Colores: Estampados coloridos y diseños de animales marinos.\n• Juguetes flotantes: Incluye varias formas flotantes dentro del tapete para estimular el juego sensorial.\n• Facilidad de uso:\n   - El borde exterior se infla con aire.\n   - El centro se llena con agua.\n• Limpieza: Fácil de limpiar; vacía el agua y límpialo con un paño húmedo.\n• Beneficios para el desarrollo:\n   - Estimula el tiempo boca abajo, fortaleciendo cuello, espalda y brazos.\n   - Proporciona estimulación visual y sensorial con los colores y formas.\n• Seguridad: Material resistente, diseñado para evitar fugas de aire o agua.', type: 'textarea' },
    { name: 'product-dimensions', value: 'Dimensiones: 66 cm de largo x 50 cm de ancho x 8 cm de alto.', type: 'text' },
    { name: 'product-content', value: '1. Tapete inflable: Un tapete de PVC de alta calidad con un borde que se infla con aire y un centro que se llena con agua para proporcionar una superficie de juego sensorial.\n2. Formas flotantes: Varios juguetes flotantes de colores brillantes (normalmente en forma de peces o animales marinos) que se mueven dentro del tapete, diseñados para captar la atención del bebé y estimular el desarrollo visual y sensorial.\n3. Manual de instrucciones: Guía sencilla para inflar el borde exterior con aire y llenar el centro con agua, además de instrucciones para la limpieza y el cuidado del producto.', type: 'textarea' },
    { name: 'product-warranty', value: '10 días por defectos de fábrica', type: 'textArea' },
    { name: 'summary-purchase', value: 'Nombre 😊\nApellido 😊\nTeléfono 📞\nDepartamento 🌄\nCiudad 🏙\nDirección 🏡\nColor', type: 'textarea' },
    { name: 'offerts', value: '1 Tapete Aqua Magia, con envío *GRATIS!* *Ahora $59.900* 🚚 Pagas Al Recibir.\n2 Tapete Aqua Magia, con envío *GRATIS!* *Ahora $95.000* 🚚 Pagas Al Recibir.', type: 'textarea' },
    { name: 'payment-methods', value: 'PAGO CONTRA ENTREGA', type: 'text'  },
  ]);

  const [template, setTemplate] = useState(BasicAgentChatbotPrompt);

  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tempVariables, setTempVariables] = useState([...variables]);

  const handleOpenModal = () => {
    setTempVariables([...variables]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleVariableChange = (index: number, field: string, value: string) => {
    const variablesUpdated = tempVariables.map((variable, i) => i === index ? {...variable, [field]: value} : variable);
    setTempVariables(variablesUpdated);
  };

  const addVariable = () => {
    setTempVariables([...tempVariables, { name: '', value: '', type: 'text' }]);
  };

  const removeVariable = (index: number) => {
    const newVariables = tempVariables.filter((_, i) => i !== index);
    setTempVariables(newVariables);
  };

  const saveVariables = () => {
    setVariables(tempVariables);
    setIsModalOpen(false);
  };

  const generatePrompt = () => {
    let prompt = template;
    variables.forEach(({ name, value }) => {
      const regex = new RegExp(`{${name}}`, 'g');
      prompt = prompt.replace(regex, value);
    });
    setGeneratedPrompt(prompt);
  };

  return (
    <Box padding={2}>
      <Typography variant="h4" gutterBottom>
        Generador de Prompt
      </Typography>

      <Box display="flex" alignItems="center" marginBottom="16px">
        <Box flexGrow={1}>
          {variables.length > 0 ? variables.map((variable, index) => (
            <Chip
              key={index}
              label={variable.name}
              style={{ marginRight: '8px', marginBottom: '8px', backgroundColor: 'black' }}
            />
          )) : (
            <Typography variant="body1" color="textSecondary">
              No hay variables
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
        >
          Editar Variables
        </Button>
      </Box>

      <VariableModal
        isOpen={isModalOpen}
        variables={tempVariables}
        onClose={handleCloseModal}
        onSave={(variables) => {
          setVariables(variables);
          setIsModalOpen(false);
        }}
        onVariableChange={handleVariableChange}
        onAddVariable={addVariable}
        onRemoveVariable={removeVariable}
      />

      <Paper sx={{ padding: '1rem', borderRadius: '1rem', marginBottom: '1rem'}}>
        <Typography variant="h6" sx={{ marginBottom: '1rem'}}>Chat Agent Prompt Template</Typography>
        <TextField
          label="Template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          multiline
          rows={20}
          variant="outlined"
          fullWidth
        />
      </Paper>

      <Button
        variant="contained"
        color="secondary"
        onClick={generatePrompt}
      >
        Generar Prompt
      </Button>

      <Paper sx={{ padding: '1rem', borderRadius: '1rem', marginBottom: '1rem', marginTop: '1rem'}}>
        <Typography variant="h6">Prompt Generado</Typography>
        <TextField
          value={generatedPrompt}
          multiline
          rows={20}
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </Paper>
    </Box>
  );
}

export default PromptGeneratorComponent;
