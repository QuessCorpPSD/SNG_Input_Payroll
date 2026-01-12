import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";

@Component({
  selector: 'app-childreneducationallowance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule],
  templateUrl: './childreneducationallowance.component.html',
  styleUrl: './childreneducationallowance.component.css'
})
export class ChildreneducationallowanceComponent {
  isEditMode: boolean = false;
  ceaform!: FormGroup;
  isAddclicked = false;
  displayedColumns: string[] = [
    "delete", "edit", "cityName", "cityCode", "stateName", "saP_Code", "pin_Code"
    , "taluk", "district", "ikya_Location", "circle"
  ];
  dataSource = new MatTableDataSource<any>([]);
  closeclick() {
    this.isAddclicked = false;
  }
  AddPOOpen() {
    this.isAddclicked = true;
  }
}
