import { NextResponse } from 'next/server';

export async function GET() {
  const dummyData = [
    {
      id: 'TASK-2024-0001',
      application_id: 'BR-2024-0010',
      assigned_at: '2024-05-20T09:00:00Z',
      status: 'PENDING',
      birth_application: {
        id: 'BR-2024-0010',
        cid: '11000000010',
        child_name: 'Tandin Wangchuk',
        father_name: 'Karma Dorji',
        mother_name: 'Deki Yangzom',
        dob: '2024-05-19',
        gender: 'Male',
        birth_place: 'Thimphu Hospital',
        dzongkhag: 'Thimphu',
        gewog: 'Chang',
        chiwog: 'Babesa',
        status: 'SUBMITTED',
        submitted_at: '2024-05-20T08:30:00Z',
        remarks: null
      }
    },
    {
      id: 'TASK-2024-0002',
      application_id: 'BR-2024-0011',
      assigned_at: '2024-05-21T10:30:00Z',
      status: 'PENDING',
      birth_application: {
        id: 'BR-2024-0011',
        cid: '11000000011',
        child_name: 'Sonam Choden',
        father_name: 'Jigme Tshering',
        mother_name: 'Pema Lhamo',
        dob: '2024-05-20',
        gender: 'Female',
        birth_place: 'Paro Hospital',
        dzongkhag: 'Paro',
        gewog: 'Hungrel',
        chiwog: 'Doteng',
        status: 'ENDORSED',
        submitted_at: '2024-05-21T09:00:00Z',
        endorsed_at: '2024-05-21T11:00:00Z',
        remarks: null
      }
    },
    {
      id: 'TASK-2024-0003',
      application_id: 'BR-2024-0012',
      assigned_at: '2024-05-22T11:45:00Z',
      status: 'PENDING',
      birth_application: {
        id: 'BR-2024-0012',
        cid: '11000000012',
        child_name: 'Ugyen Dorji',
        father_name: 'Tshewang Norbu',
        mother_name: 'Chimi Dema',
        dob: '2024-05-21',
        gender: 'Male',
        birth_place: 'Punakha Hospital',
        dzongkhag: 'Punakha',
        gewog: 'Toebisa',
        chiwog: 'Menchuna',
        status: 'VERIFIED',
        submitted_at: '2024-05-22T10:00:00Z',
        endorsed_at: '2024-05-22T12:00:00Z',
        verified_at: '2024-05-22T13:30:00Z',
        remarks: null
      }
    }
  ];

  return NextResponse.json({
    success: true,
    data: dummyData,
    total_count: dummyData.length
  });
}
