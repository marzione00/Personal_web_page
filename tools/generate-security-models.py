"""Procedural security/XAI models approved in the interactive design study.

Regenerate the four MDC3 scenes and their coordinate-derived SVG/WebP previews.
All graphs and signals are illustrative. No empirical measurements are implied.
The renderer and binary format are shared with the carbon models.
"""
from pathlib import Path
import itertools, json
import numpy as np
from geometry_mesh import Mesh, norm, tube, preview, MINT, PALE, TEAL, GOLD

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/geometry'
SOURCE = ROOT / 'source-materials/security-models'
SOURCE.mkdir(parents=True, exist_ok=True)



def graph_model():
    phi = (1 + np.sqrt(5)) / 2
    points = [p for a in [-1, 1] for b in [-1, 1]
              for p in [[0, a, b * phi], [a, b * phi, 0], [a * phi, 0, b]]]
    hull = [list(f) for f in itertools.combinations(range(12), 3)
            if all(abs(np.linalg.norm(np.subtract(points[a], points[b])) - 2) < 1e-8
                   for a, b in itertools.combinations(f, 2))]
    mids = {}
    radius = np.linalg.norm(points[0])

    def midpoint(a, b):
        key = tuple(sorted((a, b)))
        if key not in mids:
            mids[key] = len(points)
            points.append((norm(np.add(points[a], points[b])) * radius).tolist())
        return mids[key]

    faces = []
    for a, b, c in hull:
        ab, bc, ca = midpoint(a, b), midpoint(b, c), midpoint(c, a)
        faces.extend([[a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]])
    edges = sorted({tuple(sorted((f[i], f[(i + 1) % 3]))) for f in faces for i in range(3)})
    mesh = Mesh()
    groups = []
    for k, center in enumerate([[-1.45, -.43, .15], [1.4, -.42, .05], [0, 1.25, -.28]]):
        angle = k * .49
        rotation = np.array([[np.cos(angle), 0, -np.sin(angle)], [0, 1, 0], [np.sin(angle), 0, np.cos(angle)]])
        p = np.array(points) @ rotation.T * (.48 if k == 2 else .52) + center
        groups.append(p)
        mesh.add(p, faces, [9, 25, 18])
        for a, b in edges:
            tube(mesh, [p[a], p[b]], .010, .55 * MINT + .45 * TEAL if k == 1 else MINT)
        for point in p:
            mesh.ball(point, .023, PALE)
    bridges = []
    for a, b in [(0, 1), (1, 2), (2, 0)]:
        pairs = sorted((np.linalg.norm(p - q), i, j) for i, p in enumerate(groups[a]) for j, q in enumerate(groups[b]))
        _, i0, j0 = pairs[0]
        second = next(pair for pair in pairs if pair[1] != i0 and pair[2] != j0)
        for _, i, j in [pairs[0], second]:
            tube(mesh, [groups[a][i], groups[b][j]], .014, GOLD)
            for point in [groups[a][i], groups[b][j]]:
                mesh.ball(point, .04, GOLD)
            bridges.append([a * 42 + i, b * 42 + j])
    return mesh, {'points': np.vstack(groups).tolist(), 'communities': [k for k in range(3) for _ in range(42)],
                  'edges': [[a + k * 42, b + k * 42] for k in range(3) for a, b in edges] + bridges,
                  'bridges': bridges, 'directed': False}


def block(mesh, center, size, color):
    vertices = np.array(list(itertools.product([-1, 1], repeat=3))) * size + center
    quads = [[0, 1, 3, 2], [4, 6, 7, 5], [0, 4, 5, 1], [2, 3, 7, 6], [0, 2, 6, 4], [1, 5, 7, 3]]
    for a, b, c, d in quads:
        mesh.add(vertices[[a, b, c, d]], [[0, 1, 2], [0, 2, 3]], np.asarray(color) * .20)
    for i, v in enumerate(vertices):
        for j, w in enumerate(vertices):
            if j > i and (i ^ j) in [1, 2, 4]:
                tube(mesh, [v, w], .011, color)
    mesh.ball(center, .033, PALE)


