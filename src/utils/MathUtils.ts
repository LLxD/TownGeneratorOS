export class MathUtils {
  static gate(value: number, min: number, max: number): number {
    return value < min ? min : (value < max ? value : max);
  }
  
  static gatei(value: number, min: number, max: number): number {
    return Math.floor(MathUtils.gate(value, min, max));
  }
  
  static sign(value: number): number {
    return value === 0 ? 0 : (value < 0 ? -1 : 1);
  }
}
