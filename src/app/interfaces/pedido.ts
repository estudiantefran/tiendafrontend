import { Producto } from './producto';
import { Usuario } from './usuario';

export type EstadoPago =
	'Pendiente' | 'Aprobado' | 'Rechazado' | 'Reembolsado';

export type EstadoPedido =
	'Pendiente' | 'Preparando' | 'Enviado' | 'Entregado' | 'Cancelado';

export interface ProductoPedido {
	producto: string | Producto;
	presentacion: string;
	peso: string;
	cantidad: number;
	precio: number;
}

export interface DireccionEnvio {
	departamento: string;
	ciudad: string;
	barrio?: string;
	direccion: string;
}

export interface Pedido {
	_id?: string;
	usuario: string | Usuario;
	productos: ProductoPedido[];
	direccionEnvio: DireccionEnvio;
	subtotal: number;
	envio?: number;
	total: number;
	metodoPago: string;
	referenciaPago?: string;
	valorPago?: number;
	estadoPago?: EstadoPago;
	estado?: EstadoPedido;
	createdAt?: string;
	updatedAt?: string;
}