import { Component } from '@angular/core';
import {Word} from "../../models/word";
import {WordService} from "../../services/word.service";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  query: string = '';
  dictionaryType: string = 'frToTarifit'; // Définir Français -> Tarifit par défaut
  wordResults: Word[] = [];

  constructor(private wordService: WordService) {}

  search() {
    if (this.query.trim() !== '') {
      if (this.dictionaryType === 'frToTarifit') {
        this.wordService.searchByFrench(this.query).subscribe(data => {
          this.wordResults = data;
        });
      } else {
        this.wordService.searchByTarifit(this.query).subscribe(data => {
          this.wordResults = data;
        });
      }
    }
  }

  playAudio(audioUrl: string) {
    let audio = new Audio(audioUrl);
    audio.play();
  }
}
