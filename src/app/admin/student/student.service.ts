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
export class StudentService {

  service_url = this.mainservice.service_url;
  constructor(private http: HttpClient, public mainservice: MainService) {}

  saveStudent(user) {
    return this.http.post(this.service_url + 'saveStudent', user);
  }
  bulkSaveStudent(user) {
    return this.http.post(this.service_url + 'bulkSaveStudent', user);
  }

  editStudent(user) {
    return this.http.post(this.service_url + 'editStudent', user);
  }

  getStudents(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'getStudents', obj);
  }

  searchStudent(obj) {
    return this.http.post(this.service_url + 'searchStudent', obj);
  }

  deleteStudents(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'deleteStudents', obj);
  }

  getStudentById(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'getStudentById', obj);
  }
}