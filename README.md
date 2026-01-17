# ⚡ Quick-NeoCRUD

Aplicación CRUD rápida y moderna que utiliza **NeonSQL** (PostgreSQL serverless) como base de datos. Este proyecto demuestra una arquitectura profesional con validaciones robustas, manejo de errores centralizado, animaciones fluidas y una interfaz de usuario moderna y responsiva.

![Quick-NeoCRUD Screenshot](./public/screenshot.png)

## 🚀 Características

- ✅ **CRUD Completo**: Crear, Leer, Actualizar y Eliminar cuentas
- ✅ **NeonSQL (PostgreSQL)**: Base de datos moderna y escalable
- ✅ **Arquitectura Modular**: Separación clara de responsabilidades
- ✅ **Validaciones Robustas**: En cliente y servidor
- ✅ **Manejo de Errores**: Sistema centralizado y consistente
- ✅ **UI/UX Moderna**: Interfaz responsiva y atractiva
- ✅ **Notificaciones en Tiempo Real**: Toast notifications
- ✅ **API RESTful**: Endpoints bien documentados
- ✅ **Compatible con Vercel**: Deploy en serverless

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm o yarn
- Cuenta en [NeonSQL](https://neon.tech)
- Cadena de conexión PostgreSQL

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/SaDaGoPia/Quick-NeoCRUD.git
cd quick-neocrud
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:contraseña@host/database?sslmode=require&channel_binding=require
PORT=3000
NODE_ENV=development
```

**Obtener tu DATABASE_URL:**
1. Accede a [NeonSQL Dashboard](https://console.neon.tech)
2. Selecciona tu proyecto
3. Copia la cadena de conexión en "Connection string"

### 4. Inicializar la base de datos
```bash
npm run init-db
```

Este comando:
- ✅ Verifica la conexión a NeonSQL
- ✅ Crea la tabla `accounts` si no existe
- ✅ Crea índices para optimizar queries

### 5. Ejecutar la aplicación
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
Deploy_Vercel_CockroachDB/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de conexión a BD
│   ├── controllers/
│   │   └── accountController.js # Lógica CRUD de cuentas
│   ├── middleware/
│   │   └── errorHandler.js      # Manejo centralizado de errores
│   ├── routes/
│   │   └── accounts.js          # Definición de rutas
│   └── utils/
│       ├── errors.js            # Clases de errores personalizados
│       └── validators.js        # Funciones de validación
├── public/
│   ├── index.html               # Interfaz HTML
│   ├── script.js                # Lógica frontend
│   └── style.css                # Estilos CSS modernos
├── db.js                        # Script de inicialización de BD
├── server.js                    # Servidor Express principal
├── package.json                 # Dependencias del proyecto
└── .env                         # Variables de entorno
```

## 🔌 API Endpoints

### Información de Conexión
```
GET /api/db-info
```
Retorna información de la conexión actual a la base de datos.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "dbname": "neondb",
    "user": "neondb_owner",
    "version": "PostgreSQL 17.7"
  }
}
```

### Crear Cuenta
```
POST /api/crear
```
Crea una nueva cuenta. El ID se genera automáticamente si no se proporciona.

**Body:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",  // Opcional
  "balance": 1000
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cuenta creada exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "balance": 1000,
    "created_at": "2024-01-14T10:30:00Z",
    "updated_at": "2024-01-14T10:30:00Z"
  }
}
```

### Obtener Todas las Cuentas
```
GET /api/leer
```

**Respuesta:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### Obtener Cuenta por ID
```
GET /api/leer/:id
```

### Actualizar Cuenta
```
PUT /api/actualizar
```

**Body:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "balance": 2000
}
```

### Eliminar Cuenta
```
DELETE /api/eliminar
```

**Body:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

## 🛡️ Validaciones

### Servidor
- ✅ UUID válido para el ID
- ✅ Balance como número entero válido (INT8)
- ✅ Validación de campos requeridos
- ✅ Manejo de duplicados
- ✅ Validación de existencia de registros

### Cliente
- ✅ Validación de entrada antes de enviar
- ✅ Confirmación para operaciones críticas
- ✅ Mensajes de error descriptivos
- ✅ Toast notifications

## 📊 Tabla de Base de Datos

```sql
CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    balance INT8 NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_created_at ON accounts(created_at);
```

## 🚢 Deploy en Vercel

### 1. Preparar el repositorio
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Configurar en Vercel
- Conectar tu repositorio GitHub/GitLab
- Agregar variables de entorno en el dashboard
- Deploy automático

### 3. Configuración de Vercel
El archivo `vercel.json` ya está configurado adecuadamente.

## 🔄 Migración desde CockroachDB

Si migras desde CockroachDB:

1. **Cadena de conexión**: Reemplaza la URL en `.env` con tu URL de NeonSQL
2. **Compatibilidad**: El driver `pg` funciona con ambas bases de datos
3. **Esquema**: La tabla es idéntica, solo necesitas reinicializar:
   ```bash
   npm run init-db
   ```

## 📝 Cambios en v2.0.0

- ✨ Arquitectura modular y profesional
- 🎨 UI completamente rediseñada
- 🔒 Validaciones mejoradas
- 🐛 Manejo de errores centralizado
- 📱 Responsivo en todos los dispositivos
- 🚀 Mejor rendimiento con índices de BD
- 📋 API más consistente con respuestas estandarizadas

## 🧪 Pruebas

### Crear una cuenta
```bash
curl -X POST http://localhost:3000/api/crear \
  -H "Content-Type: application/json" \
  -d "{\"balance\": 1000}"
```

### Obtener todas las cuentas
```bash
curl http://localhost:3000/api/leer
```

### Actualizar una cuenta
```bash
curl -X PUT http://localhost:3000/api/actualizar \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"UUID_AQUI\", \"balance\": 2000}"
```

## 📚 Documentación Adicional

- [NeonSQL Docs](https://neon.tech/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Express.js Docs](https://expressjs.com)
- [node-postgres Docs](https://node-postgres.com)

## 📝 Licencia

ISC

## 👨‍💻 Autor

Refactorizado y modernizado en 2025

---

**Nota**: Para cualquier pregunta o reporte de bugs, abre un issue en el repositorio.
