# 🚀 Guía Rápida - Sistema de Solicitudes de Ofertas Laborales

## ✨ ¿Qué se implementó?

Un sistema completo de **solicitudes de ofertas laborales** donde:
- 🏢 **Empresas externas** envían ofertas al sistema
- ⏳ Las ofertas inician en estado **"Pendiente"**
- 👨‍💼 El **moderador** revisa y aprueba/rechaza
- ✅ Solo ofertas **aprobadas y activas** se muestran a egresados

---

## 📋 Pasos para Probar el Sistema

### 1️⃣ **Crear el Moderador**
```bash
cd back
node scripts/createModerador.js
```
**Credenciales creadas:**
- Email: `moderador@urp.edu.pe`
- Contraseña: `moderador123`

---

### 2️⃣ **Crear Ofertas de Ejemplo (Pendientes)**
```bash
node scripts/createOfertasEjemplo.js
```
**Esto crea:**
- ✅ 8 ofertas laborales en estado "Pendiente"
- ✅ Usuario "Empresa Externa" (`empresa@externa.com`)
- ✅ Ofertas variadas: Tech, Marketing, Finanzas, etc.

---

### 3️⃣ **Iniciar el Sistema**

**Backend:**
```bash
cd back
npm install
npm start
```

**Frontend:**
```bash
cd front
npm install
npm run dev
```

---

### 4️⃣ **Flujo de Prueba**

#### **Como Moderador:**
1. 🔐 Ir a `http://localhost:5173/login`
2. 🔑 Iniciar sesión con: `moderador@urp.edu.pe` / `moderador123`
3. 📊 Verás el **Panel del Moderador**
4. 🔔 En el sidebar, verás un **badge rojo** con el número de solicitudes pendientes
5. 📋 Click en **"Ofertas Laborales"**
6. 🎯 Verás **4 pestañas**:
   - **Todas las Ofertas** (8 ofertas)
   - **📋 Solicitudes Pendientes** (8 ofertas) ⬅️ **AQUÍ ESTÁN LAS SOLICITUDES**
   - **✓ Aprobadas** (0 ofertas inicialmente)
   - **🚀 Activas** (0 ofertas inicialmente)

#### **Aprobar una Oferta:**
1. 📋 Click en la pestaña **"Solicitudes Pendientes"**
2. 👁️ Click en el icono de **"Ver detalles"** (ojo azul)
3. ✅ Click en **"Aprobar Oferta"** (botón verde)
4. 🎉 La oferta cambia a:
   - Estado: **"Activo"**
   - Aprobado: **true**
5. 🔄 Ahora aparece en las pestañas **"Aprobadas"** y **"Activas"**

#### **Como Egresado:**
1. 🔐 Crear cuenta o iniciar sesión como egresado
2. 🏠 Ir a **"Ofertas"** en el menú
3. 👀 Solo verás las ofertas que el moderador **APROBÓ**
4. ❌ Las ofertas pendientes NO se muestran

---

## 🎨 Características de la Interfaz

### **Dashboard del Moderador**
- 📊 **4 Cards** con métricas:
  - Total de ofertas
  - ⏳ Pendientes (amarillo)
  - ✅ Aprobadas (verde)
  - ❌ Inactivas (rojo)
- 📈 **Gráficos**:
  - Ofertas por área laboral
  - Estado de ofertas (Dona)
  - Aprobaciones mensuales (Línea)

### **Gestión de Ofertas**
- 🔔 **Badge animado** en sidebar con contador de pendientes
- 📑 **4 Pestañas** para filtrar ofertas
- 🔍 **Búsqueda** por cargo, empresa o creador
- 🎯 **Filtros** adicionales por estado y aprobación
- 🎨 **Badges de color** según estado:
  - 🟡 Pendiente (Amarillo)
  - 🟢 Activo (Verde)
  - 🔴 Inactivo (Rojo)

### **Acciones del Moderador**
- 👁️ **Ver detalles** completos de cada oferta
- ✅ **Aprobar** → Cambia a Activo + Visible
- ❌ **Desaprobar** → Regresa a Pendiente
- 🔄 **Activar/Desactivar** → Toggle manual

---

## 🔄 Estados de las Ofertas

