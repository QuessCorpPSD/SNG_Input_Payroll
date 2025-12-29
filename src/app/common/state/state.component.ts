import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Inject, InjectionToken, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
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
export class StateComponent implements ControlValueAccessor, OnInit {

  @Input() disabled: boolean = false;
  @Output() stateEmit = new EventEmitter<State>();

  myControl = new FormControl<State | null>(null);
  state_Id: State[] = [];
  filteredOptions$!: Observable<State[]>;
  selectedOption?: State;

  userdetail!: any;

  // CVA callbacks
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    @Inject(COMM_TOKEN) private _commonService: ICommonService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService
  ) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    this.BindStateId();
  }

  BindStateId() {
    this._commonService.GetAllState().subscribe({
      next: res => {
        this.state_Id = res.Data;

        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(null),
          map(value => {
            const searchText =
              typeof value === 'string'
                ? value
                : value?.state_Name ?? '';
            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err)
    });
  }

  private _filter(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.state_Id.filter(option =>
      option.state_Name.toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: State): string {
    return option?.state_Name ?? '';
  }

  // 🔥 called when option selected
  onOptionSelected(option: State) {
    this.selectedOption = option;
    this.myControl.setValue(option);
    this.onChange(option);
    this.onTouched();
    this.stateEmit.emit(option);
  }

  // 🔥 IMPORTANT: bind value on EDIT
  writeValue(value: State | null): void {
    if (value) {
      this.selectedOption = value;
      this.myControl.setValue(value, { emitEvent: false });
    } else {
      this.myControl.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.myControl.disable() : this.myControl.enable();
  }
}