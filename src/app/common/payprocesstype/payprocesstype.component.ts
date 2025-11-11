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
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'payprocesstype',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './payprocesstype.component.html',
  styleUrl: './payprocesstype.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [{

    provide: COMM_TOKEN,
    useClass: CommonService,

  }]
})
export class PayprocesstypeComponent implements OnInit {
  myControl = new FormControl<string | UserUI>('');
  userfilteredOptions$!: Observable<UserUI[]>;
  selectedOption?: UserUI;
  user: any;

  @Output() userEmit = new EventEmitter<UserUI>();

  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {
  }

  ngOnInit(): void {
    this.user = [
      { value: 'PP', name: 'Regular' },
      { value: 'FPP', name: 'F&F' }
    ];
    this.myControl.setValue(this.user[0]); // Payprocess

    this.BindUserList();
  }
  // BindUserList() {
  //   this._commonService.GetAllUser().subscribe({
  //     next: res => { this.userList = res.Data; console.log(JSON.stringify(this.userList)) },
  //     error: err => { console.log(err.message) }
  //   })
  // }


  BindUserList() {
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

