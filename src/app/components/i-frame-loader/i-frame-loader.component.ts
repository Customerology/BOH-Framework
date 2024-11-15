import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LoadingOverlayService } from '../../shared/loading-overlay/loading-overlay.service';

@Component({
  selector: 'app-i-frame-loader',
  templateUrl: './i-frame-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      iframe {
        border: 1px solid #dfdfdf;
      }
    `
  ]
})
export class IFrameLoaderComponent implements AfterViewInit {
  @Input() set activeUrl(data: SafeResourceUrl) {
    console.info('current iFrame URL:', data);
    this.activeUrlFinal = data;
  }

  public activeUrlFinal!: SafeResourceUrl;

  constructor(
    private elRef: ElementRef,
    private loadingOverlayService: LoadingOverlayService
  ) {}

  ngAfterViewInit(): void {
    this.loadingOverlayService.setIsLoadingState(true);
    this.elRef.nativeElement
      .querySelector('iframe')
      .addEventListener('load', this.onLoad.bind(this));
  }

  /**
   * A hook to detect i-frame route change
   * @private
   */
  private onLoad(): void {
    console.info('iframe loaded.');
    this.loadingOverlayService.setIsLoadingState(false);
  }
}
