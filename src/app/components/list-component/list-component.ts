import { Component, computed, inject, signal } from '@angular/core';
import { RequestsService } from '../../service/requests-service';
import { CardComponent } from '../card-component/card-component/card-component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-component',
  imports: [CardComponent, RouterLink, MatButtonModule],
  templateUrl: './list-component.html',
  styleUrl: './list-component.scss',
})
export class ListComponent {
  requestServ = inject(RequestsService);
  route = inject(ActivatedRoute);
  activeFilter = signal<string | null>(null);

    requests = computed(() => {
    const filter = this.activeFilter();
    const all = this.requestServ.allRequests();
    return filter ? all.filter(r => r.status === filter) : all;
  });


  constructor(){
    this.requestServ.getRequest();
    this.route.paramMap.subscribe(params => {
      this.activeFilter.set(params.get('status'));
    });

  }

    setFilter(status: string | null) {
    this.activeFilter.set(status);
  }
}

