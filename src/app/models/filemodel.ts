export class FileModel {
  public appInstanceID: string;
  public fileFormat:string;
    constructor(identifier,fileformat){

      this.appInstanceID =  identifier;
      this.fileFormat = fileformat;
    }

  }