import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { UserUI } from '../../Models/UserUI';
export  const COMM_TOKEN=new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'user',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  encapsulation: ViewEncapsulation.None ,
    providers:[{
      
              provide: COMM_TOKEN,
              useClass: CommonService,
            
    }]
})
export class UserComponent implements OnInit {
  myControl = new FormControl<string | UserUI>('');
  user: UserUI[] = [];
  userfilteredOptions$!: Observable<UserUI[]>;
  selectedOption?: UserUI;
  @Output() userEmit = new EventEmitter<UserUI>();
 
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {
  }

  ngOnInit(): void {
    this.BindUserList();
  }
  // BindUserList() {
  //   this._commonService.GetAllUser().subscribe({
  //     next: res => { this.userList = res.Data; console.log(JSON.stringify(this.userList)) },
  //     error: err => { console.log(err.message) }
  //   })
  // }
  BindUserList() {
    this._commonService.GetAllUser().subscribe({
      next: res => {
        this.user = res.Data;
        this.userfilteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';
            if (typeof value === 'string') {
              searchText = value;
            } else if (value && typeof value === 'object' && 'name' in value) {
              searchText = value?.name;
            }
            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private _filter(value: string): UserUI[] {
    const filterValue = value.toLowerCase();
    return this.user.filter(option =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: any): string => option?.name ?? '';

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.userEmit.emit(this.selectedOption);
  }
}
