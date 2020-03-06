import { NxaOnlineCheckService } from "../../lib/offline-services/online-check-service";
import { of } from 'rxjs';

fdescribe('NxaOnlineCheckService', () => {
    // TODO: add tests
    let service: NxaOnlineCheckService

    beforeAll(() => {
        service = new NxaOnlineCheckService()
    })

    describe('#online$', () => {
        it('should return true when window.navigator.onLine is true', (done: DoneFn) => {
            spyOnProperty(window.navigator, 'onLine').and.returnValue(true);
            service.online$().subscribe(isOnline => {
                expect(isOnline).toBe(true)
                done()
            })
        })

        it('should return false when window.navigator.onLine is false', (done: DoneFn) => {
            spyOnProperty(window.navigator, 'onLine').and.returnValue(false);
            service.online$().subscribe(isOnline => {
                expect(isOnline).toBe(false)
                done()
            })
        })

        it('should return true when offline$ is an observable of false', (done: DoneFn) => {
            spyOnProperty(window.navigator, 'onLine').and.returnValue(true);
            service.offline$ = of(false)

            service.online$().subscribe(isOnline => {
                expect(isOnline).toBe(true)
                done()
            })
        })

        it('should return false when offline$ is an observable of true', (done: DoneFn) => {
            spyOnProperty(window.navigator, 'onLine').and.returnValue(true);
            service.offline$ = of(true)

            service.online$().subscribe(isOnline => {
                expect(isOnline).toBe(false)
                done()
            })
        })
    })



});