| Estado | Color | Visible Egresado | Descripción |
|--------|-------|------------------|-------------|
| **Pendiente** | 🟡 Amarillo | ❌ NO | Esperando aprobación |
| **Activo** | 🟢 Verde | ✅ SI* | Aprobada y publicada |
| **Inactivo** | 🔴 Rojo | ❌ NO | Desactivada |

*_Solo si `aprobado: true`_

---

## 🎯 Flujo Completo

```
Empresa Externa 
    ↓
Envía Oferta → [PENDIENTE] 🟡
    ↓
Moderador Revisa 👨‍💼
    ↓
┌─────────────┴─────────────┐
↓                           ↓
APROBAR ✅               RECHAZAR ❌
↓                           ↓
[ACTIVO] 🟢              [PENDIENTE] 🟡
↓                           ↓
VISIBLE EGRESADOS       NO VISIBLE
```

---

## 📦 Estructura de Base de Datos

### **OfertaLaboral**
```javascript
{
  cargo: String,
  empresa: String,
  estado: "Pendiente" | "Activo" | "Inactivo",  // ⬅️ NUEVO
  aprobado: Boolean (default: false),            // ⬅️ NUEVO
  moderadorAprobador: ObjectId,                  // ⬅️ NUEVO
  fechaAprobacion: Date,                         // ⬅️ NUEVO
  // ... otros campos
}
```

### **PublicacionOfertas**
```javascript
{
  ofertaLaboral: ObjectId,  // Referencia a OfertaLaboral
  perfil: ObjectId,         // Referencia al User (empresa externa)
  createdAt: Date
}
```

---

## 🛠️ Solución de Problemas

### ❓ **No veo solicitudes pendientes**
```bash
# Re-ejecutar el script de ofertas
cd back
node scripts/createOfertasEjemplo.js
```

### ❓ **No puedo iniciar sesión como moderador**
```bash
# Re-crear el moderador
cd back
node scripts/createModerador.js
```

### ❓ **Las ofertas no aparecen para egresados**
✅ Verificar que:
1. La oferta esté en estado **"Activo"**
2. La oferta tenga **`aprobado: true`**
3. El moderador la haya aprobado

### ❓ **El contador de pendientes no actualiza**
🔄 La actualización es automática cada 30 segundos, o:
- Refresca la página (F5)
- Navega a otra sección y regresa

---

## 🎓 Para el Usuario Final

### **Como Empresa Externa:**
1. Enviar oferta al sistema (actualmente vía script o admin)
2. Esperar aprobación del moderador
3. Recibir notificación cuando sea aprobada

### **Como Moderador:**
1. Ver contador de solicitudes en sidebar
2. Revisar cada oferta en detalle
3. Aprobar las relevantes → Se activan automáticamente
4. Rechazar las no aptas → Quedan pendientes

### **Como Egresado:**
1. Ver solo ofertas aprobadas y activas
2. Postular a las ofertas de interés
3. NO ver ofertas pendientes o inactivas

---

## 📚 Archivos Importantes

- `MODERADOR_README.md` - Documentación completa
- `back/scripts/createModerador.js` - Crear moderador
- `back/scripts/createOfertasEjemplo.js` - Crear ofertas de ejemplo
- `back/enums/OfertaLaboral.enum.js` - Estados disponibles
- `front/src/pages/Moderador/GestionOfertasModerador.jsx` - Interfaz principal

---

## ✅ Checklist de Implementación

- [x] Estado "Pendiente" en enum
- [x] Ofertas inician en estado "Pendiente"
- [x] Solo ofertas Activas + Aprobadas visibles para egresados
- [x] Pestañas de filtrado en interfaz moderador
- [x] Contador de pendientes en sidebar
- [x] Al aprobar → cambia a "Activo" automáticamente
- [x] Al desaprobar → regresa a "Pendiente"
- [x] Script para crear ofertas de ejemplo
- [x] Badges de colores según estado
- [x] Documentación completa

---

## 🚀 ¡Todo Listo!

El sistema está completamente funcional. Sigue los pasos de prueba y podrás ver:
- ✅ Solicitudes pendientes en el moderador
- ✅ Aprobación con un click
- ✅ Ofertas visibles solo después de aprobar
- ✅ Interfaz intuitiva con pestañas y filtros

**¡Disfruta del sistema!** 🎉
