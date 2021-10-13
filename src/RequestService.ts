import https from 'https';
import { Observable } from 'rxjs';
import { Config } from './Config';

export class RequestService {

    private static instace: RequestService | null;

    private apiURL = 'https://nomics.com/data/currencies-ticker';

    private constructor() { }

    public static get getInstance(): RequestService {

        if (!RequestService.instace) {
            RequestService.instace = new RequestService();
        }

        return RequestService.instace;

    }

    public static destroyInstance(): void {
        RequestService.instace = null;
    }

    public getPvuPrice(): Observable<any> {
        const newUrl = this.apiURL + `?filter=any&include-transparency=true&interval=${Config.CFG_INTERFAVAL}&quote-currency=${Config.CFG_CURRENCY}&symbols=PVU`;

        return new Observable<any>((obs) => {
            const req = https.get(newUrl, res => {

                if (res.statusCode !== 200) {
                    return obs.error('Failed to get information - ' + res.statusCode);
                } else {
                    res.on('data', (result: Buffer) => {
                        obs.next(JSON.parse(result.toString()));
                        return obs.complete();
                    });
                }
            });

            req.on('error', (error) => {
                return obs.error(error);
            });

        });
    }
}
