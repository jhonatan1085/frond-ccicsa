import { Injectable } from '@angular/core';
import { routes } from '../routes/routes';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResultFormat } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  public getDoctorsList(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/doctors-list.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getPatientsList(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/doctors-list.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getStaffList(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/staff-list.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getAppointmentList(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/appointment-list.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getStaffHoliday(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/staff-holiday.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getSchedule(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/schedule.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getInvoices(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/invoices.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getPayments(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/payments.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getExpenses(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/expenses.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getTaxes(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/taxes.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getProvidentFund(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/provident-fund.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getDepartmentList(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/department-list.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getSalary(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/salary.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getAssetsList(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/assets-list.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getExpenseReports(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/expense-reports.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getInvoiceReports(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/invoice-reports.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getAllInvoice(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/all-invoice.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getPatientDashboard(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/patient-dashboard.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getInvoicesPaid(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/invoices-paid.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getInvoicesOverdue(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/invoices-overdue.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getInvoicesDraft(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/invoices-draft.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getInvoicesCancelled(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/invoices-cancelled.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getInvoicesRecurring(): Observable<ApiResultFormat> {
    return this.http
      .get<ApiResultFormat>('assets/json/invoices-recurring.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getStaffLeave(): Observable<ApiResultFormat> {
    return this.http.get<ApiResultFormat>('assets/json/staff-leave.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public getEvents() {
    return this.http
      .get<ApiResultFormat>('assets/json/scheduleevents.json')
      .pipe(
        map((res: ApiResultFormat) => {
          return res;
        })
      );
  }
  public getDataTables() {
    return this.http.get<ApiResultFormat>('assets/json/data-tables.json').pipe(
      map((res: ApiResultFormat) => {
        return res;
      })
    );
  }
  public sideBar = [
    {
      tittle: 'Main',
      showAsTab: false,
      separateRoute: false,
      menu: [
        {
          menuValue: 'Dashboard',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'dashboard',
          route: 'dashboard',
          img: 'assets/img/icons/menu-icon-01.svg',
          subMenus: [
            {
              menuValue: 'Admin Dashboard',
              route: routes.adminDashboard,
              base: routes.adminDashboard,
              permision: '',
              show_nav: true,
            },
            {
              menuValue: 'Doctor Dashboard',
              route: routes.doctorDashboard,
              base: routes.doctorDashboard,
              permision: '',
              show_nav: true,
            },
            {
              menuValue: 'Patient Dashboard',
              route: routes.patientDashboard,
              base: routes.patientDashboard,
              permision: '',
              show_nav: true,
            },
          ],
        },
        {
          menuValue: 'Roles y Permisos',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'gallery',
          base2: 'profile',
          icon: 'fa-columns',
          faIcon: true,
          subMenus: [
            {
              menuValue: 'Registrar Rol',
              route: routes.registerRole,
              base: routes.registerRole,
              permision: 'register_rol',
              show_nav: true,
            },
            {
              menuValue: 'Listado',
              route: routes.listadoRole,
              base: routes.listadoRole,
              permision: 'list_rol',
              show_nav: true,
            },
            {
              menuValue: 'Edit Rol',
              route: '',
              base: '',
              permision: 'edit_rol',
              show_nav: false,
            },
            {
              menuValue: 'Delete Rol',
              route: '',
              base: '',
              permision: 'delete_rol',
              show_nav: false,
            },
          ],
        },
        {
          menuValue: 'Usuarios',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'staff',
          img: 'assets/img/icons/menu-icon-08.svg',
          subMenus: [
            {
              menuValue: 'Agregar Usuario',
              route: routes.addUsuario,
              base: routes.addUsuario,
              permision: 'register_user',
              show_nav: true,
            },
            {
              menuValue: 'Lista Usuarios',
              route: routes.usuarioList,
              base: routes.usuarioList,
              permision: 'list_user',
              show_nav: true,
            },
            {
              menuValue: 'Editar Usuario',
              route: '',
              base: '',
              permision: 'edit_user',
              show_nav: false,
            },
            {
              menuValue: 'Eliminar Usuario',
              route: '',
              base: '',
              permision: 'delete_user',
              show_nav: false,
            },
            // {
            //   menuValue: 'Attendance',
            //   route: routes.staffAttendance,
            //   base: routes.staffAttendance,
            // },
          ],
        },
        {
          menuValue: 'Sites',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'site',
          img: 'assets/img/icons/menu-icon-08.svg',
          subMenus: [
            {
              menuValue: 'Agregar Site',
              route: routes.addSite,
              base: routes.addSite,
              permision: 'register_site',
              show_nav: true,
            },
            {
              menuValue: 'Lista Sites',
              route: routes.siteList,
              base: routes.siteList,
              permision: 'list_site',
              show_nav: true,
            },

            {
              menuValue: 'Editar Site',
              route: '',
              base: '',
              permision: 'edit_site',
              show_nav: false,
            },
            {
              menuValue: 'Eliminar Site',
              route: '',
              base: '',
              permision: 'delete_site',
              show_nav: false,
            },
          ],
        },
        {
          menuValue: 'Bitacoras',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'bitacoras',
          img: 'assets/img/icons/menu-icon-08.svg',
          subMenus: [
            {
              menuValue: 'Lista Bitacoras',
              route: routes.bitacoraList,
              base: routes.bitacoraList,
              permision: 'list_bitacora',
              show_nav: true,
            },
            {
              menuValue: 'Agregar Bitacora',
              route: routes.addBitacora,
              base: routes.addBitacora,
              permision: 'register_bitacora',
              show_nav: true,
            },
            /*   */
            /* {
              menuValue: 'Editar Site',
              route: '',
              base: '',
              permision: 'edit_site',
              show_nav: false,
            },
            {
              menuValue: 'Eliminar Site',
              route: '',
              base: '',
              permision: 'delete_site',
              show_nav: false,
            }, */
          ],
        },
        {
          menuValue: 'Cuadrillas',
          hasSubRoute: true,
          showSubRoute: false,
          base: 'cuadrillas',
          img: 'assets/img/icons/menu-icon-08.svg',
          subMenus: [
            {
              menuValue: 'Listar Cuadrillas',
              route: routes.cuadrillaList,
              base: routes.cuadrillaList,
              permision: 'list_cuadrilla',
              show_nav: true,
            },
            /*  {
              menuValue: 'Lista Sites',
              route: routes.siteList,
              base: routes.siteList,
              permision: 'list_site',
              show_nav: true,
            }, */

            /* {
              menuValue: 'Editar Site',
              route: '',
              base: '',
              permision: 'edit_site',
              show_nav: false,
            },
            {
              menuValue: 'Eliminar Site',
              route: '',
              base: '',
              permision: 'delete_site',
              show_nav: false,
            }, */
          ],
        },

        {
          menuValue: 'Settings',
          route: routes.settings,
          hasSubRoute: false,
          showSubRoute: false,
          img: 'assets/img/icons/menu-icon-16.svg',
          base: 'settings',
          permision: 'settings',
          show_nav: true,
          subMenus: [],
        },
      ],
    },
  ];
  // public sideBarList = [

  // ];
  public carousel1 = [
    {
      quantity: '68',
      units: 'kg',
    },
    {
      quantity: '70',
      units: 'kg',
    },
    {
      quantity: '72',
      units: 'kg',
    },
    {
      quantity: '74',
      units: 'kg',
    },
    {
      quantity: '76',
      units: 'kg',
    },
  ];
  public carousel2 = [
    {
      quantity: '160',
      units: 'cm',
    },
    {
      quantity: '162',
      units: 'cm',
    },
    {
      quantity: '164',
      units: 'cm',
    },
    {
      quantity: '166',
      units: 'cm',
    },
    {
      quantity: '168',
      units: 'cm',
    },
  ];
  public socialLinks = [
    {
      icon: 'facebook',
      placeholder: 'https://www.facebook.com',
    },
    {
      icon: 'twitter',
      placeholder: 'https://www.twitter.com',
    },
    {
      icon: 'youtube',
      placeholder: 'https://www.youtube.com',
    },
    {
      icon: 'linkedin',
      placeholder: 'https://www.linkedin.com',
    },
  ];
  public upcomingAppointments = [
    {
      no: 'R00001',
      patientName: 'Andrea Lalema',
      doctor: 'Dr.Jenny Smith',
      date: '12.05.2022 at',
      time: '7.00 PM',
      disease: 'Fracture',
      img: 'assets/img/profiles/avatar-03.jpg',
    },
    {
      no: 'R00002',
      patientName: 'Cristina Groves',
      doctor: 'Dr.Angelica Ramos',
      date: '13.05.2022 at',
      time: '7.00 PM',
      disease: 'Fever',
      img: 'assets/img/profiles/avatar-05.jpg',
    },
    {
      no: 'R00003',
      patientName: 'Bernardo',
      doctor: 'Dr.Martin Doe',
      date: '14.05.2022 at',
      time: '7.00 PM',
      disease: 'Fracture',
      img: 'assets/img/profiles/avatar-04.jpg',
    },
    {
      no: 'R00004',
      patientName: 'Galaviz Lalema',
      doctor: 'Dr.Martin Doe',
      date: '15.05.2022 at',
      time: '7.00 PM',
      disease: 'Fracture',
      img: 'assets/img/profiles/avatar-03.jpg',
    },
    {
      no: 'R00005',
      patientName: 'Dr.William Jerk',
      doctor: 'Dr.Angelica Ramos',
      date: '16.05.2022 at',
      time: '7.00 PM',
      disease: 'Fever',
      img: 'assets/img/profiles/avatar-02.jpg',
    },
  ];
  public recentPatients = [
    {
      no: 'R00001',
      patientName: 'Andrea Lalema',
      age: '21',
      date: '12.05.2022 at',
      dateOfBirth: '07 January 2002',
      diagnosis: 'Heart attack',
      img: 'assets/img/profiles/avatar-02.jpg',
      triage: 'Non Urgent',
    },
    {
      no: 'R00002',
      patientName: 'Mark Hay Smith',
      age: '23',
      date: '13.05.2022 at',
      dateOfBirth: '06 January 2002',
      diagnosis: 'Jaundice',
      img: 'assets/img/profiles/avatar-03.jpg',
      triage: 'Emergency',
    },
    {
      no: 'R00003',
      patientName: 'Cristina Groves',
      age: '25',
      date: '14.05.2022 at',
      dateOfBirth: '10 January 2002',
      diagnosis: 'Malaria',
      img: 'assets/img/profiles/avatar-04.jpg',
      triage: 'Out Patient',
    },
    {
      no: 'R00004',
      patientName: 'Galaviz Lalema',
      age: '21',
      date: '15.05.2022 at',
      dateOfBirth: '09 January 2002',
      diagnosis: 'Typhoid',
      img: 'assets/img/profiles/avatar-05.jpg',
      triage: 'Urgent',
    },
  ];
  public patientProfile = [
    {
      date: '29/09/2022',
      doctor: 'Dr.Jenny Smith',
      treatment: 'Check up',
      charges: '$ 60',
    },
    {
      date: '19/09/2022',
      doctor: 'Andrea Lalema',
      treatment: '	Blood Test',
      charges: '$ 50',
    },
    {
      date: '20/09/2022',
      doctor: 'Dr.William Stephin',
      treatment: 'Blood Pressure',
      charges: '$ 30',
    },
  ];
  public blogs = [
    {
      img1: 'assets/img/blog/blog-1.jpg',
      img2: 'assets/img/profiles/avatar-01.jpg',
      heading5: 'Diabetes',
      count1: '58',
      count2: '500',
      date: '05 Sep 2022',
      heading4: 'Jenifer Robinson',
      name: 'M.B.B.S, Diabetologist',
      heading3: "Simple Changes That Lowered My Mom's Blood Pressure",
      paragraph:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      msg: 'Read more in 8 Minutes',
    },
    {
      img1: 'assets/img/blog/blog-2.jpg',
      img2: 'assets/img/profiles/avatar-02.jpg',
      heading5: 'Safety',
      count1: '18',
      count2: '5k',
      date: '05 Sep 2022',
      heading4: 'Mark hay smith',
      name: 'M.B.B.S, Neurologist',
      heading3: 'Vaccines Are Close - But Right Now We Need to Hunker Down',
      paragraph:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      msg: 'Read more in 2 Minutes',
    },
    {
      img1: 'assets/img/blog/blog-3.jpg',
      img2: 'assets/img/profiles/avatar-03.jpg',
      heading5: 'Dermotology',
      count1: '28',
      count2: '2.5k',
      date: '05 Sep 2022',
      heading4: 'Denise Stevens',
      name: 'M.B.B.S, Dermotologist',
      heading3: 'Hair Loss On One Side of Head – Causes & Treatments',
      paragraph:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      msg: 'Read more in 3 Minutes',
    },
    {
      img1: 'assets/img/blog/blog-4.jpg',
      img2: 'assets/img/profiles/avatar-05.jpg',
      heading5: 'Ophthalmology',
      count1: '48',
      count2: '600',
      date: '05 Sep 2022',
      heading4: 'Laura Williams',
      name: 'M.B.B.S, Ophthalmologist',
      heading3:
        'Eye Care Routine To Get Rid Of Under Eye Circles And Puffiness',
      paragraph:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      msg: 'Read more in 5 Minutes',
    },
    {
      img1: 'assets/img/blog/blog-5.jpg',
      img2: 'assets/img/profiles/avatar-06.jpg',
      heading5: 'Dentist',
      count1: '48',
      count2: '600',
      date: '05 Sep 2022',
      heading4: 'Linda Carpenter',
      name: 'M.B.B.S, Dentist',
      heading3: '5 Facts About Teeth Whitening You Should Know',
      paragraph:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      msg: 'Read more in 3 Minutes',
    },
    {
      img1: 'assets/img/blog/blog-6.jpg',
      img2: 'assets/img/profiles/avatar-04.jpg',
      heading5: 'Gynecologist',
      count1: '18',
      count2: '300',
      date: '05 Sep 2022',
      heading4: 'Mark hay smith',
      name: 'M.B.B.S, Gynecologist',
      heading3: 'Sciatica: Symptoms, Causes & Treatments',
      paragraph:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      msg: 'Read more in 10 Minutes',
    },
  ];
  public invoicesGrid = [
    {
      invoiceNumber: 'IN093439#@09',
      name: 'Barbara Moore',
      img: 'assets/img/profiles/avatar-04.jpg',
      amount: 'Amount',
      amounts: '$1,54,220',
      text: 'Due Date',
      dueDate: '23 Mar 2022',
      status: 'Paid',
    },
    {
      invoiceNumber: 'IN093439#@10',
      name: 'Karlene Chaidez',
      img: 'assets/img/profiles/avatar-06.jpg',
      amount: 'Amount',
      amounts: '$1,222',
      text: 'Due Date',
      dueDate: '18 Mar 2022',
      status: 'Overdue',
      overDue: 'Overdue 14 days',
    },
    {
      invoiceNumber: 'IN093439#@11',
      name: 'Russell Copeland',
      img: 'assets/img/profiles/avatar-08.jpg',
      amount: 'Amount',
      amounts: '$3,470',
      text: 'Due Date',
      dueDate: '10 Mar 2022',
      status: 'Cancelled',
    },
    {
      invoiceNumber: 'IN093439#@12',
      name: 'Joseph Collins',
      img: 'assets/img/profiles/avatar-10.jpg',
      amount: 'Amount',
      amounts: '$8,265',
      text: 'Due Date',
      dueDate: '30 Mar 2022',
      status: 'Sent',
    },
    {
      invoiceNumber: 'IN093439#@13',
      name: 'Jennifer Floyd',
      img: 'assets/img/profiles/avatar-11.jpg',
      amount: 'Amount',
      amounts: '$5,200',
      text: 'Due Date',
      dueDate: '20 Mar 2022',
      status: 'Cancelled',
    },
    {
      invoiceNumber: 'IN093439#@14',
      name: 'Leatha Bailey',
      img: 'assets/img/profiles/avatar-09.jpg',
      amount: 'Amount',
      amounts: '$480',
      text: 'Due Date',
      dueDate: '15 Mar 2022',
      status: 'Sent',
    },
    {
      invoiceNumber: 'IN093439#@15',
      name: 'Alex Campbell',
      img: 'assets/img/profiles/avatar-12.jpg',
      amount: 'Amount',
      amounts: '$1,999',
      text: 'Due Date',
      dueDate: '08 Mar 2022',
      status: 'Overdue',
      overDue: 'Overdue 10 days',
    },
    {
      invoiceNumber: 'IN093439#@16',
      name: 'Marie Canales',
      img: 'assets/img/profiles/avatar-03.jpg',
      amount: 'Amount',
      amounts: '$2,700',
      text: 'Due Date',
      dueDate: '18 Mar 2022',
      status: 'Paid',
    },
  ];
}
