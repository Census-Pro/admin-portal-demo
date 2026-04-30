import { NextResponse } from 'next/server';

export async function GET() {
  const dummyData = [
    {
      id: 'BR-2024-0007',
      cid: '11000000007',
      child_name: 'Jigme Dorji',
      father_name: 'Tashi Phuntsho',
      mother_name: 'Yangzom Choden',
      dob: '2024-05-01',
      gender: 'Male',
      birth_place: 'Samtse Hospital',
      dzongkhag: 'Samtse',
      gewog: 'Dorokha',
      chiwog: 'Tading',
      status: 'VERIFIED',
      submitted_at: '2024-05-02T10:00:00Z',
      endorsed_at: '2024-05-03T14:00:00Z',
      verified_at: '2024-05-04T11:30:00Z',
      verified_by: 'Verifier 1',
      remarks: null
    },
    {
      id: 'BR-2024-0008',
      cid: '11000000008',
      child_name: 'Chimi Dema',
      father_name: 'Sonam Wangchuk',
      mother_name: 'Pema Yangzom',
      dob: '2024-05-08',
      gender: 'Female',
      birth_place: 'Sarpang Hospital',
      dzongkhag: 'Sarpang',
      gewog: 'Gelephu',
      chiwog: 'Sengor',
      status: 'VERIFIED',
      submitted_at: '2024-05-09T09:30:00Z',
      endorsed_at: '2024-05-10T13:00:00Z',
      verified_at: '2024-05-11T10:15:00Z',
      verified_by: 'Verifier 2',
      remarks: null
    },
    {
      id: 'BR-2024-0009',
      cid: '11000000009',
      child_name: 'Karma Wangchuk',
      father_name: 'Dorji Tshering',
      mother_name: 'Lhaki Wangmo',
      dob: '2024-05-15',
      gender: 'Male',
      birth_place: 'Zhemgang Hospital',
      dzongkhag: 'Zhemgang',
      gewog: 'Panbang',
      chiwog: 'Ngangla',
      status: 'VERIFIED',
      submitted_at: '2024-05-16T12:00:00Z',
      endorsed_at: '2024-05-17T15:30:00Z',
      verified_at: '2024-05-18T09:45:00Z',
      verified_by: 'Verifier 3',
      remarks: null
    }
  ];

  return NextResponse.json({
    success: true,
    data: dummyData,
    total_count: dummyData.length
  });
}
