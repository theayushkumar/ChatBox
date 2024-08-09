import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ChatPanelComponent } from './chat-panel/chat-panel.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [

      { path: '', component: ChatPanelComponent },
      { path: 'chat', component: ChatPanelComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
