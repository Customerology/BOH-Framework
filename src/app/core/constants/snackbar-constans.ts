import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';

export namespace SnackBar {
  export const Position = {
    Horizontal: {
      Start: <MatSnackBarHorizontalPosition>'start',
      Center: <MatSnackBarHorizontalPosition>'center',
      End: <MatSnackBarHorizontalPosition>'end',
      Left: <MatSnackBarHorizontalPosition>'left',
      Right: <MatSnackBarHorizontalPosition>'right'
    },
    Vertical: {
      Top: <MatSnackBarVerticalPosition>'top',
      Bottom: <MatSnackBarVerticalPosition>'bottom'
    }
  };

  export const PanelClass = {
    Success: 'snackbar-success',
    Fail: 'snackbar-fail',
    Warn: 'snackbar-warn'
  };
}
