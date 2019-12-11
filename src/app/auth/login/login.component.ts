import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UiService} from '../../shared/ui.service';
import {Subscription} from 'rxjs';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
	loginForm: FormGroup;
	isLoading: boolean = false;
	private loadingSubscription: Subscription;

	constructor(private authService: AuthService, private uiService: UiService) {
	}

	ngOnInit() {
		this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => {
			this.isLoading = isLoading;
		});
		this.loginForm = new FormGroup({
			email: new FormControl('', {
				validators: [Validators.required, Validators.email]
			}),
			password: new FormControl('', {validators: [Validators.required]})
		});
	}

	onSubmit() {
		this.authService.login({
			email: this.loginForm.value.email,
			password: this.loginForm.value.password
		});
	}

	ngOnDestroy(): void {
		if (this.loadingSubscription) {
			this.loadingSubscription.unsubscribe();
		}
	}

}
