import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ReferralRefResponse } from './models/referral-ref-response';
import { ReferralSuResponse } from './models/referral-su-response';
import { ReferralStageUpdateDto } from './models/referral-stage-update-dto';

@Injectable({
  providedIn: 'root',
})
export class ReferralsService {

  constructor(
    private http: HttpClient,
  ) { }

  apiRoot = environment.apiRoot;

  getAllReferrals() : Observable<ReferralRefResponse[]>{
    return this.http.get<ReferralRefResponse[]>(this.apiRoot.concat('referrals/get_all_open'));
  } 
  
  getReferralServiceUser(id: number) : Observable<ReferralSuResponse>{
  return this.http.get<ReferralSuResponse>(this.apiRoot.concat(`referrals/${id}`));
  }

  updateReferralStage(ref: ReferralStageUpdateDto) : Observable<ReferralSuResponse>{
  return this.http.patch<ReferralSuResponse>(this.apiRoot.concat(`referrals/update`), ref);
  }
}

