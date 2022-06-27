import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import {UserService} from "../services/user.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(private router: Router,
              private toastr: ToastrService,
              private userService: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  async onSubmit() {
    try {
      await this.userService.connexionUser(this.form.value.email,this.form.value.password)
      this.router.navigate(["/confirmation"])
    } catch (e:any){
      this.toastr.error(e.response.data.error)
    }
  }
}
