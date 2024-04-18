import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-leave-ongoing-exam-dialog',
  templateUrl: './confirm-leave-ongoing-exam-dialog.component.html',
  styleUrls: ['./confirm-leave-ongoing-exam-dialog.component.scss'],
})
export class ConfirmLeaveOngoingExamDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmLeaveOngoingExamDialogComponent>
  ) {}

  confirmClose(): void {
    this.dialogRef.close(true);
  }

  cancelClose(): void {
    this.dialogRef.close(false);
  }
}
