import { NextResponse } from 'next/server';

export async function GET() {
  const dummyData = [
    {
      id: 'BR-2024-0004',
      cid: '11000000004',
      child_name: 'Deki Choden',
      father_name: 'Tshewang Dorji',
      mother_name: 'Sonam Pema',
      dob: '2024-04-05',
      gender: 'Female',
      birth_place: 'Wangdue Hospital',
      dzongkhag: 'Wangdue Phodrang',
      gewog: 'Rupisa',
      chiwog: 'Gasetshogom',
      status: 'ENDORSED',
      submitted_at: '2024-04-06T11:20:00Z',
      endorsed_at: '2024-04-07T15:30:00Z',
      endorsed_by: 'LG Officer 1',
      remarks: null
    },
    {
      id: 'BR-2024-0005',
      cid: '11000000005',
      child_name: 'Namgay Thinley',
      father_name: 'Karma Tshering',
      mother_name: 'Chimi Lhamo',
      dob: '2024-04-12',
      gender: 'Male',
      birth_place: 'Trashigang Hospital',
      dzongkhag: 'Trashigang',
      gewog: 'Kanglung',
      chiwog: 'Yonphula',
      status: 'ENDORSED',
      submitted_at: '2024-04-13T08:45:00Z',
      endorsed_at: '2024-04-14T10:00:00Z',
      endorsed_by: 'LG Officer 2',
      remarks: null
    },
    {
      id: 'BR-2024-0006',
      cid: '11000000006',
      child_name: 'Pema Dechen',
      father_name: 'Ugyen Wangchuk',
      mother_name: 'Kezang Wangmo',
      dob: '2024-04-18',
      gender: 'Female',
      birth_place: 'Mongar Hospital',
      dzongkhag: 'Mongar',
      gewog: 'Drametse',
      chiwog: 'Ngatshang',
      status: 'ENDORSED',
      submitted_at: '2024-04-19T13:00:00Z',
      endorsed_at: '2024-04-20T09:30:00Z',
      endorsed_by: 'LG Officer 3',
      remarks: null
    }
  ];

  return NextResponse.json({
    success: true,
    data: dummyData,
    total_count: dummyData.length
  });
}
