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
        },
        {
            codigo: 2,
            texto: 'Parágrafo',
            icone: 'web-page.svg',
        },
        {
            codigo: 3,
            texto: 'Botão',
            icone: 'button.svg',
        },
        {
            codigo: 4,
            texto: 'Link',
            icone: 'http.svg',
        },
        {
            codigo: 5,
            texto: 'Imagem',
            icone: 'image.svg',
        },
        {
            codigo: 6,
            texto: 'Vídeo',
            icone: 'facebook.svg',
        },
        {
            codigo: 7,
            texto: 'Arquivo',
            icone: 'upload.svg',
        },
        {
            codigo: 8,
            texto: 'Divisor',
            icone: 'minus.svg',
        },
        {
            codigo: 9,
            texto: 'Espaçador',
            icone: 'minus-2.svg',
        },
    ];

    constructor() {}

    listar(): Componente[] {
        return this.componentes;
    }
}
