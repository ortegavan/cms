import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Componente } from '../../models/componente';
import { ComponenteService } from '../../services/componente.service';
import {
    CdkDragDrop,
    CdkDragExit,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Conteudo } from '../../models/conteudo';
import { MenuFlutuante } from '../../models/menu-flutuante';
import { EditorService } from '../../services/editor.service';
import { Alinhamento } from '../../enums/alinhamento';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.css',
})
export class EditorComponent implements OnInit {
    @ViewChild('container', { read: ElementRef, static: true })
    container!: ElementRef;
    @ViewChildren('itens') itens!: QueryList<ElementRef>;

    componentes = [] as Componente[];
    pagina = [] as Conteudo[];
    temporario = {} as Componente;
    id = 0;
    menuFlutuante = {
        conteudo: {} as Conteudo,
        trigger: {} as any,
        aberto: false,
    } as MenuFlutuante;
    cor = new FormControl('#000000');

    constructor(
        private componenteService: ComponenteService,
        private editorService: EditorService,
        private renderer: Renderer2,
        private detector: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.componentes = this.componenteService.listar();
    }

    criarConteudo(codigoComponente: number): Conteudo {
        this.id++;

        switch (codigoComponente) {
            case 1:
                return this.criarTitulo();
            case 2:
                return this.criarParagrafo();
            case 3:
                return this.criarBotao();
            case 4:
                return this.criarLink();
            default:
                return {} as Conteudo;
        }
    }

    criarTitulo(): Conteudo {
        let titulo = this.renderer.createElement('h1');
        let conteudo = this.editorService.criarTitulo(
            'conteudo' + this.id,
            titulo,
        );

        this.renderizarElemento(titulo, conteudo);

        return conteudo;
    }

    criarParagrafo(): Conteudo {
        let paragrafo = this.renderer.createElement('p');
        let conteudo = this.editorService.criarParagrafo(
            'conteudo' + this.id,
            paragrafo,
        );

        this.renderizarElemento(paragrafo, conteudo);

        return conteudo;
    }

    criarBotao(): Conteudo {
        let botao = this.renderer.createElement('a');
        this.renderer.setAttribute(botao, 'role', 'button');
        let conteudo = this.editorService.criarBotao(
            'conteudo' + this.id,
            botao,
        );

        this.renderizarElemento(botao, conteudo);

        return conteudo;
    }

    criarLink(): Conteudo {
        let link = this.renderer.createElement('a');
        let conteudo = this.editorService.criarLink('conteudo' + this.id, link);

        this.renderizarElemento(link, conteudo);

        return conteudo;
    }

    renderizarElemento(elemento: any, conteudo: Conteudo): void {
        this.renderer.setProperty(elemento, 'innerHTML', conteudo.texto);
        this.renderer.addClass(elemento, conteudo.classe);
        this.renderer.setAttribute(elemento, 'id', conteudo.id);
        this.renderer.listen(elemento, 'click', () => {
            this.editar(conteudo);
        });
    }

    entered(): void {
        this.temporario = {} as Componente;
    }

    exited(e: CdkDragExit): void {
        this.temporario = e.item.data.item;
    }

    drop1(event: any): void {
        return;
    }

    drop2(event: CdkDragDrop<any>): void {
        if (event.previousContainer != event.container) {
            let conteudo = this.criarConteudo(event.item.data.item.codigo);

            this.pagina.push(conteudo);
            this.detector.detectChanges();
            this.itens.forEach((item, index) => {
                this.renderer.appendChild(
                    item.nativeElement,
                    this.pagina[index].elemento,
                );
            });

            event.previousIndex = this.pagina.length - 1;
        }
        moveItemInArray(this.pagina, event.previousIndex, event.currentIndex);

        this.temporario = {} as Componente;
    }

