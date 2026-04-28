'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { IconPrinter } from '@tabler/icons-react';
import Image from 'next/image';

export interface CertificateData {
  refNo: string;
  date: string;
  name: string;
  cidNo: string;
  dob: string;
  sex: string;
  dzongkhag: string;
  gewog: string;
  village: string;
  householdNo: string;
  houseNo: string;
  thramNo: string;
  fatherName: string;
  fatherCid: string;
  motherName: string;
  motherCid: string;
  presentAddress: string;
  photoUrl?: string | null;
}

interface NationalityCertificatePreviewProps {
  data: CertificateData;
}

/**
 * All positions derived from PDF layout (595 x 852 pt).
 * left%  = x / 595 * 100
 * top%   = (852 − y1) / 852 * 100  (y1 = top of text box, PDF coords from bottom)
 */
function Overlay({
  top,
  left,
  children,
  bold = false,
  underline = false
}: {
  top: string;
  left: string;
  children: React.ReactNode;
  bold?: boolean;
  underline?: boolean;
}) {
  return (
    <span
      className={`absolute leading-none ${bold ? 'font-bold' : ''} ${underline ? 'underline' : ''}`}
      style={{ top, left, fontSize: '1.85cqw' }}
    >
      {children}
    </span>
  );
}

export function NationalityCertificatePreview({
  data
}: NationalityCertificatePreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Nationality Certificate</title>
          <meta charset="utf-8"/>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: white; }
            .cert-wrapper {
              position: relative;
              width: 794px;
              height: 1137px;
              font-family: Arial, sans-serif;
            }
            .cert-wrapper img.bg {
              position: absolute; inset: 0;
              width: 100%; height: 100%;
              object-fit: fill;
            }
            .ov {
              position: absolute;
              font-size: 11px;
              line-height: 1;
              color: #000;
              white-space: nowrap;
            }
            .bold { font-weight: bold; }
            .ul { text-decoration: underline; }
            .photo-box {
              position: absolute;
              border: 1px solid #555;
              display: flex; align-items: center; justify-content: center;
              font-size: 9px; text-align: center; color: #555; padding: 2px;
            }
            @media print {
              @page { margin: 0; size: A4; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="cert-wrapper">
            <img class="bg" src="${window.location.origin}/nationalCertificate_page-0001.jpg" alt=""/>

            <span class="ov bold" style="top:22.4%;left:16.97%">${data.refNo}</span>
            <span class="ov" style="top:22.3%;left:67.5%">Date:&nbsp;&nbsp;${data.date}</span>
            <span class="ov bold ul" style="top:26.9%;left:36.4%">TO WHOM IT MAY CONCERN</span>
            <span class="ov" style="top:30.5%;left:15.8%">This is to certify that the following person is &nbsp;recorded as &nbsp;<strong>Bhutanese Citizen</strong> as per the</span>
            <span class="ov" style="top:32.8%;left:15.8%">record maintained by the Department of Civil Registration and Census, Ministry of Home</span>
            <span class="ov" style="top:35.2%;left:15.8%">Affairs:</span>

            <span class="ov bold" style="top:40.1%;left:15.8%">Name</span>
            <span class="ov bold" style="top:42.4%;left:15.8%">CID No.</span>
            <span class="ov bold" style="top:44.8%;left:15.8%">DoB(dd/mm/yy)</span>
            <span class="ov bold" style="top:47.1%;left:15.8%">Sex</span>
            <span class="ov bold" style="top:49.4%;left:15.8%">Dzongkhag</span>
            <span class="ov bold" style="top:51.8%;left:15.8%">Gewog</span>
            <span class="ov bold" style="top:54.1%;left:15.8%">Village</span>
            <span class="ov bold" style="top:56.5%;left:15.8%">Household No.</span>
            <span class="ov bold" style="top:58.8%;left:15.8%">House No.</span>
            <span class="ov bold" style="top:61.1%;left:15.8%">Thram No.</span>
            <span class="ov bold" style="top:63.5%;left:15.8%">Father's Name</span>
            <span class="ov bold" style="top:65.9%;left:15.8%">CID No.</span>
            <span class="ov bold" style="top:68.2%;left:15.8%">Mother's Name</span>
            <span class="ov bold" style="top:70.6%;left:15.8%">CID No.</span>
            <span class="ov bold" style="top:72.9%;left:15.6%">Present Address</span>

            <span class="ov" style="top:40.1%;left:30.3%">:</span>
            <span class="ov" style="top:42.4%;left:30.3%">:</span>
            <span class="ov" style="top:44.8%;left:30.3%">:</span>
            <span class="ov" style="top:47.1%;left:30.3%">:</span>
            <span class="ov" style="top:49.4%;left:30.3%">:</span>
            <span class="ov" style="top:51.8%;left:30.3%">:</span>
            <span class="ov" style="top:54.1%;left:30.3%">:</span>
            <span class="ov" style="top:56.5%;left:30.3%">:</span>
            <span class="ov" style="top:58.8%;left:30.3%">:</span>
            <span class="ov" style="top:61.1%;left:30.3%">:</span>
            <span class="ov" style="top:63.5%;left:30.3%">:</span>
            <span class="ov" style="top:65.9%;left:30.3%">:</span>
            <span class="ov" style="top:68.2%;left:30.3%">:</span>
            <span class="ov" style="top:70.6%;left:30.3%">:</span>
            <span class="ov" style="top:72.9%;left:30.3%">:</span>

            <span class="ov" style="top:40.1%;left:31.9%">${data.name}</span>
            <span class="ov" style="top:42.4%;left:31.9%">${data.cidNo}</span>
            <span class="ov" style="top:44.8%;left:31.9%">${data.dob}</span>
            <span class="ov" style="top:47.1%;left:31.9%">${data.sex}</span>
            <span class="ov" style="top:49.4%;left:31.9%">${data.dzongkhag}</span>
            <span class="ov" style="top:51.8%;left:31.9%">${data.gewog}</span>
            <span class="ov" style="top:54.1%;left:31.9%">${data.village}</span>
            <span class="ov" style="top:56.5%;left:31.9%">${data.householdNo}</span>
            <span class="ov" style="top:58.8%;left:31.9%">${data.houseNo}</span>
            <span class="ov" style="top:61.1%;left:31.9%">${data.thramNo}</span>
            <span class="ov" style="top:63.5%;left:31.9%">${data.fatherName}</span>
            <span class="ov" style="top:65.9%;left:31.9%">${data.fatherCid}</span>
            <span class="ov" style="top:68.2%;left:31.9%">${data.motherName}</span>
            <span class="ov" style="top:70.6%;left:31.9%">${data.motherCid}</span>
            <span class="ov" style="top:72.9%;left:31.9%">${data.presentAddress}</span>

            <span class="ov bold" style="top:88.6%;left:42.5%">Seal and Signature of the Issuing Authority</span>

            <div class="photo-box" style="top:47.1%;left:65.5%;width:13%;height:11%">
              ${data.photoUrl ? `<img src="${data.photoUrl}" style="width:100%;height:100%;object-fit:cover;" alt="photo"/>` : 'Affix passport<br/>size photo'}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 600);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <IconPrinter className="mr-2 h-4 w-4" />
          Print Certificate
        </Button>
      </div>

      {/* Certificate — blank template image as background, data overlaid */}
      <div
        ref={printRef}
        className="relative mx-auto rounded border border-gray-300 font-sans text-black shadow-sm"
        style={{
          aspectRatio: '595 / 852',
          width: 'min(65%, 520px)',
          containerType: 'inline-size'
        }}
      >
        {/* Blank template background */}
        <Image
          src="/nationalCertificate_page-0001.jpg"
          alt="Certificate template"
          fill
          className="object-fill"
          priority
        />

        {/* ── Ref No & Date ── */}
        <Overlay top="22.4%" left="16.97%" bold>
          {data.refNo}
        </Overlay>
        <Overlay top="22.3%" left="67.5%">
          Date:&nbsp;&nbsp;{data.date}
        </Overlay>

        {/* ── Heading ── */}
        <Overlay top="26.9%" left="36.4%" bold underline>
          TO WHOM IT MAY CONCERN
        </Overlay>

        {/* ── Body text ── */}
        <Overlay top="30.5%" left="15.8%">
          {
            'This is to certify that the following person is \u00A0recorded as \u00A0'
          }
          <strong>Bhutanese Citizen</strong>
          {' as per the'}
        </Overlay>
        <Overlay top="32.8%" left="15.8%">
          record maintained by the Department of Civil Registration and Census,
          Ministry of Home
        </Overlay>
        <Overlay top="35.2%" left="15.8%">
          Affairs:
        </Overlay>

        {/* ── Labels ── */}
        <Overlay top="40.1%" left="15.8%" bold>
          Name
        </Overlay>
        <Overlay top="42.4%" left="15.8%" bold>
          CID No.
        </Overlay>
        <Overlay top="44.8%" left="15.8%" bold>
          DoB(dd/mm/yy)
        </Overlay>
        <Overlay top="47.1%" left="15.8%" bold>
          Sex
        </Overlay>
        <Overlay top="49.4%" left="15.8%" bold>
          Dzongkhag
        </Overlay>
        <Overlay top="51.8%" left="15.8%" bold>
          Gewog
        </Overlay>
        <Overlay top="54.1%" left="15.8%" bold>
          Village
        </Overlay>
        <Overlay top="56.5%" left="15.8%" bold>
          Household No.
        </Overlay>
        <Overlay top="58.8%" left="15.8%" bold>
          House No.
        </Overlay>
        <Overlay top="61.1%" left="15.8%" bold>
          Thram No.
        </Overlay>
        <Overlay top="63.5%" left="15.8%" bold>
          {"Father's Name"}
        </Overlay>
        <Overlay top="65.9%" left="15.8%" bold>
          CID No.
        </Overlay>
        <Overlay top="68.2%" left="15.8%" bold>
          {"Mother's Name"}
        </Overlay>
        <Overlay top="70.6%" left="15.8%" bold>
          CID No.
        </Overlay>
        <Overlay top="72.9%" left="15.6%" bold>
          Present Address
        </Overlay>

        {/* ── Colons ── */}
        {(
          [
            40.1, 42.4, 44.8, 47.1, 49.4, 51.8, 54.1, 56.5, 58.8, 61.1, 63.5,
            65.9, 68.2, 70.6, 72.9
          ] as const
        ).map((t) => (
          <Overlay key={t} top={`${t}%`} left="30.3%">
            :
          </Overlay>
        ))}

        {/* ── Values ── */}
        <Overlay top="40.1%" left="31.9%">
          {data.name}
        </Overlay>
        <Overlay top="42.4%" left="31.9%">
          {data.cidNo}
        </Overlay>
        <Overlay top="44.8%" left="31.9%">
          {data.dob}
        </Overlay>
        <Overlay top="47.1%" left="31.9%">
          {data.sex}
        </Overlay>
        <Overlay top="49.4%" left="31.9%">
          {data.dzongkhag}
        </Overlay>
        <Overlay top="51.8%" left="31.9%">
          {data.gewog}
        </Overlay>
        <Overlay top="54.1%" left="31.9%">
          {data.village}
        </Overlay>
        <Overlay top="56.5%" left="31.9%">
          {data.householdNo}
        </Overlay>
        <Overlay top="58.8%" left="31.9%">
          {data.houseNo}
        </Overlay>
        <Overlay top="61.1%" left="31.9%">
          {data.thramNo}
        </Overlay>
        <Overlay top="63.5%" left="31.9%">
          {data.fatherName}
        </Overlay>
        <Overlay top="65.9%" left="31.9%">
          {data.fatherCid}
        </Overlay>
        <Overlay top="68.2%" left="31.9%">
          {data.motherName}
        </Overlay>
        <Overlay top="70.6%" left="31.9%">
          {data.motherCid}
        </Overlay>
        <Overlay top="72.9%" left="31.9%">
          {data.presentAddress}
        </Overlay>

        {/* ── Passport photo box ── */}
        <div
          className="absolute flex items-center justify-center overflow-hidden border border-gray-400 text-center"
          style={{ top: '47.1%', left: '65.5%', width: '13%', height: '11%' }}
        >
          {data.photoUrl ? (
            <Image
              src={data.photoUrl}
              alt="Passport photo"
              fill
              className="object-cover"
            />
          ) : (
            <span className="px-1 text-[0.5em] leading-tight text-gray-500">
              Affix passport
              <br />
              size photo
            </span>
          )}
        </div>

        {/* ── Footer signature line ── */}
        <Overlay top="88.6%" left="42.5%" bold>
          Seal and Signature of the Issuing Authority
        </Overlay>
      </div>
    </div>
  );
}
