import { Component, Input, Output, EventEmitter } from '@angular/core'
import { MatMenu, MatMenuTrigger } from '@angular/material/menu'
import { element } from 'protractor'
import { FileElement } from './model/file-element'
import { v4 } from 'uuid'
// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { FileElement } from './model/file-element';
// import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
// import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';
import { NewFileDialogComponent } from './modals/new-file-dialog/new-file-dialog.component'
import { EMLINK } from 'constants'
import { timeStamp } from 'console'

@Component({
  selector: 'file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css'],
})
export class FileExplorerComponent {
  constructor(public dialog: MatDialog) { }


  @Input() fileElements?: FileElement[]
  @Input() canNavigateUp?: string
  @Input() path?: string

  @Output() folderAdded = new EventEmitter<{ name: string }>()
  @Output() fileAdded = new EventEmitter<{ name: string, isFolder: boolean, data?: string, dataType: string }>()
  @Output() elementShared = new EventEmitter<FileElement>()
  @Output() elementRemoved = new EventEmitter<FileElement>()
  @Output() elementRenamed = new EventEmitter<FileElement>()
  @Output() elementDownloaded = new EventEmitter<FileElement>()
  @Output() elementMoved = new EventEmitter<{
    element: FileElement
    moveTo: FileElement
  }>()
  @Output() navigatedDown = new EventEmitter<FileElement>()
  @Output() navigatedUp = new EventEmitter()

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element)
  }

  downloadElement(element: FileElement) {
    this.elementDownloaded.emit(element)
  }

  shareElement(element: FileElement) {
    this.elementShared.emit(element)
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element)
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo })
  }

  openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openRenameDialog(element: FileElement) {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }

  openNewFileDialog(element: FileElement) {

  }

  openMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  uploadFile() {
    console.log('upload file')
    let dialogRef = this.dialog.open(NewFileDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log(93, res.dataType)
        this.fileAdded.emit({ name: res.fileName || '', data: res.data, isFolder: false, dataType: res.dataType })
      }
    })

  };

}