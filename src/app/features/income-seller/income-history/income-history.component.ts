import { Component, OnInit } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { ContentData } from '@belisada-seller/core/models';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DateFormatEnum } from '@belisada-seller/core/enum';
import { IncomeServiceService } from '@belisada-seller/core/services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DateUtil } from '@belisada-seller/core/util';
import swal from 'sweetalert2';
import { LoadingService } from '@belisada-seller/core/services/global/loading.service';
@Component({
  selector: 'bss-income-history',
  templateUrl: './income-history.component.html',
  styleUrls: ['./income-history.component.scss']
})
export class IncomeHistoryComponent implements OnInit {
  now: Date = new Date();
  defaultDateFormat: DateFormatEnum = DateFormatEnum.DDMMYYYY_WITH_SLASH;
  names: any;
  lastPage: number;
  currentPage: number;
  public fGroup: FormGroup;
  pages: any = [];
  myForm: FormGroup;
  getData: ContentData[];
  getTotal: any;
  invNum: any;
  invNumPart2: any = [];
  selectedAll: any;
  xx: false;

  btn_withrawal: Boolean = false;

  totalTransfer: any = [];
  myDatePickerOptions: IMyDpOptions = {
    // other options... https://github.com/kekeh/mydatepicker#options-attribute
    dateFormat: this.defaultDateFormat,
    todayBtnTxt: 'Today',
    editableDateField: false,
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    inline: false,
    maxYear: this.now.getFullYear() - 12,
    minYear: this.now.getFullYear() - 90,
    disableSince: {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate() + 1
    }
  };

