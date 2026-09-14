import { Producto } from './producto';
import { Usuario } from './usuario';

export interface Favorito {
	_id?: string;
	usuario: string | Usuario;
	productos: Array<string | Producto>;
	createdAt?: string;
	updatedAt?: string;
}
