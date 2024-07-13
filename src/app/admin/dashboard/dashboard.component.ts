import {
  Component,
  OnInit
} from '@angular/core';
import {
  MainService
} from '../main.service';
import {
  CookieService
} from 'ngx-cookie-service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router, public sessionstorage: CookieService, public mainservice: MainService) {}


  ngOnInit() {
    if (this.sessionstorage.get('user_data')) {
      this.mainservice.loginFlag = true;
    } else {
      this.router.navigateByUrl('/school/login');
    }
  }

}
