import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/Observable/fromPromise';

async function sendXhr<T, U>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: string,
  _object?: T
): Promise<U> {
  return new Promise<U>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.responseType = 'json';
    xhr.onload = () => {
      switch (xhr.status) {
        case 200:
        case 201:
          resolve(xhr.response);
        default:
          reject(status);
      }
    };
    xhr.send(data);
  });
}

export class HttpClient {
  public get<T>(url: string): Observable<T> {
    return fromPromise<T>(sendXhr<T, T>('GET', url));
  }
  public post<T>(url: string, data: string): Observable<T> {
    console.log('posting', data);
    return fromPromise<T>(sendXhr<T, T>('POST', url, data));
  }
  public put<T>(url: string, data: string): Observable<T> {
    return fromPromise<T>(sendXhr<T, T>('PUT', url, data));
  }
  public delete(url: string): Observable<never> {
    return fromPromise(sendXhr<any, never>('DELETE', url));
  }
}
