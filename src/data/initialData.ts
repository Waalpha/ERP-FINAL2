import {
  Tenant,
  AppUser,
  Student,
  StaffMember,
  ClassStream,
  CBCSubject,
  AssessmentRecord,
  FeeStructureItem,
  FeePayment,
  FeeInvoice,
  AttendanceRecord,
  TimetableSlot,
  Assignment,
  DisciplineIncident,
  SchoolCalendarEvent,
  NotificationBroadcast,
  AuditLog,
  CollegeDepartment,
  CollegeCourse,
  CollegeStudent,
  LibraryBook,
  HostelRoom,
  RetailProduct,
  RetailSale,
  RetailSupplier,
  RetailCustomer,
  HospitalPatient,
  MedicalConsultation,
  PharmacyItem,
  TheologyProgram,
  TheologyUnit,
  TheologyStudent,
  MinistryPracticumLog,
  TheologyLibraryResource,
  CollegeFeeStructureItem,
  CollegeInvoice,
  CollegePayment,
  TheologyFeePayment,
  TheologyInvoice,
  HospitalBillingInvoice,
  HospitalBillingPayment,
  HospitalServiceTariff,
  RetailCustomerInvoice,
  RetailCustomerPayment
} from '../types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-st-austins',
    name: "St. Austin's Academy & Junior School",
    code: 'STA-SCH',
    subdomain: 'staustins',
    customDomain: 'portal.staustins.ac.ke',
    dnsStatus: 'CONFIGURED',
    type: 'PRIMARY_SCHOOL',
    status: 'ACTIVE',
    createdAt: '2024-01-10T08:00:00.000Z',
    plan: 'ENTERPRISE',
    modules: [
      'STUDENTS',
      'STAFF',
      'CLASSES',
      'CBC_ACADEMICS',
      'ASSESSMENTS',
      'FEES_FINANCE',
      'ATTENDANCE',
      'TIMETABLE',
      'ASSIGNMENTS',
      'DISCIPLINE',
      'PROMOTIONS',
      'CALENDAR',
      'SMS_NOTIFICATIONS',
      'REPORTS'
    ],
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
    motto: 'Excellence in Character, Leadership & CBC Competence',
    contactEmail: 'info@staustins.ac.ke',
    phone: '+254 712 345 678',
    address: 'Rhapta Road, Westlands, Nairobi, Kenya',
    country: 'Kenya',
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    stats: {
      studentCount: 480,
      staffCount: 38,
      totalFeeCollected: 8450000,
      totalFeeBalance: 1240000
    }
  },
  {
    id: 'tenant-injiri-nyeri',
    name: 'Injiri Centre Nyeri',
    code: 'INJIRI-THEO',
    subdomain: 'injiricentr enyeri',
    customDomain: 'theology.injiricentre.ac.ke',
    dnsStatus: 'CONFIGURED',
    type: 'THEOLOGICAL',
    status: 'ACTIVE',
    createdAt: '2024-01-10T08:00:00.000Z',
    plan: 'ENTERPRISE',
    modules: [
      'STUDENTS',
      'THEOLOGY',
      'FEES_FINANCE',
      'LIBRARY',
      'STAFF',
      'REPORTS',
      'SMS_NOTIFICATIONS'
    ],
    logoUrl: 'https://images.unsplash.com/photo-1548625361-195feee10fce?w=160&auto=format&fit=crop&q=80',
    motto: 'Advancing Word, Truth and Biblical Ministry in Mount Kenya Region',
    contactEmail: 'admissions@injiricentre.ac.ke',
    phone: '+254 712 345 678',
    address: 'Kiganjo Road, Nyeri Town, Nyeri County, Kenya',
    country: 'Kenya',
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025/2026',
    primaryColor: '#d97706',
    secondaryColor: '#4f46e5',
    stats: {
      studentCount: 180,
      staffCount: 14,
      totalFeeCollected: 5400000,
      totalFeeBalance: 720000
    }
  },
  {
    id: 'tenant-berea-theology',
    name: "St. Paul's Theological College & Divinity Seminary",
    code: 'SPT-THEO',
    subdomain: 'stpaulstheo',
    customDomain: 'portal.stpaulstheo.ac.ke',
    dnsStatus: 'CONFIGURED',
    type: 'THEOLOGICAL',
    status: 'ACTIVE',
    createdAt: '2024-02-20T08:30:00.000Z',
    plan: 'ENTERPRISE',
    modules: [
      'STUDENTS',
      'THEOLOGY',
      'COURSES',
      'DEPARTMENTS',
      'FEES_FINANCE',
      'LIBRARY',
      'HOSTEL',
      'STAFF',
      'REPORTS',
      'SMS_NOTIFICATIONS'
    ],
    logoUrl: 'https://images.unsplash.com/photo-1548625361-195feee10fce?w=160&auto=format&fit=crop&q=80',
    motto: 'Equipping Faithful Servants of Christ in Truth, Grace & Ministry Competence',
    contactEmail: 'admissions@stpaulstheo.ac.ke',
    phone: '+254 720 123 789',
    address: 'Seminary Hill, Limuru Road, Kiambu / Nairobi, Kenya',
    country: 'Kenya',
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    primaryColor: '#d97706',
    secondaryColor: '#4f46e5',
    stats: {
      studentCount: 340,
      staffCount: 28,
      totalFeeCollected: 11800000,
      totalFeeBalance: 1850000
    }
  },
  {
    id: 'tenant-highlands-prep',
    name: 'Highlands Premier CBC School',
    code: 'HPS-SCH',
    subdomain: 'highlands',
    dnsStatus: 'CONFIGURED',
    type: 'PRIMARY_SCHOOL',
    status: 'ACTIVE',
    createdAt: '2024-03-15T09:30:00.000Z',
    plan: 'PREMIUM',
    modules: [
      'STUDENTS',
      'STAFF',
      'CLASSES',
      'CBC_ACADEMICS',
      'ASSESSMENTS',
      'FEES_FINANCE',
      'ATTENDANCE',
      'CALENDAR',
      'REPORTS'
    ],
    logoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=160&auto=format&fit=crop&q=80',
    motto: 'Nurturing Future Innovators',
    contactEmail: 'admissions@highlands.ac.ke',
    phone: '+254 722 890 123',
    address: 'Kiganjo Road, Thika, Kenya',
    country: 'Kenya',
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    stats: {
      studentCount: 320,
      staffCount: 24,
      totalFeeCollected: 5120000,
      totalFeeBalance: 860000
    }
  },
  {
    id: 'tenant-greenvale-hospital',
    name: 'Greenvale Medical & Maternity Hospital',
    code: 'GMH-MED',
    subdomain: 'greenvale',
    dnsStatus: 'CONFIGURED',
    type: 'HOSPITAL',
    status: 'ACTIVE',
    createdAt: '2024-05-01T10:00:00.000Z',
    plan: 'ENTERPRISE',
    modules: ['PATIENTS', 'APPOINTMENTS', 'PHARMACY', 'BILLING', 'STAFF', 'REPORTS'],
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    contactEmail: 'desk@greenvalehospital.org',
    phone: '+254 700 111 222',
    address: 'Milimani, Kisumu, Kenya',
    stats: {
      studentCount: 180,
      staffCount: 22,
      totalFeeCollected: 3800000,
      totalFeeBalance: 420000
    }
  },
  {
    id: 'tenant-apex-retail',
    name: 'Apex Wholesale & Distribution Hub',
    code: 'AWD-BIZ',
    subdomain: 'apex',
    dnsStatus: 'CONFIGURED',
    type: 'RETAIL',
    status: 'ACTIVE',
    createdAt: '2024-08-12T14:20:00.000Z',
    plan: 'PREMIUM',
    modules: ['INVENTORY', 'SALES', 'POS', 'SUPPLIERS', 'FINANCE', 'CUSTOMERS', 'REPORTS'],
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    contactEmail: 'sales@apexwholesale.co.ke',
    phone: '+254 733 444 555',
    address: 'Industrial Area, Mombasa, Kenya',
    stats: {
      studentCount: 85,
      staffCount: 14,
      totalFeeCollected: 6450000,
      totalFeeBalance: 580000
    }
  },
  {
    id: 'tenant-bitc',
    name: 'Breakthrough Institute of Technology & Commercial Studies (BITC)',
    code: 'BITC-COL',
    subdomain: 'bitc',
    customDomain: 'portal.bitc.ac.ke',
    dnsStatus: 'CONFIGURED',
    type: 'COLLEGE',
    status: 'ACTIVE',
    createdAt: '2024-06-01T08:00:00.000Z',
    plan: 'ENTERPRISE',
    modules: ['STUDENTS', 'COURSES', 'DEPARTMENTS', 'FEES', 'LIBRARY', 'HOSTEL', 'STAFF', 'REPORTS'],
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    motto: 'Empowering Technical Innovation and Professional Excellence',
    contactEmail: 'admissions@bitc.ac.ke',
    phone: '+254 711 000 222',
    address: 'Commercial Avenue, Nairobi CBD, Kenya',
    logoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=160&auto=format&fit=crop&q=80',
    stats: {
      studentCount: 420,
      staffCount: 32,
      totalFeeCollected: 9600000,
      totalFeeBalance: 1450000
    }
  },
  {
    id: 'tenant-st-marys',
    name: "St. Mary's Academy & Senior High",
    code: 'STM-SCH',
    subdomain: 'stmarys',
    customDomain: 'portal.stmarys.ac.ke',
    dnsStatus: 'CONFIGURED',
    type: 'PRIMARY_SCHOOL',
    status: 'ACTIVE',
    createdAt: '2024-03-01T08:00:00.000Z',
    plan: 'PREMIUM',
    modules: [
      'STUDENTS',
      'STAFF',
      'CLASSES',
      'CBC_ACADEMICS',
      'ASSESSMENTS',
      'FEES_FINANCE',
      'ATTENDANCE',
      'TIMETABLE',
      'ASSIGNMENTS',
      'CALENDAR',
      'SMS_NOTIFICATIONS',
      'REPORTS'
    ],
    currency: 'KES',
    currentTerm: 'TERM_1',
    currentAcademicYear: '2025',
    motto: 'Knowledge, Discipline and Truth',
    contactEmail: 'info@stmarys.ac.ke',
    phone: '+254 722 333 444',
    address: 'James Gichuru Road, Lavington, Nairobi, Kenya',
    logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
    stats: {
      studentCount: 390,
      staffCount: 30,
      totalFeeCollected: 7200000,
      totalFeeBalance: 980000
    }
  }
];

