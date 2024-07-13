import { Component, OnInit } from '@angular/core';
import {
  MainService
} from '../main.service';
import {
  UnitService
} from './unit.service';
import swal from 'sweetalert2';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  CookieService
} from 'ngx-cookie-service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {
  cardData: any = [];
  cards: any = [];
  unit_id;
  snell;
  // tslint:disable-next-line:max-line-length
  constructor(public mainservice: MainService, public unitservice: UnitService, private route: ActivatedRoute, private router: Router, public sessionstorage: CookieService) { 
    this.snell = 1;
  }
  getCards(topic_id, course_id) {
    this.unitservice.getCards(topic_id, course_id).subscribe(data => {
      this.cards = data;
      if (this.cards.status === 1) {
        this.cardData = this.cards.data;
      } else {
        swal({
          title: 'Oops!',
          text: this.cards.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  ngOnInit() {
    if (this.sessionstorage.get('client_data')) {
      this.route.params.subscribe(params => {
        if (params.id) {
          this.getCards(params.id, this.mainservice.courseId);
          this.mainservice.urlId = params.id;
          this.mainservice.courseId = this.sessionstorage.get('course_id');
        } else {
          this.router.navigateByUrl('/login');
        }
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }

}
