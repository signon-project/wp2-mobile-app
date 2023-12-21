import { Component } from '@angular/core';
import { MessageModel } from '../models/messagemodel';
import { TranslateService } from '@ngx-translate/core';
import { PreferencesService } from "./../services/preferences.service"
import { Settings } from '../models/settings';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  config: Settings = { version: '1.0', inputsl: 'BFI', inputtext: 'ENG', outputsl: 'BFI', outputtext: 'ENG', ttsengine: 'native', voiceengine: 'native',endpoint:'https://api.signon-project.eu/orchestrator',theme:'light' };
  isDarkMode = false; // Initial value, assuming default is not dark mode
  image: string;
  version:string;
  constructor(private dataService: PreferencesService,
    private translate: TranslateService) {    
    this.image = "../../assets/signonbanner.png";
    let model = new MessageModel('version');
    this.version = model.appVersion;


  }
  ngOnInit() {
    this.loadSettings();
  }
  loadSettings() {
    if (this.dataService.loaded) {
      this.config = this.dataService.getSettings();
    } else {
      this.dataService.load().then(() => {
        this.config = this.dataService.getSettings();
      });
    }
  }
  ionViewDidEnter() {

    if(this.config.theme == 'light'){
         this.image = "../../assets/signonbanner.png";
         this.isDarkMode = false;

    }else{
       this.image = "../../assets/signonbannerdark.png";
       this.isDarkMode = true;

    }
  }
}
