import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Appointment } from '../../.models/appointment';
import { Observable } from 'rxjs';
import { NewApptDTO } from '../../.dtos/newApptDTO';

@Injectable({
  providedIn: 'root',
})
export class ApptService {

     constructor(
    private http: HttpClient,
  ) { }
  
   apiRoot = environment.apiRoot;

   getAllAppointments():  Observable<Appointment[]> {
     return this.http.get<Appointment[]>(this.apiRoot.concat(`/appts/get_all`));
   }

   saveAppt(appt: NewApptDTO) : Observable<Appointment> | null{
      try {
      let data =  this.http.post<Appointment>(this.apiRoot.concat(`appts/new_appt`), appt);
      return data
     } catch (error) {
       return null
      } 
     
     }
}
