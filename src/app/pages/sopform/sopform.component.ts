import { Component, Inject, OnInit, InjectionToken, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AssignmentService } from '../../Service/Assignment.service';
import { IAssignmentService } from '../../Repository/IAssignment.service';

const auth = InjectionToken<IAssignmentService>;

@Component({
  selector: 'app-sopform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sopform.component.html',
  styleUrl: './sopform.component.css',
  providers: [
    {
      provide: auth,
      useClass: AssignmentService,
    }
  ]
})
export class SopformComponent implements OnInit {
  sopForm!: FormGroup;
  selectedQuestion: any = null;
  selectedCategory: any = null;
  selectedAnswers: any[] = [];
  selectedQuestionId: string | null = null;
  category: any;
  questions: any;
  textboxClicked: string | null = null;
  selectedQuestionIndex = 0;
  selectedCategoryIndex = 0;
  addedDataMap: { [key: string]: string[][] } = {};
  buttonAddDataMap: { [questionId: string]: { [buttonKey: string]: any[][] } } = {};
  renderKey = 1;
  dropdownSubMap: { [controlName: string]: any[] } = {};
  selectionLog: { title: string, key: string, value: string }[] = [];
  isLoading = false;

  constructor(@Inject(auth) private _authService: IAssignmentService, private fb: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.sopForm = new FormGroup({});
    this.GetSOP_QA();

  }

  GetSOP_QA() {
    this.isLoading = true;
  
    this._authService.GetSOP_QA().subscribe({
      next: res => {
        this.category = res.Data;
//        console.log('Data:', this.category);
        this.isLoading = false;
      },
      error: err => {
      //  console.error('Error loading questions', err);
        this.isLoading = false;
      }
    });
  }
  

  onSubmit() {
    //console.log('Submitted Form:', this.sopForm.value);
  }

  onQuestionSubmit(selectedQuestionId) {

    const finalJson = this.collectAnswersByQuestionId(selectedQuestionId);
   // console.log('Final JSON:', JSON.stringify(finalJson));

    // ✅ Mark the current question as answered
    const index = this.questions.findIndex(q => q.questionId === selectedQuestionId);
    if (index !== -1) {
      const hasAnswers = Array.isArray(finalJson.answers) && finalJson.answers.some(a => a.value?.trim?.() !== '' || a.label?.trim?.() !== '');
    this.questions[index].answered = hasAnswers;
    }

    // 🔁 Navigate to next question or category
    const nextIndex = this.selectedQuestionIndex + 1;
    if (nextIndex < this.questions.length) {
      this.onQuestionClick(this.questions[nextIndex]);
    } else {
      this.loadNextCategory();
    }

  }

  loadNextCategory(): void {
    const nextCatIndex = this.selectedCategoryIndex + 1;
    if (nextCatIndex < this.category.length) {
      const nextCategory = this.category[nextCatIndex];
      this.onCategoryClick(nextCategory);
    } else {
      console.log('All categories completed!');
    }
  }

  onCategoryClick(cat: any): void {
    this.selectedQuestion = null;
    this.selectedCategory = cat;
    this.questions = cat.questions;
   // console.log('questions Data:', this.questions);
    this.selectedCategoryIndex = this.category.findIndex(c => c.categoryId === cat.categoryId);
    if (this.questions.length > 0) {
      this.onQuestionClick(this.questions[0]);
    }
  }

  onQuestionClick(question: any): void {
    this.selectionLog = [];
    this.selectedQuestion = question;
    this.selectedQuestionId = question.questionId;
    this.selectedQuestionIndex = this.questions.findIndex(q => q.questionId === question.questionId);

    if (this.sopForm.contains(question.questionId)) {
      this.sopForm.removeControl(question.questionId);
    }

    const questionGroup = new FormGroup({});
    const answerLevel = 1;
    const prefix = `${question.questionId}`;

    const answer1s = question.customersopanswer1s || [];
    const answersArray = this.buildAnswersRecursively(answer1s, questionGroup, answerLevel, prefix);
    this.selectedAnswers = answersArray;
    this.sopForm.addControl(question.questionId, questionGroup);
  }

  
  // ✅ Regenerated buildAnswersRecursively() — Ensures radio/dropdown have key = controlName

