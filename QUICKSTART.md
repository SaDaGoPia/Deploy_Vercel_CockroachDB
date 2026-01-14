# 🎯 Quick Start Guide - CRUD NeonSQL

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalar y configurar
```bash
npm install
npm run init-db
npm start
```

### 2. Abrir en el navegador
```
http://localhost:3000
```

### 3. Probar la aplicación

#### ✅ Crear una cuenta
- Deja el ID vacío (se genera automático)
- Balance: `1000`
- Click en "Crear Cuenta"

#### ✅ Ver todas las cuentas
- Click en "Obtener Todas las Cuentas"

#### ✅ Actualizar
- Copia un ID de la lista
- Pégalo en "ID de la cuenta"
- Nuevo balance: `5000`
- Click en "Actualizar"

#### ✅ Eliminar
- Copia un ID de la lista
- Pégalo en "ID de la cuenta"
- Click en "Eliminar"

## 🔧 Pruebas con cURL

### Crear cuenta
```bash
curl -X POST http://localhost:3000/api/crear \
  -H "Content-Type: application/json" \
  -d "{\"balance\": 2500}"
```

### Leer todas
```bash
curl http://localhost:3000/api/leer
```

### Actualizar (reemplaza el UUID)
```bash
curl -X PUT http://localhost:3000/api/actualizar \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"TU-UUID-AQUI\", \"balance\": 9999}"
```

### Eliminar (reemplaza el UUID)
```bash
curl -X DELETE http://localhost:3000/api/eliminar \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"TU-UUID-AQUI\"}"
```

## 📊 Verificar en NeonSQL Dashboard

1. Ve a https://console.neon.tech
2. Selecciona tu proyecto
3. SQL Editor
4. Ejecuta:
```sql
SELECT * FROM accounts ORDER BY created_at DESC;
```

## 🐛 Troubleshooting

### Error de conexión
```bash
# Verifica que la BD esté accesible
npm run init-db
```

### Puerto ocupado
```bash
# Cambia el puerto en .env
PORT=3001
```

### Reinstalar dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deploy a Vercel

```bash
# 1. Instala Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configura las variables de entorno
# En Vercel Dashboard > Settings > Environment Variables
# Agrega: DATABASE_URL
```

## ✨ Características Implementadas

✅ CRUD completo funcional  
✅ Validaciones en cliente y servidor  
✅ Manejo de errores robusto  
✅ UI moderna y responsiva  
✅ Toast notifications  
✅ Auto-generación de UUIDs  
✅ Confirmaciones para operaciones críticas  
✅ API RESTful bien estructurada  
✅ Arquitectura modular  
✅ Compatible con Vercel  

## 📝 Estructura de Respuestas API

### Success
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

### Error
```json
{
  "error": "Tipo de error",
  "message": "Descripción del error",
  "status": 400
}
```

## 🔐 Seguridad

- ✅ Validación de UUIDs
- ✅ Sanitización de inputs
- ✅ Manejo seguro de errores
- ✅ Variables de entorno
- ✅ Prepared statements (prevención SQL injection)

---

**¿Dudas?** Revisa el [README.md](README.md) completo para más detalles.
