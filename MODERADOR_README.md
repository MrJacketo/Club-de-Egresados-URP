# Rol de Moderador - Sistema de Ofertas Laborales

## Descripción

Se ha implementado un **rol de moderador** en el sistema para gestionar las ofertas laborales publicadas por los egresados y empresas. El moderador actúa como el contacto principal con las empresas y se encarga de:

- ✅ **Aprobar ofertas laborales** que sean relevantes e interesantes
- ❌ **Desaprobar ofertas** que no cumplan con los estándares
- 🔄 **Activar/Desactivar ofertas** según sea necesario
- 📊 **Ver estadísticas** de todas las ofertas en el sistema

## Características del Rol

### 1. **Dashboard del Moderador**
- Estadísticas en tiempo real de ofertas
- Gráficos de:
  - Total de ofertas, pendientes, aprobadas, inactivas
  - Ofertas por área laboral (Top 5)
  - Estado de ofertas (Pendientes/Aprobadas/Inactivas)
  - Aprobaciones mensuales
- Acceso rápido a la gestión de ofertas

### 2. **Gestión de Ofertas Laborales**
- **Pestañas de navegación**:
  - 📋 **Todas las Ofertas**: Vista completa del sistema
  - 🔔 **Solicitudes Pendientes**: Solo ofertas en estado "Pendiente" (con contador)
  - ✓ **Aprobadas**: Todas las ofertas aprobadas
  - 🚀 **Activas**: Ofertas activas y visibles para egresados
- Tabla completa con todas las ofertas del sistema
- Información mostrada:
  - Cargo y área
  - Empresa y modalidad
  - Creador (nombre y email del usuario que publicó)
  - Estado (Activo/Inactivo)
  - Estado de aprobación (Aprobado/Pendiente)
  - Fecha de publicación
- Filtros disponibles:
  - Búsqueda por cargo, empresa o creador
  - Filtro por estado (Activo/Inactivo)
  - Filtro por aprobación (Aprobadas/Pendientes/Todas)

### 3. **Acciones del Moderador**
- **Ver detalles**: Modal con información completa de la oferta
- **Aprobar**: Marca la oferta como aprobada y la hace visible para los egresados
- **Desaprobar**: Revierte la aprobación de una oferta
- **Activar/Desactivar**: Cambia el estado de la oferta (Activo ↔ Inactivo)

## Funcionamiento del Sistema

### Flujo de Aprobación de Ofertas (ACTUALIZADO)

1. **Creación**: Una empresa externa envía una oferta laboral al sistema
2. **Estado inicial**: La oferta se crea con:
   - `estado: "Pendiente"`
   - `aprobado: false`
3. **Notificación**: El moderador ve un contador en su sidebar con solicitudes pendientes
4. **Revisión**: El moderador accede a la pestaña "📋 Solicitudes Pendientes"
5. **Aprobación**: El moderador aprueba la oferta
   - Se registra: `aprobado: true`
   - Se cambia: `estado: "Activo"`
   - Se guarda: `moderadorAprobador` (ID del moderador)
   - Se registra: `fechaAprobacion`
6. **Visibilidad**: Solo las ofertas con `estado: "Activo"` Y `aprobado: true` aparecen para los egresados
7. **Desaprobación**: Si el moderador desaprueba:
   - Se cambia: `aprobado: false`
   - Se regresa: `estado: "Pendiente"`

### Estados de una Oferta

| Estado | Descripción | Visible para Egresados |
|--------|-------------|------------------------|
| **Pendiente** | Solicitud nueva esperando aprobación | ❌ No |
| **Activo** | Oferta aprobada y publicada | ✅ Sí (solo si `aprobado: true`) |
| **Inactivo** | Oferta desactivada temporalmente | ❌ No |

### Base de Datos

#### Modelo OfertaLaboral (Campos nuevos)
```javascript
{
  aprobado: Boolean (default: false),
  moderadorAprobador: ObjectId (ref: 'User'),
  fechaAprobacion: Date
}
```

## Acceso al Sistema

### Para crear un moderador:

**Opción 1: Usando el script**
```bash
cd back
node scripts/createModerador.js
```

**Opción 2: Manualmente desde MongoDB**
```javascript
{
  email: "moderador@urp.edu.pe",
  password: "contraseña_hasheada",
  name: "Nombre del Moderador",
  rol: "moderador",
  activo: true
}
```

