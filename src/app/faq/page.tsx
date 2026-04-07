'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqData = [
  {
    id: 1,
    question: 'What is the National Civil Registration System?',
    answer:
      'The National Civil Registration System is a comprehensive platform for managing civil registration services including birth registration, death registration, and national ID (CID) issuance for citizens.'
  },
  {
    id: 2,
    question: 'How do I register a birth?',
    answer:
      "To register a birth, you need to visit the nearest civil registration office with the required documents including the birth notification form, parents' identification documents, and medical certificate if available. The registration process involves verification, endorsement, and approval stages."
  },
  {
    id: 3,
    question: 'What documents are required for death registration?',
    answer:
      "For death registration, you need the death notification form, deceased person's CID or identification document, medical certificate of death, and the informant's identification document."
  },
  {
    id: 4,
    question: 'How long does it take to get a CID card?',
    answer:
      'The CID card issuance process typically takes 3-5 working days after successful approval of the application. The timing may vary depending on the workload and verification requirements.'
  },
  {
    id: 5,
    question: 'Can I change my household head (HOH)?',
    answer:
      'Yes, you can request a change of household head through the HOH Change process. This requires proper documentation and approval from the civil registration authorities.'
  },
  {
    id: 6,
    question: 'What should I do if I lose my CID card?',
    answer:
      "If you lose your CID card, you should immediately report it to the nearest civil registration office and apply for a replacement. You'll need to provide identification documents and a police report if applicable."
  },
  {
    id: 7,
    question: 'How can I check the status of my application?',
    answer:
      'You can check the status of your application by visiting the civil registration office where you submitted it, or through the online portal if you have registered for online services.'
  },
  {
    id: 8,
    question: 'What is the process for late birth registration?',
    answer:
      "Late birth registration requires additional verification and documentation. You'll need to provide a valid reason for the delay, supporting documents, and may need to appear before an approving authority."
  },
  {
    id: 9,
    question: 'Are there any fees for civil registration services?',
    answer:
      'Basic civil registration services like birth and death registration are typically free. However, there may be nominal fees for replacement documents, certificates, and expedited services.'
  },
  {
    id: 10,
    question: 'How do I correct errors in my registration documents?',
    answer:
      'To correct errors in registration documents, you need to submit an application for correction with supporting documents proving the correct information. The process requires verification and approval.'
  }
];

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <HelpCircle className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Find answers to common questions about civil registration services,
            including birth and death registration, CID issuance, and more.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-gray-50"
              >
                <h3 className="pr-4 text-lg font-semibold text-gray-900">
                  {item.question}
                </h3>
                <div className="flex-shrink-0">
                  {expandedItems.includes(item.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>

              {expandedItems.includes(item.id) && (
                <div className="border-t border-gray-100 px-6 pb-4">
                  <p className="pt-4 leading-relaxed text-gray-700">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 rounded-lg bg-blue-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Still have questions?
          </h2>
          <p className="mb-6 text-gray-700">
            If you couldn't find the answer you're looking for, please contact
            our support team or visit your nearest civil registration office.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-700">
              Contact Support
            </button>
            <button className="rounded-lg border border-blue-600 bg-white px-6 py-3 text-blue-600 transition-colors duration-200 hover:bg-blue-50">
              Find Office Locations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
