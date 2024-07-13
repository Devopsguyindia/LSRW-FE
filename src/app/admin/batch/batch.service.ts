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
export class BatchService {
  service_url = this.mainservice.service_url;
  constructor(private http: HttpClient, public mainservice: MainService) {}

  saveBatch(user) {
    return this.http.post(this.service_url + 'saveBatch', user);
  }

  editBatch(user) {
    return this.http.post(this.service_url + 'editBatch', user);
  }

  getBatchs(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'getBatchs', obj);
  }

  getBatchStudents(obj) {
    return this.http.post(this.service_url + 'getBatchStudents', obj);
  }

  getCourses() {
    const obj = {
      id: 0
    };
    return this.http.post(this.service_url + 'getBatchCourses', obj);
  }

  searchBatch(obj) {
    return this.http.post(this.service_url + 'searchBatch', obj);
  }

  deleteBatchs(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'deleteBatchs', obj);
  }

  deleteStudentBatch(obj) {
    return this.http.post(this.service_url + 'deleteStudentBatch', obj);
  }

  getBatchById(id) {
    const obj = {
      id: id
    };
    return this.http.post(this.service_url + 'getBatchById', obj);
  }
}
