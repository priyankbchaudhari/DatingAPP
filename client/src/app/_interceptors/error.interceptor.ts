import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(

      catchError((errorResponse: HttpErrorResponse) => {

        if (errorResponse) {

          switch (errorResponse.status) {

            case 400:

              if (errorResponse.error.errors) {

                const modelStateErrors = [];
                for (const key in errorResponse.error.errors) {

                  if (errorResponse.error.errors[key]) {
                    modelStateErrors.push(errorResponse.error.errors[key]);
                  }
                }

                throw modelStateErrors.flat();
              }
              else {
                this.toastr.error(errorResponse.error, errorResponse.status.toString());
              }

              break;

            case 401:
              this.toastr.error('Unauthhorized', errorResponse.statusText);
              break;

            case 404:
              this.router.navigateByUrl('/not-found');
              break;

            case 500:
              const navigationExtras: NavigationExtras = { state: { error: errorResponse.error } }
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(errorResponse)
              break;
          }
        }

        throw errorResponse;
      })
    )
  }
}
