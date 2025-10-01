import React from 'react';
import { BiLoader } from 'react-icons/bi';

/**
 * A flexible loading spinner component.
 *
 * @param {object} props
 * @param {boolean} [props.fullScreen=false] - If true, the loader will cover the entire screen with a background.
 * @param {string} [props.size='text-4xl'] - A Tailwind CSS text-size utility (e.g., 'text-2xl', 'text-6xl') to control the icon's size.
 * @param {string} [props.className] - Additional CSS classes to apply to the container div for custom styling.
 */
const Loader = ({ fullScreen = false, size = 'text-4xl', className = '' }) => {
  // Combine base classes with conditional and custom classes
  const containerClasses = `
    flex justify-center items-center
    ${fullScreen ? 'h-screen w-full bg-gray-900' : ''}
    ${className}
  `;

  const iconClasses = `
    animate-spin text-orange-light
    ${size}
  `;

  return (
    <div className={containerClasses.trim()}>
      <BiLoader className={iconClasses.trim()} />
    </div>
  );
};

export default Loader;