import {
  Component,
  OnInit
} from '@angular/core';
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
import {
  DashboardService
} from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
courses: any = [];
courseData: any = [];
progress: any = [];
progressData: any = {};
image_url = this.mainservice.service_url + 'Api/uploads/';
slideConfig = {'slidesToShow': 1, 'slidesToScroll': 1};
public doughnutChartLabels = ['Read', 'Write', 'Speak', 'Listen'];
public doughnutChartData = [120, 150, 180, 90];
public doughnutChartType = 'doughnut';
  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private router: Router, public sessionstorage: CookieService, public mainservice: MainService) {
    this.progressData.read_score = 0;
      this.progressData.write_score = 0;
      this.progressData.speak_score = 0;
      this.progressData.listen_score = 0;
  }

  getCourses(id) {
    this.dashboardService.getCourses(id).subscribe(data => {
      this.courses = data;
      if (this.courses.status === 1) {
        this.courseData = this.courses.data;
      } else {
        swal({
          title: 'Oops!',
          text: this.courses.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  getProgress(id) {
    this.dashboardService.getProgress(id).subscribe(data => {
      this.progress = data;
      if (this.progress.status === 1) {
        this.progressData = this.progress.data;
        this.progressData.read_score = Math.round(this.progressData.read_score);
        this.progressData.write_score = Math.round(this.progressData.write_score);
        this.progressData.speak_score = Math.round(this.progressData.speak_score);
        this.progressData.listen_score = Math.round(this.progressData.listen_score);
          // tslint:disable-next-line:max-line-length
        this.doughnutChartData = [this.progressData.read_score, this.progressData.write_score, this.progressData.speak_score, this.progressData.listen_score];
      } else {
        swal({
          title: 'Oops!',
          text: this.progress.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  ngOnInit() {
    if (this.sessionstorage.get('client_data')) {
      this.getCourses(JSON.parse(this.sessionstorage.get('client_data')).id);
      this.getProgress(JSON.parse(this.sessionstorage.get('client_data')).id);
      this.mainservice.username = JSON.parse(this.sessionstorage.get('client_data')).first_name;
    } else {
      this.router.navigateByUrl('/login');
    }
  }

}
