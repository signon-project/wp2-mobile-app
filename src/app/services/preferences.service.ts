import { Injectable } from '@angular/core';
import { Settings } from '../models/settings';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';


@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  config: Settings = { version: '1.0', inputsl: 'BFI', inputtext: 'ENG', outputsl: 'BFI', outputtext: 'ENG', ttsengine: 'native', voiceengine: 'native',endpoint:'https://api.dev.signon-project.eu/orchestrator',theme:'light' };
  public loaded: boolean = false;

  constructor(private nativeStorage: NativeStorage) { 
    this.load();
  }
  public saveSettings(data: Settings) {
    this.config = data;
    this.nativeStorage.setItem('settings', data)
      .then(
        () => console.log('Stored item!'),
        error => { console.error('Error storing item', error); }
      );
  }
  public getSettings(): Settings {
    return this.config;
  }
  load(): Promise<boolean> {

    return new Promise((resolve) => {
      if (this.loaded == false) {
        this.nativeStorage.getItem('settings').then((ret) => {
          if (ret != null) {
            try{
              debugger;
              let tmpret = ret;

              if (tmpret.version != null){
                this.config = ret;
                if(this.config.endpoint == null){
                  this.config.endpoint = 'https://api.dev.signon-project.eu/orchestrator';
                }
              } else{
                console.log('Error old settings');
                 this.saveSettings(this.config);
              }
              if(this.config.inputtext == 'NLD'){
                this.config.inputtext = 'DUT';
              }
              if(this.config.outputtext == 'NLD'){
                this.config.outputtext = 'DUT';
              }  
              if (tmpret.theme == null){
                this.config.theme = 'light';
                this.saveSettings(this.config);
              }
            }catch(e) {
              console.log('Error assigning');
              this.saveSettings(this.config);
            }


          } else {

          }

          this.loaded = true;
          resolve(true);

        }).catch(err => {
          console.error(err);
          resolve(false);
        });
      } else {
        resolve(true);
      }
    });

  }
}
