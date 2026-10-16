import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../model/produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly baseUrl = 'http://localhost:8081/api/produto';

  constructor(private http: HttpClient) {}

  public gravar(obj: Produto): Observable<any> {
    return this.http.post(this.baseUrl, obj);
  }

  public carregar(codigo: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${codigo}`);
  }

  public carregarVitrine(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.baseUrl}/vitrine`);
  }

  public buscar(termo: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.baseUrl}/busca/${encodeURIComponent(termo)}`);
  }

  public alterar(obj: Produto): Observable<any> {
    return this.http.put(this.baseUrl, obj);
  }

  public remover(codigo: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${codigo}`);
  }
}
