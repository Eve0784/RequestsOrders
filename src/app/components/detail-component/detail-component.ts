import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RequestsService } from '../../service/requests-service';
import { RequestItem } from '../../model/request';

@Component({
  selector: 'app-detail-component',
  imports: [RouterLink],
  templateUrl: './detail-component.html',
  styleUrl: './detail-component.scss',
})
export class DetailComponent {
  route = inject(ActivatedRoute);
  requestServ = inject(RequestsService);
  request= signal<RequestItem| null>(null);
  router = inject(Router);

  constructor(){
    const requestId= this.route.snapshot.paramMap.get('id')?? '';
    //console.log('requestId:', requestId);
    this.requestServ.getRequestById(requestId)
    .then(data =>{
       //console.log('data:', data);
        this.request.set(data);
    });
  }

    changeStatus(status: string) {
    const id = this.request()!.id;
    this.requestServ.updateStatus(id, status);         // ← actualiza en servicio y localStorage
    this.request.update(r => ({ ...r!, status }));     // ← actualiza la vista local
  }

  deleteRequest() {
  this.requestServ.deleteRequest(this.request()!.id)
    .then(() => this.router.navigate(['/list'])); // ← elimina y vuelve al listado
}
}

