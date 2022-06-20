import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import axios from "axios";

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private email!:String;
  private password!:String;
  private tel!:String;
  private tokenCode!:String;
  private token!:String;

  constructor() {
  }

  creatUser(email:String, password:String, tel:String) {
    return new Promise<void>(((resolve, reject) => {
      axios.post(`${environment.URL}/users/creatUser`, {
        email: email,
        password: password,
        tel: tel
      }).then((res:any) => {
        this.email = email;
        this.password = password;
        this.tel = tel;
        this.token = res.data.token;
        resolve();
      }).catch((err:any) => reject(err.message))
    }))
  }

  connexionUser(email:String, password:String){
    return new Promise<void>(((resolve, reject) => {
      axios.post(`${environment.URL}/users/connexionUser`, {
        email: email,
        password: password,
      }).then((res:any) => {
        this.email = email;
        this.password = password;
        this.tokenCode = res.data.tokenCode;
        resolve();
      }).catch((err:any) => reject(err))
    }))
  }

  verifCodeSms(code:String){
    return new Promise<void>(((resolve, reject) => {
      axios.post(`${environment.URL}/users/verifCodeSms`, {
        code: code,
        email: this.email
      },
        {
        headers: {
          Authorization: "" + this.tokenCode
        },
      }).then((res:any) => {
        resolve();
      }).catch((err:any) => reject(err.message))
    }))
  }

}
