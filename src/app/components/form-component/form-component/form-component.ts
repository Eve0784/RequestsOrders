import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RequestsService } from '../../../service/requests-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-form-component',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './form-component.html',
  styleUrl: './form-component.scss',
})
export class FormComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  requestServ = inject(RequestsService);

  // ¿estamos editando o creando?
  isEditing = false;
  editId = '';

  // campos del formulario
  form = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    product: ['', Validators.required],
    desc: [''],
    address: [''],
    city: [''],
    country: [''],
    status: ['da_fare'],
    orderData: [new Date().toISOString()],
    orderDue: ['', Validators.required],
     img: [''],
    img2: [''],
  });

  ngOnInit() {
    // si hay un id en la URL, estamos editando
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.editId = id;
      // carga los datos del orden a editar
      this.requestServ.getRequestById(id).then(data => {
        this.form.patchValue(data);
      });
    }
  }

  submit() {
    if (this.form.invalid){
      //console.log('form invalido:', this.form.errors, this.form.value); // ← para debug
    return;
    }

    const formData = {
    ...this.form.value,
    orderDue: this.form.value.orderDue
      ? new Date(this.form.value.orderDue as any).toISOString() // ← convierte Date a string
      : ''
  };

     if (this.isEditing) {
    this.requestServ.updateRequest(this.editId, formData as any)
      .then(() => this.router.navigate(['/detail', this.editId]));
  } else {
    this.requestServ.createRequest(formData as any)
      .then(() => this.router.navigate(['/list']));
  }

  }

  cancel() {
    // vuelve atrás sin guardar
    this.router.navigate([this.isEditing ? `/detail/${this.editId}` : '/list']);
  }

  // método para convertir imagen a base64
  onImageUpload(event: Event, field: 'img' | 'img2') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // comprime la imagen con canvas
      const canvas = document.createElement('canvas');
      const maxSize = 400; // ← máximo 400px
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) { height *= maxSize / width; width = maxSize; }
      } else {
        if (height > maxSize) { width *= maxSize / height; height = maxSize; }
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL('image/jpeg', 0.7); // ← calidad 70%
      this.form.patchValue({ [field]: compressed });
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  }
}
