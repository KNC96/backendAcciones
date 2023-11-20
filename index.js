const axios = require('axios');
const nodemailer = require('nodemailer');
let destacados = [];

// Configuración de nodemailer (reemplaza con tus propias credenciales y detalles del correo electrónico)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cuentademinado5@gmail.com',
        pass: 'gczlxzjkeqorkbau',
    },
});

let symbol = '';
let nombreEmpresas = [
    { name: 'Sea ltd', ticker: 'SE' },
    { name: 'Amazon.com Inc', ticker: 'AMZN' },
    { name: 'Satellogic', ticker: 'SATL' },
    { name: 'Alphabet Inc', ticker: 'GOOG' },
    { name: 'Microsoft', ticker: 'MSFT' },
    { name: 'Shopify', ticker: 'SHOP' },
    { name: 'Zoom', ticker: 'ZM' },
];

let obtenerDatosEmpresa = async (empresa) => {
    symbol = empresa.ticker;
    let urlPrecio = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=clcmcshr01qggpd2h8j0clcmcshr01qggpd2h8jg`;

    try {
        const response = await axios.get(urlPrecio);
        const datos = response.data;

        console.log(empresa.name);
        console.log(empresa.ticker);
        console.log(datos.dp + " %");
        console.log(datos.d);
        console.log(datos.c + " USD");

        if (datos.dp <= -3) {
            console.log(empresa.name + " precio "+ datos.c + " USD" + " ha bajado " + datos.dp);
            destacados.push(empresa);
        }
    } catch (error) {
        console.error(`Error al obtener datos para ${empresa.name}:`, error.message);
    }
};

let recorrerLista = async () => {
    const promesas = nombreEmpresas.map(empresa => obtenerDatosEmpresa(empresa));
    await Promise.all(promesas);

    console.log(destacados);
    let asunto = `Datos relevantes`;
    let mensaje = JSON.stringify(destacados);

    await enviarCorreoElectronico(asunto, mensaje);
};

// Función para enviar correos electrónicos
const enviarCorreoElectronico = async (asunto, mensaje) => {
    // Verificar si hay información en el array destacados
    if (destacados.length > 0) {
        const opcionesCorreo = {
            from: 'cuentademinado5@gmail.com',
            to: 'kevincastro920@gmail.com', // Reemplaza con la dirección de correo del destinatario
            subject: asunto,
            text: mensaje,
        };

        try {
            const info = await transporter.sendMail(opcionesCorreo);
            console.log('Correo electrónico enviado con éxito:', info.response);
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error.message);
        }
    } else {
        console.log('No hay información destacada para enviar correo electrónico.');
    }
};

// Iniciar recorrerLista al principio
recorrerLista();

// Ejecutar recorrerLista cada hora
setInterval(recorrerLista, 3600000); // 3600000 milisegundos = 1 hora


