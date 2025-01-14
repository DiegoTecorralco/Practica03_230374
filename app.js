const express = require('express');
const session = require('express-session');

const app = express();

// Configuración de la sesión
app.use(session({
    secret: 'mi-clave-secreta', // Secreto para firmar la cookie de sesión
    resave: false, // No resguardar la sesión si no ha sido modificada
    saveUninitialized: false, // Guardar la sesión aunque no haya sido inicializada
    cookie: { secure: false } // Usar secure:true solo si usas HTTPS
}));

// Middleware para inicializar y actualizar tiempos en la sesión
app.use((req, res, next) => {
    if (req.session) {
        if (!req.session.createdAt) {
            req.session.createdAt = Date.now(); // Guardar el tiempo de creación en milisegundos
        }
        req.session.lastAccess = Date.now(); // Actualizar el último acceso en milisegundos
    }
    next();
});

app.get('/login/:User',(req,res)=>{
    req.session.User=req.params.User;
    res.send("Usuario guardado");
})

// Ruta para mostrar la información de la sesión
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
});

// Ruta para cerrar la sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error al cerrar sesión.');
        }
        res.send('<h1>Sesión cerrada exitosamente.</h1>');
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
