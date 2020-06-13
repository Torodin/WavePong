/* --- Gestion de taskbar --- */
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

let taskbarLoginButton = document.getElementById('login-taskbar-button');
//let loginWindowMinButton = document.getElementById('loginMinButton')
let loginWindow = document.getElementById('login');

taskbarLoginButton.addEventListener('click', () => {
    taskbarLoginButton.classList.toggle('infront');
    loginWindow.classList.toggle('oculta');
});

let taskbarOptionButton = document.getElementById('options-taskbar-button');
//let optionWindowMinButton = document.getElementById('optionMinButton')
let optionWindow = document.getElementById('options');

taskbarOptionButton.addEventListener('click', () => {
    taskbarOptionButton.classList.toggle('infront');
    optionWindow.classList.toggle('oculta');
});

/* --- Gestion de opciones --- */
let backAnimChk = document.getElementById('anim-chk');

backAnimChk.addEventListener('click', () => {
    document.getElementsByTagName('body')[0].classList.toggle('animated-back');
});

let crtChk = document.getElementById('crt-chk');

crtChk.addEventListener('click', () => {
    document.getElementsByTagName('html')[0].classList.toggle('aesthetic-effect-crt');
});

/* --- Gestion de login --- */
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


document.getElementsByTagName('audio')[0].play();