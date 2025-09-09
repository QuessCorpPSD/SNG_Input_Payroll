export interface Company {
  company_Id: number
  companyCode: string
  companyName: string
  displayName: string
}

export interface Payperiodclass {
  payfrequencyid: number
  paySequenceNo: string
  payPeriod: string
}

export interface Mapnameclass {
  mapNameId: number
  mapName: string
}

export interface InputTypeclass{
  inputId: number
  inputType: string
}

export interface Groupnameclass{
  siteCode: string
  siteName: string
}

export interface Cityclass{
  city_Id: string
  city_Name: string
}

export interface State {
  state_Id: number
  state_Name: string
}