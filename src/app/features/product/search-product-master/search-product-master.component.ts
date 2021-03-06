import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsSandbox } from '../products.sandbox';
import { ProductSuggestion } from '@belisada-seller/core/models';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from '@env/environment';

@Component({
  selector: 'bss-search-product-master',
  templateUrl: './search-product-master.component.html',
  styleUrls: ['./search-product-master.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchProductMasterComponent implements OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];
  productSuggestionList: ProductSuggestion[];
  onProductNameFocus: Boolean = false;
  name: string;
  checkIfLength: Boolean = false;
  public addProductForm: FormGroup;
  a;
  b;
  showDialog: boolean;
  status: number;

  public pImageThumborUrl: string;
  public reactiveForm;

  constructor(
    private fb: FormBuilder,
    public productsSandbox: ProductsSandbox,
    private router: Router,
  ) {
    this.pImageThumborUrl = environment.thumborUrl + 'unsafe/80x80/';
  }

  ngOnInit() {
    this.addProductForm = this.fb.group({
      brand: new FormControl('', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
    console.log('x');
  }

  searchProductName(e) {
    const queryParams = {
      q: e.target.value
    };
    this.a = e;
    this.productsSandbox.getProductSearch(queryParams);
    if (e.target.value === '') {
      this.checkIfLength = true;
    } else {
      this.checkIfLength = false;
    }
  }
  selectProductName(mProductId, name) {
    this.name = name;
    this.b = mProductId;
    this.productsSandbox.productAdd(mProductId[0]);
    this.router.navigate(['/products/' + mProductId]);
    // window.location.reload();

  }
  onProductNameBlur(): void {
    setTimeout(() => { this.onProductNameFocus = false; }, 200);
  }

  addProduct () {
    this.showDialog = false;
    swal({
      title: 'belisada.co.id',
      text: 'Anda yakin semua data produk baru yang anda masukkan sudah benar?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        swal(
          'Success!',
          'Terimakasih. Data Produk telah masuk ke sistem kami dan akan direview oleh tim kami.',
          'success'
        ).then(() => {
          this.productsSandbox.reqProduct(this.addProductForm.value);
          this.addProductForm.reset();
          console.log('showDialog: ', this.showDialog);
        });
      }
    });
  }

  ngOnDestroy() {
    console.log('123');
    // console.log('this.a:', this.a);
    this.productsSandbox.getProductSearch(this.a);
    this.productsSandbox.productAdd(this.b);
    this.subscriptions.forEach(sub => sub.unsubscribe());

  }
}