  buildAnswersRecursively(
    answers: any[],
    formGroup: FormGroup,
    level: number,
    prefix: string,
    accumulatedControls: any[] = []
  ): any[] {
    const nextLevel = level + 1;
    const nextAnswerKey = `customersopanswer${nextLevel}s`;
  
    let tempAnswers: any[] = [];
  
    // 🚫 Don't handle buttonAdd here anymore — defer it
    const buttonAddAnswers: any[] = [];
  
    answers.forEach((ans, index) => {
      const currentPrefix = `${prefix}_lvl${level}_${index}`;
      const controlKey = `${currentPrefix}_key`;
  
      if (["textboxnormal", "textboxalphanumeric", "textboxnumeric", "textboxcal"].includes(ans.answerType)) {
        formGroup.addControl(controlKey, new FormControl(''));
        const controlObj = { answertype: ans.answerType, Title: ans.title, key: controlKey };
        tempAnswers.push(controlObj);
        accumulatedControls.push(controlObj);
        return;
      }
  
      if (ans.answerType === 'radiobutton') {
        const controlName = `${currentPrefix}_radio`;
        formGroup.addControl(controlName, new FormControl(''));
  
        const options = (ans[nextAnswerKey] || []).map((opt: any, optIndex: number) => {
          const subarr = opt.subAnswerFlag === 'Y'
            ? this.buildAnswersRecursively(
                opt[`customersopanswer${nextLevel + 1}s`] || [],
                formGroup,
                nextLevel + 1,
                `${currentPrefix}_opt${optIndex}`,
                accumulatedControls
              )
            : [];
  
          return {
            key: `${controlName}_opt_${optIndex}`,
            label: this.extractAnswerLabel(opt, level, optIndex),
            subarr
          };
        });
  
        const radioObj = {
          answertype: 'radiobutton',
          Title: ans.title,
          controlName,
          options
        };
  
        tempAnswers.push(radioObj);
        accumulatedControls.push(radioObj);
        return;
      }
  
      if (ans.answerType === 'dropdown') {
        const controlName = `${currentPrefix}_dropdown`;
        formGroup.addControl(controlName, new FormControl(''));
  
        const options = (ans[nextAnswerKey] || []).map((opt: any, optIndex: number) => {
          const subarr = opt.subAnswerFlag === 'Y'
            ? this.buildAnswersRecursively(
                opt[`customersopanswer${nextLevel + 1}s`] || [],
                formGroup,
                nextLevel + 1,
                `${currentPrefix}_opt${optIndex}`,
                accumulatedControls
              )
            : [];
  
          return {
            key: `${controlName}_opt_${optIndex}`,
            label: this.extractAnswerLabel(opt, level, optIndex),
            value: this.extractAnswerLabel(opt, level, optIndex),
            subarr
          };
        });
  
        const dropdownObj = {
          answertype: 'dropdown',
          Title: ans.title,
          controlName,
          options
        };
  
        tempAnswers.push(dropdownObj);
        accumulatedControls.push(dropdownObj);
        return;
      }
  
      if (ans.answerType === 'checkbox') {
        const checkboxGroup = new FormGroup({});
        const options = (ans[nextAnswerKey] || []).map((opt: any, optIndex: number) => {
          const key = `${currentPrefix}_chk_${optIndex}`;
          checkboxGroup.addControl(key, new FormControl(false));
  
          const subarr = opt.subAnswerFlag === 'Y'
            ? this.buildAnswersRecursively(
                opt[`customersopanswer${nextLevel + 1}s`] || [],
                formGroup,
                nextLevel + 1,
                `${currentPrefix}_chk${optIndex}`,
                accumulatedControls
              )
            : [];
  
          return {
            key,
            label: this.extractAnswerLabel(opt, level, optIndex),
            subarr,
            addMultiple: opt.addMultiple === 'Y',
            formGroupKey: `${currentPrefix}_chk${optIndex}`,
            addedEntries: []
          };
        });
  
        formGroup.addControl(`${currentPrefix}_checkboxGroup`, checkboxGroup);
  
        const checkboxObj = {
          answertype: 'checkbox',
          Title: ans.title,
          key: currentPrefix,
          options
        };
  
        tempAnswers.push(checkboxObj);
        accumulatedControls.push(checkboxObj);
        return;
      }
  
      // ✅ DEFER buttonAdd
      if (ans.answerType === 'buttonAdd') {
        buttonAddAnswers.push({ ans, index });
        return;
      }
    });
  
    // ✅ Now add buttonAdd at the end, with ALL collected controls
    for (const { ans, index } of buttonAddAnswers) {
      const currentPrefix = `${prefix}_lvl${level}_${index}`;
      tempAnswers.push({
        answertype: 'buttonAdd',
        Title: ans.title,
        key: `${currentPrefix}_button`,
        subarr: [...accumulatedControls]
      });
    }
  
    return tempAnswers;
  }
  
  
  getAllFormInputs(answers: any[]): any[] {
    const inputs: any[] = [];
  
    for (const ans of answers) {
      if (['textboxnormal', 'textboxalphanumeric', 'textboxnumeric', 'radiobutton', 'dropdown', 'checkbox'].includes(ans.answertype)) {
        inputs.push(ans);
      }
  
      if (ans.options?.length) {
        for (const opt of ans.options) {
          if (opt.subarr?.length) {
            inputs.push(...this.getAllFormInputs(opt.subarr));
          }
        }
      }
    }
  
    return inputs;
  }


