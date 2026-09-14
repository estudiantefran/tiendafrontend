import { Categoria } from './categoria';

export interface Presentacion {
	_id?: string;
	peso: string;
	precio: number;
	stockActual?: number;
	stockMinimo?: number;
	stockMaximo?: number;
	estado?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface Producto {
	_id?: string;
	nombre: string;
	descripcion: string;
	porcentajeCacao?: string;
	ingredientes?: string[];
	imagenes?: string[];
	presentaciones: Presentacion[];
	categoria: string | Categoria;
	estado?: boolean;
	createdAt?: string;
	updatedAt?: string;
}