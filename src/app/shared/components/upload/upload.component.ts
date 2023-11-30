import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DOCUMENT, NgIf, NgStyle, NgFor, AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'wfvs-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  standalone: true,
  imports: [NgIf, NgStyle, NgFor, AsyncPipe, JsonPipe]
})
export class UploadComponent {

  @ViewChild('fileInput', { static: true }) selectedFile: any;
  @ViewChild('fileLabel', { static: true }) label!: ElementRef<HTMLElement>;
  @ViewChild('folderLabel', { static: true }) folderlabel!: ElementRef<HTMLElement>;

  url = environment.else_rest_url + '/files';

  fileList: FileList | undefined;
  showFile = false;
  fileUploads: Observable<string[]> | undefined;
  selectedImage: any;
  selectedJson: any;
  progress: { percentage: number } = { percentage: 0 };
  isInProgress = false;

  constructor(
    private http: HttpClient,
    private message: MessageService,
    @Inject(DOCUMENT) private readonly document: Document
  ) { }

  onFileChange(files: FileList | null): void {
    if (files) {
      this.fileList = files;
      if (files.length > 1) {
        this.label.nativeElement.innerHTML = files.length + ' Files';
      } else {
        this.label.nativeElement.innerHTML = files[0].name;
      }
    }
  }

  onFolderChange(files: FileList | null): void {
    if (files) {
      this.fileList = files;
      this.folderlabel.nativeElement.innerHTML = files.length + ' Files';
    }
    // console.log('files', files)
    // spread works only if untyped ...
    // [...files].forEach((f) => console.log('untyped', f.webkitRelativePath, f.name));
    // typed FileList requires imlicit cast to any in order to get webkitRelativePath
    // Array.from(files).forEach((file: any) => console.log(file.webkitRelativePath));
    // need cast to Array if typed ...
    /*
    for (let file of Array.from(files)) {
      console.log(file)
    }
    */
  }

  upload() {
    this.progress.percentage = 0;
    const data = new FormData();
    if (this.fileList)
      Array.from(this.fileList).forEach(f => {
        data.append('files2upload', f, f.name);
      });

    this.http.post(this.url, data, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.isInProgress = true;
          this.progress.percentage = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        } else if (event.type === HttpEventType.Response) {
          this.message.success(event.status + ' ' + event.statusText + ' ' + JSON.stringify(event.body));
          this.isInProgress = false;
          this.label.nativeElement.innerHTML = 'Select OR Drop files';
          this.fileList = undefined;
        }
      },
      error: (error) => {
        this.message.error(error);
        this.isInProgress = false;
        this.label.nativeElement.innerHTML = 'Select OR Drop files';
        this.fileList = undefined;
      }
    });
  }

  getFiles(): Observable<any> {
    return this.http.get(this.url).pipe(
      catchError((error) => {
        this.message.error(error);
        return of();
      })
    );
  }

  showFiles() {
    if (this.showFile) {
      this.showFile = false;
      this.selectedImage = undefined;
      this.selectedJson = undefined;
    } else {
      this.showFile = true;
      this.fileUploads = this.getFiles();
    }
  }

  setImageSource(file: string) {
    if (file.endsWith('jpg') || file.endsWith('png') || file.endsWith('svg')) {
      this.selectedImage = file;
    } else if (file.endsWith('json')) {
      this.http.get(file)
        .subscribe(json => {
          this.selectedJson = json;
        });
    }
  }

  createLink(blob: Blob | MediaSource, name: string): void {
    const a = this.document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = name;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  downloadBlob(uri: string): Observable<Blob> {
    return this.http.get(uri, { responseType: 'blob' });
  }

  download(uri: string): void {
    this.downloadBlob(uri).subscribe(
      response => {
        if (response) {
          this.createLink(response, uri.substring(uri.lastIndexOf('/') + 1))
        }
      }
    );
  }
}
