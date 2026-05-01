'use server';

import { instance } from '../instance';

const API_URL =
  process.env.COMMON_SERVICE || process.env.API_URL || 'http://localhost:5002';

// Original dummy data for demo
// FLOW TRACKING: Kinley Tshering Wangchuk goes through all stages
const originalDeathApplications = [
  // STAGE 1: SUBMITTED - Appears in VERIFY page
  {
    id: '1',
    deceased_cid: '11203045678',
    applicant_cid: '11203098765',
    first_name: 'Kinley',
    middle_name: 'Tshering',
    last_name: 'Wangchuk',
    date_of_birth: '1955-03-20',
    date_of_death: '2024-10-05',
    time_of_death: '15:45',
    place_of_birth: 'Jigme Dorji Wangchuck National Referral Hospital',
    cause_of_death: 'Natural causes - Cardiac arrest',
    gender: 'Male',
    father_name: 'Phuntsho Dorji',
    father_cid: '11203012345',
    mother_name: 'Pema Lhamo',
    mother_cid: '11203012346',
    house_hold_no: 'HH-DEATH-FLOW-888',
    house_no: 'H-888',
    dzongkhag_id: '1',
    dzongkhag_name: 'Thimphu',
    gewog_id: '1',
    gewog_name: 'Kawang Jangsa',
    chiwog_id: '1',
    chiwog_name: 'Upper Motithang',
    village_id: '1',
    village_name: 'Motithang',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '1',
    dzongkhag_of_death_name: 'Thimphu',
    gewog_of_death_id: '1',
    gewog_of_death_name: 'Kawang Jangsa',
    village_of_death_id: '1',
    village_of_death_name: 'Motithang',
    city_id: '1',
    city_name: 'Thimphu City',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'SUBMITTED',
    createdAt: '2024-10-06T08:00:00Z',
    remarks: 'New application - pending verification',
    assigned: false
  },
  // STAGE 2: VERIFIED - Appears in ENDORSE page
  {
    id: '2',
    deceased_cid: '11203045678',
    applicant_cid: '11203098765',
    first_name: 'Kinley',
    middle_name: 'Tshering',
    last_name: 'Wangchuk',
    date_of_birth: '1955-03-20',
    date_of_death: '2024-10-05',
    time_of_death: '15:45',
    place_of_birth: 'Jigme Dorji Wangchuck National Referral Hospital',
    cause_of_death: 'Natural causes - Cardiac arrest',
    gender: 'Male',
    father_name: 'Phuntsho Dorji',
    father_cid: '11203012345',
    mother_name: 'Pema Lhamo',
    mother_cid: '11203012346',
    house_hold_no: 'HH-DEATH-FLOW-888',
    house_no: 'H-888',
    dzongkhag_id: '1',
    dzongkhag_name: 'Thimphu',
    gewog_id: '1',
    gewog_name: 'Kawang Jangsa',
    chiwog_id: '1',
    chiwog_name: 'Upper Motithang',
    village_id: '1',
    village_name: 'Motithang',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '1',
    dzongkhag_of_death_name: 'Thimphu',
    gewog_of_death_id: '1',
    gewog_of_death_name: 'Kawang Jangsa',
    village_of_death_id: '1',
    village_of_death_name: 'Motithang',
    city_id: '1',
    city_name: 'Thimphu City',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'VERIFIED',
    createdAt: '2024-10-06T08:00:00Z',
    updatedAt: '2024-10-07T10:15:00Z',
    remarks: 'Documents verified by verifier',
    assigned: false
  },
  // STAGE 3: ENDORSED - Appears in APPROVE page
  {
    id: '3',
    deceased_cid: '11203045678',
    applicant_cid: '11203098765',
    first_name: 'Kinley',
    middle_name: 'Tshering',
    last_name: 'Wangchuk',
    date_of_birth: '1955-03-20',
    date_of_death: '2024-10-05',
    time_of_death: '15:45',
    place_of_birth: 'Jigme Dorji Wangchuck National Referral Hospital',
    cause_of_death: 'Natural causes - Cardiac arrest',
    gender: 'Male',
    father_name: 'Phuntsho Dorji',
    father_cid: '11203012345',
    mother_name: 'Pema Lhamo',
    mother_cid: '11203012346',
    house_hold_no: 'HH-DEATH-FLOW-888',
    house_no: 'H-888',
    dzongkhag_id: '1',
    dzongkhag_name: 'Thimphu',
    gewog_id: '1',
    gewog_name: 'Kawang Jangsa',
    chiwog_id: '1',
    chiwog_name: 'Upper Motithang',
    village_id: '1',
    village_name: 'Motithang',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '1',
    dzongkhag_of_death_name: 'Thimphu',
    gewog_of_death_id: '1',
    gewog_of_death_name: 'Kawang Jangsa',
    village_of_death_id: '1',
    village_of_death_name: 'Motithang',
    city_id: '1',
    city_name: 'Thimphu City',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'ENDORSED',
    createdAt: '2024-10-06T08:00:00Z',
    updatedAt: '2024-10-08T14:30:00Z',
    remarks: 'Endorsed by local authority',
    assigned: false
  },
  // STAGE 4: APPROVED - Appears in MY APPROVE LIST
  {
    id: '4',
    deceased_cid: '11203045678',
    applicant_cid: '11203098765',
    first_name: 'Kinley',
    middle_name: 'Tshering',
    last_name: 'Wangchuk',
    date_of_birth: '1955-03-20',
    date_of_death: '2024-10-05',
    time_of_death: '15:45',
    place_of_birth: 'Jigme Dorji Wangchuck National Referral Hospital',
    cause_of_death: 'Natural causes - Cardiac arrest',
    gender: 'Male',
    father_name: 'Phuntsho Dorji',
    father_cid: '11203012345',
    mother_name: 'Pema Lhamo',
    mother_cid: '11203012346',
    house_hold_no: 'HH-DEATH-FLOW-888',
    house_no: 'H-888',
    dzongkhag_id: '1',
    dzongkhag_name: 'Thimphu',
    gewog_id: '1',
    gewog_name: 'Kawang Jangsa',
    chiwog_id: '1',
    chiwog_name: 'Upper Motithang',
    village_id: '1',
    village_name: 'Motithang',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '1',
    dzongkhag_of_death_name: 'Thimphu',
    gewog_of_death_id: '1',
    gewog_of_death_name: 'Kawang Jangsa',
    village_of_death_id: '1',
    village_of_death_name: 'Motithang',
    city_id: '1',
    city_name: 'Thimphu City',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'ENDORSED',
    createdAt: '2024-10-06T08:00:00Z',
    updatedAt: '2024-10-09T16:00:00Z',
    remarks: 'Endorsed by local authority - ready for approval',
    assigned: true
  },
  // Additional entries for variety
  {
    id: '5',
    deceased_cid: '10304002004',
    applicant_cid: '10304002005',
    first_name: 'Sonam',
    middle_name: 'Tshering',
    last_name: 'Deki',
    date_of_birth: '1975-08-22',
    date_of_death: '2024-02-25',
    time_of_death: '09:15',
    place_of_death: 'Paro Hospital',
    cause_of_death: 'Cardiac arrest',
    gender: 'Female',
    father_name: 'Tshewang Dorji',
    father_cid: '10304002005',
    mother_name: 'Chimi Yangzom',
    mother_cid: '10304002006',
    house_hold_no: 'PA-2024-002',
    house_no: 'H-205',
    dzongkhag_id: '2',
    dzongkhag_name: 'Paro',
    gewog_id: '2',
    gewog_name: 'Doteng',
    chiwog_id: '2',
    chiwog_name: 'Central Paro',
    village_id: '2',
    village_name: 'Paro Town',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '2',
    dzongkhag_of_death_name: 'Paro',
    gewog_of_death_id: '2',
    gewog_of_death_name: 'Doteng',
    village_of_death_id: '2',
    village_of_death_name: 'Paro Town',
    city_id: '2',
    city_name: 'Paro Municipality',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'ENDORSED',
    createdAt: '2024-02-26T14:45:00Z',
    updatedAt: '2024-02-27T10:30:00Z',
    remarks: 'Documents verified',
    assigned: false
  },
  {
    id: '6',
    deceased_cid: '10304002007',
    applicant_cid: '10304002008',
    first_name: 'Jigme',
    middle_name: 'Namgyel',
    last_name: 'Singye',
    date_of_birth: '1952-11-10',
    date_of_death: '2024-03-15',
    time_of_death: '16:45',
    place_of_death: 'Punakha Hospital',
    cause_of_death: 'Respiratory failure due to pneumonia',
    gender: 'Male',
    father_name: 'Karma Phuntsho',
    father_cid: '10304002008',
    mother_name: 'Dechen Wangmo',
    mother_cid: '10304002009',
    house_hold_no: 'PU-2024-003',
    house_no: 'H-312',
    dzongkhag_id: '3',
    dzongkhag_name: 'Punakha',
    gewog_id: '3',
    gewog_name: 'Guma',
    chiwog_id: '3',
    chiwog_name: 'Guma Central',
    village_id: '3',
    village_name: 'Khuruthang',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '3',
    dzongkhag_of_death_name: 'Punakha',
    gewog_of_death_id: '3',
    gewog_of_death_name: 'Guma',
    village_of_death_id: '3',
    village_of_death_name: 'Khuruthang',
    city_id: '3',
    city_name: 'Khuruthang Township',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'VERIFIED',
    createdAt: '2024-03-16T09:15:00Z',
    updatedAt: '2024-03-17T11:20:00Z',
    remarks: 'Field verification completed',
    assigned: false
  },
  {
    id: '7',
    deceased_cid: '10304002010',
    applicant_cid: '10304002011',
    first_name: 'Leki',
    middle_name: 'Pema',
    last_name: 'Dema',
    date_of_birth: '1968-03-28',
    date_of_death: '2024-04-10',
    time_of_death: '11:20',
    place_of_death: 'Wangdue Hospital',
    cause_of_death: 'Complications from diabetes',
    gender: 'Female',
    father_name: 'Penjor Wangdi',
    father_cid: '10304002011',
    mother_name: 'Tshering Yangzom',
    mother_cid: '10304002012',
    house_hold_no: 'WD-2024-004',
    house_no: 'H-418',
    dzongkhag_id: '4',
    dzongkhag_name: 'Wangdue Phodrang',
    gewog_id: '4',
    gewog_name: 'Athang',
    chiwog_id: '4',
    chiwog_name: 'Gasetsho',
    village_id: '4',
    village_name: 'Bajo Town',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '4',
    dzongkhag_of_death_name: 'Wangdue Phodrang',
    gewog_of_death_id: '4',
    gewog_of_death_name: 'Athang',
    village_of_death_id: '4',
    village_of_death_name: 'Bajo Town',
    city_id: '4',
    city_name: 'Bajo Township',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'APPROVED',
    createdAt: '2024-04-11T11:20:00Z',
    updatedAt: '2024-04-12T09:45:00Z',
    remarks: 'Approved by Registrar',
    assigned: false
  },
  {
    id: '8',
    deceased_cid: '10304002013',
    applicant_cid: '10304002014',
    first_name: 'Dorji',
    middle_name: 'Wangdi',
    last_name: 'Penjor',
    date_of_birth: '1945-07-18',
    date_of_death: '2024-05-18',
    time_of_death: '06:30',
    place_of_death: 'Bumthang Hospital',
    cause_of_death: 'Old age - Natural causes',
    gender: 'Male',
    father_name: 'Sonam Tshering',
    father_cid: '10304002014',
    mother_name: 'Yangzom Wangmo',
    mother_cid: '10304002015',
    house_hold_no: 'BT-2024-005',
    house_no: 'H-520',
    dzongkhag_id: '5',
    dzongkhag_name: 'Bumthang',
    gewog_id: '5',
    gewog_name: 'Ura',
    chiwog_id: '5',
    chiwog_name: 'Chamkhar',
    village_id: '5',
    village_name: 'Chamkhar Town',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '5',
    dzongkhag_of_death_name: 'Bumthang',
    gewog_of_death_id: '5',
    gewog_of_death_name: 'Ura',
    village_of_death_id: '5',
    village_of_death_name: 'Chamkhar Town',
    city_id: '5',
    city_name: 'Chamkhar Municipality',
    is_health_registered: false,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'SUBMITTED',
    createdAt: '2024-05-19T16:00:00Z',
    remarks: '',
    assigned: false
  },
  {
    id: '9',
    deceased_cid: '10304002016',
    applicant_cid: '10304002017',
    first_name: 'Choki',
    middle_name: 'Dema',
    last_name: 'Pemo',
    date_of_birth: '1985-12-05',
    date_of_death: '2024-06-22',
    time_of_death: '18:45',
    place_of_death: 'Trashigang Hospital',
    cause_of_death: 'Post-surgical complications',
    gender: 'Female',
    father_name: 'Karma Tshering',
    father_cid: '10304002017',
    mother_name: 'Leki Wangmo',
    mother_cid: '10304002018',
    house_hold_no: 'TG-2024-006',
    house_no: 'H-625',
    dzongkhag_id: '6',
    dzongkhag_name: 'Trashigang',
    gewog_id: '6',
    gewog_name: 'Bartsham',
    chiwog_id: '6',
    chiwog_name: 'Trashigang Central',
    village_id: '6',
    village_name: 'Trashigang Town',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '6',
    dzongkhag_of_death_name: 'Trashigang',
    gewog_of_death_id: '6',
    gewog_of_death_name: 'Bartsham',
    village_of_death_id: '6',
    village_of_death_name: 'Trashigang Town',
    city_id: '6',
    city_name: 'Trashigang Municipality',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'ENDORSED',
    createdAt: '2024-06-23T08:30:00Z',
    updatedAt: '2024-06-24T15:45:00Z',
    remarks: 'Endorsed by Local Authority',
    assigned: false
  },
  {
    id: '11',
    deceased_cid: '10304002022',
    applicant_cid: '10304002023',
    first_name: 'Pema',
    middle_name: 'Gyeltshen',
    last_name: 'Dorji',
    date_of_birth: '1955-04-30',
    date_of_death: '2024-08-05',
    time_of_death: '13:05',
    place_of_death: 'Mongar Hospital',
    cause_of_death: 'Stroke',
    gender: 'Male',
    father_name: 'Karma Phuntsho',
    father_cid: '10304002023',
    mother_name: 'Choki Dema',
    mother_cid: '10304002024',
    house_hold_no: 'MG-2024-008',
    house_no: 'H-840',
    dzongkhag_id: '8',
    dzongkhag_name: 'Mongar',
    gewog_id: '8',
    gewog_name: 'Mongar',
    chiwog_id: '8',
    chiwog_name: 'Mongar Central',
    village_id: '8',
    village_name: 'Mongar Town',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '8',
    dzongkhag_of_death_name: 'Mongar',
    gewog_of_death_id: '8',
    gewog_of_death_name: 'Mongar',
    village_of_death_id: '8',
    village_of_death_name: 'Mongar Town',
    city_id: '8',
    city_name: 'Mongar Municipality',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'APPROVED',
    createdAt: '2024-08-06T10:00:00Z',
    updatedAt: '2024-08-07T14:30:00Z',
    remarks: 'Certificate issued',
    assigned: false
  },
  {
    id: '12',
    deceased_cid: '10304002025',
    applicant_cid: '10304002026',
    first_name: 'Tashi',
    middle_name: 'Peljor',
    last_name: 'Dorji',
    date_of_birth: '1965-02-14',
    date_of_death: '2024-09-10',
    time_of_death: '08:20',
    place_of_death: 'Gelephu Hospital',
    cause_of_death: 'Liver disease',
    gender: 'Male',
    father_name: 'Ugyen Dorji',
    father_cid: '10304002026',
    mother_name: 'Kinley Dema',
    mother_cid: '10304002027',
    house_hold_no: 'SP-2024-009',
    house_no: 'H-945',
    dzongkhag_id: '9',
    dzongkhag_name: 'Sarpang',
    gewog_id: '9',
    gewog_name: 'Gelephu',
    chiwog_id: '9',
    chiwog_name: 'Gelephu Central',
    village_id: '9',
    village_name: 'Gelephu Town',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '9',
    dzongkhag_of_death_name: 'Sarpang',
    gewog_of_death_id: '9',
    gewog_of_death_name: 'Gelephu',
    village_of_death_id: '9',
    village_of_death_name: 'Gelephu Town',
    city_id: '9',
    city_name: 'Gelephu Thromde',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'ENDORSED',
    createdAt: '2024-09-11T11:30:00Z',
    updatedAt: '2024-09-12T09:15:00Z',
    remarks: 'Documents verified and endorsed',
    assigned: false
  },
  {
    id: '13',
    deceased_cid: '10304002030',
    applicant_cid: '10304002031',
    first_name: 'Sonam',
    middle_name: 'Phuntsho',
    last_name: 'Wangchuk',
    date_of_birth: '1960-07-18',
    date_of_death: '2025-02-20',
    time_of_death: '06:30',
    place_of_death: 'Trongsa Hospital',
    cause_of_death: 'Natural causes - organ failure',
    gender: 'Male',
    father_name: 'Ugyen Wangchuk',
    father_cid: '10304002030',
    mother_name: 'Deki Yangzom',
    mother_cid: '10304002032',
    house_hold_no: 'TG-2025-013',
    house_no: 'H-104',
    dzongkhag_id: '4',
    dzongkhag_name: 'Trongsa',
    gewog_id: '4',
    gewog_name: 'Trongsa',
    chiwog_id: '4',
    chiwog_name: 'Trongsa Central',
    village_id: '4',
    village_name: 'Trongsa Town',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '4',
    dzongkhag_of_death_name: 'Trongsa',
    gewog_of_death_id: '4',
    gewog_of_death_name: 'Trongsa',
    village_of_death_id: '4',
    village_of_death_name: 'Trongsa Town',
    city_id: '4',
    city_name: 'Trongsa Municipality',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'SUBMITTED',
    createdAt: '2025-02-21T09:00:00Z',
    remarks: 'New application - pending verification',
    assigned: false
  },
  {
    id: '14',
    deceased_cid: '10304002033',
    applicant_cid: '10304002034',
    first_name: 'Dawa',
    middle_name: 'Tshering',
    last_name: 'Gyeltshen',
    date_of_birth: '1948-05-10',
    date_of_death: '2025-03-12',
    time_of_death: '04:15',
    place_of_death: 'Wangdue Hospital',
    cause_of_death: 'Pneumonia - respiratory failure',
    gender: 'Male',
    father_name: 'Pema Dorji',
    father_cid: '10304002033',
    mother_name: 'Chimi Wangmo',
    mother_cid: '10304002035',
    house_hold_no: 'WP-2025-014',
    house_no: 'H-218',
    dzongkhag_id: '5',
    dzongkhag_name: 'Wangdue Phodrang',
    gewog_id: '5',
    gewog_name: 'Nishog',
    chiwog_id: '5',
    chiwog_name: 'Bajothang',
    village_id: '5',
    village_name: 'Bajothang',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '5',
    dzongkhag_of_death_name: 'Wangdue Phodrang',
    gewog_of_death_id: '5',
    gewog_of_death_name: 'Nishog',
    village_of_death_id: '5',
    village_of_death_name: 'Bajothang',
    city_id: '5',
    city_name: 'Bajothang Township',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'VERIFIED',
    createdAt: '2025-03-13T08:00:00Z',
    updatedAt: '2025-03-14T10:00:00Z',
    remarks: 'Documents verified by verifier',
    assigned: false
  },
  {
    id: '15',
    deceased_cid: '10304002036',
    applicant_cid: '10304002037',
    first_name: 'Karma',
    middle_name: 'Tenzin',
    last_name: 'Wangchuk',
    date_of_birth: '1962-11-03',
    date_of_death: '2025-04-05',
    time_of_death: '10:30',
    place_of_death: 'Bumthang Hospital',
    cause_of_death: 'Kidney failure',
    gender: 'Male',
    father_name: 'Tenzin Dorji',
    father_cid: '10304002037',
    mother_name: 'Pema Seldon',
    mother_cid: '10304002038',
    house_hold_no: 'BT-2025-015',
    house_no: 'H-305',
    dzongkhag_id: '10',
    dzongkhag_name: 'Bumthang',
    gewog_id: '10',
    gewog_name: 'Chhume',
    chiwog_id: '10',
    chiwog_name: 'Bumthang Central',
    village_id: '10',
    village_name: 'Jakar Town',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '10',
    dzongkhag_of_death_name: 'Bumthang',
    gewog_of_death_id: '10',
    gewog_of_death_name: 'Chhume',
    village_of_death_id: '10',
    village_of_death_name: 'Jakar Town',
    city_id: '10',
    city_name: 'Jakar Municipality',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'ENDORSED',
    createdAt: '2025-04-06T09:00:00Z',
    updatedAt: '2025-04-07T11:30:00Z',
    remarks: 'Endorsed by local authority',
    assigned: false
  },
  {
    id: '16',
    deceased_cid: '10304002039',
    applicant_cid: '10304002040',
    first_name: 'Tshering',
    middle_name: 'Namgay',
    last_name: 'Dorji',
    date_of_birth: '1958-06-17',
    date_of_death: '2025-01-10',
    time_of_death: '07:45',
    place_of_death: 'Haa Hospital',
    cause_of_death: 'Diabetes complications',
    gender: 'Male',
    father_name: 'Namgay Dorji',
    father_cid: '10304002040',
    mother_name: 'Dema Yangzom',
    mother_cid: '10304002041',
    house_hold_no: 'HA-2025-016',
    house_no: 'H-112',
    dzongkhag_id: '11',
    dzongkhag_name: 'Haa',
    gewog_id: '11',
    gewog_name: 'Haa',
    chiwog_id: '11',
    chiwog_name: 'Haa Central',
    village_id: '11',
    village_name: 'Haa Town',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '11',
    dzongkhag_of_death_name: 'Haa',
    gewog_of_death_id: '11',
    gewog_of_death_name: 'Haa',
    village_of_death_id: '11',
    village_of_death_name: 'Haa Town',
    city_id: '11',
    city_name: 'Haa Municipality',
    is_health_registered: true,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'ENDORSED',
    createdAt: '2025-01-11T08:00:00Z',
    updatedAt: '2025-01-12T10:00:00Z',
    remarks: 'Endorsed and assigned for approval',
    assigned: true
  },
  {
    id: '17',
    deceased_cid: '10304002042',
    applicant_cid: '10304002043',
    first_name: 'Ugyen',
    middle_name: 'Pelden',
    last_name: 'Zangmo',
    date_of_birth: '1970-09-25',
    date_of_death: '2025-02-14',
    time_of_death: '19:20',
    place_of_death: 'Lhuentse Hospital',
    cause_of_death: 'Hypertensive heart disease',
    gender: 'Female',
    father_name: 'Pelden Dorji',
    father_cid: '10304002043',
    mother_name: 'Choki Wangmo',
    mother_cid: '10304002044',
    house_hold_no: 'LH-2025-017',
    house_no: 'H-228',
    dzongkhag_id: '12',
    dzongkhag_name: 'Lhuentse',
    gewog_id: '12',
    gewog_name: 'Kurtoe',
    chiwog_id: '12',
    chiwog_name: 'Lhuentse Central',
    village_id: '12',
    village_name: 'Lhuentse Town',
    country_of_death_id: '1',
    country_of_death_name: 'Bhutan',
    dzongkhag_of_death_id: '12',
    dzongkhag_of_death_name: 'Lhuentse',
    gewog_of_death_id: '12',
    gewog_of_death_name: 'Kurtoe',
    village_of_death_id: '12',
    village_of_death_name: 'Lhuentse Town',
    city_id: '12',
    city_name: 'Lhuentse Municipality',
    is_health_registered: false,
    death_certificate_url: '/dummy_death_certificate_bhutan.pdf',
    status: 'ENDORSED',
    createdAt: '2025-02-15T09:30:00Z',
    updatedAt: '2025-02-16T14:00:00Z',
    remarks: 'Endorsed and assigned for approval',
    assigned: true
  }
];

