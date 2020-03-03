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