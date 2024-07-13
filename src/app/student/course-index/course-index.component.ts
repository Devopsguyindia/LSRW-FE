import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  MainService
} from '../main.service';
import {
  CourseIndexService
} from './course-index.service';
import {
  CookieService
} from 'ngx-cookie-service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-course-index',
  templateUrl: './course-index.component.html',
  styleUrls: ['./course-index.component.css']
})
export class CourseIndexComponent implements OnInit {
  page;
  id;
  closeResult: string;
  disabled = true;
  topics: any = [];
  topicData: any = [];
  topicImage;
  image_url;
  showDialog = false;
  // tslint:disable-next-line:max-line-length
  constructor(private modalService: NgbModal, private route: ActivatedRoute, private router: Router, public sessionstorage: CookieService, public mainservice: MainService, public courseservice: CourseIndexService) {
    this.page = '/' + this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2];
  }

  getTopics() {
    const obj = {
      id: this.mainservice.urlId,
      user_id: JSON.parse(this.sessionstorage.get('client_data')).id
    };
    this.courseservice.getTopicsById(obj).subscribe(data => {
      this.topics = data;
      if (this.topics.status === 1) {
        this.topicData = this.topics.data;
        if (this.topicData.progress === 1) {
          this.mainservice.vocabDisabled = false;
          this.mainservice.pronDisabled = true;
          this.mainservice.pracDisabled = true;
          this.mainservice.grammDisabled = true;
          this.mainservice.convDisabled = true;
        } else if (this.topicData.progress === 2) {
          this.mainservice.vocabDisabled = false;
          this.mainservice.pronDisabled = false;
          this.mainservice.pracDisabled = true;
          this.mainservice.grammDisabled = true;
          this.mainservice.convDisabled = true;
        } else if (this.topicData.progress === 3) {
          this.mainservice.vocabDisabled = false;
          this.mainservice.pronDisabled = false;
          this.mainservice.pracDisabled = true;
          this.mainservice.grammDisabled = false;
          this.mainservice.convDisabled = true;
        } else if (this.topicData.progress === 4) {
          this.mainservice.vocabDisabled = false;
          this.mainservice.pronDisabled = false;
          this.mainservice.pracDisabled = true;
          this.mainservice.grammDisabled = false;
          this.mainservice.convDisabled = false;
        } else if (this.topicData.progress >= 5) {
          this.mainservice.vocabDisabled = false;
          this.mainservice.pronDisabled = false;
          this.mainservice.pracDisabled = false;
          this.mainservice.grammDisabled = false;
          this.mainservice.convDisabled = false;
        }
        this.topicImage = this.topicData.image_file_path;
      }
    });
  }

  addActiveClass(currentPage) {
    this.page = currentPage;
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  ngOnInit() {
    this.mainservice.urlId = this.router.url.split('/')[3];
    if (this.sessionstorage.get('names')) {
      this.mainservice.topicName = JSON.parse(this.sessionstorage.get('names')).topicName;
      this.mainservice.courseName = JSON.parse(this.sessionstorage.get('names')).courseName;
    } else {
      const obj = {
        'topicName': this.mainservice.topicName,
        'courseName': this.mainservice.courseName
      };
      this.sessionstorage.set('names', JSON.stringify(obj));
    }
    this.image_url = this.mainservice.service_url + 'Api/uploads/';
    this.getTopics();
  }
}