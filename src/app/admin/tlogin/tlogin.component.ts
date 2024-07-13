import {
  Component,
  OnInit,
  Directive,
  ElementRef,
  Renderer
} from '@angular/core';
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
import {
  TloginService
} from './tlogin.service';
import swal from 'sweetalert2';
import {
  MainService
} from '../main.service';

import {
  CookieService
} from 'ngx-cookie-service';

@Component({
  selector: 'app-tlogin',
  templateUrl: './tlogin.component.html',
  styleUrls: ['./tlogin.component.css']
})
export class TloginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  user:any = {};
  users: any = [];
  userId;
  // email;
  // password;

  constructor(private route: ActivatedRoute,
    // tslint:disable-next-line:max-line-length
    private router: Router, private loginservice: TloginService, private fb: FormBuilder, public local: CookieService, public mainservice: MainService) {}

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(user, formDirective: FormGroupDirective) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    user.role_id = 3;
    this.loginservice.loginUser(user).subscribe(data => {
      this.users = data;
      if (this.users.status === 1) {
        swal({
          title: 'Success!',
          text: this.users.message,
          type: 'success',
          confirmButtonText: 'Ok'
        })
        this.local.set('user_data', JSON.stringify(this.users.data));
        this.router.navigateByUrl('/school/batch-enrollment');
        this.mainservice.loginFlag = true;
        this.mainservice.userName = JSON.parse(this.local.get('user_data')).org_name;
        this.userId = JSON.parse(this.local.get('user_data')).id;
        this.mainservice.sidebarFlag = JSON.parse(this.local.get('user_data')).role_id;
        formDirective.resetForm();
        this.loginForm.reset();
      } else {
        swal({
          title: 'Oops!',
          text: this.users.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        })
      }
    });
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    if (this.local.get('user_data')) {
      this.router.navigateByUrl('/school/dashboard');
    } else {
      this.mainservice.loginFlag = false;
      this.router.navigateByUrl('/school/teacher-login');
    }
  }

}
