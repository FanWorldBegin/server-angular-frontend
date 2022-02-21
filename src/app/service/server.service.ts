import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../Interface/custom-response';
import { Server } from '../Interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly apiUrl = "http://localhost:8091";

  // 注入HttpClient 进行请求
  constructor(private http: HttpClient) { }

  // Obserable 推荐使用 $ 修饰
  servers$ = <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiUrl}/server/list`).pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  save$ = (server: Server) => <Observable<CustomResponse>>this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server).pipe(
    tap(console.log),
    catchError(this.handleError)

  )

  ping$ = (ipAddress: String) => <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`).pipe(
    tap(console.log),
    catchError(this.handleError)

  )

  delete$ = (serverId: number) => <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`).pipe(
    tap(console.log),
    catchError(this.handleError)

  )

  // 根据不同的 status 过滤数据
  filter$ = (status: Status, response: CustomResponse) => 
  <Observable<CustomResponse>>new Observable<CustomResponse>(
    suscriber => {
      console.log(response);
      suscriber.next(
        // 所有的都返回
        status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status`} :
        { ...response, message: response.data.servers.filter(server => server.status === status).length > 0 ?
          `Servers filtered by ${status === Status.SERVER_UP ? 'SERVER UP' : "SERVVER DOWN"} status` :
          `NO servers of ${status} found`,
          data: {
            servers: response.data.servers.filter(server => server.status === status)
          }
        }
      );
      //  suscriber 完成
      suscriber.complete();
    }
  ).pipe(
    tap(console.log),
    catchError(this.handleError)

  )

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    throw new Error(`An error occurred - Error code: ${error.status}`);
  }

}
