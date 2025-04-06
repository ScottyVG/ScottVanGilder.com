'use client';

import React from 'react';

const About: React.FC = () => {
  return (
    <div id="about" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About Me</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300">
            I&apos;m a DevOps Architect at Amazon Web Services (AWS), focused on helping customers build and optimize their cloud infrastructure. 
            With a deep understanding of cloud-native technologies and automation, I help teams implement efficient, 
            scalable, and secure solutions.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            My expertise includes:
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-300">
            <li>Cloud Architecture and Infrastructure as Code</li>
            <li>CI/CD Pipeline Optimization</li>
            <li>Container Orchestration with Kubernetes</li>
            <li>Serverless Architecture Design</li>
            <li>Infrastructure Automation</li>
            <li>Cloud Security and Compliance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;