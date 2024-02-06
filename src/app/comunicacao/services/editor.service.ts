import { ElementRef, Injectable } from '@angular/core';
import { Conteudo } from '../models/conteudo';
import { Formatacao } from '../models/formatacao';
import { Alinhamento } from '../enums/alinhamento';
import { TipoConteudo } from '../enums/tipo-conteudo';

@Injectable({
    providedIn: 'root',
})
export class EditorService {
    constructor() {}

    buscarElemento(container: ElementRef, seletor: string): any {
        return container.nativeElement.querySelector(seletor);
    }

    criarTitulo(id: string, elemento: any): Conteudo {
        let conteudo = this.criarConteudo(
            id,
            'h1',
            'Título do conteúdo',
            elemento,
        );
        conteudo.tipo = TipoConteudo.titulo;
        return conteudo;
    }

    criarParagrafo(id: string, elemento: any): Conteudo {
        let conteudo = this.criarConteudo(
            id,
            'p',
            'Texto do parágrafo',
            elemento,
        );
        conteudo.tipo = TipoConteudo.paragrafo;
        return conteudo;
    }

    criarBotao(id: string, elemento: any): Conteudo {
        let conteudo = this.criarConteudo(
            id,
            'btn-principal',
            'Texto do botão',
            elemento,
        );
        conteudo.tipo = TipoConteudo.botao;
        conteudo.formatacao.cor = '#ffffff';
        conteudo.formatacao.corFundo = '#000000';
        return conteudo;
    }

    criarLink(id: string, elemento: any): Conteudo {
        let conteudo = this.criarConteudo(
            id,
            'link',
            'Texto do link',
            elemento,
        );
        conteudo.tipo = TipoConteudo.link;
        conteudo.formatacao.cor = '#0000ff';
        return conteudo;
    }

    private criarConteudo(
        id: string,
        classe: string,
        texto: string,
        elemento: any,
    ) {
        return {
            id: id,
            formatacao: {
                negrito: false,
                italico: false,
                sublinhado: false,
                alinhamento: Alinhamento.esquerda,
                cor: '#000000',
                corFundo: '#ffffff',
            } as Formatacao,
            classe: classe,
            elemento: elemento,
            texto: texto,
        } as Conteudo;
    }
}
