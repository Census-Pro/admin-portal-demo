'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { IconPrinter } from '@tabler/icons-react';
import Image from 'next/image';

export interface RelationshipCertificateData {
  refNo: string;
  date: string;
  applicantCid: string;
  applicantName: string;
  relation: string;
  relatedCid: string;
  relatedName: string;
  applicantPhotoUrl?: string | null;
  relatedPhotoUrl?: string | null;
}

interface RelationshipCertificatePreviewProps {
  data: RelationshipCertificateData;
}

/**
 * Positions estimated from the relationship certificate PDF layout (595 × 852 pt).
 * left%  = x / 595 * 100
 * top%   = y / 852 * 100  (y measured from top)
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

function PhotoBox({
  top,
  left,
  photoUrl,
  label
}: {
  top: string;
  left: string;
  photoUrl?: string | null;
  label: string;
}) {
  return (
    <div
      className="absolute flex items-center justify-center overflow-hidden border border-gray-400 text-center"
      style={{ top, left, width: '14%', height: '13%' }}
    >
      {photoUrl ? (
        <Image src={photoUrl} alt={label} fill className="object-cover" />
      ) : (
        <span className="px-1 text-[0.5em] leading-tight text-gray-500">
          Affix photo
        </span>
      )}
    </div>
  );
}

export function RelationshipCertificatePreview({
  data
}: RelationshipCertificatePreviewProps) {
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
          <title>Relationship Certificate</title>
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
            <img class="bg" src="${window.location.origin}/relationshipCertificate_page-0001.jpg" alt=""/>

            <span class="ov bold" style="top:21.5%;left:15.8%">${data.refNo}</span>
            <span class="ov" style="top:21.5%;left:67.5%">Date:&nbsp;&nbsp;${data.date}</span>

            <span class="ov bold ul" style="top:26.5%;left:34.5%">TO WHOM IT MAY CONCERN</span>

            <span class="ov" style="top:30.5%;left:15.8%">The Department of Civil Registration and Census, Ministry of Home Affairs hereby</span>
            <span class="ov" style="top:33.0%;left:15.8%">certifies the relationship of the following persons as per the record maintained in the Bhutan</span>
            <span class="ov" style="top:35.5%;left:15.8%">Civil Registration System as hereunder:</span>

            <span class="ov bold" style="top:40.5%;left:15.8%">Details of Applicant:</span>

            <span class="ov bold" style="top:45.0%;left:15.8%">CID No.</span>
            <span class="ov" style="top:45.0%;left:27.5%">:</span>
            <span class="ov" style="top:45.0%;left:29.5%">${data.applicantCid}</span>

            <span class="ov bold" style="top:49.5%;left:15.8%">Name</span>
            <span class="ov" style="top:49.5%;left:27.5%">:</span>
            <span class="ov" style="top:49.5%;left:29.5%">${data.applicantName}</span>

            <div class="photo-box" style="top:42.5%;left:63%;width:14%;height:13%">
              ${data.applicantPhotoUrl ? `<img src="${data.applicantPhotoUrl}" style="width:100%;height:100%;object-fit:cover;" alt="photo"/>` : 'Affix photo'}
            </div>

            <span class="ov bold" style="top:57.0%;left:15.8%">Relation of applicant with person below:</span>
            <span class="ov" style="top:57.0%;left:57.5%">${data.relation}</span>

            <span class="ov bold" style="top:63.5%;left:15.8%">CID No.</span>
            <span class="ov" style="top:63.5%;left:27.5%">:</span>
            <span class="ov" style="top:63.5%;left:29.5%">${data.relatedCid}</span>

            <span class="ov bold" style="top:68.0%;left:15.8%">Name</span>
            <span class="ov" style="top:68.0%;left:27.5%">:</span>
            <span class="ov" style="top:68.0%;left:29.5%">${data.relatedName}</span>

            <div class="photo-box" style="top:62.5%;left:63%;width:14%;height:13%">
              ${data.relatedPhotoUrl ? `<img src="${data.relatedPhotoUrl}" style="width:100%;height:100%;object-fit:cover;" alt="photo"/>` : 'Affix photo'}
            </div>

            <span class="ov bold" style="top:87.5%;left:35.5%">Seal &amp; Signature of Issuing Authority</span>
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

      {/* Certificate — blank template as background, data overlaid */}
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
          src="/relationshipCertificate_page-0001.jpg"
          alt="Certificate template"
          fill
          className="object-fill"
          priority
        />

        {/* ── Ref No & Date ── */}
        <Overlay top="21.5%" left="15.8%" bold>
          {data.refNo}
        </Overlay>
        <Overlay top="21.5%" left="67.5%">
          Date:&nbsp;&nbsp;{data.date}
        </Overlay>

        {/* ── Heading ── */}
        <Overlay top="26.5%" left="34.5%" bold underline>
          TO WHOM IT MAY CONCERN
        </Overlay>

        {/* ── Body text ── */}
        <Overlay top="30.5%" left="15.8%">
          The Department of Civil Registration and Census, Ministry of Home
          Affairs hereby
        </Overlay>
        <Overlay top="33.0%" left="15.8%">
          certifies the relationship of the following persons as per the record
          maintained in the Bhutan
        </Overlay>
        <Overlay top="35.5%" left="15.8%">
          Civil Registration System as hereunder:
        </Overlay>

        {/* ── Applicant section ── */}
        <Overlay top="40.5%" left="15.8%" bold>
          Details of Applicant:
        </Overlay>

        <Overlay top="45.0%" left="15.8%" bold>
          CID No.
        </Overlay>
        <Overlay top="45.0%" left="27.5%">
          :
        </Overlay>
        <Overlay top="45.0%" left="29.5%">
          {data.applicantCid}
        </Overlay>

        <Overlay top="49.5%" left="15.8%" bold>
          Name
        </Overlay>
        <Overlay top="49.5%" left="27.5%">
          :
        </Overlay>
        <Overlay top="49.5%" left="29.5%">
          {data.applicantName}
        </Overlay>

        {/* ── Applicant photo ── */}
        <PhotoBox
          top="42.5%"
          left="63%"
          photoUrl={data.applicantPhotoUrl}
          label="Applicant photo"
        />

        {/* ── Relation row ── */}
        <Overlay top="57.0%" left="15.8%" bold>
          Relation of applicant with person below:
        </Overlay>
        <Overlay top="57.0%" left="57.5%">
          {data.relation}
        </Overlay>

        {/* ── Related person section ── */}
        <Overlay top="63.5%" left="15.8%" bold>
          CID No.
        </Overlay>
        <Overlay top="63.5%" left="27.5%">
          :
        </Overlay>
        <Overlay top="63.5%" left="29.5%">
          {data.relatedCid}
        </Overlay>

        <Overlay top="68.0%" left="15.8%" bold>
          Name
        </Overlay>
        <Overlay top="68.0%" left="27.5%">
          :
        </Overlay>
        <Overlay top="68.0%" left="29.5%">
          {data.relatedName}
        </Overlay>

        {/* ── Related person photo ── */}
        <PhotoBox
          top="62.5%"
          left="63%"
          photoUrl={data.relatedPhotoUrl}
          label="Related person photo"
        />

        {/* ── Footer ── */}
        <Overlay top="87.5%" left="35.5%" bold>
          Seal &amp; Signature of Issuing Authority
        </Overlay>
      </div>
    </div>
  );
}