  constructor(private incomeS: IncomeServiceService, private router: Router,
    private fb: FormBuilder,
    private dateUtil: DateUtil,
    private loadingService: LoadingService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.form();
    this.newMethod();
  }
  private newMethod() {
    this.loadingService.show();
    this.incomeS.getTotal().subscribe(res => {
      this.getTotal = res.data;
    });
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.pages = [];
      this.currentPage = (params['page'] === undefined) ? 1 : +params['page'];
      const queryParams = {
        page: this.currentPage,
        itemperpage: 10,
        history: 'Y'
      };
      this.incomeS.getIncomeWithDate(queryParams).subscribe(response => {
        this.loadingService.hide();
        this.getData = response.content;
        this.lastPage = response.totalPages;
        for (let r = (this.currentPage - 3); r < (this.currentPage - (-4)); r++) {
          if (r > 0 && r <= this.lastPage) {
            this.pages.push(r);
          }
        }
        for (let i = 0; i < this.getData.length; i++) {
          this.getData[i].selected = this.xx;
        }
      });
    });
  }

  private form() {
    this.myForm = this.fb.group({
      useremail: this.fb.array([], Validators.required),
      tulisan: new FormControl,
    });
    this.fGroup = this.fb.group({
      date1: new FormControl(null, Validators.required),
      date2: new FormControl(null, Validators.required),
    });
  }
  setPage(page: number, increment?: number) {
    if (increment) { page = +page + increment; }
    if (page < 1 || page > this.lastPage) { return false; }
    // tslint:disable-next-line:max-line-length
    this.router.navigate(['/Income'], { queryParams: {page: page}, queryParamsHandling: 'merge' });
    window.scrollTo(0, 0);
  }


  selectAll() {
    for (let i = 0; i < this.getData.length; i++) {
      if (this.getData[i].statusWithdrawCode === '221') {
        if (this.invNumPart2.indexOf(this.getData[i].invoiceNumber) !== -1) {
        } else {
          this.invNumPart2.push(this.getData[i].invoiceNumber);
        }

        this.getData[i].selected = true;

        if (this.invNumPart2.length >= 1) {
          this.btn_withrawal = true;
        } else {
          this.btn_withrawal = false;
        }
      }
    }
  }

  onChange(item: any, isChecked: boolean) {

    if (isChecked === true) {

      this.invNumPart2.push(item.invoiceNumber);
      item.selected = true;
    } else {
      this.invNumPart2.splice(item.invoiceNumber, 1);
        item.selected = false;
    }

    if (this.invNumPart2.length >= 1) {
      this.btn_withrawal = true;
    } else {
      this.btn_withrawal = false;
    }

    // for (let i = 0; i < this.getData.length; i++) {
    //   this.getData[i].selected = true;
    //   this.invNumPart2.push(this.getData[i].invoiceNumber);
    //   console.log(  this.invNumPart2);
    // }


    // console.log('pilih', email, isChecked );

    // const emailFormArray = < FormArray > this.myForm.controls.useremail;
    // console.log('apa ini', emailFormArray);
    // if (isChecked) {
    //     emailFormArray.push(new FormControl(email));
    // this.invNum = email;

    // } else {
    //   const index = emailFormArray.controls.findIndex(x => x.value == email);
    //   emailFormArray.removeAt(index);

    // }
  }

  asd(e) {
    console.log('asdasd', e);
  }

  testing() {
    // console.log(editProfileRequest);
    if (this.fGroup.valid) {
      const model = this.fGroup.value;
      const editProfileRequest: ContentData = new ContentData();
      const datestart = editProfileRequest.datestart =
      this.dateUtil.formatMyDate(this.fGroup.controls['date1'].value.date, this.defaultDateFormat);
      const dateend =  editProfileRequest.dateend =
      this.dateUtil.formatMyDate(this.fGroup.controls['date2'].value.date, this.defaultDateFormat);
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.pages = [];
        this.currentPage = (params['page'] === undefined) ? 1 : +params['page'];
        const queryParams = {
          page: this.currentPage,
          itemperpage: 10,
          datestart: datestart,
          dateend: dateend
        };
        this.incomeS.getIncomeWithDate(queryParams).subscribe(response => {
          this.getData = response.content;
          });
      });
    } else {
      console.log('b');
    }

  }

  tarikDana() {

    this.totalTransfer = [];
    for (let i = 0; i < this.invNumPart2.length; i++) {
      const index = this.getData.findIndex(x => x.invoiceNumber === this.invNumPart2[i]);
      this.totalTransfer.push(this.getData[index].grandTotal);
    }

    const valTotalTransfer = this.totalTransfer.reduce((sum, item) => sum + item, 0);

    if (valTotalTransfer <= 50000) {
      swal('Alert', 'Maaf minimal tarik dana Rp.50.000', 'error');
    } else if (this.invNumPart2.length === 0) {
      swal('Alert', 'Anda belum memilih saldo yang akan ditarik', 'error');
    } else {

      swal({
        title: 'Alert',
        text: 'Apakah Anda yakin akan melakukan penarikan dana',
        type: 'info',
        showCancelButton: true,
      }).then((result) => {
        if (result.value === true) {
            const a = {
            invoiceNumber: this.invNumPart2
          };

          const queryParams = {
            page: this.currentPage,
            itemperpage: 10,
          };
          this.incomeS.postIncome(a).subscribe(response => {

            if (response.status === 3) {
              swal('Gagal', 'Silakan isi rekening bank Anda terlebih dulu pada halaman profile', 'error');
            } else if (response.status === 4) {
              swal('Gagal', 'Maaf minimal tarik dana Rp.50.000', 'error');
            } else {
              this.incomeS.getIncomeWithDate(queryParams).subscribe(x => {
                this.getData = x.content;
                });
            }

          });
          console.log('invNumPart2', this.invNumPart2);
        }






          // if ( this.myForm.valid ) {
          //   const a = {
          //     invoiceNumber: this.myForm.get('useremail').value,
          //   };

          //   const queryParams = {
          //     page: this.currentPage,
          //     itemperpage: 10,
          //   };
          //   this.incomeS.postIncome(a).subscribe(response => {
          //     this.incomeS.getIncomeWithDate(queryParams).subscribe(x => {
          //       this.getData = x.content;
          //       });
          //   });

          // } else {


          // }

        });
      }

    }
}
