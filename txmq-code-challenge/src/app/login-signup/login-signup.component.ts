import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {

  constructor() { }

  newUserName = '';
  newUserEmail = '';
  newUserPassword = '';

  userEmail = '';
  userPassword = '';
  userID = '';

  signUp = false;
  login = true;

  @Output() private onChange: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    if (!localStorage.getItem('users')) {
      var users = [{ id: 1, name: 'admin', email: 'admin@admin.com', password: 'admin' }];
      localStorage.setItem('users', JSON.stringify(users))
    }
  }

  create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  tryLogin() {
    console.log('fetching user')
    var users = JSON.parse(localStorage.getItem('users') || '')
    console.log(users)
    //inefficient but working
    for (var i = 0; i < users.length; i++) {
      console.log(users[i])
      if (users[i].email === this.userEmail && users[i].password === this.userPassword) {
        console.log(true, users[i].id)
        localStorage.setItem('user', users[i].id)
        this.userID = users[i].id;
        this.login = false;
        this.signUp = false;
        this.onChange.emit(this.userID)
      }
    }
  }

  createUser() {
    console.log('creating user')
    var UUID = this.create_UUID()
    var newUser = {
      id: UUID,
      name: this.newUserName,
      email: this.newUserEmail,
      password: this.newUserPassword
    }
    var users = JSON.parse(localStorage.getItem('users') || '');
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
  }

}
