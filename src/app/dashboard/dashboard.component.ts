import { DatepickerDate } from './../shared/models/datepicker-date.model';
import { Facility } from './../shared/models/facility.model';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import 'rxjs';
import { IMyDpOptions } from 'mydatepicker';
import { TeammateSchedule } from '../shared/models/teammate-schedule.model';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	public facilities: Facility[] = [];
	public dateModel: DatepickerDate = { date: { year: 2018, month: 10, day: 9 } };
	public myDatePickerOptions: IMyDpOptions = {dateFormat: 'mmm dd, yyyy'};
	public schedules: TeammateSchedule[] = [];
	public selectedFacility: Facility;

	constructor(
		private http: HttpClient
	) { }

	ngOnInit() {
		this.getFacilityLocations();
	}

	getFacilityLocations(): void {
		this.http.get('http://scadevjobs.com/api/Locations').subscribe(
			(res: any) => {
				this.facilities = res.data;
				this.selectedFacility = this.facilities[0];
			},
			err => console.log(err));
	}

	getFacilitySchedule(): void {
		this.http.get(`http://scadevjobs.com/api/Schedules/${this.selectedFacility.facilityId}/` + this.constructDatePickerDate(this.dateModel)).subscribe(
			(res: any) => this.schedules = res.data,
			err => console.log(err));
	}

	constructDatePickerDate(dateModel: DatepickerDate): string {
		return dateModel.date.month.toString() + "-"
			+ dateModel.date.day.toString() + "-"
			+ dateModel.date.year.toString();
	}

}
