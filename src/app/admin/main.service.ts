import {
  Injectable
} from '@angular/core';
import {
  CookieService
} from 'ngx-cookie-service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  loginFlag = false;
  userName;
  sidebarFlag;


    templateUrl = 'http://localhost:1337/';
  // templateUrl = 'http://18.222.244.130:8080/';
  // templateUrl = 'http://54.84.95.236:8080/';
  //  templateUrl = 'http://demo.sotstag.com:8080/';

    service_url = 'http://localhost:8080/';
  // service_url = 'http://18.222.244.130:8080/';
  // service_url = 'http://54.84.95.236:8080/';
  // service_url = 'http://demo.sotstag.com:8080/';

  constructor(public local: CookieService, public router: Router) {}

  public logout() {
    this.local.delete('user_data');
    this.loginFlag = false;
    this.router.navigateByUrl('/school/login');
  }

}
