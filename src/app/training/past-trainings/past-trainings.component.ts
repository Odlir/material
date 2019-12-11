import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import {Exercise} from '../exercise.model';
import {TrainingService} from '../training.service';
import {Subscription} from 'rxjs';

@Component({
	selector: 'app-past-trainings',
	templateUrl: './past-trainings.component.html',
	styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {

	displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
	dataSource = new MatTableDataSource<Exercise>();
	private exChangeSubscription: Subscription;

	@ViewChild(MatSort, {static: false}) sort: MatSort;
	@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

	constructor(private  trainingService: TrainingService) {
	}

	ngOnInit() {
		this.trainingService.fetchCompletedOrCancelledExercises();
		this.exChangeSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: Exercise[]) => {
			this.dataSource.data = exercises;
		});
	}

	ngAfterViewInit(): void {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}

	doFilter(filterValue: string){
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnDestroy(): void {
		if (this.exChangeSubscription){
			this.exChangeSubscription.unsubscribe();
		}
	}

}
