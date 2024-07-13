import {
  Component,
  OnInit
} from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import {
  Observable
} from 'rxjs';
import {
  map
} from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  MainService
} from '../main.service';

@Component({
  selector: 'app-sidebar1',
  templateUrl: './sidebar1.component.html',
  styleUrls: ['./sidebar1.component.css']
})
export class Sidebar1Component implements OnInit {
  user1 = {};
  userId;
  isHandset$: Observable < boolean > = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  // tslint:disable-next-line:max-line-length
  constructor(private breakpointObserver: BreakpointObserver, public local: CookieService, public router: Router, public mainservice: MainService) {}

  public logout() {
    this.mainservice.logout();
    this.ngOnInit();
  }

  ngOnInit() {
    if (JSON.parse(this.local.get('user_data'))) {
      this.mainservice.loginFlag = true;
        this.mainservice.userName = JSON.parse(this.local.get('user_data')).org_name;
        this.mainservice.sidebarFlag = JSON.parse(this.local.get('user_data')).role_id;
      this.userId = JSON.parse(this.local.get('user_data')).id;
    } else {
      this.router.navigateByUrl('login');
      this.mainservice.loginFlag = false;
    }
  }

}
