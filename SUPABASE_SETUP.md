# Configuración de Supabase Storage para CVs

## Pasos para configurar Supabase Storage en tu proyecto:

### 1. Crear proyecto en Supabase
1. Ve a [Supabase](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Obtén las credenciales del proyecto:
   - `Project URL` (SUPABASE_URL)
   - `anon public key` (SUPABASE_ANON_KEY)

### 2. Configurar variables de entorno
Actualiza tu archivo `.env` con las credenciales de Supabase:
```
SUPABASE_URL=tu_url_del_proyecto_supabase
SUPABASE_ANON_KEY=tu_clave_publica_anonima
```

### 3. Configurar Storage en Supabase
1. Ve a tu panel de Supabase
2. Navega a **Storage** en el menú lateral
3. Ejecuta el SQL en `back/config/supabase-setup.sql` en el **SQL Editor** de Supabase

### 4. Configurar políticas de seguridad (RLS)
Las políticas ya están incluidas en el archivo SQL, pero puedes ajustarlas según tus necesidades:
- Usuarios autenticados pueden subir CVs
- Usuarios autenticados pueden ver CVs
- Usuarios pueden eliminar sus propios CVs

## API Endpoints disponibles:

### Postular a una oferta (con CV)
```
POST /api/ofertas/oferta/:id/postular
Headers: Authorization: Bearer <token>
Body: FormData
- cv: archivo PDF/DOC/DOCX
- correo: email del postulante
- numero: teléfono del postulante
```

### Descargar CV de una postulación
```
GET /api/ofertas/postulacion/:postulacionId/cv/download
Headers: Authorization: Bearer <token>
Response: { downloadUrl: string, fileName: string }
```

## Estructura de archivos en Storage:
```
curriculum-uploads/
├── curriculums/
│   ├── cv_userId1_uuid1.pdf
│   ├── cv_userId2_uuid2.docx
│   └── ...
```

## Limitaciones configuradas:
- Tamaño máximo: 10MB
- Tipos permitidos: PDF, DOC, DOCX
- URLs firmadas válidas por 1 hora

## Campos añadidos al modelo Postulacion:
- `cvUrl`: URL pública del archivo
- `cvFileName`: Nombre único del archivo en storage
- `cvFilePath`: Ruta completa del archivo en storage
- `cv`: Nombre original del archivo (mantenido para compatibilidad)