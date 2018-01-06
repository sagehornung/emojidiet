export class Meal {
  emotion: string;
  pleasure: string;
  freebie: string;
  created: Date;
  id: string;
  index: number;
  constructor(emotion: string, pleasure: string, freebie: string, id?: string, index?: number, created?: Date ) {
    this.emotion = emotion;
    this.pleasure = pleasure;
    this.freebie = freebie;
    this.created = created;
    this.id = id;
    this.index = index;
  }
}
