import {
  PronunciationService
} from './../pronunciation/pronunciation.service';
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
  ConversationService
} from './conversation.service';
import Speech from 'speak-tts';
import {
  CourseIndexService
} from '../course-index/course-index.service';
import {
  SpinnerVisibilityService
} from 'ng-http-loader';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  cardData: any = [];
  cards: any = [];
  count = 0;
  count1 = 1;
  snell;
  progress;
  snellDisable = false;
  countDisable = false;
  stopConv = true;
  image_url = this.mainservice.service_url + 'Api/uploads/';
  constructor(private spinner: SpinnerVisibilityService, private route: ActivatedRoute,
    // tslint:disable-next-line:max-line-length
    private router: Router, private conversationservice: ConversationService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService, public courseservice: CourseIndexService) {
    this.snell = 1;
    this.progress = 0;
    this.cardData.content = [];
  }

  getCards(topic_id, course_id) {
    this.conversationservice.getCards(topic_id, course_id).subscribe(data => {
      this.cards = data;
      if (this.cards.status === 1) {
        this.cardData = this.cards.data;
        this.cardData.forEach(element => {
          element.stopConv = true;
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


  conversation(obj, i1) {
    // 'en-US'
    let sen;
    let voice;
    let lang_code;
    if (obj.lsentence) {
      sen = obj.lsentence;
      voice = obj.lvoice;
      lang_code = obj.llanguage;
      this.cardData[i1].content[this.cardData[i1].content.findIndex(x => x.lsentence === obj.lsentence)].act_sen = true;
    } else {
      sen = obj.rsentence;
      voice = obj.rvoice;
      lang_code = obj.rlanguage;
      this.cardData[i1].content[this.cardData[i1].content.findIndex(x => x.rsentence === obj.rsentence)].act_sen1 = true;
    }
    const speech = new Speech();
    speech.setLanguage(lang_code);
    speech.setVoice(voice);
    speech.setRate(this.snell);
    if (this.cardData[i1].stopConv) {
    speech
      .speak({
        text: sen,
        queue: false,
        listeners: {
          onstart: () => {

          },
          onend: () => {
          },
          onresume: () => {

          },
          onboundary: event => {

          }
        }
      })
      .then(data => {
        if (this.count1 < this.cardData[i1].content.length) {
          if (obj.lsentence) {
            this.cardData[i1].content[this.cardData[i1].content.findIndex(x => x.lsentence === obj.lsentence)].act_sen = false;
          } else {
            this.cardData[i1].content[this.cardData[i1].content.findIndex(x => x.rsentence === obj.rsentence)].act_sen1 = false;
          }
          this.conversation(this.cardData[i1].content[this.count1], i1);
          this.count1++;
        } else {
          this.count1 = 1;
          // this.cardData.content.forEach(element => {});
        }
      })
      .catch(e => {
        console.error('An error occurred :', e);
      });
    }
  }

  addProgress() {
    if (this.count === this.cardData.length - 2) {
      this.progress = 100;
      const obj = {
        id: this.mainservice.urlId,
        user_id: JSON.parse(this.sessionstorage.get('client_data')).id,
        progress: 5
      };
      this.courseservice.updateProgress(obj).subscribe(data => {
        this.mainservice.pracDisabled = false;
        this.mainservice.vocabDisabled = false;
        this.spinner.hide();
      });
    }
    this.progress = this.progress + (100 / this.cardData.length);
    if (this.progress > 100) {
      this.progress = this.progress - (100 / this.cardData.length);
    }
  }

  subProgress() {
    this.progress = this.progress - (100 / this.cardData.length);
    if (this.count === 0) {
      this.progress = 0 + (100 / this.cardData.length);
    }
  }

  speechInitialize() {
    const speech = new Speech();
    speech
      .init({
        volume: 1,
        lang: this.mainservice.language_code,
        rate: this.snell,
        pitch: 1,
        // 'voice': 'Google US English',
        // 'splitSentences': false,
        listeners: {}
      })
      .then(data => {
        // console.log('Speech is ready', data);
      })
      .catch(e => {
        console.error('An error occured while initializing : ', e);
      });
  }

  ngOnInit() {
    if (this.sessionstorage.get('client_data')) {
      this.route.params.subscribe(params => {
        if (params.id) {
          this.mainservice.courseId = this.sessionstorage.get('course_id');
          this.getCards(params.id, this.mainservice.courseId);
          this.mainservice.urlId = params.id;
          this.image_url = this.mainservice.service_url + 'Api/uploads/conversation/' + this.mainservice.courseId + '/' + params.id + '/';
        } else {
          this.router.navigateByUrl('/login');
        }
        this.mainservice.pracDisabled = false;
        this.mainservice.pronDisabled = false;
        this.mainservice.vocabDisabled = false;
        this.mainservice.grammDisabled = false;
      });
      this.speechInitialize();
    } else {
      this.router.navigateByUrl('/login');
    }
  }

}