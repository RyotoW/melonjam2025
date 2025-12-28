// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');

// Canvas setup
canvas.width = 800;
canvas.height = 600;

// Game settings
const GRID_SIZE = 32;
const PLAYER_SPEED = 5;

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 32,
    height: 32,
    speed: PLAYER_SPEED,
    gridMode: true,
    lastDirection: 'down',
    moving: false
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

// Initialize
function init() {
    info.textContent = 'Use WASD or Arrow Keys to move | G to toggle grid';
    gameLoop();
}

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
        
        // Toggle grid mode
        case 'g':
            player.gridMode = !player.gridMode;
            console.log(`Grid mode: ${player.gridMode ? 'ON' : 'OFF'}`);
            break;
            
        // Reset position
        case 'r':
            player.x = canvas.width / 2;
            player.y = canvas.height / 2;
            break;
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
        moveX *= 0.7071; // 1 / sqrt(2)
        moveY *= 0.7071;
    }
    
    // Apply movement
    if (moveX !== 0 || moveY !== 0) {
        player.moving = true;
        player.x += moveX * player.speed;
        player.y += moveY * player.speed;
        
        // Update facing direction
        if (Math.abs(moveX) > Math.abs(moveY)) {
            player.lastDirection = moveX > 0 ? 'right' : 'left';
        } else {
            player.lastDirection = moveY > 0 ? 'down' : 'up';
        }
    } else {
        player.moving = false;
    }
    
    // Grid snapping
    if (player.gridMode && !player.moving) {
        player.x = Math.round(player.x / GRID_SIZE) * GRID_SIZE;
        player.y = Math.round(player.y / GRID_SIZE) * GRID_SIZE;
    }
    
    // Keep player in bounds
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
    player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
}

// Draw grid
function drawGrid() {
    ctx.strokeStyle = 'rgba(97, 175, 239, 0.3)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Draw player
function drawPlayer() {
    // Player body
    ctx.fillStyle = '#61afef';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Direction indicator
    ctx.fillStyle = '#3d8bce';
    let indicatorX = player.x;
    let indicatorY = player.y;
    
    switch(player.lastDirection) {
        case 'up':
            indicatorY += 6;
            ctx.fillRect(player.x + 10, indicatorY, 12, 8);
            break;
        case 'down':
            indicatorY += player.height - 14;
            ctx.fillRect(player.x + 10, indicatorY, 12, 8);
            break;
        case 'left':
            indicatorX += 6;
            ctx.fillRect(indicatorX, player.y + 10, 8, 12);
            break;
        case 'right':
            indicatorX += player.width - 14;
            ctx.fillRect(indicatorX, player.y + 10, 8, 12);
            break;
    }
}

// Draw UI info
function drawUI() {
    ctx.fillStyle = '#98c379';
    ctx.font = '18px monospace';
    ctx.textAlign = 'left';
    
    const infoText = [
        `Position: (${Math.round(player.x)}, ${Math.round(player.y)})`,
        `Mode: ${player.gridMode ? 'GRID' : 'FREE'}`,
        `Facing: ${player.lastDirection.toUpperCase()}`,
        `Moving: ${player.moving ? 'YES' : 'NO'}`
    ];
    
    infoText.forEach((text, i) => {
        ctx.fillText(text, 10, 30 + i * 25);
    });
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#282c34';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update
    updatePlayer();
    
    // Draw
    if (player.gridMode) drawGrid();
    drawPlayer();
    drawUI();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start game when page loads
window.addEventListener('load', init);
