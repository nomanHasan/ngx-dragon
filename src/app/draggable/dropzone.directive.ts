import { Directive, HostListener, ElementRef, HostBinding, OnInit, Renderer2 } from '@angular/core';
import { Rectangle } from "./drag";
import { DragonService } from "./dragon.service";

@Directive({
  selector: '[hxDropzone]'
})
export class DropzoneDirective implements OnInit{
  ngOnInit(): void {
    this.setDrop()
  }


  drop: Rectangle;

  setDrop(){
    this.drop = new Rectangle(this.dragService.uuidv4())
    let rect = this.el.nativeElement.getBoundingClientRect()
    this.drop.rect = rect;
    this.drop.elementRef = this.el;
  }

  @HostBinding('class.dragover') isDragOver = false;

  @HostBinding('style.border.color') style = "blue";
  

  constructor(private el: ElementRef,
    private dragService: DragonService,
    private renderer: Renderer2
  ) { }

  @HostListener('dragenter', ['$event']) dragEnter(event){
    // console.log('drag Enter')
    this.isDragOver = true;
    event.preventDefault()
  } 

  @HostListener('dragover', ['$event']) dragOver(event){

    // console.log('dragOver')
    this.isDragOver = true;
    event.dataTransfer.dropEffect = "move"
    event.preventDefault()
    // console.log(event.dataTransfer)
  }

  @HostListener('dragleave', ['$event']) dragExit(event){
    // console.log('dragexit')
    
    this.isDragOver = false;
  } 

  @HostListener('drop', ['$event']) onDrop(event){
    console.log('Dropped')
    console.log(event.dataTransfer.getData('application/json'))
    this.isDragOver = false;
    this.setDrop()

    this.dragService.dropElement(event, this.drop)
  }

}
