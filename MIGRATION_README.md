# Migración de Firebase a JWT - Instrucciones

## Cambios Realizados

Se ha migrado completamente el sistema de autenticación de Firebase a JSON Web Tokens (JWT). 

### Principales cambios:

1. **Backend:**
   - Eliminado `firebase-admin` 
   - Agregado `jsonwebtoken` y `bcryptjs`
   - Nuevo middleware `verifyJWTToken.js`
   - Controlador de autenticación completamente reescrito
   - Modelo User actualizado para usar contraseñas hash
   - Todos los controladores actualizados para usar `_id` en lugar de `firebaseUid`

2. **Frontend:**
   - Eliminado `firebase`
   - Nuevo sistema de autenticación en `auth.js`
   - UserContext completamente reescrito
   - Páginas de Login y Register actualizadas
   - ApiClient actualizado para usar JWT

3. **Archivos eliminados:**
   - `back/firebase.js`
   - `back/middleware/verifyFirebaseToken.js`
   - `front/src/firebase.js`

## Variables de Entorno Requeridas

Agregar al archivo `.env` del backend:

```
JWT_SECRET=tu-clave-secreta-muy-segura-aqui-cambiala-en-produccion
JWT_EXPIRES_IN=7d
```

## Migración de Datos Existentes

**IMPORTANTE:** Los usuarios existentes con `firebaseUid` necesitan ser migrados. 

### Pasos para migrar:

1. **Crear script de migración** (ejecutar en MongoDB):

```javascript
// Migración de usuarios - ejecutar en MongoDB Compass o shell
db.users.find({firebaseUid: {$exists: true}}).forEach(function(user) {
    // Los usuarios existentes necesitarán registrarse nuevamente
    // ya que no tenemos sus contraseñas originales
    print("Usuario encontrado: " + user.email);
});

// Opcional: Eliminar campos firebaseUid de usuarios existentes
// db.users.updateMany({}, {$unset: {firebaseUid: 1}});

// Migración de perfiles de egresados
db.perfilegresados.find({firebaseUid: {$exists: true}}).forEach(function(perfil) {
    var user = db.users.findOne({email: "email_del_usuario"}); // Necesitas mapear manualmente
    if (user) {
        db.perfilegresados.updateOne(
            {_id: perfil._id},
            {
                $set: {userId: user._id},
                $unset: {firebaseUid: 1}
            }
        );
    }
});
```

2. **Notificar a usuarios existentes** que necesitan registrarse nuevamente con su email y una nueva contraseña.

## Funcionalidades del Nuevo Sistema

### Login
- URL: `POST /auth/login`
- Body: `{email, contraseña}`
- Respuesta: `{user, token}`

### Registro
- URL: `POST /auth/register` 
- Body: `{nombre, email, contraseña}`
- Respuesta: `{user, token}`

### Obtener usuario actual
- URL: `GET /auth/current-user`
- Headers: `Authorization: Bearer <token>`
- Respuesta: `{user}`

## Testing

### Backend
```bash
cd back
npm start
```

### Frontend  
```bash
cd front
npm run dev
```

### Rutas para probar:

1. **Registro:** `http://localhost:5173/register`
2. **Login:** `http://localhost:5173/login`
3. **Dashboard:** `http://localhost:5173/welcome-egresado` (requiere login)

### Verificar autenticación:

1. Registrar un nuevo usuario
2. Verificar que se crea el token JWT
3. Acceder a rutas protegidas
4. Verificar logout
5. Intentar acceder sin token (debe fallar)

## Seguridad

- Las contraseñas se hashean con bcryptjs (12 rounds)
- Tokens JWT incluyen expiración 
- Middleware verifica tokens en cada petición protegida
- Logout limpia tokens del localStorage

## Problemas Comunes

1. **Token expired:** Usuario debe hacer login nuevamente
2. **Usuario no encontrado:** Verificar que existe en la BD
3. **CORS errors:** Verificar configuración en backend
4. **Rutas no protegidas:** Verificar que usan `verifyJWTToken` middleware

¡La migración está completa! 🎉