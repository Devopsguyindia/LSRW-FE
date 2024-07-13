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
  GrammerService
} from './grammer.service';
import {
  PronunciationService
} from '../pronunciation/pronunciation.service';
import {
  CourseIndexService
} from '../course-index/course-index.service';
import Speech from 'speak-tts';
import * as WaveSurfer from 'wavesurfer.js';
import * as RecordRTC from 'recordrtc';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Component({
  selector: 'app-grammer',
  templateUrl: './grammer.component.html',
  styleUrls: ['./grammer.component.css']
})
export class GrammerComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  cardData: any = [];
  cards: any = [];
  count = 0;
  snell;
  progress;
  countDisable = false;
  image_url = this.mainservice.service_url + 'Api/uploads/';
  private record;
  wavesurfer;
  id;
  private recording = false;
  error;
  customId = 'waveform1';
  checkword;
  questions;
  count1 = 1;
  convCount = 0;
  convCount1 = 1;
  ttsProgress = 0;
  word;
  lword = '';
  rword = '';
  pracScore = 0;
  timer;
  cnt = 0;
  ccnt = 0;
  newVar;
  new2Var;
  nextToggle = true;
  constructor(private spinner: SpinnerVisibilityService, private route: ActivatedRoute,
    // tslint:disable-next-line:max-line-length
    private router: Router, public grammerservice: GrammerService, public pronunciationservice: PronunciationService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService, public courseservice: CourseIndexService) {
    this.snell = 1;
    this.progress = 0;
  }
  getCards(topic_id, course_id, unit_id) {
    this.grammerservice.getCards(topic_id, course_id, unit_id).subscribe(data => {
      this.cards = data;
      if (this.cards.status === 1) {
        this.cardData = this.cards.data;
        this.questions = this.cardData[this.count].name;
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


  textToSpeech(sentence) {
    this.ttsProgress = 0;
    if (window.navigator.onLine) {
    this.id = setInterval(() => {
      if (this.ttsProgress < 100) {
        this.ttsFunc();
      }
    }, 200);
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
        speech.setLanguage(this.mainservice.language_code);
        speech.setVoice(this.mainservice.voice_code);
        speech.setRate(this.snell);
        speech
          .speak({
            text: sentence,
            queue: true,
            listeners: {
              onstart: () => {
              },
              onend: () => {
                this.ttsProgress = 100;
                clearInterval(this.id);
              },
              onresume: () => {
                // console.log('Resume utterance');
              },
              onboundary: event => {}
            }
          })
          .then(data => {})
          .catch(e => {
            console.error('An error occurred :', e);
          });
      });
    } else {
      this.addProgress();
    }
  }


  ttsFunc() {
    this.ttsProgress = this.ttsProgress + 20;
  }

  checkTextToSpeech(answer, sentence, i) {
    // 'en-US'
    this.cardData[i].showSentence = false;
    if (window.navigator.onLine) {
    const speech = new Speech();
    speech.setLanguage(this.mainservice.language_code);
    speech.setVoice(this.mainservice.voice_code);
    speech.setRate(this.snell);
    speech
      .speak({
        text: answer,
        queue: true,
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
        if (sentence.toLowerCase().replace(/[^a-zA-Z ]/g, '') === answer.toLowerCase().replace(/[^a-zA-Z ]/g, '')) {
          this.cardData[i].correct = true;
          this.cardData[i].wrong = false;
          this.pracScore++;
        } else {
          this.cardData[i].wrong = true;
          this.cardData[i].correct = false;
          swal({
            title: 'Answer: ' + sentence,
            text: this.cards.message,
            type: 'error',
            confirmButtonText: 'Ok'
          });
        }
        this.nextToggle = false;
      })
      .catch(e => {
        console.error('An error occurred :', e);
      });
    } else {
      this.addProgress();
    }
  }

  conversation(obj, i) {
    // 'en-US'
    let sen;
    let voice;
    let lang_code;
    if (obj.lsentence) {
      sen = obj.lsentence;
      voice = obj.lvoice;
      lang_code = obj.llanguage;
      this.cardData[i].content[0][this.cardData[i].content[0].findIndex(x => x.lsentence === obj.lsentence)].act_sen = true;
    } else {
      sen = obj.rsentence;
      voice = obj.rvoice;
      lang_code = obj.rlanguage;
      this.cardData[i].content[0][this.cardData[i].content[0].findIndex(x => x.rsentence === obj.rsentence)].act_sen1 = true;
    }
    if (window.navigator.onLine) {
    const speech = new Speech();
    speech.setLanguage(lang_code);
    speech.setVoice(voice);
    speech.setRate(this.snell);
    speech
      .speak({
        text: sen,
        queue: true,
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
          if (this.count1 < this.cardData[i].content[0].length) {
            if (obj.lsentence) {
              this.cardData[i].content[0][this.cardData[i].content[0].findIndex(x => x.lsentence === obj.lsentence)].act_sen = false;
            } else {
              this.cardData[i].content[0][this.cardData[i].content[0].findIndex(x => x.rsentence === obj.rsentence)].act_sen1 = false;
            }
          this.conversation(this.cardData[i].content[0][this.count1], i);
          this.count1++;
        } else {
          this.count1 = 1;
          // this.cardData.content.forEach(element => {});
        }
      })
      .catch(e => {
        console.error('An error occurred :', e);
      });
    } else {
      this.addProgress();
    }
  }

  conversation1(obj, i) {
    // 'en-US'
    let sen;
    let voice;
    let lang_code;
    if (obj.lsentence) {
      sen = obj.lsentence;
      voice = obj.lvoice;
      lang_code = obj.llanguage;
    } else {}
    if (window.navigator.onLine) {
    const speech = new Speech();
    speech.setLanguage(lang_code);
    speech.setVoice(voice);
    speech.setRate(this.snell);
    speech
      .speak({
        text: sen,
        queue: true,
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
        // this.convCount++;
      })
      .catch(e => {
        console.error('An error occurred :', e);
      });
    } else {
      this.addProgress();
    }
  }

  speakConvsersation(i, i2) {
    this.pronunciationservice.record()
      .subscribe(
        (value) => {
          // i2++;
          this.cardData[i].content[1][i2].rsentence = value;
          i2++;
          this.convCount++;
          this.pronunciationservice.DestroySpeechObject();
          this.conversation1(this.cardData[i].content[1][i2], i);
        },
        (err) => {
          console.log(err);
          if (err.error === 'no-speech') {
            // this.speakConvsersation(i, i2);
          }
        },
        () => {
          // this.speakConvsersation(i, i2);
        });
  }

  resetConv (i) {
    this.cardData[i].content[1].forEach(element => {
      element.rsentence = '';
      element.correct = '';
      element.wrong = '';
    });
  }

  wordConversation(i, count, opt) {
    const re = /_____/gi;
    if (this.cardData[i].content[1].length > this.convCount1) {
      this.cardData[i].content[1][count].rsentence1 = this.cardData[i].content[1][count].rsentence.replace(re, opt);
      this.textToSpeech1(this.cardData[i].content[1][count], () => {
        this.conversation1(this.cardData[i].content[1][count + 1], i);
      });
      this.convCount1 = this.convCount1 + 2;
    }
  }

  textToSpeech1(sentence, callback) {
    if (window.navigator.onLine) {
    const speech = new Speech();
    speech
      .init({
        volume: 1,
        lang: 'en-UK',
        rate: 1,
        pitch: 1,
        // 'voice':'Google UK English Male',
        // 'splitSentences': false,
        listeners: {
          onvoiceschanged: voices => {}
        }
      })
      .then(data => {
        speech.setLanguage(sentence.rlanguage);
        speech.setVoice(sentence.rvoice);
        speech.setRate(this.snell);
        speech
          .speak({
            text: sentence.rsentence1,
            queue: true,
            listeners: {
              onstart: () => {
              },
              onend: () => {
                callback();
              },
              onresume: () => {
                // console.log('Resume utterance');
              },
              onboundary: event => {}
            }
          })
          .then(data => {})
          .catch(e => {
            console.error('An error occurred :', e);
          });
      });
    } else {
      this.addProgress();
    }
  }

  checkConversation(i) {
    let checkScore = 0;
    this.convCount = 0;
    for (let index = 1, j = 0; index < this.cardData[i].content[0].length; index = index + 2, j++) {
      // tslint:disable-next-line:max-line-length
      if (this.cardData[i].content[0][index].rsentence.toLowerCase().replace(/[^a-zA-Z ]/g, '') === this.cardData[i].content[1][j].rsentence.toLowerCase().replace(/[^a-zA-Z ]/g, '')) {
        this.cardData[i].content[1][j].correct = true;
        this.cardData[i].content[1][j].wrong = false;
      } else {
        checkScore++;
        this.cardData[i].content[1][j].wrong = true;
        this.cardData[i].content[1][j].correct = false;
      }
    }
    this.nextToggle = false;
    this.timer = setTimeout(() => {
      if (checkScore === 0) {
        this.pracScore++;
      }
    }, 500);
  }

  checkWordConversation(i) {
    let checkScore = 0;
    for (let index = 1; index < this.cardData[i].content[0].length; index = index + 2) {
      // tslint:disable-next-line:max-line-length
      if (this.cardData[i].content[0][index].rsentence.toLowerCase().replace(/[^a-zA-Z ]/g, '') === this.cardData[i].content[1][index].rsentence1.toLowerCase().replace(/[^a-zA-Z ]/g, '')) {
        this.cardData[i].content[1][index].correct = true;
        this.cardData[i].content[1][index].wrong = false;
      } else {
        checkScore++;
        this.cardData[i].content[1][index].wrong = true;
        this.cardData[i].content[1][index].correct = false;
      }
    }
    this.nextToggle = false;
    this.timer = setTimeout(() => {
      if (checkScore === 0) {
        this.pracScore++;
      }
    }, 500);
  }

  resetConvorsation(i) {
    this.cardData[i].content[1].forEach(element => {
      element.rsentence1 = '';
      element.correct = '';
      element.wrong = '';
    });
    this.convCount1 = 1;
  }

  addProgress() {
    this.questions = this.cardData[this.count].name;
    this.convCount = 0;
    this.convCount1 = 1;
    if (this.count === this.cardData.length - 1) {
      this.progress = 100;
      const obj = {
        id: this.mainservice.urlId,
        user_id: JSON.parse(this.sessionstorage.get('client_data')).id,
        progress: 4
      };
      this.courseservice.updateProgress(obj).subscribe(data => {
        this.mainservice.convDisabled = false;
        this.spinner.hide();
      });
    }
    this.progress = this.progress + (100 / this.cardData.length);
    if (this.progress > 100) {
      this.progress = this.progress - (100 / this.cardData.length);
    }
    this.ttsProgress = 0;
    this.nextToggle = true;
    clearTimeout(this.timer);
  }

  generateScore() {
    const obj = {
      id: this.mainservice.urlId,
      user_id: JSON.parse(this.sessionstorage.get('client_data')).id,
      score: this.pracScore / this.cardData.length,

    };
    this.grammerservice.updateScore(obj).subscribe(data => {
      swal({
        title: 'Your score!',
        text: this.pracScore + '/' + this.cardData.length,
        type: 'success',
        confirmButtonText: 'Ok'
      });
    });
  }

  subProgress() {
    this.ttsProgress = 0;
    this.convCount = 0;
    this.convCount1 = 1;
    this.nextToggle = false;
    this.questions = this.cardData[this.count].name;
    this.progress = this.progress - (100 / this.cardData.length);
    if (this.count === 0) {
      this.progress = 0 + (100 / this.cardData.length);
    }
  }

  checkAns(ans, opt, i) {
    this.nextToggle = false;
    if (ans.toLowerCase() === opt.toLowerCase()) {
      this.cardData[i].correct = true;
      this.cardData[i].wrong = false;
      this.cardData[i].selected = opt.toLowerCase();
      this.pracScore++;
    } else {
      this.cardData[i].wrong = true;
      this.cardData[i].correct = false;
      this.cardData[i].selected = opt.toLowerCase();
      swal({
        title: 'Answer: ' + ans,
        text: this.cards.message,
        type: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  checkMulipleSelectAns(ans, opt, i, type_id) {
    this.nextToggle = false;
    if (ans.findIndex(x => x.toLowerCase() === opt.toLowerCase()) !== -1) {
      this.cardData[i].correct = true;
      this.cardData[i].wrong = false;
      this.cardData[i].selected = opt.toLowerCase();
    } else {
      this.cardData[i].wrong = true;
      this.cardData[i].correct = false;
      this.cardData[i].selected = opt.toLowerCase();
      swal({
        title: 'Answer: ' + ans,
        text: this.cards.message,
        type: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  checkAns1(ans, opt, i) {
    this.nextToggle = false;
    if (ans.toLowerCase() === opt.toLowerCase()) {
      this.cardData[i].correct = true;
      this.cardData[i].wrong = false;
      this.cardData[i].selected = opt.toLowerCase();
      this.pracScore++;
    } else {
      this.cardData[i].wrong = true;
      this.cardData[i].correct = false;
      this.cardData[i].selected = opt.toLowerCase();
      swal({
        title: 'Oops...',
        text: 'Wrong selection. Please select correct image',
        type: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  checkMultiAns(ans, opt, i) {
    let correct = false;
    let breakLoop = true;
    this.nextToggle = false;
    ans.forEach(element => {
      if (breakLoop) {
        if (element.toLowerCase() === opt.toLowerCase()) {
          correct = true;
          breakLoop = false;
        } else {
          correct = false;
        }
      }
    });
    if (correct) {
      this.cardData[i].correct = true;
      this.cardData[i].wrong = false;
      this.cardData[i].selected = opt.toLowerCase();
      breakLoop = true;
    } else {
      breakLoop = true;
      this.cardData[i].wrong = true;
      this.cardData[i].correct = false;
      this.cardData[i].selected = opt.toLowerCase();
      swal({
        title: 'Answer: ' + ans,
        text: this.cards.message,
        type: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  checkFillAns(ans, opt, i) {
    const re = /_____/gi;
    if (this.ccnt === 0) {
      this.newVar = this.cardData[i].content.q_text;
      this.ccnt++;
    }
    this.nextToggle = false;
    this.cardData[i].content.q_text1 = this.newVar.replace(re, opt);
    if (ans.toLowerCase() === opt.toLowerCase()) {
      this.cardData[i].correct = true;
      this.cardData[i].wrong = false;
      this.cardData[i].selected = opt.toLowerCase();
      this.pracScore++;
      this.newVar = '';
      this.ccnt = 0;
    } else {
      this.cardData[i].wrong = true;
      this.cardData[i].correct = false;
      this.cardData[i].selected = opt.toLowerCase();
      swal({
        title: 'Answer: ' + ans,
        text: this.cards.message,
        type: 'error',
        confirmButtonText: 'Ok'
      });
      this.newVar = '';
      this.ccnt = 0;
    }
  }

  checkMatchThePair(lword, ans, i1, i) {
    this.nextToggle = false;
    if (lword && ans) {
      if (lword.toLowerCase() === ans.toLowerCase()) {
        this.cardData[i].content[1][i1].correct = true;
        this.cardData[i].content[1][i1].wrong = false;
        lword = '';
        ans = '';
      } else {
        this.cardData[i].content[1][i1].correct = false;
        this.cardData[i].content[1][i1].wrong = true;
        lword = '';
        ans = '';
      }
    }
  }

  MakeSentence(word, i, i1) {
    if (this.cardData[i].content.words.length > this.cardData[i].content.answer.length) {
      this.cardData[i].content.answer.push(word);
      this.cardData[i].content.words[i1].disButton = 1;
      this.textToSpeech(word);
    }
  }
  enableButton(i) {
    this.cardData[i].content.words.forEach(element => {
      element.disButton = 0;
    });
  }

  checkSentence(i) {
    this.textToSpeech(this.cardData[i].content.answer.join(' ').toLowerCase());
    this.nextToggle = false;
    if (this.cardData[i].content.answer.join(' ').toLowerCase() === this.cardData[i].content.sentence.toLowerCase()) {
      this.cardData[i].correct = true;
      this.cardData[i].wrong = false;
      this.pracScore++;
    } else {
      this.cardData[i].wrong = true;
      this.cardData[i].correct = false;
      swal({
        title: 'Answer: ' + this.cardData[i].content.sentence,
        text: this.cards.message,
        type: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  checkSpelling(i) {
    this.textToSpeech(this.cardData[i].content.answer.join('').toLowerCase());
    this.nextToggle = false;
    if (this.cardData[i].content.answer.join('').toLowerCase() === this.cardData[i].content.sentence.toLowerCase()) {
      this.cardData[i].correct = true;
      this.cardData[i].wrong = false;
      this.pracScore++;
    } else {
      this.cardData[i].wrong = true;
      this.cardData[i].correct = false;
      swal({
        title: 'Answer: ' + this.cardData[i].content.sentence,
        text: this.cards.message,
        type: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  voiceToText(i, sentence) {
    this.cardData[i].showSentence = false;
    this.nextToggle = false;
    this.pronunciationservice.record()
      .subscribe(
        (value) => {
          this.cardData[i].content.answer = value;
          if (sentence.toLowerCase() === value.toLowerCase()) {
            this.cardData[i].correct = true;
            this.cardData[i].wrong = false;
            this.pracScore++;
          } else {
            this.cardData[i].wrong = true;
            this.cardData[i].correct = false;
          }
        },
        (err) => {
          console.log(err);
          if (err.error === 'no-speech') {
            this.voiceToText(i, sentence);
          }
        },
        () => {
          this.voiceToText(i, sentence);
        });
  }

  checkMultipleFillAns(ans, opt, i) {
    const re = /_____/gi;
    if (this.cnt === 0) {
      this.new2Var = this.cardData[i].content.q_text;
      this.cardData[i].content.q_text = this.cardData[i].content.q_text.split(' ');
      this.cnt++;
    }
    this.nextToggle = false;
    for (let index = 0; index < this.cardData[i].content.q_text.length; index++) {
      if (this.cardData[i].content.q_text[index] == '_____') {
        this.cardData[i].content.q_text[index] = opt;
        break;
      }
    }
  }

  ansCheck(i) {
    this.nextToggle = false;
    if (this.cardData[i].content.q_text.join(' ').toLowerCase() === this.cardData[i].content.answer.toLowerCase()) {
      this.cardData[i].correct = true;
      this.cardData[i].wrong = false;
      this.pracScore++;
    } else {
      this.cardData[i].wrong = true;
      this.cardData[i].correct = false;
      swal({
        title: 'Answer: ' + this.cardData[i].content.answer,
        text: this.cards.message,
        type: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  ngOnInit() {
    if (this.sessionstorage.get('client_data')) {
      this.route.params.subscribe(params => {
        if (params.id) {
        this.mainservice.courseId = this.sessionstorage.get('course_id');
          this.getCards(params.id, this.mainservice.courseId, params.unit_id);
          this.mainservice.urlId = params.id;
          this.mainservice.unitId = params.unit_id;
          this.image_url = this.mainservice.service_url + 'Api/uploads/grammar/' + this.mainservice.courseId + '/' + params.id + '/';
        } else {
          this.router.navigateByUrl('/login');
        }
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }

}