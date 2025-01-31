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
export class MyCourseService {

  service_url =  this.mainservice.service_url;
  constructor(private http: HttpClient, public mainservice: MainService) {}

  getTopics(obj) {
    return this.http.post(this.service_url + 'getTopics', obj);
  }
}
