import { Routes } from '@angular/router';
import { Home } from './.features/home/home';
import { Login } from './.features/login/login';
import { AboutComponent } from './.features/about.component/about.component';
import { Referrals } from './.features/referrals/referrals';
import { PageNotBuilt } from './.features/page-not-built/page-not-built';
import { authGuardAny } from './.services/auth/auth-guard-any';
import { authGuard } from './.services/auth/auth-guard';
import { Admin } from './.features/admin/admin';
import { Clinic } from './.features/clinic/clinic';
import { Treatment } from './.features/treatment/treatment';
import { FindSaveSU } from './.features/referrals/find-save-su/find-save-su';   

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'home',
        component: Home,
        children: [
            {
                path: "about",
                component: AboutComponent
            },
            {
                path: 'referrals/findSaveSU',
                component: FindSaveSU,
                canActivate: [authGuard],
                data: { roles: ['ADMIN', 'USER'] }
            },

            {
                path: 'referrals',
                component: Referrals,
                canActivate: [authGuard],
                data: { roles: ['ADMIN', 'USER'] }
            },
            {
                path: 'referrals/:refId',
                component: Referrals,
                canActivate: [authGuard],
                data: { roles: ['ADMIN', 'USER'] }
            },

            {
                path: 'clinics/:clinicIdEnum',
                component: Clinic,
                canActivate: [authGuardAny],
                data: { roles: ['ADMIN', 'USER'] }
            },
            {
                path: 'reports',
                component: PageNotBuilt,
                canActivate: [authGuard],
                data: { roles: ['ADMIN'], pageName: 'Reports' }
            },
            {
                path: 'admin',
                component: PageNotBuilt,
                canActivate: [authGuard],
                data: { roles: ['ADMIN'], pageName: 'Admin' }
            },
            {
                path: 'treatment/:apptId',
                component: Treatment,
                canActivate: [authGuard],
                data: { roles: ['ADMIN', 'USER']}
            },

        ]
    },


];
