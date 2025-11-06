const mongoose = require('mongoose');
const OfertaLaboral = require('../models/OfertaLaboral');
const User = require('../models/User');
const PublicacionOfertas = require('../models/PublicacionOfertas');
require('dotenv').config();

const createOfertasEjemplo = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📡 Conectado a MongoDB');

    // Buscar o crear usuario "Empresa Externa" para las ofertas
    let empresaExterna = await User.findOne({ email: 'empresa@externa.com' });
    
    if (!empresaExterna) {
      empresaExterna = new User({
        email: 'empresa@externa.com',
        password: 'empresa123',
        name: 'Empresa Externa',
        rol: 'empresa',
        activo: true
      });
      await empresaExterna.save();
      console.log('✅ Usuario "Empresa Externa" creado');
    } else {
      console.log('✓ Usuario "Empresa Externa" ya existe');
    }

    // Limpiar ofertas y publicaciones antiguas del usuario empresa externa
    console.log('🧹 Limpiando ofertas antiguas...');
    const publicacionesAntiguas = await PublicacionOfertas.find({ perfil: empresaExterna._id });
    const ofertasIds = publicacionesAntiguas.map(pub => pub.ofertaLaboral);
    
    await OfertaLaboral.deleteMany({ _id: { $in: ofertasIds } });
    await PublicacionOfertas.deleteMany({ perfil: empresaExterna._id });
    console.log('✅ Ofertas antiguas eliminadas');

    // Ofertas de ejemplo con estado "Pendiente"
    const ofertasEjemplo = [
      {
        cargo: 'Desarrollador Full Stack Senior',
        empresa: 'Tech Solutions SAC',
        modalidad: 'Híbrido',
        ubicacion: 'Lima, Perú',
        tipoContrato: 'Tiempo completo',
        descripcion: 'Buscamos un desarrollador full stack con experiencia en React y Node.js para liderar proyectos de transformación digital. Ofrecemos un ambiente innovador y oportunidades de crecimiento profesional.',
        requisitos: 'Con experiencia',
        area: 'Desarrollo Web / Software',
        linkEmpresa: 'https://www.techsolutions.com',
        salario: 8000,
        fechaCierre: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
        estado: 'Pendiente',
        aprobado: false
      },
      {
        cargo: 'Analista de Datos Junior',
        empresa: 'DataCorp Peru',
        modalidad: 'Remoto',
        ubicacion: 'Lima, Perú',
        tipoContrato: 'Por contrato',
        descripcion: 'Empresa líder en análisis de datos busca talento joven para unirse a nuestro equipo. Capacitación incluida en herramientas de BI y Python.',
        requisitos: 'Sin experiencia',
        area: 'Data Science / Inteligencia Artificial',
        linkEmpresa: 'https://www.datacorp.com.pe',
        salario: 3500,
        fechaCierre: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        estado: 'Pendiente',
        aprobado: false
      },
      {
        cargo: 'Especialista en Marketing Digital',
        empresa: 'Innova Marketing Group',
        modalidad: 'Presencial',
        ubicacion: 'San Isidro, Lima',
        tipoContrato: 'Tiempo completo',
        descripcion: 'Agencia de marketing digital busca especialista con conocimientos en SEO, SEM, redes sociales y email marketing. Ambiente dinámico y creativo.',
        requisitos: 'Con experiencia',
        area: 'Marketing / Publicidad',
        linkEmpresa: 'https://www.innovamarketing.pe',
        salario: 5500,
        fechaCierre: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        estado: 'Pendiente',
        aprobado: false
      },
      {
        cargo: 'Ingeniero de Sistemas - Soporte TI',
        empresa: 'Soluciones IT SAC',
        modalidad: 'Híbrido',
        ubicacion: 'Miraflores, Lima',
        tipoContrato: 'Tiempo completo',
        descripcion: 'Empresa de servicios TI requiere ingeniero de sistemas para soporte técnico nivel 2 y 3. Certificaciones en Microsoft o Cisco son un plus.',
        requisitos: 'Con experiencia',
        area: 'Tecnología / IT',
        linkEmpresa: 'https://www.solucionesit.com',
        salario: 4500,
        fechaCierre: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        estado: 'Pendiente',
        aprobado: false
      },
      {
        cargo: 'Practicante de Recursos Humanos',
        empresa: 'HR Consulting Peru',
        modalidad: 'Presencial',
        ubicacion: 'Surco, Lima',
        tipoContrato: 'Prácticas',
        descripcion: 'Consultora de RRHH busca practicantes para apoyar en procesos de reclutamiento, selección y gestión del talento. Excelente oportunidad para aprender.',
        requisitos: 'Sin experiencia',
        area: 'Recursos Humanos',
        linkEmpresa: 'https://www.hrconsulting.pe',
        salario: 1500,
        fechaCierre: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        estado: 'Pendiente',
        aprobado: false
      },
      {
        cargo: 'Contador Senior',
        empresa: 'Auditores y Consultores SAC',
        modalidad: 'Presencial',
        ubicacion: 'San Isidro, Lima',
        tipoContrato: 'Tiempo completo',
        descripcion: 'Firma contable busca contador con experiencia en auditoría financiera, preparación de estados financieros y conocimiento de normativa tributaria peruana.',
        requisitos: 'Con experiencia',
        area: 'Contabilidad / Finanzas',
        linkEmpresa: 'https://www.auditores.com.pe',
        salario: 6000,
        fechaCierre: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        estado: 'Pendiente',
        aprobado: false
      },
      {
        cargo: 'Diseñador UX/UI',
        empresa: 'Creative Digital Studio',
        modalidad: 'Remoto',
        ubicacion: 'Lima, Perú',
        tipoContrato: 'Por contrato',
        descripcion: 'Estudio de diseño digital busca diseñador UX/UI con portfolio comprobable. Trabajarás en proyectos web y mobile de alto impacto.',
        requisitos: 'Con experiencia',
        area: 'UX/UI Design',
        linkEmpresa: 'https://www.creativedigital.pe',
        salario: 5000,
        fechaCierre: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        estado: 'Pendiente',
        aprobado: false
      },
      {
        cargo: 'Coordinador de Logística',
        empresa: 'LogiTrans Peru SAC',
        modalidad: 'Presencial',
        ubicacion: 'Callao, Perú',
        tipoContrato: 'Tiempo completo',
        descripcion: 'Empresa de logística y transporte busca coordinador para gestión de rutas, inventarios y control de flotas. Experiencia en SAP deseable.',
        requisitos: 'Con experiencia',
        area: 'Logística / Transporte',
        linkEmpresa: 'https://www.logitrans.pe',
        salario: 4800,
        fechaCierre: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        estado: 'Pendiente',
        aprobado: false
      }
    ];

    console.log('📝 Creando ofertas de ejemplo...');
    
    for (const ofertaData of ofertasEjemplo) {
      // Crear la oferta
      const nuevaOferta = new OfertaLaboral(ofertaData);
      await nuevaOferta.save();
      
      // Crear la publicación asociada al usuario "Empresa Externa"
      const nuevaPublicacion = new PublicacionOfertas({
        ofertaLaboral: nuevaOferta._id,
        perfil: empresaExterna._id
      });
      await nuevaPublicacion.save();
      
      console.log(`✅ Oferta creada: ${ofertaData.cargo} - ${ofertaData.empresa}`);
    }

    console.log('\n🎉 ¡Todas las ofertas de ejemplo fueron creadas exitosamente!');
    console.log(`📊 Total de ofertas pendientes: ${ofertasEjemplo.length}`);
    console.log('\n💡 Las ofertas están en estado "Pendiente" esperando la aprobación del moderador.');
    console.log('🔑 Inicia sesión como moderador para revisar y aprobar estas ofertas.');
    
    mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error creando ofertas de ejemplo:', error);
    mongoose.connection.close();
  }
};

createOfertasEjemplo();
