let taskbarGameButton = document.getElementById('game-taskbar-button');
let gameWindowMinButton = document.getElementById('gameMinButton')
let gameWindow = document.getElementById('game-window');

taskbarGameButton.addEventListener('click', () => {
    taskbarGameButton.classList.toggle('infront');
    gameWindow.classList.toggle('oculta');
});

gameWindowMinButton.addEventListener('click', () => {
    taskbarGameButton.classList.toggle('infront');
    gameWindow.classList.toggle('oculta');
});

let backAnimButton = document.getElementById('anim-button');

backAnimButton.addEventListener('click', () => {
    document.getElementsByTagName('body')[0].classList.toggle('animated-back');
});

let loginUser = document.getElementById('username');
let loginPsw = document.getElementById('password');
let loginSubButton = document.getElementById('login-sub');
let loginRegButton = document.getElementById('login-reg');

loginRegButton.addEventListener('click', () => {
    socket.emit('new-user', idJugador, loginUser.value, loginPsw.value);
});

loginSubButton.addEventListener('click', () => {
    socket.emit('login', idJugador, loginUser.value, loginPsw.value);
});