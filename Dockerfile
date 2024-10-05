# Imagen base de Node.js para ejecutar la aplicación
FROM node:18.17.1 AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el código de la aplicación al contenedor
COPY . .

# Generar el compilado del proyecto React
RUN npm run build

# Fase 2: Servidor para el despliegue del compilado
FROM node:18.17.1

# Instalar un servidor HTTP simple, como 'serve'
RUN npm install -g serve

# Copiar el compilado generado en la fase anterior
COPY --from=build /orders-app/build /app/build

# Exponer el puerto 3000 (o el puerto que uses en producción)
EXPOSE 3000

# Comando para iniciar el servidor con el compilado
CMD ["serve", "-s", "/app/build", "-l", "3000"]
