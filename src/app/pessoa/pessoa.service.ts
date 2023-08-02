import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  constructor(private http: HttpClient) {}

  getPersons(pageIndex = 1, pageSize = 10) {
    var params = new HttpParams();
    params = params.append('pageIndex', pageIndex.toString());
    params = params.append('pageSize', pageSize.toString());

    return this.http.get<any>(
      `${environment.urlApi}Person?${params.toString()}`
    );
  }

  createPerson(body) {
    return this.http.post<boolean>(`${environment.urlApi}Person`, body);
  }

  editPerson(body){
    console.log("🚀 ~ body:", body)
    return this.http.put<boolean>(`${environment.urlApi}Person`, body);
  }

  getContacts(id) {
    return this.http.get<any>(`${environment.urlApi}Person/${id}`);
  }

  createContact(body, id) {
    return this.http.post<boolean>(
      `${environment.urlApi}Person/${id}/contacts`,
      body
    );
  }

  deletePerson(id) {
    return this.http.delete<string>(`${environment.urlApi}Person/${id}`);
  }

  deleteContact(id) {
    return this.http.delete<string>(`${environment.urlApi}Person/contacts/${id}`);
  }
}
