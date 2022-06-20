import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(private router: Router,
              private toastr: ToastrService,
              private userService: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      tel: [null, Validators.required],
    });
  }

  async onSubmit() {
    try {
      await this.userService.creatUser(this.form.value.email,this.form.value.password,this.form.value.tel)
      this.toastr.success("L'inscription a été effectué")
      this.router.navigate(["/"])
    } catch (e:any){
      this.toastr.error(e.message)
    }
  }
}