def flow_model():
    mesh = Mesh()
    points = np.array([[-2.65, 0, 0], [-1.65, 0, 0], [-.6, 1.15, -.2], [-.6, -.95, .1], [-.6, -.3, .95],
                       [.65, 1.15, -.2], [.65, -.95, .1], [.65, -.3, .95], [1.7, 0, 0], [2.7, 0, 0]]) * .85
    links = [[0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [3, 6], [4, 7], [5, 8], [6, 8], [7, 8], [8, 9]]
    route = [0, 1, 2, 5, 8, 9]
    selected = set(zip(route, route[1:]))
    for i, j in links:
        a = points[i] + [.19 if i in [1, 8] else .17, 0, 0]
        d = points[j] - [.19 if j in [1, 8] else .17, 0, 0]
        distance = (d[0] - a[0]) * .55
        b, c = a + [distance, 0, 0], d - [distance, 0, 0]
        t = np.linspace(0, 1, 18)[:, None]
        path = (1 - t)**3 * a + 3 * (1 - t)**2 * t * b + 3 * (1 - t) * t**2 * c + t**3 * d
        color = GOLD if (i, j) in selected else MINT
        tube(mesh, path, .015, color)
        tip = path[12]
        direction = norm(path[12] - path[10])
        side = norm(np.cross(direction, [0, 0, 1]))
        normal = np.cross(direction, side)
        ring = [tip - direction * .13 + .052 * (np.cos(v) * side + np.sin(v) * normal)
                for v in np.arange(6) * np.pi / 3]
        mesh.add([tip, *ring], [[0, k + 1, (k + 1) % 6 + 1] for k in range(6)], color)
    for i, p in enumerate(points):
        block(mesh, p, [.19, .27, .22] if i in [1, 8] else [.17, .18, .22], GOLD if i in [0, 9] else MINT)
    return mesh, {'points': points.tolist(), 'edges': links, 'highlightedPath': route, 'directed': True}


def probability(x, y):
    return 1 / (1 + np.exp(-(1.2 * x - .5 * y + .45 * x * y)))


def surface_model():
    mesh = Mesh()
    nx, ny = 30, 22
    x, y = np.meshgrid(np.linspace(-2.1, 2.1, nx + 1), np.linspace(-1.7, 1.7, ny + 1), indexing='ij')
    p = probability(x, y)
    points = np.stack([x, 2.5 * (p - .5), y], -1)
    faces = []
    for i in range(nx):
        for j in range(ny):
            a = i * (ny + 1) + j
            b = a + ny + 1
            faces.extend([[a, b, b + 1], [a, b + 1, a + 1]])
    mesh.add(points.reshape(-1, 3), faces, [20, 65, 52])
    for i in range(len(points)):
        for j in range(len(points[0])):
            mesh.c[i * (ny + 1) + j] = (np.array([16, 44, 48]) * (1 - p[i, j]) + np.array([31, 87, 56]) * p[i, j]).tolist()
    lifted = points.copy()
    lifted[:, :, 1] += .012
    for i in range(0, nx + 1, 2):
        tube(mesh, lifted[i], .006, MINT * .83, 4)
    for j in range(0, ny + 1, 2):
        tube(mesh, lifted[:, j], .006, MINT * .83, 4)
    contours = []
    for level in [.2, .5, .8]:
        segment = []
        # Parameterise by y: 1.2 + .45*y stays positive on the entire domain.
        # Sampling x would leave only four points near the almost vertical p=.8 curve.
        for yy in np.linspace(-1.7, 1.7, 61):
            xx = (np.log(level / (1 - level)) + .5 * yy) / (1.2 + .45 * yy)
            if abs(xx) <= 2.1:
                segment.append([xx, 2.5 * (level - .5) + .027, yy])
            elif segment:
                if len(segment) > 1:
                    contours.append({'level': level, 'points': segment})
                segment = []
        if len(segment) > 1:
            contours.append({'level': level, 'points': segment})
    for curve in contours:
        tube(mesh, curve['points'], .018 if curve['level'] == .5 else .009, GOLD if curve['level'] == .5 else PALE, 6)
    return mesh, {'formula': 'sigmoid(1.2*x - 0.5*y + 0.45*x*y)', 'height': '2.5*(p-0.5)',
                  'domain': [[-2.1, 2.1], [-1.7, 1.7]], 'contours': contours}


def trace_model():
    mesh = Mesh()
    tau = 6 * 7 * np.pi / 179
    time = np.linspace(0, 7 * np.pi - 2 * tau, 601)
    signal = lambda t: np.sin(t) + .34 * np.sin(3.3 * t) + .07 * np.sin(19 * t)
    points = np.array([signal(time + k * tau) for k in range(3)]).T * 1.22
    tube(mesh, points, .028, MINT, 6)
    for i in range(len(points)):
        color = TEAL * (1 - i / 600) + MINT * (i / 600)
        for k in range(6):
            mesh.c[i * 6 + k] = color.tolist()
    for point in points[::50]:
        mesh.ball(point, .035, PALE)
    for point in points[[0, -1]]:
        mesh.ball(point, .06, GOLD)
    return mesh, {'signal': 'sin(t)+0.34*sin(3.3*t)+0.07*sin(19*t)', 'delay': tau,
                  'referenceSamples': 180, 'referenceDomain': [0, float(7 * np.pi)],
                  'renderSamples': len(points), 'points': points.tolist(), 'entropyEstimated': False}



def generate():
    manifest = json.loads((OUT / 'manifest.json').read_text())
    lookup = {entry['id']: entry for entry in manifest}
    models = {}
    for id, build, camera, description in [
        ('markov-network', graph_model, (-.14, .18), 'Synthetic undirected graph: three geodesic communities and six bridges'),
        ('program-flow', flow_model, (-.42, -.25), 'Synthetic directed execution graph: three branches and one highlighted possible path'),
        ('decision-surface', surface_model, (-.65, -.62), 'Analytical logistic surface with mesh and exact probability level curves'),
        ('entropy-trace', trace_model, (-.24, .40), 'Dense continuous delay embedding of the original synthetic signal; entropy is not estimated')]:
        mesh, semantic = build()
        # The design study looks along +Z; the shared viewer looks along -Z.
        # Reflect the display frame and reverse winding so the same front stays visible.
        mesh.v = (np.asarray(mesh.v) * [1, 1, -1]).tolist()
        mesh.f = np.asarray(mesh.f)[:, [0, 2, 1]].tolist()
        camera = tuple(-angle for angle in camera)
        semantic['displayTransform'] = 'reflect Z, then centre and uniformly normalise'
        entry = dict(mesh.save(id, camera), **preview(id, mesh, camera, SOURCE, OUT), family='sicurezza-xai', labels=False,
                     model=description, ambientMotion=True)
        if id in lookup:
            lookup[id].clear()
            lookup[id].update(entry)
        else:
            manifest.append(entry)
        models[id] = semantic
        print(id, entry['vertices'], entry['triangles'], entry['sceneBytes'], entry['bytes'])
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    (SOURCE / 'models.json').write_text(json.dumps(models, separators=(',', ':')) + '\n')


if __name__ == '__main__':
    generate()
