import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../_services/DatabaseService';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    
    loading_list = false;
    balance_coupon_value:any;
    karigars:any;
    offer:any;
    pending_redeem_request:any;
    offer_gift:any;
    products:any;
    super_karigars:any=[];
    offer_balance_days:any=[];
    state_wise_karigars:any=[];
    dataSource : any = [];
    dataSource1:any=[];
    scan_coupon_count:any=[];
    coupon_count:any=[];
    data_Source:any;
    graphData:any;
    karigar_state_wise:any=[];
    Activekarigar:any=[];
    stateWiseKarigar:any=[];
    toggle_graph:any = 0;
    Todays_Active_karigar:any=[];
    
    constructor(public db: DatabaseService, private router:Router) 
    {
        this.get_counts();
        this.get_super_karigars();
        this.get_offer_balance_days();
        this.state_wise_karigar();
        this.coupon_code_graph();
        this.get_scan_coupon_data();
        this.Active_karigar();
    }
    
    ngOnInit() 
    {
        
    }
    
    get_counts() 
    {
        this.loading_list = true;
        
        this.db.post_rqst({ }, 'master/getDashboardcounts').subscribe(resp => 
            {
                this.loading_list = false;
                console.log(resp);
                this.balance_coupon_value = resp.balance_coupon_value;
                this.karigars = resp.karigars;
                this.offer = resp.offer;
                this.offer_gift = resp.offer_gift;
                this.pending_redeem_request = resp.pending_redeem_request;
                this.products = resp.products;
            });
        }
        
        get_super_karigars()
        {
            this.loading_list = true;
            
            this.db.post_rqst({ }, 'master/getSuperkarigars')
            .subscribe((resp) => 
            {
                this.loading_list = false;
                console.log(resp);
                this.super_karigars = resp.super_karigars;
            });
        }
        
        get_offer_balance_days()
        {
            this.loading_list = true;
            this.db.post_rqst({ }, 'master/getOfferBalanceDays')
            .subscribe((resp) => 
            {
                this.loading_list = false;
                console.log(resp);
                this.offer_balance_days = resp.offer_balance_days;
            });
        }
        
        state_wise_karigar()
        {
            this.db.post_rqst({},'master/stateWiseKarigar')
            .subscribe((resp)=>
            {
                this.karigar_state_wise=[];
                console.log(resp);
                this.stateWiseKarigar=resp.state_wise_karigars;
                
                for (let i=0;i < this.stateWiseKarigar.length; i++)
                {
                    this.karigar_state_wise.push({"label": this.stateWiseKarigar[i].state,"value": this.stateWiseKarigar[i].total_karigars});
                }
                
                this.data_Source = {
                    "chart": {
                        "xAxisName": "States",
                        "yAxisName": "Karigars",
                        "numberSuffix": "k",
                        "theme": "fusion",
                    },
                    "data": this.karigar_state_wise            
                };
            })
        }

        Active_karigar()
        {
            this.db.post_rqst({},'app_karigar/get_kariger_active_state')
            .subscribe((resp)=>
            {
                this.Activekarigar=[];
                console.log(resp);
                this.Todays_Active_karigar=resp.active_state;
                
                for (let i=0;i < this.Todays_Active_karigar.length; i++)
                {
                    this.Activekarigar.push({"label": this.Todays_Active_karigar[i].state,"value": this.Todays_Active_karigar[i].total_karigars});
                }
                
                this.graphData = {
                    "chart": {
                        "showPercentValues": '0',
                        "numberSuffix": ")",
                        "numberPrefix": "(",
                        "xAxisName": "States",
                        "yAxisName": "Karigars",
                        "theme": "fusion",
                    },
                    "data": this.Activekarigar            
                };
            })
        }
        
        // toggle(){
        //     if(this.toggle_graph==0){
        //         this.Active_karigar();
        //         this.toggle_graph = 1;
        //     }
        //     else{
        //         this.state_wise_karigar();
        //         this.toggle_graph = 0;
        //     }
            
        // }
        
        total_coupon_code_data : any = [];
        scanned_coupon_code_data : any = [];
        total_coupon:any=[];
        scanned_coupon:any=[];
        offer_name:any=[];
        
        coupon_code_graph()
        {
            this.db.post_rqst({},'master/get_coupon_code_graph_data')
            .subscribe((resp)=>
            {
                console.log(resp);
                this.total_coupon_code_data = resp.total_coupon;
                this.scanned_coupon_code_data = resp.scanned_coupon;
                
                for(var i=0; i<this.total_coupon_code_data.length; i++)
                {
                    this.total_coupon.push({"value":this.total_coupon_code_data[i]['total_coupon']});
                    
                    this.offer_name.push({"label":this.total_coupon_code_data[i]['title']});
                }
                
                for(var j=0; j<this.scanned_coupon_code_data.length; j++)
                {
                    this.scanned_coupon.push({"value":this.scanned_coupon_code_data[j]['scan_coupon']})
                }
                
                this.dataSource = {
                    chart: {
                        xaxisname: "Offer Name",
                        yaxisname: "Total Number of Coupons",
                        formatnumberscale: "1",
                        plottooltext:
                        "<b>$dataValue</b> apps were available on <b>$seriesName</b> in $label",
                        theme: "fusion",
                        drawcrossline: "1"
                    },
                    categories: [{category : this.offer_name}],
                    dataset:[{seriesname:"Total Coupons", data:this.total_coupon}, {seriesname:"Scanned Coupons", data:this.scanned_coupon}]
                };
            });
        }
        
        
        get_scan_coupon_data()
        {
            this.db.post_rqst({},'master/scanCoupondata')
            .subscribe((resp)=>
            {
                console.log(resp);
                this.scan_coupon_count = resp.scan_coupon_count;
                
                for (let i=0;i < this.scan_coupon_count.length; i++)
                {
                    this.coupon_count.push({"label": this.scan_coupon_count[i].scan_day,"value": this.scan_coupon_count[i].scan_coupon_count});
                }
                
                this.dataSource1 = {
                    "chart": {
                        "xAxisName": "Day's",
                        "yAxisName": "No. of Coupons",
                        "showValues": "0",
                        "theme": "fusion"
                    },
                    "annotations": {
                        "groups": [{
                            "id": "anchor-highlight",
                            "items": [{
                                "id": "high-star",
                                "type": "circle",
                                "x": "$dataset.0.set.2.x",
                                "y": "$dataset.0.set.2.y",
                                "radius": "12",
                                "color": "#6baa01",
                                "border": "2",
                                "borderColor": "#f8bd19"
                            }
                        ]
                    }]
                },
                "data": this.coupon_count
            }
        })  
    }
    
    
    
    goto_offerPage()
    {
        this.router.navigate(["offer-list/active"]);
    }
    
    goto_offergiftPage()
    {
        this.router.navigate(['gift-list']);
    }
    
    goto_pending_redeem_rqs_page()
    {
        this.router.navigate(['redeem-request-list/pending']);
    } 
    
    goto_balance_coupon_page()
    {
        this.router.navigate(['coupon-code-list']);
    }
    
    goto_karigarsPage()
    {
        this.router.navigate(['karigar-list']);
    }
    
    goto_productPage()
    {
        this.router.navigate(['products-list']);
    }
    
}
