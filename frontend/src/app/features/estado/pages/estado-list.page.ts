import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { Estado } from '../../../core/models/estado.model';
import { EstadoService } from '../../../core/services/estado.service';
import { AppMessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-estado-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    TableModule,
    ToolbarModule
  ],
  providers: [ConfirmationService],
  template: `
    <p-confirmdialog></p-confirmdialog>

    <p-card>
      <p-toolbar styleClass="page-toolbar">
        <ng-template #start>
          <div>
            <h2 class="page-title">Estados</h2>
            <p class="page-subtitle">Cadastro auxiliar para vinculação nas publicidades.</p>
          </div>
        </ng-template>

        <ng-template #end>
          <button
            pButton
            icon="pi pi-plus"
            label="Novo estado"
            (click)="openCreate()"
          ></button>
        </ng-template>
      </p-toolbar>

      <p-table [value]="estados()" [tableStyle]="{ 'min-width': '40rem' }" stripedRows>
        <ng-template pTemplate="header">
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Sigla</th>
            <th class="actions-col">Ações</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-estado>
          <tr>
            <td>{{ estado.id }}</td>
            <td>{{ estado.descricao }}</td>
            <td>{{ estado.sigla }}</td>
            <td class="actions-col">
              <div class="actions-row">
                <button
                  pButton
                  icon="pi pi-pencil"
                  severity="secondary"
                  rounded
                  text
                  (click)="openEdit(estado)"
                ></button>
                <button
                  pButton
                  icon="pi pi-trash"
                  severity="danger"
                  rounded
                  text
                  (click)="confirmDelete(estado)"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <p-dialog
      [(visible)]="dialogVisible"
      [modal]="true"
      [style]="{ width: '32rem' }"
      [header]="editingId ? 'Editar estado' : 'Novo estado'"
    >
      <form [formGroup]="form" class="dialog-form">
        <div class="field">
          <label for="descricao">Descrição</label>
          <input pInputText id="descricao" formControlName="descricao" />
        </div>

        <div class="field">
          <label for="sigla">Sigla</label>
          <input pInputText id="sigla" formControlName="sigla" maxlength="2" />
        </div>
      </form>

      <ng-template #footer>
        <button
          pButton
          label="Cancelar"
          severity="secondary"
          (click)="dialogVisible = false"
        ></button>
        <button
          pButton
          label="Salvar"
          [loading]="saving()"
          (click)="save()"
        ></button>
      </ng-template>
    </p-dialog>
  `
})
export class EstadoListPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly estadoService = inject(EstadoService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messages = inject(AppMessageService);

  readonly estados = signal<Estado[]>([]);
  readonly saving = signal(false);

  dialogVisible = false;
  editingId?: number;

  readonly form = this.fb.nonNullable.group({
    descricao: ['', Validators.required],
    sigla: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
  });

  ngOnInit(): void {
    this.loadEstados();
  }

  loadEstados(): void {
    this.estadoService.list().subscribe((data: Estado[]) => {
      this.estados.set(data);
    });
  }

  openCreate(): void {
    this.editingId = undefined;
    this.form.reset({
      descricao: '',
      sigla: ''
    });
    this.dialogVisible = true;
  }

  openEdit(estado: Estado): void {
    this.editingId = estado.id;
    this.form.reset({
      descricao: estado.descricao,
      sigla: estado.sigla
    });
    this.dialogVisible = true;
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.messages.warn('Campos obrigatórios', 'Preencha descrição e sigla corretamente.');
      return;
    }

    const payload = {
      descricao: this.form.getRawValue().descricao,
      sigla: this.form.getRawValue().sigla.toUpperCase()
    };

    const request$ = this.editingId
      ? this.estadoService.update(this.editingId, payload)
      : this.estadoService.create(payload);

    this.saving.set(true);

    request$
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe(() => {
        this.dialogVisible = false;
        this.messages.success('Estado salvo', 'O cadastro do estado foi atualizado com sucesso.');
        this.loadEstados();
      });
  }

  confirmDelete(estado: Estado): void {
    this.confirmationService.confirm({
      header: 'Excluir estado',
      message: `Deseja excluir o estado ${estado.descricao}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.estadoService.delete(estado.id).subscribe(() => {
          this.messages.success('Estado removido', 'Registro excluído com sucesso.');
          this.loadEstados();
        });
      }
    });
  }
}