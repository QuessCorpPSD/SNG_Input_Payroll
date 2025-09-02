import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sop',
  standalone: true,

  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './sop.component.html',
  styleUrl: './sop.component.css'
})
export class SopComponent {
form!: FormGroup;
  formChain: FormSchema[] = [];

schema:FormSchema={
        "label": "Leaves",
        "key": "country",
        "type": "radiobutton",
        "options": [
            {
                "label": "Yes",
                "value": "yes",
                "children": {
                    "label": "Leaves Type",
                    "key": "Leaves",
                    "type": "dropdown",
                    "options": [
                        {
                            "label": "Casual Leave",
                            "value": "CF",                            
                            "children": {
                                "label":"Carry Forward",
                                "key":"CF",
                                "type": "radiobutton",
                                "options":[
                                    {
                                    "label": "Yes",
                                    "value": "yes"
                                },
                                {
                                    "label": "No",
                                    "value": "No"
                                }
                                ]
                            }
                        },
                        {
                            "label": "PersonalLeave",
                            "value": "PL"
                        },
                        {
                            "label": "Sick Leave",
                            "value": "SL"
                        }
                    ]
                }
            },
            {
              "label": "No",
                "value": "no",
            }
        ]
    }

    


//   schema: FormSchema ={
//   "label": "Country",
//   "key": "country",
//   "type": "dropdown",
//   "options": [
//     {
//       "label": "USA",
//       "value": "usa",
//       "children": {
//         "label": "State",
//         "key": "state",
//         "type": "dropdown",
//         "options": [
//           {
//             "label": "California",
//             "value": "ca",
//             "children": {
//               "label": "City",
//               "key": "city",
//               "type": "listbox",
//               "options": [
//                 { "label": "Los Angeles", "value": "la" },
//                 { "label": "San Francisco", "value": "sf" }
//               ]
//             }
//           }
//         ]
//       }
//     }
//   ]
// }




  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
     this.form = this.fb.group({});
    this.buildFormChain(this.schema);
    
  }
 buildFormChain(schema: FormSchema, path: FormSchema[] = []) {
    this.formChain = [...path, schema];

    for (const control of this.formChain) {
      if (!this.form.contains(control.key)) {
        this.form.addControl(control.key, this.fb.control(null));
      }
    }
  }
  onControlChange(levelIndex: number): void {
    const current = this.formChain[levelIndex];
    const selectedVal = this.form.get(current.key)?.value;

    const selectedOption = current.options?.find(opt => opt.value === selectedVal);

    if (selectedOption?.children) {
      this.buildFormChain(selectedOption.children, this.formChain.slice(0, levelIndex + 1));
    } else {
      this.formChain = this.formChain.slice(0, levelIndex + 1);
    }
  }

}
interface FormOption {
  label: string;
  value: string;
  children?: FormSchema;
}

interface FormSchema {
  label: string;
  key: string;
  type: 'textbox' | 'dropdown' | 'radiobutton' | 'listbox';
  options?: FormOption[];
}