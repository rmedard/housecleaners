import {Component, OnInit, ViewChild} from '@angular/core';
import {Service} from '../../+models/service';
import {ActivatedRoute} from '@angular/router';
import {Availability} from '../../+models/availability';
import * as moment from 'moment';
import {LabelType, Options} from 'ng5-slider';
import {OrderingService} from '../../+services/ordering.service';
import {Professional} from '../../+models/professional';
import {AlertController, IonItemSliding, ToastController} from '@ionic/angular';

const LATEST_HOUR = 20;
const AVAILABILITY_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

@Component({
    selector: 'app-single-service',
    templateUrl: './single-service.page.html',
    styleUrls: ['./single-service.page.scss'],
})
export class SingleServicePage implements OnInit {

    @ViewChild('itemSliding', {static: false}) itemSliding: IonItemSliding;

    title = 'Service';
    service: Service = {} as Service;
    chosenDate: string;
    minimumDate: Date;
    private _availability: Availability = {} as Availability;
    private _availableProfessionals: Professional[];

    hourRange: HourRange = {lower: 8, upper: LATEST_HOUR} as HourRange;
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
            .hour(this.hourRange.lower).minute(0).second(0).format(AVAILABILITY_TIME_FORMAT);
        this._availability.end_time = moment(new Date(this.chosenDate))
            .hour(this.hourRange.upper).minute(0).second(0).format(AVAILABILITY_TIME_FORMAT);
        return this._availability;
    }

    constructor(private activatedRoute: ActivatedRoute,
                private orderingService: OrderingService,
                private alertCtrl: AlertController, private toastCtrl: ToastController) {
    }

    ngOnInit() {
        this.service = this.activatedRoute.snapshot.data.service;
        this.computeMinimumDate();
        this.computeChosenDate(new Date());
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
        console.log(this.getEarliestHour());
        this.orderingService.getProfessionalsByAvailability(this.availability)
            .subscribe(professionals => this._availableProfessionals = professionals);
    }

    onHourRangeChange(event: CustomEvent) {
        // this.validateHourRange(event);
        this.orderingService.getProfessionalsByAvailability(this.availability)
            .subscribe(professionals => this._availableProfessionals = professionals);
    }

    private computeChosenDate(date: Date): void {
        this.hourRange.lower = 8;
        if (moment(date).isSame(new Date(), 'day')) {
            const currentHour: number = moment(new Date()).hour();
            if (currentHour < LATEST_HOUR - 1) {
                this.hourRange.lower = currentHour < 8 ? 8 : currentHour + 1;
            } else {
                date = moment(date).add(1, 'day').toDate();
            }
        }
        this.chosenDate = moment(date).format('YYYY-MM-DD');
    }

    private computeMinimumDate() {
        if (moment(new Date()).hour() >= LATEST_HOUR - 1) {
            this.minimumDate = moment(new Date()).hour(8).minute(0).second(0).add(1, 'day').toDate();
        } else {
            this.minimumDate = moment(new Date()).hour(new Date().getHours() + 1).minute(0).second(0).toDate();
        }
    }

    getLatestHour() {
        return LATEST_HOUR;
    }

    getEarliestHour() {
        if (moment(this.chosenDate, 'YYYY-MM-DD').isSame(new Date(), 'day')) {
            if (moment(new Date()).hour() < 8 || moment(new Date()).hour() > LATEST_HOUR) {
                return 8;
            } else {
                return moment(new Date()).hour() + 1;
            }
        } else {
            return 8;
        }
    }

    async confirmOrder(professional: Professional) {
        const alert = await this.alertCtrl.create({
            header: 'Confirmation',
            message: 'Confirmer la commande de services de <strong>' + professional.last_name + '</strong>?',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        // this.sm.closeOpened();
                        this.itemSliding.closeOpened();
                    }
                }, {
                    text: 'Confirmer',
                    handler: () => {
                        console.log('Confirm Okay');
                        this.itemSliding.closeOpened();
                        this.showSuccessNotification();
                    }
                }
            ]
        });
        await alert.present();
    }

    async showSuccessNotification() {
        const toast = await this.toastCtrl.create({
            message: 'Commande passé avec succès!',
            duration: 2000,
            color: 'success',
            position: 'bottom',
            translucent: true,
            showCloseButton: true
        });
        toast.present();
    }
}

export interface HourRange {
    lower: number;
    upper: number;
}