    editar(conteudo: Conteudo): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );
        this.renderer.addClass(componente, 'invisivel');
        this.pagina.forEach((item) => {
            item.selecionado = false;
        });
        conteudo.selecionado = true;
        conteudo.editavel = true;

        this.detector.detectChanges();

        let input = this.editorService.buscarElemento(
            this.container,
            '#input' + conteudo.id,
        );

        this.aplicarFormatacoes(conteudo, input);

        input.focus();
    }

    encerrarEdicao(conteudo: Conteudo): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );
        this.renderer.removeClass(componente, 'invisivel');

        let input = this.editorService.buscarElemento(
            this.container,
            '#input' + conteudo.id,
        );
        conteudo.texto = input.value;
        this.renderer.setProperty(componente, 'innerHTML', conteudo.texto);

        conteudo.editavel = false;
    }

    excluir(conteudo: Conteudo): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );
        this.renderer.removeChild(this.container.nativeElement, componente);
        this.pagina.splice(this.pagina.indexOf(conteudo), 1);
        this.menuFlutuante.aberto = false;
    }

    abrirToolbar(trigger: any, conteudo: Conteudo): void {
        this.menuFlutuante.trigger = trigger;
        this.menuFlutuante.conteudo = conteudo;
        this.menuFlutuante.aberto = true;
    }

    fecharToolbar(): void {
        this.menuFlutuante.aberto = false;
        this.menuFlutuante.conteudo.selecionado = false;
    }

    alternarNegrito(conteudo: Conteudo): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );
        conteudo.formatacao.negrito = !conteudo.formatacao.negrito;

        this.formatarNegrito(conteudo, componente);
    }

    alternarItalico(conteudo: Conteudo): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );
        conteudo.formatacao.italico = !conteudo.formatacao.italico;

        this.formatarItalico(conteudo, componente);
    }

    alternarSublinhado(conteudo: Conteudo): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );
        conteudo.formatacao.sublinhado = !conteudo.formatacao.sublinhado;

        this.formatarSublinhado(conteudo, componente);
    }

    alternarAlinhamento(conteudo: Conteudo, alinhamento: Alinhamento): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );
        conteudo.formatacao.alinhamento = alinhamento;

        this.formatarAlinhamento(conteudo, componente);
    }

    aplicarCor(conteudo: Conteudo): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );

        this.formatarCor(conteudo, componente);
    }

    aplicarCorFundo(conteudo: Conteudo): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );

        this.formatarCorFundo(conteudo, componente);
    }

    atualizarURL(conteudo: Conteudo): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );
        if (conteudo.url == '' || conteudo.url == undefined) conteudo.url = '#';

        this.renderer.setAttribute(componente, 'href', conteudo.url);

        if (conteudo.novaJanela) {
            this.renderer.setAttribute(componente, 'target', '_blank');
        }
    }

    removerURL(conteudo: Conteudo): void {
        let componente = this.editorService.buscarElemento(
            this.container,
            '#' + conteudo.id,
        );
        this.renderer.removeAttribute(componente, 'href');

        if (conteudo.novaJanela) {
            this.renderer.removeAttribute(componente, 'target');
        }
    }

    formatarNegrito(conteudo: Conteudo, elemento: any) {
        if (conteudo.formatacao.negrito)
            this.renderer.setStyle(elemento, 'font-weight', 'bold');
        else this.renderer.setStyle(elemento, 'font-weight', 'normal');
    }

    formatarItalico(conteudo: Conteudo, elemento: any) {
        if (conteudo.formatacao.italico)
            this.renderer.setStyle(elemento, 'font-style', 'italic');
        else this.renderer.setStyle(elemento, 'font-style', 'normal');
    }

    formatarSublinhado(conteudo: Conteudo, elemento: any) {
        if (conteudo.formatacao.sublinhado)
            this.renderer.setStyle(elemento, 'text-decoration', 'underline');
        else this.renderer.setStyle(elemento, 'text-decoration', 'none');
    }

    formatarAlinhamento(conteudo: Conteudo, elemento: any) {
        switch (conteudo.formatacao.alinhamento) {
            case Alinhamento.esquerda:
                if (conteudo.tipo == 3 || conteudo.tipo == 4) {
                    this.renderer.setStyle(elemento, 'left', '0%');
                    this.renderer.setStyle(
                        elemento,
                        'transform',
                        'translateX(0%)',
                    );
                } else {
                    this.renderer.setStyle(elemento, 'text-align', 'left');
                }
                break;
            case Alinhamento.centro:
                if (conteudo.tipo == 3 || conteudo.tipo == 4) {
                    this.renderer.setStyle(elemento, 'left', '50%');
                    this.renderer.setStyle(
                        elemento,
                        'transform',
                        'translateX(-50%)',
                    );
                } else {
                    this.renderer.setStyle(elemento, 'text-align', 'center');
                }
                break;
            case Alinhamento.direita:
                if (conteudo.tipo == 3 || conteudo.tipo == 4) {
                    this.renderer.setStyle(elemento, 'left', '100%');
                    this.renderer.setStyle(
                        elemento,
                        'transform',
                        'translateX(-100%)',
                    );
                } else {
                    this.renderer.setStyle(elemento, 'text-align', 'right');
                }
                break;
            default:
                break;
        }
    }

    formatarCor(conteudo: Conteudo, elemento: any) {
        this.renderer.setStyle(elemento, 'color', conteudo.formatacao.cor);
    }

    formatarCorFundo(conteudo: Conteudo, elemento: any) {
        this.renderer.setStyle(
            elemento,
            'background-color',
            conteudo.formatacao.corFundo,
        );
    }

    aplicarFormatacoes(conteudo: Conteudo, elemento: any) {
        this.formatarNegrito(conteudo, elemento);
        this.formatarItalico(conteudo, elemento);
        this.formatarSublinhado(conteudo, elemento);
        this.formatarAlinhamento(conteudo, elemento);
        this.formatarCor(conteudo, elemento);
        this.formatarCorFundo(conteudo, elemento);
    }

    visualizar() {
        let html = '';

        this.pagina.forEach((item) => {
            if (item.tipo == 3 || item.tipo == 4) {
                this.atualizarURL(item);
            }

            html += item.elemento.outerHTML;

            if (item.tipo == 3 || item.tipo == 4) {
                this.removerURL(item);
            }
        });

        localStorage.setItem('html', html);
        window.open('http://localhost:4200/preview', '_blank');
    }
}
