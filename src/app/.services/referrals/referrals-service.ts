import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ReferralRefResponse } from './models/referral-ref-response';
import { ReferralSuResponse } from './models/referral-su-response';
import { ReferralStageUpdateDto } from './models/referral-stage-update-dto';
import { StageEnum } from '../../.enums/stage';
import { NewReferralDTO } from '../../.dtos/newReferralDTO'
 
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
  
  getReferralDetails(id: number) : Observable<ReferralSuResponse>{
  return this.http.get<ReferralSuResponse>(this.apiRoot.concat(`referrals/${id}`));
  }

  getReferralServiceUser(id: number) : Observable<ReferralSuResponse>{
  return this.http.get<ReferralSuResponse>(this.apiRoot.concat(`referrals/get_open_su/${id}`));
  }

  updateReferralStage(ref: ReferralStageUpdateDto) : Observable<ReferralSuResponse> | null{
   try {
   let data =  this.http.patch<ReferralSuResponse>(this.apiRoot.concat(`referrals/update`), ref);
   return data
  } catch (error) {
    return null
   } 
  
  }

  getReferralsByStage(stage: string) : Observable<ReferralRefResponse[]>{
  return this.http.get<ReferralRefResponse[]>(this.apiRoot.concat(`referrals/stage/${stage}`))
  }

  saveReferral(ref: NewReferralDTO) : Observable<ReferralRefResponse> {
    return this.http.post<ReferralRefResponse>(this.apiRoot.concat('referrals/add'), ref)
  }
}

