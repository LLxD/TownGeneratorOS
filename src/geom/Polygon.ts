import { Point } from './Point';
import { GeomUtils } from './GeomUtils';
import { MathUtils } from '../utils/MathUtils';

export class Polygon extends Array<Point> {
  private static readonly DELTA = 0.000001;
  
  constructor(vertices?: Point[]) {
    super();
    if (vertices) {
      this.push(...vertices.map(v => v.clone()));
    }
  }
  
  get square(): number {
    let v1 = this[this.length - 1];
    let v2 = this[0];
    let s = v1.x * v2.y - v2.x * v1.y;
    for (let i = 1; i < this.length; i++) {
      v1 = v2;
      v2 = this[i];
      s += (v1.x * v2.y - v2.x * v1.y);
    }
    return s * 0.5;
  }
  
  get perimeter(): number {
    let len = 0.0;
    this.forEdge((v0, v1) => {
      len += Point.distance(v0, v1);
    });
    return len;
  }
  
  get compactness(): number {
    const p = this.perimeter;
    return 4 * Math.PI * this.square / (p * p);
  }
  
  get center(): Point {
    const c = new Point();
    for (const v of this) {
      c.addEq(v);
    }
    c.scaleEq(1 / this.length);
    return c;
  }
  
  get centroid(): Point {
    let x = 0.0;
    let y = 0.0;
    let a = 0.0;
    this.forEdge((v0, v1) => {
      const f = GeomUtils.cross(v0.x, v0.y, v1.x, v1.y);
      a += f;
      x += (v0.x + v1.x) * f;
      y += (v0.y + v1.y) * f;
    });
    const s6 = 1 / (3 * a);
    return new Point(s6 * x, s6 * y);
  }
  
  contains(v: Point): boolean {
    return this.indexOf(v) !== -1;
  }
  
  forEdge(f: (v0: Point, v1: Point) => void): void {
    const len = this.length;
    for (let i = 0; i < len; i++) {
      f(this[i], this[(i + 1) % len]);
    }
  }
  
  forSegment(f: (v0: Point, v1: Point) => void): void {
    for (let i = 0; i < this.length - 1; i++) {
      f(this[i], this[i + 1]);
    }
  }
  
  offset(p: Point): void {
    const dx = p.x;
    const dy = p.y;
    for (const v of this) {
      v.offset(dx, dy);
    }
  }
  
  rotate(a: number): void {
    const cosA = Math.cos(a);
    const sinA = Math.sin(a);
    for (const v of this) {
      const vx = v.x * cosA - v.y * sinA;
      const vy = v.y * cosA + v.x * sinA;
      v.setTo(vx, vy);
    }
  }
  
  isConvexVertex(v1: Point): boolean {
    const v0 = this.prev(v1);
    const v2 = this.next(v1);
    return GeomUtils.cross(v1.x - v0.x, v1.y - v0.y, v2.x - v1.x, v2.y - v1.y) > 0;
  }
  
  next(a: Point): Point {
    return this[(this.indexOf(a) + 1) % this.length];
  }
  
  prev(a: Point): Point {
    return this[(this.indexOf(a) + this.length - 1) % this.length];
  }
  
  vector(v: Point): Point {
    return this.next(v).subtract(v);
  }
  
  vectori(i: number): Point {
    return this[i === this.length - 1 ? 0 : i + 1].subtract(this[i]);
  }
  
  inset(p1: Point, d: number): void {
    const i1 = this.indexOf(p1);
    const i0 = i1 > 0 ? i1 - 1 : this.length - 1;
    const p0 = this[i0];
    const i2 = i1 < this.length - 1 ? i1 + 1 : 0;
    const p2 = this[i2];
    const i3 = i2 < this.length - 1 ? i2 + 1 : 0;
    const p3 = this[i3];
    
    const v0 = p1.subtract(p0);
    const v1 = p2.subtract(p1);
    const v2 = p3.subtract(p2);
    
    let cos = v0.dot(v1) / v0.length / v1.length;
    let z = v0.x * v1.y - v0.y * v1.x;
    let t = d / Math.sqrt(1 - cos * cos);
    if (z > 0) {
      t = Math.min(t, v0.length * 0.99);
    } else {
      t = Math.min(t, v1.length * 0.5);
    }
    t *= MathUtils.sign(z);
    this[i1] = p1.subtract(v0.norm(t));
    
    cos = v1.dot(v2) / v1.length / v2.length;
    z = v1.x * v2.y - v1.y * v2.x;
    t = d / Math.sqrt(1 - cos * cos);
    if (z > 0) {
      t = Math.min(t, v2.length * 0.99);
    } else {
      t = Math.min(t, v1.length * 0.5);
    }
    this[i2] = p2.add(v2.norm(t));
  }
  
  insetEq(d: number): void {
    for (let i = 0; i < this.length; i++) {
      this.inset(this[i], d);
    }
  }
  
  bufferEq(d: number): Polygon {
    return this.buffer(this.map(() => d));
  }
  
