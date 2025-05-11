export interface IUser {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    direccion: string;
    telefono: string;
    activo: boolean;
    imagen?: string;
}

export class User implements IUser {
    constructor(
        public id: string = '',
        public nombre: string = '',
        public apellido: string = '',
        public email: string = '',
        public direccion: string = '',
        public telefono: string = '',
        public activo: boolean = true,
        public imagen: string = '',
    ) {}
}
