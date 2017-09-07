import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragonService } from "./dragon.service";
import { DraggableDirective } from "./draggable.directive";
import { DropzoneDirective } from "./dropzone.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DraggableDirective,
    DropzoneDirective
  ],
  exports: [
    DraggableDirective,
    DropzoneDirective
  ]
})
export class DragonModule { 

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DragonModule,
      providers: [
        DragonService
      ]
    }
  }
}
