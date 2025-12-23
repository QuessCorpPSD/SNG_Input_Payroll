import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Inject, InjectionToken, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { State } from '../../Models/Common';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { EncryptionService } from '../../Shared/encryption.service';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');
@Component({
  selector: 'state',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './state.component.html',
  styleUrl: './state.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {

      provide: COMM_TOKEN,
      useClass: CommonService,

    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StateComponent),
      multi: true
    }
  ]
})
export class StateComponent {
  searchText: string = '';
  myControl = new FormControl<string | State>('');
  state_Id: State[] = [];
  filteredOptions$!: Observable<State[]>;
  selectedOption?: State;
  userdetail!: any;
  @Input() disabled: boolean = false;
  @Output() stateEmit = new EventEmitter<State>();

  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService
    , private _sessionStoreage: SessionStorageService, private decry: EncryptionService) {

  }
  value: string = '';

  // callbacks from Angular forms
  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // optional, in case you need disable support
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.BindStateId();
    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };

  }
  BindStateId() {
    this._commonService.GetAllState().subscribe({
      next: res => {
        //console.log(res);
        this.state_Id = res.Data;
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (value && typeof value === 'object' && 'state_Name' in value) {
              searchText = value?.state_Name;
            }

            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private _filter(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.state_Id.filter(option =>
      option.state_Name.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: any): string => option?.state_Name ?? option.state_Name;

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.onChange(option); // update parent form
    this.onTouched();
    this.stateEmit.emit(this.selectedOption);
  }
}

