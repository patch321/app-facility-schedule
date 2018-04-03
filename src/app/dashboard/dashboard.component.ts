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
	public count = {monday:0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0};
	public currentDate = new Date();
	public dateModel = new DatepickerDate();
	public myDatePickerOptions: IMyDpOptions = {dateFormat: 'mmm dd, yyyy'};
	public schedules: TeammateSchedule[] = [];
	public scheduleFile: any;
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
				this.provideWarning();
			});
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
		const items = this.schedules
		const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
		const header = Object.keys(items[0])
		let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
		csv.unshift(header.join(','))
		var completedFile = csv.join('\r\n');
		this.scheduleFile = encodeURI('data:application/csv;charset=UTF-8,' + completedFile);
		var link = document.createElement("a");
		link.setAttribute("href", this.scheduleFile);
		link.setAttribute("download", "weekly-schedule-" 
			+ this.selectedFacility.facilityName.replace(" ", "-").replace(" ", "-") 
			+ "-" + this.constructDatePickerDate(this.dateModel) 
			+ ".csv");
		document.body.appendChild(link); // Required for FF

		link.click(); // This will download the data file named "my_data.csv".
	}
}
