import {
  Injectable
} from '@angular/core';
import {
  CookieService
} from 'ngx-cookie-service';
import {
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  loginFlag = false;
  username;
  logoFile;
  urlId;
  courseId;
  language_code = 'en-GB';
  voice_code = 'Google UK English Female';
  native_language_code = 'hi-IN';
  native_voice_code = 'Google हिन्दी';
  service_url = 'http://localhost:8080/';
  vocabDisabled = true;
  pronDisabled = true;
  grammDisabled = true;
  convDisabled = true;
  pracDisabled = true;
  topicName;
  courseName;
  unitId;
  constructor(public cookies: CookieService, private router: Router) {}

  public logout() {
    this.cookies.delete('client_data');
    this.loginFlag = false;
    this.router.navigateByUrl('/login');
    window.location.reload();
  }
}