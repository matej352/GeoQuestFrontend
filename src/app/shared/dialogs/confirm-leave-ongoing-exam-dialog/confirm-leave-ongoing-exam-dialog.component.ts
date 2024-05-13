import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-leave-ongoing-exam-dialog',
  templateUrl: './confirm-leave-ongoing-exam-dialog.component.html',
  styleUrls: ['./confirm-leave-ongoing-exam-dialog.component.scss'],
})
export class YesNoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<YesNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; description: string }
  ) {}

  confirmClose(): void {
    this.dialogRef.close(true);
  }

  cancelClose(): void {
    this.dialogRef.close(false);
  }
}
