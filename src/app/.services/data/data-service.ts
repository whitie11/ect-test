import { Injectable, signal} from '@angular/core';
import { ServiceUser } from '../../.models/service-user';

@Injectable({
  providedIn: 'root',
})
export class DataService {
private serviceUser =signal<ServiceUser | null>(null);

setServiceUser(serviceUser: ServiceUser | null) {
  this.serviceUser.set(serviceUser);
}

getServiceUser() {
  return this.serviceUser();
}
} 
