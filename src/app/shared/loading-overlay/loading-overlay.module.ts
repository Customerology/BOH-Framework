import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingOverlayComponent } from './loading-overlay.component';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [LoadingOverlayComponent],
  declarations: [LoadingOverlayComponent]
})
export class LoadingOverlayModule {}
