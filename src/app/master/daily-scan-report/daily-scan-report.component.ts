import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-daily-scan-report',
  templateUrl: './daily-scan-report.component.html',
  styleUrls: ['./daily-scan-report.component.scss']
})
export class DailyScanReportComponent implements OnInit {

  loading_list:boolean=false;
  select_all:any="";
  search:any={};
  current_page:any=1;
  last_page:any;
  other_date:any=false;
  todaysdate:any;
  constructor(public db:DatabaseService) { }
  
  ngOnInit() {
      this.date_change();
      this.todaysdate = new Date();
      console.log(this.todaysdate);
  }
  
  ActiveKarigar_detail:any=[];
//   total_karigars:any=0;
  get_data()
  {   
      // if(this.other_date == false){
      //   this.search.date_created = moment(this.todaysdate).format('YYYY-MM-DD');
      // }
      this.loading_list=true;
      this.db.post_rqst({"search":this.search},"app_karigar/karigar_active_state_log?page="+ this.current_page)
      .subscribe(resp=>{
          console.log(resp);
          
          this.loading_list=false;
          this.ActiveKarigar_detail = resp['log_data'].data;
          this.current_page = resp['log_data'].current_page;
          this.last_page = resp['log_data'].last_page;
          // this.other_date=false;
        //   this.total_karigars =resp['promo_kar_log'].total;
        //   console.log(this.promo_karigar);
      })
  }
  
  redirect_previous() {
    if (this.current_page > 1)
    { 
      this.current_page--;
      this.get_data();
    }
  }
  redirect_next()
  {
      if (this.current_page < this.last_page)
      { 
          this.current_page++; 
      }
      else
      {
          this.current_page = 1; 
      }
      this.get_data();
  }

  date_change(){

    this.other_date=true;
    this.search.date_created = moment(this.todaysdate).format('YYYY-MM-DD');
    this.get_data();
  }

  exportDailyScanReportCategory(){
    this.loading_list=true;
    this.db.post_rqst(  {}, 'app_karigar/active_karigar_excel')
    .subscribe( d => {
        this.loading_list = false;
        document.location.href = this.db.myurl+'app/uploads/active_karigar.csv';
        console.log(d);
    });
    this.loading_list = false;
  }
}
