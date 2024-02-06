import { TipoConteudo } from '../enums/tipo-conteudo';
import { Formatacao } from './formatacao';

export interface Conteudo {
    id: string;
    tipo: TipoConteudo;
    elemento: any;
    classe: string;
    texto: string;
    editavel: boolean;
    selecionado: boolean;
    formatacao: Formatacao;
    url: string;
    novaJanela: boolean;
}
