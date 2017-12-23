import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SugListComponent } from './sug-list/sug-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'suggestions', pathMatch: 'full' },
  { path: 'suggestions', component: SugListComponent },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
