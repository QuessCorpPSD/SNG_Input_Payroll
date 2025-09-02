import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path:'',
        loadComponent:()=> import('./home/home.component').then(m=>m.HomeComponent),
       

    },
    {
        path:'Assignment',
        loadComponent:()=> import('./assignment/assignment.component').then(m=>m.AssignmentComponent),
       

    },
    {
        path:'Severity',
        loadComponent:()=> import('./severity/severity.component').then(m=>m.SeverityComponent)
       

    }
]