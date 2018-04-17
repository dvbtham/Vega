import { NgModule, ErrorHandler, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppModuleShared } from './app.module.shared';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppErrorHandler } from './app.error-handler';
import { BrowserXhr } from '@angular/http';
import { BrowserXhrWithProgress } from './services/progress.service';

@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppModuleShared
    ],
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl },
        { provide: BrowserXhr, useClass: BrowserXhrWithProgress },
        { provide: ErrorHandler, useClass: AppErrorHandler }
    ]
})
export class AppModule {
}

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
