import { Component, OnInit } from '@angular/core';
import { Settings } from '../models/settings';
import { ToastController } from '@ionic/angular';
import { PreferencesService } from "./../services/preferences.service"
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  config: Settings = { version: '1.0', inputsl: 'BFI', inputtext: 'ENG', outputsl: 'BFI', outputtext: 'ENG', ttsengine: 'native', voiceengine: 'native',endpoint:'https://api.signon-project.eu/orchestrator',theme:'light' };
  image: string;
  langinputsign: string = 'BFI';
  langoutputsign: string = 'BFI';
  langinputtxt: string = 'ENG';
  langoutputtxt: string = 'ENG';
  tts: string = 'native';
  voice: string = 'native';
  settings = false;
  serverdisp:any;
  endpoint:any;
  isDarkMode = false; // Initial value, assuming default is not dark mode


  constructor(private dataService: PreferencesService,
    private toastController: ToastController,
    private openNativeSettings: OpenNativeSettings,
    private translate: TranslateService) {
    this.image = "../../assets/signonbanner.png";
    this.langinputsign = this.langoutputsign = 'BFI';
    this.langinputtxt = this.langoutputtxt = 'ENG';
    this.serverdisp = false;
    this.endpoint = "https://api.signon-project.eu/orchestrator";
  
  }
  ngOnInit() {
    this.loadSettings();
  }
  onServe(){
    this.serverdisp = true;
  }
  loadSettings() {
    if (this.dataService.loaded) {
      this.config = this.dataService.getSettings();
    } else {
      this.dataService.load().then(() => {
        this.config = this.dataService.getSettings();
      });
    }
    this.langinputsign = this.config.inputsl;
    this.langinputtxt = this.config.inputtext;
    this.langoutputsign = this.config.outputsl;
    this.langoutputtxt = this.config.outputtext;
    this.tts = this.config.ttsengine;
    this.voice = this.config.voiceengine;
    this.endpoint = this.config.endpoint;
  }
  async onChangeInputSign($event) {

    if (this.settings == false) {
     // await this.presentSave();
      this.settings = true;
    }
    console.log($event.target.value);
  }
  async onChangeInputTxt($event) {

    if (this.settings == false) {
    //  await this.presentSave();
      this.settings = true;
    }
    console.log($event.target.value);
  }
  async onChangeOutputSign($event) {
    if (this.settings == false) {
     // await this.presentSave();
      this.settings = true;
    }
    console.log($event.target.value);
  }
  async onChangeOutputTxt($event) {
    if (this.settings == false) {
   //   await this.presentSave();
      this.settings = true;
    }
    console.log($event.target.value);
  }
  async radioGroupChange($event) {
   // if (this.settings == false) {
     // await this.presentSave();
      this.settings = true;
    //}
    console.log($event.target.value);
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }
  ionViewDidEnter() {
    this.serverdisp = false;
    this.loadSettings();
    if(this.config.theme == 'light'){
      this.isDarkMode = false; // Initial value, assuming default is not dark mode
      this.image = "../../assets/signonbanner.png";

    }else{
      this.isDarkMode = true; // Initial value, assuming default is not dark mode
      this.image = "../../assets/signonbannerdark.png";

    }
  }
  async ionViewWillLeave() {

    await this.save(false);
  }
  async presentSave() {
    const toast = await this.toastController.create({
      message: 'Your settings have changed. Please Save.',
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }
  async save(toastdisplay) {
    // alert('save');
    this.config.inputsl = this.langinputsign;
    this.config.inputtext = this.langinputtxt;
    this.config.outputsl = this.langoutputsign;
    this.config.outputtext = this.langoutputtxt;
    this.config.ttsengine = this.tts;
    this.config.voiceengine = this.voice;
    this.config.endpoint = this.endpoint;
    if(this.isDarkMode){
      this.config.theme = 'dark';
    }else{
      this.config.theme = 'light';
    }

    /* if(this.plt.is('ios')){
       this.config.speed = 1.5;
     }*/
    // alert(this.config.output);
    this.dataService.saveSettings(this.config);
    if(toastdisplay)
    await this.presentToast();
  }
  async onDisplay(setting){
    await this.openNativeSettings.open(setting);
  }
  onToggleColorScheme(event){
    debugger;
    if(event.detail.checked){
      document.body.setAttribute('color-theme','dark');
      this.isDarkMode = true;
      this.image = "../../assets/signonbannerdark.png";
    }else{
      document.body.setAttribute('color-theme','light');
      this.isDarkMode = false;
      this.image = "../../assets/signonbanner.png";

    }
  }
}

