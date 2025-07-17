'use client';

import { useEffect } from 'react';

export function useCodeBlocks() {
  useEffect(() => {
    // Add copy buttons to all code blocks
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('pre.hljs, pre[class*="language-"]');
      
      codeBlocks.forEach((block) => {
        // Skip if copy button already exists
        if (block.parentElement?.querySelector('.copy-button')) {
          return;
        }

        // Create wrapper if it doesn't exist
        let wrapper = block.parentElement;
        if (!wrapper?.classList.contains('code-block-wrapper')) {
          wrapper = document.createElement('div');
          wrapper.className = 'code-block-wrapper relative group';
          block.parentNode?.insertBefore(wrapper, block);
          wrapper.appendChild(block);
        }

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
          const code = block.querySelector('code');
          const text = code?.textContent || block.textContent || '';
          
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

    // Run initially
    addCopyButtons();

    // Run when content changes (for dynamic content)
    const observer = new MutationObserver(addCopyButtons);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);
}