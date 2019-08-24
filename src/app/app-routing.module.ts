import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {CategoryServicesResolver} from './+resolvers/category-services-resolver.service';
import {SingleServiceResolver} from './+resolvers/single-service-resolver.service';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
    },
    {path: 'single-service', loadChildren: './services/single-service/single-service.module#SingleServicePageModule'},
    {path: 'list-services', loadChildren: './services/list-services/list-services.module#ListServicesPageModule'},
    {
        path: 'categories/:category_id',
        loadChildren: './services/list-services/list-services.module#ListServicesPageModule',
        resolve: {services: CategoryServicesResolver}
    },
    {
        path: 'services/:service_id',
        loadChildren: './services/single-service/single-service.module#SingleServicePageModule',
        resolve: {service: SingleServiceResolver}
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
