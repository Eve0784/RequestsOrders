import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";
import { RequestsService } from '../../service/requests-service';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink, MatBadgeModule, MatButtonModule, MatIconModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
   requestServ = inject(RequestsService);

}
