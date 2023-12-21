import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Injectable({
  providedIn: 'root'
})
export class ThemesettingsService {

  private theme: BehaviorSubject<String>;

  constructor() {
     // alert('ThemesettingsService');
      this.theme = new BehaviorSubject('dark-theme');
  }

  setActiveTheme(val) {
      this.theme.next(val);
  }

  getActiveTheme() {
      return this.theme.asObservable();
  }
}
