import {Component, OnInit, ViewChild} from '@angular/core';
import {Service} from '../../+models/service';
import {ActivatedRoute} from '@angular/router';
import {Availability} from '../../+models/availability';
import * as moment from 'moment';
import {OrderingService} from '../../+services/ordering.service';
import {Professional} from '../../+models/professional';
import {AlertController, IonItemSliding, ToastController} from '@ionic/angular';
import {CreatePlanningDto} from '../../+models/dto/create-planning-dto';
import {Planning} from '../../+models/planning';
import {AuthService} from '../../+services/auth.service';
import {User} from '../../+models/user';
import {HttpErrorResponse} from '@angular/common/http';

const LATEST_HOUR = 18;
const AVAILABILITY_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

@Component({
    selector: 'app-single-service',
    templateUrl: './single-service.page.html',
    styleUrls: ['./single-service.page.scss'],
})
export class SingleServicePage implements OnInit {

    @ViewChild('professionalItemSliding', {static: false}) professionalItemSliding: IonItemSliding;

    title = 'Service';
    service: Service = {} as Service;
    chosenDate: string;
    minimumDate: Date;
    private _availability: Availability = {} as Availability;
    availableProfessionals: Professional[];

    hourRange: HourRange = {lower: 8, upper: LATEST_HOUR} as HourRange;

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
                private alertCtrl: AlertController, private toastCtrl: ToastController, private authService: AuthService) {
    }

    ngOnInit() {
        this.service = this.activatedRoute.snapshot.data.service;
        this.computeMinimumDate();
        this.computeChosenDate(new Date());
        this.availableProfessionals = this.service.professionals;
    }

    onDateChange(event: CustomEvent): void {
        this.computeChosenDate(new Date(event.detail.value));
        this.orderingService.getProfessionalsByAvailability(this.availability)
            .subscribe(professionals => this.availableProfessionals = professionals as Professional[]);
    }

    onHourRangeChange(event: CustomEvent) {
        this.orderingService.getProfessionalsByAvailability(this.availability)
            .subscribe(professionals => this.availableProfessionals = professionals as Professional[]);
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
        if (this.authService.isUserLoggedIn) {
            this.authService.getUser().then(user => {
                if (user && (user as User).person.customer) {
                    this.createOrder(professional);
                } else {
                    this.unauthorized();
                }
            });
        }
    }

    async createOrder(professional: Professional) {
        const alert = await this.alertCtrl.create({
            header: 'Confirmation',
            message: `Confirmer la commande de services de <strong> ${professional.last_name} </strong>?`,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'primary',
                    handler: () => {
                        this.professionalItemSliding.closeOpened();
                    }
                }, {
                    text: 'Confirmer',
                    handler: () => {
                        this.professionalItemSliding.closeOpened();
                        this.createPlanning(professional);
                    }
                }
            ]
        });
        await alert.present();
    }

    async unauthorized() {
        const alert = await this.alertCtrl.create({
            header: 'Interdit',
            message: 'Seuls les clients peuvent commander des services. Veuillez utiliser votre compte client.',
            buttons: [
                {
                    text: 'Okay',
                    role: 'ok',
                    cssClass: 'primary',
                    handler: () => {
                        this.professionalItemSliding.closeOpened();
                    }
                }
            ]
        });
        await alert.present();
    }

    async showSuccessNotification(msg: string, success: boolean) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 5000,
            color: success ? 'success' : 'danger',
            position: 'bottom',
            translucent: true,
            showCloseButton: true
        });
        toast.present();
    }

    createPlanning(professional: Professional) {
        const format = moment.HTML5_FMT.DATETIME_LOCAL_MS;
        const order = {
            planning: [{
                professional_id: professional.id,
                customer_id: this.authService.user.person.customer.id,
                date: moment(new Date(this.chosenDate)).format(format),
                start_hour: moment(new Date(this.chosenDate))
                    .hour(this.hourRange.lower).minute(0).second(0).format(format),
                end_hour: moment(new Date(this.chosenDate))
                    .hour(this.hourRange.upper).minute(0).second(0).format(format),
                status_id: 1,
                service_id: this.service.id
            }] as Planning[]
        } as CreatePlanningDto;
        this.orderingService.createPlanning(order).subscribe(data => {
            this.showSuccessNotification('Commande passée avec succès!', true);
        }, error => {
            const ex = error as HttpErrorResponse;
            console.log(ex);
            this.showSuccessNotification('Commande echouée!' + ex.message, false);
        });
    }
}

export interface HourRange {
    lower: number;
    upper: number;
}
