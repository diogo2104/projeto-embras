import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Estado } from '../models/estado.model';

@Injectable({ providedIn: 'root' })
export class EstadoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/estados`;

  list(): Observable<Estado[]> {
    return this.http.get<Estado[]>(this.apiUrl);
  }

  create(payload: Pick<Estado, 'descricao' | 'sigla'>): Observable<Estado> {
    return this.http.post<Estado>(this.apiUrl, { estado: payload });
  }

  update(id: number, payload: Pick<Estado, 'descricao' | 'sigla'>): Observable<Estado> {
    return this.http.put<Estado>(`${this.apiUrl}/${id}`, { estado: payload });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  options(): Observable<{ label: string; value: number }[]> {
    return this.list().pipe(
      map((estados) => estados.map((estado) => ({
        label: `${estado.sigla} - ${estado.descricao}`,
        value: estado.id
      })))
    );
  }
}
