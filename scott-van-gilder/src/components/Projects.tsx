import React from 'react';
import Link from 'next/link';

const Projects: React.FC = () => {
  const projects = [
    {
      title: 'SVG LABS',
      description: 'A creative development studio focused on building beautiful and functional web applications.',
      link: 'http://svglabs.io/',
      external: true
    },
    {
      title: 'AWS DevOps',
      description: 'Working as a DevOps Engineer at Amazon Web Services, improving operations performance and application scalability.',
      link: 'https://aws.amazon.com/',
      external: true
    },
    {
      title: 'GitHub',
      description: 'Contributing to open-source projects and sharing code examples.',
      link: 'https://github.com/ScottyVG',
      external: true
    }
  ];

  return (
    <div id="projects" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Projects</h2>
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <Link 
                href={project.link}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                target={project.external ? "_blank" : undefined}
                rel={project.external ? "noopener noreferrer" : undefined}
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
