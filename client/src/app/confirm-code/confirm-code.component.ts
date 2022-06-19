import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import {UserService} from "../services/user.service";
@Component({
  selector: 'app-confirm-code',
  templateUrl: './confirm-code.component.html',
  styleUrls: ['./confirm-code.component.scss']
})
export class ConfirmCodeComponent implements OnInit {
  form!: FormGroup;

  constructor(private router: Router,
              private toastr: ToastrService,
              private userService: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      code: [null, Validators.required]
    });
  }

  async onSubmit() {
    try {
      await this.userService.verifCodeSms(this.form.value.code)
      this.router.navigate(["/menu"])
    } catch (e:any){
      this.toastr.error(e.message)
    }
  }
}

