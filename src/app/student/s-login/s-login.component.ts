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
import swal from 'sweetalert2';
import {
  MainService
} from '../main.service';
import {
  CookieService
} from 'ngx-cookie-service';
// import {
//   AuthService,
//   FacebookLoginProvider,
//   GoogleLoginProvider
// } from 'angular-6-social-login';
import {
  Location
} from '@angular/common';
import {
  LoginService
} from './login.service';
import {
  LocalStorageService,
} from 'angular-web-storage';


@Component({
  selector: 'app-s-login',
  templateUrl: './s-login.component.html',
  styleUrls: ['./s-login.component.css']
})
export class SLoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  user: any = {};
  users: any = [];

  constructor(private route: ActivatedRoute,
    // tslint:disable-next-line:max-line-length
    private router: Router, private loginservice: LoginService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService, public local: LocalStorageService) {}

    onSubmit(user) {
      user.role_id = 4;
      this.rememberMe (user);
      this.loginservice.loginUser(user).subscribe(data => {
        this.users = data;
        if (this.users.status === 1) {
          swal({
            title: 'Success!',
            text: this.users.message,
            type: 'success',
            confirmButtonText: 'Ok'
          });
          this.sessionstorage.set('client_data', JSON.stringify(this.users.data));
          this.router.navigateByUrl('/');
          this.mainservice.loginFlag = true;
          this.mainservice.username = JSON.parse(this.sessionstorage.get('client_data')).first_name;
          this.loginForm.reset();
          Object.keys(this.loginForm.controls).forEach((name) => {
            this.loginForm.controls[name].setErrors(null);
          });
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


    rememberMe (user) {
      if (user.remember) {
        const arr = [];
        if (this.local.get('remember_me')) {
          for (let i = 0; i < this.local.get('remember_me').length; i++) {
            arr.push(this.local.get('remember_me')[i]);
          }
          arr.push({
            'email': user.email,
            'password': user.password,
            'url': window.location.href
          });
        } else {
          arr.push({
            'email': user.email,
            'password': user.password,
            'url': window.location.href
          });
        }
        this.local.set('remember_me', arr);
      } else {
        if (this.local.get('remember_me')) {
          const arr1 = [];
          for (let i = 0; i < this.local.get('remember_me').length; i++) {
            arr1.push(this.local.get('remember_me')[i]);
            if (arr1[i].email === user.email && arr1[i].password === user.password) {
              arr1.splice(i, 1);
            }
          }
          this.local.set('remember_me', arr1);
        }
      }
    }


  ngOnInit() {
    if (this.sessionstorage.get('client_data')) {
      this.router.navigateByUrl('/');
    } else {
    this.router.navigateByUrl('/login');
      this.mainservice.loginFlag = false;
      }
  }

}
