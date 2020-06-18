import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,NgForm} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signinForm: FormGroup;

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}


  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    this.authService.login(form.value.email, form.value.password);
    form.resetForm();
  }


  ngOnInit(): void {
  }

}
