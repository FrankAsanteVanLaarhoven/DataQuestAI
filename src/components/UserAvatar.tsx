'use client';

import React from 'react';

interface UserAvatarProps {
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar = '👩‍💻',
  size = 'md',
  className = '',
  alt = 'User avatar',
}) => {
  const isImage =
    typeof avatar === 'string' &&
    (avatar.startsWith('data:image') ||
      avatar.startsWith('http://') ||
      avatar.startsWith('https://') ||
      avatar.startsWith('blob:'));

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-7 h-7 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-16 h-16 text-3xl',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  if (isImage) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 ${currentSizeClass} ${className}`}
      >
        <img
          src={avatar}
          alt={alt}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // fallback to default emoji if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 ${currentSizeClass} ${className}`}
    >
      <span>{avatar}</span>
    </div>
  );
};
