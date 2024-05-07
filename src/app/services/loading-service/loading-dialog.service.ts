import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingComponent } from './loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingDialogService {
  private opened = false;
  private dialogRef!: MatDialogRef<LoadingComponent>;

  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    if (!this.opened) {
      this.opened = true;
      this.dialogRef = this.dialog.open(LoadingComponent, {
        data: undefined,
        backdropClass: 'dialogBackgroundNormal',
        maxHeight: '100%',
        width: '400px',
        maxWidth: '100%',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'loading-dialog',
      });
      this.dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }

  hideDialog() {
    this.dialogRef.close();
  }
}
