
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../Models/apiresponse';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IIRformService } from '../../Repository/Reports/IIRForm.service';
import { PdfService } from '../pdf.service';
import { PDFDocument, StandardFonts } from 'pdf-lib';
@Injectable({
    providedIn: 'root'  // ✅ makes the service available app-wide
})
export class IRFormService implements IIRformService {
    environment = environment;
    constructor(private http: HttpClient, public pdfservice: PdfService) {
    }

    GetEmployee(CompanyId: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'IR/GetIREmployeeDetail/' + CompanyId);
    }

    DownloadForm(EmployeeId: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'PayslipReport/DownloadPayslip/' + EmployeeId);
    }

    async generatePdf(
        id: any,
        month: string,
        year: string
    ) {

        const apiResponse = await fetch(
            `${this.environment.apiUrl}IR/GetIRDetail/${id}/${month}/${year}`
        ).then(res => {
            if (!res.ok) throw new Error('Could not fetch IR detail from API');
            return res.json();
        });

        const raw = apiResponse?.Data?.data?.Table0?.[0];
        const currentYearData = apiResponse?.Data?.data?.Table1?.[0] ?? {};
        const previousYearData = apiResponse?.Data?.data?.Table2?.[0] ?? {};

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
            taxRefNo: str(raw.GstNumber),
            companyName: str(raw.Client_Name),
            streetName: str(raw.BillingAddress),
            postalCode: str(raw.Pincode),


            employeeName: str(raw.First_Name),
            nric: str(raw.NRICNumber),
            fin: str(raw.FINNumber),
            dob: fmtDate(raw.Date_Of_Birth),
            gender: str(raw.Gender),
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
            amountWithheld: str(raw.Current_month_E_Gross) || '0',
            dateLastSalary,
            periodLastSalary: str(raw.Period_application_for_Last_Salary_Paid),
            bankName: str(raw.Bank_Name),
            datelastSalaryPaid: fmtDate(raw.Date_of_Last_salary_paid),

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
            declarationDate: fmtDate(raw.Declaration_Date) || fmtDate(new Date().toISOString()),
            contactName: str(raw.NameofContactPerson),
            contactNo2: str(raw.ContactNo),
            contactEmail: str(raw.Email_Id),
            lastDateSalaryPaid: fmtDate(raw.Date_of_Last_salary_paid),
            amountOfLastSalaryPaid: str(raw.Last_Month_E_Gross),
            currentFromYear: str(currentYearData?.Current_MinMonth),
            currentToYear: str(currentYearData?.Current_MaxMonth),
            currentTotalGross: str(currentYearData?.Current_TotalGross),
            currentPF: str(currentYearData?.Current_PF),
            currentSinda: str(currentYearData?.Current_SINDA_CDAC_ECF),
            currentMbmf: str(currentYearData?.Current_MBMF),
            currentLic: str(currentYearData?.Current_LIC),

            previousFromYear: str(previousYearData?.Prev_MinMonth),
            previousToYear: str(previousYearData?.Prev_MaxMonth),
            previousTotalGross: str(previousYearData?.Prev_TotalGross),
            previousPF: str(previousYearData?.Prev_PF),
            previoustSinda: str(previousYearData?.Prev_SINDA_CDAC_ECF),
            previousMbmf: str(previousYearData?.Prev_MBMF),
            previousLic: str(previousYearData?.Current_LIC),
            declarationEmail: str(raw.Declaration_Date1)

        };

        //  Load template
        const existingPdfBytes = await fetch('assets/files/IR21.pdf')
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
        fill('dhFormfield-6458407508', data.gender);
        fill('6 Citizenship', data.citizenship);
        fill('7 Marital Status', data.maritalStatus);
        fill('8 Contact No', data.contactNo);
        fill('9 Email Address', data.email);
        fill('undefined_9', data.dateCommencement);
        fill('undefined_10', data.dateCessation);

        fill('14 Date of Resignation  Termination Notice Given',
            data.dateResignation);
        fill('undefined_10', data.designation);
        fill('15 Designation', data.dateDeparture);


        check('Absconded  Left without notice', false);
        check('Immediate Resignation  Short Notice', false);
        check('Resigned whilst overseas  On home leave', false);
        check('Others Give details', false);

        // fill('undefined_11', data.amountWithheld);
        fill('undefined_12', data.amountWithheld);
        fill('undefined_13', '00');
        fill('Year of Cessation', data.currentFromYear);
        fill('S', data.currentToYear);
        fill('Text1', data.currentTotalGross);
        fill('Text3', data.currentTotalGross);
        fill('Text5', data.currentPF);
        fill('Text7', data.currentSinda);
        fill('Text9', data.currentMbmf);
        fill('Text11', data.currentLic);

        fill('Year Prior to Year of Cessation', data.previousFromYear);
        fill('S_2', data.previousToYear);
        fill('Text2', data.previousTotalGross);
        fill('Text4', data.previousTotalGross);
        fill('Text6', data.previousPF);
        fill('Text8', data.previoustSinda);
        fill('Text10', data.previousMbmf);
        fill('Text11', data.previousLic);

        radio('18 Are these all the monies you can withhold from the date of notification of',
            '/Yes');


        check('Resigned after pay day', false);
        check('Did not return from leave', false);
        check('Salary already paid via bank', false);
        check('Employee owes company monies', false);

        fill('undefined_15', data.datelastSalaryPaid);
        fill('undefined_16', data.amountOfLastSalaryPaid);
        fill('undefined_17', data.periodLastSalary);
        fill('undefined_18', data.bankName);
        fill('undefined_19', '');


        fill('1 Name of Spouse', data.spouseName);
        fill('2 Date of Birth', data.spouseDob);
        fill('3 Identification No', data.spouseIdNo);
        fill('4 Date of Marriage', data.spouseMarriageDate);
        fill('5 Citizenship', data.spouseCitizenship);
        fill('Text13', data.declarationEmail)

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


        // fill('Year of Cessation', data.cessationYear);
        // fill('Year Prior to Year of Cessation', data.priorYear);
        // fill('S', 'Jan–Dec ' + data.cessationRangeLabel);
        // fill('S_2', data.priorRangeLabel);

        // fill('00', data.grossSalaryCessation);
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

        // check('No_3', true);
        // check('No_4', true);
        // check('Yes fully borne', false);
        // check('Yes fully borne_2', false);
        // check('Yes partially borne', false);
        // check('Yes partially borne_2', false);

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
        // fill('DECLARATION', data.contactName);
        fill('undefined_25', '');


        fill('Designation', data.contactNo2);

        form.flatten();

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const fileId = data.fin || data.nric || str(raw.Employee_Id);

        const a = document.createElement('a');
        a.href = url;
        // a.download = `IR21-${data.employeeName}-${data.cessationYear}.pdf`;
        a.download = `IR21-${data.employeeName}-${month}-${year}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        return true;
    }

    async generate8APdf(
        id: any,
        year: string
    ) {
        try {

            const apiResponse = await fetch(
                `${this.environment.apiUrl}IR/GetIR8ADetail/${id}/${year}`
            ).then(res => {
                if (!res.ok) throw new Error('API failed');
                return res.json();
            });

            const raw = apiResponse?.Data?.data?.Table0?.[0];
            if (!raw) throw new Error('No data found');
            // 🔹 Helpers
            const str = (val: any) => (val !== null && val !== undefined && val !== '' ? String(val) : '');

            const formatDate = (iso: string) => {
                if (!iso) return '';
                const d = new Date(iso);
                return isNaN(d.getTime())
                    ? ''
                    : `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
            };

            // 🔹 Mapping (API → PDF fields)
            const staticData: Record<string, any> = {
                'tax ref no': str(raw.Employers_Tax_Ref_No),
                'nric/fin': str(raw.Employees_Tax_Ref_No),
                'fullname_nric': str(raw.First_Name),
                'DOB': formatDate(raw.Date_Of_Birth),
                // 'gender': str(raw.Gender),
                'residential_address': str(raw.Residential_Address),
                'designation': str(raw.Designation_Name),
                'Bank_name': str(raw.Bank_Name),
                'date_commencement': formatDate(raw.Date_Of_Joining),
                'date_Cessation': formatDate(raw.Date_of_Cessation),

                // Salary
                'gross_salary': str(raw.Gross_Salary) || '0',
                'bonus': str(raw.Bonus) || '0',
                'director_fee': str(raw.Director_fees) || '0',
                'allowance': str(raw.Others_Others_Allowances) || '0',
                'gross_commission': str(raw.Others_Gross_Commission) || '0',
                'Lump_sum': str(raw.Others_Lump_sum_payment) || '0',
                'pension': str(raw.Name_of_Designated_Pension_Provident_Fund) || '0',
                'compensation_loss': str(raw.Remission_Amount_of_Income) || '0',

                // Declaration date split
                'dir_dd': formatDate(raw.Declaration_Date)?.split('-')[0] || '',
                'dir_mm': formatDate(raw.Declaration_Date)?.split('-')[1] || '',
                'dir_yy': formatDate(raw.Declaration_Date)?.split('-')[2] || '',

                // Contributions
                'contribution': str(raw.Contributions_made_by_employer_to_any_Pension_Provident_Fund) || '0',
                'excess_contribution': str(raw.Excess_Voluntary_contribution_to_CPF_by_employer) || '0',

                // Gains
                'profit_gain_1': str(raw.Gains_profits_under_S10_a) || '0',
                'profit_gain_2': str(raw.Gains_profits_under_S10_g) || '0',
                'value_benifit': str(raw.Value_of_Benefits_in_kind) || '0',

                'total_items': str(raw.TOTAL_of_items_d1_to_d8) || '0',

                // Tax
                'tax_partially': str(raw.tax_is_partially_borne_by_employer) || '0',
                'fixed_amount': str(raw.fixed_amount_of_tax_is_borne_by_employee) || '0',

                // CPF / Donations
                'cpf_employee': str(raw.Employees_Compulsory_contribution) || '0',
                'donation_deduct': str(raw.Donations_deducted_from_salaries) || '0',
                'contribute_salary': str(raw.Mosque_Building_Fund) || '0',
                'LIC_PREMIUM': str(raw.Life_Insurance_premiums) || '0',

                // Declaration
                'DEC_NAME': str(raw.Client_Name),
                'dec_address': str(raw.BillingAddress),
                'dec_authorised_name': str(raw.Name_of_authorised_person),
                'dec_designation': str(raw.Designation),
                'dec_telno': str(raw.Tel_No),

                'signature': str(raw.First_Name),
                'Dec_Date': formatDate(raw.Declaration_Date),

                'Fund_name': str(raw.Name_of_Designated_Pension_Provident_Fund),


            };

            // 🔹 Load PDF template
            const pdfBytes = await fetch('assets/files/IR8A.pdf').then(res => res.arrayBuffer());

            const pdfDoc = await PDFDocument.load(pdfBytes);
            const form = pdfDoc.getForm();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // 🔹 Fill all fields dynamically
            Object.keys(staticData).forEach(key => {
                try {
                    const field = form.getTextField(key);
                    field.setText(staticData[key] ?? '');
                    field.acroField.setDefaultAppearance(`/Helv 7 Tf 0 g`);
                    field.updateAppearances(font);
                } catch {
                    // field not found → ignore
                }
            });

            // 🔹 Flatten PDF
            form.flatten();

            // 🔹 Save & Download
            const finalPdf = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(finalPdf)], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `IR8A-${staticData['fullname_nric']}.pdf`;
            a.click();

            URL.revokeObjectURL(url);

            console.log('✅ PDF Generated Successfully');

        } catch (err) {
            console.error('❌ PDF Generation Failed:', err);
        }
    }

    bindYear(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.environment.apiUrl + 'IR/GetLastThreeYear/');
    }

    // getDownload21Form(employeeId: string, month: string, year: string): Observable<APIResponse> {
    //     return this.http.get<APIResponse>(
    //         `${this.environment.apiUrl}PayslipReport/GetIRDetail/${employeeId}/${month}/${year}`
    //     );
    // }

}
