import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { UserViewComponent } from './user-view/user-view.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { NewFolderDialogComponent } from './file-explorer/modals/new-folder-dialog/new-folder-dialog.component';
import { NewFileDialogComponent } from './file-explorer/modals/new-file-dialog/new-file-dialog.component';
import { ShareDialogComponent } from './file-explorer/modals/share-dialog/share-dialog.component';
import { RenameDialogComponent } from './file-explorer/modals/rename-dialog/rename-dialog.component';
import { MatButtonModule } from '@angular/material/button'
import { FileExplorerComponent } from './file-explorer/file-explorer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginSignupComponent,
    UserViewComponent,
    FileExplorerComponent,
    NewFolderDialogComponent,
    RenameDialogComponent,
    NewFileDialogComponent,
    ShareDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
