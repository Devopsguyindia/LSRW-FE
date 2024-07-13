import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective
} from '@angular/forms';
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
  SchoolService
} from '../school/school.service';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  templateUrl = this.mainservice.templateUrl + 'api/uploads/';
  userForm: FormGroup;
  submitted = false;
  user: any = {};
  countries: any = [];
  states: any = [];
  cities: any = [];
  data: any = [];
  data1: any = [];
  data2: any = [];
  users: any = [];

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private schoolservice: SchoolService, public sessionstorage: CookieService, public mainservice: MainService) {}

  get f() {
    return this.userForm.controls;
  }

  onSubmit(user) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }
    user.role = 2;
    user.status = 0;
    this.schoolservice.saveSchool(user).subscribe(data => {
      this.users = data;
      if (this.users.status === 1) {
        swal({
          title: 'Success!',
          text: this.users.message,
          type: 'success',
          confirmButtonText: 'Ok'
        });
        this.clear();
      } else {
        swal({
          title: 'Oops!',
          text: this.users.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
  clear() {
    this.userForm.reset();
    Object.keys(this.userForm.controls).forEach((name) => {
      this.userForm.controls[name].setErrors(null);
    });
  }

  getCountries() {
    this.schoolservice.getCountries().subscribe(data => {
      this.data = data;
      this.countries = this.data.data;
    });
  }

  getStates(country_id) {
    this.schoolservice.getStates(country_id).subscribe(data => {
      this.data1 = data;
      this.states = this.data1.data;
    });
  }

  getCities(state_id) {
    this.schoolservice.getCities(state_id).subscribe(data => {
      this.data2 = data;
      this.cities = this.data2.data;
    });
  }
  ngOnInit() {

    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{0,2})?$'),
        Validators.minLength(10), Validators.maxLength(15)
      ]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      password: ['', Validators.compose([
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}'),
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)
      ])],
      schoolCode: ['', [Validators.required, Validators.maxLength(10)]],
    });
    this.getCountries();
    if (this.sessionstorage.get('user_data')) {
      this.mainservice.loginFlag = true;
      this.router.navigateByUrl('/school/dahboard');
    } else {
      this.router.navigateByUrl('/school/registration');
    }
  }

}