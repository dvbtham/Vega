import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PhotoService {
    constructor(private http: Http) { }

    upload(vehicleId: any, photo: any) {
        var formData = new FormData();
        formData.append('file', photo);
		console.log(formData);
        return this.http.post(`/api/vehicles/${vehicleId}/photos`, formData).map(result => result.json());
    }

    getPhotos(vehicleId: any) {
        return this.http.get(`/api/vehicles/${vehicleId}/photos`).map(result => result.json());
    }
}