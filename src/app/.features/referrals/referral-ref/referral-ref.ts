import { Component, Input } from '@angular/core';
import { ReferralRefResponse } from '../../../.services/referrals/models/referral-ref-response';
import { DatePipe} from '@angular/common';
@Component({
  selector: 'app-referral-ref',
  imports: [DatePipe],
  templateUrl: './referral-ref.html',
  styleUrl: './referral-ref.css',
})
export class ReferralRef {
@Input()
referral: ReferralRefResponse | null = null;
}
