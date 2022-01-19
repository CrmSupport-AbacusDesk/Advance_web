import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker, MatDialog, MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { ChangeStatusComponent } from '../gift-gallery/change-status/change-status.component';
import { ProductImageModuleComponent } from '../master/product-image-module/product-image-module.component';
import { MastetDateFilterModelComponent } from '../mastet-date-filter-model/mastet-date-filter-model.component';
import { DatabaseService } from '../_services/DatabaseService';
import { SessionStorage } from '../_services/SessionService';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  loading_list = false;
  // reedam: any = [];
  // locations: any = [];
  // total_reedam = 0;
  
  support_all:any =0;
  support_pending:any =0;
  support_approved:any =0;
  support_reject:any =0;
  support_verified:any=0;
  
  last_page: number ;
  current_page = 1;
  search: any = '';
  filter:any = {};
  support_list:any = [];
  all_count:any;
  done_count:any;
  pending_count:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public db: DatabaseService, private route: ActivatedRoute, private router: Router, public ses: SessionStorage,public dialog: DialogComponent, public alrt:MatDialog ) {}



  ngOnInit() {
    this.getSupportList('');
    this.filter.support_status = '';
  }

  redirect_previous() {
    if(this.current_page>1){
    this.current_page--;
    this.getSupportList('');
    }
}
redirect_next() {
    if (this.current_page < this.last_page) { this.current_page++; }
    else { this.current_page = 1; }
    this.getSupportList('');
}

current1()
{
    this.current_page = 1;
    this.getSupportList('');
}
last1()
{
    this.current_page = this.last_page;
    this.getSupportList('');
}

  getSupportList(action:any) 
  {
      this.loading_list = true;
      this.filter.date = this.filter.date  ? this.db.pickerFormat(this.filter.date) : '';
      this.filter.start_date = this.filter.start_date  ? this.db.pickerFormat(this.filter.start_date) : '';
      this.filter.end_date = this.filter.end_date  ? this.db.pickerFormat(this.filter.end_date) : '';
      
      if(action=='refresh')
      { 
        this.filter.date = '';
        this.filter.start_date = '';
        this.filter.end_date = '';
      }
      
      this.db.post_rqst(  {  'filter': this.filter , 'login':this.db.datauser}, 'app_karigar/support_list?page=' + this.current_page )
      .subscribe( d => {
          this.loading_list = false;
          console.log(d);

          this.support_list = d.data.data;
          console.log(this.support_list)
          this.all_count =d.all_count;
          this.done_count =d.done_count;
          this.pending_count =d.pending_count;
          
          this.current_page = d.data.current_page;
          this.last_page = d.data.last_page;
        //   this.last_page =d.data.total;
          // this.reedam = d.redeem.data;
          
          // this.support_all = d.redeem_all;
          // this.support_pending = d.redeem_pending;
          // this.support_approved = d.redeem_approved;
          // this.support_reject = d.redeem_reject;
      });
      
  }

  changeStatus(i,id,status)
  {
      console.log(status);
      console.log(id);
      
      const dialogRef = this.alrt.open(ChangeStatusComponent,{
          width: '500px',
          // height:'500px',
          
          data: {
              'id' : id,
              'status' : status,
              'support' : true,
          }
      });
      dialogRef.afterClosed().subscribe(result => {
          if( result ){
              this.getSupportList('');
          }
      });
      
  }

  openDatePicker(picker : MatDatepicker<Date>)
  {
      picker.open();
  }
  openDialog(id ,string ) {
    const dialogRef = this.alrt.open(ProductImageModuleComponent,{
        data: {
            'id' : id,
            'mode' : string,
        }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
    });
}


openDatepicker(): void {
    const dialogRef = this.alrt.open(MastetDateFilterModelComponent, {
        width: '500px',
        data: {
            from:this.filter.start_date,
            to:this.filter.end_date
        }
    });
    
    dialogRef.afterClosed().subscribe(result => {
        this.filter.start_date = result.from;
        this.filter.end_date = result.to;
        this.getSupportList('') 
    });
}

exportSupportList()
{
    this.filter.mode = 1;
    this.db.post_rqst(  {'filter': this.filter , 'login':this.db.datauser}, 'app_karigar/support_list_Excel')
    .subscribe( d => {
        document.location.href = this.db.myurl+'/app/uploads/SUPPORT_DATA.csv';
        console.log(d);
    });
}
}

