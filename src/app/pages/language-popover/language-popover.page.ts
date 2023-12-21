import { Component, OnInit } from '@angular/core';
import { PreferencesService } from "./../../services/preferences.service";
import { Settings } from './../..//models/settings';
import { TranslateService } from '@ngx-translate/core';
import {ModalController} from '@ionic/angular';
@Component({
  selector: 'app-language-popover',
  templateUrl: './language-popover.page.html',
  styleUrls: ['./language-popover.page.scss'],
})
export class LanguagePopoverPage implements OnInit {
  flagselectedslrinput: string;
  flagselectedsltinput: string;
  flagselectedslroutput: string;
  flagselectedsltoutput: string;
  config: Settings = { version: '1.0', inputsl: 'BFI', inputtext: 'ENG', outputsl: 'BFI', outputtext: 'ENG', ttsengine: 'native', voiceengine: 'native', endpoint: 'https://api.dev.signon-project.eu/orchestrator',theme:'light' };

  constructor(private dataService: PreferencesService,  private translate: TranslateService,private modalController: ModalController) {
    //this.flagselectedslr = "../../assets/flags/en.png";
   // this.flagselectedslt = "../../assets/flags/de.png";
  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.loadSettings();
  };
  dismissModal() {
    this.modalController.dismiss();
  }
  loadFlag(){
    switch (this.config.inputsl) {
      case 'BFI':
        this.flagselectedsltinput = "../../assets/flags/en.png";
        break;
      case 'DSE':
        this.flagselectedsltinput = "../../assets/flags/nd.png";
        break;
      case 'VGT':
        this.flagselectedsltinput = "../../assets/flags/nd.png";
        break;
      case 'ISG':
        this.flagselectedsltinput = "../../assets/flags/ga.png";
        break;
      case 'SSP':
        this.flagselectedsltinput = "../../assets/flags/es.png";
        break;
      default:
        console.log('It\'s some other language.SLT input');
    }

    switch (this.config.outputsl) {
      case 'BFI':
        this.flagselectedsltoutput = "../../assets/flags/en.png";
        break;
      case 'DSE':
        this.flagselectedsltoutput = "../../assets/flags/nd.png";
        break;
      case 'VGT':
        this.flagselectedsltoutput = "../../assets/flags/nd.png";
        break;
      case 'ISG':
        this.flagselectedsltoutput = "../../assets/flags/ga.png";
        break;
      case 'SSP':
        this.flagselectedsltoutput = "../../assets/flags/es.png";
        break;
      default:
        console.log('It\'s some other language.SLT output');
    }
    switch (this.config.inputtext) {
      case 'DUT':
        this.flagselectedslrinput = "../../assets/flags/nd.png";
        break;
      case 'ENG':
        this.flagselectedslrinput = "../../assets/flags/en.png";
        break;
      case 'GLE':
        this.flagselectedslrinput = "../../assets/flags/ga.png";
        break;
      case 'SPA':
        this.flagselectedslrinput = "../../assets/flags/es.png";
        break;
      default:
        console.log('It\'s some other language.SLR input');
    }
    switch (this.config.outputtext) {
      case 'DUT':
        this.flagselectedslroutput = "../../assets/flags/nd.png";
        break;
      case 'ENG':
        this.flagselectedslroutput = "../../assets/flags/en.png";
        break;
      case 'GLE':
        this.flagselectedslroutput = "../../assets/flags/ga.png";
        break;
      case 'SPA':
        this.flagselectedslroutput = "../../assets/flags/es.png";
        break;
      default:
        console.log('It\'s some other language.SLR output');
    }

  }
  async loadSettings() {
    if (this.dataService.loaded) {
      this.config = this.dataService.getSettings();
      this.loadFlag();

    } else {
      this.dataService.load().then(() => {
        this.config = this.dataService.getSettings();
        this.loadFlag();
      });
    }
  }
}
