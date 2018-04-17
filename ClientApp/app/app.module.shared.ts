import * as Raven from 'raven-js';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';
import { VehicleService } from './services/vehicle.service';
import { ToastModule } from 'ng2-toastr';
import { ToastyModule } from 'ng2-toasty';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { PaginationComponent } from './components/shared/pagination/pagination.component';
import { ViewVehicleComponent } from './components/view-vehicle/view-vehicle.component';
import { PhotoService } from './services/photo.service';
import { ProgressService } from './services/progress.service';
import { AuthService } from './services/auth.service';
import { CallbackComponent } from './callback/callback.component';

Raven.config('https://3d5b7410829243e789e587973a6f509e@sentry.io/231874').install();

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        VehicleFormComponent,
        VehicleComponent,
        PaginationComponent,
        ViewVehicleComponent,
        CallbackComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ToastyModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'callback', component: CallbackComponent },
            { path: 'vehicles/new', component: VehicleFormComponent },
            { path: 'vehicles/edit/:id', component: VehicleFormComponent },
            { path: 'vehicles/:id', component: ViewVehicleComponent },
            { path: 'vehicles', component: VehicleComponent },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [   
        AuthService,
        VehicleService,
        PhotoService,
        ProgressService        
    ]
})
export class AppModuleShared {
}
