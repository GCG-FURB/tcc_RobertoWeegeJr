import { Loading, LoadingController, AlertController, PopoverController, ToastController } from "ionic-angular";
import { Device } from '@ionic-native/device';

export class GenericComponent {

    //variaveis de coponentes visuais
    private _loading: Loading;

    constructor(private loadingController: LoadingController,
                private alertController: AlertController,
                private popoverController: PopoverController,
                private toastController: ToastController,
                private device: Device) {}

    get loading(): Loading {
        return this._loading;
    }
    
    set loading(loading: Loading) {
        this._loading = loading;
    }

    public async createLoading(content: string){
        await this.dismissLoading();
        this.loading = this.loadingController.create({content: content});
        await this.loading.present();
    }

    public async dismissLoading(){
        if (this.loading) {
            await this.loading.dismiss();
            this.loading = null;
        }
    }

    public async startPopover(popoverObject: any, popoverParams: any, popoverSCSS?: any) {
        let popover = this.popoverController.create(popoverObject, popoverParams, popoverSCSS);
        await popover.present();
    }

    public async startAlert(alertParams: any) {
        let alert = this.alertController.create(alertParams);
        await alert.present()
    }

    public async createDefaultToast(message: string) {
        let toast = this.toastController.create({
            message: message,
            duration: 3000,
            position: 'down'
        });
        await toast.present();
    }

    public isOldAndroid(): boolean {
        return +this.device.version[0] < 5; 
    }

    public errorHandler(e: any): void{
        this.dismissLoading();
        this.startAlert({
            title: 'Ocorreu um Erro',
            subTitle: (e && e.message ? e.message : 'Erro não mapeado.'),
            buttons: ['OK']
        });
    }

}