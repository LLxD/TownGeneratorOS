export class Palette {
  paper: string;
  light: string;
  medium: string;
  dark: string;
  
  constructor(paper: number, light: number, medium: number, dark: number) {
    this.paper = this.intToHex(paper);
    this.light = this.intToHex(light);
    this.medium = this.intToHex(medium);
    this.dark = this.intToHex(dark);
  }
  
  private intToHex(color: number): string {
    return '#' + color.toString(16).padStart(6, '0');
  }
  
  static DEFAULT = new Palette(0xccc5b8, 0x99948a, 0x67635c, 0x1a1917);
  static BLUEPRINT = new Palette(0x455b8d, 0x7383aa, 0xa1abc6, 0xfcfbff);
  static BW = new Palette(0xffffff, 0xcccccc, 0x888888, 0x000000);
  static INK = new Palette(0xcccac2, 0x9a979b, 0x6c6974, 0x130f26);
  static NIGHT = new Palette(0x000000, 0x402306, 0x674b14, 0x99913d);
  static ANCIENT = new Palette(0xccc5a3, 0xa69974, 0x806f4d, 0x342414);
  static COLOUR = new Palette(0xfff2c8, 0xd6a36e, 0x869a81, 0x4c5950);
  static SIMPLE = new Palette(0xffffff, 0x000000, 0x000000, 0x000000);
}
