import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BitacorasService {

  constructor(
    public http:HttpClient,
    public authService:AuthService
  ) { }

 /*  listSites(page:number = 1, search:string = ''){
    let headers = new HttpHeaders({'Authorization':'Bearer ' + this.authService.token})
    let URL = URL_SERVICIOS+"/sites?page="+page+"&search="+search;
    return this.http.get(URL,{headers:headers});
  } */

  listConfig(){
    let headers = new HttpHeaders({'Authorization':'Bearer ' + this.authService.token})
    let URL = URL_SERVICIOS+"/bitacoras/config";
    return this.http.get(URL,{headers:headers});
  }

  registerSite(data:any){
    let headers = new HttpHeaders({'Authorization':'Bearer ' + this.authService.token})
    let URL = URL_SERVICIOS+"/sites";
    return this.http.post(URL,data, {headers:headers});
  }
  
//retorna la provincia
  showProvinciasDep(dep_id:string){
    let headers = new HttpHeaders({'Authorization':'Bearer ' + this.authService.token})
    let URL = URL_SERVICIOS+"/provinciasdep/"+dep_id;
    return this.http.get(URL,{headers:headers});
  }
  showDistritoProv(dist_id:string){
    let headers = new HttpHeaders({'Authorization':'Bearer ' + this.authService.token})
    let URL = URL_SERVICIOS+"/distritoprov/"+dist_id;
    return this.http.get(URL,{headers:headers});
  }

  showSite(site_id:string){
    let headers = new HttpHeaders({'Authorization':'Bearer ' + this.authService.token})
    let URL = URL_SERVICIOS+"/sites/"+site_id;
    return this.http.get(URL,{headers:headers});
    
  }

  updateSite(site_id:string, data:any){
    let headers = new HttpHeaders({'Authorization':'Bearer ' + this.authService.token})
    let URL = URL_SERVICIOS+"/sites/"+ site_id;
    return this.http.post(URL,data,{headers:headers});
  }
}
