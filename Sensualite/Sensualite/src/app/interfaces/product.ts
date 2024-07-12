export interface Product{
    id: number,
    nombre: string,
    tipo: string,
    precio: DoubleRange,
    descripcion: string,
    existencia: number,
    imagen: Blob
}