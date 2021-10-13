import { Config } from './Config';
import { catchError, delay, map, repeatWhen, retryWhen, switchMap, tap } from 'rxjs/operators';
import { RequestService } from './RequestService';
import { of, throwError } from 'rxjs';
import { zConfigMail, zMailService } from 'zmodule-api';
import fs from 'fs';
import path from 'path';
import currencyFormatter from 'currency-formatter';

RequestService.getInstance.getPvuPrice().pipe(
    switchMap((result) => {
        const info = result.items[0];

        if (!Config.CFG_NOTIFICATION_EMAIL || !Config.CFG_NOTIFICATION_PRICE) {
            return of(info);
        }


        if (Number(info.price) < Config.CFG_NOTIFICATION_PRICE) {
            return of(info);
        }

        let html = fs.readFileSync(path.join(__dirname + '/email.html')).toString();
        const price = currencyFormatter.format(Number(info.price), { code: Config.CFG_CURRENCY });

        html = html.replace('{{url}}', info.logo_url);
        html = html.replace('{{name}}', info.name);
        html = html.replace('{{symbol}}', info.symbol);
        html = html.replace('{{date}}', new Date().toLocaleString());
        html = html.replace('{{rank}}', info.rank);
        html = html.replace('{{price}}', price) ;


        return zMailService.getInstance().sendMail({
            from: zConfigMail.auth.user,
            to: Config.CFG_NOTIFICATION_EMAIL,
            subject: `GOOD NEWS PVU HIT THE VALUE OF ${price}`,
            text: '',
            html
        }).pipe(
            map(() => info)
        );

    }),
    tap((result) => {
        const price = currencyFormatter.format(Number(result.price), { code: Config.CFG_CURRENCY });
        console.log(`🍀 ${result.symbol}: ${price} - ${new Date().toLocaleString()}`);
    }),
    catchError((err) => {
        console.log(err);
        return throwError(err);
    }),
    retryWhen((err) => err.pipe(
        delay(Config.CFG_CHECK_TIME)
    )),
    repeatWhen((rep) => rep.pipe(
        delay(Config.CFG_CHECK_TIME)
    ))
).subscribe();
