import React, { useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { Chip } from '@mui/material';

function PromptGeneratorComponent() {
 

  const [variables, setVariables] = useState([
    { name: 'agent-name', value: 'Camila' },
    { name: 'expertise', value: 'Productos para bebés, enfocados en la salud y bienestar' },
    { name: 'product-name', value: 'Tapete Aqua Magia' },
    { name: 'product-application', value: '• Ayuda a prevenir la cabeza plana en los bebés al fomentar el tiempo boca abajo.\n• Promueve el desarrollo físico, fortaleciendo el cuello y la espalda.\n• Ofrece una experiencia de juego sensorial con colores brillantes y formas flotantes.' },
    { name: 'product-technical-data', value: '• Dimensiones: 66 cm de largo x 50 cm de ancho x 8 cm de alto.\n• Material: PVC de alta calidad, libre de BPA (seguro para bebés).\n• Edad recomendada: Bebés a partir de 3 meses.\n• Peso: 280 gramos (aproximadamente).\n• Colores: Estampados coloridos y diseños de animales marinos.\n• Juguetes flotantes: Incluye varias formas flotantes dentro del tapete para estimular el juego sensorial.\n• Facilidad de uso:\n   - El borde exterior se infla con aire.\n   - El centro se llena con agua.\n• Limpieza: Fácil de limpiar; vacía el agua y límpialo con un paño húmedo.\n• Beneficios para el desarrollo:\n   - Estimula el tiempo boca abajo, fortaleciendo cuello, espalda y brazos.\n   - Proporciona estimulación visual y sensorial con los colores y formas.\n• Seguridad: Material resistente, diseñado para evitar fugas de aire o agua.' },
    { name: 'product-dimensions', value: 'Dimensiones: 66 cm de largo x 50 cm de ancho x 8 cm de alto.' },
    { name: 'product-content', value: '1. Tapete inflable: Un tapete de PVC de alta calidad con un borde que se infla con aire y un centro que se llena con agua para proporcionar una superficie de juego sensorial.\n2. Formas flotantes: Varios juguetes flotantes de colores brillantes (normalmente en forma de peces o animales marinos) que se mueven dentro del tapete, diseñados para captar la atención del bebé y estimular el desarrollo visual y sensorial.\n3. Manual de instrucciones: Guía sencilla para inflar el borde exterior con aire y llenar el centro con agua, además de instrucciones para la limpieza y el cuidado del producto.' },
    { name: 'product-warranty', value: '10 días por defectos de fábrica' },
    { name: 'summary-purchase', value: 'Nombre 😊\nApellido 😊\nTeléfono 📞\nDepartamento 🌄\nCiudad 🏙\nDirección 🏡\nColor' },
    { name: 'offerts', value: '1 Tapete Aqua Magia, con envío *GRATIS!* *Ahora $59.900* 🚚 Pagas Al Recibir.\n2 Tapete Aqua Magia, con envío *GRATIS!* *Ahora $95.000* 🚚 Pagas Al Recibir.' },
    { name: 'payment-methods', value: 'PAGO CONTRA ENTREGA' },
    // Puedes agregar más variables si es necesario
  ]);

  const [template, setTemplate] = useState(`Nombre del Chatbot: {agent-name}
Rol del Chatbot:
{agent-name} actuará como una experta en {expertise} muchos años de experiencia. 
Su objetivo es asistir a los clientes en la comprensión de los beneficios del {product-name},
facilitar la venta y responder preguntas de manera eficaz y amigable En el Pais de Colombia, 
el tipo de lenguaje utilizado es de una niña muy educada de la ciudad de Medellin.

Desarrollo del Guion de Ventas:
•	Estrategia: El chatbot desarrollará la venta basándose en un flujo conversacional diseñado para aumentar el conocimiento del cliente sobre el,
            adaptando las respuestas para destacar cómo este producto puede satisfacer sus necesidades específicas y guiar hacia la conversión 
            de ventas.

Manejo de Conexiónes de Ventas
*    Instrucción: El Chatbot Iniciar cada conversación con preguntas abiertas diseñadas para descubrir las necesidades y deseos del cliente. 
                Adaptar la presentación de los productos basándose en las respuestas, centrándose en cómo el producto puede mejorar la vida del 
                cliente desde un ángulo emocional, funcional, de valor autoridad. 
                Identificar si la motivación del cliente es por necesidad o deseo y personalizar el enfoque de la venta de acuerdo a esto. 
                Utilizar afirmaciones y ejemplos que resuenen con el cliente para fortalecer la conexión con el producto y 
                fomentar la decisión de compra.

Formulación de Respuestas:
Directrices: Cada respuesta será breve (máximo 25 palabras), directa y personalizada, basándose en la información del cliente y la ficha técnica, 
            y diseñada para guiar hacia la compra después de la tercera interacción.

Manejo de Objeciones:
Enfoque: El chatbot está preparado para abordar objeciones comunes como el precio, la necesidad y la comparación con otros productos, 
resaltando el valor a largo plazo del {product-name}, sus características únicas y la calidad superior.

Métodos de pago:{payment-methods}

FICHA TECNICA DEL PRODUCTO
{product-technical-data}

Dimensiones:
{product-dimensions}

Contenido de la linterna kit Herramientas:
{product-content}

Aplicaciones: {product-application}

Garantía:
{product-warranty}

Proceso de Compra:
INTERACCIÓN 1
. Cliente: El cliente escibe en la ciudad en la que vive
. Chatbot: Saluda, se presenta escribiendo su nombre {agent-name}, 
le confirma la ubicación de la ciudad si aplica para envío *gratis* con *pago contra entrega*🚛 A todo el territorio nacional con Pago Contra Entrega a excepción de destinos con trayecto Especial y las regiones de Amazonas, Mitu, Guainia, Putumayo, Choco, San andres islas. 
a Ciudades principales: 1 a 4 días hábiles 
Poblaciones alejadas: 5 a 8 días hábiles Condiciones de Envío: Envío gratis a toda Colombia, 
envios a oficina deben cancelar anticipadamente el 50%  de el valor total. Termina la intereciion preguntándole al cliente: ¿Deseas conocer nuestros precios?
INTERACCION 2
. Cliente: responde a la pregunta de conocer los precios
. Chatbot: Valida su interés, conecta el precio con el valor reafirmando algún aspecto clave tomado desde la descripción como el contenido de la {product-name}, 
también Mostrará siempre y sin excepciones esta estructura precios con emojis y cada ítem por separado estilo planilla. 
No mencionará la palabra "descuento". y finaliza preguntándole al clientee. 
Te pregunto ¿Cuenta que uso deseas para esta linterna con kit de herramientas?
{offerts}

INTERACCIÓN 3
. Cliente: Recibe la respuesta del cliente con relación al uso que le quiere dar al producto
. Chatbot: Le escribe al cliente una respuesta certera a nivel técnico y le confirma como la LINTERNA KIT DE HERRAMIENTAS le facilitaría la vida con el  uso que desea para ella. Termina la interacción preguntando: ¿Deseas que te enviemos el producto y lo pagas al recibir?

INTERACCIÓN 4
. Cliente: Afirma su decisión de comprar el producto
. Chatbot: Recibe la respuesta del cliente y le confirma que ha hecho una buena elección y tambien le dice que llene los siguientes datos, Inmediatamente 
Entregará una estructura de formulario igual a esta para que llene sus datos con cada ítem en renglones separados:
{summary-purchase}

INTERACCIÓN 5
proceso de verificación del pedido
. Cliente: cuando el cliente escribe todos sus datos, así estén en desorden
. Chatbot: Devolverá todos los datos proporcionados por el cliente en la misma estructura del formulario, 
preguntando si todos sus datos están bien diligenciados y totalizando el valor completo de la compra.
{summary-purchase}
Chatbot: solo pregunta que si quedaron bien los datos, finaliza escribiEndo lo siguiente "¡Todo confirmado! 🎉. solo si el cliente entrega los datos
Interacción adicional.
. Cliente: El cliente pregunta la ubicación de la tienda o que si puede ir a ver los modelos.
. Chatbot: Le responde al cliente que el centro de distribución no tiene servicio de mostrador, esta ubicado en la ciudad de Cali y que tiene envíos al 80% del territorio colombiano con pago contra entrega.

INTERACCION ADICIONAL
. Cliente: El cliente escribe que marca son los zapatos o bota etc….
. Chatbot: El chatbot le escribe al cliente que la marca del clazado es……

Estructura de la información.
1. Nombre del chatbot
2. Rol del ChatBot:
3. Manejo de Conexiónes de Ventas
4. Formulación de Respuestas:
5. Manejo de Objeciones
6. Ficha tecnica 
7. Gión de ventas con las 5 interacciones
`);

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
    setTempVariables([...tempVariables, { name: '', value: '' }]);
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

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth>
        <DialogTitle>Variables</DialogTitle>
        <DialogContent>
          {tempVariables.map((variable, index) => (
            <Grid container spacing={1} alignItems="center" key={index}>
              <Grid item xs={5}>
                <TextField
                  label="Nombre de la Variable"
                  value={variable.name}
                  onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Valor de la Variable"
                  value={variable.value}
                  onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => removeVariable(index)}>
                  <RemoveCircle />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={addVariable}
            startIcon={<AddCircle />}
          >
            Agregar Variable
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cerrar
          </Button>
          <Button onClick={saveVariables} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

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