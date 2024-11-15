import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { SystemException } from '../constants/app-constants';
import { LoadingOverlayService } from '../../shared/loading-overlay/loading-overlay.service';
import { SnackBar } from '../constants/snackbar-constans';

export class HandleErrorBase {
  constructor(
    private snackBar: MatSnackBar,
    private loadingOverlayService: LoadingOverlayService
  ) {}

  handleError(error: HttpErrorResponse) {
    const handleError = (error: HttpErrorResponse) => throwError(() => error);
    this.loadingOverlayService.setIsLoadingState(false);
    switch (error.status) {
      case HttpStatusCode.BadRequest:
        this.openSnackBar(
          error.error || error.message,
          SnackBar.PanelClass.Fail
        );
        return handleError(error);
      case HttpStatusCode.Unauthorized:
        if (
          error.error === SystemException.apiKeyIsNotProvided ||
          SystemException.apiKeyIsNotValid
        ) {
          this.openSnackBar(
            error.error || error.message,
            SnackBar.PanelClass.Fail
          );
        }
        return handleError(error);
      case HttpStatusCode.InternalServerError:
        this.openSnackBar(
          error.error || error.message,
          SnackBar.PanelClass.Fail
        );
        return handleError(error);
      case HttpStatusCode.NotFound:
        this.openSnackBar(
          error.error || error.message,
          SnackBar.PanelClass.Fail
        );
        return handleError(error);
      default:
        return handleError(error);
    }
  }

  private openSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, '', {
      horizontalPosition: SnackBar.Position.Horizontal.End,
      verticalPosition: SnackBar.Position.Vertical.Top,
      panelClass
    });
  }
}
