import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrl: './preview.component.css',
})
export class PreviewComponent implements OnInit {
    html!: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        this.html = this.sanitizer.bypassSecurityTrustHtml(
            localStorage.getItem('html') || '',
        );

        console.log(this.html);
    }
}