export const INITIAL_USERS: AppUser[] = [
  {
    uid: 'user-bitc-principal',
    email: 'principal@bitc.ac.ke',
    displayName: 'Eng. Patrick Karanja (Director / Principal)',
    tenantId: 'tenant-bitc',
    tenantName: 'BITC College',
    role: 'TENANT_ADMIN',
    isActive: true,
    phone: '+254 711 000 201',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-stmarys-principal',
    email: 'principal@stmarys.ac.ke',
    displayName: 'Sr. Mary Christine Nduta (Head of School)',
    tenantId: 'tenant-st-marys',
    tenantName: "St. Mary's Academy",
    role: 'TENANT_ADMIN',
    isActive: true,
    phone: '+254 722 333 401',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-injiri-dean',
    email: 'principal@injiricentre.ac.ke',
    displayName: 'Rev. Dr. Samuel Kariuki, Ph.D (Principal & Dean)',
    tenantId: 'tenant-injiri-nyeri',
    tenantName: 'Injiri Centre Nyeri',
    role: 'TENANT_ADMIN',
    isActive: true,
    phone: '+254 712 345 601',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-injiri-registrar',
    email: 'registrar@injiricentre.ac.ke',
    displayName: 'Dr. Elizabeth Wanjiru (Academic Registrar & OT)',
    tenantId: 'tenant-injiri-nyeri',
    tenantName: 'Injiri Centre Nyeri',
    role: 'MANAGER',
    isActive: true,
    phone: '+254 712 345 602',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-theology-dean',
    email: 'dean.mutua@stpaulstheo.ac.ke',
    displayName: 'Rev. Dr. Samuel Mutua, Th.D (Dean of Theology)',
    tenantId: 'tenant-berea-theology',
    tenantName: "St. Paul's Theological Seminary",
    role: 'TENANT_ADMIN',
    isActive: true,
    phone: '+254 720 123 701',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-theology-registrar',
    email: 'registrar@stpaulstheo.ac.ke',
    displayName: 'Pastor Deborah Chebet (Academic Registrar)',
    tenantId: 'tenant-berea-theology',
    tenantName: "St. Paul's Theological Seminary",
    role: 'MANAGER',
    isActive: true,
    phone: '+254 720 123 702',
    photoURL: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-superadmin-01',
    email: 'superadmin@davetech.io',
    displayName: 'David K. Maina (Davetech Super Admin)',
    tenantId: 'davetech-main-platform',
    tenantName: 'DAVETECH Main Platform (HQ)',
    role: 'SUPER_ADMIN',
    isActive: true,
    phone: '+254 700 000 001',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-principal-02',
    email: 'sarah.wanjiru@staustins.ac.ke',
    displayName: 'Sarah Wanjiru (Principal)',
    tenantId: 'tenant-st-austins',
    tenantName: "St. Austin's Academy",
    role: 'TENANT_ADMIN',
    isActive: true,
    phone: '+254 712 345 601',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-college-dean',
    email: 'dean.odhiambo@kcacollege.ac.ke',
    displayName: 'Prof. Dennis Odhiambo (Academic Dean)',
    tenantId: 'tenant-kca-college',
    tenantName: 'KCA Metropolitan College',
    role: 'TENANT_ADMIN',
    isActive: true,
    phone: '+254 700 888 901',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-retail-manager',
    email: 'manager.hassan@apexwholesale.co.ke',
    displayName: 'Hassan Noor (Retail & POS Manager)',
    tenantId: 'tenant-apex-retail',
    tenantName: 'Apex Wholesale Hub',
    role: 'MANAGER',
    isActive: true,
    phone: '+254 733 444 501',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-hospital-admin',
    email: 'dr.wanjiku@greenvalehospital.org',
    displayName: 'Dr. Evelyn Wanjiku (Medical Director)',
    tenantId: 'tenant-greenvale-hospital',
    tenantName: 'Greenvale Medical Hospital',
    role: 'TENANT_ADMIN',
    isActive: true,
    phone: '+254 700 111 201',
    photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-bursar-03',
    email: 'grace.mwangi@staustins.ac.ke',
    displayName: 'Grace Mwangi (Senior Bursar)',
    tenantId: 'tenant-st-austins',
    tenantName: "St. Austin's Academy",
    role: 'ACCOUNTANT',
    isActive: true,
    phone: '+254 712 345 602',
    photoURL: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-head-teacher-04',
    email: 'james.otieno@staustins.ac.ke',
    displayName: 'James Otieno (Lead CBC Coordinator)',
    tenantId: 'tenant-st-austins',
    tenantName: "St. Austin's Academy",
    role: 'TEACHER',
    isActive: true,
    phone: '+254 712 345 603',
    assignedClasses: ['Grade 4 Alpha', 'Grade 7 Alpha'],
    assignedSubjects: ['Science and Technology', 'Mathematical Activities'],
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    uid: 'user-cashier-06',
    email: 'ann.kerubo@staustins.ac.ke',
    displayName: 'Ann Kerubo (Accounts Cashier)',
    tenantId: 'tenant-st-austins',
    tenantName: "St. Austin's Academy",
    role: 'CASHIER',
    isActive: true,
    phone: '+254 712 345 605',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_STUDENTS: Record<string, Student[]> = {
  'tenant-st-austins': [
    {
      id: 'stud-001',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-001',
      firstName: 'Ethan',
      middleName: 'Mwenda',
      lastName: 'Mutuma',
      gender: 'Male',
      dob: '2016-04-14',
      grade: 'Grade 4',
      stream: 'Alpha',
      admissionDate: '2024-01-08',
      birthCertNo: 'BC-8891024',
      photoUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=120&auto=format&fit=crop&q=80',
      bloodGroup: 'O+',
      medicalNotes: 'Mild asthma, carries inhaler for physical sports',
      parentName: 'David Mutuma Mwenda',
      parentRelationship: 'Father',
      parentPhone: '+254 721 998 877',
      parentEmail: 'd.mutuma@gmail.com',
      parentOccupation: 'Software Architect',
      residentialAddress: 'Lavington Green Estate, House 14B, Nairobi',
      emergencyContactName: 'Catherine Mutuma (Mother)',
      emergencyContactPhone: '+254 722 443 322',
      status: 'ACTIVE',
      feeBalance: 0,
      totalBilled: 75000,
      totalPaid: 75000,
      createdAt: '2024-01-08T08:00:00.000Z'
    },
    {
      id: 'stud-002',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-002',
      firstName: 'Zuri',
      middleName: 'Nyambura',
      lastName: 'Kariuki',
      gender: 'Female',
      dob: '2016-09-22',
      grade: 'Grade 4',
      stream: 'Alpha',
      admissionDate: '2024-01-08',
      birthCertNo: 'BC-7721908',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      bloodGroup: 'A+',
      parentName: 'Dr. Faith Kariuki',
      parentRelationship: 'Mother',
      parentPhone: '+254 733 112 233',
      parentEmail: 'faith.k@nairobihospital.org',
      parentOccupation: 'Cardiologist',
      residentialAddress: 'Riverside Drive, Court 3, Apt 8',
      emergencyContactName: 'Kenneth Kariuki',
      emergencyContactPhone: '+254 733 445 566',
      status: 'ACTIVE',
      feeBalance: 15000,
      totalBilled: 75000,
      totalPaid: 60000,
      createdAt: '2024-01-08T08:15:00.000Z'
    },
    {
      id: 'stud-003',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-003',
      firstName: 'Liam',
      middleName: 'Kiprono',
      lastName: 'Cheruiyot',
      gender: 'Male',
      dob: '2019-02-10',
      grade: 'Grade 1',
      stream: 'Alpha',
      admissionDate: '2024-01-09',
      birthCertNo: 'BC-9912831',
      photoUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=120&auto=format&fit=crop&q=80',
      bloodGroup: 'B+',
      parentName: 'Vincent Cheruiyot',
      parentRelationship: 'Father',
      parentPhone: '+254 720 554 433',
      parentEmail: 'vincent.cheruiyot@kengen.co.ke',
      parentOccupation: 'Power Engineer',
      residentialAddress: 'Kilimani, Ring Road Court 5',
      status: 'ACTIVE',
      feeBalance: 0,
      totalBilled: 68000,
      totalPaid: 68000,
      createdAt: '2024-01-09T09:00:00.000Z'
    },
    {
      id: 'stud-004',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-004',
      firstName: 'Amani',
      middleName: 'Wairimu',
      lastName: 'Njoroge',
      gender: 'Female',
      dob: '2021-06-18',
      grade: 'PP1',
      stream: 'Blue',
      admissionDate: '2024-01-10',
      birthCertNo: 'BC-1029384',
      parentName: 'Mercy Njoroge',
      parentRelationship: 'Mother',
      parentPhone: '+254 711 778 899',
      parentEmail: 'mercy.njoroge@safaricom.co.ke',
      parentOccupation: 'Marketing Executive',
      residentialAddress: 'Kileleshwa, Siaya Park #12',
      status: 'ACTIVE',
      feeBalance: 22000,
      totalBilled: 55000,
      totalPaid: 33000,
      createdAt: '2024-01-10T10:00:00.000Z'
    },
    {
      id: 'stud-005',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-005',
      firstName: 'Jayden',
      middleName: 'Omondi',
      lastName: 'Odhiambo',
      gender: 'Male',
      dob: '2013-11-05',
      grade: 'Grade 7',
      stream: 'Alpha (Junior School)',
      admissionDate: '2024-01-12',
      birthCertNo: 'BC-6638291',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      parentName: 'Prof. Lucas Odhiambo',
      parentRelationship: 'Father',
      parentPhone: '+254 722 990 011',
      parentEmail: 'lodhiambo@uonbi.ac.ke',
      parentOccupation: 'University Professor',
      residentialAddress: 'Westlands, Brookside Drive #4',
      status: 'ACTIVE',
      feeBalance: 0,
      totalBilled: 88000,
      totalPaid: 88000,
      createdAt: '2024-01-12T11:30:00.000Z'
    },
    {
      id: 'stud-006',
      tenantId: 'tenant-st-austins',
      admissionNo: 'STA-2024-006',
      firstName: 'Gabriella',
      middleName: 'Chebet',
      lastName: 'Koech',
      gender: 'Female',
      dob: '2015-08-30',
      grade: 'Grade 5',
      stream: 'Alpha',
      admissionDate: '2024-01-15',
      parentName: 'Gladys Koech',
      parentRelationship: 'Mother',
      parentPhone: '+254 723 445 566',
      parentEmail: 'gladys.koech@equity.co.ke',
      residentialAddress: 'Westlands, Church Road Court',
      status: 'ACTIVE',
      feeBalance: 35000,
      totalBilled: 78000,
      totalPaid: 43000,
      createdAt: '2024-01-15T09:20:00.000Z'
    }
  ],
  'tenant-highlands-prep': [
    {
      id: 'stud-h01',
      tenantId: 'tenant-highlands-prep',
      admissionNo: 'HPS-2024-001',
      firstName: 'Brian',
      lastName: 'Kamau',
      gender: 'Male',
      dob: '2016-05-12',
      grade: 'Grade 4',
      stream: 'Gold',
      admissionDate: '2024-01-10',
      parentName: 'Samuel Kamau',
      parentRelationship: 'Father',
      parentPhone: '+254 722 334 455',
      residentialAddress: 'Thika Greens Estate',
      status: 'ACTIVE',
      feeBalance: 12000,
      totalBilled: 50000,
      totalPaid: 38000,
      createdAt: '2024-01-10T10:00:00.000Z'
    }
  ],
  'tenant-st-marys': [
    {
      id: 'stud-stm-01',
      tenantId: 'tenant-st-marys',
      admissionNo: 'STM-2024-0101',
      firstName: 'Alvin',
      middleName: 'Kiplagat',
      lastName: 'Korir',
      gender: 'Male',
      dob: '2016-03-15',
      grade: 'Grade 4',
      stream: 'Red',
      admissionDate: '2024-01-08',
      birthCertNo: 'BC-9928172',
      parentName: 'David Korir',
      parentRelationship: 'Father',
      parentPhone: '+254 722 111 222',
      parentEmail: 'dkorir@gmail.com',
      parentOccupation: 'Accountant',
      residentialAddress: 'Lavington, Nairobi',
      status: 'ACTIVE',
      feeBalance: 0,
      totalBilled: 72000,
      totalPaid: 72000,
      createdAt: '2024-01-08T08:00:00.000Z'
    },
    {
      id: 'stud-stm-02',
      tenantId: 'tenant-st-marys',
      admissionNo: 'STM-2024-0102',
      firstName: 'Stacy',
      middleName: 'Muthoni',
      lastName: 'Waweru',
      gender: 'Female',
      dob: '2015-07-20',
      grade: 'Grade 5',
      stream: 'Blue',
      admissionDate: '2024-01-08',
      birthCertNo: 'BC-8819203',
      parentName: 'Jane Waweru',
      parentRelationship: 'Mother',
      parentPhone: '+254 733 222 333',
      parentEmail: 'jwaweru@gmail.com',
      parentOccupation: 'Business Executive',
      residentialAddress: 'Kileleshwa, Nairobi',
      status: 'ACTIVE',
      feeBalance: 18000,
      totalBilled: 76000,
      totalPaid: 58000,
      createdAt: '2024-01-08T08:30:00.000Z'
    }
  ]
};

export const INITIAL_STAFF: Record<string, StaffMember[]> = {
  'tenant-st-austins': [
    {
      id: 'staff-01',
      tenantId: 'tenant-st-austins',
      employeeNo: 'EMP-STA-001',
      fullName: 'Sarah Wanjiru',
      email: 'sarah.wanjiru@staustins.ac.ke',
      phone: '+254 712 345 601',
      role: 'TENANT_ADMIN',
      designation: 'School Principal & Academic Director',
      subjectsTaught: ['English Language', 'Leadership Development'],
      assignedGrades: ['Grade 7', 'Grade 8'],
      employmentType: 'PERMANENT',
      idNumber: '24890123',
      joinDate: '2020-01-05',
      status: 'ACTIVE'
    },
    {
      id: 'staff-02',
      tenantId: 'tenant-st-austins',
      employeeNo: 'EMP-STA-002',
      fullName: 'James Otieno',
      email: 'james.otieno@staustins.ac.ke',
      phone: '+254 712 345 603',
      role: 'TEACHER',
      designation: 'Head of CBC Curriculum & STEM',
      subjectsTaught: ['Science & Technology', 'Mathematical Activities', 'Agriculture'],
      assignedGrades: ['Grade 4', 'Grade 5', 'Grade 7'],
      employmentType: 'PERMANENT',
      idNumber: '27891234',
      joinDate: '2021-03-01',
      status: 'ACTIVE'
    },
    {
      id: 'staff-03',
      tenantId: 'tenant-st-austins',
      employeeNo: 'EMP-STA-003',
      fullName: 'Grace Mwangi',
      email: 'grace.mwangi@staustins.ac.ke',
      phone: '+254 712 345 602',
      role: 'ACCOUNTANT',
      designation: 'Chief Bursar / Finance Officer',
      subjectsTaught: [],
      assignedGrades: [],
      employmentType: 'PERMANENT',
      idNumber: '29012345',
      joinDate: '2020-08-15',
      status: 'ACTIVE'
    },
    {
      id: 'staff-04',
      tenantId: 'tenant-st-austins',
      employeeNo: 'EMP-STA-004',
      fullName: 'Michael Mutua',
      email: 'michael.mutua@staustins.ac.ke',
      phone: '+254 712 345 604',
      role: 'TEACHER',
      designation: 'Lower Primary Lead & Class Teacher Grade 1',
      subjectsTaught: ['Language Activities', 'Mathematical Activities', 'Creative Arts'],
      assignedGrades: ['Grade 1', 'Grade 2'],
      employmentType: 'PERMANENT',
      idNumber: '31289456',
      joinDate: '2022-01-10',
      status: 'ACTIVE'
    },
    {
      id: 'staff-05',
      tenantId: 'tenant-st-austins',
      employeeNo: 'EMP-STA-005',
      fullName: 'Agnes Chepngetich',
      email: 'agnes.c@staustins.ac.ke',
      phone: '+254 712 345 606',
      role: 'TEACHER',
      designation: 'Head of Languages (Kiswahili & French)',
      subjectsTaught: ['Kiswahili Lugha', 'French Activities'],
      assignedGrades: ['Grade 3', 'Grade 4', 'Grade 6', 'Grade 7'],
      employmentType: 'PERMANENT',
      idNumber: '28471902',
      joinDate: '2021-09-01',
      status: 'ACTIVE'
    }
  ]
};

export const INITIAL_CLASSES: Record<string, ClassStream[]> = {
  'tenant-st-austins': [
    { id: 'cls-pg', tenantId: 'tenant-st-austins', grade: 'Playgroup', streamName: 'Alpha', roomNumber: 'Block A-01', capacity: 20, enrolledCount: 16, academicYear: '2025', classTeacherName: 'Teacher Hellen' },
    { id: 'cls-pp1', tenantId: 'tenant-st-austins', grade: 'PP1', streamName: 'Blue', roomNumber: 'Block A-02', capacity: 25, enrolledCount: 22, academicYear: '2025', classTeacherName: 'Teacher Brenda' },
    { id: 'cls-pp2', tenantId: 'tenant-st-austins', grade: 'PP2', streamName: 'Yellow', roomNumber: 'Block A-03', capacity: 25, enrolledCount: 24, academicYear: '2025', classTeacherName: 'Teacher Sharon' },
    { id: 'cls-g1a', tenantId: 'tenant-st-austins', grade: 'Grade 1', streamName: 'Alpha', roomNumber: 'Block B-101', capacity: 30, enrolledCount: 28, academicYear: '2025', classTeacherName: 'Michael Mutua' },
    { id: 'cls-g1b', tenantId: 'tenant-st-austins', grade: 'Grade 1', streamName: 'Beta', roomNumber: 'Block B-102', capacity: 30, enrolledCount: 26, academicYear: '2025', classTeacherName: 'Teacher Cynthia' },
    { id: 'cls-g2a', tenantId: 'tenant-st-austins', grade: 'Grade 2', streamName: 'Alpha', roomNumber: 'Block B-201', capacity: 30, enrolledCount: 27, academicYear: '2025', classTeacherName: 'Teacher Dan' },
    { id: 'cls-g3a', tenantId: 'tenant-st-austins', grade: 'Grade 3', streamName: 'Alpha', roomNumber: 'Block B-202', capacity: 30, enrolledCount: 29, academicYear: '2025', classTeacherName: 'Teacher Eunice' },
    { id: 'cls-g4a', tenantId: 'tenant-st-austins', grade: 'Grade 4', streamName: 'Alpha', roomNumber: 'Block C-101', capacity: 32, enrolledCount: 30, academicYear: '2025', classTeacherName: 'James Otieno' },
    { id: 'cls-g5a', tenantId: 'tenant-st-austins', grade: 'Grade 5', streamName: 'Alpha', roomNumber: 'Block C-102', capacity: 32, enrolledCount: 31, academicYear: '2025', classTeacherName: 'Agnes Chepngetich' },
    { id: 'cls-g6a', tenantId: 'tenant-st-austins', grade: 'Grade 6', streamName: 'Alpha', roomNumber: 'Block C-201', capacity: 32, enrolledCount: 28, academicYear: '2025', classTeacherName: 'Teacher Patrick' },
    { id: 'cls-g7a', tenantId: 'tenant-st-austins', grade: 'Grade 7', streamName: 'Alpha (Junior)', roomNumber: 'Junior Lab 01', capacity: 35, enrolledCount: 32, academicYear: '2025', classTeacherName: 'Sarah Wanjiru' },
    { id: 'cls-g8a', tenantId: 'tenant-st-austins', grade: 'Grade 8', streamName: 'Alpha (Junior)', roomNumber: 'Junior Lab 02', capacity: 35, enrolledCount: 30, academicYear: '2025', classTeacherName: 'Teacher Eric' },
    { id: 'cls-g9a', tenantId: 'tenant-st-austins', grade: 'Grade 9', streamName: 'Alpha (Junior)', roomNumber: 'Junior Lab 03', capacity: 35, enrolledCount: 25, academicYear: '2025', classTeacherName: 'Teacher Rebecca' }
  ]
};

export const INITIAL_CBC_SUBJECTS: CBCSubject[] = [
  {
    id: 'sub-eng',
    tenantId: 'tenant-st-austins',
    code: 'ENG-CBC',
    name: 'English Language Activities',
    category: 'Core',
    applicableGrades: ['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Listening and Speaking', subStrands: ['Attentive Listening', 'Pronunciation & Vocabulary', 'Conversations & Etiquette'] },
      { strandName: 'Reading', subStrands: ['Fluency & Comprehension', 'Independent Reading', 'Grammar in Context'] },
      { strandName: 'Writing', subStrands: ['Handwriting', 'Creative Composition', 'Punctuation & Spelling'] }
    ]
  },
  {
    id: 'sub-kisw',
    tenantId: 'tenant-st-austins',
    code: 'KIS-CBC',
    name: 'Kiswahili Lugha na Mawasiliano',
    category: 'Core',
    applicableGrades: ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Kusikiliza na Kuzungumza', subStrands: ['Maamkizi na Mazungumzo', 'Matamshi Bora'] },
      { strandName: 'Kusoma', subStrands: ['Ufahamu na Msamiati', 'Kusoma kwa Ufasaha'] },
      { strandName: 'Kuandika', subStrands: ['Insha za Ubunifu', 'Sarufi'] }
    ]
  },
  {
    id: 'sub-math',
    tenantId: 'tenant-st-austins',
    code: 'MAT-CBC',
    name: 'Mathematical Activities',
    category: 'Core',
    applicableGrades: ['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Numbers', subStrands: ['Whole Numbers', 'Fractions & Decimals', 'Operations (Add/Sub/Mult/Div)'] },
      { strandName: 'Measurement', subStrands: ['Length, Mass & Capacity', 'Time & Money', 'Area & Perimeter'] },
      { strandName: 'Geometry & Data', subStrands: ['2D & 3D Shapes', 'Simple Data Presentation'] }
    ]
  },
  {
    id: 'sub-scitech',
    tenantId: 'tenant-st-austins',
    code: 'SCI-CBC',
    name: 'Science and Technology',
    category: 'Core',
    applicableGrades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Living Things', subStrands: ['Plants & Animals', 'Human Body Systems', 'Health & Hygiene'] },
      { strandName: 'Environment & Matter', subStrands: ['States of Matter', 'Water, Soil and Air Conservation'] },
      { strandName: 'Digital Technology & Coding', subStrands: ['Computer Parts', 'Word Processing', 'Algorithmic Thinking'] }
    ]
  },
  {
    id: 'sub-agri',
    tenantId: 'tenant-st-austins',
    code: 'AGR-CBC',
    name: 'Agriculture and Nutrition',
    category: 'Core',
    applicableGrades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Conserving Agricultural Environment', subStrands: ['Soil Conservation', 'Water Harvesting for Farming'] },
      { strandName: 'Crop and Animal Production', subStrands: ['Vegetable Gardening', 'Poultry Care'] },
      { strandName: 'Food and Nutrition', subStrands: ['Balanced Diet & Meal Planning', 'Food Preservation'] }
    ]
  },
  {
    id: 'sub-creative',
    tenantId: 'tenant-st-austins',
    code: 'CRE-CBC',
    name: 'Creative Arts & Sports',
    category: 'Core',
    applicableGrades: ['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Visual Arts', subStrands: ['Drawing & Painting', 'Crafts & Sculptures'] },
      { strandName: 'Music & Performing Arts', subStrands: ['Melody, Rhythm & Kenyan Folk Songs', 'Musical Instruments'] },
      { strandName: 'Physical Health & Sports', subStrands: ['Athletics, Ball Games & Gymnastics', 'First Aid'] }
    ]
  },
  {
    id: 'sub-social',
    tenantId: 'tenant-st-austins',
    code: 'SOC-CBC',
    name: 'Social Studies & Citizenship',
    category: 'Core',
    applicableGrades: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Community and Governance', subStrands: ['County and National Government', 'Citizenship & Rights'] },
      { strandName: 'History and Heritage', subStrands: ['Kenyan Communities & Cultural Heritage'] }
    ]
  },
  {
    id: 'sub-cre',
    tenantId: 'tenant-st-austins',
    code: 'REL-CBC',
    name: 'Religious Education (CRE / IRE)',
    category: 'Core',
    applicableGrades: ['Playgroup', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    strands: [
      { strandName: 'Creation and Moral Values', subStrands: ['Living in Harmony', 'Integrity and Compassion'] }
    ]
  }
];

