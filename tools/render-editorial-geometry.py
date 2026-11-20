"""Render the editorial WebP figures from coordinates, with Blender and Pillow.
Run: python3 tools/render-editorial-geometry.py
"""
import json
import math
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/media/images/rendered'

if '--' not in sys.argv:
    from PIL import Image

    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as folder:
        subprocess.run(['blender', '--background', '-t', '8', '--python-exit-code', '1',
                        '--python', str(Path(__file__).resolve()), '--', folder], check=True)
        for png in sorted(Path(folder).glob('*.png')):
            with Image.open(png) as image:
                image.convert('RGB').save(OUT / f'{png.stem}.webp', quality=88, method=6)
                if png.stem == 'schwarzite-pori':
                    image.thumbnail((480, 340), Image.Resampling.LANCZOS)
                    image.convert('RGB').save(OUT / 'schwarzite-pori-480.webp', quality=85, method=6)
    sys.exit(0)

import bpy
from mathutils import Vector

OUTPUT = Path(sys.argv[sys.argv.index('--') + 1])

def material(name, rgb, roughness=.33, metal=.34):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*rgb, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*rgb, 1)
    shader.inputs['Metallic'].default_value = metal
    shader.inputs['Roughness'].default_value = roughness
    return mat

def aim(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z','Y').to_euler()

def area(name, position, color, power, size, target):
    bpy.ops.object.light_add(type='AREA', location=position)
    lamp = bpy.context.object
    lamp.name = name
    lamp.data.color, lamp.data.energy, lamp.data.size = color, power, size
    aim(lamp, target)

def stage(width, height, view, scale, center=(0, 0, 0), perspective=False):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 64
    scene.cycles.use_denoising = False
    scene.world = bpy.data.worlds.new('Dark green studio')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs['Color'].default_value = (.026, .050, .038, 1)
    scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value = .54
    scene.render.resolution_x, scene.render.resolution_y = width, height
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.view_settings.view_transform = 'AgX'
    bpy.ops.object.camera_add(location=view)
    camera = bpy.context.object
    aim(camera, center)
    camera.data.type = 'PERSP' if perspective else 'ORTHO'
    camera.data.lens = 43
    camera.data.ortho_scale = scale
    scene.camera = camera
    area('Mint key', (2.8, -3.6, 4.5), (.72, 1, .81), 460, 3.4, center)
    area('Cyan rim', (-3.4, 2.1, 3), (.23, .76, 1), 510, 2.2, center)
    area('Warm fill', (2.5, 3.0, .2), (1, .69, .41), 155, 3.8, center)
    return scene

class Mesh:
    def __init__(self):
        self.vertices, self.faces = [], []

    def add(self, vertices, faces):
        offset = len(self.vertices)
        self.vertices.extend(vertices)
        self.faces.extend(tuple(offset + i for i in face) for face in faces)

    def tube(self, start, end, radius):
        p, q = Vector(start), Vector(end)
        axis = (q - p).normalized()
        u = axis.cross(Vector((0, 0, 1) if abs(axis.z) < .94 else (1, 0, 0))).normalized()
        v = axis.cross(u)
        offsets = [radius * (u * math.cos(j*math.tau/8) + v * math.sin(j*math.tau/8)) for j in range(8)]
        self.add([point + off for point in (p, q) for off in offsets],
                 [(j, (j + 1) % 8, (j + 1) % 8 + 8, j + 8) for j in range(8)])

    def sphere(self, center, radius):
        vertices = []
        edges = 10
        for k in range(1, 7):
            theta = k * math.pi / 7
            for j in range(edges):
                phi = j * math.tau / edges
                vertices.append(Vector(center) + radius * Vector(
                    (math.sin(theta)*math.cos(phi), math.sin(theta)*math.sin(phi), math.cos(theta))))
        top, bottom = len(vertices), len(vertices)+1
        vertices.extend([Vector(center) + Vector((0,0,radius)), Vector(center) - Vector((0,0,radius))])
        faces = []
        for j in range(edges):
            n = (j + 1) % edges
            faces.extend([(top,j,n),(bottom,5*edges+n,5*edges+j)])
            for k in range(5):
                faces.append((k*edges+j,(k+1)*edges+j,(k+1)*edges+n,k*edges+n))
        self.add(vertices, faces)

    def put(self, name, mat, smooth=True):
        mesh = bpy.data.meshes.new(name)
        mesh.from_pydata(self.vertices, [], self.faces)
        mesh.update()
        obj = bpy.data.objects.new(name, mesh)
        bpy.context.collection.objects.link(obj)
        mesh.materials.append(mat)
        for poly in mesh.polygons:
            poly.use_smooth = smooth
        return obj

def lattice(points, edges, radius, atom_radius, layers=None):
    layers = layers or [0] * len(points)
    for i, rgb in enumerate(((.26,.73,.49),(.25,.61,.85))):
        sticks, atoms = Mesh(), Mesh()
        for a, b in edges:
            if layers[a] == i:
                sticks.tube(points[a], points[b], radius)
        for point, layer in zip(points, layers):
            if layer == i:
                atoms.sphere(point, atom_radius)
        if atoms.faces:
            sticks.put('Bonds', material('Bond alloy', rgb))
            atoms.put('Atoms', material('Carbon joints', tuple(.47 + .50*c for c in rgb)))

def save(scene, name):
    scene.render.filepath = str(OUTPUT / (name + '.png'))
    bpy.ops.render.render(write_still=True)

def schwarzite(repeats):
    data = json.loads((ROOT/'source-materials/schwarzite/p688.json').read_text())['context']
    coords = [tuple(1.5*v + 1.5 for v in p) for p in data['atoms']]
    limits = [(1.5-n/2, 1.5+n/2) for n in repeats]
    keep = {i:tuple((v-1.5)*1.3 for v in p) for i,p in enumerate(coords)
            if all(lo < v < hi for v,(lo,hi) in zip(p,limits))}
    lookup = {i:j for j,i in enumerate(keep)}
    bonds = [(lookup[a],lookup[b]) for a,b in data['edges'] if a in keep and b in keep]
    return list(keep.values()), bonds

def schwarzite_plate(name, repeats, view, scale, wide=False):
    scene = stage(1080 if wide else 720, 650 if wide else 560, view, scale, perspective=wide)
    lattice(*schwarzite(repeats), .014 if len(set(repeats))>1 else .017, .024)
    save(scene, name)

def honeycomb(rolled):
    period = 7*math.sqrt(3)
    lookup, points, edges = {}, [], set()
    for q in range(-9, 10):
        for r in range(-5, 6):
            cx, cy = math.sqrt(3)*(q+r/2), 1.5*r
            if abs(cy) > 4 or (not rolled and abs(cx)>5) or (rolled and not 0<=cx<period):
                continue
            ring = []
            for k in range(6):
                t = math.pi/6+k*math.pi/3
                x,y = cx+math.cos(t),cy+math.sin(t)
                if rolled:
                    x = (x + 1.e-8) % period
                    angle,R = x/period*math.tau,period/math.tau
                    point = (y/3,R*math.sin(angle)/3,R*math.cos(angle)/3)
                else:
                    point = (x/3,y/3,0)
                key = tuple(round(v,6) for v in point)
                if key not in lookup:
                    lookup[key] = len(points)
                    points.append(point)
                ring.append(lookup[key])
            edges.update(tuple(sorted((a,b))) for a,b in zip(ring,ring[1:]+ring[:1]))
    return points, sorted(edges)

def carbon_plates():
    for name,rolled in [('grafene', False), ('nanotubo', True)]:
        scene = stage(720,560,(3.4,-4.3,2.8) if rolled else (1.4,-3.9,5.1),4.12)
        lattice(*honeycomb(rolled),.023,.038)
        save(scene,name)
    data = json.loads((ROOT/'source-materials/carbon/models.json').read_text())
    for name, key, view, size in [
        ('doppio-strato','bilayer-nanoflake',(2.9,-4.4,3.0),(940,620)),
        ('allineati','bilayer-aligned',(0,-.001,6),(720,520)),
        ('traslati','bilayer-nanoflake',(0,-.001,6),(720,520))
    ]:
        g = data[key]
        scene = stage(*size,view,3.63)
        # A slight tilt for the aligned views keeps the bottom layer visible.
        if name != 'doppio-strato':
            scene.camera.location.y = -1.4
            aim(scene.camera, (0,0,0))
        lattice([tuple(x/3.2 for x in p) for p in g['points']], g['edges'], .020, .035, g['layers'])
        save(scene,name)

def potential_plate():
    scene = stage(940,620,(1.0,-4.25,5.75),4.7,(0,0,.25))
    def height(x,y):
        return .25*(x*x-1)**2+.5*y*y
    n,m = 67,43
    verts = [(x,y,height(x,y)) for x in [-1.55+3.1*i/(n-1) for i in range(n)]
             for y in [-1+2*j/(m-1) for j in range(m)]]
    surface = Mesh()
    surface.add(verts,[(i*m+j,(i+1)*m+j,(i+1)*m+j+1,i*m+j+1)
                       for i in range(n-1) for j in range(m-1)])
    mat = material('Potential surface',(.17,.63,.40),.53,.10)
    obj = surface.put('V(x,y)',mat)
    attr = obj.data.color_attributes.new(name='Potential',type='FLOAT_COLOR',domain='POINT')
    for col,(_,_,z) in zip(attr.data,verts):
        col.color=(.085+.32*z,.22+.45*z,.20+.20*z,1)
    node = mat.node_tree.nodes.new('ShaderNodeVertexColor')
    node.layer_name = attr.name
    shader = mat.node_tree.nodes.get('Principled BSDF')
    mat.node_tree.links.new(node.outputs['Color'],shader.inputs['Base Color'])
    grid=Mesh()
    def trace(values):
        coords=[(x,y,height(x,y)+.006) for x,y in values]
        for start,end in zip(coords,coords[1:]):
            grid.tube(start,end,.004)
    for y in (-.8,-.6,-.4,-.2,0,.2,.4,.6,.8):
        trace([(-1.55+3.1*i/80,y) for i in range(81)])
    for j in range(1,16):
        trace([(-1.55+3.1*j/16,-1+2*i/48) for i in range(49)])
    grid.put('Surface grid',material('Grid',(.10,.33,.26),.8,0))
    contour = Mesh()
    for energy in (.045,.10,.17,.24,.35,.48,.68):
        for side in (-1,1):
            last = None
            for i in range(241):
                x = -1.55+3.1*i/240
                square = 2*(energy-height(x,0))
                y = math.sqrt(max(0,square))
                point = (x,side*y,-.14)
                if square>=0 and y<=1:
                    if last is not None:
                        contour.tube(last,point,.007)
                    last = point
                else:
                    last = None
    contour.put('Level curves',material('Contour lines',(.14,.46,.56),.5,.1))
    markers = Mesh()
    for x in (-1,1):
        markers.sphere((x,0,.043),.046)
    markers.put('Minima',material('Minima',(.77,.98,.68),.27))
    saddle = Mesh()
    saddle.sphere((0,0,.29),.04)
    saddle.put('Saddle',material('Saddle',(.94,.61,.20),.3))
    save(scene,'due-valli')

schwarzite_plate('schwarzite-pori',(3,2,2),(2.6,-3.5,2.3),4.8,True)
schwarzite_plate('schwarzite-cella',(1,1,1),(3.4,-5,3.3),3.0)
schwarzite_plate('schwarzite-reticolo',(3,3,3),(3.4,-5,3.3),6.5)
carbon_plates()
potential_plate()
