import { Tenant, TenantWebsiteConfig, TenantWebsitePage, TenantWebsiteSection } from '../types';
import { normalizeTenantType } from './ModuleRegistry';

/**
 * Generates a complete, modern, professional public website configuration
 * customized to the tenant's exact type, branding, colors, and business domain.
 */
export function generateDefaultWebsiteConfig(tenant: Tenant): TenantWebsiteConfig {
  const tType = normalizeTenantType(tenant.type);
  const primaryColor = tenant.primaryColor || (
    tType === 'HOSPITAL' ? '#0284c7' :
    tType === 'THEOLOGICAL' ? '#d97706' :
    tType === 'BUSINESS' ? '#059669' :
    tType === 'COLLEGE' ? '#4f46e5' : '#2563eb'
  );
  const secondaryColor = tenant.secondaryColor || '#0f172a';

  let pages: TenantWebsitePage[] = [];

  if (tType === 'HOSPITAL') {
    pages = [
      {
        id: 'page-home',
        slug: 'home',
        title: 'Home',
        isPublished: true,
        navOrder: 1,
        showInNav: true,
        metaDescription: `Welcome to ${tenant.name} - Quality, compassionate healthcare for all.`,
        sections: [
          {
            id: 'sec-hero',
            type: 'hero',
            title: `Excellence in Compassionate Healthcare`,
            subtitle: `${tenant.name} provides 24/7 emergency medical care, specialist outpatient clinics, advanced diagnostic imaging, and pharmacy services.`,
            imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
            buttonText: 'Book Consultation',
            buttonLink: '#contact',
            secondaryButtonText: 'Our Clinical Services',
            secondaryButtonLink: '#services',
            isVisible: true,
            order: 1
          },
          {
            id: 'sec-stats',
            type: 'stats',
            title: 'Our Clinical Impact',
            isVisible: true,
            order: 2,
            items: [
              { id: 'stat-1', title: '24/7', description: 'Emergency & Triage Care', icon: 'Clock' },
              { id: 'stat-2', title: '45+', description: 'Specialist Physicians & Surgeons', icon: 'Award' },
              { id: 'stat-3', title: '99.4%', description: 'Patient Recovery & Satisfaction', icon: 'Heart' },
              { id: 'stat-4', title: 'SHA / NHIF', description: 'Accredited Insurance Partners', icon: 'ShieldCheck' }
            ]
          },
          {
            id: 'sec-services',
            type: 'services',
            title: 'Comprehensive Medical Services',
            subtitle: 'Modern clinical facilities backed by experienced healthcare professionals.',
            isVisible: true,
            order: 3,
            items: [
              {
                id: 'srv-1',
                title: 'Outpatient Consultations',
                description: 'General practitioners and pediatricians available daily for consultations, wellness checkups and prescriptions.',
                icon: 'Stethoscope'
              },
              {
                id: 'srv-2',
                title: '24-Hour Pharmacy',
                description: 'Fully stocked inpatient and outpatient pharmacy dispensing certified genuine pharmaceutical drugs.',
                icon: 'Pill'
              },
              {
                id: 'srv-3',
                title: 'Laboratory & Diagnostic Center',
                description: 'Automated pathology testing, hematology, biochemistry, digital X-Ray, and ultrasound scanning.',
                icon: 'Activity'
              },
              {
                id: 'srv-4',
                title: 'Inpatient & Maternity Ward',
                description: 'Comfortable private and semi-private recovery rooms equipped with skilled obstetricians and neonatal care.',
                icon: 'Bed'
              }
            ]
          },
          {
            id: 'sec-about',
            type: 'about',
            title: `About ${tenant.name}`,
            subtitle: 'Dedicated to healing, saving lives, and promoting community wellness.',
            content: `${tenant.name} was established to deliver international standards of patient-centric medical treatment. Our multi-disciplinary clinical team embraces cutting-edge medical technology with warmth and integrity.`,
            imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
            buttonText: 'Read Our Mission',
            buttonLink: '#about',
            isVisible: true,
            order: 4
          },
          {
            id: 'sec-contact',
            type: 'contact',
            title: 'Contact Our Medical Center',
            subtitle: 'Emergency hotline, clinic appointment booking, and location details.',
            isVisible: true,
            order: 5
          }
        ]
      },
      {
        id: 'page-about',
        slug: 'about',
        title: 'About Us',
        isPublished: true,
        navOrder: 2,
        showInNav: true,
        metaDescription: `Discover the history, leadership, and mission of ${tenant.name}.`,
        sections: [
          {
            id: 'sec-about-main',
            type: 'about',
            title: 'Our Story & Healthcare Vision',
            subtitle: 'Providing reliable, patient-centered clinical excellence across the region.',
            content: `${tenant.name} operates with a commitment to providing accessible, high-standard healthcare. We integrate preventive care, diagnostic precision, and compassionate post-op care under one roof.`,
            imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
            isVisible: true,
            order: 1
          }
        ]
      },
      {
        id: 'page-services',
        slug: 'services',
        title: 'Specialties',
        isPublished: true,
        navOrder: 3,
        showInNav: true,
        sections: [
          {
            id: 'sec-all-services',
            type: 'services',
            title: 'Medical Specialties & Diagnostic Units',
            subtitle: 'Specialized clinics delivered by registered consultants.',
            isVisible: true,
            order: 1,
            items: [
              { id: 'sp-1', title: 'Cardiology & Hypertension', description: 'Preventive cardiovascular screening and ECG analysis.' },
              { id: 'sp-2', title: 'Pediatrics & Child Wellness', description: 'Immunization clinics, nutritional assessment, and growth monitoring.' },
              { id: 'sp-3', title: 'Orthopedics & Trauma', description: 'Fracture management, joint rehabilitation, and surgical care.' },
              { id: 'sp-4', title: 'Dental & Optical Clinic', description: 'Routine dental cleanings, extractions, eye examinations, and spectacles.' }
            ]
          }
        ]
      },
      {
        id: 'page-contact',
        slug: 'contact',
        title: 'Contact & Appointments',
        isPublished: true,
        navOrder: 4,
        showInNav: true,
        sections: [
          {
            id: 'sec-contact-page',
            type: 'contact',
            title: 'Reach Out to Our Hospital Desk',
            subtitle: 'Call our 24/7 reception or book a doctor appointment online.',
            isVisible: true,
            order: 1
          }
        ]
      }
    ];
  } else if (tType === 'BUSINESS') {
    pages = [
      {
        id: 'page-home',
        slug: 'home',
        title: 'Home',
        isPublished: true,
        navOrder: 1,
        showInNav: true,
        sections: [
          {
            id: 'sec-hero',
            type: 'hero',
            title: `Quality Groceries, Wholesale & Fresh Essentials`,
            subtitle: `Welcome to ${tenant.name}. We supply premium household goods, fresh farm produce, beverages, and bulk wholesale supplies with instant M-Pesa payment and express delivery.`,
            imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
            buttonText: 'Browse Catalog',
            buttonLink: '#products',
            secondaryButtonText: 'Wholesale Inquiries',
            secondaryButtonLink: '#contact',
            isVisible: true,
            order: 1
          },
          {
            id: 'sec-products',
            type: 'products',
            title: 'Featured Store Categories',
            subtitle: 'Unbeatable retail prices and wholesale pallet deals direct to your door.',
            isVisible: true,
            order: 2,
            items: [
              { id: 'pr-1', title: 'Fresh Produce & Bakery', description: 'Daily harvested vegetables, farm fresh fruits, artisan bread & pastries.', price: 'From KSh 80', badge: 'Daily Fresh' },
              { id: 'pr-2', title: 'Pantry, Grains & Cereals', description: 'Premium rice, fortified flour, cooking oils, and sugar in retail and 50kg bags.', price: 'Best Price', badge: 'Wholesale' },
              { id: 'pr-3', title: 'Dairy & Chilled Beverages', description: 'Fresh milk, yogurts, cheeses, juices, soft drinks, and mineral water.', price: 'Cold & Fresh', badge: 'Popular' },
              { id: 'pr-4', title: 'Household & Toiletries', description: 'Detergents, disinfectants, paper products, and personal hygiene supplies.', price: 'Value Packs', badge: 'Top Seller' }
            ]
          },
          {
            id: 'sec-stats',
            type: 'stats',
            title: 'Why Shop With Us',
            isVisible: true,
            order: 3,
            items: [
              { id: 'st-1', title: '5,000+', description: 'Genuine Products in Stock', icon: 'Package' },
              { id: 'st-2', title: '100% Secure', description: 'Instant M-Pesa & Card Checkout', icon: 'CreditCard' },
              { id: 'st-3', title: 'Fast Delivery', description: 'Same-Day Regional Dispatch', icon: 'Truck' },
              { id: 'st-4', title: 'Best Wholesale', description: 'Discounted Bulk Pricing', icon: 'TrendingUp' }
            ]
          },
          {
            id: 'sec-about',
            type: 'about',
            title: `About ${tenant.name}`,
            subtitle: 'Serving local households and commercial buyers with integrity.',
            content: `${tenant.name} is dedicated to offering fair, competitive retail and wholesale prices with friendly customer service. We partner directly with verified farmers and leading FMCG manufacturers.`,
            imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
            isVisible: true,
            order: 4
          },
          {
            id: 'sec-contact',
            type: 'contact',
            title: 'Visit Our Store or Request Quotation',
            subtitle: 'Convenient opening hours and direct phone customer support.',
            isVisible: true,
            order: 5
          }
        ]
      },
      {
        id: 'page-products',
        slug: 'products',
        title: 'Products & Wholesale',
        isPublished: true,
        navOrder: 2,
        showInNav: true,
        sections: [
          {
            id: 'sec-catalog',
            type: 'products',
            title: 'Wholesale & Retail Catalog',
            subtitle: 'Explore our product inventory and place bulk orders.',
            isVisible: true,
            order: 1
          }
        ]
      },
      {
        id: 'page-contact',
        slug: 'contact',
        title: 'Contact Us',
        isPublished: true,
        navOrder: 3,
        showInNav: true,
        sections: [
          {
            id: 'sec-contact',
            type: 'contact',
            title: 'Store Location & Orders',
            subtitle: 'We are ready to serve you.',
            isVisible: true,
            order: 1
          }
        ]
      }
    ];
  } else if (tType === 'THEOLOGICAL') {
    pages = [
      {
        id: 'page-home',
        slug: 'home',
        title: 'Home',
        isPublished: true,
        navOrder: 1,
        showInNav: true,
        sections: [
          {
            id: 'sec-hero',
            type: 'hero',
            title: `Equipping Ministers for Biblical Leadership`,
            subtitle: `${tenant.name} is dedicated to rigorous theological education, sound doctrine, spiritual formation, and practical pastoral ministry leadership.`,
            imageUrl: 'https://images.unsplash.com/photo-1548625361-195feee10fce?w=1200&auto=format&fit=crop&q=80',
            buttonText: 'Enroll in Divinity',
            buttonLink: '#admissions',
            secondaryButtonText: 'Theology Programs',
            secondaryButtonLink: '#services',
            isVisible: true,
            order: 1
          },
          {
            id: 'sec-services',
            type: 'services',
            title: 'Theological Degree & Certificate Programs',
            subtitle: 'Accredited curricula designed for church leaders, chaplains, and missionaries.',
            isVisible: true,
            order: 2,
            items: [
              { id: 'th-1', title: 'Certificate in Christian Ministry', description: 'Foundations of biblical hermeneutics, evangelism, and discipleship for lay leaders.' },
              { id: 'th-2', title: 'Diploma in Biblical Theology', description: 'Comprehensive Old & New Testament survey, systematic theology, and church history.' },
              { id: 'th-3', title: 'Bachelor of Theology (B.Th.)', description: 'Advanced biblical languages (Greek & Hebrew), pastoral counseling, and church administration.' },
              { id: 'th-4', title: 'Field Ministry Practicum', description: 'Supervised preaching, pastoral care in rural and urban congregations, and community outreach.' }
            ]
          },
          {
            id: 'sec-about',
            type: 'about',
            title: `Seminary Heritage & Statement of Faith`,
            subtitle: 'Uncompromising dedication to the Word of God and transforming communities.',
            content: `${tenant.name} stands as a beacon of evangelical truth, pastoral mentoring, and academic excellence in the Mount Kenya region and beyond.`,
            imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
            isVisible: true,
            order: 3
          },
          {
            id: 'sec-contact',
            type: 'contact',
            title: 'Seminary Admissions Office',
            subtitle: 'Reach out to our registrar for intake details and academic schedules.',
            isVisible: true,
            order: 4
          }
        ]
      },
      {
        id: 'page-programs',
        slug: 'programs',
        title: 'Programs & Faculty',
        isPublished: true,
        navOrder: 2,
        showInNav: true,
        sections: [
          {
            id: 'sec-progs',
            type: 'services',
            title: 'Seminary Academic Programs',
            subtitle: 'Rooted in Scripture, grounded in history, and relevant for contemporary pastoral challenges.',
            isVisible: true,
            order: 1
          }
        ]
      },
      {
        id: 'page-contact',
        slug: 'contact',
        title: 'Admissions & Inquiries',
        isPublished: true,
        navOrder: 3,
        showInNav: true,
        sections: [
          {
            id: 'sec-contact',
            type: 'contact',
            title: 'Get in Touch With Admissions',
            subtitle: 'Apply for the upcoming intake or schedule a campus visit.',
            isVisible: true,
            order: 1
          }
        ]
      }
    ];
  } else if (tType === 'COLLEGE') {
    pages = [
      {
        id: 'page-home',
        slug: 'home',
        title: 'Home',
        isPublished: true,
        navOrder: 1,
        showInNav: true,
        sections: [
          {
            id: 'sec-hero',
            type: 'hero',
            title: `Empowering Future Leaders & Innovators`,
            subtitle: `Join ${tenant.name} for career-ready Diploma, Certificate, and Degree programs in Business, Technology, Engineering, and Hospitality.`,
            imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
            buttonText: 'Apply for Admission',
            buttonLink: '#admissions',
            secondaryButtonText: 'Explore Courses',
            secondaryButtonLink: '#services',
            isVisible: true,
            order: 1
          },
          {
            id: 'sec-stats',
            type: 'stats',
            title: 'Academic Excellence in Numbers',
            isVisible: true,
            order: 2,
            items: [
              { id: 'cst-1', title: '98%', description: 'Graduate Employment & Internship Rate', icon: 'Briefcase' },
              { id: 'cst-2', title: '25+', description: 'Accredited TVET & University Pathways', icon: 'Award' },
              { id: 'cst-3', title: '4 Modern Labs', description: 'ICT, Science & Culinary Facilities', icon: 'Cpu' },
              { id: 'cst-4', title: 'KUCCPS & Direct', description: 'Flexible Intake Modes', icon: 'CheckCircle' }
            ]
          },
          {
            id: 'sec-services',
            type: 'services',
            title: 'Faculties & Academic Programs',
            subtitle: 'Hands-on practical training taught by industry experienced faculty.',
            isVisible: true,
            order: 3,
            items: [
              { id: 'cp-1', title: 'School of Computing & IT', description: 'Software Engineering, Cyber Security, Data Science, and Computer Hardware Systems.' },
              { id: 'cp-2', title: 'School of Business & Accounting', description: 'CPA/ACCA, Business Administration, Supply Chain Management, and Human Resources.' },
              { id: 'cp-3', title: 'School of Hospitality & Tourism', description: 'Food & Beverage Production, Hotel Operations, and Tourism Management.' },
              { id: 'cp-4', title: 'Engineering & Technical Trades', description: 'Electrical Installation, Automotive Engineering, and Plumbing.' }
            ]
          },
          {
            id: 'sec-about',
            type: 'about',
            title: `Why Choose ${tenant.name}`,
            subtitle: 'Holistic student campus life, sports, hostels, and modern libraries.',
            content: `${tenant.name} bridges the gap between classroom theory and real industry requirements. We partner with over 60 corporate employers to ensure our students graduate with job-ready portfolios.`,
            imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
            isVisible: true,
            order: 4
          },
          {
            id: 'sec-contact',
            type: 'contact',
            title: 'Campus Admissions & Inquiries',
            subtitle: 'Start your enrollment application or contact the registrar today.',
            isVisible: true,
            order: 5
          }
        ]
      },
      {
        id: 'page-programs',
        slug: 'courses',
        title: 'Courses & Fees',
        isPublished: true,
        navOrder: 2,
        showInNav: true,
        sections: [
          {
            id: 'sec-course-list',
            type: 'services',
            title: 'Full Course Directory',
            subtitle: 'View our curriculum, duration, semester entry requirements, and fee schedules.',
            isVisible: true,
            order: 1
          }
        ]
      },
      {
        id: 'page-contact',
        slug: 'contact',
        title: 'Contact Campus',
        isPublished: true,
        navOrder: 3,
        showInNav: true,
        sections: [
          {
            id: 'sec-campus-contact',
            type: 'contact',
            title: 'Visit Our Campus',
            subtitle: 'We are situated in a serene environment conducive to higher learning.',
            isVisible: true,
            order: 1
          }
        ]
      }
    ];
  } else {
    // School default (PRIMARY_SCHOOL, SECONDARY_SCHOOL, etc.)
    pages = [
      {
        id: 'page-home',
        slug: 'home',
        title: 'Home',
        isPublished: true,
        navOrder: 1,
        showInNav: true,
        sections: [
          {
            id: 'sec-hero',
            type: 'hero',
            title: `Nurturing Character, Leadership & CBC Competence`,
            subtitle: `Welcome to ${tenant.name}. We provide a stimulating, values-based learning environment fostering academic distinction, digital literacy, and creative talents from Early Years to Junior School.`,
            imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&auto=format&fit=crop&q=80',
            buttonText: 'Admissions Open',
            buttonLink: '#admissions',
            secondaryButtonText: 'Explore Academics',
            secondaryButtonLink: '#services',
            isVisible: true,
            order: 1
          },
          {
            id: 'sec-stats',
            type: 'stats',
            title: 'Our School at a Glance',
            isVisible: true,
            order: 2,
            items: [
              { id: 'st-1', title: '100%', description: 'CBC Transition to Junior Secondary', icon: 'GraduationCap' },
              { id: 'st-2', title: '1 : 18', description: 'Low Teacher-to-Learner Ratio', icon: 'Users' },
              { id: 'st-3', title: '14+', description: 'Co-curricular Sports & Talent Clubs', icon: 'Award' },
              { id: 'st-4', title: 'Smart Campus', description: 'ICT Computer Labs & Science STEAM', icon: 'Cpu' }
            ]
          },
          {
            id: 'sec-services',
            type: 'services',
            title: 'CBC Academic Levels & Pathways',
            subtitle: 'Comprehensive Competency-Based Curriculum designed for holistic student growth.',
            isVisible: true,
            order: 3,
            items: [
              {
                id: 'sc-1',
                title: 'Early Years (Playgroup, PP1 & PP2)',
                description: 'Child-centered discovery, psychomotor activities, phonics foundations, and creative arts in a safe environment.'
              },
              {
                id: 'sc-2',
                title: 'Lower Primary (Grade 1 to 3)',
                description: 'Numeracy, literacy, indigenous language, environmental studies, and social hygiene competencies.'
              },
              {
                id: 'sc-3',
                title: 'Middle Primary (Grade 4 to 6)',
                description: 'Science & Technology, Agriculture, Social Studies, Christian/Religious Education, and Home Science.'
              },
              {
                id: 'sc-4',
                title: 'Junior Secondary School (Grade 7 to 9)',
                description: 'Integrated Science, Pre-Technical Studies, Visual & Performing Arts, Foreign Languages, and Career Mentorship.'
              }
            ]
          },
          {
            id: 'sec-about',
            type: 'about',
            title: `About ${tenant.name}`,
            subtitle: tenant.motto || 'Excellence in holistic development and disciplined leadership.',
            content: `${tenant.name} was established with a singular vision: to shape young minds into responsible, capable global citizens. We balance rigorous academic standards with rich extracurricular sports, music, debate, robotics, and spiritual growth.`,
            imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
            buttonText: 'Learn More About Us',
            buttonLink: '#about',
            isVisible: true,
            order: 4
          },
          {
            id: 'sec-contact',
            type: 'contact',
            title: 'School Admissions & Inquiries',
            subtitle: 'Schedule a school tour or speak with our admissions registrar.',
            isVisible: true,
            order: 5
          }
        ]
      },
      {
        id: 'page-about',
        slug: 'about',
        title: 'About Us',
        isPublished: true,
        navOrder: 2,
        showInNav: true,
        sections: [
          {
            id: 'sec-about-main',
            type: 'about',
            title: 'Our Heritage, Mission & Values',
            subtitle: 'Rooted in integrity, driven by academic innovation.',
            content: `At ${tenant.name}, we believe every learner has unique potential. Our dedicated teaching faculty fosters curiosity, critical problem solving, and moral character.`,
            imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
            isVisible: true,
            order: 1
          }
        ]
      },
      {
        id: 'page-academics',
        slug: 'academics',
        title: 'Academics & CBC',
        isPublished: true,
        navOrder: 3,
        showInNav: true,
        sections: [
          {
            id: 'sec-academics-detail',
            type: 'services',
            title: 'Curriculum & Co-Curricular Excellence',
            subtitle: 'From the classroom to the sports fields, music festivals, and innovation fairs.',
            isVisible: true,
            order: 1
          }
        ]
      },
      {
        id: 'page-contact',
        slug: 'contact',
        title: 'Contact & Admissions',
        isPublished: true,
        navOrder: 4,
        showInNav: true,
        sections: [
          {
            id: 'sec-contact-main',
            type: 'contact',
            title: 'Enroll Your Child Today',
            subtitle: 'Our admissions desk is open Monday to Friday, 8:00 AM - 5:00 PM.',
            isVisible: true,
            order: 1
          }
        ]
      }
    ];
  }

  return {
    tenantId: tenant.id,
    isPublished: true,
    displayPlatformBranding: false, // MANDATORY: Strictly no DAVETECH branding unless explicitly turned on
    theme: {
      primaryColor,
      secondaryColor,
      accentColor: '#10b981',
      fontFamily: 'sans',
      heroLayout: 'split'
    },
    navigation: {
      logoUrl: tenant.logoUrl,
      brandName: tenant.name,
      tagline: tenant.motto || '',
      ctaButtonText: tType === 'HOSPITAL' ? 'Book Consultation' : tType === 'BUSINESS' ? 'Shop Online' : 'Apply for Admission',
      ctaButtonLink: '#contact'
    },
    contact: {
      email: tenant.contactEmail || `info@${tenant.subdomain}.ke`,
      phone: tenant.phone || '+254 700 000 000',
      address: tenant.address || 'Nairobi, Kenya',
      openingHours: tType === 'HOSPITAL' ? 'Open 24 Hours / 7 Days a Week' : 'Mon - Sat: 8:00 AM - 5:00 PM',
      socialLinks: {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        whatsapp: `https://wa.me/${(tenant.phone || '').replace(/[^0-9]/g, '')}`
      }
    },
    pages,
    updatedAt: new Date().toISOString()
  };
}
