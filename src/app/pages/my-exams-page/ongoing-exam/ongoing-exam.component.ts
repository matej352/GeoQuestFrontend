import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DeactivateComponent } from 'src/app/guards/leave-ongoing-exam.guard';
import { DialogOpenerService } from 'src/app/services/dialog-services/dialog-opener.service';

@Component({
  selector: 'app-ongoing-exam',
  templateUrl: './ongoing-exam.component.html',
  styleUrls: ['./ongoing-exam.component.scss'],
})
export class OngoingExamComponent
  implements OnInit, OnDestroy, DeactivateComponent
{
  remainingTime: number = 15 * 60; // 15 minutes in seconds
  formattedTime: string = '';

  timerInterval: any;
  testInProgress: boolean = true;

  constructor(private _dialog: DialogOpenerService) {}

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.formatTime();
      } else {
        this.submitTest();
      }
    }, 1000);
  }

  formatTime(): void {
    const minutes: number = Math.floor(this.remainingTime / 60);
    const seconds: number = this.remainingTime % 60;
    this.formattedTime = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler() {
    alert('By refreshing this page you may lost all data.');
  }

  canDeactivate(): boolean {
    if (
      confirm(
        'Napuštanjem ovog prozora Vaš ispit će se automatski predati sa trenutno popunjenim odgovorima'
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Method to handle test submission
  submitTest(): void {
    this.testInProgress = false;
    // Logic to submit the test
  }
}
