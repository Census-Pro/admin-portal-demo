import { NextResponse } from 'next/server';

export async function GET() {
  const dummyData = [
    {
      id: 'BR-2024-0001',
      cid: '11000000001',
      child_name: 'Tashi Wangchuk',
      father_name: 'Dorji Wangchuk',
      mother_name: 'Pema Lhamo',
      dob: '2024-01-15',
      gender: 'Male',
      birth_place: 'Thimphu Hospital',
      dzongkhag: 'Thimphu',
      gewog: 'Motithang',
      chiwog: 'Changangkha',
      status: 'SUBMITTED',
      submitted_at: '2024-01-16T10:30:00Z',
      remarks: null
    },
    {
      id: 'BR-2024-0002',
      cid: '11000000002',
      child_name: 'Karma Yangden',
      father_name: 'Kinley Dorji',
      mother_name: 'Deki Wangmo',
      dob: '2024-02-20',
      gender: 'Female',
      birth_place: 'Paro Hospital',
      dzongkhag: 'Paro',
      gewog: 'Lamgong',
      chiwog: 'Shaba',
      status: 'SUBMITTED',
      submitted_at: '2024-02-21T14:45:00Z',
      remarks: null
    },
    {
      id: 'BR-2024-0003',
      cid: '11000000003',
      child_name: 'Sonam Tshering',
      father_name: 'Jigme Wangchuk',
      mother_name: 'Lhaki Dolma',
      dob: '2024-03-10',
      gender: 'Male',
      birth_place: 'Punakha Hospital',
      dzongkhag: 'Punakha',
      gewog: 'Toepisa',
      chiwog: 'Guma',
      status: 'SUBMITTED',
      submitted_at: '2024-03-11T09:15:00Z',
      remarks: null
    }
  ];

  return NextResponse.json({
    success: true,
    data: dummyData,
    total_count: dummyData.length
  });
}
