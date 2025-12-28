// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas setup
canvas.width = 800;
canvas.height = 600;

// Game settings
const PLAYER_SPEED = 5;

// World size (larger than canvas)
const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 2000;

// Camera system
const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    
    // Smooth follow settings
    smoothness: 0.1,
    
    // Follow the player smoothly
    follow(targetX, targetY) {
        // Calculate where camera should be (center on target)
        const targetCamX = targetX - this.width / 2;
        const targetCamY = targetY - this.height / 2;
        
        // Keep camera within world boundaries
        const clampedX = Math.max(0, Math.min(targetCamX, WORLD_WIDTH - this.width));
        const clampedY = Math.max(0, Math.min(targetCamY, WORLD_HEIGHT - this.height));
        
        // Smooth interpolation
        this.x += (clampedX - this.x) * this.smoothness;
        this.y += (clampedY - this.y) * this.smoothness;
    },
    
    // Convert world coordinates to screen coordinates
    toScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }
};

// Player object
const player = {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    width: 32,
    height: 32,
    speed: PLAYER_SPEED,
    lastDirection: 'down',
    
    // Get center coordinates
    get centerX() {
        return this.x + this.width / 2;
    },
    
    get centerY() {
        return this.y + this.height / 2;
    }
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

// Initialize camera to player position
camera.follow(player.centerX, player.centerY);

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
    
    // Keep player within world bounds
    player.x = Math.max(0, Math.min(player.x, WORLD_WIDTH - player.width));
    player.y = Math.max(0, Math.min(player.y, WORLD_HEIGHT - player.height));
    
    // Update camera
    camera.follow(player.centerX, player.centerY);
}

// Draw player
function drawPlayer() {
    const screenPos = camera.toScreen(player.x, player.y);
    
    // Player body
    ctx.fillStyle = '#61afef';
    ctx.fillRect(screenPos.x, screenPos.y, player.width, player.height);
    
    // Direction indicator
    ctx.fillStyle = '#3d8bce';
    
    switch(player.lastDirection) {
        case 'up':
            ctx.fillRect(screenPos.x + 10, screenPos.y + 6, 12, 8);
            break;
        case 'down':
            ctx.fillRect(screenPos.x + 10, screenPos.y + player.height - 14, 12, 8);
            break;
        case 'left':
            ctx.fillRect(screenPos.x + 6, screenPos.y + 10, 8, 12);
            break;
        case 'right':
            ctx.fillRect(screenPos.x + player.width - 14, screenPos.y + 10, 8, 12);
            break;
    }
}

// Draw world objects (simple test objects)
function drawWorldObjects() {
    // Create some test objects
    const objects = [
        { x: 500, y: 500, width: 40, height: 40, color: '#2ecc71' },
        { x: 800, y: 300, width: 50, height: 30, color: '#95a5a6' },
        { x: 1200, y: 700, width: 60, height: 60, color: '#e74c3c' },
        { x: 300, y: 1200, width: 40, height: 40, color: '#2ecc71' },
        { x: 1500, y: 400, width: 50, height: 30, color: '#95a5a6' },
        { x: 1800, y: 1800, width: 60, height: 60, color: '#e74c3c' }
    ];
    
    objects.forEach(obj => {
        // Check if object is in camera view
        if (obj.x + obj.width > camera.x && 
            obj.x < camera.x + camera.width &&
            obj.y + obj.height > camera.y && 
            obj.y < camera.y + camera.height) {
            
            const screenPos = camera.toScreen(obj.x, obj.y);
            ctx.fillStyle = obj.color;
            ctx.fillRect(screenPos.x, screenPos.y, obj.width, obj.height);
        }
    });
}

// Draw simple UI
function drawUI() {
    // Draw player position info
    ctx.fillStyle = '#98c379';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Position: (${Math.round(player.x)}, ${Math.round(player.y)})`, 10, 30);
    
    // Draw world info
    ctx.fillStyle = '#61afef';
    ctx.fillText(`World: ${WORLD_WIDTH}x${WORLD_HEIGHT}`, 10, 60);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#282c34';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw
    updatePlayer();
    drawWorldObjects();
    drawPlayer();
    drawUI();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start game when page loads
window.addEventListener('load', gameLoop);