// Global store to persist data across serverless function calls
const _deathStore = globalThis as any;
_deathStore.deathApplicationsData = [...originalDeathApplications];

// Working copy that can be modified
let dummyDeathApplications: typeof originalDeathApplications =
  _deathStore.deathApplicationsData;

export type DeathApplicationStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'ENDORSED'
  | 'VERIFIED'
  | 'APPROVED'
  | 'REJECTED';

export async function getUnassignedDeathApplications() {
  // Demo: Return only 2 ENDORSED applications, no VERIFIED applications
  const endorsed = dummyDeathApplications.filter(
    (app: any) => app.status === 'ENDORSED' && !app.assigned
  );
  // Return only first 3 endorsed applications
  const available = endorsed.slice(0, 3);
  return {
    success: true,
    data: available,
    total_count: available.length
  };
}

export async function getDeathApplicationsByStatus(
  status: DeathApplicationStatus
) {
  // Demo: Return dummy data
  const filtered = dummyDeathApplications.filter(
    (app) => app.status === status
  );
  return {
    success: true,
    data: filtered,
    total_count: filtered.length
  };
}

export async function getSubmittedDeathApplications() {
  // Demo: Return dummy data
  const submitted = dummyDeathApplications.filter(
    (app) => app.status === 'SUBMITTED'
  );
  return {
    success: true,
    data: submitted,
    total_count: submitted.length
  };
}

