// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 32,
    height: 32,
    speed: 5,
    lastDirection: 'down'
};

// Key states
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    arrowUp: false,
    arrowLeft: false,
    arrowDown: false,
    arrowRight: false
};

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': keys.w = true; break;
        case 'a': keys.a = true; break;
        case 's': keys.s = true; break;
        case 'd': keys.d = true; break;
        case 'arrowup': keys.arrowUp = true; break;
        case 'arrowleft': keys.arrowLeft = true; break;
        case 'arrowdown': keys.arrowDown = true; break;
        case 'arrowright': keys.arrowRight = true; break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': keys.w = false; break;
        case 'a': keys.a = false; break;
        case 's': keys.s = false; break;
        case 'd': keys.d = false; break;
        case 'arrowup': keys.arrowUp = false; break;
        case 'arrowleft': keys.arrowLeft = false; break;
        case 'arrowdown': keys.arrowDown = false; break;
        case 'arrowright': keys.arrowRight = false; break;
    }
});

// Update player movement
function updatePlayer() {
    let moveX = 0;
    let moveY = 0;
    
    // Horizontal movement
    if (keys.a || keys.arrowLeft) moveX = -1;
    if (keys.d || keys.arrowRight) moveX = 1;
    
    // Vertical movement
    if (keys.w || keys.arrowUp) moveY = -1;
    if (keys.s || keys.arrowDown) moveY = 1;
    
    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
        moveX *= 0.7071;
        moveY *= 0.7071;
    }
    
    // Apply movement
    if (moveX !== 0 || moveY !== 0) {
        player.x += moveX * player.speed;
        player.y += moveY * player.speed;
        
        // Update facing direction
        if (Math.abs(moveX) > Math.abs(moveY)) {
            player.lastDirection = moveX > 0 ? 'right' : 'left';
        } else {
            player.lastDirection = moveY > 0 ? 'down' : 'up';
        }
    }
    
    // Keep player in bounds
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
    player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
}

// Draw player
function drawPlayer() {
    // Player body
    ctx.fillStyle = '#61afef';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Direction indicator
    ctx.fillStyle = '#3d8bce';
    
    switch(player.lastDirection) {
        case 'up':
            ctx.fillRect(player.x + 10, player.y + 6, 12, 8);
            break;
        case 'down':
            ctx.fillRect(player.x + 10, player.y + player.height - 14, 12, 8);
            break;
        case 'left':
            ctx.fillRect(player.x + 6, player.y + 10, 8, 12);
            break;
        case 'right':
            ctx.fillRect(player.x + player.width - 14, player.y + 10, 8, 12);
            break;
    }
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#282c34';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw
    updatePlayer();
    drawPlayer();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
