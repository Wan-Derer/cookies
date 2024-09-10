import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage, NgForOf, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  currency = '$';

  productsData: any;

  private fb: FormBuilder = new FormBuilder();

  form = this.fb.group({
    product: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('https://testologia.ru/cookies').subscribe(data => this.productsData = data);
  }

  scrollTo(target: HTMLElement, product?: any) {
    target.scrollIntoView({behavior: 'smooth'});
    if (product) {
      this.form.patchValue({product: product.title + ' (' + product.price + ' ' + this.currency + ')'});
    }
  }

  changeCurrency() {
    let newCurrency = '$';
    let rate = 1;

    if (this.currency === '$') {
      newCurrency = '₽';
      rate = 90;
    } else if (this.currency === '₽') {
      newCurrency = 'Br';
      rate = 3;
    } else if (this.currency === 'Br') {
      newCurrency = '€';
      rate = 0.9;
    } else if (this.currency === '€') {
      newCurrency = '¥';
      rate = 6.9;
    }

    this.currency = newCurrency;

    this.productsData.forEach((item: any) => {
      item.price = +(item.basePrice * rate).toFixed(1);
    });

  }

  confirmOrder() {
    if (this.form.valid) {
      this.http.post('https://testologia.ru/cookies-order', this.form.value)
        .subscribe({
          next: (resp: any) => {
            alert(resp.message);
            this.form.reset();
          },
          error: (resp: any) => {
            alert(resp.error.message);
          }
        });

    }
  }

  switchSugarFree(event: any) {
    this.http.get('https://testologia.ru/cookies' + (event.currentTarget.checked ? '?sugarfree' : ''))
      .subscribe(data => this.productsData = data);
  }

}
