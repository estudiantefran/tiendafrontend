export type RolUsuario = 'cliente' | 'administrador';

export interface DireccionUsuario {
	departamento?: string;
	ciudad?: string;
	barrio?: string;
	direccion?: string;
}

export interface Usuario {
	_id?: string;
	nombre: string;
	email: string;
	telefono: string;
	rol?: RolUsuario;
	direccion?: DireccionUsuario;
	estado?: boolean;
	createdAt?: string;
	updatedAt?: string;
}