  buffer(d: number[]): Polygon {
    const q = new Polygon();
    let i = 0;
    this.forEdge((v0, v1) => {
      const dd = d[i++];
      if (dd === 0) {
        q.push(v0);
        q.push(v1);
      } else {
        const v = v1.subtract(v0);
        const n = v.rotate90().norm(dd);
        q.push(v0.add(n));
        q.push(v1.add(n));
      }
    });
    
    let wasCut: boolean;
    let lastEdge = 0;
    do {
      wasCut = false;
      const n = q.length;
      for (let i = lastEdge; i < n - 2; i++) {
        lastEdge = i;
        const p11 = q[i];
        const p12 = q[i + 1];
        const x1 = p11.x;
        const y1 = p11.y;
        const dx1 = p12.x - x1;
        const dy1 = p12.y - y1;
        
        for (let j = i + 2; j < (i > 0 ? n : n - 1); j++) {
          const p21 = q[j];
          const p22 = j < n - 1 ? q[j + 1] : q[0];
          const x2 = p21.x;
          const y2 = p21.y;
          const dx2 = p22.x - x2;
          const dy2 = p22.y - y2;
          
          const int = GeomUtils.intersectLines(x1, y1, dx1, dy1, x2, y2, dx2, dy2);
          if (int && int.x > Polygon.DELTA && int.x < 1 - Polygon.DELTA && 
              int.y > Polygon.DELTA && int.y < 1 - Polygon.DELTA) {
            const pn = new Point(x1 + dx1 * int.x, y1 + dy1 * int.x);
            q.splice(j + 1, 0, pn);
            q.splice(i + 1, 0, pn);
            wasCut = true;
            break;
          }
        }
        if (wasCut) break;
      }
    } while (wasCut);
    
    const regular: number[] = [];
    for (let i = 0; i < q.length; i++) {
      regular.push(i);
    }
    
    let bestPart: Polygon | null = null;
    let bestPartSq = -Infinity;
    
    while (regular.length > 0) {
      const indices: number[] = [];
      const start = regular[0];
      let i = start;
      do {
        indices.push(i);
        const idx = regular.indexOf(i);
        if (idx !== -1) regular.splice(idx, 1);
        
        const next = (i + 1) % q.length;
        const v = q[next];
        let next1 = q.indexOf(v);
        if (next1 === next) {
          next1 = q.lastIndexOf(v);
        }
        i = next1 === -1 ? next : next1;
      } while (i !== start);
      
      const p = new Polygon(indices.map(idx => q[idx]));
      const s = p.square;
      if (s > bestPartSq) {
        bestPart = p;
        bestPartSq = s;
      }
    }
    
    return bestPart || new Polygon();
  }
  
  peel(v1: Point, d: number): Polygon {
    const i1 = this.indexOf(v1);
    const i2 = i1 === this.length - 1 ? 0 : i1 + 1;
    const v2 = this[i2];
    
    const v = v2.subtract(v1);
    const n = v.rotate90().norm(d);
    
    return this.cut(v1.add(n), v2.add(n), 0)[0];
  }
  
  cut(p1: Point, p2: Point, gap: number = 0): Polygon[] {
    const x1 = p1.x;
    const y1 = p1.y;
    const dx1 = p2.x - x1;
    const dy1 = p2.y - y1;
    
    const len = this.length;
    let edge1 = 0, ratio1 = 0.0;
    let edge2 = 0, ratio2 = 0.0;
    let count = 0;
    
    for (let i = 0; i < len; i++) {
      const v0 = this[i];
      const v1 = this[(i + 1) % len];
      
      const x2 = v0.x;
      const y2 = v0.y;
      const dx2 = v1.x - x2;
      const dy2 = v1.y - y2;
      
      const t = GeomUtils.intersectLines(x1, y1, dx1, dy1, x2, y2, dx2, dy2);
      if (t && t.y >= 0 && t.y <= 1) {
        if (count === 0) { edge1 = i; ratio1 = t.x; }
        else if (count === 1) { edge2 = i; ratio2 = t.x; }
        count++;
      }
    }
    
    if (count === 2) {
      const point1 = p1.add(p2.subtract(p1).scale(ratio1));
      const point2 = p1.add(p2.subtract(p1).scale(ratio2));
      
      let half1 = new Polygon(this.slice(edge1 + 1, edge2 + 1));
      half1.unshift(point1);
      half1.push(point2);
      
      let half2 = new Polygon([...this.slice(edge2 + 1), ...this.slice(0, edge1 + 1)]);
      half2.unshift(point2);
      half2.push(point1);
      
      if (gap > 0) {
        half1 = half1.peel(point2, gap / 2);
        half2 = half2.peel(point1, gap / 2);
      }
      
      const v = this.vectori(edge1);
      return GeomUtils.cross(dx1, dy1, v.x, v.y) > 0 ? [half1, half2] : [half2, half1];
    }
    return [new Polygon([...this])];
  }
  
  static rect(w: number = 1.0, h: number = 1.0): Polygon {
    return new Polygon([
      new Point(-w / 2, -h / 2),
      new Point(w / 2, -h / 2),
      new Point(w / 2, h / 2),
      new Point(-w / 2, h / 2)
    ]);
  }
  
  static regular(n: number = 8, r: number = 1.0): Polygon {
    const vertices: Point[] = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      vertices.push(new Point(r * Math.cos(a), r * Math.sin(a)));
    }
    return new Polygon(vertices);
  }
  
  static circle(r: number = 1.0): Polygon {
    return Polygon.regular(16, r);
  }
}
