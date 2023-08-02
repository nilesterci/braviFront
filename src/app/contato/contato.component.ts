import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoPageAction,
  PoSelectOption,
  PoTableAction,
  PoTableColumn,
} from '@po-ui/ng-components';
import { PessoaService } from '../pessoa/pessoa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css'],
})
export class ContatoComponent implements OnInit {
  constructor(
    private personService: PessoaService,
    private poNotification: PoNotificationService,
    private activatedRoute: ActivatedRoute
  ) {}
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  id$: Observable<string>;
  items: Array<any>;
  itemsContatos: Array<any>;
  columns: Array<PoTableColumn>;
  name: string;
  comboModel: string;

  actionsTable: Array<PoTableAction> = [
    {
      action: this.edit.bind(this),
      icon: 'po-icon-user',
      label: 'Editar contato',
    },
    {
      action: this.delete.bind(this),
      icon: 'po-icon-delete',
      label: 'Excluir contato',
    },
  ];

  public readonly actions: Array<PoPageAction> = [
    {
      label: 'Cadastrar Contato',
      action: this.modalOpen.bind(this),
      icon: 'po-icon-user',
    },
  ];

  public readonly cancelAction: PoModalAction = {
    action: () => {
      this.modalClose();
    },
    label: 'Cancel',
  };

  public readonly shareAction: PoModalAction = {
    action: () => {
      this.create();
    },
    label: 'Cadastrar',
  };

  ngOnInit() {
    this.activatedRoute.params.subscribe((s) => {
      this.id$ = s['id'];
      this.getContacts(this.id$);
    });
  }

  getContacts(id) {
    this.personService.getContacts(id).subscribe(
      (data) => {
        if (data) {
          this.items = data;
          this.itemsContatos = data['contatos'];
        }
      },
      (err) => {
        let message = err.error?.message
          ? err.error.message
          : 'Erro ao buscar registros';
      }
    );
  }

  edit(value) {}

  create() {
    var body = {
      value: this.name,
      contactType: Number(this.comboModel),
    };

    this.personService.createContact(body, this.id$).subscribe(
      (data) => {
        if (data) {
          this.poNotification.success('Contato cadastrado com sucesso!');
          this.getContacts(this.id$);
          this.modalClose();
        }
      },
      (err) => {
        this.poNotification.error('Erro ao cadastrar contato');
      }
    );
  }

  modalClose() {
    this.poModal.close();
  }

  modalOpen() {
    this.poModal.open();
  }

  delete(value) {
    this.personService.deleteContact(value.id).subscribe(
      (data) => {
        if (data) {
          this.poNotification.success('Contato deletado com sucesso!');
          this.getContacts(this.id$);
        }
      },
      (err) => {
        this.poNotification.error('Erro ao deletar contato');
      }
    );
  }
}
