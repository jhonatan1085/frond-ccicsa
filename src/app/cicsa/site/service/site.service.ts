import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';
@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(
    public http:HttpClient,
    public authService:AuthService
  ) { }

  listSites(){
    let headers = new HttpHeaders({'Authorization':'Bearer ' + this.authService.token})
    let URL = URL_SERVICIOS+"/sites";
    return this.http.get(URL,{headers:headers});
    
  }
}
