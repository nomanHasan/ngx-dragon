import { Injectable, EventEmitter } from '@angular/core';
import { Rectangle } from "./drag";

@Injectable()
export class DragonService {

  draggable: Rectangle;
  dropzone: Rectangle;

  public dropped$: EventEmitter<any>;

  constructor() {
    this.dropped$ = new EventEmitter<any>()
   }

   dropElement(event, dropzone){
     this.dropzone = dropzone;
    //  console.log('Droped Element')
    //  console.log(dropzone)
     this.dropped$.emit({event, dropzone});
   }

   public uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}
