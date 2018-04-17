import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent implements OnInit {

    profile: any = {};
    constructor( @Inject(AuthService) public auth: AuthService) {
        auth.handleAuthentication();
    }
    ngOnInit(): void {
        if (this.auth.userProfile) {
            this.profile = this.auth.userProfile;
        } else {
            this.auth.getProfile((err: any, profile: any) => {
                this.profile = profile;
            });
        }
    }
}
