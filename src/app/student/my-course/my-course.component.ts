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
  MyCourseService
} from './my-course.service';

@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.css']
})
export class MyCourseComponent implements OnInit {
  topics: any = [];
  topicData: any = [];
  courseName;
  endUser;
  searchuser1;
  p;
  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private myCourseService: MyCourseService, private router: Router, public sessionstorage: CookieService, public mainservice: MainService) {}

  getTopics(id) {
    const obj = {
      id: id,
      user_id: JSON.parse(this.sessionstorage.get('client_data')).id
    };
    this.myCourseService.getTopics(obj).subscribe(data => {
      this.topics = data;
      if (this.topics.status === 1) {
        this.topicData = this.topics.data;
        this.mainservice.native_language_code = this.topicData[0].from_language.code;
        this.mainservice.native_voice_code = this.topicData[0].from_language.voice;
        this.mainservice.language_code = this.topicData[0].to_language.code;
        this.mainservice.voice_code = this.topicData[0].to_language.voice;
      } else {
        swal({
          title: 'Oops!',
          text: this.topics.message,
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
          this.courseName = params.name;
          this.getTopics(params.id);
          this.sessionstorage.set('course_id', params.id);
          this.mainservice.courseId = params.id;
        } else {
          this.router.navigateByUrl('/login');
        }
      });
      this.mainservice.username = JSON.parse(this.sessionstorage.get('client_data')).first_name;
    } else {
      this.router.navigateByUrl('/login');
    }

    this.sessionstorage.delete('names', '');
  }
}
