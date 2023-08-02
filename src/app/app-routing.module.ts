import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContatoComponent } from './contato/contato.component';
import { PessoaComponent } from './pessoa/pessoa.component';

const routes: Routes = [
  { path: '', component: PessoaComponent },
  { path: 'contato/:id', component: ContatoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
