import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteComponent } from './site.component';
import { AddSiteComponent } from './add-site/add-site.component';
import { ListSiteComponent } from './list-site/list-site.component';
import { EditSiteComponent } from './edit-site/edit-site.component';

const routes: Routes = [
  {
    path:'',
    component: SiteComponent,
    children:[
      {
        path:'add-site',
        component:AddSiteComponent
      },
      {
        path:'list-site',
        component:ListSiteComponent
      },
      {
        path:'list-site/edit-site/:id',
        component:EditSiteComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule { }
