"""Deterministic SVG navigation artwork. Decorative spirals, not astronomical data."""
from pathlib import Path
import math
import random

OUT = Path(__file__).resolve().parents[1] / 'public/assets/labs'
OUT.mkdir(parents=True, exist_ok=True)

def galaxy(name, seed, arms, pitch, flatten, tilt, colours):
    rng = random.Random(seed)
    blue, pale, warm = colours
    def point(r, a):
        x, y = r * math.cos(a), flatten * r * math.sin(a)
        t = math.radians(tilt)
        return (400 + x * math.cos(t) - y * math.sin(t),
                400 + x * math.sin(t) + y * math.cos(t))
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">',
        f'<defs><radialGradient id="halo"><stop stop-color="{blue}" stop-opacity=".18"/><stop offset="1" stop-color="{blue}" stop-opacity="0"/></radialGradient>',
        f'<radialGradient id="core"><stop stop-color="#fffdf2"/><stop offset=".1" stop-color="{pale}" stop-opacity=".95"/><stop offset=".32" stop-color="{warm}" stop-opacity=".4"/><stop offset="1" stop-color="{blue}" stop-opacity="0"/></radialGradient>',
        '<filter id="dust" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter></defs>',
        '<circle cx="400" cy="400" r="370" fill="url(#halo)"/>']
    for arm in range(arms):
        points = [point(r, arm*2*math.pi/arms + pitch*math.log(r/18)) for r in range(18, 341, 3)]
        d = 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x,y in points)
        colour = blue if arm % 2 == 0 else warm
        parts += [f'<path d="{d}" fill="none" stroke="{colour}" stroke-width="28" opacity=".2" filter="url(#dust)"/>',
                  f'<path d="{d}" fill="none" stroke="{colour}" stroke-width="4" opacity=".22"/>']
    for _ in range(1800):
        r = 18 + 320*rng.random()**.72
        arm = rng.randrange(arms)
        a = arm*2*math.pi/arms + pitch*math.log(r/18) + rng.gauss(0, .08 + .045*r/340)
        x, y = point(r + rng.gauss(0, 9), a)
        size = rng.uniform(.5, 1.8) * (1.25 if r < 150 else 1)
        colour = rng.choices([blue, pale, warm], [5,4,1])[0]
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{size:.1f}" fill="{colour}" opacity="{rng.uniform(.25,.95):.2f}"/>')
    parts += [f'<ellipse cx="400" cy="400" rx="125" ry="{125*flatten:.1f}" transform="rotate({tilt} 400 400)" fill="url(#core)"/>',
              f'<ellipse cx="400" cy="400" rx="30" ry="{30*flatten:.1f}" transform="rotate({tilt} 400 400)" fill="url(#core)"/>',
              '<circle cx="400" cy="400" r="2.5" fill="#fffdf0"/>','</svg>']
    (OUT/f'galaxy-{name}.svg').write_text(''.join(parts)+'\n')

galaxy('quantum', 1905, 3, 1.5, .63, -30, ('#65bce7','#d1f6ff','#b5c3fa'))
galaxy('geostat', 1864, 4, 1.8, .75, 28, ('#71c9ad','#dcf6da','#e2bb80'))
rng = random.Random(720)
stars = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800">']
for _ in range(240):
    x,y=rng.uniform(0,1000),rng.uniform(0,800)
    stars.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rng.uniform(.4,1.2):.1f}" fill="#bbd9e2" opacity="{rng.uniform(.18,.7):.2f}"/>')
for x,y in [(76,220),(865,105),(655,610),(95,680),(752,265)]:
    stars.append(f'<path d="M{x-4} {y}h8m-4 -4v8" stroke="#c8e4eb" stroke-width=".6" opacity=".6"/>')
stars.append('</svg>')
(OUT/'star-field.svg').write_text(''.join(stars)+'\n')
