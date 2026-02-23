import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from "@angular/router";
import { RequestsService } from '../../../service/requests-service';

@Component({
  selector: 'app-card-component',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './card-component.html',
  styleUrl: './card-component.scss',
})
export class CardComponent {
  request = input.required<any>();
   requestServ = inject(RequestsService);

   onDelete() {
    this.requestServ.deleteRequest(this.request().id)
    .then(() => this.requestServ.getRequest());
  }

}