export async function getMyDeathTaskList() {
  // Demo: Return dummy data for approve list (ENDORSED applications - assigned for approval)
  const taskList = dummyDeathApplications.filter(
    (app) => app.status === 'ENDORSED' && app.assigned === true
  );
  return {
    success: true,
    data: taskList,
    total_count: taskList.length
  };
}

export async function getEndorsedDeathApplications() {
  // Demo: Return dummy data (VERIFIED status for endorse page)
  const endorsed = dummyDeathApplications.filter(
    (app) => app.status === 'VERIFIED'
  );
  return {
    success: true,
    data: endorsed,
    total_count: endorsed.length
  };
}

export async function getDeathApplicationById(id: string) {
  // Demo: Return dummy data
  const application = dummyDeathApplications.find((app) => app.id === id);
  if (application) {
    return { success: true, data: application };
  }
  return {
    success: false,
    error: 'Death application not found',
    data: null
  };
}

export async function getDeathRegistrations() {
  try {
    const headers = await instance();
    const url = `${API_URL}/death-registrations`;

    console.log('[getDeathRegistrations] Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store'
    });

    console.log('[getDeathRegistrations] Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to fetch death registrations';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      console.error('[getDeathRegistrations] API Error:', errorMessage);

      return {
        success: false,
        error: errorMessage,
        data: []
      };
    }

    const result = await response.json();
    console.log(
      '[getDeathRegistrations] Fetched successfully:',
      result.data?.length || 0
    );

    return {
      success: true,
      data: result.data || result || []
    };
  } catch (error) {
    console.error('[getDeathRegistrations] Unexpected error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      data: []
    };
  }
}

