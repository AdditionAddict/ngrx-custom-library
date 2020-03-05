import { Injectable } from "@angular/core";
import {
    Observable,
    BehaviorSubject,
    combineLatest,
    fromEvent,
    Observer,
    merge
} from "rxjs";
import { map, mapTo } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class NxaOnlineCheckService {
    offlineSubject: BehaviorSubject<boolean>;
    offline$: Observable<boolean>;

    constructor() {
        this.offlineSubject = new BehaviorSubject<boolean>(false);
        this.offline$ = this.offlineSubject.asObservable();
    }

    /**
     * Credit: stack overflow user Dilshan Liyanage
     * https://stackoverflow.com/a/57069101/4711754
     */
    navigatorOnline$(): Observable<boolean> {
        return merge<boolean>(
            fromEvent(window, "offline").pipe(mapTo(false)),
            fromEvent(window, "online").pipe(mapTo(true)),
            new Observable((sub: Observer<boolean>) => {
                sub.next(window.navigator.onLine);
                sub.complete();
            })
        );
    }

    /** combine navigator and toggle */
    online$(): Observable<boolean> {
        return combineLatest(this.navigatorOnline$(), this.offline$).pipe(
            map(([navigatorOnline, offline]) => {
                return navigatorOnline && !offline;
            })
        );
    }

    setToggleStatus(bool: boolean): Observable<boolean> {
        this.offlineSubject.next(bool);
        return this.offline$;
    }
}
