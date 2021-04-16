const socket = io();

// Get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
// Join chatroom
socket.emit('joinRoom',  { username, room });

// Get room and users
socket.on('roomUsers',({ room, users}) => {
    outputRoomName(room);
    outputUsers(users)
});

console.log(username, room)

socket.on('message', message => {
    outputMessage(message);
    console.log(message);
    const chatMessages = document.getElementById('messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    document.getElementById('chat').value = ''

})

// Message submit 
function submit(){
    let msg = document.getElementById('chat');
    // Emit message from server
    socket.emit('chatMessage', msg.value);
}

function outputMessage(message){
console.log('hello');
const msg = document.createElement('div');
msg.setAttribute("style", "width: 100%; background-color: #0099E8; color: white; padding: 5px; display: flex; flex-direction : column");
const time_stamp = document.createElement('div');
time_stamp.setAttribute("style", "width: 100%; background-color: #0099E8; color: white; padding: 5px; display: flex; flex-direction : column");
time_stamp.innerHTML = message.time;

const username = document.createElement('div');
username.setAttribute("style", "background-color: #0099E8; color: white; padding: 5px; display: flex; flex-direction : column");
username.innerHTML = message.username;

const text = document.createElement('div');
text.setAttribute("style", "background-color: #0099E8; color: white; padding: 5px; display: flex; flex-direction : column");
text.innerHTML = message.text;

const username_n_time = document.createElement('div');
username_n_time.setAttribute("style", "background-color: #0099E8; color: white; display: flex; flex-direction : row");
username_n_time.appendChild(username);
username_n_time.appendChild(time_stamp);

// msg.innerHTML = message.username + message.text + message.time;
// console.log(msg);
let messages = document.getElementById("messages");
msg.appendChild(username_n_time);
msg.appendChild(text);
messages.appendChild(msg);
}


// add room name to Dom 
function outputRoomName(room){
    document.getElementById("roomName").innerHTML = room;
}

function outputUsers(users){
    let usersDiv = document.getElementById("users");
    while (usersDiv.firstChild) {
        usersDiv.removeChild(usersDiv.firstChild);
    }
    users.forEach(user => {
        let userDiv = document.createElement('div');
        userDiv.setAttribute("style", "display: flex; justify-content: center; align-items: center; background-color: #0099E8;")

        let user_ = document.createElement('div');
        user_.innerHTML = user.username;
        userDiv.appendChild(user_);

        usersDiv.appendChild(userDiv);
    });
}