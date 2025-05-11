import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { Dialog, DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IUser, User } from './models/user';
import { UserService } from './user.service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="Nuevo" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button severity="secondary" label="Eliminar" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedUsers || !selectedUsers.length" />
            </ng-template>

            <ng-template #end>
                <p-button label="Exportar" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
            </ng-template>
        </p-toolbar>

        <p-table
            #dt
            [value]="users()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedUsers"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
            [exportFilename]="'usuarios'"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Mantenedor de Usuarios</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Buscar..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="nombre" style="min-width: 16rem">Nombre
                        <p-sortIcon field="nombre" />
                    </th>
                    <th pSortableColumn="apellido" style="min-width:16rem">
                        Apellido
                        <p-sortIcon field="apellido" />
                    </th>
                    <th>Image</th>
                    <th pSortableColumn="email" style="min-width: 8rem">
                        Correo
                        <p-sortIcon field="email" />
                    </th>
                    <th pSortableColumn="direccion" style="min-width:10rem">
                        Dirección
                        <p-sortIcon field="direccion" />
                    </th>
                    <th pSortableColumn="telefono" style="min-width: 12rem">
                        Teléfono
                        <p-sortIcon field="telefono" />
                    </th>
                    <th pSortableColumn="activo" style="min-width: 12rem">
                        Estado
                        <p-sortIcon field="activo" />
                    </th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-user>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="user" />
                    </td>
                    <td style="min-width: 16rem">{{ user?.nombre }}</td>
                    <td style="min-width: 16rem">{{ user?.apellido }}</td>
                    <td>
                        <img [src]="'https://primefaces.org/cdn/primeng/images/demo/avatar/' + user.imagen" [alt]="user.nombre" style="width: 40px" class="rounded" />
                    </td>
                    <td>{{ user?.email }}</td>
                    <td>{{ user?.direccion }}</td>
                    <td>{{ user?.telefono }}</td>
                    <td>
                        <p-tag [value]="user.activo ? 'ACTIVO' : 'INACTIVO'" [severity]="getSeverity(user.activo)" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="edit(user)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="delete(user)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog #dl [(visible)]="userDialog" [style]="{ width: '450px' }" header="Crear Usuario" [modal]="true">
            <ng-template #content>
                <div class="flex flex-col gap-6">
                    <!-- https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png -->
                    <img [src]="'https://primefaces.org/cdn/primeng/images/demo/avatar/' + user.imagen" [alt]="user.nombre" class="block m-auto pb-4" *ngIf="user.imagen" />
                    <div>
                        <label for="name" class="block font-bold mb-3">Nombre</label>
                        <input type="text" pInputText id="name" [(ngModel)]="user.nombre" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !user.nombre">El nombre es requerido.</small>
                    </div>
                    <div>
                        <label for="apellido" class="block font-bold mb-3">Apellido</label>
                        <input type="text" pInputText id="apellido" [(ngModel)]="user.apellido" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !user.nombre">El apellido es requerido.</small>
                    </div>
                    <div>
                        <label for="email" class="block font-bold mb-3">Correo</label>
                        <input type="text" pInputText id="email" [(ngModel)]="user.email" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !user.nombre">El correo es requerido.</small>
                    </div>
                    <div>
                        <label for="telefono" class="block font-bold mb-3">Teléfono</label>
                        <input type="text" pInputText id="telefono" [(ngModel)]="user.telefono" required autofocus fluid />
                        <small class="text-red-500" *ngIf="submitted && !user.nombre">El telefono es requerido.</small>
                    </div>
                    <div>
                        <label for="activo" class="block font-bold mb-3">Estado</label>
                        <p-select [(ngModel)]="user.activo" inputId="activo" [options]="statuses" optionLabel="label" optionValue="label" placeholder="Seleccione" fluid />
                    </div>

                    <!-- <div>
                        <span class="block font-bold mb-4">Category</span>
                        <div class="grid grid-cols-12 gap-4">
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category1" name="category" value="Accessories" [(ngModel)]="user.category" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category2" name="category" value="Clothing" [(ngModel)]="user.category" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category3" name="category" value="Electronics" [(ngModel)]="user.category" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="flex items-center gap-2 col-span-6">
                                <p-radiobutton id="category4" name="category" value="Fitness" [(ngModel)]="user.category" />
                                <label for="category4">Fitness</label>
                            </div>
                        </div>
                    </div> -->

                    <!-- <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-6">
                            <label for="price" class="block font-bold mb-3">Price</label>
                            <p-inputnumber id="price" [(ngModel)]="user.price" mode="currency" currency="USD" locale="en-US" fluid />
                        </div>
                        <div class="col-span-6">
                            <label for="quantity" class="block font-bold mb-3">Quantity</label>
                            <p-inputnumber id="quantity" [(ngModel)]="user.quantity" fluid />
                        </div>
                    </div> -->
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Save" icon="pi pi-check" (click)="saveProduct()" />
            </ng-template>
        </p-dialog>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, UserService, ConfirmationService]
})
export class UserCrud implements OnInit {
    @ViewChild('dt') dt!: Table;
    @ViewChild('dl') dl!: Dialog;

    userDialog: boolean = false;

    users = signal<IUser[]>([]);

    user!: IUser;

    selectedUsers!: IUser[] | null;

    submitted: boolean = false;

    statuses!: any[];

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private readonly userService: UserService,
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.userService.getUsers().subscribe((data: any) => {
            this.users.set(data.data);
        });

        this.statuses = [
            { label: 'ACTIVO', value: true },
            { label: 'INACTIVO', value: false }
        ];

        this.cols = [
            { field: 'nombre', header: 'Nombre' },
            { field: 'apellido', header: 'Apellido' },
            { field: 'email', header: 'Correo' },
            { field: 'direccion', header: 'Dirección' },
            { field: 'telefono', header: 'Teléfono' },
            { field: 'activo', header: 'Activo' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.dl.header = 'Nuevo Usuario';
        this.user = this.newUser();
        this.submitted = false;
        this.userDialog = true;
    }

    edit(user: User) {
        this.dl.header = 'Editando Usuario';
        this.user = { ...user };
        this.userDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Estas seguro de que quieres eliminar los usuarios seleccionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
                this.selectedUsers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Usuarios Eliminados',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    delete(user: User) {
        this.confirmationService.confirm({
            message: 'Estas seguro que quieres eliminar el usuario ' + user.nombre + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => val.id !== user.id));
                this.user = this.newUser();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Usuario Eliminado',
                    life: 3000
                });
            }
        });
    }

    private newUser(): IUser {
        return {
            id: '',
            nombre: '',
            apellido: '',
            email: '',
            direccion: '',
            telefono: '',
            activo: true,
            imagen: ''
        };
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.users().length; i++) {
            if (this.users()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(activo: boolean) {
        switch (activo) {
            case true:
                return 'success';
            case false:
                return 'danger';
            default:
                return 'info';
        }
    }

    saveProduct() {
        this.submitted = true;
        let _users = this.users();
        if (this.user.nombre?.trim()) {
            if (this.user.id) {
                _users[this.findIndexById(this.user.id)] = this.user;
                this.users.set([..._users]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Usuario Actualizado',
                    life: 3000
                });
            } else {
                this.user.id = this.createId();
                this.user.imagen = 'product-placeholder.svg';
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Producto Creado',
                    life: 3000
                });
                this.users.set([..._users, this.user]);
            }

            this.userDialog = false;
            this.user = this.newUser();
        }
    }
}
