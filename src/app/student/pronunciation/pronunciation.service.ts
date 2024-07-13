import {
  Injectable,
  NgZone
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  MainService
} from '../main.service';
import {
  Observable
} from 'rxjs';
import * as _ from 'lodash';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable({
  providedIn: 'root'
})
export class PronunciationService {
  speechRecognition: any;
  service_url = this.mainservice.service_url;
  constructor(private http: HttpClient, public mainservice: MainService, private zone: NgZone) {}

  getCards(topic_id, course_id) {
    const obj = {
      course_id: course_id,
      topic_id: topic_id,
      section_id: 2,
      unit_id: 0
    };
    return this.http.post(this.service_url + 'getCards', obj);
  }

  record(): Observable < string > {

    return Observable.create(observer => {
      const {
        webkitSpeechRecognition
      }: IWindow = < IWindow > window;
      this.speechRecognition = new webkitSpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.lang = 'en-us';
      this.speechRecognition.maxAlternatives = 1;

      this.speechRecognition.onresult = speech => {
        let term: String = '';
        if (speech.results) {
          const result = speech.results[speech.resultIndex];
          const transcript = result[0].transcript;
          if (result.isFinal) {
            if (result[0].confidence < 0.3) {
            } else {
              term = _.trim(transcript);
            }
          }
        }
        this.zone.run(() => {
          observer.next(term);
        });
      };

      this.speechRecognition.onerror = error => {
        observer.error(error);
      };

      this.speechRecognition.onend = () => {
        observer.complete();
      };

      this.speechRecognition.start();
    });
  }

  DestroySpeechObject() {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }
}