import { Producto } from './producto';
import { Usuario } from './usuario';

export interface Resena {
	_id?: string;
	usuario: string | Usuario;
	producto: string | Producto;
	calificacion: number;
	comentario?: string;
	createdAt?: string;
	updatedAt?: string;
}