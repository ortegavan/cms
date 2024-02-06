import { Alinhamento } from '../enums/alinhamento';

export interface Formatacao {
    negrito: boolean;
    italico: boolean;
    sublinhado: boolean;
    alinhamento: Alinhamento;
    cor: string;
    corFundo: string;
}
