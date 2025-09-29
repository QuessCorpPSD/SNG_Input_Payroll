export interface InvoiceRuleGrid {
    companyId: number,
    companyCode: string,
    invoicingRulesID: number,
    siteName: string,
    siteId: number,
    daysPerMonth: string,
    weekends: string,
    holidays: string,
    compOff: string,
    maternity: string,
    leaveAddition: string,
    leaveRule: string,
    billableDaysFormula: string
}
export class InvoiceForm {
  invoicingRulesID?:number;
  companyId?: number;
  companyCode: string='';
  siteId?: number;
  siteName: string='';
  billingType: string = '';
  daysAsPerTimesheet: boolean = false;
  dayspermonth: string = '';
  weekendsrule: string = '';
  holidaysrule: string = '';
  comppoffrule: string = '';
  maternityleave: string = '';
  leavetypes: string = '';
  leavecredit: string = '';
  leaverule: string = '';
  payperiodfrom: string = '';
  payperiodto: string = '';
  carryforward: string = '';
  noofcarryforwards: string = '';
  otrule: string = '';
  gratuity: string = '';
  reimbursement: string = '';
  servicefeeonexpenses: string = '';
  rebates: string = '';
  discounts: string = '';
  billabledaysformula: string = '';
}
