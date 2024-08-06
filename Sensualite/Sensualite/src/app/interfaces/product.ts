export interface Product{
    id: number,
    nombre: string,
    tipo: string,
    precio: number,
    descripcion: string,
    existencia: number,
    imagen: Blob,
    quantity?: number;
}