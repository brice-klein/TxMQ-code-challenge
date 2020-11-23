import { Injectable } from '@angular/core';

import { v4 } from 'uuid';
import { FileElement } from '../file-explorer/model/file-element';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { element } from 'protractor';
import { localizedString } from '@angular/compiler/src/output/output_ast';


export interface IFileService {
  add(fileElement: FileElement): FileElement
  delete(id: string): string
  update(id: string, update: Partial<FileElement>): string
  queryInFolder(folderId: string): Observable<FileElement[]>
  get(id: string): FileElement
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() {
  }

  add(fileElement: FileElement) {
    console.log('add fuke ')
    fileElement.id = v4();
    fileElement.owner = localStorage.getItem('user') || '';

    if (!fileElement.isFolder) {
      console.log('file')
    }

    let payload = JSON.parse(localStorage.getItem('files') || '');
    payload.push(fileElement);
    localStorage.setItem('files', JSON.stringify(payload))
  }

  delete(id: string) {
    console.log('delete')
    console.log(id)
    let files = JSON.parse(localStorage.getItem('files') || '')
    console.log(files)
    for (var i = 0; i < files.length; i++) {
      if (files[i].id === id) {
        console.log(true)
        files.splice(i, 1)
      }
    }
    let payload = JSON.stringify(files);
    localStorage.setItem('files', payload);
  }

  update(id: string, update: Partial<FileElement>) {

    let files = JSON.parse(localStorage.getItem('files') || '')
    let element;

    for (var i = 0; i < files.length; i++) {
      if (files[i].id === id) {
        element = files[i];
        files.splice(i, 1)
      }
    }

    element = Object.assign(element, update)
    console.log(element)
    let updates = files;
    updates.push(element)
    let payload = JSON.stringify(updates)
    localStorage.setItem('files', payload);
  }

  share(fileElement: FileElement, isNested: boolean = false, filesArr: Array<FileElement> = []) {
    console.log('shared', fileElement)
    if (filesArr && isNested) {
      let payload = JSON.stringify(filesArr);
      localStorage.setItem('files', payload)
    }
    let files = JSON.parse(localStorage.getItem('files') || '')
    let parent
    for (var i = 0; i < files.length; i++) {
      if (files[i].id === fileElement.id) {
        console.log(86, true)
        files[i].shared = true;
        parent = files[i]
      }
    }
    if (parent.isFolder) {
      for (var j = 0; j < files.length; j++) {
        if (files[j].parent === parent.id) {
          files[j].shared = true
          console.log(files[j])
          if (files[j].isFolder) {
            this.share(files[j], true, files)
          } else {
            files[j].shared = true;
          }
        }
      }
      let payload = JSON.stringify(files);
      localStorage.setItem('files', payload);
    } else {
      let payload = JSON.stringify(files);
      localStorage.setItem('files', payload)
    }
  }

  private querySubject: BehaviorSubject<FileElement[]>
  queryInFolder(folderId: string) {
    console.log('query')
    const result: FileElement[] = []
    let files = JSON.parse(localStorage.getItem('files') || '');

    for (var i = 0; i < files.length; i++) {
      if (files[i].parent === folderId && files[i].owner === localStorage.getItem('user')) {
        result.push(files[i])
      }
    }
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result)
    } else {
      this.querySubject.next(result)
    }
    return this.querySubject.asObservable()
  }

  // private queryName: BehaviorSubject<FileElement[]>
  // queryName(folderId: string) {
  //   console.log('query')
  //   const result: FileElement[] = []
  //   let files = JSON.parse(localStorage.getItem('files') || '');

  //   for (var i = 0; i < files.length; i++) {
  //     if (files[i].parent === folderId && files[i].owner === localStorage.getItem('user')) {
  //       result.push(files[i])
  //     }
  //   }
  //   if (!this.querySubject) {
  //     this.querySubject = new BehaviorSubject(result)
  //   } else {
  //     this.querySubject.next(result)
  //   }
  //   return this.querySubject.asObservable()
  // }


  //check contents
  //for all ocntent add shared with user to users list
  //if the curent content is folder
  //recursive call to this function passing in its id

  get(id: string) {
    console.log('get')
    let files = JSON.parse(localStorage.getItem('files') || '');
    for (var i = 0; i < files.length; i++) {
      if (files[i].id === id) {
        return files[i]
      }
    }
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element))
  }
}

