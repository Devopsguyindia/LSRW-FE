import {
  Component,
  OnInit,
  Directive,
  ElementRef,
  Renderer
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import swal from 'sweetalert2';
import {
  MainService
} from '../main.service';
import {
  CookieService
} from 'ngx-cookie-service';
import {
  PronunciationService
} from './pronunciation.service';
import Speech from 'speak-tts';
import * as WaveSurfer from 'wavesurfer.js';
import * as RecordRTC from 'recordrtc';
import html2canvas from 'html2canvas';
import {
  CourseIndexService
} from '../course-index/course-index.service';
import {
  SpinnerVisibilityService
} from 'ng-http-loader';

@Component({
  selector: 'app-pronunciation',
  templateUrl: './pronunciation.component.html',
  styleUrls: ['./pronunciation.component.css']
})
export class PronunciationComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  cardData: any = {};
  cards: any = [];
  count = 0;
  snell;
  progress;
  countDisable = false;
  image_url;
  private record;
  wavesurfer;
  private recording = false;
  error;
  customId = 'waveform1';
  checkword;
  count1 = 0;
  baseString;
  waveFlag = false;
  constructor(private route: ActivatedRoute,
    // tslint:disable-next-line:max-line-length
    private router: Router, private spinner: SpinnerVisibilityService, private pronunciationservice: PronunciationService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService, public courseservice: CourseIndexService) {
    this.snell = 1;
    this.progress = 0;
  }

  getCards(topic_id, course_id) {
    this.pronunciationservice.getCards(topic_id, course_id).subscribe(data => {
      this.cards = data;
      if (this.cards.status === 1) {
        this.cardData = this.cards.data;
        this.cardData.forEach(element => {
          element.dis1 = true;
        });

        this.progress = this.progress + (100 / this.cardData.length);
      } else {
        swal({
          title: 'Oops!',
          text: this.cards.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  changeFolder(code) {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.image_url = this.mainservice.service_url + 'Api/uploads/pronunciation/' + this.mainservice.courseId + '/' + params.id + '/' + code + '/';
      }
    })
  }


  textToSpeech(sentence, customeIds) {
    // 'en-US'
    this.customId = customeIds;
    const speech = new Speech();
    speech
      .init({
        volume: 0.5,
        lang: 'en-US',
        rate: 1,
        pitch: 1,
        // 'voice':'Google UK English Male',
        // 'splitSentences': false,
        listeners: {
          onvoiceschanged: voices => {}
        }
      })
      .then(data => {
        speech.setLanguage(this.mainservice.language_code);
        speech.setVoice(this.mainservice.voice_code);
        speech.setRate(this.snell);
        speech
          .speak({
            text: sentence,
            queue: true,
            listeners: {
              onstart: () => {
                if (this.customId != 'waveform1') {
                  this.initiateRecording();
                  this.recordAudio();
                }
              },
              onend: () => {
                // console.log('End utterance');
                if (this.customId != 'waveform1') {
                  this.stopRecording();
                } else {
                  this.waveFlag = true;
                }
              },
              onresume: () => {
                // console.log('Resume utterance');
              },
              onboundary: event => {}
            }
          })
          .then(data => {
            // this.stopRecording();
          })
          .catch(e => {
            // console.error('An error occurred :', e);
          });
      });
  }


  speak() {
    this.checkSpeak();
    this.initiateRecording();
    this.recordAudio();
  }

  checkSpeak() {
    this.pronunciationservice.record()
      .subscribe(
        (value) => {
          // const index1 = this.cardData.indexOf(this.checkword);
          this.cardData[this.count].ans = value;
          if ((this.cardData[this.count].content.word).toLowerCase() === value.toLowerCase()) {
            this.cardData[this.count].color = 'green';
            this.stopRecording();
          } else {
            this.cardData[this.count].color = 'red';
            this.stopRecording();
          }
        },
        (err) => {
          console.log(err);
          if (err.error == 'no-speech') {
            console.log('--restatring service--');
            this.checkSpeak();
          }
        },
        // completion
        () => {
          console.log('--complete--');
          if (this.count1 === 0) {
            this.checkSpeak();
            this.count1++;
          } else {
            this.count1 = 0;
          }
        });
  }

  initiateRecording() {

    this.recording = true;
    const mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  successCallback(stream) {
    const options = {
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1
    };
    const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
    this.pronunciationservice.DestroySpeechObject();
  }

  processRecording(blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    if (this.wavesurfer) {
      if (document.getElementById(this.customId).children[0]) {
        document.getElementById(this.customId).removeChild(
          document.getElementById(this.customId).children[0]
        );
      }
    }
    setTimeout(() => {
      this.wavesurfer = WaveSurfer.create({
        container: '#' + this.customId,
        waveColor: 'green',
        progressColor: 'purple'
      });
      this.wavesurfer.load(reader.result);
      this.pronunciationservice.DestroySpeechObject();
    }, 500);
  }
  errorCallback(error) {
    this.error = 'Can not play audio in your browser';
  }

  screenshot() {
    var data = document.getElementById('waveform1');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      this.baseString = canvas.toDataURL('image/png');
      var element = document.createElement('a');
      element.setAttribute('href', this.baseString);
      element.setAttribute('download', 'image.png');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    });
  }

  recordAudio(): void {

    this.pronunciationservice.record()
      .subscribe(
        (value) => {
          // this.speechData = value;
          // this.pronunciationservice.DestroySpeechObject();
        },
        (err) => {
          // console.log(err);
          if (err.error === 'no-speech') {
            this.recordAudio();
          }
        },
        () => {
          // this.recordAudio();
        });
  }


  addProgress() {
    if (this.count === this.cardData.length - 2) {
      this.progress = 100;
      const obj = {
        id: this.mainservice.urlId,
        user_id: JSON.parse(this.sessionstorage.get('client_data')).id,
        progress: 3
      };
      this.waveFlag = false;
      this.courseservice.updateProgress(obj).subscribe(data => {
        this.mainservice.grammDisabled = false;
        this.mainservice.convDisabled = false;
        this.spinner.hide();
      });
    } else {
      this.waveFlag = false;
      this.progress = this.progress + (100 / this.cardData.length);
      if (this.progress > 100) {
        this.progress = this.progress - (100 / this.cardData.length);
      }
    }
  }

  subProgress() {
    this.progress = this.progress - (100 / this.cardData.length);
    if (this.count === 0) {
      this.progress = 0 + (100 / this.cardData.length);
    }
  }

  ngOnInit() {
    if (this.sessionstorage.get('client_data')) {
      this.route.params.subscribe(params => {
        if (params.id) {
          this.mainservice.courseId = this.sessionstorage.get('course_id');
          this.getCards(params.id, this.mainservice.courseId);
          this.mainservice.urlId = params.id;
          // tslint:disable-next-line:max-line-length
          this.image_url = this.mainservice.service_url + 'Api/uploads/pronunciation/' + this.mainservice.courseId + '/' + params.id + '/' + this.mainservice.language_code + '/';
          this.mainservice.pronDisabled = false;
          this.mainservice.vocabDisabled = false;
        } else {
          this.router.navigateByUrl('/login');
        }
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }

}