const express = require('express');
const session = require('express-session');
const moment = require('moment-timezone')

const app = express();

// Configuración de la sesión
app.use(session({
    secret: 'p3-DSTM-#aby-sesionespersistentes', // Secreto para firmar la cookie de sesión
    resave: false, // No resguardar la sesión si no ha sido modificada
    saveUninitialized: false, // Guardar la sesión aunque no haya sido inicializada
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }  // maxAge para los milisegundos
}));

/*// Middleware para inicializar y actualizar tiempos en la sesión
app.use((req, res, next) => {
    if (req.session) {
        if (!req.session.createdAt) {
            req.session.createdAt = Date.now(); // Guardar el tiempo de creación en milisegundos
        }
        req.session.lastAccess = Date.now(); // Actualizar el último acceso en milisegundos
    }
    next();
});*/

//Ruta para inicializar la sesion
app.get('/login/',(req,res)=>{
    if(!req.session.createdAt){
        req.session.createdAt = new Date();
        req.session.lastAccess = new Date();
        res.send("La sesión ha sido iniciada exitosamente");
    }else{
        res.send("Ya existe una sesión ");
    }
})

//Ruta oara actualizar la decha de última consulta
app.get('/update', (req, res) => {
    if (req.session.createdAt) {
        req.session.lastAccess = new Date();
        res.send("La fecha de último acceso ha sido actualizada exitosamente");
    } else {
        res.send("No hay una sesión activa");
    }
});

//Ruta para obtener el estado de la sesión
app.get('/status', (req, res) => {
    if (req.session.createdAt) {
        const now = new Date();
        const started = new Date(req.session.createdAt);
        const lastUpdate = new Date(req.session.lastAccess);

        // Calcular la antigüedad de la sesión
        const sessionAgeMs = now - started;
        const hours = Math.floor(sessionAgeMs / (1000 * 60 * 60));
        const minutes = Math.floor((sessionAgeMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((sessionAgeMs % (1000 * 60)) / 1000);

        // Convertir las fechas al uso horario de CDMX
        const createdAt_CDMX = moment(started).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        const lastAccess_CDMX = moment(lastUpdate).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        res.json({
            mensaje: 'Estado de la sesión',
            sesionID: req.sessionID,
            inicio: createdAt_CDMX,
            ultimoAcceso: lastAccess_CDMX,
            antiguedad: `${hours} horas, ${minutes} minutos, ${seconds} segundos`
        });
    } else {
        res.send("No hay una sesión activa");
    }
});


/*// Ruta para mostrar la información de la sesión
app.get('/session', (req, res) => {
    if (req.session) {
        const User = req.session.User;
        const sessionId = req.session.id;
        const createdAt = new Date(req.session.createdAt); // Convertir la marca de tiempo a Date
        const lastAccess = new Date(req.session.lastAccess); // Convertir la marca de tiempo a Date
        const sessionDuration = (Date.now() - req.session.createdAt) / 1000; // Duración de la sesión en segundos

        res.send(`
            <h1>Detalles de la sesión</h1>
            <p><strong>Nombre de usuario:</strong> ${User}</p>           
            <p><strong>ID de sesión:</strong> ${sessionId}</p>
            <p><strong>Fecha de creación de la sesión:</strong> ${createdAt}</p>
            <p><strong>Último acceso:</strong> ${lastAccess}</p>
            <p><strong>Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
        `);
    }
});*/

// Ruta para cerrar la sesión
app.get('/logout', (req, res) => {
    if(req.session.createdAt){
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión.');
        }
        res.send('<h1>Sesión cerrada exitosamente.</h1>');
    });
    }else{
        res.send("No hay una sesión activa");
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
