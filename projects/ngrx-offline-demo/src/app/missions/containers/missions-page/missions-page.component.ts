import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Mission } from '../../../interfaces';
import { MissionCollectionService } from '../../../ngrx-store/collection-services';

@Component({
  selector: 'app-missions-page',
  templateUrl: './missions-page.component.html',
  styleUrls: ['./missions-page.component.scss']
})
export class MissionsPageComponent implements OnInit {
  loading$: Observable<boolean>;
  missions$: Observable<Mission[]>;

  constructor(private missionService: MissionCollectionService) {
    this.missions$ = missionService.entities$;
    this.loading$ = missionService.loading$;
  }

  ngOnInit() {
    this.getMissions();
  }

  add(mission: Mission) {
    this.missionService.add(mission);
  }

  delete(mission: Mission) {
    this.missionService.delete(mission.uuid);
  }

  getMissions() {
    this.missionService.getAll();
  }

  update(mission: Mission) {
    this.missionService.update(mission);
  }

}
