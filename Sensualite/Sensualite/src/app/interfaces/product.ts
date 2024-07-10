export interface Product{
    id: number,
    name: string,
    type_product: string,
    price: DoubleRange,
    description: string,
    stock: number,
    imagem: Blob
}