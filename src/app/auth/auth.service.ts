import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Router} from '@angular/router';
import {AuthData} from './auth-data.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {TrainingService} from '../training/training.service';
import {UiService} from '../shared/ui.service';

@Injectable()
export class AuthService {
	authChange = new Subject<boolean>();
	private isAuthenticated: boolean = false;

	constructor(private router: Router,
				private afAuth: AngularFireAuth,
				private trainingService: TrainingService,
				private uiService: UiService) {
	}

	initAuthListener(){
		this.afAuth.authState.subscribe( user => {
			if (user){
				this.authSuccesfully(true, true, '/training');
			}else {
				this.trainingService.cancelSubscriptions();
				this.authSuccesfully(false, false, 'login');
			}
		});
	}

	registerUser(authData: AuthData) {
		this.uiService.loadingStateChanged.next(true);
		this.afAuth.auth.createUserWithEmailAndPassword(
			authData.email,
			authData.password).then( res => {
			this.uiService.loadingStateChanged.next(false);
		}).catch( error => {
			this.uiService.loadingStateChanged.next(false);
			this.uiService.showSnackbar(error.message, null, 3000);
		});
	}

	login(authData: AuthData) {
		this.uiService.loadingStateChanged.next(true);
		this.afAuth.auth.signInWithEmailAndPassword(
			authData.email,
			authData.password)
			.then( res => {
				this.uiService.loadingStateChanged.next(false);
				this.authSuccesfully(true, true, 'login');
			})
			.catch( error => {
				this.uiService.loadingStateChanged.next(false);
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	logout() {
		this.trainingService.cancelSubscriptions();
		this.authSuccesfully(false, false, '/login');
	}

	isAuth() {
		return this.isAuthenticated;
	}

	private authSuccesfully(isAuth: boolean, authChange: boolean, path) {
		this.isAuthenticated = isAuth;
		this.authChange.next(authChange);
		this.router.navigate([path]);
	}

}
