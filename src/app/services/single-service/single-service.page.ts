import {Component, OnInit} from '@angular/core';
import {Service} from '../../+models/service';
import {ActivatedRoute} from '@angular/router';
import {Availability} from '../../+models/availability';
import * as moment from 'moment';
import {ChangeContext, LabelType, Options} from 'ng5-slider';
import {OrderingService} from '../../+services/ordering.service';
import {Professional} from '../../+models/professional';
import {ActionSheetController} from '@ionic/angular';

const LATEST_HOUR = 18;
const AVAILABILITY_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

@Component({
    selector: 'app-single-service',
    templateUrl: './single-service.page.html',
    styleUrls: ['./single-service.page.scss'],
})
export class SingleServicePage implements OnInit {
    title = 'Service';
    service: Service = {} as Service;
    chosenDate: string;
    minimumDate: Date;
    private _availability: Availability = {} as Availability;
    private _availableProfessionals: Professional[];

    fromValue: number;
    toValue: number;
    options: Options;

    get availableProfessionals(): Professional[] {
        return this._availableProfessionals;
    }

    set availableProfessionals(value: Professional[]) {
        this._availableProfessionals = value;
    }

    get availability(): Availability {
        this._availability.service_id = this.service.id.toString();
        this._availability.start_time = moment(new Date(this.chosenDate))
            .hour(this.fromValue).minute(0).second(0).format(AVAILABILITY_TIME_FORMAT);
        this._availability.end_time = moment(new Date(this.chosenDate))
            .hour(this.toValue).minute(0).second(0).format(AVAILABILITY_TIME_FORMAT);
        return this._availability;
    }

    constructor(private activatedRoute: ActivatedRoute,
                private orderingService: OrderingService,
                private actionSheetCtrl: ActionSheetController) {
    }

    ngOnInit() {
        this.service = this.activatedRoute.snapshot.data.service;
        this.computeMinimumDate();
        this.toValue = LATEST_HOUR;
        this.computeChosenDate(new Date());
        console.log('Minimum: ' + this.minimumDate);
        this._availableProfessionals = this.service.professionals;
        this.options = {
            showTicksValues: false,
            showTicks: true,
            floor: 8,
            ceil: LATEST_HOUR,
            step: 1,
            translate: (value: number, label: LabelType): string => {
                switch (label) {
                    case LabelType.Low:
                        return '<b>De </b>' + value + 'h';
                    case LabelType.High:
                        return '<b>À </b>' + value + 'h';
                    default:
                        return '';
                }
            }
        } as Options;
    }

    onDateChange(event: CustomEvent): void {
        this.computeChosenDate(new Date(event.detail.value));
        console.log('Minimum: ' + this.minimumDate);
        this.orderingService.getProfessionalsByAvailability(this.availability)
            .subscribe(professionals => this._availableProfessionals = professionals);
    }

    async presentActionSheet(lastName: string) {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Commander le service de ' + lastName,
            buttons: [{
                text: 'Confirmer la commande',
                icon: 'checkmark',
                handler: () => {
                    console.log('Confirmation faite');
                }
            }, {
                text: 'Annuler',
                icon: 'close',
                role: 'cancel',
            }]
        });
        await actionSheet.present();
    }

    onHourRangeChange(context: ChangeContext): void {
        this.validateHourRange(context);
        this.orderingService.getProfessionalsByAvailability(this.availability)
            .subscribe(professionals => this._availableProfessionals = professionals);
    }

    private computeChosenDate(date: Date): void {
        this.fromValue = 8;
        if (moment(date).isSame(new Date(), 'day')) {
            const currentHour: number = moment(new Date()).hour();
            if (currentHour < LATEST_HOUR - 1) {
                this.fromValue = currentHour < 8 ? 8 : currentHour + 1;
            } else {
                date = moment(date).add(1, 'day').toDate();
            }
        }
        this.chosenDate = moment(date).format('YYYY-MM-DD');
    }

    private computeMinimumDate() {
        if (moment(new Date()).hour() >= LATEST_HOUR - 1) {
            this.minimumDate = moment(new Date()).add(1, 'day').toDate();
        } else {
            this.minimumDate = new Date();
        }
    }

    validateHourRange(context: ChangeContext) {
        if (moment(this.chosenDate).isSame(new Date(), 'day')) {
            const currentHour: number = moment(new Date()).hour() + 1;
            if (context.value < currentHour) {
                this.fromValue = currentHour;
            }
        }
    }
}
