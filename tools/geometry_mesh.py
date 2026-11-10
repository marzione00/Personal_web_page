"""Shared procedural tubes and exact-mesh previews for the geometry catalog."""
import hashlib, io
import numpy as np
import cairosvg
from PIL import Image
from carbon_mesh import Mesh, norm
MINT = np.array([153, 231, 181])
PALE = np.array([213, 251, 226])
TEAL = np.array([103, 190, 193])
GOLD = np.array([226, 197, 133])

def tube(mesh, points, radius=.012, color=MINT, sides=4):
    """Parallel-transport frames keep a smooth trace through changing tangents."""
    points = np.asarray(points, float)
    tangent = np.gradient(points, axis=0)
    tangent /= np.maximum(np.linalg.norm(tangent, axis=1)[:, None], 1e-12)
    previous = norm(np.cross(tangent[0], [0, 0, 1] if abs(tangent[0, 2]) < .9 else [0, 1, 0]))
    rings = []
    for point, direction in zip(points, tangent):
        previous = norm(previous - direction * np.dot(previous, direction))
        side = np.cross(direction, previous)
        rings.extend(point + radius * (np.cos(a) * previous + np.sin(a) * side)
                     for a in np.arange(sides) * 2 * np.pi / sides)
    faces = []
    for i in range(len(points) - 1):
        for j in range(sides):
            a = i * sides + j
            b = i * sides + (j + 1) % sides
            faces.extend([[a, b, b + sides], [a, b + sides, a + sides]])
    mesh.add(rings, faces, color)


def preview(id, mesh, camera, source, out, width=800, quality=94):
    """Project the exact triangle mesh; lit geometry, transparent background, no labels."""
    p = np.array(mesh.v, float)
    p -= (p.max(0) + p.min(0)) / 2
    pitch, yaw = camera
    rotation = np.array([[1, 0, 0], [0, np.cos(pitch), -np.sin(pitch)], [0, np.sin(pitch), np.cos(pitch)]]) @ np.array([[np.cos(yaw), 0, np.sin(yaw)], [0, 1, 0], [-np.sin(yaw), 0, np.cos(yaw)]])
    p = p @ rotation.T
    scale = min(680 / np.ptp(p[:, 0]), 525 / np.ptp(p[:, 1]))
    screen = np.column_stack([400 + p[:, 0] * scale, 320 - p[:, 1] * scale])
    colors = np.array(mesh.c)
    faces = np.array(mesh.f)
    light = norm(np.array([-.6, .8, 1.3]))
    draw = []
    for face in faces:
        a, b, c = p[face]
        normal = norm(np.cross(b - a, c - a))
        if normal[2] < 0:
            normal *= -1
        brightness = .35 + .65 * max(0, np.dot(normal, light))
        rgb = np.clip(colors[face].mean(0) * brightness, 0, 255).astype(int)
        color = '#' + ''.join(f'{v:02x}' for v in rgb)
        coordinates = ' '.join(f'{x:.2f},{y:.2f}' for x, y in screen[face])
        draw.append((p[face, 2].mean(), f'<polygon points="{coordinates}" fill="{color}" stroke="{color}" stroke-width=".35" stroke-linejoin="round"/>'))
    svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="640" viewBox="0 0 800 640">' + ''.join(s for _, s in sorted(draw)) + '</svg>'
    (source / f'{id}.svg').write_text(svg)
    im = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg.encode(), output_width=width, output_height=round(width*.8))))
    im.save(out / f'{id}.webp', 'WEBP', quality=quality, method=6)
    raw = (out / f'{id}.webp').read_bytes()
    return {'file': f'{id}.webp', 'width': width, 'height': round(width*.8), 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}