### Credenciales por defecto (Script)
- **Email**: `moderador@urp.edu.pe`
- **Contraseña**: `moderador123`
- **Rol**: `moderador`

### Crear ofertas de ejemplo:

Para facilitar las pruebas, ejecuta el script que crea ofertas de ejemplo en estado "Pendiente":

```bash
cd back
node scripts/createOfertasEjemplo.js
```

Este script crea:
- 8 ofertas laborales de ejemplo en estado "Pendiente"
- Un usuario "Empresa Externa" (`empresa@externa.com`)
- Asocia todas las ofertas a este usuario externo
- Ofertas con diferentes áreas: Desarrollo Web, Data Science, Marketing, IT, etc.

## Rutas del Moderador

### Frontend
- `/moderador` - Dashboard principal
- `/moderador/ofertas` - Gestión de ofertas laborales

### Backend (API)
- `GET /api/moderador/ofertas` - Obtener todas las ofertas con info del creador
- `GET /api/moderador/estadisticas` - Estadísticas para el dashboard
- `PATCH /api/moderador/oferta/:id/aprobar` - Aprobar una oferta
- `PATCH /api/moderador/oferta/:id/desaprobar` - Desaprobar una oferta
- `PATCH /api/moderador/oferta/:id/estado` - Cambiar estado (Activo/Inactivo)

## Seguridad

- ✅ Todas las rutas del moderador están protegidas con `verifyJWTToken` y `verifyModeradorRole`
- ✅ Solo usuarios con `rol: 'moderador'` pueden acceder
- ✅ Los middlewares validan automáticamente el token JWT y el rol

## Componentes Creados

### Backend
- `back/controllers/ofertaModeradorController.js` - Lógica del moderador
- `back/routes/ofertaModeradorRoutes.js` - Rutas API del moderador
- `back/middleware/verifyModeradorRole.js` - Middleware de autorización
- `back/scripts/createModerador.js` - Script para crear moderador
- `back/scripts/createOfertasEjemplo.js` - Script para crear ofertas de ejemplo
- `back/enums/OfertaLaboral.enum.js` - Actualizado con estado "Pendiente"
- `back/models/OfertaLaboral.js` - Actualizado con campos de aprobación

### Frontend
- `front/src/pages/Moderador/ModeradorDashboard.jsx` - Dashboard
- `front/src/pages/Moderador/GestionOfertasModerador.jsx` - Gestión de ofertas
- `front/src/components/ModeradorSidebar.jsx` - Barra lateral de navegación
- `front/src/components/ModeradorRoute.jsx` - Protección de rutas
- `front/src/context/moderadorSidebarContext.jsx` - Context para sidebar

## Diferencias entre Roles

| Característica | Egresado | Moderador | Admin |
|----------------|----------|-----------|-------|
| Ver ofertas aprobadas | ✅ | ✅ | ✅ |
| Crear ofertas | ✅ | ❌ | ❌ |
| Aprobar ofertas | ❌ | ✅ | ✅ |
| Ver todas las ofertas | ❌ | ✅ | ✅ |
| Ver estadísticas de ofertas | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |
| Gestionar membresías | ❌ | ❌ | ✅ |
| Gestionar noticias | ❌ | ❌ | ✅ |

## Notas Importantes

1. **Las ofertas sin aprobar NO aparecen para los egresados** - Solo las ofertas con `aprobado: true` y `estado: 'Activo'` son visibles.

2. **El moderador puede desactivar ofertas aprobadas** - Útil para ofertas que ya no están vigentes.

3. **Se registra quién aprobó cada oferta** - Trazabilidad completa del proceso de aprobación.

4. **El rol ya está incluido en el modelo User** - El enum del campo `rol` en User.js ya incluye `'moderador'`.

## Próximos Pasos (Opcional)

- [ ] Sistema de notificaciones para el moderador cuando hay nuevas ofertas
- [ ] Comentarios del moderador en las ofertas
- [ ] Historial de aprobaciones/desaprobaciones
- [ ] Exportar reportes de ofertas
- [ ] Panel de métricas avanzadas

## Soporte

Para cualquier duda o problema con el rol de moderador:
1. Revisar los logs del servidor backend
2. Verificar que el usuario tenga `rol: 'moderador'` en MongoDB
3. Asegurarse de que el token JWT esté válido
4. Revisar la consola del navegador para errores en el frontend
