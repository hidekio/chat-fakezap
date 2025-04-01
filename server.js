const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// Objeto para armazenar as cores dos usuários
const userColors = {};

// Função para gerar uma cor baseada no nome do usuário
function getUserColor(username) {
    if (!userColors[username]) {
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        userColors[username] = randomColor;
    }
    return userColors[username];
}

// Evento quando o cliente se conecta ao servidor
io.on('connection', (socket) => {
    console.log('Usuário conectado');

    socket.on('chat message', (data) => {
        data.color = getUserColor(data.nome);
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => console.log('Usuário desconectado'));
});

// Iniciar o servidor na porta 3000
http.listen(3000, () => {
    console.log(`Servidor rodando na porta 3000 - http://localhost:3000`);
});
