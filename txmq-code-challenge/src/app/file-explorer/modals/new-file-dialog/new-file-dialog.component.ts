import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FileService } from './../../../service/file.service'

@Component({
  selector: 'app-new-file-dialog',
  templateUrl: './new-file-dialog.component.html',
  styleUrls: ['./new-file-dialog.component.css']
})
export class NewFileDialogComponent implements OnInit {

  constructor(public fileService: FileService) { }

  fileName?: string;
  data?: string;
  reader?: any;
  dataType?: string;

  ngOnInit(): void {
    this.reader = new FileReader();
    this.reader.onload = this.handleFileRead.bind(this);

  }
  onFileUpload(event: any) {
    console.log('onchange file upload- ', event)
    console.log(event.target.dataset);

    var file = event.target.files[0];
    console.log('onFileUpload-', file)
    this.dataType = file.name.split('.').pop();
    console.log(this.dataType)
    this.reader.readAsDataURL(file)

    // function handleFileRead(event) {
    //   this.data = JSON.parse(event.target.result);
    //   console.log('handleFileRead-', this.data)
    // }

    // var file = event.target.files[0];
    // console.log(file)
    // var data = JSON.stringify(file);
    // console.log('new-file-dialog data === ', data)
    // this.data = data;
  }

  handleFileRead(event: any) {
    // console.log('42: handleFileRead-', event.target.result)
    // var txt = event.srcElement.result;
    // console.log('txt', txt)
    var save = event.target.result.toString()
    // var save = JSON.parse(event.target.result);
    console.log(46, save)
    window.localStorage.setItem('testFile', JSON.stringify(save));
    this.data = save
  }

}
