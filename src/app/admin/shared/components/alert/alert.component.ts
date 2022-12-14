import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Alert, AlertService} from "../../services/alert.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() delay = 5000
  text = ''
  type = 'success'
  private aSub: Subscription;
  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.aSub = this.alertService.alert$.subscribe((alert: Alert) => {
      this.text = alert.text
      this.type = alert.type
      const timeOut = setTimeout(()=>{
        clearTimeout(timeOut)
        this.text = ''
      }, this.delay)
    })
  }

  ngOnDestroy(): void {
    if(this.aSub) this.aSub.unsubscribe()
  }

}
