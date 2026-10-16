import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Produto } from '../model/produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly baseUrl = 'http://localhost:8081/api/produto';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  public gravar(obj: Produto, imagemArquivo?: File): Observable<any> {
    const formData = new FormData();
    formData.append('nome', obj.nome ?? '');
    formData.append('descritivo', obj.descritivo ?? '');
    formData.append('valor', String(obj.valor ?? 0));
    formData.append('valorPromo', String(obj.valorPromo ?? 0));
    formData.append('quantidade', String(obj.quantidade ?? 0));
    formData.append('destaque', String(obj.destaque ?? 1));

    if (imagemArquivo) {
      formData.append('imagem', imagemArquivo, imagemArquivo.name);
    }

    return this.http.post(this.baseUrl, formData).pipe(
      retry(1),
      catchError((err) => {
        console.error('Erro ao gravar produto:', err);
        return throwError(() => err);
      }),
    );
  }

  public carregar(codigo: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${codigo}`, { headers: this.getHeaders() }).pipe(
      retry(1),
      catchError((err) => {
        console.error('Erro ao carregar produto:', err);
        return throwError(() => err);
      }),
    );
  }

  public carregarVitrine(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.baseUrl}/vitrine`, { headers: this.getHeaders() }).pipe(
      retry(2),
      catchError((err) => {
        console.error('Erro ao carregar vitrine:', err);
        return throwError(() => err);
      }),
    );
  }

  public buscar(termo: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.baseUrl}/busca/${encodeURIComponent(termo)}`, { headers: this.getHeaders() }).pipe(
      retry(1),
      catchError((err) => {
        console.error('Erro ao buscar produtos:', err);
        return throwError(() => err);
      }),
    );
  }

  public alterar(obj: Produto): Observable<any> {
    return this.http.put(this.baseUrl, obj, { headers: this.getHeaders() }).pipe(
      retry(1),
      catchError((err) => {
        console.error('Erro ao alterar produto:', err);
        return throwError(() => err);
      }),
    );
  }

  public remover(codigo: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${codigo}`, { headers: this.getHeaders() }).pipe(
      retry(1),
      catchError((err) => {
        console.error('Erro ao remover produto:', err);
        return throwError(() => err);
      }),
    );
  }
}
