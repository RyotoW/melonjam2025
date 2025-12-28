#Basic Configs that prob shouldnt have to be changed unless we import something new

import pygame
import sys

class Player(pygame.sprite.Sprite):
  def __init__(self):
    pygame.sprite.Sprite.__init__(self)
#    self.image = 
    self.rect = self.image.get_rect()
  def move(self, distance_x, distance_y)
    self.rect.move_ip(distance_x, distance_y)


pygame.init()
