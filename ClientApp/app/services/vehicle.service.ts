import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SaveVehicle } from '../models/vehicle';

@Injectable()
export class VehicleService {

  private readonly vehiclesEndPoint: string = "/api/vehicles";
  constructor(private http: Http) { }

  getMakes() {
    return this.http.get("/api/makes").map(x => x.json());
  }
  getFeatures() {
    return this.http.get("/api/features").map(x => x.json());
  }

  create(vehicle: SaveVehicle) {
    return this.http.post(this.vehiclesEndPoint, vehicle).map(x => x.json());
  }
  update(vehicle: SaveVehicle) {
    return this.http.put(this.vehiclesEndPoint + "/" + vehicle.id, vehicle).map(x => x.json());
  }
  delete(id: any) {
    return this.http.delete(this.vehiclesEndPoint + "/" + id).map(x => x.json());
  }
  getVehivle(id: any) {
    return this.http.get(this.vehiclesEndPoint + "/" + id).map(x => x.json());
  }

  getVehicles(filter: any) {
    return this.http.get(this.vehiclesEndPoint + '?' + this.toQueryString(filter)).map(x => x.json());
  }

  toQueryString(obj: any) {
    var parts = [];
    for (var property in obj) {
      var value = obj[property];
      if (value != null && value != undefined) {
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
      }
    }
    return parts.join("&");
  }

}