export const INITIAL_ASSESSMENTS: Record<string, AssessmentRecord[]> = {
  'tenant-st-austins': [
    {
      id: 'ass-001',
      tenantId: 'tenant-st-austins',
      academicYear: '2025',
      term: 'TERM_1',
      assessmentType: 'MID_TERM',
      grade: 'Grade 4',
      stream: 'Alpha',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      subjectId: 'sub-math',
      subjectName: 'Mathematical Activities',
      strand: 'Numbers - Multi-digit Operations & Fractions',
      rawScore: 92,
      maxScore: 100,
      percentage: 92,
      performanceLevel: 'EE',
      rubricComment: 'Demonstrates outstanding mastery in multi-step problem solving.',
      teacherName: 'James Otieno',
      date: '2025-02-18'
    },
    {
      id: 'ass-002',
      tenantId: 'tenant-st-austins',
      academicYear: '2025',
      term: 'TERM_1',
      assessmentType: 'MID_TERM',
      grade: 'Grade 4',
      stream: 'Alpha',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      subjectId: 'sub-scitech',
      subjectName: 'Science and Technology',
      strand: 'Living Things & Digital Literacy',
      rawScore: 88,
      maxScore: 100,
      percentage: 88,
      performanceLevel: 'EE',
      rubricComment: 'Exceptional comprehension of plant structures and computer hardware.',
      teacherName: 'James Otieno',
      date: '2025-02-19'
    },
    {
      id: 'ass-003',
      tenantId: 'tenant-st-austins',
      academicYear: '2025',
      term: 'TERM_1',
      assessmentType: 'MID_TERM',
      grade: 'Grade 4',
      stream: 'Alpha',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      subjectId: 'sub-eng',
      subjectName: 'English Language Activities',
      strand: 'Creative Writing & Reading Fluency',
      rawScore: 78,
      maxScore: 100,
      percentage: 78,
      performanceLevel: 'ME',
      rubricComment: 'Good expressive vocabulary and clean paragraphing.',
      teacherName: 'Sarah Wanjiru',
      date: '2025-02-20'
    },
    {
      id: 'ass-004',
      tenantId: 'tenant-st-austins',
      academicYear: '2025',
      term: 'TERM_1',
      assessmentType: 'MID_TERM',
      grade: 'Grade 4',
      stream: 'Alpha',
      studentId: 'stud-002',
      studentName: 'Zuri Nyambura Kariuki',
      admissionNo: 'STA-2024-002',
      subjectId: 'sub-math',
      subjectName: 'Mathematical Activities',
      strand: 'Numbers & Measurement',
      rawScore: 86,
      maxScore: 100,
      percentage: 86,
      performanceLevel: 'EE',
      rubricComment: 'Shows very strong conceptual understanding and accuracy.',
      teacherName: 'James Otieno',
      date: '2025-02-18'
    },
    {
      id: 'ass-005',
      tenantId: 'tenant-st-austins',
      academicYear: '2025',
      term: 'TERM_1',
      assessmentType: 'MID_TERM',
      grade: 'Grade 4',
      stream: 'Alpha',
      studentId: 'stud-002',
      studentName: 'Zuri Nyambura Kariuki',
      admissionNo: 'STA-2024-002',
      subjectId: 'sub-eng',
      subjectName: 'English Language Activities',
      strand: 'Grammar & Oral Presentation',
      rawScore: 94,
      maxScore: 100,
      percentage: 94,
      performanceLevel: 'EE',
      rubricComment: 'Outstanding public speaking and eloquent essay composition.',
      teacherName: 'Sarah Wanjiru',
      date: '2025-02-20'
    }
  ]
};

