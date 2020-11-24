import { Component, NgModule } from '@angular/core';
import { FileElement } from './file-explorer/model/file-element'
import { Observable } from 'rxjs'
import { FileService } from './service/file.service'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'txmq-code-challenge';
  public fileElements: Observable<FileElement[]>

  constructor(public fileService: FileService) { }

  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;

  ngOnInit() {
    if (!localStorage.getItem('files')) {
      let storageInit = {
        id: 1,
        isFolder: false,
        name: 'init',
        parent: 'root',
        shared: false,
        sharedWith: ['1']
      }
      let updates = []
      updates.push(storageInit);
      let payload = JSON.stringify(updates);
      localStorage.setItem('files', payload);
    } else {
      this.updateFileElementQuery();
    }
  }

  ngOnChanges() {

  }

  addFolder(folder: { name: string }) {
    this.fileService.add({ isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root' });
    this.updateFileElementQuery();
  }

  addFile(file: { name: string, data: string, dataType: string }) {
    this.fileService.add({ isFolder: false, name: file.name, data: file.data, dataType: file.dataType, parent: this.currentRoot ? this.currentRoot.id : 'root' });
    this.updateFileElementQuery();
  }

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }


    return new Blob([ab], { type: mimeString });


  }



  downloadElement(element: FileElement) {
    if (element.data && element.dataType) {
      let fileType = element.dataType;
      const blob = this.dataURItoBlob(element.data)
      const downloadUrl = URL.createObjectURL(blob)
      this.download(`${element.name}.${fileType}`, element.data)
    } else {
      alert('Error: this file\'s data appears to be corrupted.')
    }
  }

  download = (filename: string, text: string) => {
    var element = document.createElement('a')
    element.setAttribute('href', text)
    element.setAttribute('download', filename)
    element.setAttribute('target', 'blank')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  removeElement(element: FileElement) {
    this.fileService.delete(element.id || '');
    this.updateFileElementQuery();
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileElementQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.name || '');
    this.canNavigateUp = true;
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileElementQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent || '');
      this.updateFileElementQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element.id || '', { parent: event.moveTo.id });
    this.updateFileElementQuery();
  }

  renameElement(element: FileElement) {
    this.fileService.update(element.id || '', { name: element.name });
    this.updateFileElementQuery();
  }

  shareElement(fileAndUser: any) {
    this.fileService.share(fileAndUser.fileElement, fileAndUser.sharedWith)
  }

  updateFileElementQuery() {
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id || '' : 'root');
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

}
