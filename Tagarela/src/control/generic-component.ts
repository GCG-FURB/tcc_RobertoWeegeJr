import { Loading, LoadingController, AlertController, PopoverController, ToastController } from "ionic-angular";

export class GenericComponent {

    //variaveis de coponentes visuais
    private _loading: Loading;

    //tratativas de erro
    private _error: string;
    
    constructor(private loadingController: LoadingController,
                private alertController: AlertController,
                private popoverController: PopoverController,
                private toastController: ToastController) {}

    get loading(): Loading {
        return this._loading;
    }
    
    set loading(loading: Loading) {
        this._loading = loading;
    }

    public get error(): string {
        return this._error;
    }

    public set error(value: string) {
        this._error = value;
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

    public async startPopover(popoverObject: any, popoverParams: any) {
        let popover = this.popoverController.create(popoverObject, popoverParams);
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

    public errorHandler(e){
        this.dismissLoading();
        alert('error handler')
        alert(e.message)
        alert(e.stack)
    }

}