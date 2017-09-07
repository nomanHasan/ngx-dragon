import { ElementRef } from "@angular/core";

export class Rectangle {
    constructor(public uuid:string){
        
    }
    rect: {
        top: number;
        right: number;
        bottom: number;
        left: number;
        width: number;
        height: number;
    }
    elementRef: ElementRef
}