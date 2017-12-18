async function sendXhr<T, U>(
  method: 'GET' | 'POST',
  url: string,
  object?: T
): Promise<U> {
  return new Promise<U>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.responseType = 'json';
    xhr.onload = () => {
      const status = xhr.status;
      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send(object);
  });
}

export async function send<T, U>(url: string, object: T): Promise<U> {
  return sendXhr<T, U>('POST', url, object);
}

export async function getJSON<T>(url: string): Promise<T> {
  return sendXhr<T, T>('GET', url);
}
