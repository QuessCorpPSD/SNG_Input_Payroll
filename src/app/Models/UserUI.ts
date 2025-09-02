

export interface UserUI {
  user_Id: number
  name: string
  userName: string
  password: string
  salt: string
  mail_Id: string
  reporting_To?: string
  error_Message: string
  role_Name: string
  access_Type_Id: number
  isActive: boolean
  role_Id: number
  passwordExpire: any
  isFirstlogin: number
  employeeID: number
  teamLeadUserId: any
  teamLeadEmailId: string
  manager_User_Id?: number
  manager_Email_Id?: string
  fun_Manager_User_Id: any
  fun_Manager_Email_Id: string
  process_Category?: string
  createdBy: number
  token: any
  refreshtoken: any
}
