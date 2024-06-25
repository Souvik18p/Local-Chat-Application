document.addEventListener('DOMContentLoaded', () => {
    const loginDiv = document.getElementById('login');
    const chatDiv = document.getElementById('chat');
    const roomNameInput = document.getElementById('roomName');
    const createRoomButton = document.getElementById('createRoomButton');
    const roomsDiv = document.getElementById('rooms');
    const messagesDiv = document.getElementById('messages');
    const messageList = document.getElementById('messageList');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    let currentRoomId = null;

    const api = window.api;

    const showChat = () => {
        loginDiv.style.display = 'none';
        chatDiv.style.display = 'flex';
    };

    const showMessages = () => {
        messagesDiv.style.display = 'flex';
    };

    const renderRoom = (room) => {
        const roomElement = document.createElement('div');
        roomElement.className = 'room';
        roomElement.textContent = room.name;
        roomElement.addEventListener('click', () => {
            currentRoomId = room.id;
            fetchMessages(room.id);
            showMessages();
        });
        roomsDiv.appendChild(roomElement);
    };

    const renderMessage = (message) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `<span class="username">${message.username}:</span> ${message.message}`;
        messageList.appendChild(messageElement);
    };

    const fetchRooms = async () => {
        const response = await fetch('http://localhost:3000/rooms/list', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        const rooms = await response.json();
        rooms.forEach(renderRoom);
    };

    const fetchMessages = async (roomId) => {
        const response = await fetch(`http://localhost:3000/messages/${roomId}`, {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        });
        const messages = await response.json();
        messageList.innerHTML = '';
        messages.forEach(renderMessage);
    };

    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (data.auth) {
            localStorage.setItem('token', data.token);
            showChat();
            fetchRooms();
        }
    });

    registerButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (data.auth) {
            localStorage.setItem('token', data.token);
            showChat();
            fetchRooms();
        }
    });

    createRoomButton.addEventListener('click', async () => {
        const name = roomNameInput.value;

        const response = await fetch('http://localhost:3000/rooms/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ name })
        });
        const room = await response.json();

        renderRoom(room);
    });

    sendMessageButton.addEventListener('click', async () => {
        const message = messageInput.value;

        const response = await fetch('http://localhost:3000/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ room_id: currentRoomId, message })
        });
        const newMessage = await response.json();

        renderMessage(newMessage);
    });
});
