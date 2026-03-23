import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MenuModule } from 'primeng/menu';
import { PublicidadeService } from '../../../core/services/publicidade.service';
import { EstadoService } from '../../../core/services/estado.service';
import { AppMessageService } from '../../../core/services/message.service';
import { Publicidade } from '../../../core/models/publicidade.model';

@Component({
  selector: 'app-publicidade-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    InputTextModule,
    SelectModule,
    TagModule,
    ProgressSpinnerModule,
    MenuModule
  ],
  providers: [ConfirmationService],
  template: `
    <p-confirmdialog></p-confirmdialog>

    <section class="publicidade-page">
      <div class="page-title-row">
        <div>
          <h1 class="screen-title">Gerenciamento de Publicidade</h1>
        </div>

        <button
          pButton
          type="button"
          icon="pi pi-plus-circle"
          label="Nova publicidade"
          class="new-button"
          (click)="goToCreate()"
        ></button>
      </div>

      <div class="filters-bar">
        <div class="state-filter-wrap">
          <p-select
            [options]="estadoOptions()"
            [(ngModel)]="estadoFiltro"
            optionLabel="label"
            optionValue="value"
            placeholder="Visualizar todos os Estados"
            [showClear]="true"
            class="full-control"
            (onChange)="onEstadoChange()"
            (onClear)="onEstadoChange()"
          ></p-select>
        </div>

        <div class="search-wrap">
          <input
            pInputText
            [(ngModel)]="tituloFiltro"
            placeholder=""
            class="search-input"
          />
          <i class="pi pi-search search-icon"></i>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <p-progress-spinner strokeWidth="4"></p-progress-spinner>
        </div>
      } @else {
        <div class="cards-wrapper">
          @for (item of currentPublicidades(); track item.id) {
            <article class="publicidade-card">
              <div class="card-main">
                <img [src]="item.imagem_url || fallbackImage" [alt]="item.titulo" class="card-thumb" />

                <div class="card-content">
                  <h3>{{ item.titulo }}</h3>
                  <p>{{ item.descricao }}</p>

                  <div class="chips-row">
                    @for (estado of item.estados; track estado.id) {
                      <span class="estado-chip">{{ estado.descricao }}</span>
                    }
                  </div>
                </div>
              </div>

              <div class="card-side">
                <p-tag value="Publicidade atual" severity="success"></p-tag>

                <div class="date-label">
                  <i class="pi pi-calendar"></i>
                  <span>Ativo até {{ formatDate(item.dt_fim) }}</span>
                </div>
              </div>

              <div class="menu-zone">
                <p-menu #menu [popup]="true" [model]="buildMenuItems(item)"></p-menu>
                <button
                  pButton
                  type="button"
                  text
                  rounded
                  icon="pi pi-ellipsis-v"
                  class="menu-button"
                  (click)="menu.toggle($event)"
                ></button>
              </div>
            </article>
          }

          @if (otherPublicidades().length > 0) {
            <div class="section-label">OUTRAS PUBLICIDADES</div>
          }

          @for (item of otherPublicidades(); track item.id) {
            <article class="publicidade-card">
              <div class="card-main">
                <img [src]="item.imagem_url || fallbackImage" [alt]="item.titulo" class="card-thumb" />

                <div class="card-content">
                  <h3>{{ item.titulo }}</h3>
                  <p>{{ item.descricao }}</p>

                  <div class="chips-row">
                    @for (estado of item.estados; track estado.id) {
                      <span class="estado-chip">{{ estado.descricao }}</span>
                    }
                  </div>
                </div>
              </div>

              <div class="card-side muted-side">
                <div class="date-label">
                  <i class="pi pi-calendar"></i>
                  <span>{{ getSideText(item) }}</span>
                </div>
              </div>

              <div class="menu-zone">
                <p-menu #menuFuture [popup]="true" [model]="buildMenuItems(item)"></p-menu>
                <button
                  pButton
                  type="button"
                  text
                  rounded
                  icon="pi pi-ellipsis-v"
                  class="menu-button"
                  (click)="menuFuture.toggle($event)"
                ></button>
              </div>
            </article>
          }

          @if (filteredPublicidades().length === 0) {
            <div class="empty-state">Nenhuma publicidade encontrada.</div>
          }
        </div>
      }
    </section>
  `
})
export class PublicidadeListPage implements OnInit {
  private readonly publicidadeService = inject(PublicidadeService);
  private readonly estadoService = inject(EstadoService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messages = inject(AppMessageService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly publicidades = signal<Publicidade[]>([]);
  readonly estadoOptions = signal<{ label: string; value: number }[]>([]);
  readonly fallbackImage = 'https://placehold.co/66x66?text=Img';

  tituloFiltro = '';
  estadoFiltro?: number;

  readonly filteredPublicidades = computed(() => {
    const titulo = this.tituloFiltro.trim().toLowerCase();

    return this.publicidades().filter((item) => {
      const matchesTitle =
        !titulo ||
        item.titulo.toLowerCase().includes(titulo) ||
        item.descricao.toLowerCase().includes(titulo);

      return matchesTitle;
    });
  });

  readonly currentPublicidades = computed(() =>
    this.filteredPublicidades().filter((item) => this.getDisplayStatus(item) === 'atual')
  );

  readonly otherPublicidades = computed(() =>
    this.filteredPublicidades().filter((item) => this.getDisplayStatus(item) !== 'atual')
  );

  ngOnInit(): void {
    this.loadEstados();
    this.loadPublicidades();
  }

  loadEstados(): void {
    this.estadoService.options().subscribe((options) => {
      this.estadoOptions.set(options);
    });
  }

  loadPublicidades(): void {
    this.loading.set(true);

    this.publicidadeService
      .list(this.estadoFiltro)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((data) => {
        this.publicidades.set(data);
      });
  }

  onEstadoChange(): void {
    this.loadPublicidades();
  }

  goToCreate(): void {
    this.router.navigate(['/publicidades/nova']);
  }

  goToEdit(item: Publicidade): void {
    this.router.navigate(['/publicidades', item.id, 'editar']);
  }

  buildMenuItems(item: Publicidade): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.goToEdit(item)
      },
      {
        label: 'Encerrar',
        icon: 'pi pi-times-circle',
        disabled: item.status === 'encerrada',
        command: () => this.confirmEncerrar(item)
      }
    ];
  }

  confirmEncerrar(publicidade: Publicidade): void {
    this.confirmationService.confirm({
      header: 'Encerrar publicidade',
      message: `Deseja encerrar a publicidade "${publicidade.titulo}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.publicidadeService.encerrar(publicidade.id).subscribe(() => {
          this.messages.success('Publicidade encerrada', 'A campanha foi encerrada com sucesso.');
          this.loadPublicidades();
        });
      }
    });
  }

  getDisplayStatus(item: Publicidade): 'atual' | 'agendada' | 'encerrada' {
    if (item.status === 'encerrada') {
      return 'encerrada';
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataInicio = new Date(`${item.dt_inicio}T00:00:00`);
    const dataFim = new Date(`${item.dt_fim}T23:59:59`);

    if (hoje < dataInicio) {
      return 'agendada';
    }

    if (hoje > dataFim) {
      return 'encerrada';
    }

    return 'atual';
  }

  getSideText(item: Publicidade): string {
    const displayStatus = this.getDisplayStatus(item);

    if (displayStatus === 'agendada') {
      return `Será publicado em ${this.formatDate(item.dt_inicio)}`;
    }

    if (item.encerrada_em) {
      return `Encerrada em ${this.formatDateTime(item.encerrada_em)}`;
    }

    return `Finalizada em ${this.formatDate(item.dt_fim)}`;
  }

  formatDate(value: string | null): string {
    if (!value) return '-';
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString('pt-BR');
  }

  formatDateTime(value: string | null): string {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleDateString('pt-BR');
  }
}