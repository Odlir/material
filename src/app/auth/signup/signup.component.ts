import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UiService} from '../../shared/ui.service';
import {Subscription} from 'rxjs';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

	maxDate;
	isLoading: boolean = false;
	private loadingSubs: Subscription;

	constructor(private authService: AuthService, private uiService: UiService) {
	}

	ngOnInit() {
		this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isloading => {
			this.isLoading = isloading;
		});
		this.maxDate = new Date();
		this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
	}

	onSubmit(form: NgForm) {
		this.authService.registerUser({
			email: form.value.email,
			password: form.value.password
		});
	}

	ngOnDestroy(): void {
		if (this.loadingSubs){
			this.loadingSubs.unsubscribe();
		}
	}

}
