import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { IAccount } from './models/account';
import { UserProfileStoreService } from './storage/user-profile-store.service';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'geo-quest';

  constructor() {}

  ngOnInit(): void {}
}
