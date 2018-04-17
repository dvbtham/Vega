import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyService } from 'ng2-toasty';
import { PhotoService } from '../../services/photo.service';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  vehicleId: number;
  vehicle: Vehicle;
  photos: any[];
  progress: any;


  constructor(
    private photoService: PhotoService,
    private progressService: ProgressService,
    private toastyService: ToastyService,
    private vehicleService: VehicleService,
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute) {
    route.params.subscribe(param => {
      this.vehicleId = +param['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        router.navigate(['/vehicles']);
        return;
      }
    });
  }

  ngOnInit() {
    this.photoService.getPhotos(this.vehicleId)
      .subscribe(photos => this.photos = photos);

    this.vehicleService.getVehivle(this.vehicleId)
      .subscribe(v => this.vehicle = v, error => {
        if (error.status === 404)
          this.router.navigate(['/home']);
      });
  }
  delete() {
    if (confirm('Are you sure?')) {
      this.vehicleService.delete(this.vehicle.id).subscribe(res => {
        this.toastyService.success({
          title: 'Success',
          msg: 'The vehicle was successfully deleted.',
          theme: 'material',
          timeout: 5000,
          showClose: true
        });
        this.router.navigate(['/vehicles/' + this.vehicleId]);
      });
    }
  }

  uploadPhoto() {
    
    this.progressService.startTracking().subscribe(progress => {      
      this.ngZone.run(() => {
        this.progress = progress;
      });
    });

    var nativeElement = this.fileInput.nativeElement;
    var file = nativeElement.files[0];
    nativeElement.value = '';
	console.log("file: "+file);

    this.photoService.upload(this.vehicleId, file)
      .subscribe(photo => this.photos.push(photo),
      error => {
        this.toastyService.error({
          title: 'Error',
          msg: error.text(),
          theme: 'material',
          showClose: true,
          timeout: 5000
        });
      });
  }

}
