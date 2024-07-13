import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  MainService
} from '../main.service';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {

  service_url =  this.mainservice.service_url;
  constructor(private http: HttpClient, public mainservice: MainService) {}

  getCards(topic_id, course_id) {
    const obj = {
      topic_id: topic_id,
      course_id: course_id,
      section_id: 1,
      unit_id: 0
    };
    return this.http.post(this.service_url + 'getCards', obj);
  }
}