export async function rejectDeathApplication(id: string, remarks: string) {
  // Demo: Return success
  console.log(
    '[rejectDeathApplication] Demo: Rejecting application',
    id,
    remarks
  );
  return {
    success: true,
    data: { id, status: 'REJECTED', remarks }
  };
}

export async function updateDeathApplicationStatus(
  id: string,
  status: DeathApplicationStatus
) {
  // Demo: Actually update the dummy data so the entry disappears from its source page
  console.log(
    '[updateDeathApplicationStatus] Demo: Updating status',
    id,
    status
  );
  const idx = dummyDeathApplications.findIndex((app) => app.id === id);
  if (idx !== -1) {
    dummyDeathApplications[idx] = {
      ...dummyDeathApplications[idx],
      status,
      updatedAt: new Date().toISOString()
    };
  }
  return {
    success: true,
    data: { id, status }
  };
}

export async function assignDeathTask(applicationId: string) {
  // Demo: Mark application as assigned
  console.log('[assignDeathTask] Demo: Assigning task', applicationId);

  // Find and mark the application as assigned
  const application = dummyDeathApplications.find(
    (app: any) => app.id === applicationId
  );
  if (application) {
    application.assigned = true;
    console.log(
      '[assignDeathTask] Application marked as assigned:',
      applicationId
    );
  }

  return {
    success: true,
    data: { application_id: applicationId, assigned: true }
  };
}

export async function resetAssignedDeathApplications() {
  // Demo: Reset all assigned applications
  console.log('[resetAssignedDeathApplications] Resetting all assignments');

  // Reset all applications to unassigned
  dummyDeathApplications.forEach((app: any) => {
    app.assigned = false;
  });

  return {
    success: true,
    data: { message: 'All assignments reset' }
  };
}

export async function getDeathRegistrationById(id: string) {
  // Demo: Return dummy data (same as getDeathApplicationById)
  const application = dummyDeathApplications.find((app) => app.id === id);
  if (application) {
    return { success: true, data: application };
  }
  return {
    success: false,
    error: 'Death registration not found',
    data: null
  };
}

export async function resetDeathDemoData() {
  // Demo: Reset all dummy data back to original state
  const fresh = originalDeathApplications.map((a) => ({ ...a }));
  dummyDeathApplications.splice(0, dummyDeathApplications.length, ...fresh);
  (globalThis as any).deathApplicationsData = dummyDeathApplications;
  return { success: true };
}
