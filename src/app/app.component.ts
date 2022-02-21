import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataState } from './enum/data.state.enum';
import { AppState } from './Interface/app-state';
import { CustomResponse } from './Interface/custom-response';
import { ServerService } from './service/server.service';
import { catchError, map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  // observable - AppState 是范型接口需要传入类型
  appState$: Observable<AppState<CustomResponse>>;
  // 依赖注入
  constructor(private serverService: ServerService) {}

  ngOnInit() {
    // 返回一个server list
    this.appState$ = this.serverService.servers$.pipe(
      // pipe response
      map(response => {
        return { dataState: DataState.LOADED_STATE, appData: response}
      }),
      // 后台没有返回时候返回的数据, 所以给 Obserable 一个初始值
      startWith({dataState: DataState.LOADING_STATE }),
      // 获取http 请求 handleError 抛出的异常 An error occurred
      catchError((error: string) => {
        // appState 期望返回一个 Observable
        return of({dataState: DataState.ERROR_STATE, error})
      })
    )

  }
}
