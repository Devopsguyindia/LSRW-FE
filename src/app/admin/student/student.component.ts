import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import swal from 'sweetalert2';
import {
  MainService
} from '../main.service';
import {
  StudentService
} from './student.service';
import {
  CookieService
} from 'ngx-cookie-service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  templateUrl = this.mainservice.templateUrl + 'api/uploads/';
  userForm: FormGroup;
  submitted = false;
  user: any = {};
  users: any = [];
  users1: any = [];
  clientList: any = [];
  editFlag = false;
  xlsxFile;
  formData = new FormData();
  endUser;
  searchuser1;
  p;
  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router, private studentservice: StudentService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService) { 
    this.user.gender = 'male';
  }


  get f() {
    return this.userForm.controls;
  }

  onSubmit(user) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }
    const obj = {
      arr: [user],
      school_id: JSON.parse(this.sessionstorage.get('user_data')).id
    };
    if (!this.editFlag) {
      this.studentservice.saveStudent(obj).subscribe(data => {
        this.users = data;
        if (this.users.status === 1) {
          swal({
            title: 'Success!',
            text: this.users.message,
            type: 'success',
            confirmButtonText: 'Ok'
          });
          this.clear();
          this.getStudents(JSON.parse(this.sessionstorage.get('user_data')).id);
        } else {
          swal({
            title: 'Oops!',
            text: this.users.message,
            type: 'warning',
            confirmButtonText: 'Ok'
          });
        }
      });
    } else {
      this.studentservice.editStudent(user).subscribe(data => {
        this.users = data;
        if (this.users.status === 1) {
          swal({
            title: 'Success!',
            text: this.users.message,
            type: 'success',
            confirmButtonText: 'Ok'
          });
          this.getStudents(JSON.parse(this.sessionstorage.get('user_data')).id);
          this.clear();
        } else {
          swal({
            title: 'Oops!',
            text: this.users.message,
            type: 'warning',
            confirmButtonText: 'Ok'
          });
        }
      });
    }
  }
  clear() {
    this.userForm.reset();

    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      std: ['', [Validators.required, Validators.maxLength(15)]],
      rollNo: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.maxLength(10)]],
      div: ['', [Validators.required, Validators.maxLength(10)]],
      gender: ['']
    });
    this.user.gender = 'male';
    this.editFlag = false;
    this.submitted = false;
  }

  getStudents(id) {
    this.studentservice.getStudents(id).subscribe(data => {
      this.users1 = data;
      if (this.users1.status === 1) {
        this.clientList = this.users1.data;
      } else {
        swal({
          title: 'Oops!',
          text: this.users1.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  getStudentById(id) {
    this.studentservice.getStudentById(id).subscribe(data => {
      this.users1 = data;
      if (this.users1.status === 1) {
        this.user = this.users1.data;
        this.editFlag = true;
      } else {
        swal({
          title: 'Oops!',
          text: this.users1.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  deleteStudent(id) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.studentservice.deleteStudents(id).subscribe(data => {
          this.users = data;
          if (this.users.status === 1) {
            swal({
              title: 'Success!',
              text: this.users.message,
              type: 'success',
              confirmButtonText: 'Ok'
            });
            this.getStudents(JSON.parse(this.sessionstorage.get('user_data')).id);
          } else {
            swal({
              title: 'Oops!',
              text: this.users.message,
              type: 'warning',
              confirmButtonText: 'Ok'
            });
          }
        });
      }
    });
  }

  upload (files: FileList) {
    // if (files[0].type === 'image/jpeg' || files[0].type === 'image/png' || files[0].type === 'image/jpg') {
        this.xlsxFile = files[0];
    // } else {
    //   swal({
    //     title: 'Oops!',
    //     text: 'Please select valid image format',
    //     type: 'warning',
    //     confirmButtonText: 'Ok'
    //   });
    // }
  }

  bulkUpload() {
    this.formData = new FormData();
    this.formData.append('school_id', JSON.parse(this.sessionstorage.get('user_data')).id);
    this.formData.append('xlsxFile', this.xlsxFile);
      this.studentservice.bulkSaveStudent(this.formData).subscribe(data => {
        this.users = data;
        if (this.users.status === 1) {
          swal({
            title: 'Success!',
            text: this.users.message,
            type: 'success',
            confirmButtonText: 'Ok'
          });
          this.getStudents(JSON.parse(this.sessionstorage.get('user_data')).id);
          this.clear();
        } else {
          swal({
            title: 'Oops!',
            text: this.users.message,
            type: 'warning',
            confirmButtonText: 'Ok'
          });
        }
      });
  }

  searchStudent(search) {
    const obj = {
      search : search,
      school_id : JSON.parse(this.sessionstorage.get('user_data')).id
    };
    this.studentservice.searchStudent(obj).subscribe(data => {
      this.users1 = data;
      if (this.users1.status === 1) {
        this.clientList = this.users1.data;
      } else {
        swal({
          title: 'Oops!',
          text: this.users1.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
        this.getStudents(JSON.parse(this.sessionstorage.get('user_data')).id);
      }
    });
  }


  ngOnInit() {

    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      std: ['', [Validators.required, Validators.maxLength(15)]],
      rollNo: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'), Validators.maxLength(10)]],
      div: ['', [Validators.required, Validators.maxLength(10)]],
      gender: ['']
    });
    if (this.sessionstorage.get('user_data')) {
      this.getStudents(JSON.parse(this.sessionstorage.get('user_data')).id);
      this.mainservice.loginFlag = true;
    } else {
      this.router.navigateByUrl('/school/login');
    }
  }

}
