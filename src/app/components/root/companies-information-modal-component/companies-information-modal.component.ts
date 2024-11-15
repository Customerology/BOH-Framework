import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenu, MatMenuPanel } from '@angular/material/menu';
import { EnterpriseModel } from '../../../core/models';
import { CategoryModel } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-companies-information-modal',
  templateUrl: './companies-information-modal.component.html',
  styleUrls: ['./companies-information-modal.component.scss'],
  exportAs: 'menuInOtherComponent'
})
export class CompaniesInformationModalComponent implements OnInit, OnChanges {
  @Input() enterprise?: EnterpriseModel;
  @ViewChild(MatMenu, { static: true }) menu!: MatMenuPanel;
  public formGroup!: FormGroup;
  public editMode = false;
  public companyLogoImageUrl!: string;
  public companyBannerImageUrl!: string;
  public categoriesList!: CategoryModel[];

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.getPageData();
    this.createForm();
  }

  ngOnChanges() {
    if (this.enterprise?.id) {
      this.companyLogoImageUrl = this.enterprise?.corpBranding?.images[0]
        ? this.enterprise?.corpBranding?.images[0].imageUrl
        : '';
      this.companyBannerImageUrl = this.enterprise?.corpBranding?.images[1]
        ? this.enterprise?.corpBranding?.images[1].imageUrl
        : '';

      if (this.enterprise?.jsonstreetaddress?.length > 0) {
        this.formGroup.controls['address'].patchValue(
          this.enterprise?.jsonstreetaddress[0].street ?? ''
        );
      }

      if (this.enterprise?.jsonPhoneNumbers?.length > 0) {
        this.formGroup.controls['phoneNumber'].patchValue(
          this.enterprise?.jsonPhoneNumbers[0].phoneNumber ?? ''
        );
      }

      if (this.enterprise?.emails?.length > 0) {
        this.formGroup.controls['email'].patchValue(
          this.enterprise?.emails[0].email ?? ''
        );
      }

      if (this.enterprise?.category_Ids.length > 0) {
        this.formGroup.controls['category'].patchValue(
          this.enterprise.category_Ids
        );
        this.formGroup.controls['category'].disable();
      }

      this.formGroup.controls['websites'].patchValue(
        this.enterprise?.website ? this.enterprise.website : ''
      );
    }
  }

  private getPageData(): void {
    this.categoryService.getCategoriesList().subscribe((res) => {
      this.categoriesList = res;
    });
  }

  private createForm(): void {
    this.formGroup = this.formBuilder.group({
      address: [null],
      phoneNumber: [null],
      email: [null],
      category: [null],
      websites: [null],
      facebookUrl: [null],
      instagramUrl: [null]
    });
  }

  public toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  public saveForm(): void {
    this.editMode = false;
  }
}
