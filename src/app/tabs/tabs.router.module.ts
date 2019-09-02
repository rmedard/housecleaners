import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'services',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../services/services.module').then(m => m.ServicesPageModule)
                    }
                ]
            },
            {
                path: 'planning',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../planning/planning.module').then(m => m.PlanningPageModule)
                    }
                ]
            },
            {
                path: 'profile',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/services',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/services',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
