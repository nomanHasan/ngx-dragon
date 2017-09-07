import { Directive, ElementRef, OnInit, HostListener, HostBinding, Input, Renderer2 } from '@angular/core';
import { Rectangle } from "./drag";
import { DragonService } from "./dragon.service";

@Directive({
  selector: '[hxDraggable]',
})
export class DraggableDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private dragService: DragonService,
    private renderer: Renderer2
  ) {
  }

  parentRect;
  boundingRect;

  droppedListener;

  mouse: any = {
    mouseDown: false,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0
  };


  @Input() mode;

  UUID;

  drag: Rectangle;

  ngOnInit(): void {

    this.setDrag()
    // console.log(this.drag)
    this.setDisplayBlock()
    // console.log(this.el.nativeElement)
    // console.log(this.el.nativeElement.parentElement)
    // console.log(this.el.nativeElement.innerHTML)
    this.setStyle()

    this.droppedListener = this.dragService.dropped$.subscribe(data => {
      let dataTransfer = JSON.parse(data.event.dataTransfer.getData('text/plain'))
      if (dataTransfer.uuid != this.drag.uuid) return;
      this.setPositionInDropzone(data.event, data.dropzone)
    })

    switch (this.mode) {
      case "absolute":
        this.position = "absolute"
        break;
      case "relative":
        this.position = "relative"
        break;
      default:
        this.position = "inherit"
    }

  }

  setDrag() {
    this.drag = new Rectangle(this.dragService.uuidv4())
    let rect = this.el.nativeElement.getBoundingClientRect()
    this.drag.rect = rect;
    this.drag.elementRef = this.el;
  }

  @HostBinding('attr.draggable') draggableFlag = true;

  @HostBinding('class.grabbed') isGrabbed = false;

  setRectangles() {
    this.setBoundingRect()
    this.setParentBoundingRect()
  }

  setBoundingRect() {
    this.boundingRect = this.el.nativeElement.getBoundingClientRect()
  }

  setParentBoundingRect() {
    this.parentRect = this.el.nativeElement.parentElement.getBoundingClientRect()
  }


  @HostBinding('style.position') position;

  @HostListener('mouseover', ['$event']) onMouseover(event) {
    this.setCursorMove()
  }

  setStyle() {
    this.el.nativeElement.style.border = "2px solid #9B0000"
  }

  @HostListener('dragstart', ['$event']) onDragStart(event) {

    // event.dataTransfer.setDragImage(new Image(100, 200), 0, 0)
    this.drag.rect = this.el.nativeElement.getBoundingClientRect()
    // console.log(this.drag)

    event.dataTransfer.setData('application/json', this.drag)
    console.log(event.dataTransfer.getData('application/json'))


    event.dataTransfer.setData('text/plain', JSON.stringify(this.drag))
    event.dataTransfer.effectAllowed = "move";
    // event.dataTransfer.dropEffect = "move";
    // event.preventDefault();
    console.log(event.dataTransfer)
    // this.el.nativeElement.style.position = "absolute"
    this.setDragStart()


    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    let rect = this.el.nativeElement.getBoundingClientRect();
    this.mouse.dx = this.mouse.x - rect.left
    this.mouse.dy = this.mouse.y - rect.top

    // this.stopPropagation(event)
  }

  @HostListener('drag', ['$event']) onMouseMove(event) {
    // console.log(this.mouse)
    if (this.mouse.mouseDown) {
      this.onDrag(event)
    }
    // this.stopPropagation(event)
  }

  onDrag(event) {
    this.setCursorMove()
    // console.log(this.mouse)

    // console.log(this.el.nativeElement.getBoundingClientRect())
    // this.setBoundingClientRect(event.clientY, null, null, event.clientX)
    // this.setPosition(event)
  }

  setDisplayBlock() {
    this.el.nativeElement.style.display = "inline-block"
    this.setRectangles()
  }

  @HostListener('dragend', ['$event']) dragEnd(event) {
    this.setDragEnd()
    // console.log('dragEnd')

    // console.log(this.el.nativeElement.getBoundingClientRect())
    // this.el.nativeElement.style.left = event.clientX + "px"
    // this.el.nativeElement.style.top = event.clientY + "px"

    // console.log(this.el.nativeElement.getBoundingClientRect())

    // this.setPosition(event)
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event) {
    this.setDragEnd()

    // console.log(this.el.nativeElement.getBoundingClientRect())
    // this.el.nativeElement.style.left = event.clientX + "px"
    // this.el.nativeElement.style.top = event.clientY + "px"

    // console.log(this.el.nativeElement.getBoundingClientRect())
    // this.setPosition(event)
  }

  hideElement() {
    this.el.nativeElement.style.opacity = "0.0"
  }

  showElement() {
    this.el.nativeElement.style.opacity = "1.0"
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event) {
    this.setDragEnd()
  }

  @HostListener('window:mouseup', ['$event']) windowMouseUp(event) {
    this.setDragEnd()
  }


  setDragStart() {
    this.isGrabbed = true;
    this.mouse.mouseDown = true
    this.setCursorMove()
  }

  setDragEnd() {
    this.isGrabbed = false;
    this.mouse.mouseDown = false;
    this.setCursorAuto()
  }

  setCursorMove() {

    this.el.nativeElement.style.cursor = "move"

  }
  setCursorAuto() {

    this.el.nativeElement.style.cursor = "auto"

  }


  setPositionInDropzone(event, dropzone) {
    let rect = this.getRect(event)
    let parentRect = dropzone.rect;

    if (this.mode == "absolute" && this.isInside(rect, parentRect)) {

      this.setBoundingClientRect(rect.top, null, null, rect.left)
      this.placeInsideDropzone(dropzone)

    }else if(this.mode == "relative"){
      // this.setBoundingClientRectRelative({top: rect.top, right: null, bottom: null, left: rect.left, width: rect.width, height: rect.height}, parentRect)
      this.placeInsideDropzone(dropzone)
    }
  }

  getRect(event) {

    let left = event.clientX - this.mouse.dx
    let top = event.clientY - this.mouse.dy
    return { top, right: left + this.boundingRect.width, bottom: top + this.boundingRect.height, left, width: this.boundingRect.width, height: this.boundingRect.height };

  }

  setPosition(event) {
    this.setRectangles()
    let left = event.clientX - this.mouse.dx
    let top = event.clientY - this.mouse.dy
    // console.log(this.el.nativeElement)
    // console.log(this.el.nativeElement.parentElement)
    let rect = { top, right: left + this.boundingRect.width, bottom: top + this.boundingRect.height, left };

    // // console.log(top + " " + left)
    // console.log(event)

    if (this.isInside(rect, this.parentRect)) {

      this.setBoundingClientRect(top, null, null, left)

    }
  }

  placeInsideDropzone(dropzone) {

    // console.log(this.drag.elementRef.nativeElement)

    // console.log(dropzone.elementRef.nativeElement)

    this.renderer.appendChild(dropzone.elementRef.nativeElement, this.drag.elementRef.nativeElement)

  }

  isInside(child, parent) {
    // console.log(child, parent)
    if ((child.top > parent.top) && (child.left > parent.left) && (child.bottom < parent.bottom) && (child.right < parent.right)) {

      // console.log("is Inisde")

      return true

    } else {

      // console.log("Isnt inside")
      // console.log((child.top > parent.top))
      // console.log((child.left > parent.left))
      // console.log((child.bottom < parent.bottom))
      // console.log((child.right < parent.right))

      return false
    }
  }

  setBoundingClientRect(top?, right?, bottom?, left?, width?, height?) {


    if (top) this.el.nativeElement.style.top = top + "px"

    if (right) this.el.nativeElement.style.right = right + "px"

    if (bottom) this.el.nativeElement.style.bottom = bottom + "px"

    if (left) this.el.nativeElement.style.left = left + "px"

    if (width) this.el.nativeElement.style.width = width + "px"

    if (height) this.el.nativeElement.style.height = height + "px"

  }

  setBoundingClientRectRelative(rect, parentRect) {



    let { top, right, bottom, left, width, height } = rect;

    console.log(rect)
    console.log(parentRect)


    if (top) {

      if(top < parentRect.top){
        top = parentRect.top
      }

      // this.renderer.setStyle(this.el.nativeElement, "top", top + "px");

      
      if (top) this.el.nativeElement.style.top = top + "px"

    }

    let r = this.el.nativeElement.getBoundingClientRect()
    console.log(r)

    if (right) {

      if(right > parentRect.right){
        right = parentRect.right
      }

      // this.renderer.setStyle(this.el.nativeElement, "right", right + "px");

      this.el.nativeElement.style.right = right + "px"
    }


    if (bottom) {

      if(bottom > parentRect.bottom){
        bottom = parentRect.bottom
      }

      this.renderer.setStyle(this.el.nativeElement, "bottom", bottom + "px");

    }


    if (left) {

      if(left < parentRect.left){
        left = parentRect.left
      }

      // this.renderer.setStyle(this.el.nativeElement, "left", left + "px");

      this.el.nativeElement.style.left = left + "px"

    }

    if (width) {

      if(width > parentRect.width){
        width = parentRect.width
      }

      this.renderer.setStyle(this.el.nativeElement, "width", width + "px");

    }


    if (height) {

      if(height > parentRect.height){
        height = parentRect.height
      }

      this.renderer.setStyle(this.el.nativeElement, "height", height + "px");

    }




    // if (top) this.el.nativeElement.style.top = top + "px"

    // if (right) this.el.nativeElement.style.right = right + "px"

    // if (bottom) this.el.nativeElement.style.bottom = bottom + "px"

    // if (left) this.el.nativeElement.style.left = left + "px"

    // if (width) this.el.nativeElement.style.width = width + "px"

    // if (height) this.el.nativeElement.style.height = height + "px"

  }


  @HostListener('dragenter', ['$event']) dragEnter(event) {
    // console.log('drag Enter')
    event.preventDefault()
    // console.log(event.target)
    // event.target = this.el.nativeElement.parentElement
  }

  @HostListener('dragover', ['$event']) dragOver(event) {
    event.preventDefault()
  }

  @HostListener('drop', ['$event']) onDrop(event) {
    event.preventDefault()
  }

  stopPropagation(event) {
    if (event.stopPropagation) {
      event.stopPropagation()
    }
    if (event.preventDefault) {
      event.preventDefault()
    }

    event.cancelBubble = true;
    event.returnValue = false


    event.stopPropagation()
  }



}
