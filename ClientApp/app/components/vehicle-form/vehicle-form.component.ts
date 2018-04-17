import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/Observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { SaveVehicle, Vehicle } from '../../models/vehicle';

import * as _ from 'underscore';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[];
  features: any[];
  models: any[];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      email: '',
      phone: '',
    }
  };
  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private toastyService: ToastyService) {
    route.params.subscribe(p => {
      this.vehicle.id = +p['id'] || 0;
    });
  }

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()
    ];

    if (this.vehicle.id)
      sources.push(this.vehicleService.getVehivle(this.vehicle.id));

    Observable.forkJoin(sources).subscribe(data => {
      this.makes = data[0];
      this.features = data[1];
      if (this.vehicle.id) {
        this.setVehicle(data[2]);
        this.populateModels();
      }

    }, error => {
      if (error.status === 404)
        this.router.navigate(['/home']);
    });
  }

  private setVehicle(vehicle: Vehicle) {
    this.vehicle.id = vehicle.id;
    this.vehicle.makeId = vehicle.make.id;
    this.vehicle.modelId = vehicle.model.id;
    this.vehicle.isRegistered = vehicle.isRegistered;
    this.vehicle.contact = vehicle.contact;
    this.vehicle.features = _.pluck(vehicle.features, 'id');
  }

  private populateModels() {
    const selectedMake = this.makes.find(x => x.id == this.vehicle.makeId);
    this.models = selectedMake ? selectedMake.models : [];
  }

  onMakeChange() {
    this.populateModels();
    delete this.vehicle.modelId;
  }

  onFeatureToggle(featureId: any, $event: any) {
    if ($event.target.checked)
      this.vehicle.features.push(featureId);
    else {
      const index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit() {
    var result$ = (this.vehicle.id) ?
      this.vehicleService.update(this.vehicle) :
      this.vehicleService.create(this.vehicle);

    result$.subscribe(vehicle => {
      this.toastyService.success({
        title: 'Success',
        msg: 'Data was successfully saved.',
        theme: 'material',
        timeout: 5000,
        showClose: true
      });
      this.router.navigate(['/vehicles/' + vehicle.id]);
    });
  }

}
