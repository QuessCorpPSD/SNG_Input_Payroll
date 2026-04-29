import { Injectable } from '@angular/core';
import { PDFDocument, StandardFonts } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  async generatePdf0() {

    const DEFAULT_FONT_SIZE = 7;
    // ─────────────────────────────────────────────────────────────────────────
    // MOCK DATA  –  replace with your real API response
    // ─────────────────────────────────────────────────────────────────────────
    const data = {
      // Section B – Employer
      taxRefNo: 'T12UF1234A',
      companyName: 'ABC Pvt Ltd',
      blkHseNo: '18',
      unitNo: '#08-22',
      streetName: 'Robinson Road',
      postalCode: '048547',

      // Section C – Employee
      employeeName: 'Dilli Babu',
      nric: '',             // leave blank if using FIN
      fin: 'F1234567X',
      dob: '01/01/1998',
      citizenship: 'Indian',
      maritalStatus: 'Single',
      contactNo: '+65 9123 4567',
      email: 'dilli@email.com',

      // Section D – Employment
      dateCommencement: '01/03/2020',
      dateCessation: '30/09/2024',
      dateDeparture: '15/10/2024',
      dateResignation: '01/09/2024',
      designation: 'Software Engineer',
      amountWithheld: '5000',
      dateLastSalary: '30/09/2024',
      amountLastSalary: '6000',
      bankName: 'DBS Bank',
      newEmployer: 'XYZ Corp, +65 6789 1234',

      // Section F – Income (page 2)
      yearCessation: '2024',
      yearPrior: '2023',
      grossSalaryCessation: '54000',
      grossSalaryPrior: '72000',
      contractualBonusCessation: '6000',
      contractualBonusPrior: '6000',
      allowancesCessation: '1200',
      allowancesPrior: '1200',
      noticePayCessation: '6000',
      gratuityCessation: '12000',
      cpfEmployeeCessation: '10200',
      cpfEmployeePrior: '14400',

      // Section E – Spouse
      spouseName: '',
      spouseDob: '',
      spouseIdNo: '',
      spouseMarriageDate: '',
      spouseCitizenship: '',
      spouseHighIncome: false,    // true = Yes, false = No

      // Section E – Children (max 3)
      children: [
        // { name: 'Child Name', sex: 'Male', dob: '01/01/2015', school: '' }
      ] as { name: string; sex: string; dob: string; school: string }[],

      // Section G – Declaration
      authorisedName: 'HR Manager Name',
      authorisedDesignation: 'HR Manager',
      declarationDate: '01/10/2024',
      contactName: 'HR Manager Name',
      contactNo2: '+65 6123 4567',
      contactEmail: 'hr@abcpvtltd.com',
    };

    console.log(data)
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1 – Load the blank PDF template from assets
    // Make sure form.pdf is in  src/assets/files/form.pdf
    // ─────────────────────────────────────────────────────────────────────────

    const existingPdfBytes = await fetch('assets/files/form.pdf')
      .then(res => {
        if (!res.ok) throw new Error('Could not load assets/files/form.pdf');
        return res.arrayBuffer();
      });

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2 – Open the PDF and get its form
    // ─────────────────────────────────────────────────────────────────────────
    const pdfDoc = await PDFDocument.load(existingPdfBytes, {
      ignoreEncryption: true
    });
    const form = pdfDoc.getForm();

    // ✅ Embed font (IMPORTANT for font size control)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Helper – fills a text field safely (skips if field not found)
    const fill = (fieldName: string, value: string, fontSize = 9) => {
      try {
        const field = form.getTextField(fieldName);
        field.setText(value ?? '');
        field.acroField.setDefaultAppearance(
          `/Helv ${fontSize} Tf 0 g`
        );
        field.updateAppearances(font);

      } catch { }
    };

    // Helper – selects a radio button safely
    const radio = (fieldName: string, value: string) => {
      try {
        form.getRadioGroup(fieldName).select(value);
      } catch { }
    };

    // Helper – checks / unchecks a checkbox safely
    const check = (fieldName: string, checked: boolean) => {
      try {
        const cb = form.getCheckBox(fieldName);
        checked ? cb.check() : cb.uncheck();
      } catch { }
    };

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3 – Fill SECTION A  (Form type = Original)
    // ─────────────────────────────────────────────────────────────────────────
    fill('Original', 'X');

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 4 – Fill SECTION B  (Employer)
    // ─────────────────────────────────────────────────────────────────────────
    fill('undefined_3', data.taxRefNo);     // Tax Ref No
    fill('undefined_4', data.companyName);  // Company Name
    fill('Blk Hse No', data.blkHseNo);     // Blk / House No
    fill('Unit No', data.unitNo);        // Unit No
    fill('undefined_5', data.streetName);   // Street Name (line 1)
    fill('undefined_6', data.streetName);   // Street Name (line 2)
    fill('Postal Code', data.postalCode);   // Postal Code

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 5 – Fill SECTION C  (Employee Personal Particulars)
    // ─────────────────────────────────────────────────────────────────────────
    fill('undefined_7', data.employeeName);   // Full Name
    fill('undefined_8', data.nric);           // NRIC
    fill('FIN', data.fin);            // FIN
    fill('4 Date of Birth', data.dob);            // Date of Birth
    fill('6 Citizenship', data.citizenship);   // Citizenship
    fill('7 Marital Status', data.maritalStatus); // Marital Status
    fill('8 Contact No', data.contactNo);     // Contact No
    fill('9 Email Address', data.email);         // Email

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 6 – Fill SECTION D  (Employment Records)
    // ─────────────────────────────────────────────────────────────────────────
    fill('undefined_9', data.dateCommencement); // Date of Commencement
    fill('14 Date of Resignation  Termination Notice Given', data.dateResignation);  // Resignation date
    fill('15 Designation', data.designation);      // Designation
    fill('if known', data.dateDeparture);    // Date of Departure

    // Amount withheld (S$ field + cents field)
    fill('undefined_12', data.amountWithheld);
    fill('undefined_13', '00');

    // Q18: Are these all the monies? → Yes
    radio('18 Are these all the monies you can withhold from the date of notification of', '/Yes');

    fill('undefined_15', data.dateLastSalary);   // Date Last Salary Paid
    fill('undefined_16', data.amountLastSalary); // Amount Last Salary
    fill('undefined_18', data.bankName);         // Bank Name
    fill('undefined_19', data.newEmployer);      // New Employer

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 7 – Fill SECTION F  (Income – Page 2)
    // ─────────────────────────────────────────────────────────────────────────
    // Page 2 header
    fill('Provide amount for each of the relevant years on calendar year basis', data.employeeName);
    fill('FIN  NRIC No', data.fin || data.nric);

    fill('Year of Cessation', data.yearCessation);
    fill('Year Prior to Year of Cessation', data.yearPrior);

    // "From … To" period labels
    fill('S', 'Jan–Dec ' + data.yearCessation);
    fill('S_2', 'Jan–Dec ' + data.yearPrior);

    // Row 1 – Gross Salary
    fill('00', data.grossSalaryCessation);
    fill('undefined_20', data.grossSalaryPrior);

    // Row 2a – Contractual Bonus
    fill('undefined_21', data.contractualBonusCessation);
    fill('undefined_22', data.contractualBonusPrior);

    // Row 4b – Allowances
    fill('2', data.allowancesCessation);
    fill('2_2', data.allowancesPrior);

    // Row 4c – Gratuity
    fill('1', data.gratuityCessation);
    fill('1_2', '0');

    // Row 4d – Notice Pay
    fill('g Contributions made by employer to any Pension Provident Fund constituted outside Singapore i',
      data.noticePayCessation);

    // Row 6 – Employee CPF Deduction
    fill('6 EMPLOYEES COMPULSORY contribution to CPF Designated Pension or Provident Fund', 'CPF');
    fill('Amount of employment income for which tax is borne by employer 1', data.cpfEmployeeCessation);
    fill('1_3', data.cpfEmployeePrior);

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 8 – Fill SECTION E  (Spouse)
    // ─────────────────────────────────────────────────────────────────────────
    fill('1 Name of Spouse', data.spouseName);
    fill('2 Date of Birth', data.spouseDob);
    fill('3 Identification No', data.spouseIdNo);
    fill('4 Date of Marriage', data.spouseMarriageDate);
    fill('5 Citizenship', data.spouseCitizenship);

    radio(
      '6 Is the spouses yearly income more than 80001',
      data.spouseHighIncome ? '/Yes_2' : '/No_2'
    );

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 9 – Fill SECTION E  (Children – max 3)
    // ─────────────────────────────────────────────────────────────────────────
    const childFields = [
      {
        name: 'Name of Child1',
        sex: 'Sex1',
        dob: 'Date of Birth1',
        school: 'State the name of school if child is above 16 years old1'
      },
      {
        name: 'Name of Child2',
        sex: 'Sex2',
        dob: 'Date of Birth2',
        school: 'State the name of school if child is above 16 years old2'
      },
      {
        name: 'Name of Child3',
        sex: 'Sex3',
        dob: 'Date of Birth3',
        school: 'State the name of school if child is above 16 years old3'
      },
    ];

    data.children.slice(0, 3).forEach((child, i) => {
      fill(childFields[i].name, child.name);
      fill(childFields[i].sex, child.sex);
      fill(childFields[i].dob, child.dob);
      fill(childFields[i].school, child.school);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 10 – Fill SECTION G  (Declaration)
    // ─────────────────────────────────────────────────────────────────────────
    fill('I declare that the information given in this form appendices and in any documents attached is true and complete',
      data.authorisedName);
    fill('undefined_24', data.authorisedDesignation);
    fill('Date', data.declarationDate);
    fill('Full Name of Authorised Personnel', data.contactName);
    fill('Designation', data.authorisedDesignation);
    fill('DECLARATION', `${data.contactName} | ${data.contactNo2} | ${data.contactEmail}`);

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 11 – Flatten (locks all fields so PDF looks clean)
    // ─────────────────────────────────────────────────────────────────────────
    form.flatten();

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 12 – Save and trigger browser download
    // ─────────────────────────────────────────────────────────────────────────
    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `IR21-${data.fin || data.nric}-${data.yearCessation}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
  }


  async generatePdf() {
    // Fetch live data from API
    const apiResponse = await fetch('https://qsgerpapi.quesscorp.com/api/IR/GetIRDetail/131')
      .then(res => {
        if (!res.ok) throw new Error('Could not fetch IR detail from API');
        return res.json();
      });

    const raw = apiResponse?.Data?.data?.Table0?.[0];
    if (!raw) throw new Error('No data found in API response');

    //  Helpers 
    const fmtDate = (iso: string | null | undefined): string => {
      if (!iso) return '';
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    const str = (val: any): string => (val != null && val !== '' ? String(val) : '');

    //  Derived values 
    const lastWorkingDay = str(raw.Last_Working_Day);
    const cessationDate = lastWorkingDay ? new Date(lastWorkingDay) : null;
    const cessationYear = (cessationDate && !isNaN(cessationDate.getTime()))
      ? String(cessationDate.getFullYear())
      : String(new Date().getFullYear());
    const priorYear = String(Number(cessationYear) - 1);

    const dateLastSalary = raw.FinalpayrollnetpayDate
      ? fmtDate(raw.FinalpayrollnetpayDate)
      : raw.Lastpayrollmonth
        ? fmtDate(raw.Lastpayrollmonth)
        : '';

    const cessationYearTo = str(raw.YearofCessationTo);
    const cessationRangeLabel = cessationYearTo
      ? `${cessationYear}–${cessationYearTo}`
      : cessationYear;

    //  Data object 
    const data = {
      taxRefNo: str(raw.GSTNumber),
      companyName: str(raw.Client_Name),
      streetName: str(raw.BillingAddress),
      postalCode: str(raw.Pincode),


      employeeName: str(raw.First_Name),
      nric: '',
      fin: str(raw.FINNumber),
      dob: fmtDate(raw.Date_Of_Birth),
      citizenship: str(raw.Citizenship),
      maritalStatus: str(raw.Marital_Status),
      contactNo: str(raw.Mobile_Number),
      email: str(raw.Email_Id),

      // Section D – Employment
      dateCommencement: fmtDate(raw.Date_Of_Joining),
      dateCessation: fmtDate(raw.Last_Working_Day),
      dateDeparture: fmtDate(raw.Last_Working_Day),
      dateResignation: fmtDate(raw.Last_Working_Day),
      designation: str(raw.Designation_Name),
      amountWithheld: str(raw.Finalpayrollnetpay) || '0',
      dateLastSalary,
      amountLastSalary: str(raw.Finalpayrollnetpay) || '0',
      periodLastSalary: str(raw.Lastpayrollmonth),
      bankName: str(raw.Bank_Name),

      // Section F – Income
      cessationYear,
      priorYear,
      cessationRangeLabel,
      priorRangeLabel: `Jan–Dec ${priorYear}`,
      grossSalaryCessation: str(raw.YearofCessationFrom) || '0',
      grossSalaryPrior: str(raw.PreYearStartJan) || '0',
      noticePayCessation: str(raw.PAYROUTBEINGFINALIZED) || '0',

      // Section E – Spouse / Children (not in API)
      spouseName: '', spouseDob: '', spouseIdNo: '',
      spouseMarriageDate: '', spouseCitizenship: '',
      spouseHighIncome: false,
      children: [] as { name: string; sex: string; dob: string; school: string }[],

      // Section G – Declaration
      authorisedName: str(raw.AuthorisedPersonnel),
      authorisedDesignation: str(raw.AuthorisedPersonnelDesignation),
      declarationDate: fmtDate(raw.Last_Working_Day) || fmtDate(new Date().toISOString()),
      contactName: str(raw.NameofContactPerson),
      contactNo2: str(raw.ContactNo),
      contactEmail: str(raw.Email_Id),
    };

    //  Load template
    const existingPdfBytes = await fetch('assets/files/form.pdf')
      .then(res => {
        if (!res.ok) throw new Error('Could not load form.pdf');
        return res.arrayBuffer();
      });

    // Open PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Field helpers 
    const fill = (fieldName: string, value: string, fontSize = 9) => {
      try {
        const field = form.getTextField(fieldName);
        field.setText(value ?? '');
        field.acroField.setDefaultAppearance(`/Helv ${fontSize} Tf 0 g`);
        field.updateAppearances(font);
      } catch { /* field not found or wrong type — silently skip */ }
    };

    const radio = (fieldName: string, optionValue: string) => {
      try { form.getRadioGroup(fieldName).select(optionValue); } catch { }
    };

    const check = (fieldName: string, checked: boolean) => {
      try {
        const cb = form.getCheckBox(fieldName);
        checked ? cb.check() : cb.uncheck();
      } catch { }
    };

    fill('Original', 'X');

    fill('undefined_3', data.taxRefNo);
    fill('undefined_4', data.companyName);
    fill('Blk Hse No', '');
    fill('Unit No', '');
    fill('undefined_5', '');
    fill('undefined_6', data.streetName);
    fill('Postal Code', data.postalCode);

    fill('undefined_7', data.employeeName);
    fill('undefined_8', data.nric);
    fill('FIN', data.fin);
    fill('Malaysian IC if applicable', '');
    fill('4 Date of Birth', data.dob);


    fill('6 Citizenship', data.citizenship);
    fill('7 Marital Status', data.maritalStatus);
    fill('8 Contact No', data.contactNo);
    fill('9 Email Address', data.email);




    fill('undefined_9', data.dateCommencement);


    fill('undefined_10', data.dateCessation);

    fill('14 Date of Resignation  Termination Notice Given',
      data.dateResignation);
    fill('undefined_10', data.designation);
    fill('if known', data.dateDeparture);


    check('Absconded  Left without notice', false);
    check('Immediate Resignation  Short Notice', false);
    check('Resigned whilst overseas  On home leave', false);
    check('Others Give details', false);

    fill('undefined_11', data.amountWithheld);
    fill('undefined_12', data.amountWithheld);
    fill('undefined_13', '00');

    radio('18 Are these all the monies you can withhold from the date of notification of',
      '/Yes');


    check('Resigned after pay day', false);
    check('Did not return from leave', false);
    check('Salary already paid via bank', false);
    check('Employee owes company monies', false);

    fill('undefined_15', data.dateLastSalary);
    fill('undefined_16', data.amountLastSalary);
    fill('undefined_17', data.periodLastSalary);
    fill('undefined_18', data.bankName);
    fill('undefined_19', '');


    fill('1 Name of Spouse', data.spouseName);
    fill('2 Date of Birth', data.spouseDob);
    fill('3 Identification No', data.spouseIdNo);
    fill('4 Date of Marriage', data.spouseMarriageDate);
    fill('5 Citizenship', data.spouseCitizenship);

    radio('6 Is the spouses yearly income more than 80001',
      data.spouseHighIncome ? '/Yes_2' : '/No_2');


    const childFields = [
      {
        name: 'Name of Child1', sex: 'Sex1', dob: 'Date of Birth1',
        school: 'State the name of school if child is above 16 years old1'
      },
      {
        name: 'Name of Child2', sex: 'Sex2', dob: 'Date of Birth2',
        school: 'State the name of school if child is above 16 years old2'
      },
      {
        name: 'Name of Child3', sex: 'Sex3', dob: 'Date of Birth3',
        school: 'State the name of school if child is above 16 years old3'
      },
    ];
    data.children.slice(0, 3).forEach((child, i) => {
      fill(childFields[i].name, child.name);
      fill(childFields[i].sex, child.sex);
      fill(childFields[i].dob, child.dob);
      fill(childFields[i].school, child.school);
    });


    fill('Provide amount for each of the relevant years on calendar year basis',
      data.employeeName);
    fill('FIN  NRIC No', data.fin || data.nric);


    fill('Year of Cessation', data.cessationYear);
    fill('Year Prior to Year of Cessation', data.priorYear);
    fill('S', 'Jan–Dec ' + data.cessationRangeLabel);
    fill('S_2', data.priorRangeLabel);

    fill('00', data.grossSalaryCessation);
    fill('undefined_20', data.grossSalaryPrior);

    fill('undefined_21', '0');
    fill('undefined_22', '0');


    fill('2', '0');
    fill('2_2', '0');
    fill('1', '0');
    fill('1_2', '0');


    fill('e Compensation for loss of office i', data.noticePayCessation);


    fill('g Contributions made by employer to any Pension Provident Fund constituted outside Singapore i',
      '');

    check('No_3', true);
    check('No_4', true);
    check('Yes fully borne', false);
    check('Yes fully borne_2', false);
    check('Yes partially borne', false);
    check('Yes partially borne_2', false);

    fill('Amount of employment income for which tax is borne by employer 1', '0');
    fill('Amount of employment income for which tax is borne by employer 2', '0');


    fill('6 EMPLOYEES COMPULSORY contribution to CPF Designated Pension or Provident Fund',
      '');
    fill('1_3', '0');
    fill('2_3', '0');

    fill('I declare that the information given in this form appendices and in any documents attached is true and complete',
      data.authorisedName);
    fill('undefined_24', data.authorisedDesignation);
    fill('Date', data.declarationDate);

    // Row 2: Contact person
    fill('Full Name of Authorised Personnel', data.contactName);
    fill('DECLARATION', data.contactName);
    fill('undefined_25', '');


    fill('Designation', data.contactNo2);

    form.flatten();

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const fileId = data.fin || data.nric || str(raw.Employee_Id);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IR21-${data.employeeName}-${data.cessationYear}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async fillAllPdfFieldsAndDownload() {
    // ✅ Load PDF
    const existingPdfBytes = await fetch('assets/files/IR21.pdf')
      .then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    console.log(form)
    const fields = form.getFields();
    console.log(fields)

    // ✅ Your STATIC DATA (customize here)
    const staticData: Record<string, any> = {
      '1 Name of Spouse': 'Priya',
      '2 Date of Birth': '01-01-1990',
      '7 Marital Status': 'Married',
      '8 Contact No': '9876543210',
      '9 Email Address': 'test@gmail.com',
      '15 Designation': 'Software Engineer',
      'Blk Hse No': '123',
      'Postal Code': '560001',
      'FIN NRIC No': 'S1234567A',
      'Absconded Left without notice': true,
      'Employee owes company monies': true,

      // even broken fields supported
      'undefined_7': 'Test Value',
      'undefined_10': 'Another Value'
    };

    // ✅ Loop ALL fields (NO SKIP)
    fields.forEach(field => {
      const name = field.getName();
      const type = field.constructor.name;

      // 👉 Get value: from staticData OR fallback default
      let value = staticData[name];

      // 🔥 Default fallback (ensures NOTHING is missed)
      if (value === undefined || value === null) {
        if (type === 'PDFTextField') value = name;
        if (type === 'PDFCheckBox') value = false;
        if (type === 'PDFRadioGroup') value = '';
        if (type === 'PDFDropdown') value = '';
        if (type === 'PDFOptionList') value = [];
      }

      try {
        // ✅ TEXT FIELD
        if (type === 'PDFTextField') {
          form.getTextField(name).setText(String(value));
        }

        // ✅ CHECKBOX
        else if (type === 'PDFCheckBox') {
          const cb = form.getCheckBox(name);
          value ? cb.check() : cb.uncheck();
        }

        // ✅ RADIO GROUP
        else if (type === 'PDFRadioGroup') {
          const rg = form.getRadioGroup(name);
          if (value) rg.select(value);
        }

        // ✅ DROPDOWN
        else if (type === 'PDFDropdown') {
          const dd = form.getDropdown(name);
          if (value) dd.select(value);
        }

        // ✅ OPTION LIST
        else if (type === 'PDFOptionList') {
          const ol = form.getOptionList(name);
          if (Array.isArray(value)) {
            ol.select(value);
          }
        }

      } catch (err) {
        console.warn(`❌ Error filling field: ${name}`, err);
      }
    });

    // ✅ Flatten (VERY IMPORTANT → prevents empty display issue)
    form.flatten();

    // ✅ Save PDF
    const pdfBytes = await pdfDoc.save();

    // ✅ Download
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'filled-form.pdf';
    a.click();

    URL.revokeObjectURL(url);
  }

   async fillAllPdfFieldsAndDownload8A() {
   
    const existingPdfBytes = await fetch('assets/files/IR8A.pdf')
      .then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    console.log(form)
    const fields = form.getFields();
    console.log(fields)


    const staticData: Record<string, any> = {
        'tax ref no': 'TAX123456',
        'nric/fin': 'S1234567A',
        'fullname_nric': 'Dilli Babu',
        'DOB': '01-01-1995',
        'gender': 'Male',
        'residential_address': 'Bangalore, India',
        'designation': 'Software Engineer',
        'Bank_name': 'HDFC Bank',
        'date_commencement': '01-01-2020',
        'date_Cessation': '31-12-2025',
        'gross_salary': '120000',
        'bonus': '20000',
        'director_fee': '0',
        'allowance': '5000',
        'gross_commission': '10000',
        'Lump_sum': '0',
        'pension': '0',
        'compensation_loss': '0',
        'dir_dd': '01',
        'dir_mm': '04',
        'dir_yy': '2026',
        'contribution': '15000',
        'excess_contribution': '0',
        'profit_gain_1': '2000',
        'profit_gain_2': '1000',
        'value_benifit': '3000',
        'total_items': '150000',
        'tax_partially': '5000',
        'fixed_amount': '2000',
        'cpf_employee': '3000',
        'donation_deduct': '1000',
        'contribute_salary': '4000',
        'LIC_PREMIUM': '5000',
        'DEC_NAME': 'ABC Pvt Ltd',
        'dec_address': 'Bangalore Office',
        'dec_authorised_name': 'Manager Name',
        'dec_designation': 'HR Manager',
        'dec_telno': '9876543210',
        'signature': 'Dilli Babu',
        'Dec_Date': '28-04-2026',
        'Fund_name': 'Provident Fund'
      };

    fields.forEach(field => {
      const name = field.getName();
      const type = field.constructor.name;

      let value = staticData[name];

      console.log(type)
      if (value === undefined || value === null) {
        if (type === 'PDFTextField'|| type === 'PDFTextField2') value = name;
        if (type === 'PDFCheckBox') value = false;
        if (type === 'PDFRadioGroup') value = '';
        if (type === 'PDFDropdown') value = '';
        if (type === 'PDFOptionList') value = [];
      }

      try {
        if (type === 'PDFTextField' || type === 'PDFTextField2') {
          form.getTextField(name).setText(String(value));
        }

        // ✅ CHECKBOX
        else if (type === 'PDFCheckBox') {
          const cb = form.getCheckBox(name);
          value ? cb.check() : cb.uncheck();
        }

        // ✅ RADIO GROUP
        else if (type === 'PDFRadioGroup') {
          const rg = form.getRadioGroup(name);
          if (value) rg.select(value);
        }

        // ✅ DROPDOWN
        else if (type === 'PDFDropdown') {
          const dd = form.getDropdown(name);
          if (value) dd.select(value);
        }

        // ✅ OPTION LIST
        else if (type === 'PDFOptionList') {
          const ol = form.getOptionList(name);
          if (Array.isArray(value)) {
            ol.select(value);
          }
        }

      } catch (err) {
        console.warn(`❌ Error filling field: ${name}`, err);
      }
    });

    // ✅ Flatten (VERY IMPORTANT → prevents empty display issue)
    form.flatten();

    // ✅ Save PDF
    const pdfBytes = await pdfDoc.save();

    // ✅ Download
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'filled-form.pdf';
    a.click();

    URL.revokeObjectURL(url);
  }

}