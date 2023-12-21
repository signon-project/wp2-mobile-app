import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';
  constructor(private translate: TranslateService) { }
  setInitialAppLanguage(){
    let language = this.translate.getBrowserLang();
    if((language == 'en')||(language =='ga')||(language == 'es')||(language == 'nl')){
        this.translate.use(language);
    }else{
      this.translate.use('en');
    }

  }
}
