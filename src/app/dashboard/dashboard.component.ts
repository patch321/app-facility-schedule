import { DatepickerDate } from './../shared/models/datepicker-date.model';
import { ExportToCSV } from "@molteni/export-csv";
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
	public count = {monday:0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0};
	public currentDate = new Date();
	public dateModel = new DatepickerDate();
	public exporter = new ExportToCSV();
	public myDatePickerOptions: IMyDpOptions = {dateFormat: 'mmm dd, yyyy'};
	public schedules: TeammateSchedule[] = [];
	public selectedFacility: Facility;
	public showRequiredWarning: boolean;
	public showSchedule: boolean;

	constructor(
		private http: HttpClient
	) { }

	ngOnInit() {
		this.dateModel = { date: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth(), day: this.currentDate.getDate() } };
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
		this.count = { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0 };
		this.http.get(`http://scadevjobs.com/api/Schedules/${this.selectedFacility.facilityId}/` + this.constructDatePickerDate(this.dateModel)).subscribe(
			(res: any) => this.schedules = res.data,
			err => console.log(err),
			() => {
				this.showSchedule = true;
				this.provideWarning()});
	}

	constructDatePickerDate(dateModel: DatepickerDate): string {
		return dateModel.date.month.toString() + "-"
			+ dateModel.date.day.toString() + "-"
			+ dateModel.date.year.toString();
	}

	provideWarning(): void {
		this.schedules.map( schedule => {
			if (schedule.teammateType === "Anesthesia"){
				if(schedule.monday != "OFF"){ this.count.monday++}
				if(schedule.tuesday != "OFF"){ this.count.tuesday++}
				if (schedule.wednesday != "OFF") { this.count.wednesday++}
				if (schedule.thursday != "OFF") { this.count.thursday++}
				if(schedule.friday != "OFF"){ this.count.friday++}
				if(schedule.saturday != "OFF"){ this.count.saturday++}
				if(schedule.sunday != "OFF"){ this.count.sunday++}
			}
		})
		console.log(this.count);
	}

	onSubmit(): void {
		this.showRequiredWarning = false;
		if(this.dateModel == null){
			this.showRequiredWarning = true;
		}else{
			this.getFacilitySchedule();
		}
	}

	onSave(): void {
		this.exporter.exportAllToCSV(this.schedules, "Shedules-week of " 
			+ this.dateModel.date.month + "-" + this.dateModel.date.day 
			+ "-" + this.dateModel.date.year + ".csv");
	}

}
