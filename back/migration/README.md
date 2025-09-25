# 🔄 Migración de Usuarios: Firebase → JWT

Este directorio contiene scripts para migrar usuarios existentes de Firebase UID a autenticación JWT con contraseñas cifradas.

## 📋 Requisitos Previos

1. **Backup completo** de tu base de datos MongoDB
2. Asegúrate de que el archivo `.env` tenga `MONGO_URL` configurado
3. Instala las dependencias: `npm install bcryptjs mongoose`

## 🚀 Proceso de Migración

### Paso 1: Revisar Estado Actual
```bash
node migration/reviewMigration.js
```
Este comando te mostrará:
- Usuarios actuales con `firebaseUid`
- Usuarios que ya tienen `password`
- Backups disponibles
- Recomendaciones

### Paso 2: Ejecutar Migración (SEGURO)
```bash
node migration/migrateUsers.js migrate
```
Esto:
- ✅ Crea una colección temporal `users_migrated`
- ✅ Copia todos los datos de usuarios
- ✅ Elimina el campo `firebaseUid`
- ✅ Agrega password cifrada temporal: `TempPass123!`
- ✅ Marca usuarios como `needsPasswordReset: true`
- ⚠️  NO modifica la colección original

### Paso 3: Revisar Usuarios Migrados
```bash
node migration/reviewMigration.js
```
Revisa los usuarios en `users_migrated` usando MongoDB Compass para asegurar que todo esté correcto.

### Paso 4: Aplicar Migración (IRREVERSIBLE*)
```bash
node migration/migrateUsers.js replace
```
Esto:
- 💾 Crea backup automático de `users` → `users_backup_[timestamp]`
- 🔄 Reemplaza `users` con `users_migrated`
- ⚠️  **PUNTO DE NO RETORNO** (a menos que uses rollback)

### Paso 5 (Opcional): Rollback si algo sale mal
```bash
node migration/migrateUsers.js rollback
```
Restaura el backup más reciente.

## 🔐 Contraseñas Temporales

**Contraseña temporal para todos los usuarios:** `TempPass123!`

### ⚠️ IMPORTANTE para los usuarios:
1. Todos los usuarios migrados deberán usar la contraseña temporal
2. Se recomienda implementar un sistema de "primera vez" que obligue a cambiar password
3. El campo `needsPasswordReset: true` identifica usuarios que necesitan cambiar su password

## 📊 Ejemplo de Usuario Migrado

**ANTES (Firebase):**
```json
{
  "_id": "64f7a8b9c1234567890abcde",
  "firebaseUid": "abc123def456ghi789",
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

**DESPUÉS (JWT):**
```json
{
  "_id": "64f7a8b9c1234567890abcde",
  "name": "Juan Pérez", 
  "email": "juan@example.com",
  "password": "$2a$12$hashed_temp_password...",
  "needsPasswordReset": true,
  "migratedAt": "2025-09-23T22:30:00.000Z"
}
```

## 🛡️ Medidas de Seguridad

1. **Backup automático**: Se crea antes de reemplazar colección
2. **Colección temporal**: Migración se hace en colección separada primero
3. **Rollback disponible**: Puedes restaurar el backup
4. **Validaciones**: Script verifica email y name antes de migrar

## 📝 Tareas Post-Migración

1. **Frontend**: Notificar a usuarios sobre contraseña temporal
2. **Backend**: Implementar endpoint para cambio de password
3. **Validación**: Probar login con usuarios migrados
4. **Limpieza**: Eliminar colecciones de backup después de confirmar que todo funciona

## 🚨 En Caso de Emergencia

Si algo sale muy mal:
```bash
# Restaurar backup más reciente
node migration/migrateUsers.js rollback

# O restaurar backup específico usando MongoDB Compass:
# 1. Renombra 'users' a 'users_broken' 
# 2. Renombra 'users_backup_[timestamp]' a 'users'
```

## 📞 Contacto/Soporte

Revisa los logs de cada comando para detectar errores. Los scripts son verbosos y te dirán exactamente qué está pasando en cada paso.