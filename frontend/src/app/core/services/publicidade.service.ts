import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Publicidade, PublicidadePayload } from '../models/publicidade.model';

@Injectable({ providedIn: 'root' })
export class PublicidadeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/publicidades`;

  list(estadoId?: number): Observable<Publicidade[]> {
    let params = new HttpParams();

    if (estadoId) {
      params = params.set('estado_id', String(estadoId));
    }

    return this.http.get<Publicidade[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Publicidade> {
    return this.http.get<Publicidade>(`${this.apiUrl}/${id}`);
  }

  create(payload: PublicidadePayload): Observable<Publicidade> {
    return this.http.post<Publicidade>(this.apiUrl, this.toFormData(payload));
  }

  update(id: number, payload: PublicidadePayload): Observable<Publicidade> {
    return this.http.put<Publicidade>(`${this.apiUrl}/${id}`, this.toFormData(payload));
  }

  encerrar(id: number): Observable<Publicidade> {
    return this.http.patch<Publicidade>(`${this.apiUrl}/${id}/encerrar`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private toFormData(payload: PublicidadePayload): FormData {
    const formData = new FormData();

    formData.append('publicidade[titulo]', payload.titulo);
    formData.append('publicidade[descricao]', payload.descricao);
    formData.append('publicidade[botao_link]', payload.botao_link);
    formData.append('publicidade[titulo_botao_link]', payload.titulo_botao_link);
    formData.append('publicidade[dt_inicio]', payload.dt_inicio);
    formData.append('publicidade[dt_fim]', payload.dt_fim);

    payload.estado_ids.forEach((estadoId) => {
      formData.append('publicidade[estado_ids][]', String(estadoId));
    });

    if (payload.imagem) {
      formData.append('publicidade[imagem]', payload.imagem);
    }

    return formData;
  }
}