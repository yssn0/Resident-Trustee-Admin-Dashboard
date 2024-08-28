// src/components/dashboard/DashboardContent.tsx 
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import FeatureCard from './FeatureCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardContent() {
  const { user, error, isLoading } = useUser();
  const [showTexts, setShowTexts] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const headerHeight = 56;
      const scrollTarget = window.innerHeight - headerHeight;
      const duration = 5000;
      const startPosition = window.pageYOffset;
      const distance = scrollTarget - startPosition;
      let startTime: number | null = null;
      let rafId: number | null = null;
  
      function easeInOutQuad(t: number, b: number, c: number, d: number) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }
  
      function animation(currentTime: number) {
        if (!isMountedRef.current) return;
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration && isMountedRef.current) {
          rafId = requestAnimationFrame(animation);
        }
      }
  
      rafId = requestAnimationFrame(animation);
  
      const handleUserScroll = () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };
  
      window.addEventListener('wheel', handleUserScroll, { passive: true });
      window.addEventListener('touchstart', handleUserScroll, { passive: true });
  
      return () => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        window.removeEventListener('wheel', handleUserScroll);
        window.removeEventListener('touchstart', handleUserScroll);
      };
    }, 1000);
  
    return () => clearTimeout(timer);
  }, []);
  

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const headerHeight = 56; // Adjust this value based on your actual header height
      setShowTexts(scrollPosition < headerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>{error.message}</div>;
  const features = [
    {
      title: 'Réclamations',
      description: 'Gérer et résoudre les plaintes des utilisateurs.',
      image: '/images/reclamations_card.jpg',
      link: '/reclamations'
    },
    {
      title: 'Utilisateurs',
      description: 'Voir et gérer vos utilisateurset et leurs informations.',
      image: '/images/users_card.png',
      link: '/users'
    },
    {
      title: 'Notifications',
      description: 'Envoyer et gérer les notifications pour vos utilisateurs.',
      image: '/images/notifications_card.jpg',
      link: '/notifications'
    },
    {
      title: 'Statistiques',
      description: 'Comprendre comment votre application est utilisée.',
      image: '/images/statistics_card.png',
      link: '/statistics'
    }
  ];
  
  return (
    <div 
      ref={contentRef}
      className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-200 to-yellow-50 px-4 md:px-10 lg:px-20 pt-24 pb-16"
    >
      <div className="max-w-[960px] mx-auto">
        <h1 className="animate-fade-in-down text-4xl md:text-5xl font-bold leading-tight mb-4">
          Bienvenue sur le{" "}
          <span className="text-blue-600">
            Dashboard d'Administration
          </span>
        </h1>
        <div className={`transition-all duration-500 ease-in-out ${showTexts ? 'opacity-100 max-h-[1000px] mb-12' : 'opacity-0 max-h-0 overflow-hidden mb-0'}`}>
          <p className="animate-fade-in text-xl md:text-2xl text-gray-700 font-light leading-relaxed mb-8">
            Votre site web d'administration Verve est prêt.
          </p>
          <p className="animate-fade-in text-lg md:text-xl text-gray-600 font-normal leading-relaxed">
            Voici un aperçu rapide de ce que vous pouvez faire :
          </p>
        </div>
        <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}  