import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingOverlayService } from './loading-overlay.service';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent {
  public isLoading$: Observable<boolean> = this.spinnerService.isLoading$;

  constructor(private spinnerService: LoadingOverlayService) {}
}
