import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publicidade-list',
  templateUrl: './publicidade-list.component.html',
  styleUrls: ['./publicidade-list.component.scss']
})
export class PublicidadeListComponent implements OnInit {

  publicidades: any[] = [];
  publicidadesFiltradas: any[] = [];

  estadoOptions: any[] = [
    { label: 'São Paulo', value: 1 },
    { label: 'Minas Gerais', value: 2 },
    { label: 'Rio de Janeiro', value: 3 }
  ];

  estadoSelecionado: any = null;
  termoBusca: string = '';

  ngOnInit(): void {
    // SIMULA DADOS (depois liga com backend)
    this.publicidades = [
      {
        titulo: 'Festival de Inverno',
        descricao: 'Evento cultural na cidade',
        estados: [{ sigla: 'SP' }, { sigla: 'MG' }],
        ativa: true,
        dt_fim: '30/07/2025',
        imagemUrl: 'https://via.placeholder.com/80'
      },
      {
        titulo: 'Bem-vindo ao sistema',
        descricao: 'Sistema inteligente de gestão',
        estados: [{ sigla: 'RJ' }],
        ativa: false,
        dt_inicio: '01/07/2025',
        imagemUrl: 'https://via.placeholder.com/80'
      }
    ];

    this.publicidadesFiltradas = this.publicidades;
  }

  openCreateModal(): void {
    alert('Aqui vai abrir o modal de nova publicidade');
  }

  abrirMenu(item: any): void {
    console.log('Menu clicado:', item);
  }

  filtrar(): void {
    let lista = [...this.publicidades];

    if (this.estadoSelecionado) {
      lista = lista.filter((item) =>
        item.estados?.some((e: any) => e.value === this.estadoSelecionado)
      );
    }

    if (this.termoBusca) {
      const termo = this.termoBusca.toLowerCase();
      lista = lista.filter((item) =>
        item.titulo.toLowerCase().includes(termo)
      );
    }

    this.publicidadesFiltradas = lista;
  }
}