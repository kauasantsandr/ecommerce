import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../model/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly baseUrl = 'http://localhost:8081/api/cliente';

  constructor(private http: HttpClient) {}

  public gravar(obj: Cliente): Observable<any> {
    return this.http.post(this.baseUrl, obj);
  }

  public carregar(codigo: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${codigo}`);
  }

  public listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>('http://localhost:8081/api/clientes');
  }

  public alterar(obj: Cliente): Observable<any> {
    return this.http.put(this.baseUrl, obj);
  }

  public remover(obj: Cliente): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${obj.codigo}`);
  }

  public fazerLogin(obj: Cliente): Observable<any> {
    return this.http.post<any>('http://localhost:8081/api/cliente/login', obj);
  }
}
