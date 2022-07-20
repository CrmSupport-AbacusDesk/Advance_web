import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-system-user-add',
  templateUrl: './system-user-add.component.html'
})
export class SystemUserAddComponent implements OnInit {
  
  search: any = {};
  userForm:any = {};
  filter: any={};
  productlist: any;
  loading_list=false;
  userlist = [];
  data:any=[];
  savingData = false;
  constructor(public db:DatabaseService, private route: ActivatedRoute, public dialog:DialogComponent, @Inject(MAT_DIALOG_DATA) public user_data: any, private router: Router, public dialogRef:MatDialogRef<SystemUserAddComponent>) { 
      console.log(user_data.data);
      
      if(user_data.data.id){
        this.userForm = user_data.data;
      }
      
    }
    
    ngOnInit() {
      
    }
    
    
    addUser(){
      console.log("add user click");
      this.userForm={};
      this.loading_list=false;
      
    }
    
    numeric_Number(event: any) {
      console.log("mobile number is :"+event.target.value);
      
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    
    
    saveUser(form:any){
      console.log(this.userForm);
      this.db.post_rqst({"user":this.userForm},'master/addUser').subscribe(r=>{
        console.log(r);
        if(r.status == 'EXIST' || r.status == 'Phone EXIST' )
        {
          this.dialog.error( ' User  with this mobile no. Already exists');
          return;
        }
        else{

          if(this.userForm.id ){
            this.dialog.success( 'User successfully updated');
          }
          else{
            this.dialog.success( 'User successfully added');
          }
        }
        this.userForm = {};
        this.dialogRef.close(true);
      })
    }
    
    editUser(val)
    
    {
      this.userForm = val;
      console.log(this.userForm);
      this.loading_list=true;
      
    }
    
  }
  