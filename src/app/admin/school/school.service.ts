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
export class SchoolService {

  service_url = this.mainservice.service_url;
  constructor(private http: HttpClient, public mainservice: MainService) {}

  saveSchool(user) {
    return this.http.post(this.service_url + 'saveSchool', user);
  }

  getCountries() {
    const obj = {
      country_id: 1
    };
    return this.http.post(this.service_url + 'getCountries', obj);
  }

  getStates(country_id) {
    const obj = {
      country_id: country_id
    };
    return this.http.post(this.service_url + 'getStates', obj);
  }

  getCities(state_id) {
    const obj = {
      state_id: state_id
    };
    return this.http.post(this.service_url + 'getCities', obj);
  }
}
