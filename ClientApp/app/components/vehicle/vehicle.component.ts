import { Component, OnInit } from '@angular/core';
import { Vehicle, KeyValuePair } from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  private readonly PAGE_SIZE = 3;
  totalItems: number;
  queryResult: any = {};
  makes: KeyValuePair[];
  query: any = {
    pageSize: this.PAGE_SIZE
  };
  colunms = [
    { title: 'Id' },
    { title: 'Make', key: 'make', isSortable: true },
    { title: 'Model', key: 'model', isSortable: true },
    { title: 'Contact Name', key: 'contactName', isSortable: true },
  ];

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes().subscribe(makes => this.makes = makes);
    this.populateVehicles();
  }

  sortBy(colunmName: string) {
    if (this.query.sortBy === colunmName)
      this.query.isSortAscending = !this.query.isSortAscending;
    else {
      this.query.sortBy = colunmName;
      this.query.isSortAscending = true;
    }
    this.populateVehicles();
  }

  private populateVehicles() {
    this.vehicleService.getVehicles(this.query).subscribe(result => this.queryResult = result);
  }

  onFilterChange() {
    this.query.page = 1;
    this.populateVehicles();
  }

  resetFilter() {
    this.query = {
      page: 1,
      pageSize: this.PAGE_SIZE
    };
    this.populateVehicles();
  }

  onPageChange(page: any) {
    this.query.page = page;
    this.populateVehicles();
  }

}
