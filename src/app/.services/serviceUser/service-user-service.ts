import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ServiceUser, ServiceUserModel } from '../../.models/service-user';
import { NewServiceUserDTO } from '../../.dtos/newServiceUserDTO';

@Injectable({
  providedIn: 'root',
})
export class ServiceUserService {
  apiRoot = environment.apiRoot;
  constructor(
    private http: HttpClient,
  ) { }

     getSUbyNHS(nhsNo: string): Observable<ServiceUser> {
     return this.http.get<ServiceUser>(this.apiRoot.concat(`/service_user_nhs/${nhsNo}`));
   }

    saveSU(su: NewServiceUserDTO): Observable<ServiceUser> | null {   
    try {
      let data = this.http.post<ServiceUser>(this.apiRoot.concat(`/serviceuseradd`), su);
      return data
    } catch (error) {
      return null
    }
  }

}
