import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TrainingService} from '../training.service';
import {Exercise} from '../exercise.model';
import {Subscription} from 'rxjs';
import {UiService} from '../../shared/ui.service';

@Component({
	selector: 'app-new-training',
	templateUrl: './new-training.component.html',
	styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
	exercises: Exercise[];
	private exerciseSubscription: Subscription;
	private loadingSubcription: Subscription;
	isLoading: boolean = true;

	constructor(private trainingService: TrainingService, private uiService: UiService) {
	}

	ngOnInit() {
		this.loadingSubcription = this.uiService.loadingStateChanged.subscribe( isLoading => {
			this.isLoading = isLoading;
		});
		this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
			this.exercises = exercises;
		});
		this.fetchExercises();
	}

	fetchExercises(){
		this.trainingService.fetchAvailableExercises();
	}

	onStartTraining(form: NgForm) {
		this.trainingService.startExercise(form.value.exercise);
	}

	ngOnDestroy(): void {
		if (this.exerciseSubscription){
			this.exerciseSubscription.unsubscribe();
		}
		if (this.loadingSubcription){
			this.loadingSubcription.unsubscribe();
		}
	}

}
