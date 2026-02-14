export class Point {
  x: number;
  y: number;
  
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  
  clone(): Point {
    return new Point(this.x, this.y);
  }
  
  set(p: Point): void {
    this.x = p.x;
    this.y = p.y;
  }
  
  setTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
  
  offset(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
  
  add(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }
  
  subtract(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y);
  }
  
  scale(s: number): Point {
    return new Point(this.x * s, this.y * s);
  }
  
  scaleEq(s: number): void {
    this.x *= s;
    this.y *= s;
  }
  
  addEq(p: Point): void {
    this.x += p.x;
    this.y += p.y;
  }
  
  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  normalize(): Point {
    const len = this.length;
    return len > 0 ? new Point(this.x / len, this.y / len) : new Point();
  }
  
  norm(len: number): Point {
    return this.normalize().scale(len);
  }
  
  dot(p: Point): number {
    return this.x * p.x + this.y * p.y;
  }
  
  rotate90(): Point {
    return new Point(-this.y, this.x);
  }
  
  static distance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export class Segment {
  start: Point;
  end: Point;
  
  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }
  
  get dx(): number {
    return this.end.x - this.start.x;
  }
  
  get dy(): number {
    return this.end.y - this.start.y;
  }
  
  get vector(): Point {
    return this.end.subtract(this.start);
  }
  
  get length(): number {
    return Point.distance(this.start, this.end);
  }
}
