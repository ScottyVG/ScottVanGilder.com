import React from 'react';

const About: React.FC = () => {
  return (
    <div id="about" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About</h2>
        <div className="prose prose-lg text-gray-600 dark:text-gray-300">
          <p>
            I'm a DevOps Engineer working at AWS, dedicated to improving operations performance, 
            increasing application scalability, and maintaining the highest security practices.
          </p>
          <p>
            With a strong foundation in both front-end and back-end development, I specialize in
            creating responsive, accessible, and performant web applications using technologies
            like React, Next.js, TypeScript, and Node.js.
          </p>
          <p>
            When I'm not coding, you can find me exploring new technologies, contributing to
            open-source projects, or sharing my knowledge with the developer community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;