
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FuncsService {
  constructor() { }
  
  getEnumKeyByEnumValue<T extends {[index:string]:string}>(myEnum:T, enumValue:string):keyof T|null {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
}
 
}




