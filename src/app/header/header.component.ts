import { Component, OnInit, Renderer2  } from '@angular/core';
import {SessionStorage} from '../_services/SessionService';
import {Router} from '@angular/router';
import {DatabaseService} from './../_services/DatabaseService';
import {DialogComponent} from './../dialog/dialog.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
    
    constructor(private renderer: Renderer2, private router: Router, public ses: SessionStorage, public db: DatabaseService , public dialog: DialogComponent) { }
    
    ngOnInit() {
        this.get_abacus_con(); 
        this.feedback_status();     
        this.support_status();  
    }
    
    status:boolean = false;
    toggleHeader() {
        this.status = !this.status;
        if(this.status) {
            this.renderer.addClass(document.body, 'active');
        }
        else {
            this.renderer.removeClass(document.body, 'active');
        }
    }
    
    task_cn:any=0;
    get_abacus_con()
    {
        this.db.post_rqst( {}, 'abacusConnect')
        .subscribe(resp=> {
            console.log(resp);
            this.task_cn = resp.result.task_count;
        });
    }

    feedbk_status:any;
    feedback_status()
    {
        this.db.post_rqst( {}, 'app_karigar/feedback_unseen_msg_counter')
        .subscribe(resp=> {
            this.feedbk_status=resp.feedback_unseen_msg_counter
            console.log(resp);

        });
    }

    suport_status:any;
    support_status()
    {
        this.db.post_rqst( {}, 'app_karigar/support_pending_count')
        .subscribe(resp=> {
            this.suport_status=resp.count;
            console.log(resp);

        });
    }

    logout(): void {
        this.ses.logoutSession();
        this.router.navigate(['/']);
    }
    
    gotoAbacusConnect()
    {
        window.open("http://crmsupport.abacusdesk.com/projecttaskdetail/djBmSjN1bUZQT0hpOXZnZjB5Q2pPUT09","_blank");
    }
    
    show_actions:any={};
    
}
