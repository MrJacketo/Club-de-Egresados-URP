// Test script para verificar la actualización de datos académicos
// Ejecutar en el navegador o Node.js

const testUpdateAcademicData = async () => {
    try {
        // Primero hacer login para obtener el token
        const loginResponse = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'tu-email@test.com', // Reemplaza con un email real
                contraseña: 'tu-password' // Reemplaza con una contraseña real
            }),
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);

        if (!loginData.token) {
            console.error('No se pudo obtener el token');
            return;
        }

        // Luego actualizar los datos académicos
        const updateResponse = await fetch('http://localhost:8000/auth/update-academic-data', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({
                anioEgreso: 2023,
                carrera: 'Ingeniería Industrial',
                gradoAcademico: 'Bachiller'
            }),
        });

        const updateData = await updateResponse.json();
        console.log('Update response:', updateData);

        // Verificar los datos actualizados
        const getCurrentResponse = await fetch('http://localhost:8000/auth/current-user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            },
        });

        const currentUserData = await getCurrentResponse.json();
        console.log('Current user after update:', currentUserData);

    } catch (error) {
        console.error('Error en test:', error);
    }
};

// Para ejecutar: testUpdateAcademicData();
console.log('Script de prueba creado. Ejecuta testUpdateAcademicData() para probar.');