import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './comunicacao/pages/editor/editor.component';
import { PreviewComponent } from './comunicacao/pages/preview/preview.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'editor',
        pathMatch: 'full',
    },
    {
        path: 'editor',
        component: EditorComponent,
    },
    {
        path: 'preview',
        component: PreviewComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
