import { Component, ViewChild, OnInit, ElementRef,Renderer2 } from '@angular/core';
import { SpeechRecognition } from '@awesome-cordova-plugins/speech-recognition/ngx';
import { TextToSpeechAdvanced } from '@awesome-cordova-plugins/text-to-speech-advanced/ngx';
import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Device } from '@capacitor/device';
import { Keyboard } from '@capacitor/keyboard';
import { PreferencesService } from "./../services/preferences.service";
import { ChangeDetectorRef } from '@angular/core';
import { Settings } from '../models/settings';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@awesome-cordova-plugins/media-capture/ngx';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Platform, PopoverController ,ModalController} from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageModel } from '../models/messagemodel';
import { FileModel } from '../models/filemodel';
import { SignonapiService } from './../services/signonapi.service'
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { AlertController, LoadingController } from '@ionic/angular';
import { AcapellaService } from './../services/acapella.service';
import { ToastController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';


/* AVATAR JS -------------------------------------------------------------------*/
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import GUI from 'lil-gui';
import { CharacterController } from '../js/controllers/CharacterController.js';
import { TIMESLOT, sigmlStringToBML } from '../js/sigml/SigmlToBML.js';
import { LanguagePopoverPage } from '../pages/language-popover/language-popover.page';
// Correct negative blenshapes shader of ThreeJS
// Correct negative blenshapes shader of ThreeJS
THREE.ShaderChunk['morphnormal_vertex'] = "#ifdef USE_MORPHNORMALS\n	objectNormal *= morphTargetBaseInfluence;\n	#ifdef MORPHTARGETS_TEXTURE\n		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n	    objectNormal += getMorph( gl_VertexID, i, 1, 2 ) * morphTargetInfluences[ i ];\n		}\n	#else\n		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];\n		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];\n		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];\n		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];\n	#endif\n#endif";
THREE.ShaderChunk['morphtarget_pars_vertex'] = "#ifdef USE_MORPHTARGETS\n	uniform float morphTargetBaseInfluence;\n	#ifdef MORPHTARGETS_TEXTURE\n		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n		uniform sampler2DArray morphTargetsTexture;\n		uniform vec2 morphTargetsTextureSize;\n		vec3 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset, const in int stride ) {\n			float texelIndex = float( vertexIndex * stride + offset );\n			float y = floor( texelIndex / morphTargetsTextureSize.x );\n			float x = texelIndex - y * morphTargetsTextureSize.x;\n			vec3 morphUV = vec3( ( x + 0.5 ) / morphTargetsTextureSize.x, y / morphTargetsTextureSize.y, morphTargetIndex );\n			return texture( morphTargetsTexture, morphUV ).xyz;\n		}\n	#else\n		#ifndef USE_MORPHNORMALS\n			uniform float morphTargetInfluences[ 8 ];\n		#else\n			uniform float morphTargetInfluences[ 4 ];\n		#endif\n	#endif\n#endif";
THREE.ShaderChunk['morphtarget_vertex'] = "#ifdef USE_MORPHTARGETS\n	transformed *= morphTargetBaseInfluence;\n	#ifdef MORPHTARGETS_TEXTURE\n		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n			#ifndef USE_MORPHNORMALS\n				transformed += getMorph( gl_VertexID, i, 0, 1 ) * morphTargetInfluences[ i ];\n			#else\n				transformed += getMorph( gl_VertexID, i, 0, 2 ) * morphTargetInfluences[ i ];\n			#endif\n		}\n	#else\n		transformed += morphTarget0 * morphTargetInfluences[ 0 ];\n		transformed += morphTarget1 * morphTargetInfluences[ 1 ];\n		transformed += morphTarget2 * morphTargetInfluences[ 2 ];\n		transformed += morphTarget3 * morphTargetInfluences[ 3 ];\n		#ifndef USE_MORPHNORMALS\n			transformed += morphTarget4 * morphTargetInfluences[ 4 ];\n			transformed += morphTarget5 * morphTargetInfluences[ 5 ];\n			transformed += morphTarget6 * morphTargetInfluences[ 6 ];\n			transformed += morphTarget7 * morphTargetInfluences[ 7 ];\n		#endif\n	#endif\n#endif";
/* AVATAR JS --------------------------------------------------------------------*/
/* MEDIA FOLDERS JS -------------------------------------------------------------*/
const MEDIA_FOLDER_NAME = 'signOn';
const MEDIA_RECORDED_FILES = 'signOn';
/* MEDIA FOLDERS JS -------------------------------------------------------------*/

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  config: Settings = { version: '1.0', inputsl: 'BFI', inputtext: 'ENG', outputsl: 'BFI', outputtext: 'ENG', ttsengine: 'native', voiceengine: 'native',endpoint:'https://api.dev.signon-project.eu/orchestrator',theme:'light'  };
  currentselect: string = '';
  selectedVideo: string = '';
  selectedAudio: string = '';
  iconColor: string = 'primary';
  isRecording: boolean = false;
  isPlayingMessage: boolean = false;
  image: string;
  flagselectedslr:string;
  flagselectedslt:string;
  search: string;
  audiorecording: boolean = false;
  newMsg: string = '';
  matches: string[];
  mimeType = 'audio/aac';
  mimeTypemp3 = 'audio/mpeg';
  mimeTypewav = 'audio/wav';
  mimeTypem4a = 'audio/aac';
  fileextension = 'm4a';
  initialized: boolean = false;
  playavatar = false;
  contentFilename = '';
  contentFileformat = '';
  mimePlatformAudio = 'audio/mpeg';
  mimePlatformVideo = 'audio/mpeg';
  storedFileNames = [];
  mediaFiles = [];
  recordedFiles = [];
  messages = [];
  duration = 0;
  glosstext = '';
  glossJson:any;
  dataDirectory: string;
  action: boolean = false;
  isDarkMode = false; // Initial value, assuming default is not dark mode
  sendfile: boolean = false;
  placeholdertxt = '';
  segmenthaschanged = false;
  audiovalid = true;
  direxists:boolean = false;
  avatarload:boolean = false;
  continueAnimating:boolean = true;
  outputsource: string;
  buttonsource:string = "TEXT";
  flagselectedslrinput: string;
  flagselectedsltinput: string;
  flagselectedslroutput: string;
  flagselectedsltoutput: string;
   myCustomIcon = "../../assets/flags/en.png";
  unknownurl: string = 'https://novastorage.blob.core.windows.net/signon/unknown.mp4';

  hardcodeSign = [
    { signLanguage: "BFI", index: 1, url: "https://novastorage.blob.core.windows.net/signon/BSL1.mp4" },
    { signLanguage: "DSE", index: 1, url: "https://novastorage.blob.core.windows.net/signon/NGT1.mp4" },
    { signLanguage: "VGT", index: 1, url: "https://novastorage.blob.core.windows.net/signon/VGT1.mp4" },
    { signLanguage: "ISG", index: 1, url: "https://novastorage.blob.core.windows.net/signon/ISL1.mp4" },
    { signLanguage: "SSP", index: 1, url: "https://novastorage.blob.core.windows.net/signon/LSE1.mp4" },
    { signLanguage: "BFI", index: 2, url: "https://novastorage.blob.core.windows.net/signon/BSL2.mp4" },
    { signLanguage: "DSE", index: 2, url: "https://novastorage.blob.core.windows.net/signon/NGT2.mp4" },
    { signLanguage: "VGT", index: 2, url: "https://novastorage.blob.core.windows.net/signon/VGT2.mp4" },
    { signLanguage: "ISG", index: 2, url: "https://novastorage.blob.core.windows.net/signon/ISL2.mp4" },
    { signLanguage: "SSP", index: 2, url: "https://novastorage.blob.core.windows.net/signon//LSE2.mp4" }
  ];
  /* AVATAR VARIABLES -------------------------------------------------------------------*/
  private avatarElement: any;
  private loaderGLB: any;
  private clock: any;
  private scene: any;
  private renderer: any;
  private camera: any;
  private controls: any;
  private languageDictionaries: any; // key = NGT, value = { glosses: {}, word2ARPA: {} }
  private selectedLanguage: any;
  private eyesTarget: any;
  private headTarget: any;
  private neckTarget: any;
  public glossDictionary: any;
  public PHONETICS: any = {};
  public avatarModel: any;
  private ECAcontroller: any;
  private loadingAvatar :any;
  private presentloading:any;
  private fps: any;
  /* AVATAR VARIABLES -------------------------------------------------------------------*/
  /**
   * @brief DOM component to reference and interact with.
   */
  @ViewChild('myaudio', { static: false }) myAudio: ElementRef;
  @ViewChild('myvideo', { static: false }) myVideo: ElementRef;
  @ViewChild('offScreenFocusElement', { read: ElementRef }) offScreenFocusElement: ElementRef;
  @ViewChild('myinput', { read: ElementRef }) myInput!: ElementRef;
  @ViewChild('myitem', { read: ElementRef }) myItem!: ElementRef;

  @ViewChild('renderContainer') canvasEl: ElementRef;
  constructor(
    private vibration: Vibration,
    private toastController: ToastController,
    private accapela: AcapellaService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private signOnService: SignonapiService,
    private plt: Platform,
    private nativeStorage: NativeStorage,
    private file: File,
    private mediaCapture: MediaCapture,
    private media: Media,
    private dataService: PreferencesService,
    private speechRecognition: SpeechRecognition,
    private tts: TextToSpeechAdvanced,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private languageService:LanguageService,
    private popoverCtrl:PopoverController,
    private modalController: ModalController,
    private renderdom: Renderer2, private elementRef: ElementRef) {

    this.image = "../../assets/signonbanner.png";
    this.search = "../../assets/SignOn_Favicon_250x250px.png";
    this.outputsource = "TEXT";
    this.action = false;
  

    this.speechRecognition.requestPermission()
      .then(
        () => console.log('Granted'),
        () => console.log('Denied'));
    this.file.checkDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(() => { 
      console.log('Directory exists'); 
      this.direxists = true }).catch(err => {
      console.log('Directory doesn\'t exist')
      this.direxists = false;
      Filesystem.mkdir({
        directory: Directory.Data,
        path: MEDIA_FOLDER_NAME
      }).then(() => console.log('created directory !!!!!!!!!!!!!!!!!'), (err) => console.log(err));
    });
   /* AVATAR VARIABLES INIT -------------------------------------------------------------------*/
   this.clock = new THREE.Clock();
   this.loaderGLB = new GLTFLoader();
   this.scene = null;
   this.renderer = null;
   this.camera = null;
   this.controls = null;

   this.eyesTarget = null;
   this.headTarget = null;
   this.neckTarget = null;
   this.languageDictionaries = {}; // key = NGT, value = { glosses: {}, word2ARPA: {} }
   this.selectedLanguage = "NGT";

   // current model selected
   this.avatarModel = null;
   this.ECAcontroller = null;
   /* AVATAR VARIABLES INIT -------------------------------------------------------------------*/

    this.languageService.setInitialAppLanguage();
  }
  /**
  * @brief initializeAvatar
  *      Initialize the three.js avatar and load the glb file
  *      
  */

 /* ngAfterViewInit() {
    console.log('ngAfterViewInit: myinput', this.myInput);
    this.adjustTextareaHeight();
  }
  // Function to adjust the height of the textarea inside the ion-input
  adjustTextareaHeight() {
    console.log('adjustTextareaHeight: myinput', this.myInput);

    const textarea = this.myInput.nativeElement.querySelector('textarea');
    debugger;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }*/
  deleteMessage(){
   // this.newMsg = '';
   setTimeout(() => {
    this.newMsg = '';
    this.messages = [];

   // const buttonElement = this.offScreenFocusElement.nativeElement;
   // buttonElement.focus(); // Programmatically trigger the click event

  }, 50); // Adjust the delay as needed
   // this.messages = [];
   // this.newMsg = '';
   // this.cd.detectChanges();
   /* debugger;
    Keyboard.hide();

    if (this.myInput) {
      this.myInput.nativeElement.blur();
    }*/

  }
  onInputBlur() {
    debugger;
    if (this.newMsg === '') {
      Keyboard.hide();
    }
  }
  async openLanguagePopover(ev){
      const popover = await this.popoverCtrl.create({
        component:LanguagePopoverPage,
        event:ev
      });
      await popover.present();
  }
/* AVATAR Methods -------------------------------------------------------------------------------*/
  async initializeAvatar() {
    // load phonetics dictionaries
    let loadingmsg =await this.translate.get('app.loadingavatar').toPromise();
    this.avatarElement = this.canvasEl.nativeElement;
    this.loadingAvatar = await this.loadingController.create({ message: loadingmsg });
    this.continueAnimating = true;
    this.presentloading = true;
    await this.loadingAvatar.present();

    this.loadLanguageDictionaries("NGT");
    // Init the ThreeJS scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    const cardElement = document.getElementById('myCard');
    // Retrieve the innerWidth and innerHeight of the card
    const cardWidth = cardElement.offsetWidth;
    let cardHeight = cardElement.offsetHeight;
    // cardHeight = cardHeight - (cardHeight * 0.40);
    console.log('Card width ' + cardWidth);
    console.log('Card cardHeight ' + cardHeight);
    console.log('window width ' + window.innerWidth);
    console.log('window height ' + window.innerHeight);
    this.renderer.setSize(cardWidth, cardHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.gammaInput = true; // applies degamma to textures ( not applied to material.color and roughness, metalnes, etc. Only to colour textures )
    this.renderer.gammaOutput = true; // applies gamma after all lighting operations ( which are done in linear space )
    this.renderer.shadowMap.enabled = false;

    this.avatarElement.appendChild(this.renderer.domElement);

    // camera
    this.camera = new THREE.PerspectiveCamera(60, cardWidth / cardHeight, 0.01, 1000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.object.position.set(0.0, 1.5, 1.2);
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 7;
    this.controls.target.set(0.0, 1.3, 0);
    this.controls.update();

    // include lights
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
    this.scene.add(hemiLight);

    let keySpotlight = new THREE.SpotLight(0xffffff, 0.4, 0, 45 * (Math.PI / 180), 0.5, 1);
    keySpotlight.position.set(0.5, 2, 2);
    keySpotlight.target.position.set(0, 1, 0);
    // keySpotlight.castShadow = true;
    // keySpotlight.shadow.mapSize.width = 1024;
    // keySpotlight.shadow.mapSize.height = 1024;
    // keySpotlight.shadow.bias = 0.00001;
    this.scene.add(keySpotlight.target);
    this.scene.add(keySpotlight);



    let fillSpotlight = new THREE.SpotLight(0xffffff, 0.2, 0, 45 * (Math.PI / 180), 0.5, 1);
    fillSpotlight.position.set(-0.5, 2, 1.5);
    fillSpotlight.target.position.set(0, 1, 0);
    // fillSpotlight.castShadow = true;
    this.scene.add(fillSpotlight.target);
    this.scene.add(fillSpotlight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 0.2);
    dirLight.position.set(1.5, 5, 2);
    // dirLight.shadow.mapSize.width = 1024;
    // dirLight.shadow.mapSize.height = 1024;
    // dirLight.shadow.camera.left= -1;
    // dirLight.shadow.camera.right= 1;
    // dirLight.shadow.camera.bottom= -1;
    // dirLight.shadow.camera.top= 1;
    // dirLight.shadow.bias = 0.00001;
    // dirLight.castShadow = true;
    this.scene.add(dirLight);

    // add entities
    let ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x141414, depthWrite: true, roughness: 1, metalness: 0 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    let backPlane = new THREE.Mesh(new THREE.PlaneGeometry(7, 6), new THREE.MeshStandardMaterial({ color: 0x141455, side: THREE.DoubleSide, roughness: 1, metalness: 0 }));
    backPlane.name = 'Chroma';
    backPlane.position.z = -1;
    backPlane.receiveShadow = true;
    this.scene.add(backPlane);

    // so the screen is not black while loading
    this.renderer.render(this.scene, this.camera);

    // Behaviour Planner
    // Behaviour Planner
    this.eyesTarget = new THREE.Object3D(); //THREE.Mesh( new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshPhongMaterial({ color: 0xffff00 , depthWrite: false }) );
    this.eyesTarget.name = "eyesTarget";
    this.eyesTarget.position.set(0, 2.5, 15);
    this.headTarget = new THREE.Object3D(); //THREE.Mesh( new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshPhongMaterial({ color: 0xff0000 , depthWrite: false }) );
    this.headTarget.name = "headTarget";
    this.headTarget.position.set(0, 2.5, 15);
    this.neckTarget = new THREE.Object3D(); //THREE.Mesh( new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshPhongMaterial({ color: 0x00fff0 , depthWrite: false }) );
    this.neckTarget.name = "neckTarget";
    this.neckTarget.position.set(0, 2.5, 15);

    this.scene.add(this.eyesTarget);
    this.scene.add(this.headTarget);
    this.scene.add(this.neckTarget);

    // Loads the virtual avatar
    this.loaderGLB.load('../assets/avatar/EvaHandsEyesFixed.glb', (glb) => {

      let model = this.avatarModel = glb.scene;
      model.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
      model.castShadow = true;

      model.traverse((object) => {
        if (object.isMesh || object.isSkinnedMesh) {
          object.material.side = THREE.FrontSide;
          object.frustumCulled = false;
          object.castShadow = true;
          object.receiveShadow = true;
          if (object.name == "Eyelashes")
            object.castShadow = false;
          if (object.material.map)
            object.material.map.anisotropy = 16;
        } else if (object.isBone) {
          object.scale.set(1.0, 1.0, 1.0);
        }
      });

      this.scene.add(model);

      model.eyesTarget = this.eyesTarget;
      model.headTarget = this.headTarget;
      model.neckTarget = this.neckTarget;

      let ECAcontroller = this.ECAcontroller = new CharacterController({ character: model });
      ECAcontroller.start();
      ECAcontroller.reset();
      ECAcontroller.processMsg(JSON.stringify({ control: 2 })); // speaking

      this.animate();
    });
    //window.addEventListener('resize', this.onWindowResize.bind(this));

  }
  onWindowResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {

    requestAnimationFrame( this.animate.bind(this) );

    if ( this.continueAnimating ) {
        let delta = this.clock.getDelta();
        let et = this.clock.getElapsedTime();

        this.fps = Math.floor( 1.0 / ((delta>0)?delta:1000000) );
        if ( this.ECAcontroller ){ this.ECAcontroller.update(delta, et); }

        this.renderer.render( this.scene, this.camera );
    }
    if(this.presentloading){
      this.presentloading = false;
      this.loadingAvatar.dismiss();
    }
   
    console.log('animate');
   
  }
  public async startPlayingAvatar(){
      this.glosstext = '';
      if(this.playavatar == false){
      this.playavatar = true;
      await this.processMessage(this.glossJson);
      this.playavatar = false;
      }
  }
  public async processMessage(data) {

    // check there is a gloss to file dictionary
    debugger;
    if (!this.languageDictionaries[this.selectedLanguage] || !this.languageDictionaries[this.selectedLanguage].glosses) { return; }

    let glosses = [];
    // received data is a json in string format
    try {
      let json = data;
      if (typeof (data) == "string") { json = JSON.parse(data); }

      //let intermediateRepresentation = json.IntermediateRepresentation;
      let intermediateRepresentation = json;
      this.glossJson = data;
      if (typeof (intermediateRepresentation) == "string") { intermediateRepresentation = JSON.parse(json.IntermediateRepresentation); }
      glosses = intermediateRepresentation.glosses;
    } catch (error) {
      glosses = [];
    }

    // check whether there is something to do
    if (!glosses || glosses.length < 1) {
      // TODO DEFAULT SKIPPING SIGN MESSAGE
      return;
    }

    for(let j = 0; j < glosses.length;j++ ){
      this.glosstext += glosses[j] + ' ';
    }
    // for each gloss, fetch its sigml file, convert it into bml
    let orders = [];
    let time = 0;
    let glossesDictionary = this.languageDictionaries[this.selectedLanguage].glosses;
    for (let i = 0; i < glosses.length; ++i) {
      let glossFile = glossesDictionary[glosses[i]];
      if (!glossFile) {
        // TODO DEFAULT SKIPPING SIGN MESSAGE
        time += 3; continue;
      }

      await fetch("../assets/avatar/dictionaries/NGT/Glosses/" + glossFile).then(x => x.text()).then((text) => {
        let extension = glossFile.split(".");
        extension = extension[extension.length - 1];
        if (extension == "bml") {
          try {
            let result = JSON.parse(text);
            let maxDuration = 0;
            for (let b = 0; b < result.length; ++b) {
              let bml = result[b];
              if (!isNaN(bml.start)) { bml.start += time; }
              if (!isNaN(bml.ready)) { bml.ready += time; }
              if (!isNaN(bml.attackPeak)) { bml.attackPeak += time; }
              if (!isNaN(bml.relax)) { bml.relax += time; }
              if (!isNaN(bml.end)) {
                if (maxDuration < bml.end) { maxDuration = bml.end; }
                bml.end += time;
              }
            }
            orders = orders.concat(result);
            time += maxDuration;
          } catch (e) { console.log("bml parse error in file: " + glossFile); }
        } else {
          let result = sigmlStringToBML(text, time);
          orders = orders.concat(result.data);
          time += result.duration;
          if (i < (glosses.length - 1)) {
            time = time - TIMESLOT.DEF - 0.5 * TIMESLOT.DEF; // if not last, remove relax-end stage and partially remove the peak-relax (*1.85 )
          }
        }

      }).catch(e => { console.log("failed at loading dictionary file: " + glossFile) });
    }
    // give the orders to the avatar controller 
    let msg = {
      type: "behaviours",
      data: orders
    };
    this.ECAcontroller.processMsg(JSON.stringify(msg));

  }


  // loads dictionary for mouthing purposes. Not synchronous.
  public loadMouthingDictinoary(language) {
    let that = this;

    fetch("../assets/avatar/dictionaries/" + language + "/IPA/ipa.txt").then(x => x.text()).then(function (text) {

      let texts = text.split("\n");
      let IPADict = {}; // keys: plain text word,   value: ipa transcription
      let ARPADict = {}; // keys: plain text word,   value: arpabet transcription

      //https://www.researchgate.net/figure/1-Phonetic-Alphabet-for-IPA-and-ARPAbet-symbols_tbl1_2865098                
      let ipaToArpa = {
        // symbols
        "'": "", // primary stress
        '.': " ", // syllable break

        // vowels
        'a': "a", 'ɑ': "a", 'ɒ': "a",
        'œ': "@", 'ɛ': "E", 'ɔ': "c",
        'e': "e", 'ø': "e", 'ə': "x", 'o': "o",
        'ɪ': "I", 'i': "i", 'y': "i", 'u': "u", 'ʉ': "u",

        // consonants
        'x': "k", 'j': "y", 't': "t", 'p': "p", 'l': "l", 'ŋ': "G",
        'k': "k", 'b': "b", 's': "s", 'ʒ': "Z", 'm': "m", 'n': "n",
        'v': "v", 'r': "r", 'ɣ': "g", 'f': "f", 'ʋ': "v", 'z': "z",
        'h': "h", 'd': "d", 'ɡ': "g", 'ʃ': "S", 'ʤ': "J"
      };
      let errorPhonemes = {};


      for (let i = 0; i < texts.length; ++i) {
        let a = texts[i].replace("\t", "").split("\/");
        if (a.length < 2 || a[0].length == 0 || a[1].length == 0) { continue; }

        IPADict[a[0]] = a[1];

        let ipa = a[1];
        let arpa = "";

        // convert each IPA character into correpsonding ARPABet
        for (let j = 0; j < ipa.length; ++j) {
          if (ipa[j] == 'ː' || ipa[j] == ":") { arpa += arpa[arpa.length - 1]; continue; }
          let s = ipaToArpa[ipa[j]];
          if (s != undefined) { arpa += s; continue; }
          errorPhonemes[s];
        }

        ARPADict[a[0]] = arpa;

      }

      if (Object.keys(errorPhonemes).length > 0) { console.error("MOUTHING: loading phonetics: unmapped IPA phonemes to ARPABET: \n", errorPhonemes); }

      that.languageDictionaries[language].word2ARPA = ARPADict;

    });
  }

  // convert plain text into phoneme encoding ARPABet-1-letter. Uses dictionaries previously loaded 
  public wordsToArpa(phrase, language = "NGT") {

    if (!this.languageDictionaries[language] || !this.languageDictionaries[language].word2ARPA) {
      console.warn("missing word-ARPABET dictionary for " + language);
      return "";
    }
    let word2ARPA = this.languageDictionaries[language].word2ARPA;
    let words = [];
    words = phrase.replace(",", "").replace(".", "").split(" ");

    let result = "";
    let unmappedWords = [];
    for (let i = 0; i < words.length; ++i) {
      let r = word2ARPA[words[i]];
      if (r) { result += " " + r; }
      else { unmappedWords.push(words[i]); }
    }
    if (unmappedWords.length > 0) { console.error("MOUTHING: phrase: ", phrase, "\nUnknown words: ", JSON.stringify(unmappedWords)); }
    return result;

  }

  public loadLanguageDictionaries(language) {
    this.languageDictionaries[language] = { glosses: null, wordsToArpa: null };
    debugger;
    this.loadMouthingDictinoary(language);

    fetch("../assets/avatar/dictionaries/" + language + "/Glosses/_glossesDictionary.txt").then((x) => x.text()).then((file) => {
      debugger;
      let glossesDictionary = this.languageDictionaries[language].glosses = {};
      let lines = file.split("\n");
      for (let i = 0; i < lines.length; ++i) {
        if (!lines[i] || lines[i].length < 1) { continue; }
        let map = lines[i].split("\t");
        if (map.length < 2) { continue; }
        glossesDictionary[map[0]] = map[1].replace("\r", "").replace("\n", "");
      }
    });

  }
  loadFlag(){
   // alert('loadflag');
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
/* AVATAR Methods -------------------------------------------------------------------------------*/
  ionViewDidEnter() {
    debugger;
    this.loadSettings();
    if (!this.initialized) {


    }
  if(this.config.theme =='dark'){
    document.body.setAttribute('color-theme','dark');
    this.image = "../../assets/signonbannerdark.png";
    this.isDarkMode = true;
  }else{
    document.body.setAttribute('color-theme','light');
    this.image = "../../assets/signonbanner.png";
    this.isDarkMode = false;
  }
  this.loadFlag();
    //document.body.setAttribute('color-theme','dark');
  };
  clearResourcse(){
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.controls = null;
 
    this.eyesTarget = null;
    this.headTarget = null;
    this.neckTarget = null;
    this.languageDictionaries = {}; // key = NGT, value = { glosses: {}, word2ARPA: {} }
    this.selectedLanguage = "NGT";
 
    // current model selected
    this.avatarModel = null;
    this.ECAcontroller = null;
  }
  ionViewWillLeave() {
    // alert('leave')
    console.log('ionViewWillLeave');
    this.glosstext = '';
    this.selectedAudio = '';
    this.selectedVideo = '';
    this.currentselect = '';
    this.buttonsource = 'TEXT';
    this.continueAnimating = false;
    //this.clearResourcse();

   
   }
  isIOSPlatform() {
    let ret = false;
    if (this.plt.is('ios')) {
      ret = true;
    } else if (this.plt.is('android')) {
      ret = false;
    }
    return ret;
  }
  ngOnInit() {
  
    this.loadSettings();
    this.dataDirectory = Directory.Data + '/';
    console.log(this.dataDirectory);

    if (this.config.voiceengine != 'native') {
      VoiceRecorder.requestAudioRecordingPermission();
    }
    this.plt.ready().then(() => {
      // this.deleteMediaFiles();
      let path = this.file.dataDirectory;
      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
        () => {
          this.deleteFiles();


        },
        err => {
          this.file.createDir(path, MEDIA_FOLDER_NAME, false);
        }
      );
    });
    let credentials = { email: 'signon@adaptcentre.ie', password: 'SEZD4DP41MWK45F2' };

    this.accapela.login(credentials).subscribe((res: any) => {
      //  //debugger;
      //var jsonResp = JSON.parse(res.data);
      this.accapela.setToken(res.data.token);
      this.accapela.getAccount().subscribe((res: any) => {
        //debugger;
      }, error => {

        console.log('error: ', error);
      });

    }, error => {

      console.log('error: ', error);
    });

    // this.loadfiles();
  }

  async deleteFiles() {

    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        this.mediaFiles = res;
        for (const file of this.mediaFiles) {
          //    alert('deleteFile');
          this.selectedAudio = '';
          this.selectedVideo = '';
          this.currentselect = '';
          this.deleteFile(file,false);
        }
        this.loadFiles();
        //this.deletefiles();
      },
      err => console.log('error loading files: ', err)
    );
  }
  async loadFiles() {
    console.log(' loading files: ');
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        console.log(' loading files: Result ');
        this.mediaFiles = res;
        console.log(' loading files: Result ... ' + res);
        //this.deletefiles();
      },
      err => console.log('error loading files: ', err)
    )
  }

  async selectFile(myFile) {
    //debugger;
    this.currentselect = myFile.name;
    let iospath = MEDIA_FOLDER_NAME + '/' + myFile.name;
    var from_uri;
    console.log(JSON.stringify(myFile));
    if (this.isIOSPlatform()) {
      from_uri = await Filesystem.getUri({
        directory: Directory.Data,
        path: iospath
      });
    }
    let that = this;
    //    if (this.action == false) {
    setTimeout(function () {
      //  alert(that.action);
      if (that.action == false) {
        if ((myFile.name.indexOf('.mp4') > -1) || (myFile.name.indexOf('.MOV') > -1)) {
          let convertFileSrc = Capacitor.convertFileSrc(myFile.nativeURL);
          that.selectedVideo = myFile.name;
          that.selectedAudio = '';
          let video = that.myVideo.nativeElement;

          video.src = convertFileSrc;


        } else {
          that.selectedVideo = '';

          let convertFileSrc = Capacitor.convertFileSrc(myFile.nativeURL);
          console.log(convertFileSrc);
          that.selectedAudio = myFile.name;
          let audio = that.myAudio.nativeElement;

          audio.src = convertFileSrc;


        }
      } else {
        that.action = false;
      }

    }, 100);


  }


  calculateDuration() {

    if (!this.audiorecording) {
      this.duration = 0;
      return;
    }
    this.duration += 1;

    setTimeout(() => {
      this.calculateDuration();
    }, 1000);
  }
  async loadfilesselect() {
    console.log("loadfilesselect");
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result => {
      this.storedFileNames = [];
      result.files.forEach(element => {
        if (element.endsWith('m4a')) {
          if (this.currentselect === '') {
            this.currentselect = element;
            this.selectedAudio = element;
          }

          this.storedFileNames.push(element);
        }
        if (element.endsWith('mov')) {
          if (this.currentselect === '') {
            this.currentselect = element;
            this.selectedVideo = element;
          }

          this.storedFileNames.push(element);
        }
      });
    })
  }

  async presentAlert(headerst: string, error: string) {
    const alert = await this.alertController.create({
      header: headerst,
      message: error,
      buttons: ['OK'],
    });

    await alert.present();
  }

