import { Component, OnInit, Input } from '@angular/core';

import { TeammateSchedule } from '../shared/models/teammate-schedule.model';
import { sampleSchedules } from './sample-schedules';

@Component({
	selector: 'app-schedule-table',
	templateUrl: './schedule-table.component.html',
	styleUrls: ['./schedule-table.component.css']
})
export class ScheduleTableComponent implements OnInit {

	@Input() schedules: TeammateSchedule[];

	constructor() { }

	ngOnInit() {
	}

	saveSchedules(): void {
		
	}

}