export const INITIAL_FEE_STRUCTURE: Record<string, FeeStructureItem[]> = {
  'tenant-st-austins': [
    { id: 'fee-str-01', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 4', category: 'Tuition Fee', amount: 45000, isMandatory: true, description: 'Core CBC academic instruction & STEM lab' },
    { id: 'fee-str-02', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 4', category: 'Lunch & Meals', amount: 15000, isMandatory: true, description: 'Nutritious hot lunch and mid-morning snack' },
    { id: 'fee-str-03', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 4', category: 'Activity & Sports', amount: 8000, isMandatory: true, description: 'Swimming, clubs, music, and sports coaching' },
    { id: 'fee-str-04', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 4', category: 'Exams & Assessment', amount: 7000, isMandatory: true, description: 'CBC standardized assessment sheets and materials' },
    { id: 'fee-str-05', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 1', category: 'Tuition Fee', amount: 40000, isMandatory: true },
    { id: 'fee-str-06', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 1', category: 'Lunch & Meals', amount: 15000, isMandatory: true },
    { id: 'fee-str-07', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 1', category: 'Activity & Sports', amount: 7000, isMandatory: true },
    { id: 'fee-str-08', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 1', category: 'Exams & Assessment', amount: 6000, isMandatory: true },
    { id: 'fee-str-09', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'PP1', category: 'Tuition Fee', amount: 32000, isMandatory: true },
    { id: 'fee-str-10', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'PP1', category: 'Lunch & Meals', amount: 14000, isMandatory: true },
    { id: 'fee-str-11', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'PP1', category: 'Activity & Sports', amount: 5000, isMandatory: true },
    { id: 'fee-str-12', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'PP1', category: 'Exams & Assessment', amount: 4000, isMandatory: true },
    { id: 'fee-str-13', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 7', category: 'Tuition Fee', amount: 55000, isMandatory: true },
    { id: 'fee-str-14', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 7', category: 'Lunch & Meals', amount: 16000, isMandatory: true },
    { id: 'fee-str-15', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 7', category: 'Activity & Sports', amount: 9000, isMandatory: true },
    { id: 'fee-str-16', tenantId: 'tenant-st-austins', academicYear: '2025', term: 'TERM_1', grade: 'Grade 7', category: 'Exams & Assessment', amount: 8000, isMandatory: true }
  ]
};

export const INITIAL_PAYMENTS: Record<string, FeePayment[]> = {
  'tenant-st-austins': [
    {
      id: 'pay-001',
      tenantId: 'tenant-st-austins',
      receiptNo: 'REC-STA-2025-0101',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      grade: 'Grade 4',
      amount: 75000,
      paymentMethod: 'M-PESA',
      transactionCode: 'SFE94821KQ',
      paidAt: '2025-01-08T10:24:00.000Z',
      term: 'TERM_1',
      academicYear: '2025',
      receivedBy: 'Grace Mwangi',
      status: 'CONFIRMED',
      notes: 'Full Term 1 fee settled via M-Pesa Paybill 400200'
    },
    {
      id: 'pay-002',
      tenantId: 'tenant-st-austins',
      receiptNo: 'REC-STA-2025-0102',
      studentId: 'stud-002',
      studentName: 'Zuri Nyambura Kariuki',
      admissionNo: 'STA-2024-002',
      grade: 'Grade 4',
      amount: 60000,
      paymentMethod: 'BANK_TRANSFER',
      transactionCode: 'FT2500891823',
      paidAt: '2025-01-10T14:15:00.000Z',
      term: 'TERM_1',
      academicYear: '2025',
      receivedBy: 'Grace Mwangi',
      status: 'CONFIRMED',
      notes: 'Standard Chartered Bank direct deposit. Balance: KES 15,000'
    },
    {
      id: 'pay-003',
      tenantId: 'tenant-st-austins',
      receiptNo: 'REC-STA-2025-0103',
      studentId: 'stud-003',
      studentName: 'Liam Kiprono Cheruiyot',
      admissionNo: 'STA-2024-003',
      grade: 'Grade 1',
      amount: 68000,
      paymentMethod: 'M-PESA',
      transactionCode: 'SFK11209AB',
      paidAt: '2025-01-09T11:00:00.000Z',
      term: 'TERM_1',
      academicYear: '2025',
      receivedBy: 'Ann Kerubo',
      status: 'CONFIRMED',
      notes: 'Complete Term 1 clearance'
    },
    {
      id: 'pay-004',
      tenantId: 'tenant-st-austins',
      receiptNo: 'REC-STA-2025-0104',
      studentId: 'stud-004',
      studentName: 'Amani Wairimu Njoroge',
      admissionNo: 'STA-2024-004',
      grade: 'PP1',
      amount: 33000,
      paymentMethod: 'M-PESA',
      transactionCode: 'SFM90881XY',
      paidAt: '2025-01-12T16:30:00.000Z',
      term: 'TERM_1',
      academicYear: '2025',
      receivedBy: 'Ann Kerubo',
      status: 'CONFIRMED',
      notes: 'First installment. Remaining balance: KES 22,000'
    },
    {
      id: 'pay-005',
      tenantId: 'tenant-st-austins',
      receiptNo: 'REC-STA-2025-0105',
      studentId: 'stud-005',
      studentName: 'Jayden Omondi Odhiambo',
      admissionNo: 'STA-2024-005',
      grade: 'Grade 7',
      amount: 88000,
      paymentMethod: 'BANK_TRANSFER',
      transactionCode: 'NCBA-2025-8812',
      paidAt: '2025-01-15T09:00:00.000Z',
      term: 'TERM_1',
      academicYear: '2025',
      receivedBy: 'Grace Mwangi',
      status: 'CONFIRMED',
      notes: 'Junior School Term 1 fee paid in full'
    }
  ]
};

export const INITIAL_INVOICES: Record<string, FeeInvoice[]> = {
  'tenant-st-austins': [
    {
      id: 'inv-001',
      tenantId: 'tenant-st-austins',
      invoiceNo: 'INV-STA-2025-001',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      grade: 'Grade 4',
      term: 'TERM_1',
      academicYear: '2025',
      items: [
        { category: 'Tuition Fee', amount: 45000 },
        { category: 'Lunch & Meals', amount: 15000 },
        { category: 'Activity & Sports', amount: 8000 },
        { category: 'Exams & Assessment', amount: 7000 }
      ],
      totalBilled: 75000,
      totalPaid: 75000,
      balance: 0,
      dueDate: '2025-01-15',
      createdAt: '2025-01-02T08:00:00.000Z',
      status: 'PAID'
    },
    {
      id: 'inv-002',
      tenantId: 'tenant-st-austins',
      invoiceNo: 'INV-STA-2025-002',
      studentId: 'stud-002',
      studentName: 'Zuri Nyambura Kariuki',
      admissionNo: 'STA-2024-002',
      grade: 'Grade 4',
      term: 'TERM_1',
      academicYear: '2025',
      items: [
        { category: 'Tuition Fee', amount: 45000 },
        { category: 'Lunch & Meals', amount: 15000 },
        { category: 'Activity & Sports', amount: 8000 },
        { category: 'Exams & Assessment', amount: 7000 }
      ],
      totalBilled: 75000,
      totalPaid: 60000,
      balance: 15000,
      dueDate: '2025-01-15',
      createdAt: '2025-01-02T08:00:00.000Z',
      status: 'PARTIAL'
    },
    {
      id: 'inv-003',
      tenantId: 'tenant-st-austins',
      invoiceNo: 'INV-STA-2025-003',
      studentId: 'stud-004',
      studentName: 'Amani Wairimu Njoroge',
      admissionNo: 'STA-2024-004',
      grade: 'PP1',
      term: 'TERM_1',
      academicYear: '2025',
      items: [
        { category: 'Tuition Fee', amount: 32000 },
        { category: 'Lunch & Meals', amount: 14000 },
        { category: 'Activity & Sports', amount: 5000 },
        { category: 'Exams & Assessment', amount: 4000 }
      ],
      totalBilled: 55000,
      totalPaid: 33000,
      balance: 22000,
      dueDate: '2025-01-15',
      createdAt: '2025-01-02T08:00:00.000Z',
      status: 'PARTIAL'
    }
  ]
};

export const INITIAL_ATTENDANCE: Record<string, AttendanceRecord[]> = {
  'tenant-st-austins': [
    { id: 'att-01', tenantId: 'tenant-st-austins', date: '2025-02-28', grade: 'Grade 4', stream: 'Alpha', studentId: 'stud-001', studentName: 'Ethan Mwenda Mutuma', admissionNo: 'STA-2024-001', status: 'PRESENT', recordedBy: 'James Otieno', recordedAt: '2025-02-28T08:05:00.000Z' },
    { id: 'att-02', tenantId: 'tenant-st-austins', date: '2025-02-28', grade: 'Grade 4', stream: 'Alpha', studentId: 'stud-002', studentName: 'Zuri Nyambura Kariuki', admissionNo: 'STA-2024-002', status: 'PRESENT', recordedBy: 'James Otieno', recordedAt: '2025-02-28T08:05:00.000Z' },
    { id: 'att-03', tenantId: 'tenant-st-austins', date: '2025-02-28', grade: 'Grade 1', stream: 'Alpha', studentId: 'stud-003', studentName: 'Liam Kiprono Cheruiyot', admissionNo: 'STA-2024-003', status: 'PRESENT', recordedBy: 'Michael Mutua', recordedAt: '2025-02-28T08:10:00.000Z' },
    { id: 'att-04', tenantId: 'tenant-st-austins', date: '2025-02-28', grade: 'PP1', stream: 'Blue', studentId: 'stud-004', studentName: 'Amani Wairimu Njoroge', admissionNo: 'STA-2024-004', status: 'LATE', remarks: 'Arrived at 08:35 AM due to traffic', recordedBy: 'Teacher Brenda', recordedAt: '2025-02-28T08:40:00.000Z' },
    { id: 'att-05', tenantId: 'tenant-st-austins', date: '2025-02-28', grade: 'Grade 7', stream: 'Alpha (Junior)', studentId: 'stud-005', studentName: 'Jayden Omondi Odhiambo', admissionNo: 'STA-2024-005', status: 'PRESENT', recordedBy: 'Sarah Wanjiru', recordedAt: '2025-02-28T08:00:00.000Z' }
  ]
};

export const INITIAL_TIMETABLE: Record<string, TimetableSlot[]> = {
  'tenant-st-austins': [
    { id: 'tt-1', tenantId: 'tenant-st-austins', dayOfWeek: 'Monday', startTime: '08:20', endTime: '09:00', grade: 'Grade 4', stream: 'Alpha', subjectName: 'Mathematical Activities', teacherName: 'James Otieno', room: 'Room C-101' },
    { id: 'tt-2', tenantId: 'tenant-st-austins', dayOfWeek: 'Monday', startTime: '09:00', endTime: '09:40', grade: 'Grade 4', stream: 'Alpha', subjectName: 'English Language Activities', teacherName: 'Sarah Wanjiru', room: 'Room C-101' },
    { id: 'tt-3', tenantId: 'tenant-st-austins', dayOfWeek: 'Monday', startTime: '10:00', endTime: '10:40', grade: 'Grade 4', stream: 'Alpha', subjectName: 'Science and Technology', teacherName: 'James Otieno', room: 'Science Lab' },
    { id: 'tt-4', tenantId: 'tenant-st-austins', dayOfWeek: 'Tuesday', startTime: '08:20', endTime: '09:00', grade: 'Grade 4', stream: 'Alpha', subjectName: 'Kiswahili Lugha', teacherName: 'Agnes Chepngetich', room: 'Room C-101' },
    { id: 'tt-5', tenantId: 'tenant-st-austins', dayOfWeek: 'Wednesday', startTime: '11:00', endTime: '11:40', grade: 'Grade 4', stream: 'Alpha', subjectName: 'Creative Arts & Sports', teacherName: 'Michael Mutua', room: 'Sports Ground' }
  ]
};

export const INITIAL_ASSIGNMENTS: Record<string, Assignment[]> = {
  'tenant-st-austins': [
    {
      id: 'asg-01',
      tenantId: 'tenant-st-austins',
      title: 'Water Filtration Model & Reflection',
      grade: 'Grade 4',
      stream: 'Alpha',
      subjectName: 'Science and Technology',
      instructions: 'Construct a simple sand/gravel water filter using a 2L plastic bottle. Write a 1-page reflection on your observations.',
      assignedDate: '2025-02-24',
      dueDate: '2025-03-03',
      maxMarks: 20,
      teacherName: 'James Otieno',
      status: 'ACTIVE'
    },
    {
      id: 'asg-02',
      tenantId: 'tenant-st-austins',
      title: 'Decimals & Money Problem Set (Exercise 4B)',
      grade: 'Grade 4',
      stream: 'Alpha',
      subjectName: 'Mathematical Activities',
      instructions: 'Complete questions 1 to 15 from Grade 4 CBC Mathematics Learner Book page 68.',
      assignedDate: '2025-02-26',
      dueDate: '2025-02-28',
      maxMarks: 15,
      teacherName: 'James Otieno',
      status: 'ACTIVE'
    },
    {
      id: 'asg-03',
      tenantId: 'tenant-st-austins',
      title: 'Insha ya Wasifu: Mtu Ninayemwiga Maishani',
      grade: 'Grade 4',
      stream: 'Alpha',
      subjectName: 'Kiswahili Lugha',
      instructions: 'Andika insha ya aya nne ukieleza sifa na maadili ya mtu unayempenda na kumwiga.',
      assignedDate: '2025-02-25',
      dueDate: '2025-03-02',
      maxMarks: 20,
      teacherName: 'Agnes Chepngetich',
      status: 'ACTIVE'
    }
  ]
};

export const INITIAL_DISCIPLINE: Record<string, DisciplineIncident[]> = {
  'tenant-st-austins': [
    {
      id: 'disc-01',
      tenantId: 'tenant-st-austins',
      studentId: 'stud-001',
      studentName: 'Ethan Mwenda Mutuma',
      admissionNo: 'STA-2024-001',
      grade: 'Grade 4',
      stream: 'Alpha',
      incidentDate: '2025-02-12',
      title: 'Minor Playground Collision',
      category: 'Other',
      severity: 'MINOR',
      description: 'Accidentally collided with a classmate during football break. Promptly helped peer to school nurse.',
      actionTaken: 'First aid rendered, sportsmanship commended.',
      reportedBy: 'Coach Daniel',
      parentContacted: true,
      status: 'RESOLVED'
    }
  ]
};

export const INITIAL_EVENTS: Record<string, SchoolCalendarEvent[]> = {
  'tenant-st-austins': [
    { id: 'evt-01', tenantId: 'tenant-st-austins', title: 'Mid-Term Break & Academic Progress Review', startDate: '2025-03-05', endDate: '2025-03-09', category: 'HOLIDAY', description: 'School closes for Mid-Term break. Progress reports published.', targetAudience: 'ALL' },
    { id: 'evt-02', tenantId: 'tenant-st-austins', title: 'Annual Inter-House Swimming Gala & Track Meet', startDate: '2025-03-14', endDate: '2025-03-14', category: 'SPORTS', description: 'Sports day for all grades from Playgroup to Grade 9.', targetAudience: 'ALL', venue: 'Aquatic Centre & Main Field' },
    { id: 'evt-03', tenantId: 'tenant-st-austins', title: 'Parent-Teacher Academic Clinic & CBC Portfolio Day', startDate: '2025-03-21', endDate: '2025-03-21', category: 'PARENTS_MEETING', description: 'One-on-one parent conferences to review learner portfolios.', targetAudience: 'PARENTS', venue: 'School Auditorium' }
  ]
};

export const INITIAL_NOTIFICATIONS: Record<string, NotificationBroadcast[]> = {
  'tenant-st-austins': [
    {
      id: 'notif-01',
      tenantId: 'tenant-st-austins',
      title: 'Reminder: Mid-Term Fee Clearance & Re-opening Dates',
      message: 'Dear Parent/Guardian, as we approach Mid-Term break on March 5th, kindly ensure any outstanding fee balances are settled via Paybill 400200. Thank you for your continued partnership.',
      channel: 'SMS',
      targetAudience: 'FEE_DEBTORS',
      targetFilter: 'Students with balance > KES 5,000',
      recipientCount: 42,
      sentAt: '2025-02-27T10:00:00.000Z',
      sentBy: 'Grace Mwangi (Senior Bursar)',
      status: 'SENT'
    },
    {
      id: 'notif-02',
      tenantId: 'tenant-st-austins',
      title: 'CBC Junior School STEM Project Exhibition Invitations',
      message: "Join us this Friday at 2:00 PM for the Grade 7 & 8 Robotic and Agricultural CBC Exhibition. All parents are warmly invited.",
      channel: 'SMS',
      targetAudience: 'ALL_PARENTS',
      recipientCount: 480,
      sentAt: '2025-02-24T14:30:00.000Z',
      sentBy: 'Sarah Wanjiru (Principal)',
      status: 'SENT'
    }
  ]
};

export const INITIAL_AUDIT_LOGS: Record<string, AuditLog[]> = {
  'tenant-st-austins': [
    {
      id: 'log-01',
      tenantId: 'tenant-st-austins',
      userId: 'user-superadmin-01',
      userEmail: 'superadmin@davetech.io',
      action: 'TENANT_PROVISIONED',
      details: "Provisioned enterprise workspace for St. Austin's Academy & Junior School (STA-SCH)",
      category: 'SETTINGS',
      timestamp: '2024-01-10T08:00:00.000Z'
    },
    {
      id: 'log-02',
      tenantId: 'tenant-st-austins',
      userId: 'user-bursar-03',
      userEmail: 'grace.mwangi@staustins.ac.ke',
      action: 'PAYMENT_RECEIPTED',
      details: 'Recorded payment of KES 75,000 for Ethan Mwenda Mutuma (STA-2024-001) via M-PESA',
      category: 'FINANCE',
      timestamp: '2025-01-08T10:24:00.000Z'
    },
    {
      id: 'log-03',
      tenantId: 'tenant-st-austins',
      userId: 'user-principal-02',
      userEmail: 'sarah.wanjiru@staustins.ac.ke',
      action: 'STUDENT_ADMITTED',
      details: 'Admitted new learner Zuri Nyambura Kariuki (STA-2024-002) to Grade 4 Alpha',
      category: 'ADMISSION',
      timestamp: '2024-01-08T08:15:00.000Z'
    },
    {
      id: 'log-04',
      tenantId: 'tenant-st-austins',
      userId: 'user-head-teacher-04',
      userEmail: 'james.otieno@staustins.ac.ke',
      action: 'CBC_ASSESSMENT_RECORDED',
      details: 'Entered Mid-Term Mathematics score (92% - EE) for Grade 4 Alpha learners',
      category: 'ACADEMICS',
      timestamp: '2025-02-18T15:30:00.000Z'
    }
  ]
};

// ==========================================
// COLLEGE / HIGHER EDUCATION DATA
// ==========================================
export const INITIAL_COLLEGE_DEPARTMENTS: Record<string, CollegeDepartment[]> = {
  'tenant-bitc': [
    {
      id: 'dept-bitc-01',
      tenantId: 'tenant-bitc',
      code: 'BITC-TECH',
      name: 'School of Software Engineering & Applied Computing',
      headOfDepartment: 'Eng. Patrick Karanja',
      facultyCount: 12,
      courseCount: 4,
      building: 'Innovation Block 1'
    },
    {
      id: 'dept-bitc-02',
      tenantId: 'tenant-bitc',
      code: 'BITC-COMM',
      name: 'Faculty of Commercial Studies & Digital Marketing',
      headOfDepartment: 'Dr. Grace Kilonzo',
      facultyCount: 10,
      courseCount: 3,
      building: 'Commercial Wing'
    }
  ]
};

export const INITIAL_COLLEGE_COURSES: Record<string, CollegeCourse[]> = {
  'tenant-kca-college': [
    {
      id: 'course-01',
      tenantId: 'tenant-kca-college',
      code: 'BCS-201',
      title: 'Bachelor of Science in Computer Science & AI',
      departmentId: 'dept-01',
      departmentName: 'Department of Computing & Information Technology',
      level: 'DEGREE',
      durationSemesters: 8,
      tuitionPerSemester: 85000,
      enrolledStudentsCount: 210,
      units: [
        { unitCode: 'CS101', unitTitle: 'Data Structures & Algorithms', creditHours: 3 },
        { unitCode: 'CS102', unitTitle: 'Database Systems & Cloud Architectures', creditHours: 3 },
        { unitCode: 'CS103', unitTitle: 'Full-Stack Software Engineering', creditHours: 4 }
      ]
    },
    {
      id: 'course-02',
      tenantId: 'tenant-kca-college',
      code: 'DBM-101',
      title: 'Diploma in Business Management & ERP Systems',
      departmentId: 'dept-02',
      departmentName: 'School of Business, Finance & Economics',
      level: 'DIPLOMA',
      durationSemesters: 4,
      tuitionPerSemester: 48000,
      enrolledStudentsCount: 165,
      units: [
        { unitCode: 'BM101', unitTitle: 'Principles of Modern Management', creditHours: 3 },
        { unitCode: 'BM102', unitTitle: 'Financial Accounting & Taxation', creditHours: 3 }
      ]
    },
    {
      id: 'course-03',
      tenantId: 'tenant-kca-college',
      code: 'CNA-001',
      title: 'Certificate in Cybersecurity & Network Administration',
      departmentId: 'dept-01',
      departmentName: 'Department of Computing & Information Technology',
      level: 'CERTIFICATE',
      durationSemesters: 2,
      tuitionPerSemester: 35000,
      enrolledStudentsCount: 95,
      units: [
        { unitCode: 'CY101', unitTitle: 'Network Security Fundamentals', creditHours: 3 },
        { unitCode: 'CY102', unitTitle: 'Ethical Hacking & Incident Response', creditHours: 3 }
      ]
    }
  ],
  'tenant-bitc': [
    {
      id: 'course-bitc-01',
      tenantId: 'tenant-bitc',
      code: 'BITC-CS-101',
      title: 'Diploma in Full-Stack Software Development & Cloud',
      departmentId: 'dept-bitc-01',
      departmentName: 'School of Software Engineering & Applied Computing',
      level: 'DIPLOMA',
      durationSemesters: 4,
      tuitionPerSemester: 55000,
      enrolledStudentsCount: 140,
      units: [
        { unitCode: 'SE101', unitTitle: 'TypeScript, React & Enterprise Frameworks', creditHours: 4 },
        { unitCode: 'SE102', unitTitle: 'Cloud APIs & Microservices Architecture', creditHours: 4 }
      ]
    },
    {
      id: 'course-bitc-02',
      tenantId: 'tenant-bitc',
      code: 'BITC-DIT-201',
      title: 'Diploma in Information Technology & Network Security',
      departmentId: 'dept-bitc-01',
      departmentName: 'School of Software Engineering & Applied Computing',
      level: 'DIPLOMA',
      durationSemesters: 4,
      tuitionPerSemester: 52000,
      enrolledStudentsCount: 110,
      units: [
        { unitCode: 'NET101', unitTitle: 'Enterprise Network Protocols & Cisco Routing', creditHours: 3 },
        { unitCode: 'SEC102', unitTitle: 'Cyber Security Defenses & Firewalls', creditHours: 3 }
      ]
    }
  ]
};

export const INITIAL_COLLEGE_STUDENTS: Record<string, CollegeStudent[]> = {
  'tenant-kca-college': [
    {
      id: 'cstud-01',
      tenantId: 'tenant-kca-college',
      regNo: 'KCA/BCS/2023/0482',
      fullName: 'Brian Kipkorir Chesire',
      email: 'brian.chesire@students.kcacollege.ac.ke',
      phone: '+254 711 223 344',
      courseId: 'course-01',
      courseName: 'Bachelor of Science in Computer Science & AI',
      departmentName: 'Computing & IT',
      yearOfStudy: 2,
      semester: 1,
      status: 'ACTIVE',
      feeBalance: 15000,
      totalBilled: 170000,
      totalPaid: 155000,
      hostelRoom: 'Block B - Room 204',
      admissionDate: '2023-09-04'
    },
    {
      id: 'cstud-02',
      tenantId: 'tenant-kca-college',
      regNo: 'KCA/DBM/2024/0119',
      fullName: 'Mercy Auma Omondi',
      email: 'mercy.auma@students.kcacollege.ac.ke',
      phone: '+254 722 334 455',
      courseId: 'course-02',
      courseName: 'Diploma in Business Management & ERP Systems',
      departmentName: 'Business & Finance',
      yearOfStudy: 1,
      semester: 2,
      status: 'ACTIVE',
      feeBalance: 0,
      totalBilled: 96000,
      totalPaid: 96000,
      hostelRoom: 'Hall A - Room 102',
      admissionDate: '2024-01-15'
    },
    {
      id: 'cstud-03',
      tenantId: 'tenant-kca-college',
      regNo: 'KCA/BCS/2022/0089',
      fullName: 'Kelvin Mwangi Nderitu',
      email: 'kelvin.nderitu@students.kcacollege.ac.ke',
      phone: '+254 733 998 877',
      courseId: 'course-01',
      courseName: 'Bachelor of Science in Computer Science & AI',
      departmentName: 'Computing & IT',
      yearOfStudy: 3,
      semester: 1,
      status: 'ACTIVE',
      feeBalance: 32000,
      totalBilled: 255000,
      totalPaid: 223000,
      admissionDate: '2022-09-05'
    }
  ],
  'tenant-bitc': [
    {
      id: 'cstud-bitc-01',
      tenantId: 'tenant-bitc',
      regNo: 'BITC/DSE/2024/0045',
      fullName: 'Antony Maina Wambugu',
      email: 'antony.maina@students.bitc.ac.ke',
      phone: '+254 711 556 677',
      courseId: 'course-bitc-01',
      courseName: 'Diploma in Full-Stack Software Development & Cloud',
      departmentName: 'School of Software Engineering',
      yearOfStudy: 1,
      semester: 2,
      status: 'ACTIVE',
      feeBalance: 12000,
      totalBilled: 110000,
      totalPaid: 98000,
      hostelRoom: 'Hostel East - Room 14',
      admissionDate: '2024-01-12'
    },
    {
      id: 'cstud-bitc-02',
      tenantId: 'tenant-bitc',
      regNo: 'BITC/DIT/2023/0188',
      fullName: 'Faith Chelangat Koech',
      email: 'faith.chelangat@students.bitc.ac.ke',
      phone: '+254 722 889 900',
      courseId: 'course-bitc-02',
      courseName: 'Diploma in Information Technology & Network Security',
      departmentName: 'School of Software Engineering',
      yearOfStudy: 2,
      semester: 1,
      status: 'ACTIVE',
      feeBalance: 0,
      totalBilled: 104000,
      totalPaid: 104000,
      admissionDate: '2023-09-10'
    }
  ]
};

export const INITIAL_LIBRARY_BOOKS: Record<string, LibraryBook[]> = {
  'tenant-kca-college': [
    {
      id: 'lib-01',
      tenantId: 'tenant-kca-college',
      isbn: '978-0131103627',
      title: 'The C Programming Language (2nd Edition)',
      author: 'Brian W. Kernighan, Dennis M. Ritchie',
      category: 'Computer Science',
      totalCopies: 12,
      availableCopies: 8,
      shelfLocation: 'Stack CS-04',
      status: 'AVAILABLE'
    },
    {
      id: 'lib-02',
      tenantId: 'tenant-kca-college',
      isbn: '978-0262033848',
      title: 'Introduction to Algorithms (CLRS)',
      author: 'Thomas H. Cormen, Charles E. Leiserson',
      category: 'Computer Science',
      totalCopies: 8,
      availableCopies: 2,
      shelfLocation: 'Stack CS-08',
      status: 'LOW_STOCK'
    },
    {
      id: 'lib-03',
      tenantId: 'tenant-kca-college',
      isbn: '978-0134444390',
      title: 'Financial Accounting & Reporting in Africa',
      author: 'David Mwangi, CFA',
      category: 'Business & Finance',
      totalCopies: 15,
      availableCopies: 11,
      shelfLocation: 'Stack BF-02',
      status: 'AVAILABLE'
    }
  ]
};

export const INITIAL_HOSTEL_ROOMS: Record<string, HostelRoom[]> = {
  'tenant-kca-college': [
    {
      id: 'hostel-01',
      tenantId: 'tenant-kca-college',
      roomNumber: 'B-204',
      blockName: 'Hall B (Kilimanjaro)',
      gender: 'Male',
      capacity: 4,
      occupied: 3,
      feePerSemester: 18000,
      status: 'AVAILABLE'
    },
    {
      id: 'hostel-02',
      tenantId: 'tenant-kca-college',
      roomNumber: 'A-102',
      blockName: 'Hall A (Mount Kenya)',
      gender: 'Female',
      capacity: 2,
      occupied: 2,
      feePerSemester: 24000,
      status: 'FULL'
    },
    {
      id: 'hostel-03',
      tenantId: 'tenant-kca-college',
      roomNumber: 'B-301',
      blockName: 'Hall B (Kilimanjaro)',
      gender: 'Male',
      capacity: 4,
      occupied: 1,
      feePerSemester: 18000,
      status: 'AVAILABLE'
    }
  ]
};

// ==========================================
// RETAIL & WHOLESALE BUSINESS DATA
// ==========================================
export const INITIAL_RETAIL_PRODUCTS: Record<string, RetailProduct[]> = {
  'tenant-apex-retail': [
    {
      id: 'prod-01',
      tenantId: 'tenant-apex-retail',
      sku: 'SKU-RICE-25KG',
      barcode: '616110012345',
      name: 'Pishori Pure Grain Rice (25kg Bag)',
      category: 'Grains & Cereals',
      costPrice: 4200,
      sellingPrice: 5200,
      wholesalePrice: 4700,
      currentStock: 48,
      minStockAlert: 15,
      unit: 'BAG',
      supplierName: 'Mwea Grain Millers Ltd',
      status: 'IN_STOCK'
    },
    {
      id: 'prod-02',
      tenantId: 'tenant-apex-retail',
      sku: 'SKU-OIL-20L',
      barcode: '616110054321',
      name: 'Golden Fry Cooking Oil (20 Litres Jerrycan)',
      category: 'Edible Oils',
      costPrice: 3850,
      sellingPrice: 4600,
      wholesalePrice: 4200,
      currentStock: 6,
      minStockAlert: 10,
      unit: 'LTR',
      supplierName: 'Bidco Africa Industries',
      status: 'LOW_STOCK'
    },
    {
      id: 'prod-03',
      tenantId: 'tenant-apex-retail',
      sku: 'SKU-SUGAR-50KG',
      barcode: '616110098765',
      name: 'Kabras Premium Refined White Sugar (50kg Bag)',
      category: 'Sugar & Sweeteners',
      costPrice: 6100,
      sellingPrice: 7200,
      wholesalePrice: 6700,
      currentStock: 32,
      minStockAlert: 10,
      unit: 'BAG',
      supplierName: 'West Kenya Sugar Co.',
      status: 'IN_STOCK'
    },
    {
      id: 'prod-04',
      tenantId: 'tenant-apex-retail',
      sku: 'SKU-FLOUR-12X2KG',
      barcode: '616110065432',
      name: 'Unga Pembe Premium Maize Flour (Bale 12x2kg)',
      category: 'Flour & Bakery',
      costPrice: 1950,
      sellingPrice: 2400,
      wholesalePrice: 2150,
      currentStock: 80,
      minStockAlert: 20,
      unit: 'BOX',
      supplierName: 'Mombasa Grain Millers',
      status: 'IN_STOCK'
    },
    {
      id: 'prod-05',
      tenantId: 'tenant-apex-retail',
      sku: 'SKU-SALT-40X500G',
      barcode: '616110033221',
      name: 'Kensalt Pure Iodated Sea Salt (Carton 40x500g)',
      category: 'Seasonings',
      costPrice: 850,
      sellingPrice: 1200,
      wholesalePrice: 1000,
      currentStock: 2,
      minStockAlert: 10,
      unit: 'BOX',
      supplierName: 'Krystalline Salt Ltd',
      status: 'LOW_STOCK'
    }
  ]
};

export const INITIAL_RETAIL_SALES: Record<string, RetailSale[]> = {
  'tenant-apex-retail': [
    {
      id: 'sale-01',
      tenantId: 'tenant-apex-retail',
      receiptNumber: 'REC-AWD-2025-0891',
      customerName: 'Mama Lucy Supermarket & Retail',
      customerPhone: '+254 722 555 888',
      saleType: 'WHOLESALE',
      items: [
        { productId: 'prod-01', sku: 'SKU-RICE-25KG', productName: 'Pishori Pure Grain Rice (25kg Bag)', quantity: 5, unitPrice: 4700, discount: 500, lineTotal: 23000 },
        { productId: 'prod-03', sku: 'SKU-SUGAR-50KG', productName: 'Kabras Premium Refined White Sugar (50kg Bag)', quantity: 3, unitPrice: 6700, discount: 0, lineTotal: 20100 }
      ],
      subtotal: 43600,
      taxAmount: 0,
      discountAmount: 500,
      totalAmount: 43100,
      amountPaid: 43100,
      changeDue: 0,
      paymentMethod: 'M-PESA',
      mpesaRef: 'TIK89201LK',
      cashierName: 'Hassan Noor',
      createdAt: '2025-02-28T11:42:00.000Z',
      status: 'COMPLETED'
    },
    {
      id: 'sale-02',
      tenantId: 'tenant-apex-retail',
      receiptNumber: 'REC-AWD-2025-0892',
      customerName: 'Quick Retail Walk-In',
      saleType: 'RETAIL',
      items: [
        { productId: 'prod-04', sku: 'SKU-FLOUR-12X2KG', productName: 'Unga Pembe Premium Maize Flour (Bale 12x2kg)', quantity: 2, unitPrice: 2400, discount: 0, lineTotal: 4800 },
        { productId: 'prod-02', sku: 'SKU-OIL-20L', productName: 'Golden Fry Cooking Oil (20 Litres)', quantity: 1, unitPrice: 4600, discount: 0, lineTotal: 4600 }
      ],
      subtotal: 9400,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 9400,
      amountPaid: 10000,
      changeDue: 600,
      paymentMethod: 'CASH',
      cashierName: 'Hassan Noor',
      createdAt: '2025-02-28T14:15:00.000Z',
      status: 'COMPLETED'
    }
  ]
};

export const INITIAL_RETAIL_SUPPLIERS: Record<string, RetailSupplier[]> = {
  'tenant-apex-retail': [
    {
      id: 'supp-01',
      tenantId: 'tenant-apex-retail',
      name: 'Mwea Grain Millers Ltd',
      company: 'Mwea Millers Distributorship',
      phone: '+254 700 321 654',
      email: 'orders@mweagrain.co.ke',
      address: 'Industrial Road, Embu, Kenya',
      categoriesSupplied: ['Grains & Cereals'],
      balanceOwed: 140000,
      totalPurchased: 1250000,
      status: 'ACTIVE'
    },
    {
      id: 'supp-02',
      tenantId: 'tenant-apex-retail',
      name: 'Bidco Africa Industries',
      company: 'Bidco Africa FMCG',
      phone: '+254 722 100 200',
      email: 'sales@bidco-africa.com',
      address: 'Garissa Road, Thika, Kenya',
      categoriesSupplied: ['Edible Oils', 'Soaps & Detergents'],
      balanceOwed: 0,
      totalPurchased: 2800000,
      status: 'ACTIVE'
    }
  ]
};

export const INITIAL_RETAIL_CUSTOMERS: Record<string, RetailCustomer[]> = {
  'tenant-apex-retail': [
    {
      id: 'cust-01',
      tenantId: 'tenant-apex-retail',
      name: 'Mama Lucy Supermarket & Retail',
      phone: '+254 722 555 888',
      email: 'lucy.retail@gmail.com',
      type: 'WHOLESALE',
      creditLimit: 150000,
      currentCredit: 25000,
      totalSpend: 890000,
      lastPurchaseDate: '2025-02-28'
    },
    {
      id: 'cust-02',
      tenantId: 'tenant-apex-retail',
      name: 'Changamwe General Stores',
      phone: '+254 733 667 788',
      email: 'changamwestores@yahoo.com',
      type: 'CREDIT_ACCOUNT',
      creditLimit: 200000,
      currentCredit: 68000,
      totalSpend: 1450000,
      lastPurchaseDate: '2025-02-26'
    }
  ]
};

// ==========================================
// HOSPITAL & HEALTHCARE DATA
// ==========================================
export const INITIAL_HOSPITAL_PATIENTS: Record<string, HospitalPatient[]> = {
  'tenant-greenvale-hospital': [
    {
      id: 'pat-01',
      tenantId: 'tenant-greenvale-hospital',
      patientNo: 'GMH-PAT-2025-0412',
      fullName: 'Geoffrey Ochieng Odoyo',
      gender: 'Male',
      age: 42,
      phone: '+254 714 567 890',
      emergencyContact: '+254 722 456 789 (Wife)',
      bloodGroup: 'O+',
      allergies: 'Penicillin',
      vitals: {
        bloodPressure: '135/85',
        temperature: 37.1,
        pulseRate: 74,
        weightKg: 78
      },
      lastVisitDate: '2025-02-28',
      status: 'DOCTOR_QUEUE'
    },
    {
      id: 'pat-02',
      tenantId: 'tenant-greenvale-hospital',
      patientNo: 'GMH-PAT-2025-0413',
      fullName: 'Beatrice Akinyi Awuor',
      gender: 'Female',
      age: 29,
      phone: '+254 723 890 123',
      emergencyContact: '+254 700 890 123 (Mother)',
      bloodGroup: 'B+',
      allergies: 'None known',
      vitals: {
        bloodPressure: '118/76',
        temperature: 36.6,
        pulseRate: 68,
        weightKg: 58
      },
      lastVisitDate: '2025-02-28',
      status: 'PHARMACY'
    }
  ]
};

export const INITIAL_MEDICAL_CONSULTATIONS: Record<string, MedicalConsultation[]> = {
  'tenant-greenvale-hospital': [
    {
      id: 'cons-01',
      tenantId: 'tenant-greenvale-hospital',
      patientId: 'pat-02',
      patientName: 'Beatrice Akinyi Awuor',
      doctorName: 'Dr. Evelyn Wanjiku (Consultant)',
      symptoms: 'High fever, body chills, headache, fatigue for 3 days',
      diagnosis: 'Plasmodium Falciparum (Malaria Positive - Rapid Kit)',
      prescription: 'Artemether-Lumefantrine (AL) 20/120mg tabs + Paracetamol 500mg TDS',
      notes: 'Advised rest, adequate hydration, return if symptoms persist after 3 days.',
      feeAmount: 2500,
      date: '2025-02-28T10:30:00.000Z',
      status: 'COMPLETED'
    }
  ]
};

export const INITIAL_PHARMACY_ITEMS: Record<string, PharmacyItem[]> = {
  'tenant-greenvale-hospital': [
    {
      id: 'pharm-01',
      tenantId: 'tenant-greenvale-hospital',
      code: 'MED-AL-24S',
      name: 'Coartem (Artemether/Lumefantrine 20/120mg) 24s',
      category: 'Antibiotic',
      dosage: '6 doses over 3 days',
      stockQty: 85,
      unitPrice: 650,
      expiryDate: '2026-11-30',
      status: 'IN_STOCK'
    },
    {
      id: 'pharm-02',
      tenantId: 'tenant-greenvale-hospital',
      code: 'MED-PARA-100S',
      name: 'Panadol Paracetamol 500mg Pack (100 Tabs)',
      category: 'Analgesic',
      dosage: '1-2 tablets 8 hourly',
      stockQty: 18,
      unitPrice: 350,
      expiryDate: '2027-04-15',
      status: 'IN_STOCK'
    },
    {
      id: 'pharm-03',
      tenantId: 'tenant-greenvale-hospital',
      code: 'MED-AMOX-500MG',
      name: 'Amoxicillin Capsules 500mg (Blister 20s)',
      category: 'Antibiotic',
      dosage: '500mg TDS for 5 days',
      stockQty: 4,
      unitPrice: 500,
      expiryDate: '2026-08-31',
      status: 'LOW_STOCK'
    }
  ]
};

// ==========================================
// THEOLOGY & DIVINITY FACULTY DATA
// Spectrum: Certificate, Diploma, Higher Diploma, Bachelor of Theology (B.Th)
// ==========================================
export const INITIAL_THEOLOGY_PROGRAMS: Record<string, TheologyProgram[]> = {
  'tenant-berea-theology': [
    {
      id: 'theo-prog-01',
      tenantId: 'tenant-berea-theology',
      code: 'CERT-BIB-101',
      title: 'Certificate in Biblical Studies & Christian Discipleship',
      level: 'CERTIFICATE',
      departmentId: 'dept-theo-biblical',
      departmentName: 'Department of Biblical Studies & Hermeneutics',
      durationSemesters: 2,
      durationYears: '1 Year (2 Semesters)',
      tuitionPerSemester: 28000,
      enrolledStudentsCount: 65,
      ministryTrack: 'CHRISTIAN_EDUCATION',
      totalCreditHours: 32,
      requiredPracticumHours: 40,
      description: 'Foundational 1-year training in Old & New Testament survey, spiritual disciplines, basic evangelism, and Christian service for lay ministers and church elders.',
      targetCallings: ['Lay Leaders', 'Sunday School Teachers', 'Evangelism Teams', 'Cell Group Leaders'],
      curriculumUnits: [
        {
          id: 'u-c01',
          unitCode: 'BIB101',
          unitTitle: 'Old Testament Survey & Covenant History',
          creditHours: 3,
          level: 'CERTIFICATE',
          semester: 1,
          category: 'Old Testament',
          coreRequired: true,
          description: 'Overview of the Pentateuch, historical books, poetry, and prophets with focus on redemptive history.'
        },
        {
          id: 'u-c02',
          unitCode: 'BIB102',
          unitTitle: 'New Testament Survey & Gospels Harmony',
          creditHours: 3,
          level: 'CERTIFICATE',
          semester: 1,
          category: 'New Testament',
          coreRequired: true,
          description: 'Survey of the Gospels, Acts, Epistles, and Revelation with practical application for Christian life.'
        },
        {
          id: 'u-c03',
          unitCode: 'MIN101',
          unitTitle: 'Christian Discipleship & Spiritual Disciplines',
          creditHours: 3,
          level: 'CERTIFICATE',
          semester: 1,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Prayer, Scripture meditation, fasting, stewardship, and cultivating personal intimacy with God.'
        },
        {
          id: 'u-c04',
          unitCode: 'HER101',
          unitTitle: 'Basic Biblical Hermeneutics & Study Methods',
          creditHours: 3,
          level: 'CERTIFICATE',
          semester: 1,
          category: 'Biblical Languages',
          coreRequired: true,
          description: 'Inductive Bible study, literal-grammatical-historical context, and applying Scripture accurately.'
        },
        {
          id: 'u-c05',
          unitCode: 'ETH101',
          unitTitle: 'Christian Ethics & Ministry Integrity',
          creditHours: 2,
          level: 'CERTIFICATE',
          semester: 2,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Moral foundations, integrity in leadership, marital faithfulness, and financial accountability in ministry.'
        },
        {
          id: 'u-c06',
          unitCode: 'EVN101',
          unitTitle: 'Personal Evangelism & Church Outreach',
          creditHours: 3,
          level: 'CERTIFICATE',
          semester: 2,
          category: 'Missiology & Apologetics',
          coreRequired: true,
          description: 'Gospel presentation strategies, follow-up discipleship, cross-cultural sensitivity, and church planting support.'
        },
        {
          id: 'u-c07',
          unitCode: 'PAS101',
          unitTitle: 'Introduction to Pastoral Visitation & Fellowship Care',
          creditHours: 3,
          level: 'CERTIFICATE',
          semester: 2,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Home visitation, hospital encouragement, prayer support, and conflict resolution basics in local fellowships.'
        }
      ]
    },
    {
      id: 'theo-prog-02',
      tenantId: 'tenant-berea-theology',
      code: 'DIP-THEO-201',
      title: 'Diploma in Theology & Pastoral Leadership',
      level: 'DIPLOMA',
      departmentId: 'dept-theo-pastoral',
      departmentName: 'Department of Pastoral Ministry & Systematic Theology',
      durationSemesters: 4,
      durationYears: '2 Years (4 Semesters)',
      tuitionPerSemester: 42000,
      enrolledStudentsCount: 110,
      ministryTrack: 'PASTORAL_MINISTRY',
      totalCreditHours: 64,
      requiredPracticumHours: 80,
      description: 'Comprehensive 2-year pastoral training preparing ministers for pulpit ministry, church administration, systematic doctrine, and community pastoral care.',
      targetCallings: ['Associate Pastors', 'Parish Evangelists', 'Youth Pastors', 'Church Planters', 'Chaplains'],
      curriculumUnits: [
        {
          id: 'u-d01',
          unitCode: 'BIB201',
          unitTitle: 'Pentateuch & Historical Books Exegesis',
          creditHours: 3,
          level: 'DIPLOMA',
          semester: 1,
          category: 'Old Testament',
          coreRequired: true,
          description: 'Detailed theological study of Genesis to Deuteronomy, Joshua to Esther with covenantal themes.'
        },
        {
          id: 'u-d02',
          unitCode: 'SYS201',
          unitTitle: 'Systematic Theology I: God, Revelation & Humanity',
          creditHours: 3,
          level: 'DIPLOMA',
          semester: 1,
          category: 'Systematic Theology',
          coreRequired: true,
          description: 'Theology Proper, Trinity, Attributes of God, Creation, Fall, and the Image of God.'
        },
        {
          id: 'u-d03',
          unitCode: 'GRK201',
          unitTitle: 'Elementary Biblical Greek I (Grammar & Nouns)',
          creditHours: 4,
          level: 'DIPLOMA',
          semester: 1,
          category: 'Biblical Languages',
          coreRequired: true,
          description: 'Koine Greek alphabet, vocabulary, first and second declension nouns, adjectives, and basic parsing.'
        },
        {
          id: 'u-d04',
          unitCode: 'HOM201',
          unitTitle: 'Homiletics I: Expository Preaching & Message Prep',
          creditHours: 3,
          level: 'DIPLOMA',
          semester: 2,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Crafting biblically grounded sermon outlines, hermeneutical transition, illustrations, and passionate delivery.'
        },
        {
          id: 'u-d05',
          unitCode: 'SYS202',
          unitTitle: 'Systematic Theology II: Christology & Soteriology',
          creditHours: 3,
          level: 'DIPLOMA',
          semester: 2,
          category: 'Systematic Theology',
          coreRequired: true,
          description: 'Person and work of Jesus Christ, the Atonement, Resurrection, Justification, and Sanctification.'
        },
        {
          id: 'u-d06',
          unitCode: 'PAS201',
          unitTitle: 'Pastoral Care & Church Administration',
          creditHours: 3,
          level: 'DIPLOMA',
          semester: 3,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Presiding over sacraments (Baptism, Lord’s Supper), weddings, funerals, constitution drafting, and budget management.'
        },
        {
          id: 'u-d07',
          unitCode: 'HIS201',
          unitTitle: 'Church History: Early Fathers to Reformation',
          creditHours: 3,
          level: 'DIPLOMA',
          semester: 3,
          category: 'Church History',
          coreRequired: true,
          description: 'Apostolic era, ecumenical councils, medieval monasticism, the Protestant Reformation (Luther, Calvin, Zwingli).'
        },
        {
          id: 'u-d08',
          unitCode: 'COU201',
          unitTitle: 'Introduction to Biblical Counseling & Marriage Care',
          creditHours: 3,
          level: 'DIPLOMA',
          semester: 4,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Pre-marital counseling, grief counseling, addiction support, and family restoration through biblical principles.'
        }
      ]
    },
    {
      id: 'theo-prog-03',
      tenantId: 'tenant-berea-theology',
      code: 'HDIP-MIN-301',
      title: 'Higher Diploma in Practical Ministry & Mission Leadership',
      level: 'HIGHER_DIPLOMA',
      departmentId: 'dept-theo-missions',
      departmentName: 'Department of Missiology, Apologetics & Leadership',
      durationSemesters: 6,
      durationYears: '3 Years (6 Semesters)',
      tuitionPerSemester: 52000,
      enrolledStudentsCount: 58,
      ministryTrack: 'MISSIOLOGY_EVANGELISM',
      totalCreditHours: 96,
      requiredPracticumHours: 120,
      description: 'Advanced 3-year ministerial qualification equipping senior pastors, missionaries, and institutional chaplains with deep exegetical depth and cross-cultural missional competencies.',
      targetCallings: ['Senior Pastors', 'Overseas Missionaries', 'Denominational Directors', 'Hospital/Military Chaplains', 'NGO Spiritual Directors'],
      curriculumUnits: [
        {
          id: 'u-h01',
          unitCode: 'MIS301',
          unitTitle: 'Foundations of Missiology & Cultural Anthropology',
          creditHours: 3,
          level: 'HIGHER_DIPLOMA',
          semester: 1,
          category: 'Missiology & Apologetics',
          coreRequired: true,
          description: 'Theology of Mission (Missio Dei), contextualization, redemptive analogies, and cross-cultural communication.'
        },
        {
          id: 'u-h02',
          unitCode: 'HEB301',
          unitTitle: 'Elementary Biblical Hebrew I (Alphabet & Verbs)',
          creditHours: 4,
          level: 'HIGHER_DIPLOMA',
          semester: 1,
          category: 'Biblical Languages',
          coreRequired: true,
          description: 'Hebrew alphabet, vowel pointings, Qal strong verb paradigm, noun constructs, and translating Genesis passages.'
        },
        {
          id: 'u-h03',
          unitCode: 'SYS301',
          unitTitle: 'Systematic Theology III: Ecclesiology & Eschatology',
          creditHours: 3,
          level: 'HIGHER_DIPLOMA',
          semester: 2,
          category: 'Systematic Theology',
          coreRequired: true,
          description: 'Nature and mission of the Church, spiritual gifts, biblical views of end times, return of Christ, and the New Creation.'
        },
        {
          id: 'u-h04',
          unitCode: 'HIS301',
          unitTitle: 'History of Christianity in Africa & East African Revival',
          creditHours: 3,
          level: 'HIGHER_DIPLOMA',
          semester: 3,
          category: 'Church History',
          coreRequired: true,
          description: 'African church history from Alexandria/Carthage to 19th-century missionary movements and the 1930s East African Balokole Revival.'
        },
        {
          id: 'u-h05',
          unitCode: 'APO301',
          unitTitle: 'Christian Apologetics & Contemporary African Issues',
          creditHours: 3,
          level: 'HIGHER_DIPLOMA',
          semester: 4,
          category: 'Missiology & Apologetics',
          coreRequired: true,
          description: 'Defending biblical truth against secularism, syncretism, prosperity cults, and engaging dialogue with Islam and traditional religions.'
        },
        {
          id: 'u-h06',
          unitCode: 'CHA301',
          unitTitle: 'Institutional Chaplaincy (Hospitals, Armed Forces & Prisons)',
          creditHours: 3,
          level: 'HIGHER_DIPLOMA',
          semester: 5,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Specialized pastoral care in clinical trauma, end-of-life palliative accompaniment, and rehabilitation ministry.'
        }
      ]
    },
    {
      id: 'theo-prog-04',
      tenantId: 'tenant-berea-theology',
      code: 'BTH-401',
      title: 'Bachelor of Theology (B.Th) / BA in Theological & Biblical Studies',
      level: 'BACHELORS',
      departmentId: 'dept-theo-biblical',
      departmentName: 'Department of Biblical Studies & Systematic Theology',
      durationSemesters: 8,
      durationYears: '4 Years (8 Semesters)',
      tuitionPerSemester: 68000,
      enrolledStudentsCount: 107,
      ministryTrack: 'PASTORAL_MINISTRY',
      totalCreditHours: 128,
      requiredPracticumHours: 200,
      description: 'The premier 4-year undergraduate theological degree. Combines rigorous original-language exegesis (Greek & Hebrew), systematic theology, historical theology, and a 200-hour ordination practicum.',
      targetCallings: ['Ordained Ministers', 'Theological Lecturers', 'Seminary Educators', 'Denominational Executives', 'Bible Translators', 'Senior Church Planters'],
      curriculumUnits: [
        {
          id: 'u-b01',
          unitCode: 'BTH401',
          unitTitle: 'Advanced Greek Syntax & Exegesis of Romans',
          creditHours: 4,
          level: 'BACHELORS',
          semester: 3,
          category: 'Biblical Languages',
          coreRequired: true,
          description: 'Translating and exegeting Romans 1-8 in Koine Greek with syntactic diagramming and textual criticism.'
        },
        {
          id: 'u-b02',
          unitCode: 'BTH402',
          unitTitle: 'Hebrew Exegesis of Isaiah & Wisdom Literature',
          creditHours: 4,
          level: 'BACHELORS',
          semester: 4,
          category: 'Biblical Languages',
          coreRequired: true,
          description: 'Reading Masoretic Text of Isaiah 40-55 and Job with syntactic discourse analysis.'
        },
        {
          id: 'u-b03',
          unitCode: 'BTH403',
          unitTitle: 'Systematic Theology IV: Theological Method & Modern Debates',
          creditHours: 3,
          level: 'BACHELORS',
          semester: 5,
          category: 'Systematic Theology',
          coreRequired: true,
          description: 'In-depth evaluation of Reformed, Arminian, Pentecostal, and Liberation theological frameworks.'
        },
        {
          id: 'u-b04',
          unitCode: 'BTH404',
          unitTitle: 'African Christian Theology & Contextual Hermeneutics',
          creditHours: 3,
          level: 'BACHELORS',
          semester: 6,
          category: 'Systematic Theology',
          coreRequired: true,
          description: 'Study of leading African theologians (John Mbiti, Kwame Bediako, Mercy Oduyoye) and indigenous theological reflection.'
        },
        {
          id: 'u-b05',
          unitCode: 'BTH405',
          unitTitle: 'Advanced Pastoral Psychotherapy, Trauma & Crisis Care',
          creditHours: 3,
          level: 'BACHELORS',
          semester: 6,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Clinical pastoral education (CPE) methods, suicide intervention, post-traumatic counseling, and family systems.'
        },
        {
          id: 'u-b06',
          unitCode: 'BTH406',
          unitTitle: 'Christian Bioethics, Public Policy & Social Justice',
          creditHours: 3,
          level: 'BACHELORS',
          semester: 7,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Theological assessment of reproductive technologies, euthanasia, good governance, corruption, and climate stewardship.'
        },
        {
          id: 'u-b07',
          unitCode: 'BTH410',
          unitTitle: 'Senior Bachelor’s Research Dissertation & Colloquium',
          creditHours: 6,
          level: 'BACHELORS',
          semester: 8,
          category: 'Practical Ministry',
          coreRequired: true,
          description: '10,000-word peer-reviewed theological research thesis defended before the seminary academic faculty board.'
        },
        {
          id: 'u-b08',
          unitCode: 'BTH411',
          unitTitle: 'Cap-Stone Ministerial Ordination Internship (200 Hours)',
          creditHours: 4,
          level: 'BACHELORS',
          semester: 8,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Supervised full-term residency in a recognized parish covering preaching, counseling, elder board governance, and community missions.'
        }
      ]
    }
  ],
  'tenant-injiri-nyeri': [
    {
      id: 'injiri-prog-01',
      tenantId: 'tenant-injiri-nyeri',
      code: 'CERT-MIN-101',
      title: 'Certificate in Christian Ministry & Discipleship',
      level: 'CERTIFICATE',
      departmentId: 'dept-theo-injiri-biblical',
      departmentName: 'Department of Biblical Studies & Pastoral Foundations',
      durationSemesters: 2,
      durationYears: '1 Year (2 Semesters)',
      tuitionPerSemester: 24000,
      enrolledStudentsCount: 45,
      ministryTrack: 'PASTORAL_MINISTRY',
      totalCreditHours: 30,
      requiredPracticumHours: 40,
      description: 'Foundational seminary training covering Old & New Testament surveys, foundational doctrine, pulpit ministry, and rural church leadership.',
      targetCallings: ['Lay Pastors', 'Church Deacons', 'Youth Leaders', 'Evangelists'],
      curriculumUnits: [
        {
          id: 'inj-u01',
          unitCode: 'BIB101',
          unitTitle: 'Old Testament Survey & Covenant History',
          creditHours: 3,
          level: 'CERTIFICATE',
          semester: 1,
          category: 'Old Testament',
          coreRequired: true,
          description: 'Survey of Genesis to Malachi focusing on covenant theology.'
        },
        {
          id: 'inj-u02',
          unitCode: 'BIB102',
          unitTitle: 'New Testament Survey & Gospels',
          creditHours: 3,
          level: 'CERTIFICATE',
          semester: 1,
          category: 'New Testament',
          coreRequired: true,
          description: 'Study of the four gospels, Acts, epistles, and revelation.'
        },
        {
          id: 'inj-u03',
          unitCode: 'PAS101',
          unitTitle: 'Biblical Preaching & Homiletics',
          creditHours: 3,
          level: 'CERTIFICATE',
          semester: 2,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Sermon preparation, delivery, and pastoral care.'
        }
      ]
    },
    {
      id: 'injiri-prog-02',
      tenantId: 'tenant-injiri-nyeri',
      code: 'DIP-THEO-201',
      title: 'Diploma in Theology & Pastoral Leadership',
      level: 'DIPLOMA',
      departmentId: 'dept-theo-injiri-divinity',
      departmentName: 'Department of Systematic Theology & Pastoral Studies',
      durationSemesters: 4,
      durationYears: '2 Years (4 Semesters)',
      tuitionPerSemester: 36000,
      enrolledStudentsCount: 78,
      ministryTrack: 'PASTORAL_MINISTRY',
      totalCreditHours: 64,
      requiredPracticumHours: 80,
      description: 'Comprehensive theological training for ordained pastors, chaplains, and institutional missionaries in Mount Kenya region.',
      targetCallings: ['Ordained Pastors', 'Chaplains', 'Church Planters', 'Ministry Coordinators'],
      curriculumUnits: [
        {
          id: 'inj-u10',
          unitCode: 'TH201',
          unitTitle: 'Systematic Theology I: God, Creation & Humanity',
          creditHours: 3,
          level: 'DIPLOMA',
          semester: 1,
          category: 'Systematic Theology',
          coreRequired: true,
          description: 'Theology Proper, Bibliology, Anthropology, and Hamartiology.'
        },
        {
          id: 'inj-u11',
          unitCode: 'GRK201',
          unitTitle: 'Biblical Greek Grammar & Exegesis I',
          creditHours: 3,
          level: 'DIPLOMA',
          semester: 2,
          category: 'Biblical Languages',
          coreRequired: true,
          description: 'Koine Greek grammar, declensions, verb systems, and translation of 1 John.'
        },
        {
          id: 'inj-u12',
          unitCode: 'PRA202',
          unitTitle: 'Supervised Parish Practicum & Homiletics Lab',
          creditHours: 4,
          level: 'DIPLOMA',
          semester: 4,
          category: 'Practical Ministry',
          coreRequired: true,
          description: '80 supervised hours of pulpit ministry, visitation, and parish administration.'
        }
      ]
    },
    {
      id: 'injiri-prog-03',
      tenantId: 'tenant-injiri-nyeri',
      code: 'BTH-401',
      title: 'Bachelor of Theology (B.Th) Degree',
      level: 'BACHELORS',
      departmentId: 'dept-theo-injiri-divinity',
      departmentName: 'School of Divinity & Biblical Exegesis',
      durationSemesters: 8,
      durationYears: '4 Years (8 Semesters)',
      tuitionPerSemester: 48000,
      enrolledStudentsCount: 57,
      ministryTrack: 'PASTORAL_MINISTRY',
      totalCreditHours: 128,
      requiredPracticumHours: 200,
      description: 'Advanced undergraduate degree preparing candidates for theological research, pastoral ordination, and higher theological education.',
      targetCallings: ['Senior Pastors', 'Theological Lecturers', 'Seminary Faculty', 'Diocesan Administrators'],
      curriculumUnits: [
        {
          id: 'inj-u20',
          unitCode: 'HEB301',
          unitTitle: 'Classical Biblical Hebrew & Exegesis',
          creditHours: 3,
          level: 'BACHELORS',
          semester: 3,
          category: 'Biblical Languages',
          coreRequired: true,
          description: 'Hebrew grammar, morphology, syntax, and exegesis of Genesis narrative.'
        },
        {
          id: 'inj-u21',
          unitCode: 'TH401',
          unitTitle: 'African Christian Theology & Hermeneutics',
          creditHours: 3,
          level: 'BACHELORS',
          semester: 6,
          category: 'Church History',
          coreRequired: true,
          description: 'Indigenous theological reflection, cultural dialogue, and church history.'
        },
        {
          id: 'inj-u22',
          unitCode: 'PRA410',
          unitTitle: 'Senior Ordination Residency & Practicum (200 Hours)',
          creditHours: 4,
          level: 'BACHELORS',
          semester: 8,
          category: 'Practical Ministry',
          coreRequired: true,
          description: 'Capstone parish residency supervised by the Seminary Dean and Presbytery Moderator.'
        }
      ]
    }
  ]
};

export const INITIAL_THEOLOGY_STUDENTS: Record<string, TheologyStudent[]> = {
  'tenant-berea-theology': [
    {
      id: 'tstud-01',
      tenantId: 'tenant-berea-theology',
      regNo: 'SPT/BTH/2022/0045',
      fullName: 'Gideon Kiprono Cheruiyot',
      email: 'gideon.cheruiyot@students.stpaulstheo.ac.ke',
      phone: '+254 711 556 778',
      gender: 'Male',
      programId: 'theo-prog-04',
      programCode: 'BTH-401',
      programTitle: 'Bachelor of Theology (B.Th)',
      level: 'BACHELORS',
      ministryTrack: 'PASTORAL_MINISTRY',
      yearOfStudy: 3,
      semester: 1,
      homeChurchDenomination: 'Africa Inland Church (AIC Kenya)',
      presbyteryOrDiocese: 'AIC Nairobi Area Regional Church Council',
      mentorPastorName: 'Bishop Rev. Silas Yego',
      mentorPastorPhone: '+254 722 999 111',
      fieldWorkPlacement: 'AIC Plainsview Church, South B Nairobi',
      practicumHoursCompleted: 145,
      requiredPracticumHours: 200,
      sermonsEvaluatedCount: 12,
      status: 'ACTIVE',
      academicGPA: 3.82,
      feeBalance: 0,
      totalBilled: 408000,
      totalPaid: 408000,
      scholarshipOrSponsor: 'AIC National Mission Theological Bursary',
      admissionDate: '2022-09-05',
      notes: 'Outstanding Greek & Exegesis proficiency. Recommending for pastoral ordination candidate stream.'
    },
    {
      id: 'tstud-02',
      tenantId: 'tenant-berea-theology',
      regNo: 'SPT/DIP/2023/0112',
      fullName: 'Hannah Wairimu Karangi',
      email: 'hannah.karangi@students.stpaulstheo.ac.ke',
      phone: '+254 723 445 667',
      gender: 'Female',
      programId: 'theo-prog-02',
      programCode: 'DIP-THEO-201',
      programTitle: 'Diploma in Theology & Pastoral Leadership',
      level: 'DIPLOMA',
      ministryTrack: 'CHRISTIAN_EDUCATION',
      yearOfStudy: 2,
      semester: 2,
      homeChurchDenomination: 'Presbyterian Church of East Africa (PCEA)',
      presbyteryOrDiocese: 'PCEA Milimani Presbytery',
      mentorPastorName: 'Rev. Patrick Gitau',
      mentorPastorPhone: '+254 721 888 222',
      fieldWorkPlacement: 'PCEA St. Andrews Church, State House Road',
      practicumHoursCompleted: 78,
      requiredPracticumHours: 80,
      sermonsEvaluatedCount: 8,
      status: 'ACTIVE',
      academicGPA: 3.65,
      feeBalance: 12000,
      totalBilled: 168000,
      totalPaid: 156000,
      scholarshipOrSponsor: 'PCEA Woman’s Guild Ministerial Scholarship',
      admissionDate: '2023-09-04',
      notes: 'Leading youth mentorship and Sunday school teacher training programs with distinction.'
    },
    {
      id: 'tstud-03',
      tenantId: 'tenant-berea-theology',
      regNo: 'SPT/CERT/2024/0088',
      fullName: 'Emanuel Omondi Otieno',
      email: 'emanuel.otieno@students.stpaulstheo.ac.ke',
      phone: '+254 734 667 889',
      gender: 'Male',
      programId: 'theo-prog-01',
      programCode: 'CERT-BIB-101',
      programTitle: 'Certificate in Biblical Studies & Discipleship',
      level: 'CERTIFICATE',
      ministryTrack: 'MISSIOLOGY_EVANGELISM',
      yearOfStudy: 1,
      semester: 2,
      homeChurchDenomination: 'CITAM (Christ Is The Answer Ministries)',
      presbyteryOrDiocese: 'CITAM Valley Road Assembly',
      mentorPastorName: 'Pastor Justus Mugambi',
      mentorPastorPhone: '+254 733 444 333',
      fieldWorkPlacement: 'CITAM Outreach Center, Kibera Mission Point',
      practicumHoursCompleted: 35,
      requiredPracticumHours: 40,
      sermonsEvaluatedCount: 4,
      status: 'ACTIVE',
      academicGPA: 3.5,
      feeBalance: 0,
      totalBilled: 56000,
      totalPaid: 56000,
      admissionDate: '2024-01-15'
    },
    {
      id: 'tstud-04',
      tenantId: 'tenant-berea-theology',
      regNo: 'SPT/HDIP/2022/0019',
      fullName: 'Rev. Barnabas Lokidor Ekitela',
      email: 'barnabas.ekitela@students.stpaulstheo.ac.ke',
      phone: '+254 718 223 991',
      gender: 'Male',
      programId: 'theo-prog-03',
      programCode: 'HDIP-MIN-301',
      programTitle: 'Higher Diploma in Practical Ministry & Missions',
      level: 'HIGHER_DIPLOMA',
      ministryTrack: 'MISSIOLOGY_EVANGELISM',
      yearOfStudy: 3,
      semester: 1,
      homeChurchDenomination: 'Anglican Church of Kenya (ACK)',
      presbyteryOrDiocese: 'ACK Diocese of Lodwar & Turkana Mission',
      mentorPastorName: 'Rt. Rev. Bishop Joshua Losuru',
      mentorPastorPhone: '+254 722 110 990',
      fieldWorkPlacement: 'Turkana Frontier Church Planting Network',
      practicumHoursCompleted: 115,
      requiredPracticumHours: 120,
      sermonsEvaluatedCount: 14,
      status: 'PRACTICUM_FIELD',
      academicGPA: 3.78,
      feeBalance: 18000,
      totalBilled: 312000,
      totalPaid: 294000,
      scholarshipOrSponsor: 'Cross-Cultural Frontier Missions Grant',
      admissionDate: '2022-09-05',
      notes: 'Pioneered 3 church plants along Northern Kenya corridor.'
    }
  ],
  'tenant-injiri-nyeri': [
    {
      id: 'inj-stud-01',
      tenantId: 'tenant-injiri-nyeri',
      regNo: 'INJ/BTH/2023/0012',
      fullName: 'Pastor Peter Mwangi Wachira',
      email: 'peter.mwangi@students.injiricentre.ac.ke',
      phone: '+254 712 998 877',
      gender: 'Male',
      programId: 'injiri-prog-03',
      programCode: 'BTH-401',
      programTitle: 'Bachelor of Theology (B.Th) Degree',
      level: 'BACHELORS',
      ministryTrack: 'PASTORAL_MINISTRY',
      yearOfStudy: 2,
      semester: 1,
      homeChurchDenomination: 'Full Gospel Churches of Kenya (FGCK)',
      presbyteryOrDiocese: 'FGCK Nyeri Central Sub-District',
      mentorPastorName: 'Rev. Joseph Karani',
      mentorPastorPhone: '+254 722 334 455',
      fieldWorkPlacement: 'FGCK Ruring’u Parish, Nyeri',
      practicumHoursCompleted: 95,
      requiredPracticumHours: 200,
      sermonsEvaluatedCount: 8,
      status: 'ACTIVE',
      academicGPA: 3.75,
      feeBalance: 12000,
      totalBilled: 96000,
      totalPaid: 84000,
      scholarshipOrSponsor: 'FGCK Ministerial Development Fund',
      admissionDate: '2023-09-04',
      notes: 'Strong pulpit preaching and systematic theology skills.'
    },
    {
      id: 'inj-stud-02',
      tenantId: 'tenant-injiri-nyeri',
      regNo: 'INJ/DIP/2024/0034',
      fullName: 'Sister Grace Wambui Kariuki',
      email: 'grace.wambui@students.injiricentre.ac.ke',
      phone: '+254 721 554 433',
      gender: 'Female',
      programId: 'injiri-prog-02',
      programCode: 'DIP-THEO-201',
      programTitle: 'Diploma in Theology & Pastoral Leadership',
      level: 'DIPLOMA',
      ministryTrack: 'CHRISTIAN_EDUCATION',
      yearOfStudy: 1,
      semester: 2,
      homeChurchDenomination: 'Presbyterian Church of East Africa (PCEA)',
      presbyteryOrDiocese: 'PCEA Nyeri Presbytery',
      mentorPastorName: 'Rev. David Maina',
      mentorPastorPhone: '+254 720 112 233',
      fieldWorkPlacement: 'PCEA Giakanja Parish, Nyeri',
      practicumHoursCompleted: 45,
      requiredPracticumHours: 80,
      sermonsEvaluatedCount: 5,
      status: 'ACTIVE',
      academicGPA: 3.88,
      feeBalance: 0,
      totalBilled: 72000,
      totalPaid: 72000,
      scholarshipOrSponsor: 'PCEA Presbytery Ministry Bursary',
      admissionDate: '2024-01-15',
      notes: 'Excellent Greek grammar translation and Sunday School teacher training.'
    },
    {
      id: 'inj-stud-03',
      tenantId: 'tenant-injiri-nyeri',
      regNo: 'INJ/CERT/2024/0051',
      fullName: 'Evangelist Stephen Nderitu Maina',
      email: 'stephen.nderitu@students.injiricentre.ac.ke',
      phone: '+254 733 887 766',
      gender: 'Male',
      programId: 'injiri-prog-01',
      programCode: 'CERT-MIN-101',
      programTitle: 'Certificate in Christian Ministry & Discipleship',
      level: 'CERTIFICATE',
      ministryTrack: 'MISSIOLOGY_EVANGELISM',
      yearOfStudy: 1,
      semester: 1,
      homeChurchDenomination: 'African Independent Pentecostal Church of Africa (AIPCA)',
      presbyteryOrDiocese: 'AIPCA Nyeri Diocese',
      mentorPastorName: 'Bishop Isaac Ndung’u',
      mentorPastorPhone: '+254 722 778 899',
      fieldWorkPlacement: 'AIPCA Kiganjo Outreach Mission',
      practicumHoursCompleted: 30,
      requiredPracticumHours: 40,
      sermonsEvaluatedCount: 3,
      status: 'ACTIVE',
      academicGPA: 3.6,
      feeBalance: 4000,
      totalBilled: 48000,
      totalPaid: 44000,
      admissionDate: '2024-09-02',
      notes: 'Active rural evangelism and church planter.'
    }
  ]
};

export const INITIAL_THEOLOGY_PRACTICUM_LOGS: Record<string, MinistryPracticumLog[]> = {
  'tenant-berea-theology': [
    {
      id: 'prac-01',
      tenantId: 'tenant-berea-theology',
      studentId: 'tstud-01',
      studentName: 'Gideon Kiprono Cheruiyot',
      studentRegNo: 'SPT/BTH/2022/0045',
      programTitle: 'Bachelor of Theology (B.Th)',
      churchOrInstitution: 'AIC Plainsview Church, Nairobi',
      supervisorPastor: 'Bishop Rev. Silas Yego',
      ministryType: 'SUNDAY_SERMON',
      hoursLogged: 4,
      date: '2025-02-23',
      scriptureTextOrTopic: 'Exposition of Romans 8:28-39 (More Than Conquerors)',
      supervisorFeedback: 'Exceptional homiletical structure and deep Christ-centered theology. Kept congregation engaged with sound application.',
      ratingScore: 94,
      status: 'VERIFIED'
    },
    {
      id: 'prac-02',
      tenantId: 'tenant-berea-theology',
      studentId: 'tstud-02',
      studentName: 'Hannah Wairimu Karangi',
      studentRegNo: 'SPT/DIP/2023/0112',
      programTitle: 'Diploma in Theology & Pastoral Leadership',
      churchOrInstitution: 'PCEA St. Andrews Church, Nairobi',
      supervisorPastor: 'Rev. Patrick Gitau',
      ministryType: 'YOUTH_BIBLE_STUDY',
      hoursLogged: 6,
      date: '2025-02-20',
      scriptureTextOrTopic: 'Biblical Worldview vs Postmodern Culture (Colossians 2:6-10)',
      supervisorFeedback: 'Handled difficult theological questions from college youth with biblical clarity, humility and grace.',
      ratingScore: 90,
      status: 'VERIFIED'
    },
    {
      id: 'prac-03',
      tenantId: 'tenant-berea-theology',
      studentId: 'tstud-04',
      studentName: 'Rev. Barnabas Lokidor Ekitela',
      studentRegNo: 'SPT/HDIP/2022/0019',
      programTitle: 'Higher Diploma in Practical Ministry & Missions',
      churchOrInstitution: 'Turkana Mission Parish, Lodwar',
      supervisorPastor: 'Rt. Rev. Bishop Joshua Losuru',
      ministryType: 'EVANGELISM_OUTREACH',
      hoursLogged: 12,
      date: '2025-02-15',
      scriptureTextOrTopic: 'Open Air Gospel Rally & Discipleship Class',
      supervisorFeedback: 'Mobilized over 140 community members, 22 made commitments of faith. Follow-up discipleship scheduled.',
      ratingScore: 98,
      status: 'VERIFIED'
    }
  ],
  'tenant-injiri-nyeri': [
    {
      id: 'inj-prac-01',
      tenantId: 'tenant-injiri-nyeri',
      studentId: 'inj-stud-01',
      studentName: 'Pastor Peter Mwangi Wachira',
      studentRegNo: 'INJ/BTH/2023/0012',
      programTitle: 'Bachelor of Theology (B.Th) Degree',
      churchOrInstitution: 'FGCK Ruring’u Parish, Nyeri',
      supervisorPastor: 'Rev. Joseph Karani',
      ministryType: 'SUNDAY_SERMON',
      hoursLogged: 4,
      date: '2025-02-23',
      scriptureTextOrTopic: 'The Authority of Scripture in Pastoral Care (2 Timothy 3:16-17)',
      supervisorFeedback: 'Faithful exegesis, compassionate pastoral tone, and practical application for families.',
      ratingScore: 95,
      status: 'VERIFIED'
    },
    {
      id: 'inj-prac-02',
      tenantId: 'tenant-injiri-nyeri',
      studentId: 'inj-stud-02',
      studentName: 'Sister Grace Wambui Kariuki',
      studentRegNo: 'INJ/DIP/2024/0034',
      programTitle: 'Diploma in Theology & Pastoral Leadership',
      churchOrInstitution: 'PCEA Giakanja Parish, Nyeri',
      supervisorPastor: 'Rev. David Maina',
      ministryType: 'YOUTH_BIBLE_STUDY',
      hoursLogged: 5,
      date: '2025-02-18',
      scriptureTextOrTopic: 'Spiritual Disciplines and Holy Living (1 Thessalonians 4:1-8)',
      supervisorFeedback: 'Engaged youth leaders effectively with biblical theology and question-and-answer format.',
      ratingScore: 92,
      status: 'VERIFIED'
    }
  ]
};

export const INITIAL_THEOLOGY_LIBRARY: Record<string, TheologyLibraryResource[]> = {
  'tenant-berea-theology': [
    {
      id: 'theo-lib-01',
      tenantId: 'tenant-berea-theology',
      isbn: '978-0310286707',
      title: 'Systematic Theology: An Introduction to Biblical Doctrine (2nd Edition)',
      author: 'Wayne Grudem, Ph.D.',
      category: 'SYSTEMATIC_THEOLOGY',
      levelFocus: 'ALL_LEVELS',
      totalCopies: 16,
      availableCopies: 11,
      shelfLocation: 'Aisle T-1 (Systematic Theology)',
      digitalPdfAvailable: true,
      status: 'AVAILABLE'
    },
    {
      id: 'theo-lib-02',
      tenantId: 'tenant-berea-theology',
      isbn: '978-0801021411',
      title: 'Basics of Biblical Greek Grammar & Syntax',
      author: 'William D. Mounce',
      category: 'BIBLICAL_LANGUAGES',
      levelFocus: 'BACHELORS',
      totalCopies: 20,
      availableCopies: 14,
      shelfLocation: 'Aisle L-2 (Greek & Hebrew)',
      digitalPdfAvailable: true,
      status: 'AVAILABLE'
    },
    {
      id: 'theo-lib-03',
      tenantId: 'tenant-berea-theology',
      isbn: '978-0801035821',
      title: 'Christ-Centered Preaching: Redeeming the Expository Sermon',
      author: 'Bryan Chapell, Ph.D.',
      category: 'HOMILETICS_PREACHING',
      levelFocus: 'DIPLOMA',
      totalCopies: 12,
      availableCopies: 7,
      shelfLocation: 'Aisle P-3 (Homiletics & Ministry)',
      digitalPdfAvailable: false,
      status: 'AVAILABLE'
    },
    {
      id: 'theo-lib-04',
      tenantId: 'tenant-berea-theology',
      isbn: '978-9966805128',
      title: 'African Religions and Philosophy & Christian Context',
      author: 'Prof. John S. Mbiti',
      category: 'CHURCH_HISTORY',
      levelFocus: 'BACHELORS',
      totalCopies: 15,
      availableCopies: 9,
      shelfLocation: 'Aisle AF-1 (African Christianity)',
      digitalPdfAvailable: true,
      status: 'AVAILABLE'
    },
    {
      id: 'theo-lib-05',
      tenantId: 'tenant-berea-theology',
      isbn: '978-0801019623',
      title: 'The Moody Bible Commentary: Complete OT & NT Exegesis',
      author: 'Michael Rydelnik & Michael Vanlaningham',
      category: 'COMMENTARY',
      levelFocus: 'CERTIFICATE',
      totalCopies: 8,
      availableCopies: 3,
      shelfLocation: 'Reference Desk R-04',
      digitalPdfAvailable: true,
      status: 'AVAILABLE'
    }
  ],
  'tenant-injiri-nyeri': [
    {
      id: 'inj-lib-01',
      tenantId: 'tenant-injiri-nyeri',
      isbn: '978-0310286707',
      title: 'Systematic Theology: An Introduction to Biblical Doctrine',
      author: 'Wayne Grudem, Ph.D.',
      category: 'SYSTEMATIC_THEOLOGY',
      levelFocus: 'ALL_LEVELS',
      totalCopies: 14,
      availableCopies: 10,
      shelfLocation: 'Aisle T-1 (Systematic Theology)',
      digitalPdfAvailable: true,
      status: 'AVAILABLE'
    },
    {
      id: 'inj-lib-02',
      tenantId: 'tenant-injiri-nyeri',
      isbn: '978-0801021411',
      title: 'Basics of Biblical Greek Grammar & Syntax',
      author: 'William D. Mounce',
      category: 'BIBLICAL_LANGUAGES',
      levelFocus: 'BACHELORS',
      totalCopies: 18,
      availableCopies: 12,
      shelfLocation: 'Aisle L-1 (Biblical Languages)',
      digitalPdfAvailable: true,
      status: 'AVAILABLE'
    },
    {
      id: 'inj-lib-03',
      tenantId: 'tenant-injiri-nyeri',
      isbn: '978-9966805128',
      title: 'African Religions and Philosophy in Christian Ministry',
      author: 'Prof. John S. Mbiti',
      category: 'CHURCH_HISTORY',
      levelFocus: 'BACHELORS',
      totalCopies: 10,
      availableCopies: 7,
      shelfLocation: 'Aisle AF-1 (Africana)',
      digitalPdfAvailable: true,
      status: 'AVAILABLE'
    }
  ]
};

// ==========================================
// COLLEGE FEE STRUCTURES & FINANCIAL LEDGER
// ==========================================
export const INITIAL_COLLEGE_FEE_STRUCTURE: Record<string, CollegeFeeStructureItem[]> = {
  'tenant-berea-theology': [
    {
      id: 'cfs-01',
      tenantId: 'tenant-berea-theology',
      courseId: 'course-bth',
      courseName: 'Bachelor of Theology (B.Th)',
      level: 'DEGREE',
      yearOfStudy: 1,
      semester: 1,
      academicYear: '2024/2025',
      tuitionFee: 45000,
      labAndPracticalFee: 5000,
      libraryFee: 3000,
      studentActivityFee: 2000,
      examRegistrationFee: 3000,
      medicalCoverFee: 2000,
      hostelFee: 15000,
      totalSemesterFee: 75000
    },
    {
      id: 'cfs-02',
      tenantId: 'tenant-berea-theology',
      courseId: 'course-dip-theo',
      courseName: 'Diploma in Pastoral Theology & Ministry',
      level: 'DIPLOMA',
      yearOfStudy: 1,
      semester: 1,
      academicYear: '2024/2025',
      tuitionFee: 32000,
      labAndPracticalFee: 3000,
      libraryFee: 2500,
      studentActivityFee: 1500,
      examRegistrationFee: 2000,
      medicalCoverFee: 1500,
      hostelFee: 12000,
      totalSemesterFee: 54500
    }
  ]
};

export const INITIAL_COLLEGE_INVOICES: Record<string, CollegeInvoice[]> = {
  'tenant-berea-theology': [
    {
      id: 'cinv-01',
      tenantId: 'tenant-berea-theology',
      invoiceNo: 'INV-COL-2025-001',
      studentId: 'cstud-01',
      studentName: 'David Kiprono Cheruiyot',
      studentRegNo: 'BTH/2022/014',
      courseName: 'Bachelor of Theology (B.Th)',
      yearOfStudy: 3,
      semester: 1,
      academicYear: '2024/2025',
      items: [
        { description: 'Semester 1 Tuition', amount: 45000 },
        { description: 'Hebrew Exegesis Practical Lab', amount: 5000 },
        { description: 'Divinity Library Access', amount: 3000 },
        { description: 'Hostel Accommodation (Jerusalem Hall)', amount: 15000 }
      ],
      totalAmount: 68000,
      paidAmount: 53000,
      balance: 15000,
      dueDate: '2025-03-31',
      status: 'PARTIAL',
      createdAt: '2025-01-15'
    },
    {
      id: 'cinv-02',
      tenantId: 'tenant-berea-theology',
      invoiceNo: 'INV-COL-2025-002',
      studentId: 'cstud-02',
      studentName: 'Grace Wambui Njoroge',
      studentRegNo: 'DIP/2023/048',
      courseName: 'Diploma in Pastoral Theology & Ministry',
      yearOfStudy: 2,
      semester: 1,
      academicYear: '2024/2025',
      items: [
        { description: 'Semester 1 Tuition', amount: 32000 },
        { description: 'Homiletics Preaching Practicum', amount: 3000 },
        { description: 'Library & Online Journals', amount: 2500 },
        { description: 'Examination Registration', amount: 2000 }
      ],
      totalAmount: 39500,
      paidAmount: 39500,
      balance: 0,
      dueDate: '2025-03-31',
      status: 'PAID',
      createdAt: '2025-01-15'
    }
  ]
};

export const INITIAL_COLLEGE_PAYMENTS: Record<string, CollegePayment[]> = {
  'tenant-berea-theology': [
    {
      id: 'cpay-01',
      tenantId: 'tenant-berea-theology',
      receiptNo: 'REC-COL-8921',
      studentId: 'cstud-01',
      studentName: 'David Kiprono Cheruiyot',
      studentRegNo: 'BTH/2022/014',
      courseName: 'Bachelor of Theology (B.Th)',
      amount: 35000,
      paymentMethod: 'MPESA',
      transactionCode: 'SJK8294N10',
      paymentDate: '2025-01-20',
      academicYear: '2024/2025',
      semester: 1,
      recordedBy: 'Finance Dean',
      notes: 'Initial deposit via M-Pesa Paybill 400200',
      status: 'COMPLETED'
    },
    {
      id: 'cpay-02',
      tenantId: 'tenant-berea-theology',
      receiptNo: 'REC-COL-8922',
      studentId: 'cstud-01',
      studentName: 'David Kiprono Cheruiyot',
      studentRegNo: 'BTH/2022/014',
      courseName: 'Bachelor of Theology (B.Th)',
      amount: 18000,
      paymentMethod: 'HELB_LOAN',
      transactionCode: 'HELB-2025-BATCH01',
      paymentDate: '2025-02-10',
      academicYear: '2024/2025',
      semester: 1,
      recordedBy: 'Accounts Office',
      notes: 'HELB direct loan disbursement',
      status: 'COMPLETED'
    },
    {
      id: 'cpay-03',
      tenantId: 'tenant-berea-theology',
      receiptNo: 'REC-COL-8923',
      studentId: 'cstud-02',
      studentName: 'Grace Wambui Njoroge',
      studentRegNo: 'DIP/2023/048',
      courseName: 'Diploma in Pastoral Theology & Ministry',
      amount: 39500,
      paymentMethod: 'BANK_TRANSFER',
      transactionCode: 'KCB-TR-771890',
      bankName: 'KCB Bank Kenya',
      paymentDate: '2025-01-18',
      academicYear: '2024/2025',
      semester: 1,
      recordedBy: 'Cashier Desk',
      notes: 'Direct bank slip deposit',
      status: 'COMPLETED'
    }
  ]
};

// ==========================================
// THEOLOGY & DIVINITY SEMINARY FEES
// ==========================================
export const INITIAL_THEOLOGY_INVOICES: Record<string, TheologyInvoice[]> = {
  'tenant-berea-theology': [
    {
      id: 'tinv-01',
      tenantId: 'tenant-berea-theology',
      invoiceNo: 'T-INV-2025-001',
      invoiceNumber: 'T-INV-2025-001',
      studentId: 'tstud-01',
      studentName: 'Pastor Elijah Mutua Kivuva',
      studentRegNo: 'SPT/BTH/2022/001',
      programTitle: 'Bachelor of Theology (B.Th)',
      yearOfStudy: 3,
      semester: 1,
      academicYear: '2024/2025',
      tuitionAmount: 48000,
      practicumFee: 6000,
      ordinationLevy: 8000,
      sponsorDiscountOrBursary: 20000,
      totalAmount: 42000,
      paidAmount: 32000,
      totalBilled: 42000,
      totalPaid: 32000,
      balance: 10000,
      dueDate: '2025-03-25',
      status: 'PARTIAL',
      createdAt: '2025-01-10'
    },
    {
      id: 'tinv-02',
      tenantId: 'tenant-berea-theology',
      invoiceNo: 'T-INV-2025-002',
      invoiceNumber: 'T-INV-2025-002',
      studentId: 'tstud-02',
      studentName: 'Rev. Sister Mary Christine Achieng',
      studentRegNo: 'SPT/DIP/2023/015',
      programTitle: 'Diploma in Pastoral Ministry & Biblical Studies',
      yearOfStudy: 2,
      semester: 1,
      academicYear: '2024/2025',
      tuitionAmount: 32000,
      practicumFee: 4000,
      ordinationLevy: 0,
      sponsorDiscountOrBursary: 36000,
      totalAmount: 0,
      paidAmount: 0,
      totalBilled: 0,
      totalPaid: 0,
      balance: 0,
      dueDate: '2025-03-25',
      status: 'PAID',
      createdAt: '2025-01-10'
    }
  ],
  'tenant-injiri-nyeri': [
    {
      id: 'inj-inv-01',
      tenantId: 'tenant-injiri-nyeri',
      invoiceNo: 'INJ-INV-2025-001',
      invoiceNumber: 'INJ-INV-2025-001',
      studentId: 'inj-stud-01',
      studentName: 'Pastor Peter Mwangi Wachira',
      studentRegNo: 'INJ/BTH/2023/0012',
      programTitle: 'Bachelor of Theology (B.Th) Degree',
      yearOfStudy: 2,
      semester: 1,
      academicYear: '2024/2025',
      tuitionAmount: 48000,
      practicumFee: 5000,
      ordinationLevy: 5000,
      sponsorDiscountOrBursary: 10000,
      totalAmount: 48000,
      paidAmount: 36000,
      totalBilled: 48000,
      totalPaid: 36000,
      balance: 12000,
      dueDate: '2025-03-25',
      status: 'PARTIAL',
      createdAt: '2025-01-10'
    },
    {
      id: 'inj-inv-02',
      tenantId: 'tenant-injiri-nyeri',
      invoiceNo: 'INJ-INV-2025-002',
      invoiceNumber: 'INJ-INV-2025-002',
      studentId: 'inj-stud-02',
      studentName: 'Sister Grace Wambui Kariuki',
      studentRegNo: 'INJ/DIP/2024/0034',
      programTitle: 'Diploma in Theology & Pastoral Leadership',
      yearOfStudy: 1,
      semester: 2,
      academicYear: '2024/2025',
      tuitionAmount: 36000,
      practicumFee: 4000,
      ordinationLevy: 0,
      sponsorDiscountOrBursary: 40000,
      totalAmount: 0,
      paidAmount: 0,
      totalBilled: 0,
      totalPaid: 0,
      balance: 0,
      dueDate: '2025-03-25',
      status: 'PAID',
      createdAt: '2025-01-10'
    }
  ]
};

export const INITIAL_THEOLOGY_PAYMENTS: Record<string, TheologyFeePayment[]> = {
  'tenant-berea-theology': [
    {
      id: 'tpay-01',
      tenantId: 'tenant-berea-theology',
      receiptNo: 'T-REC-1049',
      studentId: 'tstud-01',
      studentName: 'Pastor Elijah Mutua Kivuva',
      studentRegNo: 'SPT/BTH/2022/001',
      programTitle: 'Bachelor of Theology (B.Th)',
      amount: 20000,
      paymentMethod: 'PARISH_SPONSORSHIP',
      transactionCode: 'AIC-MACHAKOS-CHQ881',
      sponsorOrDiocese: 'AIC Machakos Area Church Council',
      paymentCategory: 'TUITION',
      paymentDate: '2025-01-12',
      recordedBy: 'Seminary Bursar',
      notes: 'Parish sponsorship check for term 1',
      status: 'COMPLETED'
    },
    {
      id: 'tpay-02',
      tenantId: 'tenant-berea-theology',
      receiptNo: 'T-REC-1050',
      studentId: 'tstud-01',
      studentName: 'Pastor Elijah Mutua Kivuva',
      studentRegNo: 'SPT/BTH/2022/001',
      programTitle: 'Bachelor of Theology (B.Th)',
      amount: 12000,
      paymentMethod: 'MPESA',
      transactionCode: 'QKA81920L9',
      paymentCategory: 'ORDINATION_ROBES_VESTMENT',
      paymentDate: '2025-02-05',
      recordedBy: 'Registrar',
      notes: 'Ordination candidate stole & gown levy',
      status: 'COMPLETED'
    }
  ],
  'tenant-injiri-nyeri': [
    {
      id: 'inj-pay-01',
      tenantId: 'tenant-injiri-nyeri',
      receiptNo: 'INJ-REC-101',
      studentId: 'inj-stud-01',
      studentName: 'Pastor Peter Mwangi Wachira',
      studentRegNo: 'INJ/BTH/2023/0012',
      programTitle: 'Bachelor of Theology (B.Th) Degree',
      amount: 20000,
      paymentMethod: 'PARISH_SPONSORSHIP',
      transactionCode: 'FGCK-NYERI-CHQ442',
      sponsorOrDiocese: 'FGCK Nyeri Central Sub-District',
      paymentCategory: 'TUITION',
      paymentDate: '2025-01-14',
      recordedBy: 'Seminary Bursar',
      notes: 'Parish sponsorship grant for semester 1',
      status: 'COMPLETED'
    },
    {
      id: 'inj-pay-02',
      tenantId: 'tenant-injiri-nyeri',
      receiptNo: 'INJ-REC-102',
      studentId: 'inj-stud-01',
      studentName: 'Pastor Peter Mwangi Wachira',
      studentRegNo: 'INJ/BTH/2023/0012',
      programTitle: 'Bachelor of Theology (B.Th) Degree',
      amount: 16000,
      paymentMethod: 'MPESA',
      transactionCode: 'QKB92817A1',
      paymentCategory: 'TUITION',
      paymentDate: '2025-02-04',
      recordedBy: 'Registrar',
      notes: 'Direct personal M-Pesa tuition payment',
      status: 'COMPLETED'
    }
  ]
};

// ==========================================
// HOSPITAL & HEALTHCARE BILLING
// ==========================================
export const INITIAL_HOSPITAL_TARIFFS: Record<string, HospitalServiceTariff[]> = {
  'tenant-st-austins': [
    { id: 'tar-01', tenantId: 'tenant-st-austins', code: 'CON-GP', name: 'General Practitioner Doctor Consultation', category: 'CONSULTATION', standardPrice: 1500, insurancePrice: 2000, department: 'Outpatient' },
    { id: 'tar-02', tenantId: 'tenant-st-austins', code: 'CON-SPEC', name: 'Specialist Physician Consultation', category: 'CONSULTATION', standardPrice: 3500, insurancePrice: 4500, department: 'Specialized Clinic' },
    { id: 'tar-03', tenantId: 'tenant-st-austins', code: 'LAB-CBC', name: 'Full Blood Count (FBC / CBC)', category: 'LABORATORY', standardPrice: 1200, insurancePrice: 1500, department: 'Pathology Lab' },
    { id: 'tar-04', tenantId: 'tenant-st-austins', code: 'LAB-MAL', name: 'Malaria Rapid Diagnostic Test (mRDT)', category: 'LABORATORY', standardPrice: 600, insurancePrice: 800, department: 'Microbiology' },
    { id: 'tar-05', tenantId: 'tenant-st-austins', code: 'RAD-XRAY', name: 'Chest X-Ray (PA & Lateral)', category: 'RADIOLOGY', standardPrice: 2500, insurancePrice: 3000, department: 'Imaging' },
    { id: 'tar-06', tenantId: 'tenant-st-austins', code: 'BED-GEN', name: 'General Ward Inpatient Bed / Night', category: 'WARD_BED', standardPrice: 2800, insurancePrice: 3500, department: 'Inpatient Nursing' }
  ]
};

export const INITIAL_HOSPITAL_INVOICES: Record<string, HospitalBillingInvoice[]> = {
  'tenant-st-austins': [
    {
      id: 'hinv-01',
      tenantId: 'tenant-st-austins',
      invoiceNo: 'H-INV-2025-0101',
      patientId: 'pat-01',
      patientName: 'Grace Achieng Otieno',
      patientNo: 'PAT-2025-01',
      patientPhone: '0712345678',
      billingType: 'OUTPATIENT',
      items: [
        { id: 'item-1', description: 'Doctor Consultation (GP)', category: 'CONSULTATION', quantity: 1, unitPrice: 1500, total: 1500 },
        { id: 'item-2', description: 'Full Blood Count (CBC)', category: 'LABORATORY', quantity: 1, unitPrice: 1200, total: 1200 },
        { id: 'item-3', description: 'Amoxicillin 500mg (20 Caps)', category: 'PHARMACY', quantity: 1, unitPrice: 800, total: 800 }
      ],
      subtotal: 3500,
      nhifOrInsuranceCovered: 2500,
      insuranceProvider: 'NHIF / SHA Civil Servants Scheme',
      insurancePolicyOrClaimNo: 'SHA-CLAIM-88910',
      patientPayableAmount: 1000,
      paidAmount: 1000,
      balance: 0,
      status: 'PAID',
      invoiceDate: '2025-02-15',
      doctorName: 'Dr. Sarah Kamau, MD'
    },
    {
      id: 'hinv-02',
      tenantId: 'tenant-st-austins',
      invoiceNo: 'H-INV-2025-0102',
      patientId: 'pat-02',
      patientName: 'Samuel Maina Mwangi',
      patientNo: 'PAT-2025-02',
      patientPhone: '0722998877',
      billingType: 'OUTPATIENT',
      items: [
        { id: 'item-4', description: 'Emergency Triage & Consultation', category: 'CONSULTATION', quantity: 1, unitPrice: 2000, total: 2000 },
        { id: 'item-5', description: 'Wound Dressing & Suturing Kit', category: 'PROCEDURE', quantity: 1, unitPrice: 3500, total: 3500 },
        { id: 'item-6', description: 'Tetanus Toxoid Vaccine & Antibiotics', category: 'PHARMACY', quantity: 1, unitPrice: 1500, total: 1500 }
      ],
      subtotal: 7000,
      nhifOrInsuranceCovered: 0,
      patientPayableAmount: 7000,
      paidAmount: 4000,
      balance: 3000,
      status: 'PARTIAL',
      invoiceDate: '2025-02-20',
      doctorName: 'Dr. Patrick Odhiambo'
    }
  ]
};

export const INITIAL_HOSPITAL_PAYMENTS: Record<string, HospitalBillingPayment[]> = {
  'tenant-st-austins': [
    {
      id: 'hpay-01',
      tenantId: 'tenant-st-austins',
      receiptNo: 'H-REC-5001',
      invoiceId: 'hinv-01',
      patientId: 'pat-01',
      patientName: 'Grace Achieng Otieno',
      patientNo: 'PAT-2025-01',
      amount: 1000,
      paymentMethod: 'MPESA',
      transactionCode: 'RK8192A01X',
      paymentDate: '2025-02-15',
      cashierName: 'Hospital Cashier Desk 1',
      notes: 'Outpatient copay settlement',
      status: 'COMPLETED'
    },
    {
      id: 'hpay-02',
      tenantId: 'tenant-st-austins',
      receiptNo: 'H-REC-5002',
      invoiceId: 'hinv-02',
      patientId: 'pat-02',
      patientName: 'Samuel Maina Mwangi',
      patientNo: 'PAT-2025-02',
      amount: 4000,
      paymentMethod: 'CASH',
      transactionCode: 'CASH-REC-0028',
      paymentDate: '2025-02-20',
      cashierName: 'Emergency Triage Cashier',
      notes: 'Partial emergency procedure deposit',
      status: 'COMPLETED'
    }
  ]
};

// ==========================================
// RETAIL INVOICES & CUSTOMER DEBTOR PAYMENTS
// ==========================================
export const INITIAL_RETAIL_INVOICES: Record<string, RetailCustomerInvoice[]> = {
  'tenant-st-austins': [
    {
      id: 'rinv-01',
      tenantId: 'tenant-st-austins',
      invoiceNo: 'R-INV-2025-001',
      customerId: 'cust-01',
      customerName: 'Mama Lucy Wholesalers',
      customerPhone: '0711223344',
      customerType: 'WHOLESALE',
      items: [
        { productId: 'prod-01', productName: 'Maize Flour 2kg Pack (Bundle of 12)', sku: 'SKU-MZ-01', quantity: 10, unitPrice: 2200, discount: 500, lineTotal: 21500 },
        { productId: 'prod-02', productName: 'Pure Cooking Oil 5L Can', sku: 'SKU-OIL-05', quantity: 5, unitPrice: 1450, discount: 0, lineTotal: 7250 }
      ],
      subtotal: 28750,
      taxAmount: 4600,
      discountAmount: 500,
      totalAmount: 32850,
      amountPaid: 20000,
      balanceDue: 12850,
      paymentTerms: 'NET_30',
      dueDate: '2025-03-15',
      issueDate: '2025-02-15',
      status: 'PARTIAL'
    }
  ]
};

export const INITIAL_RETAIL_PAYMENTS: Record<string, RetailCustomerPayment[]> = {
  'tenant-st-austins': [
    {
      id: 'rpay-01',
      tenantId: 'tenant-st-austins',
      receiptNo: 'R-REC-7001',
      customerId: 'cust-01',
      customerName: 'Mama Lucy Wholesalers',
      invoiceId: 'rinv-01',
      amount: 20000,
      paymentMethod: 'MPESA',
      transactionCode: 'TKA8892019',
      paymentDate: '2025-02-18',
      receivedBy: 'Store Manager',
      notes: 'Partial payment on invoice R-INV-2025-001',
      status: 'COMPLETED'
    }
  ]
};
