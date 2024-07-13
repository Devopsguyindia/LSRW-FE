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
  VocabularyService
} from './vocabulary.service';
import {
  CourseIndexService
} from '../course-index/course-index.service';
import { SpinnerVisibilityService } from 'ng-http-loader';

import Speech from 'speak-tts';
@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrls: ['./vocabulary.component.css']
})
export class VocabularyComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  cardData: any = [];
  cards: any = [];
  count = 0;
  snell;
  progress;
  countDisable = false;
  image_url;
  constructor(private spinner: SpinnerVisibilityService, private route: ActivatedRoute,
    // tslint:disable-next-line:max-line-length
    private router: Router, private vocabularyservice: VocabularyService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService, public courseservice: CourseIndexService) {
    this.snell = 1;
    this.progress = 0;
  }

  getCards(topic_id, courseId) {
    this.vocabularyservice.getCards(topic_id, courseId).subscribe(data => {
      this.cards = data;
      if (this.cards.status === 1) {
        this.cardData = this.cards.data;
        this.cardData.forEach(element => {
          element.dis1 = true;
          element.dis2 = true;
          element.dis3 = true;
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


  textToSpeech(sentence, language) {
    // 'en-US'
    const speech = new Speech();
    speech
      .init({
        volume: 1,
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
        if (language === 'native') {
          speech.setLanguage(this.mainservice.native_language_code);
          speech.setVoice(this.mainservice.native_voice_code);
        } else {
          speech.setLanguage(this.mainservice.language_code);
          speech.setVoice(this.mainservice.voice_code);
        }
        speech.setRate(this.snell);
        speech
          .speak({
            text: sentence,
            queue: false,
            listeners: {
              onstart: () => {
                // console.log('Start utterance');
              },
              onend: () => {
                // console.log('End utterance');
              },
              onresume: () => {
                // console.log('Resume utterance');
              },
              onboundary: event => {}
            }
          })
          .then(data => {
            // console.log('Success !', data);
          })
          .catch(e => {
            console.error('An error occurred :', e);
          });
      });
  }

  addProgress() {
    if (this.count === this.cardData.length - 2) {
      const obj = {
        id: this.mainservice.urlId,
        user_id: JSON.parse(this.sessionstorage.get('client_data')).id,
        progress: 2
      };
      this.courseservice.updateProgress(obj).subscribe(data => {
        this.mainservice.pronDisabled = false;
        this.spinner.hide();
      });
      this.progress = 100;
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
  ngOnInit() {
    if (this.sessionstorage.get('client_data')) {
      this.route.params.subscribe(params => {
        if (params.id) {
          this.mainservice.courseId = this.sessionstorage.get('course_id');
          this.getCards(params.id, this.mainservice.courseId);
          this.mainservice.urlId = params.id;
          this.image_url = this.mainservice.service_url + 'Api/uploads/vocabulary/' + this.mainservice.courseId + '/' + params.id + '/';
        } else {
          this.router.navigateByUrl('/login');
        }
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}