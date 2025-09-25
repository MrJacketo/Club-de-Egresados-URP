// Test para verificar las opciones de grados académicos
// Ejecutar en el navegador o usar curl

const testOptionsEndpoint = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/options', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        console.log('Options response:', data);
        console.log('Grados académicos disponibles:', data.gradosAcademicos);
        
        // Verificar que "Egresado" esté en la lista
        if (data.gradosAcademicos && data.gradosAcademicos.includes('Egresado')) {
            console.log('✅ SUCCESS: "Egresado" está incluido en las opciones');
        } else {
            console.log('❌ ERROR: "Egresado" NO está incluido en las opciones');
        }

    } catch (error) {
        console.error('Error en test:', error);
    }
};

// Para ejecutar: testOptionsEndpoint();
console.log('Test de opciones creado. Ejecuta testOptionsEndpoint() para verificar las opciones.');