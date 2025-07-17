'use client';

import { useEffect } from 'react';

export default function CodeEnhancer() {
  useEffect(() => {
    const addCopyButtons = () => {
      // Find all code blocks
      const codeBlocks = document.querySelectorAll('pre code');
      
      codeBlocks.forEach((codeElement) => {
        const preElement = codeElement.parentElement;
        if (!preElement || preElement.querySelector('.copy-button')) {
          return; // Skip if copy button already exists
        }

        // Create wrapper div
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group';
        preElement.parentNode?.insertBefore(wrapper, preElement);
        wrapper.appendChild(preElement);

        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button absolute top-3 right-3 z-10 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100';
        copyButton.innerHTML = `
          <svg class="w-4 h-4 copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <svg class="w-4 h-4 check-icon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        `;

        // Add click handler
        copyButton.addEventListener('click', async () => {
          const text = codeElement.textContent || '';
          
          try {
            await navigator.clipboard.writeText(text);
            
            // Show success state
            const copyIcon = copyButton.querySelector('.copy-icon');
            const checkIcon = copyButton.querySelector('.check-icon');
            
            copyIcon?.classList.add('hidden');
            checkIcon?.classList.remove('hidden');
            copyButton.title = 'Copied!';
            
            // Reset after 2 seconds
            setTimeout(() => {
              copyIcon?.classList.remove('hidden');
              checkIcon?.classList.add('hidden');
              copyButton.title = 'Copy code';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy text: ', err);
          }
        });

        copyButton.title = 'Copy code';
        wrapper.appendChild(copyButton);
      });
    };

    // Run after a short delay to ensure DOM is ready
    const timer = setTimeout(addCopyButtons, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}