import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { Ioffercreation } from '../../../Repository/gsoffer/Ioffercreation';
import { OffercreationService } from '../../../Service/gsoffer/offercreation.service';
import { environment } from '../../../../environments/environment';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelHeader } from "@angular/material/expansion";
import { MatStepperModule } from "@angular/material/stepper";
import { MatIconModule } from "@angular/material/icon";
export const Pay_TOKEN = new InjectionToken<Ioffercreation>('Pay_TOKEN');

@Component({
  selector: 'app-offercreation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatAccordion, MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelHeader, MatStepperModule, MatIconModule],
  templateUrl: './offercreation.component.html',
  styleUrl: './offercreation.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: OffercreationService,
    }
  ]
})
export class OffercreationComponent {

  form!: FormGroup;
  forms: any[] = [];
  dropdownOptions: { [key: string]: any[] } = {};
  currentFormIndex = 0;
  formGroup = '';
  formsFormGroups: { [key: string]: FormGroup } = {};
  showCreateOfferAccordion = false;
  showBulkOffer = false;
  showManualInput = false;
  showAadharValidation = false;
  showApproval = false;
  constructor(
    private fb: FormBuilder, @Inject(Pay_TOKEN) private service: Ioffercreation, private http: HttpClient,
  ) { }

  ngOnInit() {
    this.loadForm();
  }
  activeStep = 0;

  activeSubmenuStep0: 'create' | 'bulk' = 'create';
  activeSubmenuStep1: 'manual' | 'aadhar' | 'auto' = 'manual';
  activeSubmenuStep2: 'single' | 'bulk' = 'single';
  stepCompleted = {
    step0: false, // Offer Creation
    step1: false, // Offer Validation
    step2: false  // Offer Approval
  };


  steps = [
    { label: 'Offer Creation' },
    { label: 'Offer Validation' },
    { label: 'Offer Approval' }
  ];
  getStepIcon(index: number): string {
    if (index === 0) {
      return this.stepCompleted.step0 ? 'check_circle' : 'edit';
    }

    if (index === 1) {
      if (!this.stepCompleted.step0) return 'lock';
      return this.stepCompleted.step1 ? 'check_circle' : 'verified_user';
    }

    if (index === 2) {
      if (!this.stepCompleted.step1) return 'lock';
      return 'check_circle';
    }

    return 'radio_button_unchecked';
  }

  isStepLocked(index: number): boolean {
    return (
      (index === 1 && !this.stepCompleted.step0) ||
      (index === 2 && !this.stepCompleted.step1)
    );
  }

  loadForm() {
    this.service.Formscreation().subscribe({
      next: (res: any) => {
        this.formGroup = res?.Data?.formGroup || '';
        this.forms = res?.Data?.forms || [];
        this.buildForm();
      }
    });
  }
  setActiveStep(index: number) {

   

    this.activeStep = index;

    // Reset default submenu per step
    if (index === 0) this.activeSubmenuStep0 = 'create';
    if (index === 1) this.activeSubmenuStep1 = 'manual';
    if (index === 2) this.activeSubmenuStep2 = 'single';
  }


  selectSubmenuStep0(type: 'create' | 'bulk') {
    this.activeSubmenuStep0 = type;
  }

  selectSubmenuStep1(type: 'manual' | 'aadhar' | 'auto') {
    this.activeSubmenuStep1 = type;
  }

  selectSubmenuStep2(type: 'single' | 'bulk') {
    this.activeSubmenuStep2 = type;
  }


  toggleCreateOfferAccordion() {
    if (this.activeStep === 0) {
      this.showCreateOfferAccordion = !this.showCreateOfferAccordion;
      console.log('Toggled Create Offer Accordion: ', this.showCreateOfferAccordion ? 'Open' : 'Closed');
    }
  }
  sanitize(name: string): string {
    return name.replace(/[^a-zA-Z0-9_]/g, '');
  }


  buildForm() {
    this.forms.forEach(form => {
      const fg = this.fb.group({});

      form.fields
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
        .forEach((field: any) => {

          const validators: ValidatorFn[] = [];
          if (field.isRequired) validators.push(Validators.required);

          fg.addControl(
            this.sanitize(field.fieldName),
            new FormControl(field.defaultValue || '', validators)
          );

          if (field.fieldType === 'select' && field.parentId === 0) {
            this.loadDropdown(field);
          }
        });

      this.formsFormGroups[form.formName] = fg;

      // 👇 IMPORTANT
      this.setupDependentDropdowns(form, fg);
    });
  }
  setupDependentDropdowns(form: any, fg: FormGroup) {

    form.fields.forEach((field: any) => {

      if (field.fieldType === 'select' && field.parentId > 0) {

        const parentField = form.fields.find(
          (f: any) => Number(f.fieldId) === Number(field.parentId)
        );

        if (!parentField) return;

        const parentControl = this.sanitize(parentField.fieldName);
        const childControl = this.sanitize(field.fieldName);

        fg.get(parentControl)?.valueChanges.subscribe(parentValue => {

          fg.get(childControl)?.reset();
          this.dropdownOptions[childControl] = [];

          if (!parentValue) return;

          const apiUrl =
            environment.apiUrl +
            field.apiUrl.replace('{id}', parentValue);

          this.http.get<any>(apiUrl).subscribe({
            next: (res) => {

              const data = res?.Data || [];

              this.dropdownOptions[childControl] = data;

              field.displayKey = 'name';
              field.valueKey = 'id';
            },
            error: () => {
              this.dropdownOptions[childControl] = [];
            }
          });

        });
      }
    });
  }


  nextForm(index: number) {
    const formMeta = this.forms[index];
    const fg = this.formsFormGroups[formMeta.formName];

    if (!fg) return;

    // Validate current form
    if (fg.invalid) {
      fg.markAllAsTouched();
      return;
    }

    // Expand next panel
    if (index < this.forms.length - 1) {
      this.currentFormIndex = index + 1;
    }
  }

  submitForm() {

    const payload: any = {};

    Object.keys(this.formsFormGroups).forEach((formName: string) => {
      payload[formName] = this.formsFormGroups[formName].value;
    });

    console.log('FINAL FORM DATA', payload);

    // ✅ MARK STEP 1 AS COMPLETED
    this.stepCompleted.step0 = true;

    alert('Offer Creation completed successfully.');

    // Optional: auto move to next step
    this.setActiveStep(1);
  }
  completeOfferValidation() {
    this.stepCompleted.step1 = true;
    alert('Offer Validation completed successfully.');
    this.setActiveStep(2);
  }


  loadDropdown(field: any) {

    const controlName = this.sanitize(field.fieldName);

    // ✅ API dropdown
    if (field.isApiCall && field.apiUrl) {

      const fullUrl = environment.apiUrl + field.apiUrl;

      this.http.get<any>(fullUrl).subscribe({
        next: (res) => {

          const data = res?.Data || [];

          this.dropdownOptions[controlName] = data;

          field.displayKey = 'name';
          field.valueKey = 'id';
        },
        error: () => {
          this.dropdownOptions[controlName] = [];
        }
      });

    }

    // ✅ STATIC dropdown
    else if (!field.isApiCall && field.options) {

      const parsedOptions = JSON.parse(field.options);

      this.dropdownOptions[controlName] = parsedOptions.map((opt: any) => ({
        id: opt,
        name: opt
      }));

      field.displayKey = 'name';
      field.valueKey = 'id';
    }
  }

}
