import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AuthService } from 'src/app/auth/auth.service';
import { ShiftService } from 'src/app/shifts/shift.service';
import { WeekService } from '../week.service';

import { Week } from '../week.model';
import { Shift } from '../../shifts/shift.model';
import { ConstantPool } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-weeks',
  templateUrl: './all-weeks.component.html',
  styleUrls: ['./all-weeks.component.css']
})
export class AllWeeksComponent implements OnInit {
  users = [];
  sidur = [];
  form: FormGroup;
  sunday;
  saturday;
  public theCheckbox = false;

  constructor(
    public weekService: WeekService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public router: Router
  ) {
    this.form = this.formBuilder.group({
      orders: []
    });
  }
  public weekArray = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

  squares: any[];
  squares2: any[];

  ngOnInit(): void {
    this.squares = Array(21).fill(null);
    this.users = Array(21).fill(null);
    this.fillWeek(this.squares);
    this.getAllReqWeeks();
    this.getAllUsers();
  }

  fillWeek(squares) {
    for (let i = 0; i < squares.length; i++) {
      if (i < 7) {
        squares[i] = { qube: i, day: i + 1, typeShift: 1, users: [] };
      }
      else if (i > 6 && i < 14) {
        squares[i] = { qube: i, day: i - 6, typeShift: 2, users: [] };
      } else {
        squares[i] = { qube: i, day: i - 13, typeShift: 3, users: [] };
      }
    }
  }

  getAllUsers() {
    this.authService.getAllUsers().subscribe((data) => {
      const users = data;
      for (var i = 0; i < this.users.length; i++) {
        this.users[i] = users;
      }
    });
  }
  getAllReqWeeks() {
    this.weekService.getWeeks().subscribe((data) => {
      const allWeeks = data;
      for (var key in allWeeks) {
        for (var i = 0; i < this.squares.length; i++) {
          if (allWeeks[key].shifts.length < 1) {
            this.squares[i].users.push({ userId: allWeeks[key].creator._id, name: allWeeks[key].creator.name, isAvilable: true, isCheck: null });
          } else {
            this.squares[i].users.push({ userId: allWeeks[key].creator._id, name: allWeeks[key].creator.name, isAvilable: true, isCheck: null });
            for (var j = 0; j < allWeeks[key].shifts.length; j++) {
              if (allWeeks[key].shifts[j].qube == this.squares[i].qube) {
                for (var k = 0; k < this.squares[i].users.length; k++) {
                  if (allWeeks[key].shifts[j].creator == this.squares[i].users[k].userId) {
                    this.squares[i].users[k].isAvilable = false
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  changeSidor(i, row, name) {
    if (row.typeShift == 1) {
      this.squares[row.qube + 13].users.forEach((item, index) => {
        if (item.userId == name.userId) {
          if (name.isCheck == null) {
            this.squares[row.qube].users[i].isCheck = true;
            if (row.qube > 0) {
              this.squares[row.qube + 13].users[index].isCheck = false;
            }
            this.squares[row.qube + 7].users[index].isCheck = false;
          }
          else if (name.isCheck == true) {
            this.squares[row.qube].users[i].isCheck = null;
            if (row.qube > 0) {
              this.squares[row.qube + 13].users[index].isCheck = null;
            }
            this.squares[row.qube + 7].users[index].isCheck = null;
          }
        }
      });
    } else if (row.typeShift == 2) {
      this.squares[row.qube + 7].users.forEach((item, index) => {
        if (item.userId == name.userId) {
          if (name.isCheck == null) {
            this.squares[row.qube].users[i].isCheck = true;
            if (row.qube < 12) {
              this.squares[row.qube - 7].users[index].isCheck = false;
              this.squares[row.qube + 7].users[index].isCheck = false;
            }
          } else if (name.isCheck == true) {
            this.squares[row.qube].users[i].isCheck = null;
            this.squares[row.qube - 7].users[index].isCheck = null;
            this.squares[row.qube + 7].users[index].isCheck = null;
          }
        }
      });

    } else if (row.typeShift == 3) {
      this.squares[row.qube - 7].users.forEach((item, index) => {
        if (item.userId == name.userId) {
          if (name.isCheck == null) {
            this.squares[row.qube].users[i].isCheck = true;
            if (row.qube != 20) {
              this.squares[row.qube - 7].users[index].isCheck = false;
              this.squares[row.qube - 13].users[index].isCheck = false;
            }
          } else if (name.isCheck == true) {
            this.squares[row.qube].users[i].isCheck = null;
            if (row.qube != 20) {
              this.squares[row.qube - 7].users[index].isCheck = null;
              this.squares[row.qube - 13].users[index].isCheck = null;
            }
          }
        }
      });
    }
  }



  myChoose(i, row, name) {
    if (row.typeShift == 1) {
      if (row.qube > 0) {
        this.squares[row.qube + 13].users.forEach((item, index) => {
          if (item === name) {
            this.squares[row.qube + 13].users.splice(index, 1);
          }
        });
      }
      this.squares[row.qube + 7].users.forEach((item, index) => {
        if (item === name) {
          this.squares[row.qube + 7].users.splice(index, 1);
        }
      });
    } else if (row.typeShift == 2) {
      this.squares[row.qube - 7].users.forEach((item, index) => {
        if (item === name) {
          this.squares[row.qube - 7].users.splice(index, 1);
        }
      });
      this.squares[row.qube + 7].users.forEach((item, index) => {
        if (item === name) {
          this.squares[row.qube + 7].users.splice(index, 1);
        }
      });
    }
    else if (row.typeShift == 3) {
      if (row.typeShift < 19) {
        this.squares[row.qube - 13].users.forEach((item, index) => {
          if (item === name) {
            this.squares[row.qube - 13].users.splice(index, 1);
          }
        });
      }
      this.squares[row.qube - 7].users.forEach((item, index) => {
        if (item === name) {
          this.squares[row.qube - 7].users.splice(index, 1);
        }
      });
    }
  }

  saveSidur() {
    for (var i = 0; i < this.squares.length; i++) {
      var sidurQube = [];
      for (var j = 0; j < this.squares[i].users.length; j++) {
        if (this.squares[i].users[j].isCheck === true) {
          let userObj = {
            userId: this.squares[i].users[j].userId,
            name: this.squares[i].users[j].name
          }
          sidurQube.push(userObj);
        }
      }
      this.sidur[i] = sidurQube;
    }
    var days = this.getWeek(1);
    let sidurEnd = {
      start: days.sunday,
      end: days.saturday,
      qubes: this.sidur
    }

    this.weekService.createSidur(sidurEnd).subscribe(data => {
      this.opensweetalert();
      this.router.navigate(['/sidur-list']);

    })
  }
  getWeek(next: number) {
    var sunday = moment().add(next, 'week').startOf('week').format();
    var saturday = moment().add(next, 'week').endOf('week').format();

    this.sunday = moment(sunday).format('DD.MM');
    this.saturday = moment(saturday).format('DD.MM');

    return {
      sunday: sunday,
      saturday: saturday
    }
  }

  opensweetalert() {
    Swal.fire({
      text: 'Request of Shift added!',
      icon: 'success'
    });
  }

}
