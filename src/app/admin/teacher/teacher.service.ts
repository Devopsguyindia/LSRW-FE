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
export class TeacherService {

  service_url = this.mainservice.service_url;
  constructor(private http: HttpClient, public mainservice: MainService) {}

  saveTeacher(user) {
    return this.http.post(this.service_url + 'saveTeacher', user);
  }

  editTeacher(user) {
    return this.http.post(this.service_url + 'editTeacher', user);
  }

  getTeachers(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'getTeachers', obj);
  }

  searchTeacher(obj) {
    return this.http.post(this.service_url + 'searchTeacher', obj);
  }

  deleteTeachers(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'deleteTeachers', obj);
  }

  getTeacherById(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'getTeacherById', obj);
  }
}
