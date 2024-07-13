import { Component, OnInit } from '@angular/core';
import {
  MainService
} from '../main.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  public spinkit = Spinkit;
  constructor(public mainservice: MainService, public cookies: CookieService, private router: Router) {}

  ngOnInit() {
    if (this.cookies.get('client_data')) {
      this.mainservice.loginFlag = true;
       this.mainservice.username = JSON.parse(this.cookies.get('client_data')).first_name;
      this.mainservice.logoFile = JSON.parse(this.cookies.get('client_data')).logo_file_path;
    } else {
      this.router.navigateByUrl('/login');
      this.mainservice.loginFlag = false;
    }
  }
}
