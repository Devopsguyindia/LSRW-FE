import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  MainService
} from '../main.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-s-header',
  templateUrl: './s-header.component.html',
  styleUrls: ['./s-header.component.css']
})
export class SHeaderComponent implements OnInit {
  @Input() logo: string ;
  @Input() userName: string ;
  templateUrl = this.mainservice.service_url + 'Api/uploads/';
  // tslint:disable-next-line:max-line-length
  constructor(public mainservice: MainService, private route: ActivatedRoute, private router: Router, public sessionstorage: CookieService) {}
    ngOnInit() {
      if (this.sessionstorage.get('user_data')) {
          this.mainservice.username = JSON.parse(this.sessionstorage.get('user_data')).user_name;
    }
  }
}
