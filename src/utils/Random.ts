export class Random {
  private static readonly g = 48271.0;
  private static readonly n = 2147483647;
  
  private static seed = 1;
  
  static reset(seed: number = -1): void {
    Random.seed = seed !== -1 ? seed : Math.floor(Date.now() % Random.n);
  }
  
  static getSeed(): number {
    return Random.seed;
  }
  
  private static next(): number {
    return (Random.seed = Math.floor((Random.seed * Random.g) % Random.n));
  }
  
  static float(): number {
    return Random.next() / Random.n;
  }
  
  static normal(): number {
    return (Random.float() + Random.float() + Random.float()) / 3;
  }
  
  static int(min: number, max: number): number {
    return Math.floor(min + Random.next() / Random.n * (max - min));
  }
  
  static bool(chance: number = 0.5): boolean {
    return Random.float() < chance;
  }
  
  static fuzzy(f: number = 1.0): number {
    if (f === 0) {
      return 0.5;
    }
    return (1 - f) / 2 + f * Random.normal();
  }
}
