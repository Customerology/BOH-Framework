import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoadingOverlayModule } from '../../shared/loading-overlay/loading-overlay.module';
import { DynamicModuleWrapperComponent } from '../dynamic-module-wrapper/dynamic-module-wrapper.component';
import { IFrameLoaderComponent } from '../i-frame-loader/i-frame-loader.component';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { RootComponent } from './root.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CategoryService } from 'src/app/core/services/category.service';
import { EnterpriseLocationService } from 'src/app/core/services/enterprise-location.service';
import { EnterpriseService } from 'src/app/core/services/enterprise.service';
import { CompaniesInformationModalComponent } from './companies-information-modal-component/companies-information-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    RouterLink,
    BrowserAnimationsModule,
    LoadingOverlayModule,
    MatMenuModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    TextFieldModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatSelectModule
  ],
  declarations: [
    RootComponent,
    SidebarComponent,
    IFrameLoaderComponent,
    DynamicModuleWrapperComponent,
    CompaniesInformationModalComponent
  ],
  providers: [
    AuthenticationService,
    SidebarService,
    EnterpriseService,
    EnterpriseLocationService,
    CategoryService,
    provideNgxMask()
  ]
})
export class RootModule {}
