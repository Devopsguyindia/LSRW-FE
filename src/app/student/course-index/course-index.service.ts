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
export class CourseIndexService {

  service_url =  this.mainservice.service_url;
  constructor(private http: HttpClient, public mainservice: MainService) {}

  updateProgress(obj) {
    return this.http.post(this.service_url + 'updateProgress', obj);
  }

  getTopicsById(obj) {
    return this.http.post(this.service_url + 'getTopicsById', obj);
  }
}
