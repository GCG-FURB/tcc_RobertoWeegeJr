import { Loading, LoadingController, AlertController, PopoverController } from "ionic-angular";

export class GenericComponent {

    //variaveis de coponentes visuais
    private _loading: Loading;

    //tratativas de erro
    private _error: string;
    
    constructor(private loadingController: LoadingController,
                private alertController: AlertController,
                private popoverController: PopoverController) {}

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

    public async startPopover(popoverObject: any, popoverParams: any) {
        let popover = this.popoverController.create(popoverObject, popoverParams);
        await popover.present();
    }

    public async startAlert(alertParams: any) {
        let alert = this.alertController.create(alertParams);
        await alert.present()
    }

    public errorHandler(e){
        this.dismissLoading();
        alert('error handler')
        alert(JSON.stringify(e))
        alert(e.message)
        alert(e.stack)
        alert(e.name)
    }


}