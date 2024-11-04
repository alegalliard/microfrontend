import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'profile',
    loadChildren: () => loadRemoteModule({
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      remoteName: 'mfeApp',
      exposedModule: './ProfileModule'
    }).then((m) => m.ProfileModule).catch(err => console.log(err))
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
