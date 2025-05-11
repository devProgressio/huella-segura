// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl: string = `http://localhost:3000/users/`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Obtiene todos los usuarios
   */
  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.baseUrl);
  }

  /**
   * Obtiene un usuario por ID
   * @param id Identificador del usuario
   */
  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crea un nuevo usuario
   * @param user Datos del usuario a crear
   */
  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.baseUrl, user);
  }

  /**
   * Actualiza un usuario existente
   * @param id Identificador del usuario
   * @param user Datos actualizados del usuario
   */
  updateUser(id: string, user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.baseUrl}/${id}`, user);
  }

  /**
   * Elimina un usuario
   * @param id Identificador del usuario
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
