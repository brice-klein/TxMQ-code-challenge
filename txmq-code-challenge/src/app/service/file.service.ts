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
  share(fileElement: FileElement, user: string, isNested: boolean, filesArr: Array<FileElement>): string
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

  share(fileElement: FileElement, user: string, fileArr: FileElement[]) {
    let files
    let parent
    if (!fileArr) {
      files = JSON.parse(localStorage.getItem('files') || '')
    } else {
      files = fileArr
    }
    let users = JSON.parse(localStorage.getItem('users') || '');
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === user) {
        user = users[i].id;
      }
    }

    for (var i = 0; i < files.length; i++) {
      console.log(95, ' loop thru ', files[i])
      if (files[i].id === fileElement.id) {
        files[i].shared = true;
        if (!files[i].sharedWith) {
          files[i].sharedWith = [];
        }
        files[i].sharedWith.push(user)
        let payload = JSON.stringify(files);
        localStorage.setItem('files', payload)
        parent = files[i]
        break;
      }
    }

    if (parent.isFolder) {
      for (var j = 0; j < files.length; j++) {
        if (files[j].parent === parent.id) {
          files[j].shared = true
          if (!files[j].sharedWith) {
            files[j].sharedWith = [];
          }
          files[j].sharedWith.push(user)
          if (files[j].isFolder) {
            console.log(108, files[j])
            let payload = JSON.stringify(files);
            localStorage.setItem('files', payload)
            this.share(files[j], user, files)
          } else {
            console.log('file')
            files[j].shared = true;
            files[j].sharedWith.push(user)
            let payload = JSON.stringify(files);
            localStorage.setItem('files', payload)
          }
        }
      }
    } else {

      let payload = JSON.stringify(files);
      localStorage.setItem('files', payload)
    }
  }

  private querySubject: BehaviorSubject<FileElement[]>
  queryInFolder(folderId: string) {
    console.log('query')
    var user = localStorage.getItem('user')
    const result: FileElement[] = []
    let files = JSON.parse(localStorage.getItem('files') || '');

    for (var i = 0; i < files.length; i++) {
      if (files[i].parent === folderId && files[i].owner === user) {
        console.log(true, files[i])
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

  get(id: string) {
    console.log('get')
    let files = JSON.parse(localStorage.getItem('files') || '');
    var user = localStorage.getItem('user')
    for (var i = 0; i < files.length; i++) {
      if (files[i].id === id && files[i].owner === user) {
        return files[i]
      }
    }
  }

  clone(element: FileElement) {
    return JSON.parse(JSON.stringify(element))
  }
}

