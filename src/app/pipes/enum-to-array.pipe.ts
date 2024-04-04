import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray',
})
export class EnumToArrayPipe implements PipeTransform {
  transform(data: any, keyAndValue?: boolean): any[] {
    if (keyAndValue) {
      return Object.keys(data)
        .filter((t) => isNaN(+t))
        .map((t) => [data[t], t]); //[data[t], t] for --> 1,First
    }
    return Object.keys(data)
      .filter((t) => isNaN(+t))
      .map((t) => [data[t]]); //[data[t]] for --> 1
  }
}
