import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoPageAction,
  PoSelectOption,
  PoTableAction,
  PoTableColumn,
} from '@po-ui/ng-components';
import { PessoaService } from './pessoa.service';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pessoa',
  templateUrl: './pessoa.component.html',
  styleUrls: ['./pessoa.component.css'],
})
export class PessoaComponent {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  columns: Array<PoTableColumn>;
  items: Array<any>;
  @ViewChild('formShare', { static: true }) formShare: NgForm;

  readonly statusOptions: Array<PoSelectOption> = [
    { label: 'Delivered', value: 'delivered' },
    { label: 'Transport', value: 'transport' },
    { label: 'Production', value: 'production' },
  ];

  public readonly actions: Array<PoPageAction> = [
    {
      label: 'Cadastrar Pessoa',
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
      this.createOrEdit();
    },
    label: 'Cadastrar',
  };

  actionsTable: Array<PoTableAction> = [
    {
      action: this.listContacts.bind(this),
      icon: 'po-icon-user',
      label: 'Listar contatos',
    },
    {
      action: this.edit.bind(this),
      icon: 'po-icon-edit',
      label: 'Editar pessoa',
    },
    {
      action: this.delete.bind(this),
      icon: 'po-icon-delete',
      label: 'Deletar pessoa',
    },
  ];

  name: string;
  datepicker: Date;
  isEdit: boolean = false;
  id: string;

  constructor(
    private personService: PessoaService,
    private poNotification: PoNotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPersons();
  }

  isUndelivered(row, index: number) {
    return row.status !== 'delivered';
  }

  modalOpen(isEdit) {
    if (isEdit == undefined) {
      this.isEdit = isEdit;
      this.id = null;
    }
    this.poModal.open();
  }

  modalClose() {
    this.poModal.close();
    this.formShare.reset();
  }

  getPersons() {
    this.personService.getPersons().subscribe(
      (data) => {
        if (data) {
          this.items = data['result'];
        }
      },
      (err) => {
        let message = err.error?.message
          ? err.error.message
          : 'Erro ao buscar registros';
      }
    );
  }

  createOrEdit() {
    if (this.id) {
      var body = {
        id: this.id,
        nome: this.name,
        aniversario: this.datepicker,
        contacts: [],
      };

      this.personService.editPerson(body).subscribe(
        (data) => {
          if (data) {
            this.poNotification.success('Pessoa editada com sucesso!');
            this.getPersons();
            this.modalClose();
          }
        },
        (err) => {
          this.poNotification.error('Erro ao editar pessoa');
        }
      );
    } else {
      var bodyNew = {
        name: this.name,
        birthday: this.datepicker,
        contacts: [],
      };

      this.personService.createPerson(bodyNew).subscribe(
        (data) => {
          if (data) {
            this.poNotification.success('Pessoa cadastrada com sucesso!');
            this.getPersons();
            this.modalClose();
          }
        },
        (err) => {
          this.poNotification.error('Erro ao cadastrar pessoa');
        }
      );
    }
  }

  listContacts(value) {
    this.router.navigate([`contato/${value.id}`]);
  }

  edit(value) {
    this.name = value.nome;
    this.datepicker = new Date(value.aniversario);
    this.isEdit = true;
    this.id = value.id;

    this.modalOpen(true);
  }

  delete(value) {
    this.personService.deletePerson(value.id).subscribe(
      (data) => {
        if (data) {
          this.poNotification.success('Pessoa deletada com sucesso!');
          this.getPersons();
        }
      },
      (err) => {
        this.poNotification.error('Erro ao deletar pessoa');
      }
    );
  }
}
