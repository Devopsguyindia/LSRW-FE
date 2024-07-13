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
export class DashboardService {

  service_url =  this.mainservice.service_url;
  constructor(private http: HttpClient, public mainservice: MainService) {}

  getCourses(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'getCourses', obj);
  }

  getProgress(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'getProgress', obj);
  }
}
