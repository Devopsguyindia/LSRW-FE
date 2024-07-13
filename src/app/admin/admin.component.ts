import { Component, OnInit } from '@angular/core';
import { MainService } from './main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(public mainservice: MainService, public sessionstorage: CookieService, private router: Router) { }

  ngOnInit() {
      if (this.sessionstorage.get('user_data')) {
      this.mainservice.loginFlag = true;
   } else {
    this.router.navigateByUrl('/admin/login');
   }
  }

}
