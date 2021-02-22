// index.js 
'use strict';

var socket = io();
var chatWindow = document.getElementById('chatWindow');
var sendButton = document.getElementById('chatMessageSendBtn');
var chatInput = document.getElementById('chatInput');

socket.on('connect', function(){
    var name = prompt('대화명을 입력해주세요.', ''); 
    socket.emit('newUserConnect', name);
});

socket.on('updateMessage', function(data){
    if(data.name === 'SERVER'){
        var enterMessageEl = drawInOutMessage(data.message);
        chatWindow.appendChild(enterMessageEl);

    } else{
        var chatMessageEl = drawChatMessage(data);
        
        chatWindow.appendChild(chatMessageEl);

        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});

socket.on('changeHeader', function(data){
    if(data.id === socket.id){
        var infoEl = document.getElementById('info');
        infoEl.innerHTML = data.name;
    }
});

sendButton.addEventListener('click', function(){
    var message = chatInput.value;

    if(!message) return false;

    socket.emit('sendMessage', {
        message
    });

    chatInput.value = '';
});

function drawChatMessage(data){
    var wrap = document.createElement('p');
    var message = document.createElement('span');
    var name = document.createElement('span');

    name.innerHTML = data.name;
    message.innerHTML = data.message;

    name.classList.add('output__user__name');
    message.classList.add('output__user__message');

    wrap.classList.add('output__user');
    wrap.dataset.id = socket.id;

    wrap.appendChild(name);
    wrap.appendChild(message);

    return wrap;
}

function drawInOutMessage(data){
    var wrap = document.createElement('p');
    var name = document.createElement('span');

    name.innerHTML = data;

    name.classList.add('output__user__name');

    wrap.classList.add('output__user');
    wrap.dataset.id = socket.id;

    wrap.appendChild(name);

    return wrap;
}