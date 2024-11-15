import {
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders
} from '@angular/common/http';

export interface ResponseErrorModel {
  code: number;
  message: string;
}

/**
 * wrap current response error model into common HttpErrorResponse model format
 * @param error
 */
export function toHttpErrorResponse(
  error: ResponseErrorModel
): HttpErrorResponse {
  return {
    error: undefined,
    message: error.message,
    name: 'HttpErrorResponse',
    ok: false,
    type: HttpEventType.Response,
    headers: new HttpHeaders(),
    status: error.code,
    statusText: '',
    url: ''
  };
}
