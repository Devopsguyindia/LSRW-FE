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
export class ProgressService {
  service_url = this.mainservice.service_url;
  constructor(private http: HttpClient, public mainservice: MainService) {}

  getProgressByStudent(obj) {
    return this.http.post(this.service_url + 'getProgressByStudent', obj);
  }

  getProgressByTopic(obj) {
    return this.http.post(this.service_url + 'getProgressByTopic', obj);
  }
}
