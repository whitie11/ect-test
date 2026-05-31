import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ServiceUserService } from '../../../.services/serviceUser/service-user-service';
import { ServiceUser, ServiceUserModel } from '../../../.models/service-user';
import { DatePipe } from '@angular/common';
import { ReferralsService } from '../../../.services/referrals/referrals-service';
import { GenderEnum } from '../../../.enums/gender';
import { form, FormField, required } from '@angular/forms/signals';
import { FuncsService } from '../../../.utils/getEnumKeyByEnumValue';
import { NewServiceUserDTO } from '../../../.dtos/newServiceUserDTO';
import { DataService } from '../../../.services/data/data-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-save-su',
  imports: [DatePipe, FormField],
  templateUrl: './find-save-su.html',
  styleUrl: './find-save-su.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindSaveSU {
  private suService = inject(ServiceUserService);
  private referralService = inject(ReferralsService);
  private funcsService = inject(FuncsService);
  private dataService = inject(DataService);
  private router = inject(Router);

  private datePipe = inject(DatePipe);

  serviceUserQueryNHS = signal<string>('');

  genderEnum = GenderEnum;
  genderOptions = Object.values(this.genderEnum)

  serviceUser = signal<ServiceUser | null>(null);

  serviceUserModel = signal<ServiceUserModel>({
    firstname: '',
    lastname: '',
    midname: '',
    dob: null,
    nhsNo: '',
    gender: GenderEnum.UNSPECIFIED
  });

  serviceUserForm = form(this.serviceUserModel, (schemaPath) => {
    required(schemaPath.firstname, { message: 'First name is required' });
    required(schemaPath.lastname, { message: 'Last name is required' });
    required(schemaPath.dob, { message: 'Date of Birth is required' });
    required(schemaPath.gender, { message: 'Gender is required' });
  }
  );

  stateFlags = signal({
    searching: signal<boolean>(false),
    serviceUserFound: signal<boolean>(false),
    referralOpenForSU: signal<boolean>(false),
    canGetSUdetails: signal<boolean>(false)
  });

  validNHS = signal<boolean>(false);

  checkNHS() {
    const length = this.serviceUserQueryNHS().length;
    if (length === 10) {
      this.validNHS.set(true);
      this.stateFlags().searching.set(true);
      this.suService.getSUbyNHS(this.serviceUserQueryNHS()).subscribe({
        next: (data) => {
          console.log('Service User fetched successfully', data);
          const res = JSON.parse(JSON.stringify(data));
          this.stateFlags().canGetSUdetails.set(false);
         
          this.serviceUser.set(res.serviceUser);
          // TODO test if referral is aready open for this SU and if so show message and details of open referral
          this.referralService.getReferralServiceUser(res.serviceUser.id).subscribe({
            next: (data) => {
              console.log('Referral Service User fetched successfully', data);
              const res = JSON.parse(JSON.stringify(data));
              if (res.isOpen) {
                 this.stateFlags().serviceUserFound.set(true);
                this.stateFlags().referralOpenForSU.set(true);
                alert('A referral is already open for this service user. Please see details of open referral.');
                // TODO show details of open referral
              } else {
                this.stateFlags().searching.set(false);
                this.stateFlags().serviceUserFound.set(true);
                this.stateFlags().referralOpenForSU.set(false);
                this.dataService.setServiceUser(this.serviceUser());
              }
              this.stateFlags().searching.set(false);
            },
            error: (error) => {
              this.stateFlags().searching.set(false);
              this.stateFlags().serviceUserFound.set(true);
              this.stateFlags().referralOpenForSU.set(false);
              console.error('Error fetching referral service user:', error);
            }
          });
        },
        error: (error) => {
          this.stateFlags().searching.set(false);
          // console.error('Error fetching referral service user:', error);
          this.stateFlags().serviceUserFound.set(false);
          this.stateFlags().canGetSUdetails.set(true);
          this.serviceUserForm.nhsNo().value.set(this.serviceUserQueryNHS());
          let x = error.status
        }
      });
    } else {
      alert('NHS number must be 10 characters long');
      this.validNHS.set(false);
    }

  };

  resetForm() {
    this.serviceUserQueryNHS.set('');
    this.validNHS.set(false);
    this.stateFlags().searching.set(false);
    this.stateFlags().serviceUserFound.set(false);
    this.stateFlags().referralOpenForSU.set(false);
    this.stateFlags().canGetSUdetails.set(false);
  }

  onSubmit(e: Event) {
    e.preventDefault();
    console.log('Submitting new Service User:');
    // TODO call service to save new SU and open referral
    this.stateFlags().searching.set(true);
    const model = this.serviceUserModel();
    if (!model) {
      console.error('No service user model available to save.');
      return false;
    }
    let newServiceUserDTO: NewServiceUserDTO = {
      firstname: model.firstname,
      lastname: model.lastname,
      midname: model.midname,
      dob: this.datePipe.transform(model.dob, "yyyy-MM-dd") || '',
      nhsNo: model.nhsNo,
      gender: this.funcsService.getEnumKeyByEnumValue(GenderEnum, model.gender) || '',
    };

    const saveResult = this.suService.saveSU(newServiceUserDTO);
    if (!saveResult) {
      console.error('Save service returned no observable.');
      return false;
    }

    saveResult.subscribe({
      next: (data) => {
        console.log('Service User saved successfully', data);
        this.stateFlags().searching.set(false);
        this.dataService.setServiceUser(this.serviceUser());
        // TODO handle successful save
        this.router.navigate(['home/referrals/newReferral/' + data.id]);
      },
      error: (error) => {
        console.error('Error saving Service User:', error);
        this.stateFlags().searching.set(false);
        this.dataService.setServiceUser(null);
        // TODO handle save error
      }
    });
    return false;
  }

  createReferral() {
    const su = this.serviceUser();
    if (!su) {
      console.error('No service user available to create referral for.');
      return;
    }
    this.dataService.setServiceUser(su);
    this.router.navigate(['home/referrals/newReferral/' + su.id]);
  } 

}
