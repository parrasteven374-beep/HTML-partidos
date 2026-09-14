let urlApiGuardada = "";

// Sección 1: Configurar y guardar la URL de la API
function guardarUrl() {
    const campoUrl = document.getElementById('apiUrl');
    const urlTexto = campoUrl.value.trim();

    if (!urlTexto) {
        alert("Por favor ingresa una URL antes de guardar.");
        return false;
    }

    urlApiGuardada = urlTexto;
    alert("¡URL guardada con éxito!\n" + urlApiGuardada);
    return true;
}

// Sección 2: Cargar partidos desde la API (Petición GET)
async function cargarPartidos() {
    if (!urlApiGuardada && !guardarUrl()) return;

    try {
        const respuesta = await fetch(urlApiGuardada);

        if (!respuesta.ok) {
            throw new Error(`Código de estado: ${respuesta.status}`);
        }

        const partidos = await respuesta.json();
        const tabla = document.getElementById('tablaPartidos');
        tabla.innerHTML = '';

        partidos.forEach(partido => {
            const fechaTexto = partido.fechaPartido || '';
            const fechaLimpia = fechaTexto ? fechaTexto.split('T')[0] : '-';

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${partido.id ?? '-'}</td>
                <td>${partido.equipoLocal ?? '-'}</td>
                <td>${partido.equipoVisitante ?? '-'}</td>
                <td>${partido.golesLocal ?? '-'}</td>
                <td>${partido.golesVisitante ?? '-'}</td>
                <td>${fechaLimpia}</td>
            `;
            tabla.appendChild(fila);
        });

        alert("¡Partidos cargados con éxito!");

    } catch (error) {
        alert("Error al conectar con la API: " + error.message);
    }
}

// Sección 3: Registrar un nuevo partido en la API (Petición POST)
async function guardarPartido() {
    if (!urlApiGuardada && !guardarUrl()) return;

    const nuevoPartido = {
        equipoLocal: document.getElementById('equipoLocal').value.trim(),
        equipoVisitante: document.getElementById('equipoVisitante').value.trim(),
        golesLocal: document.getElementById('golesLocal').value ? parseInt(document.getElementById('golesLocal').value) : null,
        golesVisitante: document.getElementById('golesVisitante').value ? parseInt(document.getElementById('golesVisitante').value) : null,
        fechaPartido: document.getElementById('fechaPartido').value || null
    };

    if (!nuevoPartido.equipoLocal || !nuevoPartido.equipoVisitante) {
        alert("Ingresa los nombres de ambos equipos.");
        return;
    }

    try {
        const respuesta = await fetch(urlApiGuardada, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoPartido)
        });

        if (!respuesta.ok) {
            throw new Error(`Código de estado: ${respuesta.status}`);
        }

        alert("¡Partido guardado con éxito!");
        document.getElementById('formpartido').reset();
        cargarPartidos();

    } catch (error) {
        alert("Error al guardar el partido: " + error.message);
    }
}