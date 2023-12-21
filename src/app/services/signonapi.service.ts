import { Injectable } from '@angular/core';
import { Http,HttpOptions,HttpParams,HttpUploadFileOptions } from '@capacitor-community/http';
import {catchError, finalize} from 'rxjs/operators';
import {Observable, throwError,from} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {FileModel} from '../models/filemodel'

@Injectable({
  providedIn: 'root'
})
export class SignonapiService {
 // host:string = 'https://api.dev.signon-project.eu/orchestrator/wp2/message';
 //host:string = 'https://api.dev.signon-project.eu/orchestrator/dev/message';
 host:string = 'https://api.dev.signon-project.eu/orchestrator/wp2/message';
 
  constructor(private readonly httpClient: HttpClient) { 

  }
  signOnPost(endpoint:string,datatosend){
    //let url = endpoint+ '/message';//this.host;
    debugger;
     let url = 'https://api.signon-project.eu/orchestrator/message';
    // let url = 'https://api.dev.signon-project.eu/orchestrator/wp2/message'
 
    const options:HttpOptions = {
      url,
      readTimeout:120000,
      headers: { 'Content-Type' : 'application/json; charset=utf-8' },
      data: datatosend,
    };
    return from(Http.post(options));
  }
  /*signOnGetStorageKey(endpoint:string,datatosend){
   // debugger;
  
   // let url = endpoint + '/inference-storage-auth';
   let url = 'https://api.signon-project.eu/orchestrator/inference-storage-auth';

      debugger;
     // let url = 'https://api.dev.signon-project.eu/orchestrator/wp2/inference-storage-auth'
      let d = JSON.stringify(datatosend);
      const options:HttpOptions = {
        readTimeout:120000,
        url,
        headers: {  'Content-Type' : 'application/json; charset=utf-8'},
        data:d
      };
    return from(Http.post(options));
  }*/
  
     signOnGetStorageKey(endpoint:string,datatosend:FileModel){
    let _appInstanceID=datatosend.appInstanceID;
    let _fileFormat=datatosend.fileFormat;
    let url = 'https://api.signon-project.eu/orchestrator/inference-storage-auth';
  const params:HttpParams ={
      appInstanceID: _appInstanceID, fileFormat: _fileFormat
    }

      // let url = 'https://api.dev.signon-project.eu/orchestrator/wp2/inference-storage-auth'
       let d = JSON.stringify(datatosend);
       const options:HttpOptions = {
         url,
         params:params
       };
     return from(Http.get(options));
   }

/*  const params:HttpParams ={
      voice: voicesource, output: "stream", text: outputtext, type: "mp3"
    }

    const options:HttpOptions = {
      url,
      responseType: 'arraybuffer' as const,
      headers: { 'Authorization' : 'Token ' + this.token},
      params : params
    };
    return from(Http.get(options));

    */

  signOnPutFile(urlpath,filename,file){
    const options:HttpOptions = {
      url:urlpath,
      headers: {  'Content-Type' : 'application/octet-stream'},
      data: file
    }
    return from(Http.put(options));
  }

  signOnPutFileAngular(url: string, blob: Blob){
    return from(this.httpClient.put(url, blob, {observe: 'response', responseType: 'text'}));

  }
}

