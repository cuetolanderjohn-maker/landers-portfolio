import math
import random
import sys
from dataclasses import dataclass

import pygame


AUDIO_START = "start-pacman.mp3"
AUDIO_BG = "pac-man.mp3"
AUDIO_DIE = "pacman-die.mp3"
AUDIO_LOSE = "malupiton-aray-ko.mp3"
AUDIO_POWERUP = "pikachu-mad.mp3"
AUDIO_FIREBALL = "fireball.mp3"
AUDIO_SLAP = "pikachu-slap.mp3"

CELL_SIZE = 24

MAX_LEVELS = 5

MAZE_LAYOUT = [
    ['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1'],
    ['1',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','1'],
    ['1','B','1','1',' ','1','1','1',' ','1',' ','1','1','1',' ','1','1','B','1'],
    ['1',' ',' ',' ',' ','1',' ',' ',' ','1',' ',' ',' ','1',' ',' ',' ',' ','1'],
    ['1','1',' ','1',' ','1',' ','1',' ','1',' ','1',' ','1',' ','1',' ','1','1'],
    ['1',' ',' ','1',' ',' ',' ','1',' ',' ',' ','1',' ',' ',' ','1',' ',' ','1'],
    ['1',' ','1','1','1','1',' ','1','1','1','1','1',' ','1','1','1','1',' ','1'],
    ['1',' ',' ',' ',' ',' ',' ',' ',' ','r',' ',' ',' ',' ',' ',' ',' ',' ','1'],
    ['1','1',' ','1','1','1',' ','1','1','-','1','1',' ','1','1','1',' ','1','1'],
    ['t','t','t','t','t','1',' ','1','s','p','o','1',' ','1','t','t','t','t','t'],
    ['1','1',' ','1',' ','1',' ','1','1','1','1','1',' ','1',' ','1',' ','1','1'],
    ['1',' ',' ','1',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','1',' ',' ','1'],
    ['1',' ','1','1','1','1',' ','1','1','1','1','1',' ','1','1','1','1',' ','1'],
    ['1',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','1'],
    ['1','1','1',' ','1','1','1',' ','1','1','1',' ','1','1','1',' ','1','1','1'],
    ['1',' ',' ',' ','1',' ',' ',' ',' ','P',' ',' ',' ',' ','1',' ',' ',' ','1'],
    ['1','B','1',' ','1',' ','1',' ','1','1','1',' ','1',' ','1',' ','1','B','1'],
    ['1',' ','1',' ',' ',' ','1',' ',' ',' ',' ',' ','1',' ',' ',' ','1',' ','1'],
    ['1',' ','1','1','1',' ','1','1','1',' ','1','1','1',' ','1','1','1',' ','1'],
    ['1',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','1'],
    ['1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1']
]


GHOST_COLORS = [
    (255, 100, 255),
    (0, 255, 255),
    (255, 165, 0),
    (255, 0, 0),
]

GHOST_IMAGES = [
    "ghost_pink.png",
    "ghost_purple.png",
    "ghost_meowth.png",
    "ghost_blue.png",
]


DIRS = {
    "UP": (0, -1),
    "DOWN": (0, 1),
    "LEFT": (-1, 0),
    "RIGHT": (1, 0),
}
DIR_ORDER = [DIRS["LEFT"], DIRS["RIGHT"], DIRS["UP"], DIRS["DOWN"]]




def build_maze():

    rows = []
    for row in MAZE_LAYOUT:
        new_row = []
        for ch in row:
            if ch == '1':
                new_row.append('#')
            elif ch == 'B':
                new_row.append('o')
            elif ch == 'P':
                new_row.append('P')
            elif ch in ('r', 's', 'p', 'o', '-'):
                new_row.append('G')
            elif ch == 't':
                new_row.append('T')
            else:
                new_row.append('.')
        rows.append(''.join(new_row))
    
    
    width = max(len(r) for r in rows) if rows else 0
    norm_rows = []
    for r in rows:
        if len(r) < width:
            r = r + " " * (width - len(r))
        norm_rows.append(r)
    
    return norm_rows


MAZE = build_maze()
GRID_W = len(MAZE[0])
GRID_H = len(MAZE)


PAC_START = None
GHOST_STARTS = []
walls = set()
pellets = set()
power_pellets = set()
empty_corridor = set()
tunnel_tiles = set()


for y in range(GRID_H):
    for x in range(GRID_W):
        ch = MAZE[y][x]
        if ch == "#":
            walls.add((x, y))
        elif ch == "P":
            PAC_START = (x, y)
            empty_corridor.add((x, y))
            pellets.add((x, y))
        elif ch == "G":
            GHOST_STARTS.append((x, y))
            empty_corridor.add((x, y))
        elif ch == "o":
            power_pellets.add((x, y))
            empty_corridor.add((x, y))
        elif ch == ".":
            pellets.add((x, y))
            empty_corridor.add((x, y))
        elif ch == "T":
            empty_corridor.add((x, y))
            tunnel_tiles.add((x, y))
            pellets.add((x, y))
        else:
            empty_corridor.add((x, y))


for pos in list(empty_corridor):
    if pos in power_pellets or pos in pellets:
        continue
    if pos == PAC_START or pos in GHOST_STARTS:
        continue
    pellets.add(pos)



@dataclass
class Entity:
    
    x: int
    y: int

    def tile(self):
        return (self.x, self.y)


@dataclass
class LightningTrail:
    x: float
    y: float
    vx: float
    vy: float
    lifetime: float
    max_lifetime: float
    
    def update(self, dt):
        self.x += self.vx * dt
        self.y += self.vy * dt
        self.lifetime -= dt
        
    def is_alive(self):
        return self.lifetime > 0
    
    def get_alpha(self):
        alpha = int(255 * (self.lifetime / self.max_lifetime))
        return max(0, min(255, alpha))


@dataclass
class Thunderbolt:
    x: float
    y: float
    vx: float
    vy: float
    lifetime: float
    max_lifetime: float
    
    def update(self, dt):
        self.x += self.vx * dt
        self.y += self.vy * dt
        self.lifetime -= dt
    
    def is_alive(self):
        return self.lifetime > 0
    
    def get_alpha(self):
        alpha = int(255 * (self.lifetime / self.max_lifetime))
        return max(0, min(255, alpha))
    
    def get_tile(self):
        return (int(self.x // CELL_SIZE), int(self.y // CELL_SIZE))


def is_wall(tx, ty):
    
    return (tx, ty) in walls


def is_tunnel_tile(tx, ty):
    
    return (tx, ty) in tunnel_tiles


def handle_tunnel_wrap(tx, ty):
    
    tunnel_rows = {y for (x, y) in tunnel_tiles}
    
    if ty in tunnel_rows:
        if tx < 0:
            return (GRID_W - 1, ty)
        elif tx >= GRID_W:
            return (0, ty)
    return (tx, ty)


def neighbors(tile):
    
    x, y = tile
    for dx, dy in DIR_ORDER:
        nx, ny = x + dx, y + dy
        nx, ny = handle_tunnel_wrap(nx, ny)
        
        if 0 <= nx < GRID_W and 0 <= ny < GRID_H and not is_wall(nx, ny):
            yield (nx, ny)


def opposite_dir(a, b):
    
    ax, ay = a
    bx, by = b
    return ax == -bx and ay == -by


def manhattan(a, b):
    
    return abs(a[0] - b[0]) + abs(a[1] - b[1])



class Game:
    
    def __init__(self):
        pygame.init()
        pygame.mixer.init()

        self._audio_started = False
        self._bg_started = False
        self._die_playing = False
        self._lose_sound_played = False
        self._menu_channel = None

        self.started = False
        self.paused = False
        self.level_complete = False

        self.clock = pygame.time.Clock()
        self.cell = CELL_SIZE
        self.screen = pygame.display.set_mode((GRID_W * self.cell, GRID_H * self.cell))
        pygame.display.set_caption("Pacman (Python, pygame)")

        self.font = pygame.font.SysFont(None, 28)
        self.big_font = pygame.font.SysFont(None, 44)

        self.snd_start = pygame.mixer.Sound(AUDIO_START) if AUDIO_START else None
        self.snd_die = pygame.mixer.Sound(AUDIO_DIE) if AUDIO_DIE else None
        self.snd_lose = pygame.mixer.Sound(AUDIO_LOSE) if AUDIO_LOSE else None
        self.snd_win = pygame.mixer.Sound("pacman_AwvgsBv.mp3") if True else None
        self.snd_powerup = pygame.mixer.Sound(AUDIO_POWERUP) if AUDIO_POWERUP else None
        self.snd_fireball = pygame.mixer.Sound(AUDIO_FIREBALL) if AUDIO_FIREBALL else None
        self.snd_slap = pygame.mixer.Sound(AUDIO_SLAP) if AUDIO_SLAP else None

        try:
            pygame.mixer.music.load(AUDIO_BG)
        except pygame.error:
            pass

        self.menu_image = None
        try:
            self.menu_image = pygame.image.load("menu_background.png")
            self.menu_image = pygame.transform.scale(self.menu_image, self.screen.get_size())
        except pygame.error:
            pass

        self.start_btn_image = None
        try:
            self.start_btn_image = pygame.image.load("start_button.png")
        except pygame.error:
            pass

        self.maze_bg_image = None
        try:
            self.maze_bg_image = pygame.image.load("maze_layout.png")
            self.maze_bg_image = pygame.transform.scale(
                self.maze_bg_image, 
                (GRID_W * self.cell, GRID_H * self.cell)
            )
        except pygame.error:
            pass

        self.pellet_image = None
        try:
            self.pellet_image = pygame.image.load("pellet.png")
            self.pellet_image = pygame.transform.scale(self.pellet_image, (self.cell, self.cell))
        except pygame.error:
            pass

        self.power_pellet_image = None
        try:
            self.power_pellet_image = pygame.image.load("power_pellet.png")
            self.power_pellet_image = pygame.transform.scale(self.power_pellet_image, (self.cell, self.cell))
        except pygame.error:
            pass

        self.you_win_image = None
        try:
            self.you_win_image = pygame.image.load("you_win_background.png")
            self.you_win_image = pygame.transform.scale(self.you_win_image, self.screen.get_size())
        except pygame.error:
            pass

        self.pac_sprites = {}
        self.pac_powerup_sprites = {}
        self.load_pikachu_sprites()

        self.ghost_sprites = []
        self.ghost_scared_sprite = None
        self.load_ghost_sprites()

        self.thunderbolt_image = None
        try:
            self.thunderbolt_image = pygame.image.load("thunderbolt.png")
            self.thunderbolt_image = pygame.transform.scale(self.thunderbolt_image, (self.cell * 2, self.cell * 2))
        except pygame.error:
            pass

        self.lightning_trails = []
        
        self.thunderbolts = []

        self._play_menu_sound()
        self.reset()

    def load_pikachu_sprites(self):
        try:
            base_image = pygame.image.load("pikachu.png")
            base_image = pygame.transform.scale(base_image, (self.cell, self.cell))
            
            self.pac_sprites[DIRS["RIGHT"]] = base_image
            
            self.pac_sprites[DIRS["LEFT"]] = pygame.transform.flip(base_image, True, False)
            
            self.pac_sprites[DIRS["UP"]] = pygame.transform.rotate(base_image, 90)
            
            self.pac_sprites[DIRS["DOWN"]] = pygame.transform.rotate(base_image, -90)
            
        except pygame.error:
            for direction in [DIRS["UP"], DIRS["DOWN"], DIRS["LEFT"], DIRS["RIGHT"]]:
                surf = pygame.Surface((self.cell, self.cell), pygame.SRCALPHA)
                pygame.draw.circle(surf, (255, 255, 0), (self.cell // 2, self.cell // 2), self.cell // 3)
                self.pac_sprites[direction] = surf

        try:
            powerup_image = pygame.image.load("pikachu_powerup.png")
            powerup_image = pygame.transform.scale(powerup_image, (self.cell, self.cell))
            
            self.pac_powerup_sprites[DIRS["RIGHT"]] = powerup_image
            
            self.pac_powerup_sprites[DIRS["LEFT"]] = pygame.transform.flip(powerup_image, True, False)
            
            self.pac_powerup_sprites[DIRS["UP"]] = pygame.transform.rotate(powerup_image, 90)
            
            self.pac_powerup_sprites[DIRS["DOWN"]] = pygame.transform.rotate(powerup_image, -90)
            
        except pygame.error:
            for direction in [DIRS["UP"], DIRS["DOWN"], DIRS["LEFT"], DIRS["RIGHT"]]:
                surf = pygame.Surface((self.cell, self.cell), pygame.SRCALPHA)
                pygame.draw.circle(surf, (255, 150, 0), (self.cell // 2, self.cell // 2), self.cell // 3)
                self.pac_powerup_sprites[direction] = surf

    def load_ghost_sprites(self):
        for i, ghost_img in enumerate(GHOST_IMAGES):
            try:
                img = pygame.image.load(ghost_img)
                img = pygame.transform.scale(img, (self.cell, self.cell))
                self.ghost_sprites.append(img)
            except pygame.error:
                surf = pygame.Surface((self.cell, self.cell), pygame.SRCALPHA)
                pygame.draw.circle(surf, GHOST_COLORS[i], (self.cell // 2, self.cell // 2), self.cell // 3)
                self.ghost_sprites.append(surf)
        
        try:
            scared_img = pygame.image.load("ghost_scared.png")
            self.ghost_scared_sprite = pygame.transform.scale(scared_img, (self.cell, self.cell))
        except pygame.error:
            scared_surf = pygame.Surface((self.cell, self.cell), pygame.SRCALPHA)
            pygame.draw.circle(scared_surf, (60, 200, 255), (self.cell // 2, self.cell // 2), self.cell // 3)
            self.ghost_scared_sprite = scared_surf

    def _play_menu_sound(self):
        if self.snd_start is None:
            return
        try:
            self._menu_channel = pygame.mixer.find_channel()
            if self._menu_channel:
                self._menu_channel.play(self.snd_start, loops=-1)
        except pygame.error:
            pass

    def _stop_menu_sound(self):
        if self._menu_channel:
            try:
                self._menu_channel.stop()
            except pygame.error:
                pass
            self._menu_channel = None

    def _ensure_audio(self):
        if not self._bg_started:
            try:
                pygame.mixer.music.play(-1)
                self._bg_started = True
            except pygame.error:
                self._bg_started = True

    def _pause_audio(self):
        try:
            pygame.mixer.music.pause()
        except pygame.error:
            pass

    def _unpause_audio(self):
        try:
            pygame.mixer.music.unpause()
        except pygame.error:
            pass

    def _stop_audio(self):
        try:
            pygame.mixer.music.stop()
            self._bg_started = False
        except pygame.error:
            pass

    def spawn_lightning_trail(self, x, y):
        cell_center_x = x * self.cell + self.cell // 2
        cell_center_y = y * self.cell + self.cell // 2
        
        for _ in range(8):
            angle = random.uniform(0, 2 * math.pi)
            speed = random.uniform(100, 250)
            vx = math.cos(angle) * speed
            vy = math.sin(angle) * speed
            
            lifetime = random.uniform(0.15, 0.4)
            trail = LightningTrail(
                x=cell_center_x,
                y=cell_center_y,
                vx=vx,
                vy=vy,
                lifetime=lifetime,
                max_lifetime=lifetime
            )
            self.lightning_trails.append(trail)

    def shoot_thunderbolt(self):
        pac_x, pac_y = self.pac.tile()
        
        start_x = pac_x * self.cell + self.cell // 2
        start_y = pac_y * self.cell + self.cell // 2
        
        direction = self.pac_dir
        speed = 300
        vx = direction[0] * speed
        vy = direction[1] * speed
        
        thunderbolt = Thunderbolt(
            x=start_x,
            y=start_y,
            vx=vx,
            vy=vy,
            lifetime=3.0,
            max_lifetime=3.0
        )
        self.thunderbolts.append(thunderbolt)
        self.thunderbolts_used += 1
        
        if self.snd_fireball is not None:
            try:
                self.snd_fireball.play()
            except pygame.error:
                pass

    def reset(self):
        self._audio_started = False
        self._bg_started = False
        self._die_playing = False
        self._lose_sound_played = False
        self.paused = False
        self.level_complete = False

        self.pellets = set(pellets)
        self.power_pellets = set(power_pellets)
        
        self.score = 0
        self.lives = 3
        self.current_level = 1

        self.power_timer = 0.0
        self.power_duration = 6.5
        
        self.thunderbolt_cooldown = 0.0
        self.thunderbolts_used = 0
        self.max_thunderbolts_per_level = 6

        self.game_over = False
        self.all_levels_complete = False
        self._win_sound_played = False

        self.pac = Entity(*PAC_START)
        self.pac_dir = DIRS["LEFT"]
        self.pac_next_dir = self.pac_dir

        starts = GHOST_STARTS[:4]
        while len(starts) < 4:
            for t in empty_corridor:
                if t not in starts and t != PAC_START:
                    starts.append(t)
                    break
        
        self.ghosts = []
        for i, s in enumerate(starts[:4]):
            self.ghosts.append({
                "pos": Entity(*s),
                "dir": DIRS["RIGHT"] if i % 2 == 0 else DIRS["LEFT"],
                "home": s,
                "scatter": (i % 2 == 0),
                "color_index": i,
            })

        self.ghost_speed = 5 + (self.current_level - 1) * 0.8
        self.pac_speed = 9 + min(4, (self.current_level - 1) * 0.3)
        self.power_duration = 6.5 + min(2.0, (self.current_level - 1) * 0.2)
        
        self.tick_acc_pac = 0.0
        self.tick_acc_ghost = 0.0
        
        self.lightning_trails = []
        self.thunderbolts = []

    def next_level(self):
        if self.current_level < MAX_LEVELS:
            self.current_level += 1
            self.level_complete = False
            
            self.lives = 3
            
            self.pellets = set(pellets)
            self.power_pellets = set(power_pellets)
            
            self.pac = Entity(*PAC_START)
            self.pac_dir = DIRS["LEFT"]
            self.pac_next_dir = self.pac_dir
            
            starts = GHOST_STARTS[:4]
            while len(starts) < 4:
                for t in empty_corridor:
                    if t not in starts and t != PAC_START:
                        starts.append(t)
                        break
            
            self.ghosts = []
            for i, s in enumerate(starts[:4]):
                self.ghosts.append({
                    "pos": Entity(*s),
                    "dir": DIRS["RIGHT"] if i % 2 == 0 else DIRS["LEFT"],
                    "home": s,
                    "scatter": (i % 2 == 0),
                    "color_index": i,
                })
            
            self.ghost_speed = 5 + (self.current_level - 1) * 0.8
            self.pac_speed = 9 + min(4, (self.current_level - 1) * 0.3)
            self.power_duration = 6.5 + min(2.0, (self.current_level - 1) * 0.2)
            
            self.power_timer = 0.0
            self.thunderbolt_cooldown = 0.0
            self.thunderbolts_used = 0
            self.tick_acc_pac = 0.0
            self.tick_acc_ghost = 0.0
            
            self.lightning_trails = []
            self.thunderbolts = []
            
            self._ensure_audio()
        else:
            self.all_levels_complete = True
            self.game_over = True



    def valid_move(self, tile):
        tx, ty = tile
        tx, ty = handle_tunnel_wrap(tx, ty)
        return 0 <= tx < GRID_W and 0 <= ty < GRID_H and not is_wall(tx, ty)

    def move_entity_tile(self, ent: Entity, direction):
        nx = ent.x + direction[0]
        ny = ent.y + direction[1]
        nx, ny = handle_tunnel_wrap(nx, ny)
        
        if 0 <= nx < GRID_W and 0 <= ny < GRID_H and not is_wall(nx, ny):
            ent.x, ent.y = nx, ny

    def step_pac(self):
        x, y = self.pac.tile()
        nd = self.pac_next_dir
        nx, ny = x + nd[0], y + nd[1]
        nx, ny = handle_tunnel_wrap(nx, ny)
        
        if 0 <= nx < GRID_W and 0 <= ny < GRID_H and not is_wall(nx, ny):
            self.pac_dir = nd

        self.move_entity_tile(self.pac, self.pac_dir)

        t = self.pac.tile()
        if t in self.power_pellets:
            self.power_pellets.remove(t)
            self.score += 50
            self.power_timer = self.power_duration
            self.spawn_lightning_trail(t[0], t[1])
            if self.snd_powerup is not None:
                try:
                    self.snd_powerup.play()
                except pygame.error:
                    pass
        elif t in self.pellets:
            self.pellets.remove(t)
            self.score += 10

        if not self.pellets and not self.power_pellets:
            self.level_complete = True
            self._stop_audio()
            if not self._win_sound_played:
                if self.snd_win is not None:
                    try:
                        self.snd_win.play()
                    except pygame.error:
                        pass
                self._win_sound_played = True

    def choose_ghost_dir(self, ghost):
        g = ghost["pos"]
        current_dir = ghost["dir"]
        pac_t = self.pac.tile()

        candidates = []
        x, y = g.tile()
        for dx, dy in DIR_ORDER:
            nx, ny = x + dx, y + dy
            nx, ny = handle_tunnel_wrap(nx, ny)
            
            if 0 <= nx < GRID_W and 0 <= ny < GRID_H and not is_wall(nx, ny):
                candidates.append((dx, dy))

        if not candidates:
            return current_dir

        non_reverse = [d for d in candidates if not opposite_dir(d, current_dir)]
        if non_reverse:
            candidates = non_reverse

        fleeing = self.power_timer > 0
        best_dir = candidates[0]
        best_score = None

        for d in candidates:
            nx, ny = x + d[0], y + d[1]
            nx, ny = handle_tunnel_wrap(nx, ny)
            dist = manhattan((nx, ny), pac_t)

            if fleeing:
                score = dist * 2.0
                toward_x = (nx - pac_t[0]) * (self.pac_dir[0])
                toward_y = (ny - pac_t[1]) * (self.pac_dir[1])
                if self.pac_dir[0] != 0 and toward_x > 0:
                    score -= 6.0
                if self.pac_dir[1] != 0 and toward_y > 0:
                    score -= 6.0
                if (nx, ny) == pac_t:
                    score -= 999
            else:
                score = -dist

            score += ((nx * 13 + ny * 7) % 7) * 0.01

            if best_score is None or score > best_score:
                best_score = score
                best_dir = d

        return best_dir

    def step_ghosts(self):
        for ghost in self.ghosts:
            ghost_dir = self.choose_ghost_dir(ghost)
            ghost["dir"] = ghost_dir
            self.move_entity_tile(ghost["pos"], ghost_dir)

    def handle_collisions(self):
        pac_t = self.pac.tile()
        for ghost in self.ghosts:
            if ghost["pos"].tile() == pac_t:
                if self.power_timer > 0:
                    self.score += 200
                    ghost["pos"].x, ghost["pos"].y = ghost["home"]
                    if self.snd_slap is not None:
                        try:
                            self.snd_slap.play()
                        except pygame.error:
                            pass
                else:
                    self.lives -= 1
                    if self.lives <= 0:
                        self.game_over = True
                        if not self._lose_sound_played:
                            if self.snd_lose is not None:
                                try:
                                    self.snd_lose.play()
                                except pygame.error:
                                    pass
                            self._lose_sound_played = True
                    else:
                        if self.snd_die is not None:
                            try:
                                self.snd_die.play()
                            except pygame.error:
                                pass

                        self.pac = Entity(*PAC_START)
                        for gh in self.ghosts:
                            gh["pos"].x, gh["pos"].y = gh["home"]
                        self.power_timer = 0.0
                        self.lightning_trails = []
                        self.thunderbolts = []

    def handle_thunderbolt_collisions(self):
        for thunderbolt in list(self.thunderbolts):
            bolt_tile = thunderbolt.get_tile()
            for ghost in self.ghosts:
                if ghost["pos"].tile() == bolt_tile:
                    self.score += 500
                    ghost["pos"].x, ghost["pos"].y = ghost["home"]
                    if self.snd_slap is not None:
                        try:
                            self.snd_slap.play()
                        except pygame.error:
                            pass
                    if thunderbolt in self.thunderbolts:
                        self.thunderbolts.remove(thunderbolt)
                    break

    def update(self, dt):
        if self.game_over or self.paused or self.level_complete:
            return

        self.lightning_trails = [trail for trail in self.lightning_trails if trail.is_alive()]
        for trail in self.lightning_trails:
            trail.update(dt)

        self.thunderbolts = [bolt for bolt in self.thunderbolts if bolt.is_alive()]
        for bolt in self.thunderbolts:
            bolt.update(dt)
        
        self.handle_thunderbolt_collisions()
        
        if self.thunderbolt_cooldown > 0:
            self.thunderbolt_cooldown -= dt

        if self.power_timer > 0:
            self.power_timer -= dt
            if self.power_timer < 0:
                self.power_timer = 0

        self.tick_acc_pac += dt * self.pac_speed
        while self.tick_acc_pac >= 1.0:
            self.tick_acc_pac -= 1.0
            self.step_pac()
            self.handle_collisions()
            if self.game_over or self.level_complete:
                break

        self.tick_acc_ghost += dt * self.ghost_speed
        while self.tick_acc_ghost >= 1.0:
            self.tick_acc_ghost -= 1.0
            self.step_ghosts()
            self.handle_collisions()
            if self.game_over or self.level_complete:
                break



    def draw(self):
        self.screen.fill((0, 0, 0))

        if self.maze_bg_image:
            self.screen.blit(self.maze_bg_image, (0, 0))
        else:
            for (x, y) in walls:
                rect = pygame.Rect(x * self.cell, y * self.cell, self.cell, self.cell)
                pygame.draw.rect(self.screen, (0, 90, 250), rect)

        for (x, y) in tunnel_tiles:
            rect = pygame.Rect(x * self.cell, y * self.cell, self.cell, self.cell)
            pygame.draw.rect(self.screen, (0, 0, 0), rect)

        if self.pellet_image:
            for (x, y) in self.pellets:
                px = x * self.cell
                py = y * self.cell
                self.screen.blit(self.pellet_image, (px, py))
        else:
            for (x, y) in self.pellets:
                cx = x * self.cell + self.cell // 2
                cy = y * self.cell + self.cell // 2
                pygame.draw.circle(self.screen, (250, 240, 0), (cx, cy), 3)

        for (x, y) in self.power_pellets:
            px = x * self.cell
            py = y * self.cell
            
            if self.power_pellet_image:
                self.screen.blit(self.power_pellet_image, (px, py))
            else:
                cx = px + self.cell // 2
                cy = py + self.cell // 2
                t = pygame.time.get_ticks() / 1000.0
                r = 6 + int(2 * (1 + math.sin(t * 6)) / 2)
                pygame.draw.circle(self.screen, (255, 120, 0), (cx, cy), r)

        self.draw_pac()
        self.draw_ghosts()

        self.draw_lightning_trails()
        
        self.draw_thunderbolts()

        self.draw_hud()

        if self.level_complete:
            self.draw_level_complete()
        elif self.game_over:
            self.draw_overlay()
        elif self.paused:
            self.draw_pause_overlay()

        pygame.display.flip()

    def draw_lightning_trails(self):
        for trail in self.lightning_trails:
            alpha = trail.get_alpha()
            
            if alpha <= 0:
                continue
            
            trail_surf = pygame.Surface((14, 14), pygame.SRCALPHA)
            
            pygame.draw.circle(trail_surf, (255, 200, 0, alpha), (7, 7), 4)
            
            glow_alpha = max(0, alpha // 2)
            pygame.draw.circle(trail_surf, (255, 255, 100, glow_alpha), (7, 7), 7)
            
            self.screen.blit(trail_surf, (int(trail.x - 7), int(trail.y - 7)))

    def draw_thunderbolts(self):
        for bolt in self.thunderbolts:
            alpha = bolt.get_alpha()
            if alpha <= 0:
                continue
            
            if self.thunderbolt_image:
                bolt_surf = self.thunderbolt_image.copy()
                bolt_surf.set_alpha(alpha)
                self.screen.blit(bolt_surf, (int(bolt.x - self.cell), int(bolt.y - self.cell)))
            else:
                bolt_surf = pygame.Surface((self.cell * 2, self.cell * 2), pygame.SRCALPHA)
                pygame.draw.circle(bolt_surf, (100, 200, 255, alpha), (self.cell, self.cell), self.cell // 2)
                self.screen.blit(bolt_surf, (int(bolt.x - self.cell), int(bolt.y - self.cell)))

    def draw_pac(self):
        x, y = self.pac.tile()
        px = x * self.cell
        py = y * self.cell

        if self.power_timer > 0:
            sprites = self.pac_powerup_sprites
        else:
            sprites = self.pac_sprites

        sprite = sprites.get(self.pac_dir)
        if sprite:
            self.screen.blit(sprite, (px, py))
        else:
            cx = px + self.cell // 2
            cy = py + self.cell // 2
            radius = int(self.cell * 0.42)
            color = (255, 150, 0) if self.power_timer > 0 else (255, 255, 0)
            pygame.draw.circle(self.screen, color, (cx, cy), radius)
            pygame.draw.circle(self.screen, (0, 0, 0), (cx, cy), 3)

    def draw_ghosts(self):
        for i, ghost in enumerate(self.ghosts):
            x, y = ghost["pos"].tile()
            gx = x * self.cell
            gy = y * self.cell
            
            if self.power_timer > 0:
                sprite = self.ghost_scared_sprite
            else:
                sprite = self.ghost_sprites[ghost["color_index"] % len(self.ghost_sprites)]
            
            self.screen.blit(sprite, (gx, gy))

    def draw_hud(self):
        hud = f"Score: {self.score}   Lives: {self.lives}   Level: {self.current_level}/{MAX_LEVELS}   Bolts: {self.max_thunderbolts_per_level - self.thunderbolts_used}/{self.max_thunderbolts_per_level}"
        if self.power_timer > 0:
            hud += f"   Power: {self.power_timer:.1f}s"
        text = self.font.render(hud, True, (240, 240, 240))
        self.screen.blit(text, (10, 6))

    def draw_level_complete(self):
        overlay = pygame.Surface(self.screen.get_size(), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 160))
        self.screen.blit(overlay, (0, 0))

        if self.you_win_image:
            self.screen.blit(self.you_win_image, (0, 0))

        if self.current_level < MAX_LEVELS:
            msg = f"LEVEL {self.current_level} COMPLETE!"
            sub = f"Press SPACE or click NEXT to continue to Level {self.current_level + 1}"
        else:
            msg = "ALL LEVELS COMPLETE!"
            sub = "YOU WIN! Press SPACE or click MENU"

        text = self.big_font.render(msg, True, (255, 255, 0))
        self.screen.blit(text, (self.screen.get_width() // 2 - text.get_width() // 2,
                               self.screen.get_height() // 2 - 80))

        sub_text = self.font.render(sub, True, (200, 200, 200))
        self.screen.blit(sub_text, (self.screen.get_width() // 2 - sub_text.get_width() // 2,
                                    self.screen.get_height() // 2 - 20))

        btn_w, btn_h = 220, 62
        btn_x = self.screen.get_width() // 2 - btn_w // 2
        btn_y = self.screen.get_height() // 2 + 50
        self._next_btn_rect = pygame.Rect(btn_x, btn_y, btn_w, btn_h)

        pygame.draw.rect(self.screen, (0, 200, 100), self._next_btn_rect, border_radius=12)
        pygame.draw.rect(self.screen, (255, 255, 255), self._next_btn_rect, width=2, border_radius=12)

        if self.current_level < MAX_LEVELS:
            label_text = "NEXT LEVEL"
        else:
            label_text = "BACK TO MENU"
        label = self.font.render(label_text, True, (255, 255, 255))
        self.screen.blit(label, (btn_x + btn_w // 2 - label.get_width() // 2,
                                 btn_y + btn_h // 2 - label.get_height() // 2))

    def draw_pause_overlay(self):
        try:
            pause_img = pygame.image.load("pause menu.png")
            pause_img = pygame.transform.scale(pause_img, self.screen.get_size())
            self.screen.blit(pause_img, (0, 0))
        except pygame.error:
            overlay = pygame.Surface(self.screen.get_size(), pygame.SRCALPHA)
            overlay.fill((0, 0, 0, 160))
            self.screen.blit(overlay, (0, 0))

        btn_w, btn_h = 220, 62
        btn_x = self.screen.get_width() // 2 - btn_w // 2
        btn_y = self.screen.get_height() // 2 - btn_h // 2 - 10
        self._resume_btn_rect = pygame.Rect(btn_x, btn_y, btn_w, btn_h)

        pygame.draw.rect(self.screen, (100, 200, 100), self._resume_btn_rect, border_radius=12)
        pygame.draw.rect(self.screen, (255, 255, 255), self._resume_btn_rect, width=2, border_radius=12)

        label = self.font.render("RESUME", True, (255, 255, 255))
        self.screen.blit(label, (btn_x + btn_w // 2 - label.get_width() // 2, 
                                 btn_y + btn_h // 2 - label.get_height() // 2))

        btn_y2 = btn_y + btn_h + 20
        self._restart_btn_rect = pygame.Rect(btn_x, btn_y2, btn_w, btn_h)

        pygame.draw.rect(self.screen, (255, 100, 100), self._restart_btn_rect, border_radius=12)
        pygame.draw.rect(self.screen, (255, 255, 255), self._restart_btn_rect, width=2, border_radius=12)

        label = self.font.render("RESTART", True, (255, 255, 255))
        self.screen.blit(label, (btn_x + btn_w // 2 - label.get_width() // 2, 
                                 btn_y2 + btn_h // 2 - label.get_height() // 2))

        help_txt = "R: restart   Esc: quit"
        hint = self.font.render(help_txt, True, (200, 200, 200))
        self.screen.blit(hint, (self.screen.get_width() // 2 - hint.get_width() // 2, 
                               btn_y2 + btn_h + 30))

    def draw_overlay(self):
        overlay = pygame.Surface(self.screen.get_size(), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 160))
        self.screen.blit(overlay, (0, 0))

        try:
            bg = pygame.image.load("gameover.png")
            bg = pygame.transform.scale(bg, self.screen.get_size())
            self.screen.blit(bg, (0, 0))
        except pygame.error:
            pass

    def draw_menu(self):
        self.screen.fill((0, 0, 0))

        if self.menu_image:
            self.screen.blit(self.menu_image, (0, 0))
        else:
            self.draw_starfield()

        if self.start_btn_image:
            img = self.start_btn_image
            scale_w = 320
            scale_h = int(scale_w * img.get_height() / img.get_width())
            scaled_img = pygame.transform.scale(img, (scale_w, scale_h))
            
            btn_x = self.screen.get_width() // 2 - scale_w // 2
            btn_y = self.screen.get_height() // 2 - scale_h // 2 + 96
            self._start_btn_rect = pygame.Rect(btn_x, btn_y, scale_w, scale_h)
            
            self.screen.blit(scaled_img, (btn_x, btn_y))
        else:
            btn_w, btn_h = 220, 62
            btn_x = self.screen.get_width() // 2 - btn_w // 2
            btn_y = self.screen.get_height() // 2 - btn_h // 2 + 96
            self._start_btn_rect = pygame.Rect(btn_x, btn_y, btn_w, btn_h)

            pygame.draw.rect(self.screen, (0, 200, 255), self._start_btn_rect, border_radius=12)
            pygame.draw.rect(self.screen, (255, 255, 255), self._start_btn_rect, width=2, border_radius=12)

            label = self.font.render("START", True, (255, 255, 255))
            self.screen.blit(label, (btn_x + btn_w // 2 - label.get_width() // 2, 
                                     btn_y + btn_h // 2 - label.get_height() // 2))

        pygame.display.flip()

    def draw_starfield(self):
        random.seed(42)
        for _ in range(150):
            x = random.randint(0, self.screen.get_width())
            y = random.randint(0, self.screen.get_height())
            size = random.randint(1, 3)
            color = (random.randint(150, 255), random.randint(150, 255), random.randint(150, 255))
            pygame.draw.circle(self.screen, color, (x, y), size)



    def run(self):
        last = pygame.time.get_ticks()
        while True:
            now = pygame.time.get_ticks()
            dt = (now - last) / 1000.0
            last = now

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit(0)

                if not self.started:
                    if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                        if hasattr(self, "_start_btn_rect") and self._start_btn_rect.collidepoint(event.pos):
                            self.started = True
                            self.game_over = False
                            self.paused = False
                            self._stop_menu_sound()
                            self._ensure_audio()

                    if event.type == pygame.KEYDOWN:
                        if event.key in (pygame.K_RETURN, pygame.K_KP_ENTER):
                            self.started = True
                            self.game_over = False
                            self.paused = False
                            self._stop_menu_sound()
                            self._ensure_audio()
                        if event.key == pygame.K_ESCAPE:
                            pygame.quit()
                            sys.exit(0)

                    self.draw_menu()
                    self.clock.tick(60)
                    continue

                if self.level_complete and not self.game_over:
                    if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                        if hasattr(self, "_next_btn_rect") and self._next_btn_rect.collidepoint(event.pos):
                            if self.current_level < MAX_LEVELS:
                                self._win_sound_played = False
                                self.next_level()
                            else:
                                self.started = False
                                self._play_menu_sound()
                                self.reset()

                    if event.type == pygame.KEYDOWN:
                        if event.key == pygame.K_SPACE:
                            if self.current_level < MAX_LEVELS:
                                self._win_sound_played = False
                                self.next_level()
                            else:
                                self.started = False
                                self._play_menu_sound()
                                self.reset()
                        if event.key == pygame.K_ESCAPE:
                            pygame.quit()
                            sys.exit(0)
                    continue

                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        pygame.quit()
                        sys.exit(0)
                    if event.key == pygame.K_p:
                        self.paused = not self.paused
                        if self.paused:
                            self._pause_audio()
                        else:
                            self._unpause_audio()
                    if event.key == pygame.K_r:
                        self.started = False
                        self._play_menu_sound()
                        self.reset()
                    if event.key in (pygame.K_LEFT, pygame.K_a):
                        self.pac_next_dir = DIRS["LEFT"]
                    elif event.key in (pygame.K_RIGHT, pygame.K_d):
                        self.pac_next_dir = DIRS["RIGHT"]
                    elif event.key in (pygame.K_UP, pygame.K_w):
                        self.pac_next_dir = DIRS["UP"]
                    elif event.key in (pygame.K_DOWN, pygame.K_s):
                        self.pac_next_dir = DIRS["DOWN"]
                    elif event.key == pygame.K_SPACE and self.started and not self.paused and not self.level_complete and not self.game_over:
                        if self.thunderbolt_cooldown <= 0 and self.thunderbolts_used < self.max_thunderbolts_per_level:
                            self.shoot_thunderbolt()
                            self.thunderbolt_cooldown = 0.5

                if self.paused and event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                    if hasattr(self, "_resume_btn_rect") and self._resume_btn_rect.collidepoint(event.pos):
                        self.paused = False
                        self._unpause_audio()
                    elif hasattr(self, "_restart_btn_rect") and self._restart_btn_rect.collidepoint(event.pos):
                        self.started = False
                        self._play_menu_sound()
                        self.reset()

            if self.started:
                if not self.game_over and not self.level_complete:
                    self._ensure_audio()
                elif self.game_over:
                    self._stop_audio()

                self.update(dt)
                self.draw()
            self.clock.tick(60)




def main():
    if PAC_START is None:
        raise RuntimeError("Maze must include a 'P' pacman start tile")
    if not GHOST_STARTS:
        raise RuntimeError("Maze must include at least one 'G' ghost start tile")

    Game().run()


if __name__ == "__main__":
    main()
