import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Word} from "../models/word";

@Injectable({
  providedIn: 'root'
})
export class WordService {

  private apiUrl = 'http://localhost:3000/words';

  constructor(private http: HttpClient) {}

  // Rechercher un mot en Français -> Tarifit
  searchByFrench(query: string): Observable<Word[]> {
    return this.http.get<Word[]>(`${this.apiUrl}?wordFr=${query}`);
  }

  // Rechercher un mot en Tarifit -> Français
  searchByTarifit(query: string): Observable<Word[]> {
    return this.http.get<Word[]>(`${this.apiUrl}?wordTarifit=${query}`);
  }

  getWords(): Observable<Word[]> {
    return this.http.get<Word[]>(this.apiUrl);
  }

  // Ajouter un nouveau mot
  addWord(word: Word): Observable<Word> {
    return this.http.post<Word>(this.apiUrl, word);
  }

  // Mettre à jour un mot existant
  updateWord(word: Word): Observable<Word> {
    if (!word.id) {
      throw new Error('Word ID is required for update.');
    }
    return this.http.put<Word>(`${this.apiUrl}/${word.id}`, word);
  }

  // Supprimer un mot
  deleteWord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

