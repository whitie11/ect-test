import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { ServiceUser } from '../../../.models/service-user';
import { DataService } from '../../../.services/data/data-service';
import { DatePipe } from '@angular/common';
import { NewReferralDTO } from '../../../.dtos/newReferralDTO';
import { email, form, FormField, required } from '@angular/forms/signals';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar} from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { ReferralsService } from '../../../.services/referrals/referrals-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-referral',
  imports: [DatePipe, FormField, NgxEditorComponent, NgxEditorMenuComponent, FormsModule],
  templateUrl: './new-referral.html',
  styleUrl: './new-referral.css',
})
export class NewReferral {
  dataService = inject(DataService);
  referralService = inject(ReferralsService)
  router = inject(Router)

  suId = input(0, { transform: numberAttribute });

  serviceUser = signal<ServiceUser | null>(null);

  referralModel = signal({
    serviceUserId: 0,
    referrer: '',
    referrersEmail: '',
    reason: ''
  })

  referralForm = form(this.referralModel, ref => {
    required(ref.referrer, { message: 'Name of Referrer is required' });
    required(ref.referrersEmail, { message: 'Referrers email is required' })
    email(ref.referrersEmail, { message: "Enter a valid email address" });
    required(ref.reason)
  })

    editor = new Editor();
    editorContent = ''
    characterCount = 0;
    textError = signal<string>('')

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  ngOnInit() {
    console.log('New Referral component initialized with suId:', this.suId());
    this.serviceUser.set(this.dataService.getServiceUser());
  }

updateEditorChanges() {
        const text = this.editorContent.replace(/<[^>]*>/g, '');
        this.characterCount = text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .length;

        if (this.characterCount === 0 ){

        
            this.textError.set('Referral reason must be given');
            this.editorContent = ''
        }
        else this.textError.set('');

        this.referralModel.update((ref) => ({...ref, reason: this.editorContent }));
}


  onSubmit() {
    const newRef: NewReferralDTO = {
      serviceUserId: this.suId(),
      referrer: this.referralModel().referrer,
      referrersEmail: this.referralModel().referrersEmail,
      reason: this.referralModel().reason
    }
      console.log('new referral = ' + newRef.toString())

      this.referralService.saveReferral(newRef).subscribe ({
         next: (data) => {
        console.log('Referral added successfully', data);
        //TODO redirect to ?
        this.router.navigate(['home/referrals/' + data.referralId])
      },
      error: (error) => {
        console.error('Error updating referral service user:', error);
        //TODO redirect
      }
      }) 
          
  }
}

