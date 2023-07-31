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

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css'],
})
export class ContatoComponent implements OnInit {
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
      this.create();
    },
    label: 'Cadastrar',
  };

  actionsTable: Array<PoTableAction> = [
    {
      action: this.edit.bind(this),
      icon: 'po-icon-user',
      label: 'Adicionar contato'
    }
  ];

  name: string;
  datepicker: string;

  constructor(
    private personService: PessoaService,
    private poNotification: PoNotificationService
  ) {}

  ngOnInit() {
    this.getPersons();
  }

  isUndelivered(row, index: number) {
    return row.status !== 'delivered';
  }

  modalOpen() {
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

  create() {
    var body = {
      name: this.name,
      birthday: this.datepicker,
      contacts: []
    };

    this.personService.createPerson(body).subscribe(
      (data) => {
        if (data) {
          this.poNotification.success("Pessoa cadastrada com sucesso!");
        }
      },
      (err) => {
        this.poNotification.error("Erro ao cadastrar pessoa");
      }
    );
  }

  edit(value){
  console.log("🚀 ~ value:", value)

  }
}