  extractAnswerLabel(opt: any, level: number, index: number): string {
    // Fallback for dropdown/radio options
    const fallback = index >= 0 ? `Option ${index + 1}` : 'Add';

    const labelKeys = level >= 1
      ? [`answer_${level}_Name`, 'answerName', 'answerText', 'title', 'name', 'label']
      : ['answerName', 'answerText', 'title', 'name', 'label'];

    for (const key of labelKeys) {
      if (opt[key]) return opt[key];
    }

    // Auto-detect any 'answer_x_Name' field with a value
    const dynamicKey = Object.keys(opt).find(k => /^answer_\d+_Name$/.test(k) && opt[k]);
    if (dynamicKey) return opt[dynamicKey];

    return fallback;
  }

  onAlphanumericInput(event: any) {
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  onNumericInput(event: any) {
    let input = event.target.value.replace(/[^0-9]/g, '');
  }

  getSelectedRadioSubanswers(ans: any): any[] {
    const selectedValue = this.getControlFor(ans.controlName)?.value;
    const selected = ans.options.find((opt: any) => opt.label === selectedValue);
    return selected?.subarr || [];
  }

  getControlFor(controlName: string): FormControl {
    const group = this.findFormGroupContainingControl(this.sopForm, controlName);
    if (!group) {
      //console.warn('⚠️ No FormGroup found for:', controlName);
      return new FormControl('');
    }
    const control = group.get(controlName);
    if (!control) {
      //console.warn('⚠️ No FormControl found for:', controlName);
    }
    return control as FormControl;
  }

  getSelectedDropdownSubarr(ans: any): any[] {
    const selectedValue = this.getControlFor(ans.controlName)?.value;
    const selectedOption = ans.options.find((opt: any) => opt.value === selectedValue);
    return selectedOption?.subarr || [];
  }

  getControlGroup(controlName: string): FormGroup | null {
    return this.findFormGroupContainingControl(this.sopForm, controlName);
  }

  private findFormGroupContainingControl(group: FormGroup, controlName: string): FormGroup | null {
    if (group.get(controlName)) return group;
    for (const key of Object.keys(group.controls)) {
      const ctrl = group.get(key);
      if (ctrl instanceof FormGroup) {
        const found = this.findFormGroupContainingControl(ctrl, controlName);
        if (found) return found;
      }
    }
    return null;
  }

  addNewEntry(groupKey: string, subarr: any[]) {
    const entry: string[] = [];
    let allFilled = true;

    for (let sub of subarr) {
      if (!sub.key) {
        console.warn('Missing key in subarr item:', sub);
        continue;
      }

      const ctrl = this.findFormGroupContainingControl(this.sopForm, sub.key)?.get(sub.key);
      const value = ctrl?.value?.toString().trim() || '';

      console.log(`Checking control for key: ${sub.key}, value: "${value}", found: ${!!ctrl}`);

      entry.push(value);

      if (value === '') {
        allFilled = false;
      }

      if (!ctrl) {
        console.warn(`Control not found for key: ${sub.key}`);
      }
    }

    if (!allFilled) {
      alert("Please fill in all fields before adding.");
      return;
    }

    for (let answer of this.selectedAnswers) {
      if (answer.answertype === 'checkbox') {
        for (let item of answer.options) {
          if (item.formGroupKey === groupKey) {
            if (!item.addedEntries) item.addedEntries = [];
            item.addedEntries.push(entry);

            for (let sub of subarr) {
              const ctrl = this.findFormGroupContainingControl(this.sopForm, sub.key)?.get(sub.key);
              if (ctrl) ctrl.setValue('');
            }

            console.log('Entry added:', entry);
            return;
          }
        }
      }
    }

    console.warn("Matching checkbox item not found for groupKey:", groupKey);
  }

  collectAnswersByQuestionId(questionId: string): any {
    const question = this.questions.find(q => q.questionId === questionId);
    if (!question) return null;

    const questionGroup = this.sopForm.get(questionId) as FormGroup;
    if (!questionGroup) return null;

    const result: any = {
      questionId: question.questionId,
      questionName: question.questionName,
      answers: []
    };

    const flatAnswers = this.flattenAnswers(this.selectedAnswers);

    for (const ans of flatAnswers) {
      if (ans.answertype.startsWith('textbox')) {
        const value = questionGroup.get(ans.key)?.value || '';
        result.answers.push({ type: ans.answertype, title: ans.Title, value });

      } else if (ans.answertype === 'radiobutton') {
        const value = questionGroup.get(ans.controlName)?.value || '';
        result.answers.push({ type: 'radiobutton', title: ans.Title, value });

      } else if (ans.answertype === 'dropdown') {
        const value = questionGroup.get(ans.controlName)?.value || '';
        result.answers.push({ type: 'dropdown', title: ans.Title, value });

      } else if (ans.answertype === 'checkbox') {
        const checkboxGroup = questionGroup.get(`${ans.key}_checkboxGroup`) as FormGroup;
        if (checkboxGroup) {
          for (const opt of ans.options) {
            const checked = checkboxGroup.get(opt.key)?.value;
            if (checked) {
              const entry: any = {
                type: 'checkbox',
                title: ans.Title,
                label: opt.label
              };

              // include grid data if available
              const gridData = this.addedDataMap[opt.key];
              if (gridData?.length > 0) {
                entry.subAnswers = gridData.map(row => {
                  return opt.subarr.map((subAns: any, i: number) => ({
                    title: subAns.Title,
                    value: row[i] || ''
                  }));
                });
              }

              result.answers.push(entry);
            }
          }
        }
      }
    }

    return result;
  }

  flattenAnswers(answers: any[]): any[] {
    const result: any[] = [];

    for (const ans of answers) {
      result.push(ans);
      if (ans.options?.length) {
        for (const opt of ans.options) {
          if (opt.subarr?.length) {
            result.push(...this.flattenAnswers(opt.subarr));
          }
        }
      }
    }

    return result;
  }

 // ✅ KEY FIX: Always use `key` for storing values. Ensure radio/dropdown have `key = controlName`
// ✅ Store all values during buttonAdd click, regardless of user interaction.

// ✅ Full Working Component Patch for radio, dropdown, textbox inside buttonAdd

onButtonAddClick(ans: any): void {
  const questionId = this.selectedQuestionId!;
  if (!questionId) return;

  // ✅ Use selectionLog to build the final entry (in order of interaction)
  const entry = this.selectionLog
    .filter(e => e.value?.trim() !== '' && e.title !== 'Untitled')
    .map(e => ({ title: e.title, value: e.value }));

  if (entry.length === 0) {
    alert('Please enter/select values.');
    return;
  }

  // ✅ Store in buttonAddDataMap
  if (!this.buttonAddDataMap[questionId]) this.buttonAddDataMap[questionId] = {};
  if (!this.buttonAddDataMap[questionId][ans.key]) this.buttonAddDataMap[questionId][ans.key] = [];

  // ✅ Remove duplicates (title + value) but preserve order
  const distinctEntry = this.getDistinctByTitleAndValue(entry);
  this.buttonAddDataMap[questionId][ans.key].push(distinctEntry);

  // ❌ Don't reset the form values
  // ✅ Clear the interaction log to prepare for next Add
  this.selectionLog = [];

  console.log('🟩 Final entry pushed:', distinctEntry);
}

  getDistinctByTitleAndValue(items: { title: string; value: string }[]): { title: string; value: string }[] {
    const seen = new Set<string>();
    const result: { title: string; value: string }[] = [];
  
    for (const item of items) {
      const key = `${item.title}|${item.value}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(item); // 👈 order preserved
      }
    }
  
    return result;
  }
  

  isMultiAddEnabled(ans: any): boolean {
    return ans.answertype === 'buttonAdd' && ans.subarr?.length > 0;
  }

  onRadioSelect(ans: any, label: string): void {
    ans.selectedOption = label;
    const formGroup = this.findFormGroupContainingControl(this.sopForm, ans.controlName);
    if (formGroup?.get(ans.controlName)) {
      formGroup.get(ans.controlName)!.setValue(label);
      this.logSelection(ans.Title, ans.controlName, label);
    }
  }

  onDropdownValueChange(event: Event, ans: any) {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    const formGroup = this.findFormGroupContainingControl(this.sopForm, ans.controlName);
    if (formGroup?.get(ans.controlName)) {
      formGroup.get(ans.controlName)!.setValue(value);
      this.logSelection(ans.Title, ans.controlName, value);
    }

    // ✅ Prevent crash if options are undefined
    const selectedOption = Array.isArray(ans.options)
      ? ans.options.find((opt: any) => opt.value === value)
      : null;

    this.dropdownSubMap[ans.controlName] = selectedOption?.subarr || [];

    this.cdr.detectChanges();
  }


  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getControlsForButtonAdd(targetKey: string, answers: any[]): any[] {
    const collected: any[] = [];
  
    const walk = (items: any[]): void => {
      for (const item of items) {
        if (item.key === targetKey) {
          // Stop once we hit the current buttonAdd
          return;
        }
  
        if (['textboxnormal', 'textboxnumeric', 'textboxalphanumeric', 'textboxcal'].includes(item.answertype)) {
          collected.push({ ...item });
        } else if (['radiobutton', 'dropdown'].includes(item.answertype)) {
          collected.push({ ...item });
          item.options?.forEach(opt => {
            if (opt.subarr) walk(opt.subarr);
          });
        } else if (item.answertype === 'checkbox') {
          item.options?.forEach(opt => {
            if (opt.subarr) walk(opt.subarr);
          });
        } else if (item.answertype === 'buttonAdd') {
          // Skip other buttonAdd
          continue;
        } else if (item.subarr) {
          walk(item.subarr);
        }
      }
    };
  
    walk(answers);
    return collected;
  }

  logSelection(title: string, key: string, value: string) {
    const index = this.selectionLog.findIndex(e => e.key === key);
    if (index !== -1) this.selectionLog.splice(index, 1); // remove old
    this.selectionLog.push({ title, key, value });
  }

  onTextboxBlur(ans: any): void {
    const formGroup = this.findFormGroupContainingControl(this.sopForm, ans.key);
    const value = formGroup?.get(ans.key)?.value?.toString().trim() || '';
    this.logSelection(ans.Title, ans.key, value);
  }
}
