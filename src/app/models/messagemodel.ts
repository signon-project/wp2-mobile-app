export class MessageModel {
    sourceKey: string;
    sourceText: string;
    sourceLanguage: string;
    sourceMode: string;
    sourceFileFormat: string;
    sourceVideoCodec: string;
    sourceVideoResolution:string;
    sourceVideoFrameRate:number;
    sourceVideoPixelFormat:string;
    sourceAudioCodec:string;
    sourceAudioChannels:string;
    sourceAudioSampleRate:number;
    translationLanguage :string;
    translationMode:string;
    appInstanceID: string;
    appVersion:string;
    T0App: number;
     GetFormattedDate(date) {
      var month = ("0" + (date.getMonth() + 1)).slice(-2);
      var day  = ("0" + (date.getDate())).slice(-2);
      var year = date.getFullYear();
      var hour =  ("0" + (date.getHours())).slice(-2);
      var min =  ("0" + (date.getMinutes())).slice(-2);
      var seg = ("0" + (date.getSeconds())).slice(-2);
     // var msec = date.getMilliseconds();
      return year + "-" + month + "-" + day + "T" + hour + ":" +  min + ":" + seg /*+ "," + msec*/;
  }
    constructor(identifier){
      this.sourceKey = "NONE";
      this.sourceLanguage = "ENG";
      this.sourceMode = "AUDIO";
      this.sourceFileFormat = "NONE";
      this.sourceVideoCodec = "NONE";  
      this.sourceVideoResolution = "NONE";  
      this.sourceVideoFrameRate = -1;
      this.sourceVideoPixelFormat =  "NONE";
      this.sourceAudioCodec = "NONE";
      this.sourceAudioChannels= "NONE";
      this.sourceAudioSampleRate = -1;
      this.translationLanguage = "ENG";
      this.translationMode =  "TEXT";
      var date = new Date();
      this.T0App =  Date.now(); //date.toString();;//this.GetFormattedDate(date);
      this.appInstanceID =  identifier;
      this.appVersion = "3.0.2";
    }
/*
Audio Channels1 Audio Bits Per Sample16 Audio Sample Rate44100
*/
public setVideoCodec(codec){
  this.sourceVideoCodec = codec;
}
public setVideoResolution(res){
  this.sourceVideoResolution = res;
}
public setVideoFrame(frame){
  this.sourceVideoFrameRate = frame;
}
public setVideoPixelFormat(pixel){
  this.sourceVideoPixelFormat = pixel;
}
    public setAudioChannel(channels){
      this.sourceAudioChannels = channels;
    }
    public setAudioSampleRate(rate){
      this.sourceAudioSampleRate = rate;
    }
    public setSourceText(sourceText){
      this.sourceText = sourceText;
    }
    public setSourceMode(sourceMode){
      this.sourceMode = sourceMode;
    }
    public setSourceLanguage(sourceLang){
      this.sourceLanguage = sourceLang;  
    }
    public setTargetMode(targeteMode){
      this.translationMode = targeteMode;
    }
    public setTargetLanguage(targetLanguage){
      this.translationLanguage = targetLanguage;  
    }
    public setSourceKey(sourceKey){
      this.sourceKey = sourceKey;  
    }
    public setSourceFileFormat(targetformat){
      let text = targetformat;
      let result = text.toUpperCase();
      this.sourceFileFormat = result;
    }
  }