async loadSettings() {
    if (this.dataService.loaded) {
      this.config = this.dataService.getSettings();
    } else {
      this.dataService.load().then(() => {
        this.config = this.dataService.getSettings();
      });
    }
    /*if (this.config.inputtext == 'DUT') {
      this.placeholdertxt = 'Vertalen';
    } else if (this.config.inputtext == 'SPA') {
      this.placeholdertxt = 'Traducir';
    } else if (this.config.inputtext == 'GLE') {
      this.placeholdertxt = 'Aistrigh';
    } else {
      this.placeholdertxt = 'Translate';
    }*/
    this.placeholdertxt = await this.translate.get('app.texttranslate').toPromise();
    this.config.endpoint = "https://api.signon-project.eu/orchestrator";
    this.dataService.saveSettings(this.config);
 // this.config.endpoint =  "https://api.dev.signon-project.eu/orchestrator/wp2"
  }

  async startUpload(f) {
    try {
      const audioFile = await Filesystem.readFile({
        path: f.nativeURL
      });
      var audioRef = new Audio(`data:${this.mimeType};base64,${audioFile.data}`)
      audioRef.oncanplaythrough = () => audioRef.play()
      audioRef.load();
    } catch (error) {
      console.log('startUpload' + error);
      //debugger;
    }

  }
  async onButtonClick() {
    // Code to execute when the button is clicked
    console.log('Button clicked!');
    this.onSend(this.newMsg);
    // You can perform any actions or logic you need here
  }
  async onSend(txt) {

    const info = await Device.getId();
    this.glosstext = '';
    debugger;
    this.messages = [];
    this.currentselect = '';
    this.selectedVideo = '';
    this.selectedAudio = '';
    this.myItem.nativeElement.blur(); 
    this.cd.detectChanges();
    if((this.config.outputsl != 'DSE')&&(this.outputsource == "VIDEO")){
      let slterror = await this.translate.get('app.supportedsign').toPromise();
      this.presentAlert('SignON Services', slterror );
    }else {


    let signonconnect = await this.translate.get('app.signonconnect').toPromise();
    this.myItem.nativeElement.blur(); 
    this.cd.detectChanges();
    const loading = await this.loadingController.create({ message: signonconnect });
    await loading.present();

    setTimeout(() => {
      let model = new MessageModel(info.uuid);
      this.myItem.nativeElement.blur(); 
      this.cd.detectChanges();
      if (this.canvasEl) {
        this.canvasEl.nativeElement.click();
        this.cd.detectChanges();
    }
      //debugger;
      model.setSourceLanguage(this.config.inputtext);
      model.setSourceMode("TEXT");
      model.setSourceText(txt);
      if (this.outputsource == "TEXT") {
        model.setTargetLanguage(this.config.outputtext);
        model.setTargetMode("TEXT");
      } else if (this.outputsource == "VIDEO") {
        model.setTargetMode("AVATAR");
        model.setTargetLanguage(this.config.outputsl);
      } else {
        model.setTargetMode("AUDIO");
        model.setTargetLanguage(this.config.outputtext);
      }
  
      let dataToSend = { App: model };
      //  var dataToSend = { App: { sourceKey: "NONE", sourceText: "This is the source text in english to be translated", sourceLanguage: "ENG", sourceMode: "TEXT", sourceFileFormat: "NONE", sourceVideoCodec: "NONE", sourceVideoResolution: "NONE", sourceVideoFrameRate: -1, sourceVideoPixelFormat: "NONE",sourceAudioCodec: "NONE", sourceAudioChannels: "NONE", sourceAudioSampleRate: -1, translationLanguage: "SPA", translationMode: "TEXT", appInstanceID: "info.uuid", appVersion: "0.1.0", T0App: 1508484583259 } };
  
      console.log(JSON.stringify(dataToSend))
      this.signOnService.signOnPost(this.config.endpoint,dataToSend).subscribe((res: any) => {
        //debugger;
  
        var resparse = res.data;
        if ((res.status == 200) || (res.status == 201)) {
  
          console.log(resparse);
          // var response = resparse.replace(/\"/g, "");  
          debugger;
          var jsonResp = JSON.parse(resparse.IntermediateRepresentation);
          console.log(JSON.stringify(jsonResp));
          if (this.outputsource == "VIDEO") {
            this.continueAnimating = true;
            //this.animate();
             this.processMessage(jsonResp);
                      // this.setVideoURL(jsonResp.avatarSentenceID);
            //this.cd.detectChanges();
            //this.setVideoURL(1);
          } else {
            // var jsonResp = JSON.parse(res);
            this.messages.push({
              createdAt: new Date().getTime(),
              msg: jsonResp.translationText[0]
            })
  
            if (this.outputsource == "AUDIO") {
              this.messageClick(jsonResp.translationText[0]);
            }
            this.cd.detectChanges();
            if (this.canvasEl) {
                this.canvasEl.nativeElement.click();
                this.canvasEl.nativeElement.focus();
                this.cd.detectChanges();
  
            }
  
          }
          loading.dismiss();
        } else {
          loading.dismiss();
          this.presentAlert('SignON Services', "Server Status Error " + res.status);
        }
  
        // var jsonResp = JSON.parse(res);
        console.warn("Service Called");
  
      }, error => {
        //  alert('error');
        loading.dismiss();
        //debugger;
        this.presentAlert('SignON Services', error);
  
        console.log('OnSend error: ', error);
      });
  
    }, 2000);
    this.cd.detectChanges();
  }

  }

  async onSendFile(f) {
    if (this.sendfile == false) {
      this.glosstext = '';
      debugger;
      //('sendfile');
      this.action = true;
      this.sendfile = true;
      //this.deleteMediaFiles();
      this.currentselect = '';
      this.selectedVideo = '';
      this.selectedAudio = '';
      this.messages = [];
      this.cd.detectChanges();
      let failupload = await this.translate.get('app.failupload').toPromise();
      let servererror =  await this.translate.get('app.servererror').toPromise();
      const info = await Device.getId();
      let signonconnect = await this.translate.get('app.signonconnect').toPromise();
    
      const loading = await this.loadingController.create({ message: signonconnect });
         await loading.present();
      let video = false;


      let signonmessage = new MessageModel(info.uuid);

      console.log(f.name);
      let ext = f.name.split('.').pop();

      if ((ext.toLowerCase() == 'wav') || (ext.toLowerCase() == 'm4a') || ((ext.toLowerCase() == 'mp3'))) {
        signonmessage.setAudioChannel("1");
        signonmessage.setAudioSampleRate("44100");
        signonmessage.setSourceFileFormat('m4a');
        ext = 'm4a';
      } else {
        signonmessage.setSourceFileFormat(ext.toLowerCase());
        video = true;
      }

      let model = new FileModel(info.uuid, ext);
      /*
   Audio Channels1 Audio Bits Per Sample16 Audio Sample Rate44100
   */


      let sourceKey = '';
      console.log(model);
      this.signOnService.signOnGetStorageKey(this.config.endpoint,model).subscribe((res: any) => {
        debugger;
        if ((res.status == 200) || (res.status == 201)) {
          var resparse = res.data;

          console.log(resparse);
          sourceKey = resparse.ObjectName;
          signonmessage.setSourceKey(resparse.ObjectName);
          signonmessage.setSourceLanguage(this.config.inputtext);
          if(video == false)
          {
          signonmessage.setSourceMode("AUDIO");
          }else{
            signonmessage.setSourceMode("VIDEO");
          }
          signonmessage.setSourceText("NONE");
          if (this.outputsource == "TEXT") {
            signonmessage.setTargetLanguage(this.config.outputtext);
            signonmessage.setTargetMode("TEXT");
          } else if (this.outputsource == "VIDEO") {
            signonmessage.setTargetMode("AVATAR");
            signonmessage.setTargetLanguage(this.config.outputsl);
          } else {
            signonmessage.setTargetMode("AUDIO");
            signonmessage.setTargetLanguage(this.config.outputtext);
          }
          try {
            Filesystem.readFile({ path: f.nativeURL }).then(async (base64Audio) => {
              //debugger;
              const base64Sound = base64Audio.data;
              var url;
              if (video == true) {
                url = (`data:${this.mimePlatformVideo};base64,${base64Sound}`);
              } else {
                let devicemimetype = '';
                if(ext.toLowerCase() == 'm4a'){
                   devicemimetype = this.mimeTypem4a;
                }
                if(ext.toLowerCase() == 'wav'){
                  devicemimetype = this.mimeTypem4a;
               }
               if(ext.toLowerCase() == 'mp3'){
                devicemimetype = this.mimeTypem4a;
             }
                url = (`data:${devicemimetype};base64,${base64Sound}`);
              // url = (`base64,${base64Sound}`);
              }
              //debugger;
              var response = await fetch(url);
              var imgBlob = await response.blob()
              loading.message =  await this.translate.get('app.uploading').toPromise();
              this.signOnService.signOnPutFileAngular(resparse.PreSignedURL, imgBlob).subscribe((res: any) => {
                //
                //
                //debugger;
                let dataToSend = { App: signonmessage };
                console.log(JSON.stringify(dataToSend))
               // loading.message = 'Processing...';
                this.signOnService.signOnPost(this.config.endpoint,dataToSend).subscribe((res: any) => {
                  //debugger;
                  loading.dismiss();
                  var resparse = res.data;
                  if ((res.status == 200) || (res.status == 201)) {

                    console.log(resparse);
                    var jsonResp = JSON.parse(resparse.IntermediateRepresentation);
                    if (this.outputsource == "VIDEO") {
                        this.continueAnimating = true;
                        //this.animate();

                         this.processMessage(jsonResp);
                    } else {
                      this.messages.push({
                        createdAt: new Date().getTime(),
                        msg: jsonResp.translationText[0]
                      })
                      if (this.outputsource == "AUDIO") {
                        this.messageClick(jsonResp.translationText[0]);
                      }
                      this.cd.detectChanges();
                    }
                  } else {
                    
                    this.presentAlert('SignON Services', "Server Status Error " + res.status);
                    if(resparse.detail){
                      this.presentAlert('SignON Services', "Server Status Detail " + resparse.detail);
                    }
                  }
                  console.warn("Service Called");

                }, error => {
                  //  alert('error');
                  loading.dismiss();
                  this.presentAlert("SignOn Services", failupload + error);
                });
              }, error => {
                //  alert('error');
                loading.dismiss();
                //debugger;
                console.log('error: ', error);
              });
            }, err => console.log('error Opening File: ', err));

          } catch (error) {
            console.log(error);
            this.sendfile = false;
            //debugger;
          }
        } else {
          loading.dismiss();
          this.presentAlert('SignON Services', servererror + res.status);
          this.sendfile = false;
        }

      }, error => {
        //  alert('error');
        loading.dismiss();
        //debugger;
        console.log('error: ', error);
        this.sendfile = false;
      });
    } else {
      this.presentAlert("SignOn Services", "Already sending file");
    }
    this.sendfile = false;
  }

 /*copyFileToLocalDir(fullPath, wav) {
    let myPath = fullPath;
    //this.storeMediaFiles(fullPath);
    //debugger;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }
    let ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;

    let name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;
    console.log('copy From ' + copyFrom);
    console.log('copy To ' + copyTo);
    this.file.copyFile(copyFrom, name, copyTo, newName).then(
      success => {
        this.loadFiles();

      },
      error => {
        console.log('error: ', error);
      }
    );
  }*/
  copyFileToLocalDir(fullPath) {
    let myPath = fullPath;
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }
    let ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;
    this.mimeType = ext;
    let name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;
    let that = this;
    return (this.file.copyFile(copyFrom, name, copyTo, newName));
   
    /*this.file.copyFile(copyFrom, name, copyTo, newName).then(
      success => {
        console.log('success: ');
        this.recordingpath = copyTo + '/' + newName;
        this.record = true;
        //that.presentError('SignON ML', "copyFileToLocalDir  copyFrom [ " + copyFrom + "/" + name + " ]" + " copyTo [" + copyTo + "/" + newName + " ]");

      },
      error => {
        //console.log('error: ', error);
        if(showerror)
        {
        that.presentError('SignON ML Error', "copyFrom [ " + copyFrom + "/" + name + " ]" + " copyTo [" + copyTo + "/" + newName + " ]" + JSON.stringify(error));
        this.recordingpath = '';
        }
      }
    );*/

  }
  openFile(f: FileEntry) {
    if (f.name.indexOf('.m4a') > -1) {
      // We need to remove file:/// from the path for the audio plugin to work
      const path = f.nativeURL.replace(/^file:\/\//, '');
      // const audioFile: MediaObject = this.media.create(path);
      // audioFile.play();
    } else if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {
      // E.g: Use the Streaming Media plugin to play a video
      // alert(f.nativeURL);
      //this.streamingMedia.playVideo(f.nativeURL);
    }
  }
  async presentError(headerst: string, error: string) {
    const alert = await this.alertController.create({
      header: headerst,
      message: error,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async startRecordingVideo() {
    //debugger;
    this.messages = [];
    this.newMsg = '';
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    }
    let that = this;
    this.mediaCapture.captureVideo(options).then(
      (data: MediaFile[]) => {
        //data[0].getFormatData().then
        this.mimePlatformVideo = data[0].type;
        if (data.length > 0) {
          console.log('copy 1');
           this.copyFileToLocalDir((data[0].fullPath)).then(
            success => {
              console.log('success: ');
              this.loadFiles();
            },
            error => {
              console.log('copy error');
              //console.log('error: ', error);
              that.copyFileToLocalDir((decodeURI(data[0].fullPath))).then(
                success => {
                  console.log('success: ');
                  
                  that.loadFiles();
                  //that.presentError('SignON ML', "copyFileToLocalDir  copyFrom [ " + copyFrom + "/" + name + " ]" + " copyTo [" + copyTo + "/" + newName + " ]");
          
                },
                error => {
                    that.presentError('SignON Mobile File Error', JSON.stringify(error));
                });
            }
          );

        }
        //this.copyFileToLocalDir(data[0].fullPath, false);

      },
      (err: CaptureError) => {
        that.presentError('SignON Mobile', "Video Capture Error " + JSON.stringify(err));
      }
    );
    /*setTimeout(() => {
      this.setVideoURL(-1);
    }, 2000);
*/
  }

  async stopRecordingVideo() {
  }
  deleteMediaFiles() {
    //debugger;
    this.nativeStorage.getItem(MEDIA_RECORDED_FILES).then(res => {
      //debugger;
      if (res) {
        let arr = JSON.parse(res);
        this.mediaFiles = res;
        for (var filepath of arr) {
          //debugger;
          console.log(filepath);

          let myPath = filepath;
          //debugger;
          // Make sure we copy from the right location
          if (filepath.indexOf('file://') < 0) {
            myPath = 'file://' + filepath;
          }
          //debugger;
          //alert('1');  
          let ext = myPath.split('.').pop();
          const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
          let name = myPath.substr(myPath.lastIndexOf('/') + 1);
          this.file.removeFile(copyFrom, name);


        }

        this.nativeStorage.remove(MEDIA_RECORDED_FILES).then(
          () => console.log('Deleted Files!'),
          error => { console.error('Error deleted item', error); }
        );
      } else {

      }

    }, (err) => {
      console.log(err);

    });
  }
  storeMediaFiles(files) {
    //debugger;
    this.nativeStorage.getItem(MEDIA_RECORDED_FILES).then(res => {
      //debugger;
      if (res) {
        let arr = JSON.parse(res);
        arr = arr.concat(files);
        this.nativeStorage.setItem(MEDIA_RECORDED_FILES, JSON.stringify(arr)).then(
          () => console.log('Stored item!'),
          error => { console.error('Error storing item', error); }
        );;
      } else {
        let emptyarr = [];
        emptyarr.push(files);
        this.nativeStorage.setItem(MEDIA_RECORDED_FILES, JSON.stringify(emptyarr)).then(
          () => console.log('Stored item!'),
          error => { console.error('Error storing item', error); }
        );;
      }
      this.recordedFiles = this.recordedFiles.concat(files);
    }, (err) => {
      console.log(err);
      let emptyarr = [];
      emptyarr.push(files);
      this.nativeStorage.setItem(MEDIA_RECORDED_FILES, JSON.stringify(emptyarr)).then(
        () => console.log('Stored item!'),
        error => { console.error('Error storing item', error); }
      );

    });

    
  }
  moveIOSFileToLocalDir() {
    const dirFrom = this.file.dataDirectory + MEDIA_FOLDER_NAME;
    const dirTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;
    let extfrom = 'wav';  
    let extto = 'm4a'

    let filefrom = this.contentFilename + '.' + extfrom;
    let fileto = this.contentFilename+ '.' + extto;

    return (this.file.moveFile(dirFrom, filefrom, dirTo, fileto));

  }
  stopProp(event){
    event.preventDefault();
event.stopPropagation();
event.stopImmediatePropagation();
  }
  onClickKeyboard(event) {
   // this.adjustTextareaHeight();
    console.log('Input clicked !!!!');
    this.continueAnimating = false;
    let that = this;
    /*setTimeout(function () {
      if (!that.isIOSPlatform()) {
      console.log('Show Key Board !!!!');
      alert('Show Key Board !!!!');
      Keyboard.show()
        .then(
          () => console.log('onClickKeyboard success show'),
          () => console.log('onClickKeyboard failure show'));
        }
    }, 200);*/

  } 
  async startRecordingAudio() {
    console.log('start recording');
    //debugger;
    this.messages = [];
    this.newMsg = '';
    let that = this;
    if (this.config.voiceengine == 'native') {
      //  alert('native start');
      if (this.audiorecording == false) {
        if (this.isIOSPlatform()) {
          setTimeout(function () {
            console.log('startRecordingAudio Hide KeyBoard');
            Keyboard.hide()
              .then(
                () => console.log('startRecordingAudio success hide'),
                () => console.log('startRecordingAudio failure hide'));

          }, 3);
          this.audiorecording = true;
          this.continueAnimating = false;
          this.calculateDuration();
        }
        this.continueAnimating =false;
        this.speechRecognition.startListening()
          .subscribe(
            (matches: string[]) => {
              console.log(matches);
              this.newMsg = matches[0];
              this.cd.detectChanges();

            },
            (onerror) => console.log('startRecordingAudio START:', onerror)
          )

      } else {
        if (this.isIOSPlatform()){
       
          if (this.audiorecording == true)

            this.speechRecognition.stopListening().then(() => {
              console.log('native stop');
              this.audiorecording = false;
              this.cd.detectChanges();
              setTimeout(function () {
                console.log('hide');
                Keyboard.hide()
                  .then(
                    () => console.log(' startRecordingAudio STOP success hide'),
                    () => console.log('startRecordingAudio STOP failure hide'));

              }, 3);
            }, (err: any) => {
              console.error('startRecordingAudio STOP' + err);
              this.audiorecording = false;
            });
          }
      }

    } else {
     // if (this.isIOSPlatform()||!this.isIOSPlatform()) {
     /* if (this.isIOSPlatform()) {
        console.log('IOS Signon Record - Recording ' + this.audiorecording );
        let thisthat = this;
        if (this.audiorecording) {
          //  alert('stop audio');
          setTimeout(function () {
            console.log('hide');
            Keyboard.hide()
              .then(
                () => console.log('success hide'),
                () => console.log('failure hide'));

          }, 3);
          console.log('stopRecordingAudio()');

          await this.stopRecordingAudio();


        } else {

          setTimeout(function () {
            console.log('hide');
            Keyboard.hide()
              .then(
                () => {
                  console.log('success hide')
                  thisthat.audiorecording = true;
                  thisthat.cd.detectChanges();
                  console.log('startRecording()');
                  thisthat.calculateDuration();
                  VoiceRecorder.startRecording();
                },
                () => console.log('failure hide'));

          }, 3);

        }
      } else {
        //this.audiorecording = true;
        //dont need usinf media capture audio instead
        let options: CaptureAudioOptions = {
          limit: 1,
          duration: 30
        }
        //debugger;
        let obj = this.mediaCapture.supportedAudioModes;
        //  await this.file.removeFile('file:///storage/emulated/0/Recordings/Voice Recorder/','Voice 001.m4a');
        this.mediaCapture.captureAudio(options).then(
          (data: MediaFile[]) => {
            // this.fixMediaPath(data);
            // capture callback
            //debugger;
            this.audiorecording = false;
            if (data.length > 0) {
              console.log('copy 1');
               this.copyFileToLocalDir(decodeURI(data[0].fullPath)).then(
                success => {
                 // alert('success');
                 console.log('success: 1');
                  this.mimePlatformAudio = data[0].type;
                  this.loadFiles();
                },
                error => {
                  console.log('copy error');

                  //console.log('error: ', error);
                 // that.copyFileToLocalDir((decodeURI(data[0].fullPath))).then(

                  that.copyFileToLocalDir(((data[0].fullPath))).then(
                    success => {
                      console.log('success: 2');
                    //  alert('success');
                      this.mimePlatformAudio = data[0].type;
                      that.loadFiles();
                      //that.presentError('SignON ML', "copyFileToLocalDir  copyFrom [ " + copyFrom + "/" + name + " ]" + " copyTo [" + copyTo + "/" + newName + " ]");
              
                    },
                    error => {
                        that.presentError('SignON Mobile File CopyError ', JSON.stringify(error)+ ' Path ' + (data[0].fullPath));
                    });
                }
              );
    
            }
          },
          (err: CaptureError) => {
            console.error(err);
            that.presentError('SignON ML', "Audio Capture Error " + JSON.stringify(err));
            this.audiorecording = false;
          }

        );
      }*/
      let thisthat = this;
      if (this.audiorecording) {
        //  alert('stop audio');
        setTimeout(function () {
          console.log('hide');
          Keyboard.hide()
            .then(
              () => console.log('success hide'),
              () => console.log('failure hide'));

        }, 30);
        console.log('stopRecordingAudio()');
        await this.stopRecordingAudio();


      } else {

        setTimeout(function () {
          console.log('hide');
          this.continueAnimating =false;
          Keyboard.hide()
            .then(
              () => {
                console.log('success hide')
                thisthat.audiorecording = true;
                thisthat.continueAnimating = false;
                thisthat.cd.detectChanges();
                console.log('startRecording()');
                thisthat.calculateDuration();
                VoiceRecorder.startRecording();
              },
              () => console.log('failure hide'));

        }, 30);

      }
    }
  }
/*
  async startRecordingAudio() {
    console.log('start recording');
    //debugger;
    this.messages = [];
    this.newMsg = '';
    let that = this;
    if (this.config.voiceengine == 'native') {
      //  alert('native start');
      if (this.audiorecording == false) {
        if (this.isIOSPlatform()) {
          setTimeout(function () {
            console.log('hide');
            Keyboard.hide()
              .then(
                () => console.log('success hide'),
                () => console.log('failure hide'));

          }, 3);
          this.audiorecording = true;
          this.calculateDuration();
        }

        this.speechRecognition.startListening()
          .subscribe(
            (matches: string[]) => {
              console.log(matches);
              this.newMsg = matches[0];
              this.cd.detectChanges();

            },
            (onerror) => console.log('error:', onerror)
          )

      } else {
        if (this.isIOSPlatform()){
       
          if (this.audiorecording == true)

            this.speechRecognition.stopListening().then(() => {
              console.log('native stop');
 
              this.audiorecording = false;
              this.cd.detectChanges();
              setTimeout(function () {
                console.log('hide');
                Keyboard.hide()
                  .then(
                    () => console.log('success hide'),
                    () => console.log('failure hide'));

              }, 3);
            }, (err: any) => {
              console.error(err);
              this.audiorecording = false;
            });
          }
      }

    } else {
      if (this.isIOSPlatform()) {
        console.log('IOS Signon Record - Recording ' + this.audiorecording );
        let thisthat = this;
        if (this.audiorecording) {
          //  alert('stop audio');
          setTimeout(function () {
            console.log('hide');
            Keyboard.hide()
              .then(
                () => console.log('success hide'),
                () => console.log('failure hide'));

          }, 3);
          console.log('stopRecordingAudio()');

          await this.stopRecordingAudio();


        } else {

          setTimeout(function () {
            console.log('hide');
            Keyboard.hide()
              .then(
                () => {
                  console.log('success hide')
                  thisthat.audiorecording = true;
                  thisthat.cd.detectChanges();
                  console.log('startRecording()');
                  thisthat.calculateDuration();
                  VoiceRecorder.startRecording();
                },
                () => console.log('failure hide'));

          }, 3);

        }
      } else {
        //this.audiorecording = true;
        //dont need usinf media capture audio instead
        let options: CaptureAudioOptions = {
          limit: 1,
          duration: 30
        }
        //debugger;
        let obj = this.mediaCapture.supportedAudioModes;
        //  await this.file.removeFile('file:///storage/emulated/0/Recordings/Voice Recorder/','Voice 001.m4a');
        this.mediaCapture.captureAudio(options).then(
          (data: MediaFile[]) => {
            // this.fixMediaPath(data);
            // capture callback
            //debugger;
            this.audiorecording = false;
            if (data.length > 0) {
              console.log('copy 1');
               this.copyFileToLocalDir(decodeURI(data[0].fullPath)).then(
                success => {
                 // alert('success');
                 console.log('success: 1');
                  this.mimePlatformAudio = data[0].type;
                  this.loadFiles();
                },
                error => {
                  console.log('copy error');

                  //console.log('error: ', error);
                 // that.copyFileToLocalDir((decodeURI(data[0].fullPath))).then(

                  that.copyFileToLocalDir(((data[0].fullPath))).then(
                    success => {
                      console.log('success: 2');
                    //  alert('success');
                      this.mimePlatformAudio = data[0].type;
                      that.loadFiles();
                      //that.presentError('SignON ML', "copyFileToLocalDir  copyFrom [ " + copyFrom + "/" + name + " ]" + " copyTo [" + copyTo + "/" + newName + " ]");
              
                    },
                    error => {
                        that.presentError('SignON Mobile File CopyError ', JSON.stringify(error)+ ' Path ' + (data[0].fullPath));
                    });
                }
              );
    
            }
          },
          (err: CaptureError) => {
            console.error(err);
            that.presentError('SignON ML', "Audio Capture Error " + JSON.stringify(err));
            this.audiorecording = false;
          }

        );
      }
    }
  }
  */
  async setVideoURL(index) {
    debugger;
    if (index == -1) {

      //Sorry I don’t understand
      await this.presentAvatar();
      //alert('about to show avatar');
      this.selectedVideo = this.unknownurl;
      this.cd.detectChanges();
    }
    else {
      this.hardcodeSign.forEach(value => {
        if ((value.signLanguage == this.config.outputsl) && (value.index == index)) {
          this.selectedVideo = value.url;
          this.cd.detectChanges();
        }
      });

    }

    let video = this.myVideo.nativeElement;
    let that = this;
    video.onended = function () {
      // alert('onended');
      if (that.selectedVideo == that.unknownurl) {
        that.setVideoURL(1);

      }
    };
    //alert(this.selectedVideo);
    video.src = this.selectedVideo;
    video.play();
    this.cd.detectChanges();

  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
    this.glosstext = '';
    let source = ev.detail.value

   /* if (source == 'VIDEO') {
      source = 'AVATAR';
    }*/  
      this.buttonsource = source;
      this.cd.detectChanges();
    this.outputsource = ev.detail.value;
    this.selectedAudio = '';
    this.selectedVideo = '';
    this.currentselect = '';
    if (source == 'VIDEO') {
      this.messages = [];
      source = 'AVATAR';  
      if(this.avatarload == false){
        if(this.config.outputsl != 'DSE'){
          this.presentAlert('SignON Services', "The Services currently support Dutch Sign Language only" );
        }else{
          this.initializeAvatar();
          this.avatarload = true;
        }

      }else{
        this.continueAnimating = true;
       // this.animate();
      }
    }else{
     // this.clearResourcse();
     this.continueAnimating = false;
    }

    this.segmenthaschanged = true;
    this.vibration.vibrate(200);
    this.presentMode(source);
    this.handleOutput(source);

  }
  async stopRecordingAudio() {
    console.log('stopRecordingAudio');
    this.continueAnimating = true;
    //this.animate();
    if (this.config.voiceengine == 'native') {
    }
    else {
      if (!this.audiorecording) {
        return;
      }
      console.log('VoiceRecorder.stopRecording()');
      VoiceRecorder.stopRecording().then(async (result: RecordingData) => {

        if (result.value && result.value.recordDataBase64) {
          const recordData = result.value.recordDataBase64;

         console.log(result.value.mimeType);
         debugger;
          this.mimeType = result.value.mimeType;
          // console.log(JSON.stringify(result));
         /* var date = new Date();

          var day = ("0" + (date.getDate())).slice(-2);
          var min = ("0" + (date.getMinutes())).slice(-2);
          var sec = ("0" + (date.getSeconds())).slice(-2);*/
          var date = Date.now();
          // MEDIA_FOLDER_NAME
          //  const fileName = MEDIA_FOLDER_NAME + '/' + 'audio' + day + min + sec + '_' + this.duration + '_sec' + '.m4a';
          const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;

          let fileName = '';
          let ext =  ''

          this.contentFilename  = fileName = date + '_' + this.duration + '_sec';

          if (this.isIOSPlatform()) {
             ext='mp3';
           
             fileName += '.' + ext;
             this.contentFileformat = 'm4a'
           // this.mimeType = 'audio/wav';
        }
         else{
          ext='m4a';
          fileName += '.' + ext;
          this.contentFileformat = 'm4a'
          //this.mimeType = ext;
        }
         // var url;

         // url = (`data:${this.mimeType};base64,${recordData}`);
          var url;

          url = (`data:${this.mimeType};base64,${recordData}`);

          //url = (`base64,${recordData}`);
          //console.log(url);

          var response = await fetch(url);
          var imgBlob = await response.blob();

          try {
            this.file.writeFile(copyTo, fileName, imgBlob).then((res) => {
              console.log('FILE WRITTEN ' + JSON.stringify(res));
              //this.animate();

            }, err => console.log('error remove: ', err));
            /*const audioRef = new Audio(`data:${this.mimeType};base64,${recordData}`)
            audioRef.oncanplay = () => audioRef.play()
            audioRef.load();*/
            /*await Filesystem.writeFile({
       path: fileName,
       directory: Directory.Data,
       data: recordData
     });*/

          } catch (err) {
            console.log('failure to save' + err);
          }
          this.loadFiles();
        }
        this.audiorecording = false;
      });
    }
  }

  async presentMode(mode) {

    if (this.config.outputtext == 'SPA') {
      if (mode == 'TEXT') {
        mode = "TEXTO"
      }

    }
    if (this.config.outputtext == 'DUT') {
      if (mode == 'TEXT') {
        mode = "TEKST"
      }
    }
    if (this.config.outputtext == 'GLE') {
      if (mode == 'TEXT') {
        mode = 'TÉACS';
      }
      if (mode == 'AUDIO') {
        mode = "FUAIME"
      }
    }
    const toast = await this.toastController.create({
      message: mode,
      color: 'primary',
      duration: 1000,
      position: 'bottom',
    });
    toast.present();
  }
  async presentAvatar() {
    let mode = 'Sorry I don’t understand';
    if (this.config.outputtext == 'SPA') {
      mode = 'lo siento no entiendo';
    }
    if (this.config.outputtext == 'DUT') {
      mode = 'Sorry ik begrijp het niet';
    }
    if (this.config.outputtext == 'GLE') {
      mode = 'Tá brón orm ní thuigim';
    }
    const toast = await this.toastController.create({
      message: mode,
      color: 'primary',
      duration: 1500,
      position: 'middle',
    });
    toast.present();
    this.handleOutput(mode);
  }
  videoEnded() {
    //debugger;
    if (this.selectedVideo == this.unknownurl) {
      this.setVideoURL(1);
    }
    /*
    let video = this.myVideo.nativeElement;
    
    video.src = convertFileSrc;*/
  }
  /*
  his.file.readAsDataURL(filePathtoUpload, this.fileName)
.then((base64Audio) => {
console.log(base64Audio);
})
.catch(function (err: TypeError) {
console.log("readAsDataURL: " + err);
});
*/
  async playFile(f) {
    //alert(fileName);
    /* if(this.isIOSPlatform()){
       console.log('Play file IOS ' + fileName.name );
       const audioFile = await Filesystem.readFile({
         directory: Directory.Data,
         path: MEDIA_FOLDER_NAME + '/' + fileName.name
       });
       const base64Sound = audioFile.data;
       console.log(base64Sound);
       const audioRef = new Audio(`data:${this.mimeType};base64,${base64Sound}`)
       audioRef.oncanplaythrough = () => audioRef.play()
       audioRef.load()
     }else{
       const audioFile = await Filesystem.readFile({
         path: fileName,
         directory: Directory.Data
       });
       const base64Sound = audioFile.data;
   
       const audioRef = new Audio(`data:${this.mimeType};base64,${base64Sound}`)
       audioRef.oncanplaythrough = () => audioRef.play()
       audioRef.load()
     }*/
    /*const audioFile = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Data
    });*/
    /* Filesystem.readFile({ path: f.nativeURL }).then(async (base64Audio) => {
       //debugger;
       const base64Sound = base64Audio.data;
     const audioRef = new Audio(`data:${this.mimeType};base64,${base64Sound}`)
     audioRef.oncanplaythrough = () => audioRef.play()
     audioRef.load();
   });*/
  }
  /*async deleteRecording(fileName) {
    // alert(fileName);

    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: fileName
    });
    this.loadfiles();
  }*/
  
  async setInputFocus(newMsg){
    //debugger;
    await this.deleteFiles();
    this.messages = [];
  }
  async deleteFile(f: FileEntry,clearpath:boolean) {
    //debugger;
    this.messages = [];
    if(clearpath == true)
    this.newMsg = '';
    console.log('Delete file ' + f.name);
    /*if(this.isIOSPlatform){
      console.log('Delete file IOS' + f.name );
      await Filesystem.deleteFile({
        directory: Directory.Data,
        path: MEDIA_FOLDER_NAME + '/' + f.name
      });
      this.selectedAudio = '';
      this.selectedVideo = '';
      this.currentselect = '';
      this.loadFiles();
      this.vibration.vibrate(200);
    }
    else{
      const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
      //alert('delte');
      this.action = true;
      this.file.removeFile(path, f.name).then(() => {
        this.selectedAudio = '';
        this.selectedVideo = '';
        this.currentselect = '';
        this.loadFiles();
        this.vibration.vibrate(200);
      }, err => console.log('error remove: ', err));
    }*/
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
    //alert('delte');
    this.action = true;
    this.file.removeFile(path, f.name).then(() => {
      this.selectedAudio = '';
      this.selectedVideo = '';
      this.currentselect = '';
      this.loadFiles();
      this.vibration.vibrate(200);
    }, err => console.log('error remove: ', err));
  }

  async handleOutput(output: string) {
    let splanguage = '';
    if(this.isIOSPlatform()){
      splanguage = 'en-GB';
    }else{
      splanguage = 'eng';
    }
   // let splanguage = 'en-GB';

    if (this.config.outputtext == 'SPA') {
      if(this.isIOSPlatform()){
        splanguage = 'es-ES';
      }
      else{
        splanguage = 'spa';
      }
     // 

    }
    if (this.config.outputtext == 'DUT') {
      if(this.isIOSPlatform()){
        splanguage = 'de-DE';
      }
      else{
        splanguage = 'deu';
      }

    }
    if (this.config.outputtext == 'GLE') {
      if(this.isIOSPlatform()){
        splanguage = 'en-IE';
      }
      else{
        splanguage = 'eng';
      }

    }
    if (this.config.ttsengine == 'native') {
      //debugger;
      console.log('Native TTS');
      if (this.segmenthaschanged == false)
        this.isPlayingMessage = true;
      this.segmenthaschanged = false;

      let newoptions = {
        text: output,
        locale: splanguage,
        identifier: 'ambient',
        rate: 1.3,
        pitch: 0.6
      }
      let that = this;
      //debugger;
        const isSupported = await TextToSpeech.isLanguageSupported({lang: splanguage });
      this.cd.detectChanges();
      let voices  = await TextToSpeech.getSupportedLanguages();
      TextToSpeech.speak({
        text: output,
        lang: splanguage,
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      }).then(() => { console.log('Success'); this.isPlayingMessage = false;this.cd.detectChanges(); })
        .catch((reason: any) => { console.log(reason); this.isPlayingMessage = false; });
      //debugger;
      //const languages = await TextToSpeech.getSupportedLanguages();
     /* this.tts.getVoices().then(function (voices) {
        // Array of voices [{name:'', identifier: '', language: ''},..] see TS-declarations
        //debugger;
        this.tts.speak(newoptions)
        .then(function() { 
          //debugger;
          console.log('Success'); 
          that.isPlayingMessage = false; 
        },function (reason) {
          alert(reason);
        });
  }, function (reason) {
    alert(reason);
  });*/


       /* setTimeout(() => {
          //debugger;
          that.isPlayingMessage = false;

        }, 1500);*/
      ////debugger;
      // let voices  = await TextToSpeech.getSupportedVoices();
      ////debugger;
      /*TextToSpeech.speak({
        text: output,
        lang: splanguage,
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      }).then(() => { console.log('Success'); this.isPlayingMessage = false; })
        .catch((reason: any) => { console.log(reason); this.isPlayingMessage = false; });
      */

    } else {
      let that = this;
      this.accapela.textToSpeech(this.config.outputtext, output).subscribe((res: any) => {
        if (res.status != 200) {
          if (res.data.error) {
            that.presentAlert('Natural Speech Engine', res.data.error + "Please contact the account administrator. " );
          }
        } else {
          const base64Sound = res.data;
          if (this.segmenthaschanged == false)
            this.isPlayingMessage = true;
          this.segmenthaschanged = false;
          const audioRef = new Audio(`data:${this.mimeTypemp3};base64,${base64Sound}`)
          audioRef.oncanplay = () => audioRef.play()
          audioRef.load();
          setTimeout(() => {
            this.isPlayingMessage = false;
          }, 2000);
        }



      }, error => {
        //debugger;
        this.isPlayingMessage = false;
        console.log('error: ', error);
      });
    }
  }
  messageClick(ev: any):void {
    this.handleOutput(ev);
  }
  myFunction(f) {
    //alert("Can play through video without stopping" + Directory.Data + f );
  }
}
