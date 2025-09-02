import { AfterViewInit, Component, ElementRef, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import {MatGridListModule} from '@angular/material/grid-list';

import { IDashBoardServices } from '../../Repository/IDashBoardService';
import { DashBoardServices } from '../../Service/DashBoardService';
import { error } from 'console';
import { EncryptionService } from '../../Shared/encryption.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { curveCatmullRom } from 'd3-shape';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartConfiguration } from 'chart.js';
const dashboard = InjectionToken<IDashBoardServices>;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,NgxChartsModule,RouterModule,NgChartsModule,MatGridListModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [
	  {
		provide: dashboard,
		useClass: DashBoardServices,
	  }
	],
	

})
export class HomeComponent implements OnInit {

  date=new Date();
  userData:any;
  checkInStatus:boolean=false;
  checkInDateTime:any;
  percent_inComplate_Assignment:any=0;
    @ViewChild("progressBar") progressBar!: ElementRef;
  constructor(
	@Inject(dashboard) private _dashboard: IDashBoardServices,
	 private sessionStorageService: SessionStorageService,
	private _encry:EncryptionService
){

  }
ngOnInit(): void {
		const userdetail= this.sessionStorageService.getItem('UserProfile');
  var user = JSON.parse(this._encry.decrypt(userdetail!));  
  this.GetDashboardByUserId(user.user_Id);
}
CheckIn(){
	const userdetail= this.sessionStorageService.getItem('UserProfile');
  var user = JSON.parse(this._encry.decrypt(userdetail!));  
	this._dashboard.UserCheckIn(user.user_Id,"IN").subscribe({
		next:res=>{if(res.Data.checkinDate!=null)
		{
			this.checkInStatus=true;
			this.checkInDateTime=res.Data.checkInTime;
		}
		},
		error:err=>{console.log(err)}
	})
}
CheckOut()
{
const userdetail= this.sessionStorageService.getItem('UserProfile');
  var user = JSON.parse(this._encry.decrypt(userdetail!));  
	this._dashboard.UserCheckIn(user.user_Id,"OUT").subscribe({
		next:res=>{if(res.Data.checkinDate!=null)
		{
			this.checkInStatus=true;
			this.checkInDateTime=res.Data.checkInTime;
  
		}
		},
		error:err=>{console.log(err)}
	})
}
public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56],
        label: 'Sales',
        fill: 'origin', // Enable area fill
        tension: 0.4,   // Smooth curve
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };
GetDashboardByUserId(userId){

this._dashboard.GetUserDashBoard(userId).subscribe({
next: res => {
	this.userData=res.Data;
  
	this.checkInStatus=this.userData.checkInStatus;
	this.checkInDateTime=res.Data.checkInDateTime;
	    this.percent_inComplate_Assignment=res.Data.inComplate_Assignment;
      // this.progressBar.nativeElement.style.width = this.percent_inComplate_Assignment+"%";
},
error:error=>{}
})
}

 public spent = [
    {
      name: 'Spent',
      series: [
        { name: '2019-12-01T00:00:00', value: 1234 },
        { name: '2019-12-15T00:00:00', value: 2000 },
        { name: '2019-12-31T00:00:00', value: 2500 },
        { name: '2019-01-01T00:00:00', value: 4000 },
        { name: '2019-01-15T00:00:00', value: 3400 },
        { name: '2019-01-31T00:00:00', value: 4200 },
        { name: '2019-02-01T00:00:00', value: 4500 },
        { name: '2019-02-15T00:00:00', value: 7637 },
        { name: '2019-02-29T00:00:00', value: 5637.78 }
      ]
    }
  ];

  public curve = curveCatmullRom;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

 

}


