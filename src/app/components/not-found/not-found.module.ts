import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [NotFoundRoutingModule, CommonModule],
  declarations: [NotFoundComponent]
})
export class NotFoundModule {}
