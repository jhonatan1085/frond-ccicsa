export class routes {

  private static Url = '';

  public static get baseUrl(): string {
    return this.Url;
  }
  public static get changePassword2(): string {
    return this.baseUrl + '/change-password2';
  }
  public static get forgotPassword(): string {
    return this.baseUrl + '/forgot-password';
  }
  public static get lockScreen(): string {
    return this.baseUrl + '/lock-screen';
  }
  public static get login(): string {
    return this.baseUrl + '/login';
  }
  public static get register(): string {
    return this.baseUrl + '/register';
  }
  public static get addPayment(): string {
    return this.baseUrl + '/accounts/add-payment';
  }
  public static get expenses(): string {
    return this.baseUrl + '/accounts/expenses';
  }
  public static get addExpense(): string {
    return this.baseUrl + '/accounts/add-expense';
  }
  public static get editExpense(): string {
    return this.baseUrl + '/accounts/edit-expense';
  }

  public static get activities(): string {
    return this.baseUrl + '/activities';
  }
  public static get addAppointment(): string {
    return this.baseUrl + '/appointments/add-appointment';
  }
  public static get appointmentList(): string {
    return this.baseUrl + '/appointments/appointment-list';
  }
  public static get editAppointment(): string {
    return this.baseUrl + '/appointments/edit-appointment';
  }
  public static get blankPage(): string {
    return this.baseUrl + '/blank-page';
  }
  public static get chat(): string {
    return this.baseUrl + '/chat';
  }
  public static get adminDashboard(): string {
    return this.baseUrl + '/dashboard/admin-dashboard';
  }
  public static get doctorDashboard(): string {
    return this.baseUrl + '/dashboard/doctor-dashboard';
  }
  public static get patientDashboard(): string {
    return this.baseUrl + '/dashboard/patient-dashboard';
  }
  public static get allInvoice(): string {
    return this.baseUrl + '/invoice/all-invoice';
  }
  public static get invoicesCancelled(): string {
    return this.baseUrl + '/invoice/invoices-cancelled';
  }
  public static get invoicesDraft(): string {
    return this.baseUrl + '/invoice/invoices-draft';
  }
  public static get invoicesOverdue(): string {
    return this.baseUrl + '/invoice/invoices-overdue';
  }
  public static get invoicesPaid(): string {
    return this.baseUrl + '/invoice/invoices-paid';
  }
  public static get invoicesRecurring(): string {
    return this.baseUrl + '/invoice/invoices-recurring';
  }
  public static get invoicesSettings(): string {
    return this.baseUrl + '/invoice/invoices-settings';
  }
  public static get taxSettings(): string {
    return this.baseUrl + '/invoice/tax-settings';
  }
  public static get viewInvoice(): string {
    return this.baseUrl + '/invoice/view-invoice';
  }

  public static get editPatient(): string {
    return this.baseUrl + '/patient/edit-patient';
  }
  public static get patientsList(): string {
    return this.baseUrl + '/patient/patients-list';
  }
  public static get profile(): string {
    return this.baseUrl + '/profile';
  }
  public static get editProfile(): string {
    return this.baseUrl + '/edit-profile';
  }
  public static get expenseReports(): string {
    return this.baseUrl + '/reports/expense-reports';
  }
  public static get invoiceReports(): string {
    return this.baseUrl + '/reports/invoice-reports';
  }
  public static get setting(): string {
    return this.baseUrl + '/setting';
  }
  public static get settings(): string {
    return this.baseUrl + '/settings/general-settings';
  }
  public static get bankSettings(): string {
    return this.baseUrl + '/settings/bank-settings';
  }
  public static get changePassword(): string {
    return this.baseUrl + '/settings/change-password';
  }
  public static get emailSettings(): string {
    return this.baseUrl + '/settings/email-settings';
  }
  public static get localizationDetails(): string {
    return this.baseUrl + '/settings/localization-details';
  }
  public static get othersSettings(): string {
    return this.baseUrl + '/settings/others-settings';
  }
  public static get paymentSettings(): string {
    return this.baseUrl + '/settings/payment-settings';
  }
  public static get seoSettings(): string {
    return this.baseUrl + '/settings/seo-settings';
  }
  public static get socialLinks(): string {
    return this.baseUrl + '/settings/social-links';
  }
  public static get socialSettings(): string {
    return this.baseUrl + '/settings/social-settings';
  }
  public static get themeSettings(): string {
    return this.baseUrl + '/settings/theme-settings';
  }
  public static get error404(): string {
    return this.baseUrl + '/error/error404';
  }
  public static get error500(): string {
    return this.baseUrl + '/error/error500';
  }

  public static get registerRole(): string {
    return this.baseUrl + '/roles/register';
  }
  public static get listadoRole(): string {
    return this.baseUrl + '/roles/list';
  }

//jhonatan
public static get liderList(): string {
  return this.baseUrl + '/lideres/list-lideres';
}

public static get addLider(): string {
  return this.baseUrl + '/lideres/add-lider';
}

  public static get usuarioList(): string {
    return this.baseUrl + '/usuarios/list-usuario';
  }

  public static get addUsuario(): string {
    return this.baseUrl + '/usuarios/add-usuario';
  }

  public static get siteList(): string {
    return this.baseUrl + '/site/list-site';
  }

  public static get addSite(): string {
    return this.baseUrl + '/site/add-site';
  }

  public static get bitacoraList(): string {
    return this.baseUrl + '/bitacoras/list-bitacora';
  }
  
  public static get addBitacora(): string {
    return this.baseUrl + '/bitacoras/add-bitacora';
  }

  public static get cuadrillaList(): string {
    return this.baseUrl + '/cuadrilla/list-cuadrilla';
  }

  public static get unidadesMovilesList(): string {
    return this.baseUrl + '/unidades-moviles/list-unidades-moviles';
  }

}
