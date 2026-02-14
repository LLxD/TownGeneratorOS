import { Point } from '../geom/Point';
import { Polygon } from '../geom/Polygon';
import { Random } from '../utils/Random';

export interface BuildingData {
  shape: Polygon;
  type: string;
}

export class SimpleModel {
  cityRadius: number;
  center: Point;
  buildings: BuildingData[];
  streets: Polygon[];
  seed: number;
  
  constructor(size: number = 15, seed: number = -1) {
    if (seed > 0) {
      Random.reset(seed);
    } else {
      Random.reset();
      seed = Random.getSeed();
    }
    
    this.seed = seed;
    this.cityRadius = size * 40;
    this.center = new Point(0, 0);
    this.buildings = [];
    this.streets = [];
    
    this.generate(size);
  }
  
  private generate(size: number): void {
    // Generate a simple grid-based city layout
    const blockSize = 60;
    const streetWidth = 10;
    const numBlocks = Math.floor(size / 2);
    
    // Generate streets
    for (let i = -numBlocks; i <= numBlocks; i++) {
      // Horizontal streets
      const y = i * (blockSize + streetWidth);
      if (Math.abs(y) < this.cityRadius) {
        const street = new Polygon([
          new Point(-this.cityRadius, y - streetWidth / 2),
          new Point(this.cityRadius, y - streetWidth / 2),
          new Point(this.cityRadius, y + streetWidth / 2),
          new Point(-this.cityRadius, y + streetWidth / 2)
        ]);
        this.streets.push(street);
      }
      
      // Vertical streets
      const x = i * (blockSize + streetWidth);
      if (Math.abs(x) < this.cityRadius) {
        const street = new Polygon([
          new Point(x - streetWidth / 2, -this.cityRadius),
          new Point(x + streetWidth / 2, -this.cityRadius),
          new Point(x + streetWidth / 2, this.cityRadius),
          new Point(x - streetWidth / 2, this.cityRadius)
        ]);
        this.streets.push(street);
      }
    }
    
    // Generate buildings in blocks
    for (let i = -numBlocks; i < numBlocks; i++) {
      for (let j = -numBlocks; j < numBlocks; j++) {
        const x = i * (blockSize + streetWidth) + streetWidth / 2;
        const y = j * (blockSize + streetWidth) + streetWidth / 2;
        
        if (Math.sqrt(x * x + y * y) < this.cityRadius - blockSize) {
          this.generateBlockBuildings(x, y, blockSize);
        }
      }
    }
  }
  
  private generateBlockBuildings(x: number, y: number, blockSize: number): void {
    const numBuildings = Random.int(2, 6);
    const buildingTypes = ['house', 'shop', 'tower', 'church'];
    
    if (numBuildings === 1) {
      // One large building
      const margin = Random.int(5, 10);
      const building = new Polygon([
        new Point(x + margin, y + margin),
        new Point(x + blockSize - margin, y + margin),
        new Point(x + blockSize - margin, y + blockSize - margin),
        new Point(x + margin, y + blockSize - margin)
      ]);
      this.buildings.push({
        shape: building,
        type: Random.bool(0.1) ? 'church' : 'house'
      });
    } else {
      // Multiple smaller buildings
      const cols = Math.ceil(Math.sqrt(numBuildings));
      const rows = Math.ceil(numBuildings / cols);
      const buildingW = blockSize / cols;
      const buildingH = blockSize / rows;
      
      for (let i = 0; i < numBuildings; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const margin = Random.int(3, 6);
        
        const bx = x + col * buildingW;
        const by = y + row * buildingH;
        
        const building = new Polygon([
          new Point(bx + margin, by + margin),
          new Point(bx + buildingW - margin, by + margin),
          new Point(bx + buildingW - margin, by + buildingH - margin),
          new Point(bx + margin, by + buildingH - margin)
        ]);
        
        this.buildings.push({
          shape: building,
          type: buildingTypes[Random.int(0, buildingTypes.length)]
        });
      }
    }
  }
}
