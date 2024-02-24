import { Injectable } from '@angular/core';
import { Componente } from '../models/componente';

@Injectable({
    providedIn: 'root',
})
export class ComponenteService {
    private componentes: Componente[] = [
        {
            codigo: 1,
            texto: 'Titulo',
            icone: 'title.svg',
            inativo: false,
        },
        {
            codigo: 2,
            texto: 'Parágrafo',
            icone: 'web-page.svg',
            inativo: false,
        },
        {
            codigo: 3,
            texto: 'Botão',
            icone: 'button.svg',
            inativo: false,
        },
        {
            codigo: 4,
            texto: 'Link',
            icone: 'http.svg',
            inativo: false,
        },
        {
            codigo: 5,
            texto: 'Imagem',
            icone: 'image.svg',
            inativo: true,
        },
        {
            codigo: 6,
            texto: 'Vídeo',
            icone: 'facebook.svg',
            inativo: true,
        },
        {
            codigo: 7,
            texto: 'Arquivo',
            icone: 'upload.svg',
            inativo: true,
        },
        {
            codigo: 8,
            texto: 'Painéis',
            icone: 'chapter.svg',
            inativo: true,
        },
        {
            codigo: 9,
            texto: 'Divisor',
            icone: 'minus.svg',
            inativo: true,
        },
    ];

    constructor() {}

    listar(): Componente[] {
        return this.componentes;
    }
}
