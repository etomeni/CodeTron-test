import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  photoURL: string;

  constructor(
    private platform: Platform,
  ) {}

  async openGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      // allowEditing: false,
      width: 460,
      height: 460,
      promptLabelPicture: 'Open Camera',
      promptLabelPhoto: 'Upload from Gallery',
      promptLabelHeader: 'Upload Photo',
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    // console.log(image);
    
    if (image) {
      if (Capacitor.getPlatform() == 'web') {
        this.photoURL = await this.readAsBase64(image);
      } else {
        this.photoURL = image.webPath;
      }
      
      // TO SAVE/UPLOAD THE IMAGE SOME WHERE
      const photoPath = await this.readAsBase64(image);
      // console.log(this.photoURL);
      // this.modalCtrl.dismiss();
    }
  }
  async openCamera() {

    const image = await Camera.getPhoto({
      quality: 90,
      // allowEditing: false,
      width: 460,
      height: 460,
      promptLabelPicture: 'Open Camera',
      promptLabelPhoto: 'Upload from Gallery',
      promptLabelHeader: 'Upload Photo',
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    // console.log(image);
    
    if (image) {
      if (Capacitor.getPlatform() == 'web') {
        this.photoURL = await this.readAsBase64(image);
      } else {
        this.photoURL = image.webPath;
      }
      
      // TO SAVE/UPLOAD THE IMAGE SOME WHERE
      const photoPath = await this.readAsBase64(image);
      // console.log(this.photoURL);
      // this.modalCtrl.dismiss();
    }
  }


  onDeleteImg() {
    this.photoURL = '';
  }





 



  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path
      });
  
      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
    }
  }
   
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });











  // SELECT FROM GALLERY 

  // Update pofile picture and save to database;
  onclickUploadImg() {
    (<HTMLElement>document.getElementById('imgInput')).click();
  }
  
  imagePreview(e) {
    const file = (e.target as HTMLInputElement).files[0];

    const reader = new FileReader();
    reader.onload = () => {
      // this.imgPath = reader.result as string;
      this.photoURL = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

}
