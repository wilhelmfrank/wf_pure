import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, EMPTY, Observable, retry, Subject, switchAll, tap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';

export const WS_ENDPOINT = environment.ws_endpoint;
export const RECONNECT_INTERVAL = environment.ws_reconnect_interval;

@Injectable({
  providedIn: 'root'
})
export class SocksService {

  private socket$: WebSocketSubject<unknown> | undefined;
  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));

  public connect(cfg: { reconnect: boolean } = { reconnect: false }): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : o => o,
        tap({
          error: error => console.log(error),
        }), catchError(() => EMPTY))
      //toDO only next an observable if a new subscription was made double-check this
      this.messagesSubject$.next(messages);
    }
  }

  /*
  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log('[Data Service] Try to reconnect', val)),
      delayWhen(_ => timer(RECONNECT_INTERVAL)))));
  }*/

  private reconnect(obs: Observable<any>): Observable<any> {
    return obs.pipe(retry({count: 2, delay: this.retry_delay}))
  }

  private retry_delay(err: any) {
    console.log(err);
    return timer(RECONNECT_INTERVAL);
  }

  close() {
    this.socket$?.complete();
    this.socket$ = undefined;
  }

  sendMessage(msg: any) {
    this.socket$?.next(msg);
  }

  private getNewWebSocket() {
    return webSocket({
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          console.log('[SocksService]: connection ok');
        }
      },
      closeObserver: {
        next: () => {
          console.log('[SocksService]: connection closed');
          this.socket$ = undefined;
          this.connect({ reconnect: true });
        }
      },
    });
  }
}
