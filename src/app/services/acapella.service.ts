import { Injectable } from '@angular/core';
import { Http,HttpOptions,HttpParams } from '@capacitor-community/http';
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AcapellaService {
  /*
  Login:  https://www.acapela-cloud.com/login/
  email : signon@adaptcentre.ie
  password :  SEZD4DP41MWK45F2
  */
  token:string='';
  constructor() { }
  login( datatosend: any) {

    let url ='https://www.acapela-cloud.com/api/login/';
    const options:HttpOptions = {
      url,
      headers: { 'Content-Type' : 'application/json; charset=utf-8' },
      data: datatosend,
    };
    return from(Http.post(options));
  }
  setToken(token){
    this.token = token;
  }
  getAccount(){
    let url ='https://www.acapela-cloud.com/api/account/';
    const options:HttpOptions = {
      url,
      headers: { 'Authorization' : 'Token ' + this.token}
    };
    return from(Http.get(options));
  }
  textToSpeech(language:any,outputtext:any){
    let url ='https://www.acapela-cloud.com/api/command/';
    let voicesource = '';
    if(language == 'SPA'){
      voicesource = 'Maria22k_HQ';
    }else if(language == 'DUT'){
      voicesource = 'Femke22k_HQ';
    }else{
      voicesource = 'PeterHappy22k_HQ';
    }

    debugger;
    //'PeterHappy22k_HQ';
    //Femke22k_HQ
    //Maria22k_H
    /*
            splanguage = 'es-ES';
      }
      if(this.config.outputtext == 'NLD')
      {
        splanguage = 'nl-NL';
      }
      if(this.config.outputtext == 'GLE')
      {
        splanguage = 'ga-GA';
        */
       //alert(voicesource);
    const params:HttpParams ={
      voice: voicesource, output: "stream", text: outputtext, type: "mp3"
    }

    const options:HttpOptions = {
      url,
      responseType: 'arraybuffer' as const,
      headers: { 'Authorization' : 'Token ' + this.token},
      params : params
    };
    return from(Http.get(options));
  }
  /*
  get(serviceName: string, data: any) {

    const headers = new HttpHeaders({
      'Authorization': 'Token ' + data
    });

    const options = { headers: headers };
    const url = 'https://www.acapela-cloud.com/api/account/';//environment.apiUrl + serviceName;
    return this.http.get(url, options);
  }
  command(data: any, outputtext: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Token ' + data
    });
    // let params = {voice:"Alice22k_HQ",output:"stream",text:"hello",type:"mp3"};
    // const options = { headers: headers};
    // let datastring = JSON.stringify(params);
    // debugger;
    /// return this.http.post("https://www.acapela-cloud.com/api/command/", params, options );


    let params = { voice: "PeterHappy22k_HQ", output: "stream", text: outputtext, type: "mp3" }
    const options = {
      responseType: 'arraybuffer' as const,
      headers: headers, params: params
    };
    //   const options = {headers: headers,params:params};
    const url = "https://www.acapela-cloud.com/api/command/";
    return this.http.get(url, options);
  }
  */
}
