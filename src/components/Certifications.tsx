'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Certification {
  id: string;
  name: string;
  imageUrl: string;
  issueDate: string;
  credentialUrl: string;
}

const Certifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        // Updated with actual certifications based on image names
        const mockCertifications: Certification[] = [
          {
            id: '1',
            name: 'AWS Certified Generative AI Developer - Professional',
            imageUrl: '/images/certifications/aws-certified-generative-ai-developer-professional.png',
            issueDate: 'December 22, 2025',
            credentialUrl: 'https://www.credly.com/badges/e1492b8c-aa6d-405c-ac08-010ce4e76921/public_url'
          },
          {
            id: '2',
            name: 'AWS Certified DevOps Engineer - Professional',
            imageUrl: '/images/certifications/aws-certified-devops-engineer-professional.png',
            issueDate: 'November 18, 2023',
            credentialUrl: 'https://www.credly.com/badges/38abe909-3849-4067-9891-ecb6c64f8d3d/public_url'
          },
          {
            id: '3',
            name: 'AWS Certified Data Engineer – Associate',
            imageUrl: '/images/certifications/aws-certified-data-engineer-associate.png',
            issueDate: 'January 9, 2026',
            credentialUrl: 'https://www.credly.com/badges/1baf6b83-d044-451c-bab6-90f1b31efa70/public_url'
          },
          {
            id: '4',
            name: 'AWS Certified Machine Learning Engineer - Associate',
            imageUrl: '/images/certifications/aws-certified-machine-learning-engineer-associate.png',
            issueDate: 'January 23, 2025',
            credentialUrl: 'https://www.credly.com/badges/ba1c63b5-f866-4200-83b3-f4fc99a47df5/public_url'
          },

          {
            id: '5',
            name: 'AWS Certified Solutions Architect - Associate',
            imageUrl: '/images/certifications/aws-certified-solutions-architect-associate.png',
            issueDate: 'October 10, 2021',
            credentialUrl: 'https://www.credly.com/badges/7d871eee-8ccb-471f-a704-fa64f547a621/public_url'
          },
          {
            id: '6',
            name: 'AWS Certified SysOps Administrator - Associate',
            imageUrl: '/images/certifications/aws-certified-sysops-administrator-associate.png',
            issueDate: 'December 18, 2022',
            credentialUrl: 'https://www.credly.com/badges/bfc4e26d-2424-4205-89f8-7996403e5fec/public_url'
          },
          {
            id: '7',
            name: 'AWS Certified Developer - Associate',
            imageUrl: '/images/certifications/aws-certified-developer-associate.png',
            issueDate: 'November 18, 2020',
            credentialUrl: 'https://www.credly.com/badges/a2915829-9292-4ae1-aa9c-27c6a9ab3713/public_url'
          },
          {
            id: '8',
            name: 'AWS Certified Cloud Practitioner',
            imageUrl: '/images/certifications/aws-certified-cloud-practitioner.png',
            issueDate: 'September 27, 2019',
            credentialUrl: 'https://www.credly.com/badges/9448c693-8768-4edc-904d-ca9dffb3a864/public_url'
          },
          {
            id: '9',
            name: 'AWS Certified AI Practitioner',
            imageUrl: '/images/certifications/aws-certified-ai-practitioner.png',
            issueDate: 'December 20, 2024',
            credentialUrl: 'https://www.credly.com/badges/ce48c822-49cf-4c9e-a1fe-c6c1d8e76b13/public_url'
          },
        ];
        
        setCertifications(mockCertifications);
        setLoading(false);
      } catch {
        setError('Failed to load certifications');
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  if (loading) {
    return (
      <div id="certifications" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Certifications</h2>
          <p className="text-gray-600 dark:text-gray-300">Loading certifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="certifications" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Certifications</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="certifications" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 relative mb-4">
                  <Image
                    src={cert.imageUrl}
                    alt={cert.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                  {cert.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Issued: {new Date(cert.issueDate).toLocaleDateString()}
                </p>
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Credential
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a
            href="https://www.credly.com/users/scott-van-gilder"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all certifications on Credly →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Certifications; 
