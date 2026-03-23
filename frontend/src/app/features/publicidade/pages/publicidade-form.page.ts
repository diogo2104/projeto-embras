import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { PublicidadeService } from '../../../core/services/publicidade.service';
import { EstadoService } from '../../../core/services/estado.service';
import { AppMessageService } from '../../../core/services/message.service';
import { PublicidadePayload } from '../../../core/models/publicidade.model';

@Component({
  selector: 'app-publicidade-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
    TextareaModule
  ],
  template: `
    <section class="modal-page">
      <div class="modal-card publicidade-modal">
        <div class="modal-header">
          <h2>{{ editMode() ? 'Editar publicidade' : 'Nova publicidade' }}</h2>

          <button
            pButton
            type="button"
            icon="pi pi-times"
            text
            rounded
            class="close-icon-btn"
            (click)="goBack()"
          ></button>
        </div>

        <form [formGroup]="form" class="publicidade-form" (ngSubmit)="save()">
          <div class="field full-width">
            <label for="estado_ids">Estados contemplados *</label>
            <p-multiSelect
              inputId="estado_ids"
              [options]="estadoOptions()"
              formControlName="estado_ids"
              optionLabel="label"
              optionValue="value"
              placeholder="Selecione"
              [filter]="true"
              display="chip"
              styleClass="w-full"
            ></p-multiSelect>
          </div>

          <div class="field full-width">
            <label for="titulo">Título *</label>
            <input pInputText id="titulo" formControlName="titulo" />
          </div>

          <div class="field full-width">
            <label for="descricao">Descrição *</label>
            <textarea
              pTextarea
              id="descricao"
              rows="4"
              formControlName="descricao"
            ></textarea>
          </div>

          <div class="field half-width">
            <label for="titulo_botao_link">Título do botão *</label>
            <input pInputText id="titulo_botao_link" formControlName="titulo_botao_link" />
          </div>

          <div class="field half-width">
            <label for="botao_link">Link do botão *</label>
            <input pInputText id="botao_link" formControlName="botao_link" />
          </div>

          <div class="field half-width">
            <label for="dt_inicio">Data de publicação *</label>
            <input pInputText id="dt_inicio" type="date" formControlName="dt_inicio" />
          </div>

          <div class="field half-width">
            <label for="dt_fim">Data final da publicidade *</label>
            <input pInputText id="dt_fim" type="date" formControlName="dt_fim" />
          </div>

          <div class="field full-width">
            <label class="upload-section-title">IMAGEM DA PUBLICIDADE</label>

            <div class="upload-box">
              @if (!selectedImageName()) {
                <div class="upload-placeholder">
                  <i class="pi pi-cloud-upload upload-big-icon"></i>
                  <p>Selecione o arquivo ou arraste aqui para adicioná-lo.</p>

                  <button
                    pButton
                    type="button"
                    label="Selecionar arquivo"
                    icon="pi pi-paperclip"
                    class="select-file-btn"
                    (click)="fileInput.click()"
                  ></button>
                </div>
              } @else {
                <div class="upload-selected-compact">
                  <div class="upload-preview-row">
                    @if (previewUrl()) {
                      <img
                        [src]="previewUrl()!"
                        alt="Pré-visualização da imagem"
                        class="upload-thumb"
                      />
                    }

                    <div class="upload-file-name">
                      {{ selectedImageName() }}
                    </div>
                  </div>

                  <button
                    pButton
                    type="button"
                    icon="pi pi-trash"
                    text
                    rounded
                    class="upload-remove-icon"
                    (click)="removeSelectedFile(fileInput)"
                  ></button>
                </div>
              }

              <input
                #fileInput
                type="file"
                accept="image/*"
                class="hidden-file-input"
                (change)="onFileSelected($event)"
              />
            </div>
          </div>

          <div class="form-actions full-width">
            <button
              pButton
              type="button"
              label="Cancelar"
              severity="secondary"
              outlined
              (click)="goBack()"
            ></button>

            <button
              pButton
              type="submit"
              label="Confirmar"
              [loading]="saving()"
            ></button>
          </div>
        </form>
      </div>
    </section>
  `
})
export class PublicidadeFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly publicidadeService = inject(PublicidadeService);
  private readonly estadoService = inject(EstadoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messages = inject(AppMessageService);

  readonly editMode = signal(false);
  readonly saving = signal(false);
  readonly estadoOptions = signal<{ label: string; value: number }[]>([]);
  readonly selectedImageFile = signal<File | null>(null);
  readonly selectedImageName = signal<string | null>(null);
  readonly previewUrl = signal<string | null>(null);

  private publicidadeId?: number;

  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    botao_link: ['', [Validators.required]],
    titulo_botao_link: ['', [Validators.required]],
    estado_ids: this.fb.nonNullable.control<number[]>([], [Validators.required]),
    dt_inicio: ['', [Validators.required]],
    dt_fim: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.estadoService.options().subscribe((options) => {
      this.estadoOptions.set(options);
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editMode.set(true);
      this.publicidadeId = Number(id);
      this.loadPublicidade(this.publicidadeId);
    }
  }

  loadPublicidade(id: number): void {
    this.publicidadeService.getById(id).subscribe((publicidade: any) => {
      this.form.patchValue({
        titulo: publicidade.titulo ?? '',
        descricao: publicidade.descricao ?? '',
        botao_link: publicidade.botao_link ?? '',
        titulo_botao_link: publicidade.titulo_botao_link ?? '',
        estado_ids: Array.isArray(publicidade.estados)
          ? publicidade.estados.map((estado: any) => estado.id)
          : [],
        dt_inicio: publicidade.dt_inicio ?? '',
        dt_fim: publicidade.dt_fim ?? ''
      });

      if (publicidade.imagem_url) {
        this.previewUrl.set(publicidade.imagem_url);
        this.selectedImageName.set('imagem-publi.png');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedImageFile.set(file);
    this.selectedImageName.set(file ? file.name : null);

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.previewUrl.set(reader.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      this.previewUrl.set(null);
    }
  }

  removeSelectedFile(fileInput: HTMLInputElement): void {
    this.selectedImageFile.set(null);
    this.selectedImageName.set(null);
    this.previewUrl.set(null);
    fileInput.value = '';
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.messages.warn('Campos obrigatórios', 'Preencha os campos obrigatórios.');
      return;
    }

    if (!this.editMode() && !this.selectedImageFile()) {
      this.messages.warn('Imagem obrigatória', 'Selecione uma imagem para a publicidade.');
      return;
    }

    const raw = this.form.getRawValue();

    const payload: PublicidadePayload = {
      titulo: raw.titulo,
      descricao: raw.descricao,
      botao_link: raw.botao_link,
      titulo_botao_link: raw.titulo_botao_link,
      dt_inicio: raw.dt_inicio,
      dt_fim: raw.dt_fim,
      estado_ids: raw.estado_ids,
      imagem: this.selectedImageFile() ?? undefined
    };

    const request$ = this.editMode() && this.publicidadeId
      ? this.publicidadeService.update(this.publicidadeId, payload)
      : this.publicidadeService.create(payload);

    this.saving.set(true);

    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.messages.success('Publicidade salva', 'A publicidade foi salva com sucesso.');
          this.router.navigate(['/publicidades']);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/publicidades']);
  }
}