import { Produto } from "./produto";

export class ItemCesta {
    produto : Produto = new Produto();
    quantidade: number = 0;
    valorTotal: number = 0;
}
