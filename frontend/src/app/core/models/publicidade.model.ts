import { Estado } from './estado.model';

export interface Publicidade {
  id: number;
  titulo: string;
  descricao: string;
  botao_link: string;
  titulo_botao_link: string;
  dt_inicio: string;
  dt_fim: string;
  encerrada_em: string | null;
  created_at: string;
  updated_at: string;
  imagem_url: string | null;
  status: 'ativa' | 'encerrada';
  estados: Estado[];
}

export interface PublicidadePayload {
  titulo: string;
  descricao: string;
  botao_link: string;
  titulo_botao_link: string;
  dt_inicio: string;
  dt_fim: string;
  estado_ids: number[];
  imagem?: File | null;
}
