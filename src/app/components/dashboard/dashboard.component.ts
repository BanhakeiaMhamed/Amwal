import {Component, OnInit} from '@angular/core';
import {Word} from "../../models/word";
import {WordService} from "../../services/word.service";
import {NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class  DashboardComponent implements OnInit {
  words: Word[] = [];
  wordForm: FormGroup;
  editingWordId: string | null = null; // ✅ L'ID est de type string
  previewImage: string | undefined = undefined; // Stockage de l'aperçu de l'image

  constructor(private fb: FormBuilder, private wordService: WordService) {
    this.wordForm = this.fb.group({
      wordFr: ['', Validators.required],
      wordTarifit: ['', Validators.required],
      wordTifinagh: ['', Validators.required],
      phonetic: [''],
      synonyms: [''],
      examples: [''],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadWords();
  }

  loadWords(): void {
    this.wordService.getWords().subscribe((data) => (this.words = data));
  }

  saveWord(): void {
    if (this.wordForm.invalid) return;

    const formData = this.wordForm.value;
    formData.synonyms = formData.synonyms.split(',').map((s: string) => s.trim());
    formData.examples = formData.examples.split(',').map((e: string) => e.trim());

    if (this.editingWordId) {
      formData.id = this.editingWordId;
      this.wordService.updateWord(formData).subscribe(() => {
        this.loadWords();
        this.resetForm();
      });
    } else {
      // Générer un ID unique de type string
      formData.id = this.generateUniqueId();
      this.wordService.addWord(formData).subscribe(() => {
        this.loadWords();
        this.resetForm();
      });
    }
  }

  editWord(word: Word): void {
    this.editingWordId = word.id || null;
    this.wordForm.setValue({
      wordFr: word.wordFr,
      wordTarifit: word.wordTarifit,
      wordTifinagh: word.wordTifinagh,
      phonetic: word.phonetic,
      synonyms: word.synonyms.join(', '),
      examples: word.examples.join(', '),
      imageUrl: word.imageUrl
    });

    this.previewImage = word.imageUrl; // Afficher l'image actuelle si existante
  }

  deleteWord(id?: string): void {
    if (!id) {
      console.error("Impossible de supprimer : l'ID est indéfini.");
      return;
    }
    this.wordService.deleteWord(id).subscribe(() => this.loadWords());
  }

  resetForm(): void {
    this.wordForm.reset();
    this.editingWordId = null;
    this.previewImage = undefined;
  }

  // ✅ Génère un ID unique sous forme de string
  generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Gestion de l'importation de l'image
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result; // Afficher l'aperçu de l'image
        this.wordForm.patchValue({ imageUrl: e.target.result }); // Stocker l'image
      };
      reader.readAsDataURL(file);
    }
  }
}
