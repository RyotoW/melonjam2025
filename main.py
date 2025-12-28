#Basic Configs that prob shouldnt have to be changed unless we import something new

import pygame
import sys
import os

# game constants
SCREENRECT = Rect(0, 0, 640, 400)

# functions we need
def load_image(file):
    "loads an image, prepares it for play"
    file = os.path.join(main_dir, 'data', file)
    try:
        surface = pygame.image.load(file)
    except pygame.error:
        raise SystemExit('Could not load image "%s" %s'%(file, pygame.get_error()))
    return surface.convert()

def load_images(*files):
    imgs = []
    for file in files:
        imgs.append(load_image(file))
    return imgs


# objects here 
class Player(pygame.sprite.Sprite):
    images = []
  
    def __init__(self):
        pygame.sprite.Sprite.__init__(self)
        self.image =  self.images[0]
        self.rect = self.image.get_rect()
    def move(self, distance_x, distance_y): #movement function idk if this works
        self.rect.move_ip(distance_x, distance_y)

# main
def main(winstyle = 0):
    pygame.init()

    # copied this from a pygame example but not sure what it does
    winstyle = 0
    bestdepth = pygame.display.mode_ok(SCREENRECT.size, winstyle, 32)
    screen = pygame.display.set_mode(SCREENRECT.size, winstyle, bestdepth)

    # load images PLEASE FIND SPRITES SOMEONE
    img = load_image('player_sprite.png')
    Player.images [img, pygame.transform.flip(img, 1, 0)]

    # background NEED BACKGROUND IMAGES also idk how to change the background so someone figure that out
    bgdtile = load_image('background.png')
    background = pygame.Surface(SCREENRECT.size)
    for x in range(0, SCREENRECT.width, bgdtile.get_width()):
        background.blit(bgdtile, (x, 0))
    screen,blit(background, (0, 0))
    pygame.display.flip()

    # groups
    all = pygame.sprite.RenderUpdates()
    Player.containers = all

    # starting values
    clock = pygame.time.Clock()
    running = TRUE

    # initialize spirtes
    player = Player()

    while running:
        # get input
        for event in pygame.event.get(): #no idea what this loop does
            if event.type == QUIT or \
                (event.type == KEYDOWN and event.key == K_ESCAPE):
                    return
        kestate = pygame.key.get_pressed()

        # clear and update
        all.clear(screen, background)
        all.update()

        # player input
        distance_x = keystate[K_RIGHT] - keystate[K_LEFT]
        distance_y = keystate[K_DOWN] - keystate[K_UP]
        player.move(distance_x, distance_y)

        #draw scene
        dirty = all.draw(screen)
        pygame.display.update(dirty)

        #framerate cap
        clock.tick(40)
    pygame.time.wait(100)
    pygame.quit()

if __name__ == '__main__': main()
  
