import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Planning} from '../../+models/planning';
import {Professional} from '../../+models/professional';
import {Service} from '../../+models/service';

@Component({
    selector: 'app-planning-teaser',
    templateUrl: './planning-teaser.component.html',
    styleUrls: ['./planning-teaser.component.scss'],
})
export class PlanningTeaserComponent implements OnInit {

    @Input() plan: { planning: Planning, professional: Professional, service: Service };
    @Input() future: boolean;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        if (this.future) {
            this.elementRef.nativeElement.style.setProperty('--plan-color', 'var(--ion-color-success)');
        } else {
            this.elementRef.nativeElement.style.setProperty('--plan-color', 'var(--ion-color-danger)');
        }
    }

}
