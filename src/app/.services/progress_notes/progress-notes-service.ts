import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ProgressNotesResponse } from './models/progress_notes_response';
import { NewNoteDTO } from '../../.dtos/newNoteDTO';


@Injectable({
  providedIn: 'root',
})

export class ProgressNotesService {
    constructor(
    private http: HttpClient,
  ) { }
  
   apiRoot = environment.apiRoot;

   getNotesForReferral(id: number): Observable<ProgressNotesResponse[]> {
    return this.http.get<ProgressNotesResponse[]>(this.apiRoot.concat(`progress_notes_referral/${id}`));
   }

   addNoteReferral(newNote: NewNoteDTO): Observable<number> {
    return this.http.post<number>(this.apiRoot.concat("/progress_notes_referral/add"),newNote)
   }
  }