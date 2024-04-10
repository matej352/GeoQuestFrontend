export interface IOptionAnwser {
  properties: IProperty;
  type: string;
  coordinates: ICoordinate[];
}

interface ICoordinate {
  lat: number;
  lng: number[];
}

interface IProperty {
  name: string;
  description: string;
  isCorrect: boolean;
}
