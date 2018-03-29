import { Facility } from './../shared/DBModels/facility.model';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import 'rxjs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	public facilities: Facility[] = [];

	constructor(
		private http: HttpClient
	) { }

	ngOnInit() {
		this.getFacilityLocations();
	}

	getFacilityLocations(): void {
		this.http.get('http://scadevjobs.com/api/Locations').subscribe(
			(res: any) => this.facilities = res.data,
			err => console.log(err));
	}

}
